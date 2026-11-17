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
  MATURE_INTERVAL_DAYS,
  appendRatingEvent,
  computeNextSrsState,
  createDefaultSrsState,
  deriveStudyStatsFromLogs,
  getLocalDateString,
  getPreviewIntervalLabel,
  hydrateEngineFromIndexedDB,
  isCardDueToday,
  isCardNew,
  loadReviewLogs,
  loadSrsMap,
  loadStudyStats,
  mergeReviewLogsFromDevices,
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

describe('Achsoo FSRS & Append-Only Review Log Engine (T-01 .. T-12)', () => {
  beforeEach(() => {
    localStoreData.clear();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    resetIdbConnectionForTests();
    resetAllSrsProgress(INITIAL_CARDS);
  });

  it('T-01: Rate a new card "Good" -> enters learning state (~10 min), appends 1 log entry, increments daily reviews', () => {
    const now = new Date('2026-11-16T10:00:00.000Z');
    const initialMap = loadSrsMap(INITIAL_CARDS);

    const res = appendRatingEvent({
      cardId: 'v-ankommen',
      rating: 'good',
      srsMap: initialMap,
      now,
      durationMs: 4200,
    });

    expect(res.nextState.fsrsState).toBe('learning');
    expect(res.nextState.intervalMinutes).toBe(10);
    expect(res.nextState.mastered).toBe(false);
    expect(res.nextState.reviewCount).toBe(1);

    expect(res.allLogs).toHaveLength(1);
    expect(res.logEntry.cardId).toBe('v-ankommen');
    expect(res.logEntry.rating).toBe('good');
    expect(res.logEntry.stateBefore).toBe('new');
    expect(res.logEntry.stateAfter).toBe('learning');
    expect(res.logEntry.durationMs).toBe(4200);

    expect(res.updatedStats.totalReviewsToday).toBe(1);
    expect(res.updatedStats.streakDays).toBe(1);
    expect(res.updatedStats.timeStudiedMsToday).toBe(4200);
  });

  it('T-02: Graduate a learning card to Review, and mature only when interval >= 21 days', () => {
    let t = new Date('2026-11-16T10:00:00.000Z');
    let state = createDefaultSrsState('v-sprechen');

    // Step 1: First Good -> Learning (10 min)
    state = computeNextSrsState(state, 'good', t);
    expect(state.fsrsState).toBe('learning');
    expect(state.mastered).toBe(false);

    // Step 2: Second Good 10 min later -> Graduates to Review (< 21 days, so NOT mastered yet)
    t = new Date(state.dueAt);
    state = computeNextSrsState(state, 'good', t);
    expect(state.fsrsState).toBe('review');
    expect(state.scheduledDays).toBeGreaterThanOrEqual(1);
    expect(state.scheduledDays).toBeLessThan(MATURE_INTERVAL_DAYS);
    expect(state.mastered).toBe(false);

    // Step 3: Subsequent Good reviews until scheduledDays >= 21
    while ((state.scheduledDays || 0) < MATURE_INTERVAL_DAYS) {
      t = new Date(state.dueAt);
      state = computeNextSrsState(state, 'good', t);
    }

    expect(state.fsrsState).toBe('review');
    expect(state.scheduledDays).toBeGreaterThanOrEqual(MATURE_INTERVAL_DAYS);
    expect(state.mastered).toBe(true);
  });

  it('T-03: Mature card lapse on "Again" -> enters relearning, increments lapses, clears mastered', () => {
    let t = new Date('2026-11-16T10:00:00.000Z');
    let state = createDefaultSrsState('n-bahnhof');

    // Advance card to mature state (>= 21 days)
    while (!state.mastered) {
      state = computeNextSrsState(state, 'easy', t);
      t = new Date(state.dueAt);
    }
    expect(state.mastered).toBe(true);
    const stabilityBeforeLapse = state.stability || 0;

    // Lapse with 'again'
    const lapsed = computeNextSrsState(state, 'again', t);
    expect(lapsed.fsrsState).toBe('relearning');
    expect(lapsed.lapses).toBeGreaterThanOrEqual(1);
    expect(lapsed.mastered).toBe(false);
    expect(lapsed.stability).toBeLessThan(stabilityBeforeLapse);
  });

  it('T-04: Dynamic dock interval labels reflect per-card FSRS state', () => {
    const now = new Date('2026-11-16T10:00:00.000Z');
    const newCard = createDefaultSrsState('v-bleiben');

    expect(getPreviewIntervalLabel(newCard, 'again', now)).toBe('< 1 Min.');
    expect(getPreviewIntervalLabel(newCard, 'hard', now)).toBe('6 Min.');
    expect(getPreviewIntervalLabel(newCard, 'good', now)).toBe('10 Min.');
    expect(getPreviewIntervalLabel(newCard, 'easy', now)).toBe('8 Tage');

    // After graduating to review, 'good' preview is multiple days, not 10 Min.
    const step1 = computeNextSrsState(newCard, 'good', now);
    const step2 = computeNextSrsState(step1, 'good', new Date(step1.dueAt));
    const reviewGoodLabel = getPreviewIntervalLabel(
      step2,
      'good',
      new Date(step2.dueAt)
    );
    expect(reviewGoodLabel).toMatch(/Tage$/);
  });

  it('T-05: Unseen New cards are NOT counted as Due; fresh install has 0 due and 0% progress', () => {
    const now = new Date('2026-11-16T10:00:00.000Z');
    const freshMap = loadSrsMap(INITIAL_CARDS);
    const freshStats = loadStudyStats(now);

    let newCount = 0;
    let dueCount = 0;
    let masteredCount = 0;

    for (const card of INITIAL_CARDS) {
      const st = freshMap[card.id];
      if (isCardNew(st)) newCount += 1;
      if (isCardDueToday(st, now)) dueCount += 1;
      if (st.mastered) masteredCount += 1;
    }

    expect(newCount).toBe(INITIAL_CARDS.length);
    expect(dueCount).toBe(0);
    expect(masteredCount).toBe(0);
    expect(freshStats.streakDays).toBe(0);
    expect(freshStats.totalReviewsToday).toBe(0);
  });

  it('T-06: Study-day rollover at 04:00 local time and DST-safe calendar arithmetic', () => {
    // 03:30 AM local time on Nov 16 belongs to study day Nov 15
    const beforeRollover = new Date(2026, 10, 16, 3, 30, 0);
    // 04:05 AM local time on Nov 16 belongs to study day Nov 16
    const afterRollover = new Date(2026, 10, 16, 4, 5, 0);

    expect(getLocalDateString(beforeRollover)).toBe('2026-11-15');
    expect(getLocalDateString(afterRollover)).toBe('2026-11-16');

    const map0 = loadSrsMap(INITIAL_CARDS);
    const r1 = appendRatingEvent({
      cardId: 'v-ankommen',
      rating: 'good',
      srsMap: map0,
      now: beforeRollover,
    });
    expect(r1.logEntry.studyDayKey).toBe('2026-11-15');

    const r2 = appendRatingEvent({
      cardId: 'v-sprechen',
      rating: 'good',
      srsMap: r1.updatedMap,
      now: afterRollover,
    });
    expect(r2.logEntry.studyDayKey).toBe('2026-11-16');
    expect(r2.updatedStats.streakDays).toBe(2);
    expect(r2.updatedStats.totalReviewsToday).toBe(1);
  });

  it('T-07: Streak resets to 0 when a full study day is missed, and restarts at 1 on next review', () => {
    const day1 = new Date(2026, 10, 10, 12, 0, 0); // 2026-11-10
    const day3 = new Date(2026, 10, 12, 12, 0, 0); // 2026-11-12 (missed 2026-11-11)

    const map0 = loadSrsMap(INITIAL_CARDS);
    const r1 = appendRatingEvent({
      cardId: 'v-ankommen',
      rating: 'good',
      srsMap: map0,
      now: day1,
    });
    expect(r1.updatedStats.streakDays).toBe(1);

    // Check stats on day 3 BEFORE studying -> streak must be 0
    const statsBeforeReviewOnDay3 = deriveStudyStatsFromLogs(r1.allLogs, day3);
    expect(statsBeforeReviewOnDay3.streakDays).toBe(0);

    // Study on day 3 -> streak restarts at 1 (not 2)
    const r2 = appendRatingEvent({
      cardId: 'v-sprechen',
      rating: 'good',
      srsMap: r1.updatedMap,
      now: day3,
    });
    expect(r2.updatedStats.streakDays).toBe(1);
  });

  it('T-08: Persistence across reload and deterministic state reconstruction from review_logs alone', async () => {
    const t1 = new Date('2026-11-16T09:00:00.000Z');
    const t2 = new Date('2026-11-16T09:15:00.000Z');
    let srsMap = loadSrsMap(INITIAL_CARDS);

    srsMap = appendRatingEvent({
      cardId: 'v-ankommen',
      rating: 'good',
      srsMap,
      now: t1,
      durationMs: 3000,
    }).updatedMap;

    const r2 = appendRatingEvent({
      cardId: 'v-ankommen',
      rating: 'easy',
      srsMap,
      now: t2,
      durationMs: 2500,
    });
    srsMap = r2.updatedMap;

    const logs = loadReviewLogs();
    expect(logs).toHaveLength(2);

    // Wipe derived card state cache and replay purely from logs
    const replayedSingle = replayCardStateFromLogs('v-ankommen', logs);
    expect(replayedSingle).toEqual(srsMap['v-ankommen']);

    // Verify IndexedDB hydration restores logs, card states, and stats
    const idbLogs = await idbGetAllReviewLogs();
    expect(idbLogs).toHaveLength(2);

    const hydrated = await hydrateEngineFromIndexedDB(INITIAL_CARDS);
    expect(hydrated.srsMap['v-ankommen']).toEqual(srsMap['v-ankommen']);
    expect(hydrated.stats.totalReviewsToday).toBe(2);
  });

  it('T-09: Content JSON edits, reordering, and removed cards preserve progress & orphan states', () => {
    const now = new Date('2026-11-16T10:00:00.000Z');
    const initialMap = loadSrsMap(INITIAL_CARDS);
    const rated = appendRatingEvent({
      cardId: 'v-ankommen',
      rating: 'easy',
      srsMap: initialMap,
      now,
    });

    // Reorder cards and edit translation of 'v-ankommen', and temporarily omit 'v-ankommen' in a subset
    const editedAndReordered: VocabCard[] = [
      ...INITIAL_CARDS.slice(1).reverse(),
      {
        ...INITIAL_CARDS[0],
        translation: 'to arrive (updated translation)',
      },
    ];

    const loadedAfterReorder = loadSrsMap(editedAndReordered);
    expect(loadedAfterReorder['v-ankommen'].reviewCount).toBe(1);
    expect(loadedAfterReorder['v-ankommen'].dueAt).toBe(
      rated.nextState.dueAt
    );

    // Even if 'v-ankommen' is removed from the active card list, its orphan state is preserved in storage
    const subsetWithoutAnkommen = INITIAL_CARDS.filter(
      (c) => c.id !== 'v-ankommen'
    );
    const loadedWithoutCard = loadSrsMap(subsetWithoutAnkommen);
    expect(loadedWithoutCard['v-ankommen']).toBeDefined();
    expect(loadedWithoutCard['v-ankommen'].reviewCount).toBe(1);
  });

  it('T-10: Duplicate or empty card IDs in content JSON throw a hard error naming the offending IDs', () => {
    const duplicateList: VocabCard[] = [
      INITIAL_CARDS[0],
      {
        ...INITIAL_CARDS[0],
        translation: 'duplicate entry that must block loading',
      },
      INITIAL_CARDS[1],
    ];

    expect(() => validateAndNormalizeContentCards(duplicateList)).toThrowError(
      /duplicate card IDs \[v-ankommen\]/
    );

    const emptyIdList: VocabCard[] = [
      INITIAL_CARDS[0],
      { ...INITIAL_CARDS[1], id: '   ' },
    ];

    expect(() => validateAndNormalizeContentCards(emptyIdList)).toThrowError(
      /empty\/missing card IDs at \[index 1 \(lemma: "sprechen"\)\]/
    );
  });

  it('T-11: Undo last rating appends an "undo" marker event (never deletes log entries) and restores prior card state & stats', () => {
    const t1 = new Date('2026-11-16T10:00:00.000Z');
    const t2 = new Date('2026-11-16T10:12:00.000Z');
    const t3 = new Date('2026-11-16T10:13:00.000Z');
    const initialMap = loadSrsMap(INITIAL_CARDS);

    const first = appendRatingEvent({
      cardId: 'v-umziehen',
      rating: 'good',
      srsMap: initialMap,
      now: t1,
      durationMs: 2000,
    });

    const second = appendRatingEvent({
      cardId: 'v-umziehen',
      rating: 'again',
      srsMap: first.updatedMap,
      now: t2,
      durationMs: 1800,
    });

    expect(loadReviewLogs()).toHaveLength(2);
    expect(second.nextState.lastRating).toBe('again');

    // Undo the second review: appends a 3rd entry with eventType === 'undo'
    const undone = undoLastReview(INITIAL_CARDS, second.updatedMap, t3);
    expect(undone.undoneEntry?.id).toBe(second.logEntry.id);
    expect(undone.undoMarkerEntry?.eventType).toBe('undo');
    expect(undone.undoMarkerEntry?.undoTargetId).toBe(second.logEntry.id);
    expect(loadReviewLogs()).toHaveLength(3); // 2 review entries + 1 undo marker entry (append-only!)
    expect(undone.remainingLogs).toHaveLength(1); // 1 effective active review
    expect(undone.updatedMap['v-umziehen']).toEqual(first.nextState);
    expect(undone.updatedStats.totalReviewsToday).toBe(1);
  });

  it('T-12: Multi-device review log union merge is idempotent and replays chronological FSRS state', () => {
    const macLog: ReviewLogEntry = {
      id: '11111111-1111-4111-8111-111111111111',
      cardId: 'v-teilnehmen',
      timestamp: '2026-11-15T14:00:00.000Z',
      reviewedAt: '2026-11-15T14:00:00.000Z',
      studyDayKey: '2026-11-15',
      rating: 'good',
      stateBefore: 'new',
      stateAfter: 'learning',
      dueBefore: new Date(0).toISOString(),
      dueAfter: '2026-11-15T14:10:00.000Z',
      intervalMinutesBefore: 0,
      intervalMinutesAfter: 10,
      stabilityAfter: 3.1,
      difficultyAfter: 5.2,
      durationMs: 3100,
      deviceId: 'macbook-pro',
      syncedAt: null,
    };

    const ipadLog: ReviewLogEntry = {
      id: '22222222-2222-4222-8222-222222222222',
      cardId: 'v-teilnehmen',
      timestamp: '2026-11-16T14:00:00.000Z',
      reviewedAt: '2026-11-16T14:00:00.000Z',
      studyDayKey: '2026-11-16',
      rating: 'good',
      stateBefore: 'learning',
      stateAfter: 'review',
      dueBefore: '2026-11-15T14:10:00.000Z',
      dueAfter: '2026-11-19T14:00:00.000Z',
      intervalMinutesBefore: 10,
      intervalMinutesAfter: 4320,
      stabilityAfter: 3.1,
      difficultyAfter: 5.2,
      durationMs: 2800,
      deviceId: 'ipad-air',
      syncedAt: null,
    };

    const now = new Date('2026-11-16T15:00:00.000Z');

    // Merge with overlapping duplicate logs in arbitrary order
    const merge1 = mergeReviewLogsFromDevices(
      [ipadLog, macLog],
      [macLog, ipadLog],
      INITIAL_CARDS,
      now
    );

    const merge2 = mergeReviewLogsFromDevices(
      merge1.mergedLogs,
      [ipadLog],
      INITIAL_CARDS,
      now
    );

    expect(merge1.mergedLogs).toHaveLength(2);
    expect(merge2.mergedLogs).toHaveLength(2);
    expect(merge1.srsMap['v-teilnehmen']).toEqual(
      merge2.srsMap['v-teilnehmen']
    );
    expect(merge2.srsMap['v-teilnehmen'].reviewCount).toBe(2);
    expect(merge2.srsMap['v-teilnehmen'].fsrsState).toBe('review');
    expect(merge2.stats.streakDays).toBe(2);
  });

  it('T-13: Resetting a deck resets card SRS state cleanly across reloads while preserving all user stats & review history', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(14, 0, 0, 0);

    const earlierToday = new Date();
    earlierToday.setHours(10, 0, 0, 0);
    if (earlierToday.getHours() < 5) {
      earlierToday.setHours(10, 0, 0, 0);
    }

    const resetNow = new Date(earlierToday.getTime() + 10 * 60_000);
    const retestNow = new Date(resetNow.getTime() + 5 * 60_000);

    let srsMap = loadSrsMap(INITIAL_CARDS);

    // Day 1 (yesterday): review v-ankommen
    srsMap = appendRatingEvent({
      cardId: 'v-ankommen',
      rating: 'good',
      srsMap,
      now: yesterday,
      durationMs: 3200,
    }).updatedMap;

    // Day 2 (today): review v-ankommen and v-sprechen
    srsMap = appendRatingEvent({
      cardId: 'v-ankommen',
      rating: 'easy',
      srsMap,
      now: earlierToday,
      durationMs: 2400,
    }).updatedMap;

    const beforeReset = appendRatingEvent({
      cardId: 'v-sprechen',
      rating: 'good',
      srsMap,
      now: new Date(earlierToday.getTime() + 60_000),
      durationMs: 1800,
    });
    srsMap = beforeReset.updatedMap;

    expect(beforeReset.updatedStats.streakDays).toBe(2);
    expect(beforeReset.updatedStats.totalReviewsToday).toBe(2);
    expect(beforeReset.updatedStats.totalTimeStudiedMs).toBe(7400);

    // Reset deck containing v-ankommen (leave v-sprechen untouched)
    const { updatedMap, updatedStats } = resetCardsSrsProgress(
      ['v-ankommen'],
      srsMap,
      resetNow
    );

    // Target card is reset to fresh new state; untouched card keeps its progress
    expect(isCardNew(updatedMap['v-ankommen'])).toBe(true);
    expect(updatedMap['v-ankommen'].reviewCount).toBe(0);
    expect(updatedMap['v-ankommen'].mastered).toBe(false);
    expect(updatedMap['v-sprechen'].reviewCount).toBe(1);

    // User stats & history remain completely preserved!
    expect(updatedStats.streakDays).toBe(2);
    expect(updatedStats.totalReviewsToday).toBe(2);
    expect(updatedStats.totalTimeStudiedMs).toBe(7400);
    expect(updatedStats.timeStudiedMsToday).toBe(4200);
    expect(updatedStats.retentionPct).toBe(100);

    // Reload / replay purely from persisted logs & IndexedDB hydration must preserve both reset state AND stats
    const reloadedMap = loadSrsMap(INITIAL_CARDS);
    expect(isCardNew(reloadedMap['v-ankommen'])).toBe(true);
    expect(reloadedMap['v-sprechen'].reviewCount).toBe(1);

    const hydrated = await hydrateEngineFromIndexedDB(INITIAL_CARDS);
    expect(isCardNew(hydrated.srsMap['v-ankommen'])).toBe(true);
    expect(hydrated.stats.streakDays).toBe(2);
    expect(hydrated.stats.totalReviewsToday).toBe(2);
    expect(hydrated.stats.totalTimeStudiedMs).toBe(7400);

    // Studying the reset card again starts SRS from reviewCount = 1 and adds to total stats
    const retested = appendRatingEvent({
      cardId: 'v-ankommen',
      rating: 'good',
      srsMap: hydrated.srsMap,
      now: retestNow,
      durationMs: 2000,
    });
    expect(retested.nextState.reviewCount).toBe(1);
    expect(retested.nextState.fsrsState).toBe('learning');
    expect(retested.updatedStats.totalReviewsToday).toBe(3);
    expect(retested.updatedStats.totalTimeStudiedMs).toBe(9400);
  });
});
