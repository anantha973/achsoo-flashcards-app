import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
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
import { isNativeAndroidApp, openExternalAuthBrowser } from './nativeAndroid';
import type { ThemePreferences } from './srsEngine';

const DEFAULT_SUPABASE_URL = 'https://ibwxofzqeaavnsongqoa.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_3523PY-AllmXkVP44STg_A_niYQEs9T';

const env =
  (import.meta as unknown as { env?: Record<string, string | undefined> })
    .env || {};

export const SUPABASE_URL = (
  env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL
).trim();
export const SUPABASE_PUBLISHABLE_KEY = (
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.VITE_SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_PUBLISHABLE_KEY
).trim();

export const NATIVE_AUTH_REDIRECT_URL = 'com.achsoo.app://auth/callback';

export interface AuthUserSummary {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}

export type SyncStatusKind = 'local' | 'syncing' | 'synced' | 'offline' | 'error';

export interface SyncStatusState {
  status: SyncStatusKind;
  lastSyncedAt: string | null;
  errorMessage: string | null;
}

let syncStatusState: SyncStatusState = {
  status: 'local',
  lastSyncedAt: null,
  errorMessage: null,
};

const syncStatusListeners = new Set<(state: SyncStatusState) => void>();

function updateSyncStatus(next: Partial<SyncStatusState>): void {
  syncStatusState = { ...syncStatusState, ...next };
  for (const listener of syncStatusListeners) {
    try {
      listener(syncStatusState);
    } catch {
      // Ignore subscriber errors
    }
  }
}

export function getSyncStatusSnapshot(): SyncStatusState {
  return syncStatusState;
}

export function subscribeToSyncStatus(
  listener: (state: SyncStatusState) => void
): () => void {
  syncStatusListeners.add(listener);
  listener(syncStatusState);
  return () => {
    syncStatusListeners.delete(listener);
  };
}

function isOfflineBrowser(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

function markSyncError(message?: string): void {
  if (isOfflineBrowser()) {
    updateSyncStatus({ status: 'offline', errorMessage: null });
    return;
  }
  updateSyncStatus({
    status: 'error',
    errorMessage: message || 'Cloud sync paused',
  });
}

function markSyncSuccess(): void {
  updateSyncStatus({
    status: 'synced',
    lastSyncedAt: new Date().toISOString(),
    errorMessage: null,
  });
}

function isTestEnvironment(): boolean {
  try {
    if (typeof process !== 'undefined' && process.env?.VITEST) {
      return true;
    }
    if (
      (import.meta as unknown as { env?: { MODE?: string } }).env?.MODE ===
      'test'
    ) {
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
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: !isNativeAndroidApp(),
        flowType: 'pkce',
      },
    });
  }
  return supabaseInstance;
}

export function toAuthUserSummary(user: User | null | undefined): AuthUserSummary | null {
  if (!user || !user.id) return null;
  const meta = (user.user_metadata || {}) as Record<string, unknown>;
  const rawName =
    (typeof meta.full_name === 'string' && meta.full_name.trim()) ||
    (typeof meta.name === 'string' && meta.name.trim()) ||
    null;
  const rawAvatar =
    (typeof meta.avatar_url === 'string' && meta.avatar_url.trim()) ||
    (typeof meta.picture === 'string' && meta.picture.trim()) ||
    null;

  return {
    id: user.id,
    email: user.email || null,
    fullName: rawName,
    avatarUrl: rawAvatar,
  };
}

function cleanOAuthParamsFromWindowUrl(): void {
  if (typeof window === 'undefined' || isNativeAndroidApp()) return;
  try {
    const url = new URL(window.location.href);
    const hasAuthParam =
      url.searchParams.has('code') ||
      url.searchParams.has('state') ||
      url.searchParams.has('error') ||
      url.searchParams.has('error_description');
    if (!hasAuthParam) return;
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    url.searchParams.delete('error');
    url.searchParams.delete('error_code');
    url.searchParams.delete('error_description');
    const clean =
      url.pathname +
      (url.searchParams.toString() ? `?${url.searchParams.toString()}` : '') +
      url.hash;
    window.history.replaceState(window.history.state, document.title, clean);
  } catch {
    // Ignore history cleanup errors
  }
}

