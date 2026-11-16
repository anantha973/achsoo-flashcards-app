import {
  type Card as FsrsCard,
  type Grade,
  Rating,
  State,
  createEmptyCard,
  fsrs,
  generatorParameters,
} from 'ts-fsrs';
import {
  CardSrsState,
  FsrsStateKind,
  INITIAL_CARDS,
  RatingKey,
  ReviewLogEntry,
  StudyStats,
  VocabCard,
  validateAndNormalizeContentCards,
} from '../data/vocabData';
import {
  generateUuid,
  getOrCreateDeviceId,
  idbAppendReviewLogAndState,
  idbClearReviewsForCards,
  idbDeleteReviewLogAndPutState,
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
  syncCustomCardToSupabase,
  syncReviewEventToSupabase,
  syncWorkspaceToSupabase,
} from './supabaseSync';

export const STUDY_DAY_ROLLOVER_HOUR = 4; // 04:00 local time rollover (Anki standard)
export const MATURE_INTERVAL_DAYS = 21;
export const MATURE_INTERVAL_MINUTES = MATURE_INTERVAL_DAYS * 1440;

const SRS_STORAGE_KEY = 'wortschatz_srs_v2';
const REVIEW_LOGS_STORAGE_KEY = 'wortschatz_review_logs_v2';
const STATS_STORAGE_KEY = 'wortschatz_stats_v2';
const THEME_STORAGE_KEY = 'wortschatz_theme_v1';
const CUSTOM_CARDS_STORAGE_KEY = 'wortschatz_custom_cards_v1';

// Deterministic FSRS scheduler instance (fuzz disabled so log replay is bit-exact across devices)
const fsrsScheduler = fsrs(
  generatorParameters({
    enable_fuzz: false,
    enable_short_term: true,
  })
);

const RATING_TO_FSRS: Record<RatingKey, Grade> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

const FSRS_STATE_TO_KIND: Record<State, FsrsStateKind> = {
  [State.New]: 'new',
  [State.Learning]: 'learning',
  [State.Review]: 'review',
  [State.Relearning]: 'relearning',
};

const KIND_TO_FSRS_STATE: Record<FsrsStateKind, State> = {
  new: State.New,
  learning: State.Learning,
  review: State.Review,
  relearning: State.Relearning,
};

// In-memory append-only review log cache (authoritative runtime log, backed by IndexedDB + localStorage mirror)
let memoryReviewLogs: ReviewLogEntry[] | null = null;

export interface VelocityPoint {
  dateKey: string;
  dayLabel: string;
  fullDateLabel: string;
  mastered: number;
}

