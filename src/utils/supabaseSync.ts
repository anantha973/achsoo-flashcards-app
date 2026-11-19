import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  normalizeRatingKey,
  type CardSrsState,
  type LegacyRatingKey,
  type RatingKey,
  type ReviewLogEntry,
  type StudyStats,
  type VocabCard,
} from '../data/vocabData';
import type {
  CustomDeckRecord,
  DeckFolder,
  DeckMetaOverride,
  DeckSortOption,
} from './decksManager';
import type { ThemePreferences } from './srsEngine';

const DEFAULT_SUPABASE_URL = 'https://ibwxofzqeaavnsongqoa.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_3523PY-AllmXkVP44STg_A_niYQEs9T';
const DEFAULT_PROFILE_KEY = 'default';

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};

export const SUPABASE_URL =
  (env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
export const SUPABASE_PUBLISHABLE_KEY = (
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.VITE_SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_PUBLISHABLE_KEY
).trim();
export const SUPABASE_PROFILE_KEY = (
  env.VITE_SUPABASE_PROFILE_KEY || DEFAULT_PROFILE_KEY
).trim();

function isTestEnvironment(): boolean {
  try {
    if (typeof process !== 'undefined' && process.env?.VITEST) {
      return true;
    }
    if ((import.meta as unknown as { env?: { MODE?: string } }).env?.MODE === 'test') {
      return true;
    }
  } catch {
    // Ignore
  }
  return false;
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (isTestEnvironment()) return null;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseInstance;
}

interface ReviewLogRow {
  id: string;
  profile_key: string;
  event_type: string;
  undo_target_id: string | null;
  card_id: string;
  reviewed_at: string;
  study_day_key: string;
  rating: string;
  state_before: string;
  state_after: string;
  due_before: string;
  due_after: string;
  interval_minutes_before: number;
  interval_minutes_after: number;
  stability_after: number;
  difficulty_after: number;
  duration_ms: number;
  device_id: string;
  payload: ReviewLogEntry;
}

interface CardStateRow {
  profile_key: string;
  card_id: string;
  interval_minutes: number;
  ease_factor: number;
  repetitions: number;
  review_count: number;
  last_reviewed_at: string | null;
  due_at: string;
  last_rating: string | null;
  mastered: boolean;
  fsrs_state: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  lapses: number;
  learning_steps: number;
  state_json: CardSrsState;
  updated_at: string;
}

const CONFIDENCE_TO_SQL_COLUMN: Record<RatingKey, LegacyRatingKey> = {
  '1': 'again',
  '2': 'hard',
  '3': 'hard',
  '4': 'good',
  '5': 'easy',
};

function toReviewLogRow(entry: ReviewLogEntry): ReviewLogRow {
  // Store 'reset' inside payload.eventType while keeping column event_type within ('review', 'undo')
  // and map column rating within ('again', 'hard', 'good', 'easy') for deployed Postgres CHECK constraints.
  const columnEventType =
    entry.eventType === 'reset' ? 'undo' : (entry.eventType ?? 'review');
  const normRating = normalizeRatingKey(entry.rating) ?? '1';
  const columnRating = CONFIDENCE_TO_SQL_COLUMN[normRating];
  return {
    id: entry.id,
    profile_key: SUPABASE_PROFILE_KEY,
    event_type: columnEventType,
    undo_target_id: entry.eventType === 'reset' ? null : (entry.undoTargetId ?? null),
    card_id: entry.cardId,
    reviewed_at: entry.reviewedAt || entry.timestamp,
    study_day_key: entry.studyDayKey,
    rating: columnRating,
    state_before: entry.stateBefore,
    state_after: entry.stateAfter,
    due_before: entry.dueBefore,
    due_after: entry.dueAfter,
    interval_minutes_before: Math.round(entry.intervalMinutesBefore || 0),
    interval_minutes_after: Math.round(entry.intervalMinutesAfter || 0),
    stability_after: Number(entry.stabilityAfter || 0),
    difficulty_after: Number(entry.difficultyAfter || 0),
    duration_ms: Math.round(entry.durationMs || 0),
    device_id: entry.deviceId || 'unknown',
    payload: entry,
  };
}

function fromReviewLogRow(row: ReviewLogRow): ReviewLogEntry {
  if (row.payload && typeof row.payload === 'object' && row.payload.id) {
    return {
      ...row.payload,
      syncedAt: row.payload.syncedAt || row.reviewed_at,
    };
  }
  const inferredEventType: ReviewLogEntry['eventType'] =
    row.event_type === 'undo' && !row.undo_target_id && row.state_after === 'new'
      ? 'reset'
      : ((row.event_type as ReviewLogEntry['eventType']) || 'review');
  return {
    id: row.id,
    eventType: inferredEventType,
    undoTargetId: row.undo_target_id,
    cardId: row.card_id,
    timestamp: row.reviewed_at,
    reviewedAt: row.reviewed_at,
    studyDayKey: row.study_day_key,
    rating: row.rating as ReviewLogEntry['rating'],
    stateBefore: row.state_before as ReviewLogEntry['stateBefore'],
    stateAfter: row.state_after as ReviewLogEntry['stateAfter'],
    dueBefore: row.due_before,
    dueAfter: row.due_after,
    intervalMinutesBefore: row.interval_minutes_before,
    intervalMinutesAfter: row.interval_minutes_after,
    stabilityAfter: row.stability_after,
    difficultyAfter: row.difficulty_after,
    durationMs: row.duration_ms,
    deviceId: row.device_id,
    syncedAt: row.reviewed_at,
  };
}

function toCardStateRow(state: CardSrsState): CardStateRow {
  return {
    profile_key: SUPABASE_PROFILE_KEY,
    card_id: state.cardId,
    interval_minutes: Math.round(state.intervalMinutes || 0),
    ease_factor: Number(state.easeFactor || 2.5),
    repetitions: Math.round(state.repetitions || 0),
    review_count: Math.round(state.reviewCount || 0),
    last_reviewed_at: state.lastReviewedAt || null,
    due_at: state.dueAt || new Date(0).toISOString(),
    last_rating: state.lastRating || null,
    mastered: Boolean(state.mastered),
    fsrs_state: state.fsrsState || 'new',
    stability: Number(state.stability || 0),
    difficulty: Number(state.difficulty || 0),
    elapsed_days: Math.round(state.elapsedDays || 0),
    scheduled_days: Math.round(state.scheduledDays || 0),
    lapses: Math.round(state.lapses || 0),
    learning_steps: Math.round(state.learningSteps || 0),
    state_json: state,
    updated_at: new Date().toISOString(),
  };
}

function fromCardStateRow(row: CardStateRow): CardSrsState {
  if (row.state_json && typeof row.state_json === 'object' && row.state_json.cardId) {
    const normalizedLast = normalizeRatingKey(row.state_json.lastRating);
    const confidence =
      typeof row.state_json.confidence === 'number'
        ? row.state_json.confidence
        : row.state_json.mastered
        ? 4
        : (row.state_json.reviewCount ?? 0) > 0
        ? 3
        : 0;
    return {
      ...row.state_json,
      confidence: Math.max(0, Math.min(5, Math.round(confidence))) as CardSrsState['confidence'],
      lastRating: normalizedLast,
    };
  }
  const normalizedLast = normalizeRatingKey(row.last_rating);
  const confidence = row.mastered
    ? 4
    : (row.review_count ?? 0) > 0
    ? 3
    : 0;
  return {
    cardId: row.card_id,
    confidence,
    intervalMinutes: row.interval_minutes,
    easeFactor: row.ease_factor,
    repetitions: row.repetitions,
    reviewCount: row.review_count,
    lastReviewedAt: row.last_reviewed_at,
    dueAt: row.due_at,
    lastRating: normalizedLast,
    mastered: row.mastered,
    fsrsState: (row.fsrs_state as CardSrsState['fsrsState']) || 'new',
    stability: row.stability,
    difficulty: row.difficulty,
    elapsedDays: row.elapsed_days,
    scheduledDays: row.scheduled_days,
    lapses: row.lapses,
    learningSteps: row.learning_steps,
  };
}

export async function syncStudyStatsToSupabase(
  stats: StudyStats
): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from('achsoo_user_stats').upsert(
      {
        profile_key: SUPABASE_PROFILE_KEY,
        streak_days: stats.streakDays || 0,
        last_study_date: stats.lastStudyDate || null,
        total_reviews_today: stats.totalReviewsToday || 0,
        today_date: stats.todayDate,
        retention_pct: stats.retentionPct ?? 100,
        time_studied_ms_today: Math.round(stats.timeStudiedMsToday || 0),
        total_time_studied_ms: Math.round(stats.totalTimeStudiedMs || 0),
        daily_mastered_history: stats.dailyMasteredHistory || {},
        daily_reviews_history: stats.dailyReviewsHistory || {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'profile_key' }
    );
  } catch {
    // Offline or table not created yet — local IndexedDB keeps everything safe
  }
}