export async function getInitialAuthUser(): Promise<{
  user: AuthUserSummary | null;
  authError: string | null;
}> {
  const client = getSupabaseClient();
  if (!client) return { user: null, authError: null };

  let urlError: string | null = null;
  if (typeof window !== 'undefined' && !isNativeAndroidApp()) {
    try {
      const params = new URLSearchParams(window.location.search);
      urlError =
        params.get('error_description') || params.get('error') || null;
    } catch {
      urlError = null;
    }
  }

  try {
    const { data, error } = await client.auth.getSession();
    cleanOAuthParamsFromWindowUrl();
    if (error) {
      return { user: null, authError: error.message || urlError };
    }
    const user = toAuthUserSummary(data.session?.user);
    if (user) {
      updateSyncStatus({
        status: isOfflineBrowser() ? 'offline' : 'synced',
        errorMessage: null,
      });
    } else {
      updateSyncStatus({ status: 'local', lastSyncedAt: null, errorMessage: null });
    }
    return { user, authError: urlError };
  } catch (err) {
    cleanOAuthParamsFromWindowUrl();
    return {
      user: null,
      authError:
        err instanceof Error ? err.message : urlError || 'Unable to check sign-in status.',
    };
  }
}

export function subscribeToAuthState(
  onUserChange: (user: AuthUserSummary | null) => void
): () => void {
  const client = getSupabaseClient();
  if (!client) return () => {};

  const { data } = client.auth.onAuthStateChange((_event, session) => {
    const nextUser = toAuthUserSummary(session?.user);
    if (nextUser) {
      cleanOAuthParamsFromWindowUrl();
      updateSyncStatus({
        status: isOfflineBrowser() ? 'offline' : 'syncing',
        errorMessage: null,
      });
    } else {
      updateSyncStatus({ status: 'local', lastSyncedAt: null, errorMessage: null });
    }
    onUserChange(nextUser);
  });

  return () => {
    data.subscription.unsubscribe();
  };
}

export async function signInWithGoogle(): Promise<{ error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { error: 'Cloud sign-in is not configured in this environment.' };
  }

  if (isOfflineBrowser()) {
    return { error: 'You appear to be offline. Connect to the internet to sign in with Google.' };
  }

  try {
    if (isNativeAndroidApp()) {
      const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: NATIVE_AUTH_REDIRECT_URL,
          skipBrowserRedirect: true,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });
      if (error) {
        return { error: error.message };
      }
      if (!data?.url) {
        return { error: 'Could not start Google sign-in.' };
      }
      const opened = await openExternalAuthBrowser(data.url);
      if (!opened) {
        return { error: 'Unable to open browser for Google sign-in.' };
      }
      return { error: null };
    }

    const redirectTo =
      typeof window !== 'undefined' ? window.location.origin : undefined;
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : 'Unable to sign in with Google.',
    };
  }
}

export async function handleNativeAuthCallbackUrl(
  rawUrl: string
): Promise<{ ok: boolean; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) return { ok: false, error: 'Supabase client unavailable.' };

  try {
    const parsed = new URL(rawUrl);
    const oauthError =
      parsed.searchParams.get('error_description') ||
      parsed.searchParams.get('error');
    if (oauthError) {
      return { ok: false, error: oauthError };
    }

    const code = parsed.searchParams.get('code');
    if (code) {
      const { error } = await client.auth.exchangeCodeForSession(code);
      if (error) {
        return { ok: false, error: error.message };
      }
      return { ok: true, error: null };
    }

    if (parsed.hash && parsed.hash.length > 1) {
      const hashParams = new URLSearchParams(parsed.hash.slice(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      if (accessToken && refreshToken) {
        const { error } = await client.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          return { ok: false, error: error.message };
        }
        return { ok: true, error: null };
      }
    }

    return { ok: false, error: 'No sign-in code returned from Google.' };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error ? err.message : 'Invalid sign-in callback URL.',
    };
  }
}

async function getActiveUserId(): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client.auth.getSession();
    if (error || !data.session?.user?.id) return null;
    return data.session.user.id;
  } catch {
    return null;
  }
}