export function triggerHapticFeedback(pattern: number | number[] = 10): void {
  try {
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
 * Using local calendar components with `getHours() - rolloverHour` is DST-safe.
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

export function difficultyToEaseFactor(difficulty?: number): number {
  if (typeof difficulty !== 'number' || Number.isNaN(difficulty) || difficulty <= 0) {
    return 2.5;
  }
  // Map FSRS difficulty [1..10] (1 = easiest, 10 = hardest) onto [1.30..3.00] ease scale for UI compatibility
  const mapped = 3.0 - ((difficulty - 1) / 9) * 1.7;
  return Math.max(1.3, Math.min(3.0, Number(mapped.toFixed(2))));
}

export function createDefaultSrsState(cardId: string): CardSrsState {
  return {
    cardId,
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

function toFsrsCard(state: CardSrsState, now: Date): FsrsCard {
  const base = createEmptyCard(now);
  if (!state.lastReviewedAt || state.reviewCount === 0) {
    return base;
  }
  const fsrsStateEnum = state.fsrsState
    ? KIND_TO_FSRS_STATE[state.fsrsState]
    : state.mastered
    ? State.Review
    : State.Learning;

  return {
    ...base,
    due: new Date(state.dueAt),
    stability: state.stability ?? Math.max(0.2, state.intervalMinutes / 1440),
    difficulty:
      state.difficulty && state.difficulty > 0
        ? state.difficulty
        : Math.max(
            1,
            Math.min(10, 1 + ((3.0 - (state.easeFactor || 2.5)) / 1.7) * 9)
          ),
    scheduled_days:
      state.scheduledDays ?? Math.floor(state.intervalMinutes / 1440),
    reps: state.reviewCount,
    lapses: state.lapses ?? 0,
    learning_steps: state.learningSteps ?? 0,
    state: fsrsStateEnum,
    last_review: new Date(state.lastReviewedAt),
  };
}

export function isCardNew(state: CardSrsState): boolean {
  return (
    state.reviewCount === 0 ||
    !state.lastReviewedAt ||
    state.fsrsState === 'new'
  );
}

/**
 * A card is "due" ONLY if it has been reviewed at least once (not an unseen New card)
 * AND its scheduled `dueAt` timestamp is at or before `now`.
 */
export function isCardDueToday(
  state: CardSrsState,
  now: Date = new Date()
): boolean {
  if (isCardNew(state)) return false;
  const dueTime = new Date(state.dueAt).getTime();
  if (Number.isNaN(dueTime)) return false;
  return dueTime <= now.getTime();
}

export function computeNextSrsState(
  current: CardSrsState,
  rating: RatingKey,
  now: Date = new Date()
): CardSrsState {
  const fsrsCard = toFsrsCard(current, now);
  const grade = RATING_TO_FSRS[rating];
  const scheduling = fsrsScheduler.next(fsrsCard, now, grade);
  const nextFsrs = scheduling.card;
  const elapsedDays = current.lastReviewedAt
    ? Math.max(
        0,
        Math.floor(
          (now.getTime() - new Date(current.lastReviewedAt).getTime()) /
            86_400_000
        )
      )
    : 0;

  const diffMs = Math.max(60_000, nextFsrs.due.getTime() - now.getTime());
  const intervalMinutes = Math.max(1, Math.round(diffMs / 60_000));
  const fsrsStateKind = FSRS_STATE_TO_KIND[nextFsrs.state] || 'learning';
  const scheduledDays = nextFsrs.scheduled_days;

  // A card is "mastered" (mature) only when it is in FSRS Review state with an interval >= 21 days
  const mastered =
    fsrsStateKind === 'review' &&
    (scheduledDays >= MATURE_INTERVAL_DAYS ||
      intervalMinutes >= MATURE_INTERVAL_MINUTES);

  const easeFactor = difficultyToEaseFactor(nextFsrs.difficulty);
  const repetitions =
    rating === 'again'
      ? 0
      : fsrsStateKind === 'review'
      ? (current.repetitions || 0) + 1
      : current.repetitions || 0;

  return {
    cardId: current.cardId,
    intervalMinutes,
    easeFactor,
    repetitions,
    reviewCount: nextFsrs.reps,
    lastReviewedAt: now.toISOString(),
    dueAt: nextFsrs.due.toISOString(),
    lastRating: rating,
    mastered,
    fsrsState: fsrsStateKind,
    stability: Number(nextFsrs.stability.toFixed(4)),
    difficulty: Number(nextFsrs.difficulty.toFixed(4)),
    elapsedDays,
    scheduledDays,
    lapses: nextFsrs.lapses,
    learningSteps: nextFsrs.learning_steps,
  };
}

export function formatMinutesAsGermanInterval(intervalMinutes: number): string {
  if (intervalMinutes <= 1) return '< 1 Min.';
  if (intervalMinutes < 60) return `${Math.round(intervalMinutes)} Min.`;
  if (intervalMinutes < 1440) {
    const hours = Math.max(1, Math.round(intervalMinutes / 60));
    return `${hours} Std.`;
  }
  const days = Math.max(1, Math.round(intervalMinutes / 1440));
  return `${days} ${days === 1 ? 'Tag' : 'Tage'}`;
}

export function getPreviewIntervalLabel(
  current: CardSrsState,
  rating: RatingKey,
  now: Date = new Date()
): string {
  const previewState = computeNextSrsState(current, rating, now);
  return formatMinutesAsGermanInterval(previewState.intervalMinutes);
}

export function formatIntervalBadge(
  intervalMinutes: number,
  reviewCount: number
): string {
  if (reviewCount === 0) return 'Neu';
  return formatMinutesAsGermanInterval(intervalMinutes);
}

// ============================================================================
// APPEND-ONLY REVIEW LOG & DETERMINISTIC STATE REPLAY
// ============================================================================

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
    return a.id.localeCompare(b.id);
  });
}

/**
 * Resolves append-only "undo" marker events against "review" events.
 * The underlying log array remains strictly append-only for idempotent multi-device sync,
 * while state replay and statistics operate on the non-undone review events.
 */
export function getEffectiveReviewLogs(
  logs: ReviewLogEntry[]
): ReviewLogEntry[] {
  const sorted = sortAndDedupeReviewLogs(logs);
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
    memoryReviewLogs = sortAndDedupeReviewLogs(parsed as ReviewLogEntry[]);
    return memoryReviewLogs;
  } catch {
    memoryReviewLogs = [];
    return memoryReviewLogs;
  }
}