export async function syncReviewEventToSupabase(
  logEntry: ReviewLogEntry,
  nextState: CardSrsState,
  stats: StudyStats
): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await Promise.all([
      client
        .from('achsoo_review_logs')
        .upsert(toReviewLogRow(logEntry), { onConflict: 'id' }),
      client
        .from('achsoo_card_states')
        .upsert(toCardStateRow(nextState), {
          onConflict: 'profile_key,card_id',
        }),
      syncStudyStatsToSupabase(stats),
    ]);
  } catch {
    // Offline fallback handled by bulk sync on next connection
  }
}

export async function syncBatchReviewEventsToSupabase(
  logEntries: ReviewLogEntry[],
  nextStates: CardSrsState[],
  stats: StudyStats
): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const ops: PromiseLike<unknown>[] = [syncStudyStatsToSupabase(stats)];
    if (logEntries.length > 0) {
      ops.push(
        client
          .from('achsoo_review_logs')
          .upsert(logEntries.map(toReviewLogRow), { onConflict: 'id' })
      );
    }
    if (nextStates.length > 0) {
      ops.push(
        client
          .from('achsoo_card_states')
          .upsert(nextStates.map(toCardStateRow), {
            onConflict: 'profile_key,card_id',
          })
      );
    }
    await Promise.all(ops);
  } catch {
    // Offline fallback handled by bulk sync on next connection
  }
}