export async function signOutFromSupabase(): Promise<void> {
  // Flush any queued workspace changes for the outgoing user before ending session
  await flushWorkspaceSnapshot();
  if (pendingWorkspaceTimer !== null && typeof window !== 'undefined') {
    window.clearTimeout(pendingWorkspaceTimer);
    pendingWorkspaceTimer = null;
  }
  pendingWorkspaceSnapshot = null;

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch {
      // Proceed with local cleanup even if network signOut fails
    }
  }
  updateSyncStatus({ status: 'local', lastSyncedAt: null, errorMessage: null });
}

interface ReviewLogRow {
  id: string;
  user_id: string;
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
  user_id: string;
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

function toReviewLogRow(entry: ReviewLogEntry, userId: string): ReviewLogRow {
  const columnEventType =
    entry.eventType === 'reset' ? 'undo' : (entry.eventType ?? 'review');
  const normRating = normalizeRatingKey(entry.rating) ?? '1';
  const columnRating = CONFIDENCE_TO_SQL_COLUMN[normRating];
  return {
    id: entry.id,
    user_id: userId,
    profile_key: userId,
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

function toCardStateRow(state: CardSrsState, userId: string): CardStateRow {
  return {
    user_id: userId,
    profile_key: userId,
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

async function upsertStudyStatsForUser(
  client: SupabaseClient,
  userId: string,
  stats: StudyStats
): Promise<boolean> {
  const { error } = await client.from('achsoo_user_stats').upsert(
    {
      user_id: userId,
      profile_key: userId,
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
  return !error;
}

export async function syncStudyStatsToSupabase(
  stats: StudyStats
): Promise<void> {
  const client = getSupabaseClient();
  const userId = await getActiveUserId();
  if (!client || !userId) return;
  try {
    const ok = await upsertStudyStatsForUser(client, userId, stats);
    if (ok) markSyncSuccess();
    else markSyncError();
  } catch {
    markSyncError();
  }
}

export async function syncReviewEventToSupabase(
  logEntry: ReviewLogEntry,
  nextState: CardSrsState,
  stats: StudyStats
): Promise<void> {
  const client = getSupabaseClient();
  const userId = await getActiveUserId();
  if (!client || !userId) return;
  updateSyncStatus({ status: 'syncing', errorMessage: null });
  try {
    const [logRes, stateRes, statsOk] = await Promise.all([
      client
        .from('achsoo_review_logs')
        .upsert(toReviewLogRow(logEntry, userId), { onConflict: 'id' }),
      client
        .from('achsoo_card_states')
        .upsert(toCardStateRow(nextState, userId), {
          onConflict: 'profile_key,card_id',
        }),
      upsertStudyStatsForUser(client, userId, stats),
    ]);
    if (logRes.error || stateRes.error || !statsOk) {
      markSyncError();
    } else {
      markSyncSuccess();
    }
  } catch {
    markSyncError();
  }
}

export async function syncBatchReviewEventsToSupabase(
  logEntries: ReviewLogEntry[],
  nextStates: CardSrsState[],
  stats: StudyStats
): Promise<void> {
  const client = getSupabaseClient();
  const userId = await getActiveUserId();
  if (!client || !userId) return;
  updateSyncStatus({ status: 'syncing', errorMessage: null });
  try {
    const [statsOk, logsRes, statesRes] = await Promise.all([
      upsertStudyStatsForUser(client, userId, stats),
      logEntries.length > 0
        ? client
            .from('achsoo_review_logs')
            .upsert(
              logEntries.map((entry) => toReviewLogRow(entry, userId)),
              { onConflict: 'id' }
            )
        : Promise.resolve({ error: null }),
      nextStates.length > 0
        ? client
            .from('achsoo_card_states')
            .upsert(
              nextStates.map((st) => toCardStateRow(st, userId)),
              { onConflict: 'profile_key,card_id' }
            )
        : Promise.resolve({ error: null }),
    ]);
    if (!statsOk || logsRes.error || statesRes.error) {
      markSyncError();
    } else {
      markSyncSuccess();
    }
  } catch {
    markSyncError();
  }
}

export async function syncCustomCardToSupabase(card: VocabCard): Promise<void> {
  const client = getSupabaseClient();
  const userId = await getActiveUserId();
  if (!client || !userId) return;
  try {
    const { error } = await client.from('achsoo_custom_cards').upsert(
      {
        user_id: userId,
        profile_key: userId,
        card_id: card.id,
        lemma: card.lemma,
        category: card.category,
        cefr: card.cefr,
        card_data: card,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'profile_key,card_id' }
    );
    if (error) markSyncError();
    else markSyncSuccess();
  } catch {
    markSyncError();
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
  const userId = await getActiveUserId();
  if (!client || !userId) return;
  try {
    const payload: Record<string, unknown> = {
      user_id: userId,
      profile_key: userId,
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

    const { error } = await client
      .from('achsoo_user_workspace')
      .upsert(payload, { onConflict: 'profile_key' });
    if (error) markSyncError();
    else markSyncSuccess();
  } catch {
    markSyncError();
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
  const userId = await getActiveUserId();
  if (!client || !userId) return;

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
  const userId = await getActiveUserId();
  if (!client || !userId) return;
  try {
    if (!cardIds) {
      await Promise.all([
        client
          .from('achsoo_review_logs')
          .delete()
          .eq('user_id', userId),
        client
          .from('achsoo_card_states')
          .delete()
          .eq('user_id', userId),
      ]);
    } else if (cardIds.length > 0) {
      await Promise.all([
        client
          .from('achsoo_review_logs')
          .delete()
          .eq('user_id', userId)
          .in('card_id', cardIds),
        client
          .from('achsoo_card_states')
          .delete()
          .eq('user_id', userId)
          .in('card_id', cardIds),
      ]);
    }
    if (updatedStats) {
      await syncStudyStatsToSupabase(updatedStats);
    }
  } catch {
    markSyncError();
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
  const userId = await getActiveUserId();
  if (!client || !userId) return null;

  updateSyncStatus({ status: 'syncing', errorMessage: null });

  try {
    const [logsRes, statesRes, customCardsRes, workspaceRes] =
      await Promise.all([
        client
          .from('achsoo_review_logs')
          .select('*')
          .eq('user_id', userId)
          .order('reviewed_at', { ascending: true }),
        client
          .from('achsoo_card_states')
          .select('*')
          .eq('user_id', userId),
        client
          .from('achsoo_custom_cards')
          .select('*')
          .eq('user_id', userId),
        client
          .from('achsoo_user_workspace')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle(),
      ]);

    if (logsRes.error && statesRes.error) {
      markSyncError();
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
      void syncWorkspaceToSupabase(params.localWorkspace);
    }

    const remoteLogIds = new Set(remoteLogs.map((l) => l.id));
    const unsyncedLocalLogs = params.localLogs.filter(
      (l) => !remoteLogIds.has(l.id)
    );
    if (unsyncedLocalLogs.length > 0) {
      void client
        .from('achsoo_review_logs')
        .upsert(
          unsyncedLocalLogs.map((entry) => toReviewLogRow(entry, userId)),
          { onConflict: 'id' }
        );
    }

    const remoteCustomIds = new Set(remoteCustomCards.map((c) => c.id));
    const unsyncedCustomCards = params.localCustomCards.filter(
      (c) => !remoteCustomIds.has(c.id)
    );
    if (unsyncedCustomCards.length > 0) {
      void client.from('achsoo_custom_cards').upsert(
        unsyncedCustomCards.map((card) => ({
          user_id: userId,
          profile_key: userId,
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

    markSyncSuccess();
    return {
      remoteLogs,
      remoteStates,
      remoteCustomCards,
      remoteWorkspace,
    };
  } catch {
    markSyncError();
    return null;
  }
}

export async function pushAllStatesAndStatsToSupabase(
  srsMap: Record<string, CardSrsState>,
  stats: StudyStats
): Promise<void> {
  const client = getSupabaseClient();
  const userId = await getActiveUserId();
  if (!client || !userId) return;
  try {
    const activeStates = Object.values(srsMap).filter(
      (st) => st && (st.reviewCount > 0 || st.lastReviewedAt !== null)
    );
    const [statsOk, statesRes] = await Promise.all([
      upsertStudyStatsForUser(client, userId, stats),
      activeStates.length > 0
        ? client
            .from('achsoo_card_states')
            .upsert(
              activeStates.map((st) => toCardStateRow(st, userId)),
              { onConflict: 'profile_key,card_id' }
            )
        : Promise.resolve({ error: null }),
    ]);
    if (!statsOk || statesRes.error) {
      markSyncError();
    } else {
      markSyncSuccess();
    }
  } catch {
    markSyncError();
  }
}
