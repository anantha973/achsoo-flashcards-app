import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  INITIAL_CARDS,
  type ReviewLogEntry,
  type VocabCard,
  validateAndNormalizeContentCards,
} from '../../data/vocabData';
import {
  idbGetAllReviewLogs,
  resetIdbConnectionForTests,
} from '../idbStorage';
import {
  CONFIDENCE_LOOP_CONFIG,
  applyLoopRating,
  computeConfidenceMasteryPct,
  computeDeckLoopProgressPct,
  computeLoopGap,
  createInitialDeckLoopState,
  deterministicHash,
  getCurrentLoopCardId,
  getDeckSessionKey,
  getSrsStateKey,
  parseSrsStateKey,
  replayDeckLoopSession,
} from '../confidenceLoopEngine';
import {
  appendRatingEvent,
  computeNextSrsState,
  createDefaultSrsState,
  deriveStudyStatsFromLogs,
  formatConfidenceBadge,
  getCardSrsForDirection,
  getLocalDateString,
  hydrateEngineFromIndexedDB,
  isCardLowConfidence,
  isCardNew,
  loadReviewLogs,
  loadSrsMap,
  loadStudyStats,
  mergeReviewLogsFromDevices,
  migrateLegacyReviewLogs,
  replayAllStatesFromLogs,
  replayCardStateFromLogs,
  resetAllSrsProgress,
  resetCardsSrsProgress,
  undoLastReview,
} from '../srsEngine';

// Minimal in-memory localStorage polyfill for Node/Vitest environment
const localStoreData = new Map<string, string>();
if (typeof globalThis.localStorage === 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => localStoreData.get(key) ?? null,
      setItem: (key: string, val: string) => {
        localStoreData.set(key, String(val));
      },
      removeItem: (key: string) => {
        localStoreData.delete(key);
      },
      clear: () => {
        localStoreData.clear();
      },
    },
    writable: true,
  });
}