export async function syncCustomCardToSupabase(card: VocabCard): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from('achsoo_custom_cards').upsert(
      {
        profile_key: SUPABASE_PROFILE_KEY,
        card_id: card.id,
        lemma: card.lemma,
        category: card.category,
        cefr: card.cefr,
        card_data: card,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'profile_key,card_id' }
    );
  } catch {
    // Ignore when offline
  }
}

export interface RemoteWorkspaceSnapshot {
  folders?: DeckFolder[];
  customDecks?: CustomDeckRecord[];
  deckOverrides?: Record<string, DeckMetaOverride>;
  deckSort?: DeckSortOption;
  themePrefs?: ThemePreferences;
}

let pendingWorkspaceSnapshot: RemoteWorkspaceSnapshot | null = null;
let pendingWorkspaceTimer: number | null = null;
let workspaceFlushListenersBound = false;

async function flushWorkspaceSnapshot(): Promise<void> {
  if (pendingWorkspaceTimer !== null && typeof window !== 'undefined') {
    window.clearTimeout(pendingWorkspaceTimer);
    pendingWorkspaceTimer = null;
  }
  const snapshot = pendingWorkspaceSnapshot;
  pendingWorkspaceSnapshot = null;
  if (!snapshot) return;

  const client = getSupabaseClient();
  if (!client) return;
  try {
    const payload: Record<string, unknown> = {
      profile_key: SUPABASE_PROFILE_KEY,
      updated_at: new Date().toISOString(),
    };
    if (snapshot.folders !== undefined) payload.folders = snapshot.folders;
    if (snapshot.customDecks !== undefined)
      payload.custom_decks = snapshot.customDecks;
    if (snapshot.deckOverrides !== undefined)
      payload.deck_overrides = snapshot.deckOverrides;
    if (snapshot.deckSort !== undefined) payload.deck_sort = snapshot.deckSort;
    if (snapshot.themePrefs !== undefined)
      payload.theme_prefs = snapshot.themePrefs;

    await client
      .from('achsoo_user_workspace')
      .upsert(payload, { onConflict: 'profile_key' });
  } catch {
    // Ignore when offline
  }
}