export function saveReviewLogsMirror(logs: ReviewLogEntry[]): void {
  const normalized = sortAndDedupeReviewLogs(logs);
  memoryReviewLogs = normalized;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(REVIEW_LOGS_STORAGE_KEY, JSON.stringify(normalized));
    }
  } catch {
    // Ignore storage quota errors in localStorage mirror; IndexedDB is primary
  }
}

export function replayCardStateFromLogs(
  cardId: string,
  allLogs: ReviewLogEntry[]
): CardSrsState {
  const effectiveCardLogs = getEffectiveReviewLogs(allLogs).filter(
    (l) => l.cardId === cardId
  );
  let state = createDefaultSrsState(cardId);
  for (const entry of effectiveCardLogs) {
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
  const effectiveLogs = getEffectiveReviewLogs(allLogs);
  const allReferencedCardIds = new Set<string>();
  for (const entry of allLogs) {
    if (entry && entry.cardId) {
      allReferencedCardIds.add(entry.cardId);
    }
  }

  const map: Record<string, CardSrsState> = { ...existingOrphanStates };

  for (const c of cards) {
    map[c.id] = createDefaultSrsState(c.id);
  }
  for (const cid of allReferencedCardIds) {
    map[cid] = createDefaultSrsState(cid);
  }

  // Group effective (non-undone) logs by cardId (including orphaned cardIds)
  const logsByCard = new Map<string, ReviewLogEntry[]>();
  for (const entry of effectiveLogs) {
    const list = logsByCard.get(entry.cardId) || [];
    list.push(entry);
    logsByCard.set(entry.cardId, list);
  }

  for (const [cardId, cardLogs] of logsByCard.entries()) {
    let st = createDefaultSrsState(cardId);
    for (const entry of cardLogs) {
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

export function deriveStudyStatsFromLogs(
  logs: ReviewLogEntry[],
  now: Date = new Date()
): StudyStats {
  const sortedLogs = getEffectiveReviewLogs(logs);
  const todayKey = getLocalDateString(now);
  const yesterdayKey = getYesterdayDateString(now);

  const reviewsByDay: Record<string, number> = {};
  const masteredSetByDay = new Map<string, Set<string>>();
  const currentlyMastered = new Set<string>();

  let totalTimeStudiedMs = 0;
  let timeStudiedMsToday = 0;
  let nonAgainCount = 0;

  for (const entry of sortedLogs) {
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

    if (entry.rating !== 'again') {
      nonAgainCount += 1;
    }

    const isMatureAfter =
      entry.stateAfter === 'review' &&
      entry.intervalMinutesAfter >= MATURE_INTERVAL_MINUTES;
    if (isMatureAfter) {
      currentlyMastered.add(entry.cardId);
    } else if (entry.rating === 'again') {
      currentlyMastered.delete(entry.cardId);
    }

    masteredSetByDay.set(dayKey, new Set(currentlyMastered));
  }

  const activeDayKeys = Object.keys(reviewsByDay).sort();
  const lastStudyDate =
    activeDayKeys.length > 0 ? activeDayKeys[activeDayKeys.length - 1] : null;
  const totalReviewsToday = reviewsByDay[todayKey] || 0;

  // Compute consecutive day streak ending at todayKey or yesterdayKey (04:00 rollover)
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
    sortedLogs.length > 0
      ? Math.round((nonAgainCount / sortedLogs.length) * 100)
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

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    }
  } catch {
    // Ignore
  }

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
  now?: Date;
  durationMs?: number;
}): RateCardResult {
  const now = params.now || new Date();
  const current =
    params.srsMap[params.cardId] || createDefaultSrsState(params.cardId);
  const nextState = computeNextSrsState(current, params.rating, now);

  const clampedDuration =
    typeof params.durationMs === 'number' && Number.isFinite(params.durationMs)
      ? Math.min(60_000, Math.max(50, Math.round(params.durationMs)))
      : 0;

  const logEntry: ReviewLogEntry = {
    id: generateUuid(),
    eventType: 'review',
    undoTargetId: null,
    cardId: params.cardId,
    timestamp: now.toISOString(),
    reviewedAt: now.toISOString(),
    studyDayKey: getLocalDateString(now),
    rating: params.rating,
    stateBefore: current.fsrsState || (current.reviewCount === 0 ? 'new' : 'learning'),
    stateAfter: nextState.fsrsState || 'learning',
    dueBefore: current.dueAt,
    dueAfter: nextState.dueAt,
    intervalMinutesBefore: current.intervalMinutes,
    intervalMinutesAfter: nextState.intervalMinutes,
    stabilityAfter: nextState.stability || 0,
    difficultyAfter: nextState.difficulty || 0,
    durationMs: clampedDuration,
    deviceId: getOrCreateDeviceId(),
    syncedAt: null,
  };

  const currentLogs = loadReviewLogs();
  const nextLogs = [...currentLogs, logEntry];
  saveReviewLogsMirror(nextLogs);

  const updatedMap: Record<string, CardSrsState> = {
    ...params.srsMap,
    [params.cardId]: nextState,
  };
  saveSrsMap(updatedMap);

  // Persist asynchronously to IndexedDB & Supabase
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
  now: Date = new Date()
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
  if (effectiveLogs.length === 0) {
    return {
      undoneEntry: null,
      undoMarkerEntry: null,
      updatedMap: currentSrsMap,
      updatedStats: deriveStudyStatsFromLogs(allLogs, now),
      remainingLogs: [],
      allLogs,
    };
  }

  const undoneEntry = effectiveLogs[effectiveLogs.length - 1];
  const undoIso = now.toISOString();

  // Append an immutable "undo" marker event rather than deleting the original review log entry
  const undoMarkerEntry: ReviewLogEntry = {
    id: generateUuid(),
    eventType: 'undo',
    undoTargetId: undoneEntry.id,
    cardId: undoneEntry.cardId,
    timestamp: undoIso,
    reviewedAt: undoIso,
    studyDayKey: getLocalDateString(now),
    rating: undoneEntry.rating,
    stateBefore: undoneEntry.stateAfter,
    stateAfter: undoneEntry.stateBefore,
    dueBefore: undoneEntry.dueAfter,
    dueAfter: undoneEntry.dueBefore,
    intervalMinutesBefore: undoneEntry.intervalMinutesAfter,
    intervalMinutesAfter: undoneEntry.intervalMinutesBefore,
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

  // Append the undo marker event and updated card state to IndexedDB & Supabase (never delete from review_logs)
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

/**
 * Multi-device sync helper: merges two review log arrays idempotently by UUID,
 * replays FSRS card states chronologically, and derives combined StudyStats.
 */
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
  const mergedLogs = sortAndDedupeReviewLogs([...localLogs, ...remoteLogs]);
  saveReviewLogsMirror(mergedLogs);
  const srsMap = replayAllStatesFromLogs(cards, mergedLogs);
  saveSrsMap(srsMap);
  const stats = deriveStudyStatsFromLogs(mergedLogs, now);
  void idbPutReviewLogsBulk(mergedLogs, srsMap);
  return { mergedLogs, srsMap, stats };
}

/**
 * Hydrates the in-memory engine state from IndexedDB and Supabase on app launch,
 * merging any local and cloud logs idempotently and requesting persistent storage.
 */
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

  const localCustomCards = loadAllCards().filter(
    (c) => !INITIAL_CARDS.some((ic) => ic.id === c.id)
  );
  const mergedCustomMap = new Map<string, VocabCard>();
  for (const c of [...localCustomCards, ...idbCustomCards]) {
    mergedCustomMap.set(c.id, c);
  }

  const localLogs = loadReviewLogs();
  const baseLocalLogs = sortAndDedupeReviewLogs([...idbLogs, ...localLogs]);
  const baseCustomCards = Array.from(mergedCustomMap.values());

  const tempCards = validateAndNormalizeContentCards([
    ...INITIAL_CARDS,
    ...baseCustomCards,
  ]);
  const localSrs = loadSrsMap(tempCards);
  const baseOrphanStates: Record<string, CardSrsState> = {
    ...idbStates,
    ...localSrs,
  };

  // Pull & merge with Supabase cloud database if available
  const remoteResult = await pullAndSyncSupabaseState({
    localLogs: baseLocalLogs,
    localStates: baseOrphanStates,
    localCustomCards: baseCustomCards,
    localWorkspace,
  });

  if (remoteResult?.remoteCustomCards?.length) {
    for (const rc of remoteResult.remoteCustomCards) {
      mergedCustomMap.set(rc.id, rc);
      void idbSaveCustomCard(rc);
    }
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          CUSTOM_CARDS_STORAGE_KEY,
          JSON.stringify(Array.from(mergedCustomMap.values()))
        );
      }
    } catch {
      // Ignore
    }
  }

  const allCards = validateAndNormalizeContentCards([
    ...INITIAL_CARDS,
    ...Array.from(mergedCustomMap.values()),
  ]);

  const mergedLogs = sortAndDedupeReviewLogs([
    ...baseLocalLogs,
    ...(remoteResult?.remoteLogs || []),
  ]);
  saveReviewLogsMirror(mergedLogs);

  const orphanBase: Record<string, CardSrsState> = {
    ...(remoteResult?.remoteStates || {}),
    ...baseOrphanStates,
  };

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