describe('Achsoo 1-5 Confidence Virtual-Clock Loop & Review Log Engine', () => {
  beforeEach(() => {
    localStoreData.clear();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    resetIdbConnectionForTests();
    resetAllSrsProgress(INITIAL_CARDS);
  });

  it('T-01: Rating a new card 1-5 updates confidence without calendar-day wait times and logs deckId & reviewIndex', () => {
    const now = new Date('2026-11-16T10:00:00.000Z');
    const initialMap = loadSrsMap(INITIAL_CARDS);

    const res = appendRatingEvent({
      cardId: 'v-ankommen',
      rating: '4',
      deckId: 'verb',
      srsMap: initialMap,
      now,
      durationMs: 4200,
    });

    expect(res.nextState.confidence).toBe(4);
    expect(res.nextState.consecutiveHighCount).toBe(1);
    expect(res.nextState.intervalMinutes).toBe(0);
    expect(res.nextState.scheduledDays).toBe(0);
    expect(res.nextState.reviewCount).toBe(1);
    expect(formatConfidenceBadge(res.nextState)).toBe('Stufe 4/5');
    expect(formatConfidenceBadge(createDefaultSrsState('fresh'))).toBe('Neu');

    expect(res.allLogs).toHaveLength(1);
    expect(res.logEntry.cardId).toBe('v-ankommen');
    expect(res.logEntry.rating).toBe('4');
    expect(res.logEntry.deckId).toBe('verb');
    expect(res.logEntry.reviewIndex).toBe(0);
    expect(res.logEntry.durationMs).toBe(4200);

    expect(res.updatedStats.totalReviewsToday).toBe(1);
    expect(res.updatedStats.streakDays).toBe(1);
  });

  it('T-02: Deterministic virtual-clock gap table, multipliers, and compact-deck scaling match spec without RNG', () => {
    for (let rc = 1; rc <= 12; rc += 1) {
      const g1 = computeLoopGap('c-test', rc, 1, 0, 0);
      expect(g1).toBeGreaterThanOrEqual(2);
      expect(g1).toBeLessThanOrEqual(3);

      const g2 = computeLoopGap('c-test', rc, 2, 0, 0);
      expect(g2).toBeGreaterThanOrEqual(4);
      expect(g2).toBeLessThanOrEqual(5);

      const g3 = computeLoopGap('c-test', rc, 3, 0, 0);
      expect(g3).toBeGreaterThanOrEqual(6);
      expect(g3).toBeLessThanOrEqual(9);

      const g4First = computeLoopGap('c-test', rc, 4, 1, 0);
      expect(g4First).toBeGreaterThanOrEqual(9);
      expect(g4First).toBeLessThanOrEqual(14);
      const g4Second = computeLoopGap('c-test', rc, 4, 2, 0);
      expect(g4Second).toBe(Math.round(g4First * 1.5));

      const g5First = computeLoopGap('c-test', rc, 5, 1, 1);
      expect(g5First).toBeGreaterThanOrEqual(14);
      expect(g5First).toBeLessThanOrEqual(22);
      const g5Second = computeLoopGap('c-test', rc, 5, 2, 2);
      expect(g5Second).toBe(Math.round(g5First * 1.4));

      // Compact-deck soft-cap prevents rating 4/5 from piling up past deck length
      const g5Compact = computeLoopGap('c-test', rc, 5, 1, 1, CONFIDENCE_LOOP_CONFIG, 12);
      expect(g5Compact).toBeLessThanOrEqual(Math.max(6, Math.round(12 * 0.75)));
      expect(g5Compact).toBeGreaterThanOrEqual(2);
    }

    // Identical inputs always yield identical gap & hash across runs/devices
    expect(computeLoopGap('v-ankommen', 3, 4, 1, 0)).toBe(
      computeLoopGap('v-ankommen', 3, 4, 1, 0)
    );
  });

  it('T-03: Card rated 1 comes back 2-3 reviews later; min gap prevents back-to-back repeats unless pool size is 1', () => {
    const ids = Array.from({ length: 12 }, (_, i) => `c-${i}`);
    let state = createInitialDeckLoopState('test-loop', ids, {});

    // Rate first card 'c-0' as 1
    const firstId = getCurrentLoopCardId(state)!;
    expect(firstId).toBe('c-0');
    const expectedGap = computeLoopGap('c-0', 1, 1, 0, 0);
    state = applyLoopRating(state, firstId, '1');

    // Next 2 or 3 cards shown are new cards from waitingQueue, NOT 'c-0'
    let reviewsUntilC0Returns = 0;
    while (reviewsUntilC0Returns < 6) {
      const nextId = getCurrentLoopCardId(state)!;
      if (nextId === 'c-0') break;
      reviewsUntilC0Returns += 1;
      state = applyLoopRating(state, nextId, '4');
    }

    expect(reviewsUntilC0Returns).toBeGreaterThanOrEqual(2);
    expect(reviewsUntilC0Returns).toBeLessThanOrEqual(expectedGap);

    // Small 1-card deck repeats only when it's the sole active card
    let single = createInitialDeckLoopState('tiny-1', ['only-1'], {});
    expect(getCurrentLoopCardId(single)).toBe('only-1');
    single = applyLoopRating(single, 'only-1', '1');
    expect(getCurrentLoopCardId(single)).toBe('only-1');

    // 2-card deck never repeats back-to-back while both are active
    let pair = createInitialDeckLoopState('tiny-2', ['a', 'b'], {});
    expect(getCurrentLoopCardId(pair)).toBe('a');
    pair = applyLoopRating(pair, 'a', '1');
    expect(getCurrentLoopCardId(pair)).toBe('b');
  });

  it('T-04: Working set cap (10) & new-card gate hold back unseen cards on repeated 1s and cap pool at 10 on rating 3', () => {
    const ids = Array.from({ length: 30 }, (_, i) => `card-${i}`);
    let strugglingState = createInitialDeckLoopState('capped-1s', ids, {});

    // Initially admits 1 card into activePool
    expect(strugglingState.activePool).toHaveLength(1);
    expect(strugglingState.waitingQueue).toHaveLength(29);

    // Repeated 1s keep returning every 2-3 reviews, so the gate holds back the remaining deck
    for (let step = 0; step < 20; step += 1) {
      const current = getCurrentLoopCardId(strugglingState)!;
      strugglingState = applyLoopRating(strugglingState, current, '1');
      expect(strugglingState.activePool.length).toBeLessThanOrEqual(4);
    }

    // With moderate confidence (rating 3 -> gap 6-9), unsettled pool expands gracefully within workingSetCap (10)
    let expandingState = createInitialDeckLoopState('capped-3s', ids, {});
    for (let step = 0; step < 25; step += 1) {
      const current = getCurrentLoopCardId(expandingState)!;
      expandingState = applyLoopRating(expandingState, current, '3');
      expect(expandingState.activePool.length).toBeLessThanOrEqual(
        CONFIDENCE_LOOP_CONFIG.workingSetCap
      );
    }

    expect(expandingState.activePool.length).toBeGreaterThanOrEqual(7);
    expect(expandingState.activePool.length).toBeLessThanOrEqual(
      CONFIDENCE_LOOP_CONFIG.workingSetCap
    );

    // With higher confidence (rating 4 -> gap 9-14), pool reaches workingSetCap (10) and holds there
    let highExpandingState = createInitialDeckLoopState('capped-4s', ids, {});
    for (let step = 0; step < 10; step += 1) {
      const current = getCurrentLoopCardId(highExpandingState)!;
      highExpandingState = applyLoopRating(highExpandingState, current, '4');
      expect(highExpandingState.activePool.length).toBeLessThanOrEqual(
        CONFIDENCE_LOOP_CONFIG.workingSetCap
      );
    }
    expect(highExpandingState.activePool.length).toBe(
      CONFIDENCE_LOOP_CONFIG.workingSetCap
    );
    expect(
      highExpandingState.activePool.length +
        highExpandingState.clearedIds.length +
        highExpandingState.waitingQueue.length
    ).toBe(30);
  });

  it('T-05: Two consecutive >=4 clears loop -> Smart Final Check -> in-place miss re-insertion -> Done -> Reopen Refresh', () => {
    const ids = ['a', 'b', 'c', 'd'];
    let state = createInitialDeckLoopState('deck-sweep', ids, {});

    // First 4 is not cleared yet; second consecutive 4 clears each card
    let guard = 0;
    while (state.phase === 'loop' && guard < 40) {
      guard += 1;
      const cid = getCurrentLoopCardId(state)!;
      state = applyLoopRating(state, cid, '4');
    }

    expect(state.phase).toBe('sweep');
    expect(state.clearedIds).toHaveLength(4);
    expect(state.sweepQueue.length).toBeGreaterThanOrEqual(1);
    expect(state.sweepQueue.length).toBeLessThanOrEqual(
      CONFIDENCE_LOOP_CONFIG.recentClearedCheckCount
    );

    // Fail the first Final Check card with rating 2 -> stays in 'sweep' and re-inserts in-place without back-to-back repeat
    const missedSweepCard = getCurrentLoopCardId(state)!;
    state = applyLoopRating(state, missedSweepCard, '2');
    expect(state.phase).toBe('sweep');
    expect(state.sweepQueue).toContain(missedSweepCard);
    expect(getCurrentLoopCardId(state)).not.toBe(missedSweepCard);

    // Finish Final Check with rating 5
    guard = 0;
    while (state.phase !== 'done' && guard < 30) {
      guard += 1;
      const cid = getCurrentLoopCardId(state)!;
      state = applyLoopRating(state, cid, '5');
    }

    expect(state.phase).toBe('done');
    expect(state.clearedIds).toHaveLength(4);
    expect(state.sweepPassedIds.length).toBeGreaterThanOrEqual(1);
    expect(getCurrentLoopCardId(state)).toBeNull();

    // Reopening a deck: cards with <2 consecutive >=4 stay in loop; cards with >=2 consecutive >=4 start cleared
    const persisted = {
      a: computeNextSrsState(createDefaultSrsState('a'), '2'),
      b: computeNextSrsState(computeNextSrsState(createDefaultSrsState('b'), '4'), '4'),
      c: computeNextSrsState(computeNextSrsState(createDefaultSrsState('c'), '5'), '5'),
      d: createDefaultSrsState('d'),
    };
    const reopened = createInitialDeckLoopState('deck-reopen', ids, persisted);
    expect(reopened.phase).toBe('loop');
    expect(reopened.clearedIds).toEqual(['b', 'c']);
    expect([...reopened.activePool, ...reopened.waitingQueue]).toEqual(['a', 'd']);

    // A single 4/5 without a 2nd consecutive hit still waits in the loop on reopen
    const singleHitReopened = createInitialDeckLoopState('deck-single-hit', ['b1'], {
      b1: computeNextSrsState(createDefaultSrsState('b1'), '5'),
    });
    expect(singleHitReopened.phase).toBe('loop');
    expect(singleHitReopened.clearedIds).toEqual([]);

    // When all cards already have >=2 consecutive >=4, reopening starts a capped Reopened Refresh
    const allHighReopened = createInitialDeckLoopState('deck-all-high', ['b', 'c'], persisted);
    expect(allHighReopened.phase).toBe('sweep');
    expect(allHighReopened.isReopenedRefresh).toBe(true);
    expect(allHighReopened.sweepQueue).toHaveLength(2);
  });

  it('T-06: Pure log replay (cardId, rating, reviewIndex) produces identical loop state with zero RNG', () => {
    const ids = ['k1', 'k2', 'k3', 'k4', 'k5', 'k6'];
    const seq: Array<'1' | '2' | '3' | '4' | '5'> = ['1', '4', '2', '5', '4', '4', '3', '5', '4', '5'];

    let liveState = createInitialDeckLoopState('replay-deck', ids, {});
    const logs: Pick<ReviewLogEntry, 'cardId' | 'rating' | 'reviewIndex' | 'timestamp' | 'eventType'>[] = [];

    for (let idx = 0; idx < seq.length; idx += 1) {
      const cardId = getCurrentLoopCardId(liveState);
      if (!cardId) break;
      const rating = seq[idx];
      liveState = applyLoopRating(liveState, cardId, rating);
      logs.push({
        cardId,
        rating,
        reviewIndex: idx,
        timestamp: new Date(1700000000000 + idx * 1000).toISOString(),
        eventType: 'review',
      });
    }

    // Shuffle log order like out-of-order device sync and replay purely by reviewIndex
    const shuffledLogs = [...logs].reverse();
    const replayed = replayDeckLoopSession('replay-deck', ids, {}, shuffledLogs);
    expect(replayed).toEqual(liveState);
  });

  it('T-07: Legacy 4-button migration maps again/hard/good/easy -> 1/2/4/5 and takes ONLY last rating per card', () => {
    const rawLegacyLogs: ReviewLogEntry[] = [
      {
        id: 'leg-1',
        cardId: 'v-ankommen',
        timestamp: '2026-11-10T10:00:00.000Z',
        reviewedAt: '2026-11-10T10:00:00.000Z',
        studyDayKey: '2026-11-10',
        rating: 'again' as unknown as ReviewLogEntry['rating'],
        stateBefore: 'new',
        stateAfter: 'learning',
        dueBefore: new Date(0).toISOString(),
        dueAfter: '2026-11-10T10:01:00.000Z',
        intervalMinutesBefore: 0,
        intervalMinutesAfter: 1,
        stabilityAfter: 0,
        difficultyAfter: 0,
        durationMs: 1200,
        deviceId: 'dev-1',
        syncedAt: null,
      },
      {
        id: 'leg-2',
        cardId: 'v-ankommen',
        timestamp: '2026-11-11T10:00:00.000Z',
        reviewedAt: '2026-11-11T10:00:00.000Z',
        studyDayKey: '2026-11-11',
        rating: 'good' as unknown as ReviewLogEntry['rating'],
        stateBefore: 'learning',
        stateAfter: 'review',
        dueBefore: '2026-11-10T10:01:00.000Z',
        dueAfter: '2026-11-14T10:00:00.000Z',
        intervalMinutesBefore: 1,
        intervalMinutesAfter: 4320,
        stabilityAfter: 0,
        difficultyAfter: 0,
        durationMs: 1500,
        deviceId: 'dev-1',
        syncedAt: null,
      },
      {
        id: 'leg-3',
        cardId: 'v-sprechen',
        timestamp: '2026-11-11T11:00:00.000Z',
        reviewedAt: '2026-11-11T11:00:00.000Z',
        studyDayKey: '2026-11-11',
        rating: 'hard' as unknown as ReviewLogEntry['rating'],
        stateBefore: 'new',
        stateAfter: 'learning',
        dueBefore: new Date(0).toISOString(),
        dueAfter: '2026-11-11T11:06:00.000Z',
        intervalMinutesBefore: 0,
        intervalMinutesAfter: 6,
        stabilityAfter: 0,
        difficultyAfter: 0,
        durationMs: 1800,
        deviceId: 'dev-1',
        syncedAt: null,
      },
      {
        id: 'leg-4',
        cardId: 'n-bahnhof',
        timestamp: '2026-11-11T12:00:00.000Z',
        reviewedAt: '2026-11-11T12:00:00.000Z',
        studyDayKey: '2026-11-11',
        rating: 'easy' as unknown as ReviewLogEntry['rating'],
        stateBefore: 'new',
        stateAfter: 'review',
        dueBefore: new Date(0).toISOString(),
        dueAfter: '2026-11-19T12:00:00.000Z',
        intervalMinutesBefore: 0,
        intervalMinutesAfter: 11520,
        stabilityAfter: 0,
        difficultyAfter: 0,
        durationMs: 900,
        deviceId: 'dev-1',
        syncedAt: null,
      },
    ];

    const migrated = migrateLegacyReviewLogs(rawLegacyLogs);
    // Only 3 entries remain: leg-1 for v-ankommen was superseded by leg-2!
    expect(migrated.map((m) => m.id)).toEqual(['leg-2', 'leg-3', 'leg-4']);
    expect(migrated.map((m) => m.rating)).toEqual(['4', '2', '5']);

    const replayedMap = replayAllStatesFromLogs(INITIAL_CARDS, migrated);
    expect(replayedMap['v-ankommen'].confidence).toBe(4);
    expect(replayedMap['v-ankommen'].reviewCount).toBe(1);
    expect(replayedMap['v-sprechen'].confidence).toBe(2);
    expect(isCardLowConfidence(replayedMap['v-sprechen'])).toBe(true);
    expect(replayedMap['n-bahnhof'].confidence).toBe(5);
  });

  it('T-08: Mastery % formula, 04:00 rollover, streak reset, undo, IDB hydration, and deck reset preserve invariants', async () => {
    // Mastery % = round(sum(confidence) / (5 * N) * 100)
    const sampleMap = {
      a: computeNextSrsState(createDefaultSrsState('a'), '5'),
      b: computeNextSrsState(createDefaultSrsState('b'), '3'),
      c: createDefaultSrsState('c'),
    };
    expect(computeConfidenceMasteryPct(['a', 'b', 'c'], sampleMap)).toBe(
      Math.round(((5 + 3 + 0) / 15) * 100)
    );

    // 04:00 rollover
    const beforeRollover = new Date(2026, 10, 16, 3, 30, 0);
    const afterRollover = new Date(2026, 10, 16, 4, 5, 0);
    expect(getLocalDateString(beforeRollover)).toBe('2026-11-15');
    expect(getLocalDateString(afterRollover)).toBe('2026-11-16');

    const map0 = loadSrsMap(INITIAL_CARDS);
    const r1 = appendRatingEvent({
      cardId: 'v-ankommen',
      rating: '4',
      srsMap: map0,
      now: beforeRollover,
      durationMs: 2000,
    });
    const r2 = appendRatingEvent({
      cardId: 'v-sprechen',
      rating: '5',
      srsMap: r1.updatedMap,
      now: afterRollover,
      durationMs: 1800,
    });
    expect(r2.updatedStats.streakDays).toBe(2);

    // Undo appends marker instead of deleting history
    const undone = undoLastReview(INITIAL_CARDS, r2.updatedMap, afterRollover);
    expect(undone.undoMarkerEntry?.eventType).toBe('undo');
    expect(undone.remainingLogs).toHaveLength(1);
    expect(isCardNew(undone.updatedMap['v-sprechen'])).toBe(true);

    // IDB hydration & replay
    const idbLogs = await idbGetAllReviewLogs();
    expect(idbLogs.length).toBeGreaterThanOrEqual(2);
    const hydrated = await hydrateEngineFromIndexedDB(INITIAL_CARDS);
    expect(hydrated.srsMap['v-ankommen'].confidence).toBe(4);

    // Fresh start deck reset clears card confidence while keeping user lifetime stats
    const resetRes = resetCardsSrsProgress(['v-ankommen'], hydrated.srsMap, afterRollover);
    expect(isCardNew(resetRes.updatedMap['v-ankommen'])).toBe(true);
    expect(resetRes.updatedStats.totalTimeStudiedMs).toBeGreaterThanOrEqual(2000);

    // Duplicate card ID check remains enforced
    const dupes: VocabCard[] = [INITIAL_CARDS[0], INITIAL_CARDS[0]];
    expect(() => validateAndNormalizeContentCards(dupes)).toThrowError(/duplicate card IDs/);
  });

  it('T-09: Multi-device union merge + Realistic Forgetting Learner Simulator (80-card deck)', () => {
    const logA: ReviewLogEntry = {
      id: 'aaaa1111-1111-4111-8111-111111111111',
      cardId: 'v-teilnehmen',
      reviewIndex: 0,
      deckId: 'verb',
      timestamp: '2026-11-15T14:00:00.000Z',
      reviewedAt: '2026-11-15T14:00:00.000Z',
      studyDayKey: '2026-11-15',
      rating: '3',
      stateBefore: 'new',
      stateAfter: 'learning',
      dueBefore: new Date(0).toISOString(),
      dueAfter: '2026-11-15T14:00:00.000Z',
      intervalMinutesBefore: 0,
      intervalMinutesAfter: 0,
      stabilityAfter: 3,
      difficultyAfter: 3,
      durationMs: 3100,
      deviceId: 'mac',
      syncedAt: null,
    };
    const logB: ReviewLogEntry = {
      ...logA,
      id: 'bbbb2222-2222-4222-8222-222222222222',
      reviewIndex: 1,
      timestamp: '2026-11-16T14:00:00.000Z',
      reviewedAt: '2026-11-16T14:00:00.000Z',
      studyDayKey: '2026-11-16',
      rating: '5',
      deviceId: 'phone',
    };
    const merged = mergeReviewLogsFromDevices([logB], [logA, logB], INITIAL_CARDS);
    expect(merged.mergedLogs).toHaveLength(2);
    expect(merged.srsMap['v-teilnehmen'].confidence).toBe(5);

    // Deterministic Forgetting Learner Simulator over an 80-card deck
    const deckSize = 80;
    const deckIds = Array.from({ length: deckSize }, (_, i) => `sim-${i}`);
    let simState = createInitialDeckLoopState('sim-80', deckIds, {});

    // Per-card latent memory strength (0..1) + occasional slip probability
    const memory = new Map<string, number>();
    for (const id of deckIds) {
      // Initial baseline recall varies across cards (some easy, some tricky)
      memory.set(id, (deterministicHash(`init:${id}`) % 50) / 100);
    }

    let steps = 0;
    let backToBackRepeats = 0;
    let prevShownCardId: string | null = null;
    const maxSteps = 2000;
    while (simState.phase !== 'done' && steps < maxSteps) {
      steps += 1;
      const cardId = getCurrentLoopCardId(simState);
      if (!cardId) break;
      if (prevShownCardId === cardId) {
        backToBackRepeats += 1;
      }
      prevShownCardId = cardId;

      const meta = simState.cardLoopMeta[cardId];
      const priorReviews = meta?.reviewCount ?? 0;
      const strength = memory.get(cardId) ?? 0.25;
      // Deterministic roll simulating forgetting / noisy human recall
      const roll = (deterministicHash(`${cardId}:step:${steps}:${priorReviews}`) % 100) / 100;

      // Occasional forgetting slip (15% early, decaying with exposures)
      const effectiveRecall = Math.min(1, strength + priorReviews * 0.14) - (roll < 0.14 ? 0.45 : 0);

      let rating: '1' | '2' | '3' | '4' | '5';
      if (effectiveRecall < 0.2) rating = '1';
      else if (effectiveRecall < 0.38) rating = '2';
      else if (effectiveRecall < 0.56) rating = '3';
      else if (effectiveRecall < 0.82) rating = '4';
      else rating = '5';

      // Reviewing strengthens memory; forgetting drops strength slightly
      const nextStrength =
        rating === '1' || rating === '2'
          ? Math.max(0.15, strength + 0.08)
          : Math.min(0.98, strength + 0.18);
      memory.set(cardId, nextStrength);

      simState = applyLoopRating(simState, cardId, rating);
    }

    const avgReviewsPerCard = steps / deckSize;
    expect(simState.phase).toBe('done');
    expect(simState.clearedIds).toHaveLength(deckSize);
    expect(simState.sweepPassedIds.length).toBeGreaterThanOrEqual(1);
    expect(simState.sweepPassedIds.length).toBeLessThanOrEqual(
      CONFIDENCE_LOOP_CONFIG.maxFinalCheckCards
    );
    // Zero back-to-back repeats across an 80-card deck including the entire endgame!
    expect(backToBackRepeats).toBe(0);
    // Smooth, efficient completion without trailing bloat
    expect(avgReviewsPerCard).toBeGreaterThanOrEqual(3.5);
    expect(avgReviewsPerCard).toBeLessThanOrEqual(11);
  });

  it('T-10: DE->EN and EN->DE progress, mastery, loop state, undo, and reset are completely isolated', () => {
    const now = new Date('2026-11-18T10:00:00.000Z');
    const cardIds = ['v-ankommen', 'v-sprechen', 'n-bahnhof'];
    let map = loadSrsMap(INITIAL_CARDS);

    // Rate all 3 cards 5 twice in DE->EN
    for (const cid of cardIds) {
      const r1 = appendRatingEvent({
        cardId: cid,
        rating: '5',
        deckId: 'mixed',
        direction: 'de-en',
        srsMap: map,
        now,
        durationMs: 1200,
      });
      const r2 = appendRatingEvent({
        cardId: cid,
        rating: '5',
        deckId: 'mixed',
        direction: 'de-en',
        srsMap: r1.updatedMap,
        now,
        durationMs: 1100,
      });
      map = r2.updatedMap;
    }

    // DE->EN is 100% mastered; EN->DE is untouched (0%, all Neu)
    expect(computeConfidenceMasteryPct(cardIds, map, 'de-en')).toBe(100);
    expect(computeConfidenceMasteryPct(cardIds, map, 'en-de')).toBe(0);
    expect(getCardSrsForDirection(map, 'v-ankommen', 'de-en').confidence).toBe(5);
    expect(getCardSrsForDirection(map, 'v-ankommen', 'en-de').confidence).toBe(0);
    expect(isCardNew(getCardSrsForDirection(map, 'v-ankommen', 'en-de'))).toBe(true);

    // Session keys & state keys namespace EN->DE cleanly while preserving DE->EN canonical keys
    expect(getSrsStateKey('v-ankommen', 'de-en')).toBe('v-ankommen');
    expect(getSrsStateKey('v-ankommen', 'en-de')).toBe('v-ankommen::en-de');
    expect(parseSrsStateKey('v-ankommen::en-de')).toEqual({
      cardId: 'v-ankommen',
      direction: 'en-de',
    });
    expect(getDeckSessionKey('verb', 'de-en')).toBe('verb');
    expect(getDeckSessionKey('verb', 'en-de')).toBe('verb::en-de');

    // Initial loop in EN->DE starts fresh in 'loop' (NOT 'sweep') even though DE->EN is 100% mastered
    const enDeLoop = createInitialDeckLoopState(
      'mixed',
      cardIds,
      map,
      CONFIDENCE_LOOP_CONFIG,
      'en-de'
    );
    expect(enDeLoop.direction).toBe('en-de');
    expect(enDeLoop.phase).toBe('loop');
    expect(enDeLoop.clearedIds).toHaveLength(0);

    // Rate v-ankommen as 2 in EN->DE, then verify DE->EN stays 5
    const enRes = appendRatingEvent({
      cardId: 'v-ankommen',
      rating: '2',
      deckId: 'mixed',
      direction: 'en-de',
      srsMap: map,
      now,
      durationMs: 2400,
    });
    map = enRes.updatedMap;
    expect(enRes.logEntry.cardId).toBe('v-ankommen::en-de');
    expect(enRes.logEntry.direction).toBe('en-de');
    expect(getCardSrsForDirection(map, 'v-ankommen', 'en-de').confidence).toBe(2);
    expect(getCardSrsForDirection(map, 'v-ankommen', 'de-en').confidence).toBe(5);

    // Mastered stats preserve DE->EN mastery even when EN->DE struggles, and never double-count across directions
    const derived = deriveStudyStatsFromLogs(loadReviewLogs(), now);
    expect(derived.dailyMasteredHistory?.[getLocalDateString(now)]).toBe(3);

    // Undo in EN->DE restores v-ankommen::en-de to Neu without touching DE->EN
    const undoEn = undoLastReview(INITIAL_CARDS, map, now, {
      deckId: 'mixed',
      direction: 'en-de',
    });
    expect(isCardNew(getCardSrsForDirection(undoEn.updatedMap, 'v-ankommen', 'en-de'))).toBe(true);
    expect(getCardSrsForDirection(undoEn.updatedMap, 'v-ankommen', 'de-en').confidence).toBe(5);

    // Rate EN->DE again and reset ONLY EN->DE -> DE->EN remains 100% intact
    const enRes2 = appendRatingEvent({
      cardId: 'v-sprechen',
      rating: '4',
      deckId: 'mixed',
      direction: 'en-de',
      srsMap: undoEn.updatedMap,
      now,
      durationMs: 1500,
    });
    const resetEn = resetCardsSrsProgress(cardIds, enRes2.updatedMap, now, 'en-de');
    expect(computeConfidenceMasteryPct(cardIds, resetEn.updatedMap, 'en-de')).toBe(0);
    expect(computeConfidenceMasteryPct(cardIds, resetEn.updatedMap, 'de-en')).toBe(100);
  });

  it('T-11: Endgame interleaves mastered cards to prevent 1-2 card back-to-back repeats and catches Quick Refresh lapses', () => {
    const ids = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
    // Pre-seed 5 mastered cards and 1 struggling active card ('c6')
    const persisted = {
      c1: computeNextSrsState(computeNextSrsState(createDefaultSrsState('c1'), '5'), '5'),
      c2: computeNextSrsState(computeNextSrsState(createDefaultSrsState('c2'), '5'), '5'),
      c3: computeNextSrsState(computeNextSrsState(createDefaultSrsState('c3'), '4'), '4'),
      c4: computeNextSrsState(computeNextSrsState(createDefaultSrsState('c4'), '4'), '5'),
      c5: computeNextSrsState(computeNextSrsState(createDefaultSrsState('c5'), '5'), '4'),
      c6: computeNextSrsState(createDefaultSrsState('c6'), '1'),
    };

    let state = createInitialDeckLoopState('endgame-deck', ids, persisted);
    expect(state.phase).toBe('loop');
    expect(state.activePool).toEqual(['c6']);
    expect(state.clearedIds).toHaveLength(5);
    expect(getCurrentLoopCardId(state)).toBe('c6');
    expect(state.currentSlotKind).toBe('active');

    // Rate 'c6' as 1 -> next card MUST be an interleaved mastered card (Quick Refresh), NEVER 'c6' back-to-back!
    state = applyLoopRating(state, 'c6', '1');
    const buffer1 = getCurrentLoopCardId(state)!;
    expect(buffer1).not.toBe('c6');
    expect(state.clearedIds).toContain(buffer1);
    expect(state.currentSlotKind).toBe('interleave');

    // Pass buffer1 with rating 5 -> bounded endgame interleaving returns to 'c6' within <= 2 buffer cards after low confidence
    let bufferCount = 1;
    state = applyLoopRating(state, buffer1, '5');
    while (getCurrentLoopCardId(state) !== 'c6' && bufferCount < 5) {
      expect(state.currentSlotKind).toBe('interleave');
      const nextBuf = getCurrentLoopCardId(state)!;
      expect(nextBuf).not.toBe(buffer1);
      bufferCount += 1;
      state = applyLoopRating(state, nextBuf, '5');
    }
    expect(getCurrentLoopCardId(state)).toBe('c6');
    expect(bufferCount).toBeLessThanOrEqual(CONFIDENCE_LOOP_CONFIG.maxEndgameInterleaveLow);

    // Now rate 'c6' as 2 -> get an interleaved Quick Refresh card -> FAIL it with rating 2!
    state = applyLoopRating(state, 'c6', '2');
    expect(state.currentSlotKind).toBe('interleave');
    const lapsedCard = getCurrentLoopCardId(state)!;
    expect(state.clearedIds).toContain(lapsedCard);

    state = applyLoopRating(state, lapsedCard, '2');
    // Lapsed mastered card is pulled right back into activePool with reset streak!
    expect(state.activePool).toContain(lapsedCard);
    expect(state.clearedIds).not.toContain(lapsedCard);
    expect(state.cardLoopMeta[lapsedCard].consecutiveHighCount).toBe(0);
    expect(state.cardLoopMeta[lapsedCard].hadStruggleInSession).toBe(true);
  });

  it('T-12: Smart Final Check caps at <= 8 shaky/recent cards, advances progress smoothly (0->90->99->100), and re-inserts misses in-place', () => {
    const ids = Array.from({ length: 24 }, (_, i) => `card-${i}`);
    let state = createInitialDeckLoopState('smart-check-24', ids, {});

    // Struggle on first 3 cards once, sail through all others with 4/5
    const struggledSet = new Set(['card-0', 'card-1', 'card-2']);
    const failedOnce = new Set<string>();
    let prevPct = computeDeckLoopProgressPct(state);
    expect(prevPct).toBe(0);

    let guard = 0;
    while (state.phase === 'loop' && guard < 200) {
      guard += 1;
      const cid = getCurrentLoopCardId(state)!;
      if (struggledSet.has(cid) && !failedOnce.has(cid)) {
        failedOnce.add(cid);
        state = applyLoopRating(state, cid, '1');
      } else {
        state = applyLoopRating(state, cid, '4');
      }
    }

    expect(state.phase).toBe('sweep');
    expect(state.clearedIds).toHaveLength(24);
    expect(state.sweepQueue.length).toBeGreaterThanOrEqual(1);
    expect(state.sweepQueue.length).toBeLessThanOrEqual(
      CONFIDENCE_LOOP_CONFIG.maxFinalCheckCards
    );
    expect(state.finalCheckTotal).toBe(state.sweepQueue.length);

    const sweepStartPct = computeDeckLoopProgressPct(state);
    expect(sweepStartPct).toBe(90);

    // Advance until only 1 card remains in sweepQueue, then fail it -> must buffer with Quick Refresh instead of repeating back-to-back!
    while (state.phase === 'sweep' && state.sweepQueue.length > 1) {
      const cid = getCurrentLoopCardId(state)!;
      state = applyLoopRating(state, cid, '5');
      const midPct = computeDeckLoopProgressPct(state);
      expect(midPct).toBeGreaterThanOrEqual(90);
      expect(midPct).toBeLessThanOrEqual(99);
    }

    if (state.phase === 'sweep' && state.sweepQueue.length === 1) {
      const lastSweepCard = getCurrentLoopCardId(state)!;
      state = applyLoopRating(state, lastSweepCard, '2');
      expect(state.phase).toBe('sweep');
      expect(state.sweepQueue).toEqual([lastSweepCard]);
      // Next card is an interleaved Quick Refresh card, NOT lastSweepCard back-to-back
      expect(state.currentSlotKind).toBe('interleave');
      expect(getCurrentLoopCardId(state)).not.toBe(lastSweepCard);
    }

    // Complete remaining cards
    guard = 0;
    while (state.phase !== 'done' && guard < 40) {
      guard += 1;
      const cid = getCurrentLoopCardId(state)!;
      state = applyLoopRating(state, cid, '5');
    }

    expect(state.phase).toBe('done');
    expect(computeDeckLoopProgressPct(state)).toBe(100);
  });

  it('T-13: Both Rating 4 and Rating 5 require 2 consecutive hits, and EN->DE log replay ignores DE->EN logs deterministically', () => {
    const ids = ['k1', 'k2', 'k3', 'k4', 'k5', 'k6'];

    // Single Rating 5 must NOT clear k1 on its first exposure
    let singleFiveState = createInitialDeckLoopState('five-check', ids, {}, CONFIDENCE_LOOP_CONFIG, 'en-de');
    expect(getCurrentLoopCardId(singleFiveState)).toBe('k1');
    singleFiveState = applyLoopRating(singleFiveState, 'k1', '5');
    expect(singleFiveState.clearedIds).not.toContain('k1');
    expect(singleFiveState.activePool).toContain('k1');
    expect(singleFiveState.cardLoopMeta['k1'].consecutiveHighCount).toBe(1);

    // Full EN->DE session replay ignores DE->EN logs in the same deck
    const seq: Array<'1' | '2' | '3' | '4' | '5'> = ['2', '5', '4', '1', '5', '4', '5', '4'];
    let liveEnDe = createInitialDeckLoopState('replay-en-de', ids, {}, CONFIDENCE_LOOP_CONFIG, 'en-de');
    const mixedLogs: Pick<
      ReviewLogEntry,
      'cardId' | 'rating' | 'reviewIndex' | 'timestamp' | 'eventType' | 'direction'
    >[] = [
      // Distractor DE->EN log that must be ignored when replaying EN->DE
      {
        cardId: 'k1',
        rating: '5',
        reviewIndex: 0,
        timestamp: new Date(1700000000000).toISOString(),
        eventType: 'review',
        direction: 'de-en',
      },
    ];

    for (let idx = 0; idx < seq.length; idx += 1) {
      const cardId = getCurrentLoopCardId(liveEnDe);
      if (!cardId) break;
      const rating = seq[idx];
      liveEnDe = applyLoopRating(liveEnDe, cardId, rating);
      mixedLogs.push({
        cardId: getSrsStateKey(cardId, 'en-de'),
        rating,
        reviewIndex: idx + 1,
        timestamp: new Date(1700000001000 + idx * 1000).toISOString(),
        eventType: 'review',
        direction: 'en-de',
      });
    }

    const replayedEnDe = replayDeckLoopSession(
      'replay-en-de',
      ids,
      {},
      [...mixedLogs].reverse(),
      CONFIDENCE_LOOP_CONFIG,
      'en-de'
    );
    expect(replayedEnDe).toEqual(liveEnDe);
  });
});