function bindWorkspaceFlushListeners(): void {
  if (workspaceFlushListenersBound || typeof window === 'undefined') return;
  workspaceFlushListenersBound = true;
  window.addEventListener('pagehide', () => {
    void flushWorkspaceSnapshot();
  });
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        void flushWorkspaceSnapshot();
      }
    });
  }
}

export async function syncWorkspaceToSupabase(
  snapshot: RemoteWorkspaceSnapshot
): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  pendingWorkspaceSnapshot = {
    ...(pendingWorkspaceSnapshot || {}),
    ...snapshot,
  };

  if (typeof window === 'undefined' || isTestEnvironment()) {
    await flushWorkspaceSnapshot();
    return;
  }

  bindWorkspaceFlushListeners();
  if (pendingWorkspaceTimer !== null) {
    window.clearTimeout(pendingWorkspaceTimer);
  }
  pendingWorkspaceTimer = window.setTimeout(() => {
    pendingWorkspaceTimer = null;
    void flushWorkspaceSnapshot();
  }, 300);
}

export async function deleteReviewsFromSupabase(
  cardIds?: string[],
  updatedStats?: StudyStats
): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    if (!cardIds) {
      await Promise.all([
        client
          .from('achsoo_review_logs')
          .delete()
          .eq('profile_key', SUPABASE_PROFILE_KEY),
        client
          .from('achsoo_card_states')
          .delete()
          .eq('profile_key', SUPABASE_PROFILE_KEY),
      ]);
    } else if (cardIds.length > 0) {
      await Promise.all([
        client
          .from('achsoo_review_logs')
          .delete()
          .eq('profile_key', SUPABASE_PROFILE_KEY)
          .in('card_id', cardIds),
        client
          .from('achsoo_card_states')
          .delete()
          .eq('profile_key', SUPABASE_PROFILE_KEY)
          .in('card_id', cardIds),
      ]);
    }
    if (updatedStats) {
      await syncStudyStatsToSupabase(updatedStats);
    }
  } catch {
    // Ignore when offline
  }
}

