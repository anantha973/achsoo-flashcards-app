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
  computeLoopGap,
  createInitialDeckLoopState,
  deterministicHash,
  getCurrentLoopCardId,
  replayDeckLoopSession,
} from '../confidenceLoopEngine';
import {
  appendRatingEvent,
  computeNextSrsState,
  createDefaultSrsState,
  deriveStudyStatsFromLogs,
  formatConfidenceBadge,
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

  it('T-02: Deterministic virtual-clock gap table & consecutive multipliers match spec without RNG', () => {
    for (let rc = 1; rc <= 12; rc += 1) {
      const g1 = computeLoopGap('c-test', rc, 1, 0, 0);
      expect(g1).toBeGreaterThanOrEqual(2);
      expect(g1).toBeLessThanOrEqual(3);

      const g2 = computeLoopGap('c-test', rc, 2, 0, 0);
      expect(g2).toBeGreaterThanOrEqual(4);
      expect(g2).toBeLessThanOrEqual(6);

      const g3 = computeLoopGap('c-test', rc, 3, 0, 0);
      expect(g3).toBeGreaterThanOrEqual(7);
      expect(g3).toBeLessThanOrEqual(10);

      const g4First = computeLoopGap('c-test', rc, 4, 1, 0);
      expect(g4First).toBeGreaterThanOrEqual(12);
      expect(g4First).toBeLessThanOrEqual(18);
      const g4Second = computeLoopGap('c-test', rc, 4, 2, 0);
      expect(g4Second).toBe(g4First * 2);

      const g5First = computeLoopGap('c-test', rc, 5, 1, 1);
      expect(g5First).toBeGreaterThanOrEqual(25);
      expect(g5First).toBeLessThanOrEqual(40);
      const g5Second = computeLoopGap('c-test', rc, 5, 2, 2);
      expect(g5Second).toBe(Math.round(g5First * 1.5));
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

    // With moderate confidence (rating 3 -> gap 7-10), unsettled pool fills up to workingSetCap (10) and stops there
    let expandingState = createInitialDeckLoopState('capped-3s', ids, {});
    for (let step = 0; step < 25; step += 1) {
      const current = getCurrentLoopCardId(expandingState)!;
      expandingState = applyLoopRating(expandingState, current, '3');
      expect(expandingState.activePool.length).toBeLessThanOrEqual(
        CONFIDENCE_LOOP_CONFIG.workingSetCap
      );
    }

    expect(expandingState.activePool.length).toBe(
      CONFIDENCE_LOOP_CONFIG.workingSetCap
    );
    expect(expandingState.waitingQueue.length).toBe(20);
  });

  it('T-05: Two consecutive >=4 clears loop -> deterministic Final Sweep -> <4 bounces back -> Done -> Reopen & Fresh start', () => {
    const ids = ['a', 'b', 'c', 'd'];
    let state = createInitialDeckLoopState('deck-sweep', ids, {});

    // First 4 is not cleared yet; second consecutive 4 clears the card
    let guard = 0;
    while (state.phase === 'loop' && guard < 30) {
      guard += 1;
      const cid = getCurrentLoopCardId(state)!;
      state = applyLoopRating(state, cid, '4');
    }

    expect(state.phase).toBe('sweep');
    expect(state.clearedIds).toHaveLength(4);
    expect(state.sweepQueue).toHaveLength(4);

    // Fail the first sweep card with rating 2 -> bounces immediately back into loop!
    const missedSweepCard = getCurrentLoopCardId(state)!;
    state = applyLoopRating(state, missedSweepCard, '2');
    expect(state.phase).toBe('loop');
    expect(state.activePool).toContain(missedSweepCard);
    expect(state.clearedIds).not.toContain(missedSweepCard);

    // Finish clearing the bounced card with 2x rating 5, then clear remaining sweep cards
    guard = 0;
    while (state.phase !== 'done' && guard < 30) {
      guard += 1;
      const cid = getCurrentLoopCardId(state)!;
      state = applyLoopRating(state, cid, '5');
    }

    expect(state.phase).toBe('done');
    expect(state.clearedIds).toHaveLength(4);
    expect(state.sweepPassedIds).toHaveLength(4);
    expect(getCurrentLoopCardId(state)).toBeNull();

    // Reopening a deck: <4 goes into loop, >=4 waits for sweep, zero hidden/locked cards
    const persisted = {
      a: computeNextSrsState(createDefaultSrsState('a'), '2'),
      b: computeNextSrsState(createDefaultSrsState('b'), '4'),
      c: computeNextSrsState(createDefaultSrsState('c'), '5'),
      d: createDefaultSrsState('d'),
    };
    const reopened = createInitialDeckLoopState('deck-reopen', ids, persisted);
    expect(reopened.phase).toBe('loop');
    expect(reopened.clearedIds).toEqual(['b', 'c']);
    expect([...reopened.activePool, ...reopened.waitingQueue]).toEqual(['a', 'd']);

    // When all cards already have confidence >=4, reopening starts directly at Final Sweep
    const allHighReopened = createInitialDeckLoopState('deck-all-high', ['b', 'c'], persisted);
    expect(allHighReopened.phase).toBe('sweep');
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
    const maxSteps = 2000;
    while (simState.phase !== 'done' && steps < maxSteps) {
      steps += 1;
      const cardId = getCurrentLoopCardId(simState);
      if (!cardId) break;

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
    expect(simState.sweepPassedIds).toHaveLength(deckSize);
    // Validate Brainscape-like ~6-8 reviews per card target range under realistic forgetting
    expect(avgReviewsPerCard).toBeGreaterThanOrEqual(4.5);
    expect(avgReviewsPerCard).toBeLessThanOrEqual(11);
  });
});
