import {
  CardSrsState,
  ConfidenceRating,
  INITIAL_CARD_ID_SET,
  INITIAL_CARDS,
  LEGACY_RATING_MAP,
  LegacyRatingKey,
  normalizeRatingKey,
  RatingKey,
  ratingToConfidence,
  ReviewLogEntry,
  StudyDirection,
  StudyStats,
  VocabCard,
  validateAndNormalizeContentCards,
} from '../data/vocabData';
import {
  getDeckSessionKey,
  getSrsStateKey,
  parseSrsStateKey,
  stripDirectionSuffix,
} from './confidenceLoopEngine';
import {
  syncNativeSystemBars,
  triggerNativeHaptic,
} from './nativeAndroid';
import {
  generateUuid,
  getOrCreateDeviceId,
  idbAppendReviewLogAndState,
  idbClearReviewsForCards,
  idbGetAllCardStates,
  idbGetAllCustomCards,
  idbGetAllReviewLogs,
  idbPutReviewLogsBulk,
  idbSaveCustomCard,
  requestPersistentStorage,
} from './idbStorage';
import {
  type RemoteWorkspaceSnapshot,
  deleteReviewsFromSupabase,
  pullAndSyncSupabaseState,
  pushAllStatesAndStatsToSupabase,
  syncBatchReviewEventsToSupabase,
  syncCustomCardToSupabase,
  syncReviewEventToSupabase,
  syncWorkspaceToSupabase,
} from './supabaseSync';

export const STUDY_DAY_ROLLOVER_HOUR = 4; // 04:00 local time rollover

const SRS_STORAGE_KEY = 'wortschatz_srs_v2';
const REVIEW_LOGS_STORAGE_KEY = 'wortschatz_review_logs_v2';
const STATS_STORAGE_KEY = 'wortschatz_stats_v2';
const THEME_STORAGE_KEY = 'wortschatz_theme_v1';
const CUSTOM_CARDS_STORAGE_KEY = 'wortschatz_custom_cards_v1';

// In-memory append-only review log cache (authoritative runtime log, backed by IndexedDB + localStorage mirror)
let memoryReviewLogs: ReviewLogEntry[] | null = null;

// Debounced localStorage mirror write scheduler (avoids blocking card exit animations while staying synchronous in Vitest)
const pendingMirrorWriters = new Map<string, () => string>();
let pendingMirrorTimer: number | null = null;
let mirrorFlushListenersBound = false;

function isTestRuntime(): boolean {
  try {
    if (typeof process !== 'undefined' && process.env?.VITEST) return true;
  } catch {
    // Ignore
  }
  return false;
}

function flushAllMirrors(): void {
  if (pendingMirrorTimer !== null && typeof window !== 'undefined') {
    window.clearTimeout(pendingMirrorTimer);
    pendingMirrorTimer = null;
  }
  if (pendingMirrorWriters.size === 0 || typeof localStorage === 'undefined') {
    pendingMirrorWriters.clear();
    return;
  }
  const entries = Array.from(pendingMirrorWriters.entries());
  pendingMirrorWriters.clear();
  for (const [key, serialize] of entries) {
    try {
      localStorage.setItem(key, serialize());
    } catch {
      // Ignore storage quota errors in localStorage mirror; IndexedDB is primary
    }
  }
}

function clearPendingMirrors(): void {
  if (pendingMirrorTimer !== null && typeof window !== 'undefined') {
    window.clearTimeout(pendingMirrorTimer);
    pendingMirrorTimer = null;
  }
  pendingMirrorWriters.clear();
}

function bindMirrorFlushListeners(): void {
  if (mirrorFlushListenersBound || typeof window === 'undefined') return;
  mirrorFlushListenersBound = true;
  window.addEventListener('pagehide', flushAllMirrors);
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        flushAllMirrors();
      }
    });
  }
}

function scheduleMirrorWrite(key: string, serialize: () => string): void {
  if (typeof localStorage === 'undefined') return;
  if (isTestRuntime() || typeof window === 'undefined') {
    try {
      localStorage.setItem(key, serialize());
    } catch {
      // Ignore storage quota errors
    }
    return;
  }
  bindMirrorFlushListeners();
  pendingMirrorWriters.set(key, serialize);
  if (pendingMirrorTimer !== null) {
    window.clearTimeout(pendingMirrorTimer);
  }
  pendingMirrorTimer = window.setTimeout(flushAllMirrors, 120);
}

export interface VelocityPoint {
  dateKey: string;
  dayLabel: string;
  fullDateLabel: string;
  mastered: number;
}

export function triggerHapticFeedback(pattern: number | number[] = 10): void {
  try {
    if (triggerNativeHaptic(pattern)) {
      return;
    }
    if (
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      typeof navigator.vibrate === 'function'
    ) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Ignore on unsupported devices or restricted contexts
  }
}

/**
 * Returns the local study-day key (YYYY-MM-DD) using a 04:00 AM local rollover.
 */