export async function pullAndSyncSupabaseState(params: {
  localLogs: ReviewLogEntry[];
  localStates: Record<string, CardSrsState>;
  localCustomCards: VocabCard[];
  localWorkspace?: RemoteWorkspaceSnapshot;
}): Promise<{
  remoteLogs: ReviewLogEntry[];
  remoteStates: Record<string, CardSrsState>;
  remoteCustomCards: VocabCard[];
  remoteWorkspace: RemoteWorkspaceSnapshot | null;
} | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const [logsRes, statesRes, customCardsRes, workspaceRes] =
      await Promise.all([
        client
          .from('achsoo_review_logs')
          .select('*')
          .eq('profile_key', SUPABASE_PROFILE_KEY)
          .order('reviewed_at', { ascending: true }),
        client
          .from('achsoo_card_states')
          .select('*')
          .eq('profile_key', SUPABASE_PROFILE_KEY),
        client
          .from('achsoo_custom_cards')
          .select('*')
          .eq('profile_key', SUPABASE_PROFILE_KEY),
        client
          .from('achsoo_user_workspace')
          .select('*')
          .eq('profile_key', SUPABASE_PROFILE_KEY)
          .maybeSingle(),
      ]);

    // If tables aren't created in Supabase yet, return null gracefully
    if (logsRes.error && statesRes.error) {
      return null;
    }

    const remoteLogs: ReviewLogEntry[] = Array.isArray(logsRes.data)
      ? (logsRes.data as ReviewLogRow[]).map(fromReviewLogRow)
      : [];

    const remoteStates: Record<string, CardSrsState> = {};
    if (Array.isArray(statesRes.data)) {
      for (const row of statesRes.data as CardStateRow[]) {
        const st = fromCardStateRow(row);
        if (st && st.cardId) {
          remoteStates[st.cardId] = st;
        }
      }
    }

    const remoteCustomCards: VocabCard[] = [];
    if (Array.isArray(customCardsRes.data)) {
      for (const row of customCardsRes.data as Array<{
        card_id: string;
        card_data: VocabCard;
      }>) {
        if (row.card_data && typeof row.card_data === 'object') {
          remoteCustomCards.push(row.card_data);
        }
      }
    }

    let remoteWorkspace: RemoteWorkspaceSnapshot | null = null;
    if (workspaceRes.data && typeof workspaceRes.data === 'object') {
      const w = workspaceRes.data as {
        folders?: DeckFolder[];
        custom_decks?: CustomDeckRecord[];
        deck_overrides?: Record<string, DeckMetaOverride>;
        deck_sort?: DeckSortOption;
        theme_prefs?: ThemePreferences;
      };
      remoteWorkspace = {
        folders: Array.isArray(w.folders) ? w.folders : undefined,
        customDecks: Array.isArray(w.custom_decks) ? w.custom_decks : undefined,
        deckOverrides:
          w.deck_overrides && typeof w.deck_overrides === 'object'
            ? w.deck_overrides
            : undefined,
        deckSort: w.deck_sort,
        themePrefs: w.theme_prefs,
      };
    } else if (params.localWorkspace) {
      // Seed initial workspace row if none exists remotely yet
      void syncWorkspaceToSupabase(params.localWorkspace);
    }

    // Push any local review logs that do not exist in Supabase yet
    const remoteLogIds = new Set(remoteLogs.map((l) => l.id));
    const unsyncedLocalLogs = params.localLogs.filter(
      (l) => !remoteLogIds.has(l.id)
    );
    if (unsyncedLocalLogs.length > 0) {
      void client
        .from('achsoo_review_logs')
        .upsert(unsyncedLocalLogs.map(toReviewLogRow), { onConflict: 'id' });
    }

    // Push any local custom cards not yet in Supabase
    const remoteCustomIds = new Set(remoteCustomCards.map((c) => c.id));
    const unsyncedCustomCards = params.localCustomCards.filter(
      (c) => !remoteCustomIds.has(c.id)
    );
    if (unsyncedCustomCards.length > 0) {
      void client.from('achsoo_custom_cards').upsert(
        unsyncedCustomCards.map((card) => ({
          profile_key: SUPABASE_PROFILE_KEY,
          card_id: card.id,
          lemma: card.lemma,
          category: card.category,
          cefr: card.cefr,
          card_data: card,
          updated_at: new Date().toISOString(),
        })),
        { onConflict: 'profile_key,card_id' }
      );
    }

    return {
      remoteLogs,
      remoteStates,
      remoteCustomCards,
      remoteWorkspace,
    };
  } catch {
    return null;
  }
}

export async function pushAllStatesAndStatsToSupabase(
  srsMap: Record<string, CardSrsState>,
  stats: StudyStats
): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    const activeStates = Object.values(srsMap).filter(
      (st) => st && (st.reviewCount > 0 || st.lastReviewedAt !== null)
    );
    const promises: PromiseLike<unknown>[] = [syncStudyStatsToSupabase(stats)];
    if (activeStates.length > 0) {
      promises.push(
        client
          .from('achsoo_card_states')
          .upsert(activeStates.map(toCardStateRow), {
            onConflict: 'profile_key,card_id',
          })
      );
    }
    await Promise.all(promises);
  } catch {
    // Ignore when offline
  }
}