export function loadAllCards(): VocabCard[] {
  try {
    const raw =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(CUSTOM_CARDS_STORAGE_KEY)
        : null;
    if (!raw) return INITIAL_CARDS;
    const custom: VocabCard[] = JSON.parse(raw);
    if (!Array.isArray(custom)) return INITIAL_CARDS;
    return validateAndNormalizeContentCards([...INITIAL_CARDS, ...custom]);
  } catch {
    return INITIAL_CARDS;
  }
}

export function saveCustomCard(newCard: VocabCard): VocabCard[] {
  void idbSaveCustomCard(newCard);
  void syncCustomCardToSupabase(newCard);
  try {
    const raw =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(CUSTOM_CARDS_STORAGE_KEY)
        : null;
    const custom: VocabCard[] = raw ? JSON.parse(raw) : [];
    const updated = [...custom, newCard];
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CUSTOM_CARDS_STORAGE_KEY, JSON.stringify(updated));
    }
    return validateAndNormalizeContentCards([...INITIAL_CARDS, ...updated]);
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
      // Preserve ALL entries in storage (including orphaned card IDs not currently in `cards`)
      for (const [cardId, storedState] of Object.entries(parsed)) {
        if (storedState && typeof storedState === 'object') {
          map[cardId] = {
            ...createDefaultSrsState(cardId),
            ...storedState,
            cardId,
          };
        }
      }
    }
  } catch {
    // Fallback to default map if localStorage is unavailable
  }

  // If review logs exist, ensure card states match deterministic log replay
  const logs = loadReviewLogs();
  if (logs.length > 0) {
    return replayAllStatesFromLogs(cards, logs, map);
  }

  return map;
}