export function getLocalDateString(
  date: Date = new Date(),
  rolloverHour: number = STUDY_DAY_ROLLOVER_HOUR
): string {
  const shifted = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours() - rolloverHour,
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
  const year = shifted.getFullYear();
  const month = String(shifted.getMonth() + 1).padStart(2, '0');
  const day = String(shifted.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(
  date: Date = new Date(),
  rolloverHour: number = STUDY_DAY_ROLLOVER_HOUR
): string {
  const shifted = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours() - rolloverHour,
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
  shifted.setDate(shifted.getDate() - 1);
  const year = shifted.getFullYear();
  const month = String(shifted.getMonth() + 1).padStart(2, '0');
  const day = String(shifted.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function confidenceToLegacyEase(confidence: ConfidenceRating): number {
  switch (confidence) {
    case 1:
      return 1.3;
    case 2:
      return 1.7;
    case 3:
      return 2.1;
    case 4:
      return 2.6;
    case 5:
      return 3.0;
    default:
      return 2.5;
  }
}

export function createDefaultSrsState(cardId: string): CardSrsState {
  return {
    cardId,
    confidence: 0,
    consecutiveHighCount: 0,
    consecutiveFiveCount: 0,
    intervalMinutes: 0,
    easeFactor: 2.5,
    repetitions: 0,
    reviewCount: 0,
    lastReviewedAt: null,
    dueAt: new Date(0).toISOString(),
    mastered: false,
    fsrsState: 'new',
    stability: 0,
    difficulty: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    lapses: 0,
    learningSteps: 0,
  };
}

export {
  getDeckSessionKey,
  getSrsStateKey,
  parseSrsStateKey,
  stripDirectionSuffix,
};

export function getCardSrsForDirection(
  srsMap: Record<string, CardSrsState | undefined>,
  cardId: string,
  direction: StudyDirection = 'de-en'
): CardSrsState {
  const stateKey = getSrsStateKey(cardId, direction);
  return srsMap[stateKey] || createDefaultSrsState(stateKey);
}

export function isCardNew(state: CardSrsState): boolean {
  return (
    state.reviewCount === 0 ||
    !state.lastReviewedAt ||
    state.confidence === 0
  );
}

/**
 * Low Confidence smart-deck filter: previously studied cards currently rated 1 or 2.
 */
export function isCardLowConfidence(state: CardSrsState): boolean {
  return !isCardNew(state) && state.confidence > 0 && state.confidence <= 2;
}

export function computeNextSrsState(
  current: CardSrsState,
  rating: RatingKey | LegacyRatingKey,
  now: Date = new Date()
): CardSrsState {
  const normalizedRating = normalizeRatingKey(rating) ?? '1';
  const conf = ratingToConfidence(normalizedRating);
  const prevConsHigh =
    typeof current.consecutiveHighCount === 'number'
      ? current.consecutiveHighCount
      : current.confidence >= 4
      ? 2
      : 0;
  const prevConsFive =
    typeof current.consecutiveFiveCount === 'number'
      ? current.consecutiveFiveCount
      : current.confidence === 5
      ? 1
      : 0;

  const nextConsHigh = conf >= 4 ? prevConsHigh + 1 : 0;
  const nextConsFive = conf === 5 ? prevConsFive + 1 : 0;
  const mastered = conf >= 4;
  const reviewCount = (current.reviewCount || 0) + 1;
  const repetitions = conf >= 4 ? (current.repetitions || 0) + 1 : 0;
  const iso = now.toISOString();

  return {
    cardId: current.cardId,
    confidence: conf,
    consecutiveHighCount: nextConsHigh,
    consecutiveFiveCount: nextConsFive,
    intervalMinutes: 0,
    easeFactor: confidenceToLegacyEase(conf),
    repetitions,
    reviewCount,
    lastReviewedAt: iso,
    dueAt: iso,
    lastRating: normalizedRating,
    mastered,
    fsrsState: mastered ? 'review' : 'learning',
    stability: conf,
    difficulty: 6 - conf,
    elapsedDays: 0,
    scheduledDays: 0,
    lapses: conf <= 2 ? (current.lapses || 0) + 1 : current.lapses || 0,
    learningSteps: nextConsHigh,
  };
}

export function formatConfidenceBadge(
  confidenceOrState: ConfidenceRating | CardSrsState,
  reviewCountArg?: number
): string {
  if (typeof confidenceOrState === 'object') {
    if (isCardNew(confidenceOrState)) return 'Neu';
    return `Stufe ${confidenceOrState.confidence}/5`;
  }
  if (!reviewCountArg || confidenceOrState === 0) return 'Neu';
  return `Stufe ${confidenceOrState}/5`;
}

// ============================================================================
// LEGACY 4-BUTTON MIGRATION & APPEND-ONLY REVIEW LOG REPLAY
// ============================================================================

function isLegacyRatingString(rating: unknown): rating is LegacyRatingKey {
  return (
    rating === 'again' ||
    rating === 'hard' ||
    rating === 'good' ||
    rating === 'easy'
  );
}

function getLogEventOrderRank(entry: ReviewLogEntry): number {
  const kind = entry.eventType ?? 'review';
  if (kind === 'review') return 0;
  if (kind === 'reset') return 1;
  return 2;
}

export function sortAndDedupeReviewLogs(
  logs: ReviewLogEntry[]
): ReviewLogEntry[] {
  const byId = new Map<string, ReviewLogEntry>();
  for (const entry of logs) {
    if (!entry || typeof entry.id !== 'string' || !entry.cardId) continue;
    if (!byId.has(entry.id)) {
      byId.set(entry.id, entry);
    }
  }
  return Array.from(byId.values()).sort((a, b) => {
    const ta = Date.parse(a.reviewedAt || a.timestamp);
    const tb = Date.parse(b.reviewedAt || b.timestamp);
    if (ta !== tb) return ta - tb;
    const rankDiff = getLogEventOrderRank(a) - getLogEventOrderRank(b);
    if (rankDiff !== 0) return rankDiff;
    const ia = typeof a.reviewIndex === 'number' ? a.reviewIndex : Infinity;
    const ib = typeof b.reviewIndex === 'number' ? b.reviewIndex : Infinity;
    if (ia !== ib) return ia - ib;
    return a.id.localeCompare(b.id);
  });
}

/**
 * Migrates legacy 4-button review entries (`again` / `hard` / `good` / `easy`)
 * onto the 1-5 confidence scale (`1` / `2` / `4` / `5`) while keeping ONLY
 * the last legacy rating per card (before any reset or newer 1-5 entries).
 */
export function migrateLegacyReviewLogs(
  rawLogs: ReviewLogEntry[]
): ReviewLogEntry[] {
  const sorted = sortAndDedupeReviewLogs(rawLogs);
  const undoneTargets = new Set<string>();
  for (const entry of sorted) {
    if (entry.eventType === 'undo' && entry.undoTargetId) {
      undoneTargets.add(entry.undoTargetId);
    }
  }

  // Track last active legacy review id per card
  const lastLegacyIdByCard = new Map<string, string>();
  for (const entry of sorted) {
    const kind = entry.eventType ?? 'review';
    if (kind === 'reset') {
      lastLegacyIdByCard.delete(entry.cardId);
      continue;
    }
    if (kind === 'review' && !undoneTargets.has(entry.id)) {
      if (isLegacyRatingString(entry.rating)) {
        lastLegacyIdByCard.set(entry.cardId, entry.id);
      }
    }
  }

  const migrated: ReviewLogEntry[] = [];
  for (const entry of sorted) {
    const kind = entry.eventType ?? 'review';
    const rawRating = entry.rating as unknown;
    if (kind === 'review' && isLegacyRatingString(rawRating)) {
      if (undoneTargets.has(entry.id)) continue;
      if (lastLegacyIdByCard.get(entry.cardId) !== entry.id) {
        // Drop earlier legacy ratings for the same card: take only the last rating per card
        continue;
      }
      migrated.push({
        ...entry,
        rating: LEGACY_RATING_MAP[rawRating],
      });
      continue;
    }

    const normalizedRating = normalizeRatingKey(rawRating) ?? '1';
    migrated.push({
      ...entry,
      rating: normalizedRating,
    });
  }

  return migrated;
}

export function getEffectiveReviewLogs(
  logs: ReviewLogEntry[]
): ReviewLogEntry[] {
  const sorted = migrateLegacyReviewLogs(logs);
  const undoneTargetIds = new Set<string>();
  for (const entry of sorted) {
    if (entry.eventType === 'undo' && entry.undoTargetId) {
      undoneTargetIds.add(entry.undoTargetId);
    }
  }
  return sorted.filter(
    (entry) =>
      (entry.eventType ?? 'review') === 'review' &&
      !undoneTargetIds.has(entry.id)
  );
}

function getEffectiveCardTimelineLogs(
  logs: ReviewLogEntry[]
): ReviewLogEntry[] {
  const sorted = migrateLegacyReviewLogs(logs);
  const undoneTargetIds = new Set<string>();
  for (const entry of sorted) {
    if (entry.eventType === 'undo' && entry.undoTargetId) {
      undoneTargetIds.add(entry.undoTargetId);
    }
  }
  return sorted.filter((entry) => {
    const kind = entry.eventType ?? 'review';
    if (kind === 'reset') return true;
    return kind === 'review' && !undoneTargetIds.has(entry.id);
  });
}

export function loadReviewLogs(): ReviewLogEntry[] {
  if (memoryReviewLogs !== null) {
    return memoryReviewLogs;
  }
  try {
    const raw =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(REVIEW_LOGS_STORAGE_KEY)
        : null;
    if (!raw) {
      memoryReviewLogs = [];
      return memoryReviewLogs;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      memoryReviewLogs = [];
      return memoryReviewLogs;
    }
    const migrated = migrateLegacyReviewLogs(parsed as ReviewLogEntry[]);
    memoryReviewLogs = migrated;
    return memoryReviewLogs;
  } catch {
    memoryReviewLogs = [];
    return memoryReviewLogs;
  }
}

export function saveReviewLogsMirror(
  logs: ReviewLogEntry[],
  alreadyNormalized = false
): void {
  const normalized = alreadyNormalized ? logs : migrateLegacyReviewLogs(logs);
  memoryReviewLogs = normalized;
  scheduleMirrorWrite(REVIEW_LOGS_STORAGE_KEY, () => JSON.stringify(normalized));
}

export function replayCardStateFromLogs(
  cardId: string,
  allLogs: ReviewLogEntry[]
): CardSrsState {
  const cardTimeline = getEffectiveCardTimelineLogs(allLogs).filter(
    (l) => l.cardId === cardId
  );
  let state = createDefaultSrsState(cardId);
  for (const entry of cardTimeline) {
    if (entry.eventType === 'reset') {
      state = createDefaultSrsState(cardId);
      continue;
    }
    const reviewTime = new Date(entry.reviewedAt || entry.timestamp);
    state = computeNextSrsState(state, entry.rating, reviewTime);
  }
  return state;
}

export function replayAllStatesFromLogs(
  cards: VocabCard[],
  allLogs: ReviewLogEntry[],
  existingOrphanStates: Record<string, CardSrsState> = {}
): Record<string, CardSrsState> {
  const timelineLogs = getEffectiveCardTimelineLogs(allLogs);
  const allReferencedCardIds = new Set<string>();
  for (const entry of allLogs) {
    if (entry && entry.cardId) {
      allReferencedCardIds.add(entry.cardId);
    }
  }

  const map: Record<string, CardSrsState> = {};
  for (const [cid, st] of Object.entries(existingOrphanStates)) {
    map[cid] = normalizeStoredSrsState(cid, st);
  }

  for (const c of cards) {
    if (!map[c.id]) map[c.id] = createDefaultSrsState(c.id);
  }
  for (const cid of allReferencedCardIds) {
    map[cid] = createDefaultSrsState(cid);
  }

  const logsByCard = new Map<string, ReviewLogEntry[]>();
  for (const entry of timelineLogs) {
    const list = logsByCard.get(entry.cardId) || [];
    list.push(entry);
    logsByCard.set(entry.cardId, list);
  }

  for (const [cardId, cardLogs] of logsByCard.entries()) {
    let st = createDefaultSrsState(cardId);
    for (const entry of cardLogs) {
      if (entry.eventType === 'reset') {
        st = createDefaultSrsState(cardId);
        continue;
      }
      st = computeNextSrsState(
        st,
        entry.rating,
        new Date(entry.reviewedAt || entry.timestamp)
      );
    }
    map[cardId] = st;
  }

  return map;
}

export function normalizeStoredSrsState(
  cardId: string,
  stored?: Partial<CardSrsState> | null
): CardSrsState {
  const base = createDefaultSrsState(cardId);
  if (!stored || typeof stored !== 'object') return base;

  const normalizedLast = normalizeRatingKey(stored.lastRating);
  let confidence: ConfidenceRating = 0;

  if (
    typeof stored.confidence === 'number' &&
    stored.confidence >= 0 &&
    stored.confidence <= 5
  ) {
    confidence = Math.round(stored.confidence) as ConfidenceRating;
  } else if (normalizedLast) {
    confidence = ratingToConfidence(normalizedLast);
  } else if (stored.mastered) {
    confidence = 4;
  } else if ((stored.reviewCount ?? 0) > 0) {
    confidence = 3;
  }

  const reviewCount = Math.max(0, stored.reviewCount ?? 0);
  if (reviewCount === 0 && !stored.lastReviewedAt) {
    confidence = 0;
  }

  return {
    ...base,
    ...stored,
    cardId,
    confidence,
    consecutiveHighCount:
      typeof stored.consecutiveHighCount === 'number'
        ? stored.consecutiveHighCount
        : confidence >= 4
        ? 2
        : 0,
    consecutiveFiveCount:
      typeof stored.consecutiveFiveCount === 'number'
        ? stored.consecutiveFiveCount
        : confidence === 5
        ? 1
        : 0,
    lastRating: normalizedLast,
    mastered: confidence >= 4,
    easeFactor: confidence > 0 ? confidenceToLegacyEase(confidence) : 2.5,
  };
}

export function deriveStudyStatsFromLogs(
  logs: ReviewLogEntry[],
  now: Date = new Date()
): StudyStats {
  const sortedReviews = getEffectiveReviewLogs(logs);
  const timelineLogs = getEffectiveCardTimelineLogs(logs);
  const todayKey = getLocalDateString(now);
  const yesterdayKey = getYesterdayDateString(now);

  const reviewsByDay: Record<string, number> = {};
  const masteredSetByDay = new Map<string, Set<string>>();
  const currentlyMasteredKeys = new Set<string>();

  let totalTimeStudiedMs = 0;
  let timeStudiedMsToday = 0;
  let recalledCount = 0;

  for (const entry of timelineLogs) {
    const parsedEntry = parseSrsStateKey(entry.cardId);
    const entryDir = entry.direction ?? parsedEntry.direction;
    const stateKey = getSrsStateKey(parsedEntry.cardId, entryDir);
    if (entry.eventType === 'reset') {
      currentlyMasteredKeys.delete(stateKey);
      continue;
    }

    const dayKey =
      entry.studyDayKey ||
      getLocalDateString(new Date(entry.reviewedAt || entry.timestamp));
    reviewsByDay[dayKey] = (reviewsByDay[dayKey] || 0) + 1;

    const dur =
      typeof entry.durationMs === 'number' && entry.durationMs > 0
        ? Math.min(60_000, entry.durationMs)
        : 0;
    totalTimeStudiedMs += dur;
    if (dayKey === todayKey) {
      timeStudiedMsToday += dur;
    }

    const norm = normalizeRatingKey(entry.rating) ?? '1';
    const conf = ratingToConfidence(norm);
    if (conf >= 3) {
      recalledCount += 1;
    }
    if (conf >= 4) {
      currentlyMasteredKeys.add(stateKey);
    } else if (conf <= 2) {
      currentlyMasteredKeys.delete(stateKey);
    }

    const uniqueBaseMastered = new Set<string>();
    for (const k of currentlyMasteredKeys) {
      uniqueBaseMastered.add(parseSrsStateKey(k).cardId);
    }
    masteredSetByDay.set(dayKey, uniqueBaseMastered);
  }

  const activeDayKeys = Object.keys(reviewsByDay).sort();
  const lastStudyDate =
    activeDayKeys.length > 0 ? activeDayKeys[activeDayKeys.length - 1] : null;
  const totalReviewsToday = reviewsByDay[todayKey] || 0;

  let streakDays = 0;
  const activeDaySet = new Set(activeDayKeys);
  let cursorDate: Date | null = null;

  if (activeDaySet.has(todayKey)) {
    cursorDate = new Date(now);
  } else if (activeDaySet.has(yesterdayKey)) {
    cursorDate = new Date(now);
    cursorDate.setDate(cursorDate.getDate() - 1);
  }

  if (cursorDate) {
    while (true) {
      const key = getLocalDateString(cursorDate);
      if (activeDaySet.has(key)) {
        streakDays += 1;
        cursorDate.setDate(cursorDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  const dailyMasteredHistory: Record<string, number> = {};
  for (const [dayKey, set] of masteredSetByDay.entries()) {
    dailyMasteredHistory[dayKey] = set.size;
  }

  const retentionPct =
    sortedReviews.length > 0
      ? Math.round((recalledCount / sortedReviews.length) * 100)
      : 100;

  const stats: StudyStats = {
    streakDays,
    lastStudyDate,
    totalReviewsToday,
    todayDate: todayKey,
    dailyMasteredHistory,
    dailyReviewsHistory: reviewsByDay,
    retentionPct,
    timeStudiedMsToday,
    totalTimeStudiedMs,
  };

  scheduleMirrorWrite(STATS_STORAGE_KEY, () => JSON.stringify(stats));

  return stats;
}

export interface RateCardResult {
  nextState: CardSrsState;
  updatedMap: Record<string, CardSrsState>;
  logEntry: ReviewLogEntry;
  allLogs: ReviewLogEntry[];
  updatedStats: StudyStats;
}

export function appendRatingEvent(params: {
  cardId: string;
  rating: RatingKey;
  srsMap: Record<string, CardSrsState>;
  deckId?: string;
  direction?: StudyDirection;
  reviewIndex?: number;
  now?: Date;
  durationMs?: number;
}): RateCardResult {
  const now = params.now || new Date();
  const parsedIncoming = parseSrsStateKey(params.cardId);
  const direction: StudyDirection =
    params.direction ?? parsedIncoming.direction;
  const stateKey = getSrsStateKey(parsedIncoming.cardId, direction);
  const current =
    params.srsMap[stateKey] || createDefaultSrsState(stateKey);
  const nextState = computeNextSrsState(current, params.rating, now);

  const clampedDuration =
    typeof params.durationMs === 'number' && Number.isFinite(params.durationMs)
      ? Math.min(60_000, Math.max(50, Math.round(params.durationMs)))
      : 0;

  const currentLogs = loadReviewLogs();
  const nextReviewIndex =
    typeof params.reviewIndex === 'number'
      ? params.reviewIndex
      : currentLogs.reduce(
          (maxIdx, l) =>
            typeof l.reviewIndex === 'number' && l.reviewIndex > maxIdx
              ? l.reviewIndex
              : maxIdx,
          -1
        ) + 1;

  const logEntry: ReviewLogEntry = {
    id: generateUuid(),
    eventType: 'review',
    undoTargetId: null,
    cardId: stateKey,
    deckId: params.deckId,
    direction,
    reviewIndex: nextReviewIndex,
    timestamp: now.toISOString(),
    reviewedAt: now.toISOString(),
    studyDayKey: getLocalDateString(now),
    rating: params.rating,
    stateBefore:
      current.fsrsState || (current.reviewCount === 0 ? 'new' : 'learning'),
    stateAfter: nextState.fsrsState || 'learning',
    dueBefore: current.dueAt,
    dueAfter: nextState.dueAt,
    intervalMinutesBefore: 0,
    intervalMinutesAfter: 0,
    stabilityAfter: nextState.confidence,
    difficultyAfter: 6 - nextState.confidence,
    durationMs: clampedDuration,
    deviceId: getOrCreateDeviceId(),
    syncedAt: null,
  };

  const nextLogs = [...currentLogs, logEntry];
  saveReviewLogsMirror(nextLogs, true);

  const updatedMap: Record<string, CardSrsState> = {
    ...params.srsMap,
    [stateKey]: nextState,
  };
  saveSrsMap(updatedMap);

  void idbAppendReviewLogAndState(logEntry, nextState);

  const updatedStats = deriveStudyStatsFromLogs(nextLogs, now);
  void syncReviewEventToSupabase(logEntry, nextState, updatedStats);

  return {
    nextState,
    updatedMap,
    logEntry,
    allLogs: nextLogs,
    updatedStats,
  };
}

export function undoLastReview(
  _cards: VocabCard[],
  currentSrsMap: Record<string, CardSrsState>,
  now: Date = new Date(),
  options?: { deckId?: string; direction?: StudyDirection }
): {
  undoneEntry: ReviewLogEntry | null;
  undoMarkerEntry: ReviewLogEntry | null;
  updatedMap: Record<string, CardSrsState>;
  updatedStats: StudyStats;
  remainingLogs: ReviewLogEntry[];
  allLogs: ReviewLogEntry[];
} {
  const allLogs = loadReviewLogs();
  const effectiveLogs = getEffectiveReviewLogs(allLogs);
  const latestResetTsByCard = new Map<string, number>();
  for (const entry of allLogs) {
    if (entry.eventType === 'reset') {
      const ts = Date.parse(entry.reviewedAt || entry.timestamp);
      const prev = latestResetTsByCard.get(entry.cardId) ?? -Infinity;
      if (ts >= prev) latestResetTsByCard.set(entry.cardId, ts);
    }
  }
  const undoableLogs = effectiveLogs.filter((entry) => {
    const resetTs = latestResetTsByCard.get(entry.cardId);
    if (resetTs !== undefined) {
      const entryTs = Date.parse(entry.reviewedAt || entry.timestamp);
      if (entryTs <= resetTs) return false;
    }
    if (options?.direction) {
      const entryDir =
        entry.direction ?? parseSrsStateKey(entry.cardId).direction;
      if (entryDir !== options.direction) return false;
    }
    if (options?.deckId && entry.deckId && entry.deckId !== options.deckId) {
      return false;
    }
    return true;
  });

  if (undoableLogs.length === 0) {
    return {
      undoneEntry: null,
      undoMarkerEntry: null,
      updatedMap: currentSrsMap,
      updatedStats: deriveStudyStatsFromLogs(allLogs, now),
      remainingLogs: effectiveLogs,
      allLogs,
    };
  }

  const undoneEntry = undoableLogs[undoableLogs.length - 1];
  const undoIso = now.toISOString();
  const undoneDirection =
    undoneEntry.direction ?? parseSrsStateKey(undoneEntry.cardId).direction;

  const undoMarkerEntry: ReviewLogEntry = {
    id: generateUuid(),
    eventType: 'undo',
    undoTargetId: undoneEntry.id,
    cardId: undoneEntry.cardId,
    deckId: undoneEntry.deckId,
    direction: undoneDirection,
    timestamp: undoIso,
    reviewedAt: undoIso,
    studyDayKey: getLocalDateString(now),
    rating: undoneEntry.rating,
    stateBefore: undoneEntry.stateAfter,
    stateAfter: undoneEntry.stateBefore,
    dueBefore: undoneEntry.dueAfter,
    dueAfter: undoneEntry.dueBefore,
    intervalMinutesBefore: 0,
    intervalMinutesAfter: 0,
    stabilityAfter: 0,
    difficultyAfter: 0,
    durationMs: 0,
    deviceId: getOrCreateDeviceId(),
    syncedAt: null,
  };

  const nextAllLogs = [...allLogs, undoMarkerEntry];
  saveReviewLogsMirror(nextAllLogs);

  const restoredCardState = replayCardStateFromLogs(
    undoneEntry.cardId,
    nextAllLogs
  );
  const updatedMap: Record<string, CardSrsState> = {
    ...currentSrsMap,
    [undoneEntry.cardId]: restoredCardState,
  };
  saveSrsMap(updatedMap);

  void idbAppendReviewLogAndState(undoMarkerEntry, restoredCardState);

  const remainingLogs = getEffectiveReviewLogs(nextAllLogs);
  const updatedStats = deriveStudyStatsFromLogs(nextAllLogs, now);
  void syncReviewEventToSupabase(
    undoMarkerEntry,
    restoredCardState,
    updatedStats
  );

  return {
    undoneEntry,
    undoMarkerEntry,
    updatedMap,
    updatedStats,
    remainingLogs,
    allLogs: nextAllLogs,
  };
}

export function mergeReviewLogsFromDevices(
  localLogs: ReviewLogEntry[],
  remoteLogs: ReviewLogEntry[],
  cards: VocabCard[],
  now: Date = new Date()
): {
  mergedLogs: ReviewLogEntry[];
  srsMap: Record<string, CardSrsState>;
  stats: StudyStats;
} {
  const mergedLogs = migrateLegacyReviewLogs([...localLogs, ...remoteLogs]);
  saveReviewLogsMirror(mergedLogs);
  const srsMap = replayAllStatesFromLogs(cards, mergedLogs);
  saveSrsMap(srsMap);
  const stats = deriveStudyStatsFromLogs(mergedLogs, now);
  void idbPutReviewLogsBulk(mergedLogs, srsMap);
  return { mergedLogs, srsMap, stats };
}

export async function hydrateEngineFromIndexedDB(
  _currentCards: VocabCard[],
  localWorkspace?: RemoteWorkspaceSnapshot
): Promise<{
  cards: VocabCard[];
  srsMap: Record<string, CardSrsState>;
  stats: StudyStats;
  logs: ReviewLogEntry[];
  remoteWorkspace?: RemoteWorkspaceSnapshot | null;
}> {
  void requestPersistentStorage();

  const [idbLogs, idbStates, idbCustomCards] = await Promise.all([
    idbGetAllReviewLogs(),
    idbGetAllCardStates(),
    idbGetAllCustomCards(),
  ]);

  const localCustomCards = loadCustomCardsOnly();
  const mergedCustomMap = new Map<string, VocabCard>();
  for (const c of [...localCustomCards, ...idbCustomCards]) {
    if (c && c.id && !INITIAL_CARD_ID_SET.has(c.id)) {
      mergedCustomMap.set(c.id, c);
    }
  }

  const localLogs = loadReviewLogs();
  const baseLocalLogs = migrateLegacyReviewLogs([...idbLogs, ...localLogs]);
  const baseCustomCards = validateAndNormalizeContentCards(
    Array.from(mergedCustomMap.values())
  );

  const tempCards =
    baseCustomCards.length > 0
      ? [...INITIAL_CARDS, ...baseCustomCards]
      : INITIAL_CARDS;
  const localSrs = loadSrsMap(tempCards);
  const baseOrphanStates: Record<string, CardSrsState> = {};
  for (const [k, v] of Object.entries({ ...idbStates, ...localSrs })) {
    baseOrphanStates[k] = normalizeStoredSrsState(k, v);
  }

  const remoteResult = await pullAndSyncSupabaseState({
    localLogs: baseLocalLogs,
    localStates: baseOrphanStates,
    localCustomCards: baseCustomCards,
    localWorkspace,
  });

  if (remoteResult?.remoteCustomCards?.length) {
    for (const rc of remoteResult.remoteCustomCards) {
      if (rc && rc.id && !INITIAL_CARD_ID_SET.has(rc.id)) {
        mergedCustomMap.set(rc.id, rc);
        void idbSaveCustomCard(rc);
      }
    }
    const mergedCustomList = Array.from(mergedCustomMap.values());
    scheduleMirrorWrite(CUSTOM_CARDS_STORAGE_KEY, () =>
      JSON.stringify(mergedCustomList)
    );
  }

  const normalizedCustomCards =
    remoteResult?.remoteCustomCards?.length
      ? validateAndNormalizeContentCards(Array.from(mergedCustomMap.values()))
      : baseCustomCards;

  const allCards =
    normalizedCustomCards.length > 0
      ? [...INITIAL_CARDS, ...normalizedCustomCards]
      : INITIAL_CARDS;

  const mergedLogs = migrateLegacyReviewLogs([
    ...baseLocalLogs,
    ...(remoteResult?.remoteLogs || []),
  ]);
  saveReviewLogsMirror(mergedLogs, true);

  const orphanBase: Record<string, CardSrsState> = {};
  for (const [k, v] of Object.entries({
    ...(remoteResult?.remoteStates || {}),
    ...baseOrphanStates,
  })) {
    orphanBase[k] = normalizeStoredSrsState(k, v);
  }

  const srsMap =
    mergedLogs.length > 0
      ? replayAllStatesFromLogs(allCards, mergedLogs, orphanBase)
      : orphanBase;
  saveSrsMap(srsMap);

  if (mergedLogs.length > idbLogs.length || remoteResult) {
    void idbPutReviewLogsBulk(mergedLogs, srsMap);
  }

  const stats = deriveStudyStatsFromLogs(mergedLogs);

  if (remoteResult) {
    void pushAllStatesAndStatsToSupabase(srsMap, stats);
  }

  return {
    cards: allCards,
    srsMap,
    stats,
    logs: mergedLogs,
    remoteWorkspace: remoteResult?.remoteWorkspace ?? null,
  };
}

function loadCustomCardsOnly(): VocabCard[] {
  try {
    const raw =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(CUSTOM_CARDS_STORAGE_KEY)
        : null;
    if (!raw) return [];
    const custom: VocabCard[] = JSON.parse(raw);
    if (!Array.isArray(custom) || custom.length === 0) return [];
    return custom.filter((c) => c && c.id && !INITIAL_CARD_ID_SET.has(c.id));
  } catch {
    return [];
  }
}

export function loadAllCards(): VocabCard[] {
  const custom = loadCustomCardsOnly();
  if (custom.length === 0) return INITIAL_CARDS;
  const normalizedCustom = validateAndNormalizeContentCards(custom);
  return [...INITIAL_CARDS, ...normalizedCustom];
}

export function saveCustomCard(newCard: VocabCard): VocabCard[] {
  void idbSaveCustomCard(newCard);
  void syncCustomCardToSupabase(newCard);
  try {
    const custom = loadCustomCardsOnly();
    const updated = [...custom, newCard];
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CUSTOM_CARDS_STORAGE_KEY, JSON.stringify(updated));
    }
    const normalizedCustom = validateAndNormalizeContentCards(updated);
    return [...INITIAL_CARDS, ...normalizedCustom];
  } catch {
    return INITIAL_CARDS;
  }
}

export function loadSrsMap(cards: VocabCard[]): Record<string, CardSrsState> {
  const map: Record<string, CardSrsState> = {};
  for (const card of cards) {
    map[card.id] = createDefaultSrsState(card.id);
  }
  try {
    const raw =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(SRS_STORAGE_KEY)
        : null;
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, CardSrsState>;
      for (const [cardId, storedState] of Object.entries(parsed)) {
        if (storedState && typeof storedState === 'object') {
          map[cardId] = normalizeStoredSrsState(cardId, storedState);
        }
      }
    }
  } catch {
    // Fallback to default map
  }

  const logs = loadReviewLogs();
  if (logs.length > 0) {
    return replayAllStatesFromLogs(cards, logs, map);
  }

  return map;
}

export function saveSrsMap(map: Record<string, CardSrsState>): void {
  scheduleMirrorWrite(SRS_STORAGE_KEY, () => JSON.stringify(map));
}

export function resetAllSrsProgress(
  cards: VocabCard[]
): Record<string, CardSrsState> {
  clearPendingMirrors();
  memoryReviewLogs = [];
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(REVIEW_LOGS_STORAGE_KEY);
      localStorage.removeItem(SRS_STORAGE_KEY);
      localStorage.removeItem(STATS_STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
  const emptyStats = deriveStudyStatsFromLogs([]);
  void idbClearReviewsForCards();
  void deleteReviewsFromSupabase(undefined, emptyStats);

  const fresh: Record<string, CardSrsState> = {};
  for (const c of cards) {
    fresh[c.id] = createDefaultSrsState(c.id);
  }
  saveSrsMap(fresh);
  return fresh;
}

export function resetCardsSrsProgress(
  cardIds: string[],
  currentSrsMap: Record<string, CardSrsState>,
  now: Date = new Date(),
  direction: StudyDirection = 'de-en'
): {
  updatedMap: Record<string, CardSrsState>;
  updatedStats: StudyStats;
} {
  const uniqueIds = Array.from(
    new Set(
      cardIds
        .filter(Boolean)
        .map((id) => getSrsStateKey(id, direction))
    )
  );
  const existingLogs = loadReviewLogs();
  const resetEntries: ReviewLogEntry[] = [];
  const resetStateSnapshot: Record<string, CardSrsState> = {};
  const nextMap: Record<string, CardSrsState> = { ...currentSrsMap };

  const maxTsByCard = new Map<string, number>();
  for (const entry of existingLogs) {
    const ts = Date.parse(entry.reviewedAt || entry.timestamp);
    if (!Number.isNaN(ts)) {
      const prev = maxTsByCard.get(entry.cardId) ?? -Infinity;
      if (ts > prev) maxTsByCard.set(entry.cardId, ts);
    }
  }

  const deviceId = getOrCreateDeviceId();

  for (const cid of uniqueIds) {
    const prevFromMap = currentSrsMap[cid];
    const prevReplayed = replayCardStateFromLogs(cid, existingLogs);
    const hasProgress =
      (prevFromMap && !isCardNew(prevFromMap)) || !isCardNew(prevReplayed);
    const freshState = createDefaultSrsState(cid);

    nextMap[cid] = freshState;
    resetStateSnapshot[cid] = freshState;

    if (hasProgress) {
      const priorState =
        prevFromMap && !isCardNew(prevFromMap) ? prevFromMap : prevReplayed;
      const resetMs = Math.max(
        now.getTime(),
        maxTsByCard.get(cid) ?? now.getTime()
      );
      const resetDate = new Date(resetMs);
      const resetIso = resetDate.toISOString();

      resetEntries.push({
        id: generateUuid(),
        eventType: 'reset',
        undoTargetId: null,
        cardId: cid,
        direction,
        timestamp: resetIso,
        reviewedAt: resetIso,
        studyDayKey: getLocalDateString(resetDate),
        rating: '1',
        stateBefore: priorState.fsrsState || 'learning',
        stateAfter: 'new',
        dueBefore: priorState.dueAt,
        dueAfter: freshState.dueAt,
        intervalMinutesBefore: 0,
        intervalMinutesAfter: 0,
        stabilityAfter: 0,
        difficultyAfter: 0,
        durationMs: 0,
        deviceId,
        syncedAt: null,
      });
    }
  }

  const nextLogs =
    resetEntries.length > 0
      ? sortAndDedupeReviewLogs([...existingLogs, ...resetEntries])
      : existingLogs;

  if (resetEntries.length > 0) {
    saveReviewLogsMirror(nextLogs);
  }
  saveSrsMap(nextMap);

  const updatedStats = deriveStudyStatsFromLogs(nextLogs, now);

  if (uniqueIds.length > 0) {
    void idbPutReviewLogsBulk(resetEntries, resetStateSnapshot);
    void syncBatchReviewEventsToSupabase(
      resetEntries,
      Object.values(resetStateSnapshot),
      updatedStats
    );
  }

  return { updatedMap: nextMap, updatedStats };
}

export function loadStudyStats(now: Date = new Date()): StudyStats {
  const logs = loadReviewLogs();
  return deriveStudyStatsFromLogs(logs, now);
}

export function recordStudyReview(
  _currentStats: StudyStats,
  _totalMasteredNow?: number,
  now: Date = new Date()
): StudyStats {
  const logs = loadReviewLogs();
  return deriveStudyStatsFromLogs(logs, now);
}

export function getLast7DaysVelocityData(
  cards: VocabCard[],
  srsMap: Record<string, CardSrsState>,
  stats: StudyStats,
  now: Date = new Date()
): VelocityPoint[] {
  const todayKey = getLocalDateString(now);

  let currentMasteredCount = 0;
  for (const card of cards) {
    const st = srsMap[card.id];
    if (st && st.mastered) {
      currentMasteredCount += 1;
    }
  }

  const history = stats.dailyMasteredHistory || {};

  const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  });
  const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const points: VelocityPoint[] = [];
  let runningCarry = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = getLocalDateString(d);
    const isToday = key === todayKey;

    if (typeof history[key] === 'number') {
      runningCarry = history[key];
    }

    const recordedVal = isToday
      ? Math.max(currentMasteredCount, runningCarry)
      : runningCarry;

    points.push({
      dateKey: key,
      dayLabel: isToday ? 'Today' : weekdayFormatter.format(d),
      fullDateLabel: fullDateFormatter.format(d),
      mastered: recordedVal,
    });
  }

  return points;
}

export type ThemeId = 'nordic' | 'hero' | 'coss';
export type ColorMode = 'light' | 'dark';

export interface ThemePreferences {
  themeId: ThemeId;
  colorMode: ColorMode;
}

export type AppTheme = ThemeId;

const THEME_V2_STORAGE_KEY = 'wortschatz_theme_v2';

const META_THEME_COLORS: Record<string, string> = {
  'nordic:light': '#FAF8F5',
  'nordic:dark': '#171412',
  'hero:light': '#F8FAFC',
  'hero:dark': '#09090B',
  'coss:light': '#FAFAFA',
  'coss:dark': '#09090B',
};

export function loadThemePreferences(): ThemePreferences {
  try {
    const savedV2 = localStorage.getItem(THEME_V2_STORAGE_KEY);
    if (savedV2) {
      const parsed = JSON.parse(savedV2) as Partial<ThemePreferences>;
      const themeId: ThemeId =
        parsed.themeId === 'nordic' ||
        parsed.themeId === 'hero' ||
        parsed.themeId === 'coss'
          ? parsed.themeId
          : 'nordic';
      const colorMode: ColorMode =
        parsed.colorMode === 'dark' || parsed.colorMode === 'light'
          ? parsed.colorMode
          : typeof window !== 'undefined' &&
            window.matchMedia?.('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      return { themeId, colorMode };
    }

    const legacy = localStorage.getItem(THEME_STORAGE_KEY);
    if (legacy === 'dark') {
      return { themeId: 'nordic', colorMode: 'dark' };
    }
    if (legacy === 'light') {
      return { themeId: 'hero', colorMode: 'light' };
    }
    if (legacy === 'nordic') {
      return { themeId: 'nordic', colorMode: 'light' };
    }
  } catch {
    // Fallback
  }

  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches;

  return {
    themeId: 'nordic',
    colorMode: prefersDark ? 'dark' : 'light',
  };
}

export function applyThemePreferencesToDom(
  prefs: ThemePreferences,
  useViewTransition = false
): void {
  if (typeof document === 'undefined') return;

  const updateDom = () => {
    const root = document.documentElement;
    root.setAttribute('data-theme', prefs.themeId);
    root.classList.remove('theme-nordic', 'theme-hero', 'theme-coss', 'dark');
    root.classList.add(`theme-${prefs.themeId}`);
    if (prefs.colorMode === 'dark') {
      root.classList.add('dark');
    }
    root.style.colorScheme = prefs.colorMode;

    const resolvedThemeColor =
      META_THEME_COLORS[`${prefs.themeId}:${prefs.colorMode}`] ||
      (prefs.colorMode === 'dark' ? '#171412' : '#FAF8F5');
    root.style.backgroundColor = resolvedThemeColor;
    if (document.body) {
      document.body.style.backgroundColor = resolvedThemeColor;
      document.body.style.colorScheme = prefs.colorMode;
    }

    document
      .querySelectorAll('meta[data-boot-theme-color="true"]')
      .forEach((node) => node.remove());

    let metaEl = document.getElementById(
      'meta-theme-color'
    ) as HTMLMetaElement | null;
    if (!metaEl || metaEl.getAttribute('content') !== resolvedThemeColor) {
      if (metaEl) {
        metaEl.remove();
      }
      metaEl = document.createElement('meta');
      metaEl.id = 'meta-theme-color';
      metaEl.name = 'theme-color';
      metaEl.content = resolvedThemeColor;
      document.head.appendChild(metaEl);
    }

    const colorSchemeEl = document.getElementById('meta-color-scheme');
    if (colorSchemeEl) {
      colorSchemeEl.setAttribute('content', prefs.colorMode);
    }

    const appleStatusBarEl = document.getElementById('meta-apple-status-bar');
    if (appleStatusBarEl) {
      appleStatusBarEl.setAttribute(
        'content',
        prefs.colorMode === 'dark' ? 'black-translucent' : 'default'
      );
    }

    void syncNativeSystemBars(prefs.colorMode, resolvedThemeColor);

    try {
      localStorage.setItem(THEME_V2_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage errors
    }

    if (useViewTransition) {
      void syncWorkspaceToSupabase({ themePrefs: prefs });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('themechange', { detail: prefs }));
    }
  };

  const docWithTransition = document as Document & {
    startViewTransition?: (cb: () => void) => void;
  };
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (
    useViewTransition &&
    !reducedMotion &&
    typeof docWithTransition.startViewTransition === 'function'
  ) {
    docWithTransition.startViewTransition(updateDom);
  } else {
    updateDom();
  }
}

export function speakGermanText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.94;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const deVoice =
      voices.find(
        (v) =>
          v.lang === 'de-DE' &&
          /Google|Anna|Markus|Petra|Premium|Natural/i.test(v.name)
      ) ||
      voices.find((v) => v.lang === 'de-DE') ||
      voices.find((v) => v.lang.toLowerCase().startsWith('de'));

    if (deVoice) {
      utterance.voice = deVoice;
    }

    utterance.onstart = () => {
      onStart?.();
    };
    utterance.onend = () => {
      onEnd?.();
    };
    utterance.onerror = () => {
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    onEnd?.();
    return false;
  }
}