export function saveSrsMap(map: Record<string, CardSrsState>): void {
  try {
    if (typeof localStorage !== 'undefined') {
      // Merge with existing stored keys so orphaned card progress is never stripped
      const existingRaw = localStorage.getItem(SRS_STORAGE_KEY);
      const existing = existingRaw
        ? (JSON.parse(existingRaw) as Record<string, CardSrsState>)
        : {};
      const merged = { ...existing, ...map };
      localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(merged));
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function resetAllSrsProgress(
  cards: VocabCard[]
): Record<string, CardSrsState> {
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
  now: Date = new Date()
): {
  updatedMap: Record<string, CardSrsState>;
  updatedStats: StudyStats;
} {
  const targetSet = new Set(cardIds);
  const remainingLogs = loadReviewLogs().filter(
    (entry) => !targetSet.has(entry.cardId)
  );
  saveReviewLogsMirror(remainingLogs);
  void idbClearReviewsForCards(cardIds);

  const nextMap: Record<string, CardSrsState> = { ...currentSrsMap };
  for (const cid of cardIds) {
    nextMap[cid] = createDefaultSrsState(cid);
  }
  saveSrsMap(nextMap);
  const updatedStats = deriveStudyStatsFromLogs(remainingLogs, now);
  void deleteReviewsFromSupabase(cardIds, updatedStats);
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

    const metaEl = document.getElementById('meta-theme-color');
    if (metaEl) {
      metaEl.setAttribute(
        'content',
        META_THEME_COLORS[`${prefs.themeId}:${prefs.colorMode}`] || '#FAF8F5'
      );
    }

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
