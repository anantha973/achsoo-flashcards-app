-- ============================================================================
-- ACHSOO! GERMAN FLASHCARDS — MULTI-USER SUPABASE SCHEMA & RLS SETUP
-- Project: ibwxofzqeaavnsongqoa (https://ibwxofzqeaavnsongqoa.supabase.co)
-- Note: For an EXISTING database that already has 'default' single-user rows,
-- run supabase/migrate_to_google_auth.sql instead so your 2-week streak is
-- safely preserved and claimed into your Google account!
-- ============================================================================

-- 1. APPEND-ONLY REVIEW LOGS (Authoritative Event History)
CREATE TABLE IF NOT EXISTS public.achsoo_review_logs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_key TEXT NOT NULL DEFAULT (auth.uid()::text),
  event_type TEXT NOT NULL DEFAULT 'review' CHECK (event_type IN ('review', 'undo', 'reset')),
  undo_target_id UUID NULL,
  card_id TEXT NOT NULL,
  reviewed_at TIMESTAMPTZ NOT NULL,
  study_day_key TEXT NOT NULL,
  rating TEXT NOT NULL CHECK (rating IN ('again', 'hard', 'good', 'easy')),
  state_before TEXT NOT NULL,
  state_after TEXT NOT NULL,
  due_before TIMESTAMPTZ NOT NULL,
  due_after TIMESTAMPTZ NOT NULL,
  interval_minutes_before INTEGER NOT NULL DEFAULT 0,
  interval_minutes_after INTEGER NOT NULL DEFAULT 0,
  stability_after DOUBLE PRECISION NOT NULL DEFAULT 0,
  difficulty_after DOUBLE PRECISION NOT NULL DEFAULT 0,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  device_id TEXT NOT NULL DEFAULT 'unknown',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_achsoo_review_logs_user_reviewed
  ON public.achsoo_review_logs (user_id, reviewed_at ASC);

CREATE INDEX IF NOT EXISTS idx_achsoo_review_logs_user_card
  ON public.achsoo_review_logs (user_id, card_id);

CREATE INDEX IF NOT EXISTS idx_achsoo_review_logs_user_day
  ON public.achsoo_review_logs (user_id, study_day_key);

-- 2. MATERIALIZED CARD SRS STATES (Per-Card FSRS Progress Snapshot)
CREATE TABLE IF NOT EXISTS public.achsoo_card_states (
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_key TEXT NOT NULL DEFAULT (auth.uid()::text),
  card_id TEXT NOT NULL,
  interval_minutes INTEGER NOT NULL DEFAULT 0,
  ease_factor DOUBLE PRECISION NOT NULL DEFAULT 2.5,
  repetitions INTEGER NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ NULL,
  due_at TIMESTAMPTZ NOT NULL DEFAULT '1970-01-01T00:00:00.000Z',
  last_rating TEXT NULL,
  mastered BOOLEAN NOT NULL DEFAULT FALSE,
  fsrs_state TEXT NOT NULL DEFAULT 'new',
  stability DOUBLE PRECISION NOT NULL DEFAULT 0,
  difficulty DOUBLE PRECISION NOT NULL DEFAULT 0,
  elapsed_days INTEGER NOT NULL DEFAULT 0,
  scheduled_days INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  learning_steps INTEGER NOT NULL DEFAULT 0,
  state_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (profile_key, card_id)
);

CREATE INDEX IF NOT EXISTS idx_achsoo_card_states_user_due
  ON public.achsoo_card_states (user_id, due_at ASC);

-- 3. USER STATISTICS SNAPSHOT (Streaks, Daily Reviews, Mastery Velocity, Study Time)
CREATE TABLE IF NOT EXISTS public.achsoo_user_stats (
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_key TEXT PRIMARY KEY DEFAULT (auth.uid()::text),
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_study_date TEXT NULL,
  total_reviews_today INTEGER NOT NULL DEFAULT 0,
  today_date TEXT NOT NULL,
  retention_pct INTEGER NOT NULL DEFAULT 100,
  time_studied_ms_today BIGINT NOT NULL DEFAULT 0,
  total_time_studied_ms BIGINT NOT NULL DEFAULT 0,
  daily_mastered_history JSONB NOT NULL DEFAULT '{}'::jsonb,
  daily_reviews_history JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_achsoo_user_stats_user_id
  ON public.achsoo_user_stats (user_id);

-- 4. USER-CREATED CUSTOM VOCABULARY CARDS
CREATE TABLE IF NOT EXISTS public.achsoo_custom_cards (
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_key TEXT NOT NULL DEFAULT (auth.uid()::text),
  card_id TEXT NOT NULL,
  lemma TEXT NOT NULL,
  category TEXT NOT NULL,
  cefr TEXT NOT NULL,
  card_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (profile_key, card_id)
);

CREATE INDEX IF NOT EXISTS idx_achsoo_custom_cards_user_id
  ON public.achsoo_custom_cards (user_id);

-- 5. USER WORKSPACE & CUSTOMIZATION (Folders, Custom Decks, Deck Overrides, Theme)
CREATE TABLE IF NOT EXISTS public.achsoo_user_workspace (
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_key TEXT PRIMARY KEY DEFAULT (auth.uid()::text),
  folders JSONB NOT NULL DEFAULT '[]'::jsonb,
  custom_decks JSONB NOT NULL DEFAULT '[]'::jsonb,
  deck_overrides JSONB NOT NULL DEFAULT '{}'::jsonb,
  deck_sort TEXT NOT NULL DEFAULT 'name',
  theme_prefs JSONB NOT NULL DEFAULT '{"themeId":"nordic","colorMode":"light"}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_achsoo_user_workspace_user_id
  ON public.achsoo_user_workspace (user_id);

-- ============================================================================
-- STRICT PER-USER ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.achsoo_review_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achsoo_card_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achsoo_user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achsoo_custom_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achsoo_user_workspace ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public sync on achsoo_review_logs" ON public.achsoo_review_logs;
DROP POLICY IF EXISTS "Users manage own achsoo_review_logs" ON public.achsoo_review_logs;
CREATE POLICY "Users manage own achsoo_review_logs"
  ON public.achsoo_review_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id AND profile_key = auth.uid()::text)
  WITH CHECK (auth.uid() = user_id AND profile_key = auth.uid()::text);

DROP POLICY IF EXISTS "Allow public sync on achsoo_card_states" ON public.achsoo_card_states;
DROP POLICY IF EXISTS "Users manage own achsoo_card_states" ON public.achsoo_card_states;
CREATE POLICY "Users manage own achsoo_card_states"
  ON public.achsoo_card_states
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id AND profile_key = auth.uid()::text)
  WITH CHECK (auth.uid() = user_id AND profile_key = auth.uid()::text);

DROP POLICY IF EXISTS "Allow public sync on achsoo_user_stats" ON public.achsoo_user_stats;
DROP POLICY IF EXISTS "Users manage own achsoo_user_stats" ON public.achsoo_user_stats;
CREATE POLICY "Users manage own achsoo_user_stats"
  ON public.achsoo_user_stats
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id AND profile_key = auth.uid()::text)
  WITH CHECK (auth.uid() = user_id AND profile_key = auth.uid()::text);

DROP POLICY IF EXISTS "Allow public sync on achsoo_custom_cards" ON public.achsoo_custom_cards;
DROP POLICY IF EXISTS "Users manage own achsoo_custom_cards" ON public.achsoo_custom_cards;
CREATE POLICY "Users manage own achsoo_custom_cards"
  ON public.achsoo_custom_cards
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id AND profile_key = auth.uid()::text)
  WITH CHECK (auth.uid() = user_id AND profile_key = auth.uid()::text);

DROP POLICY IF EXISTS "Allow public sync on achsoo_user_workspace" ON public.achsoo_user_workspace;
DROP POLICY IF EXISTS "Users manage own achsoo_user_workspace" ON public.achsoo_user_workspace;
CREATE POLICY "Users manage own achsoo_user_workspace"
  ON public.achsoo_user_workspace
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id AND profile_key = auth.uid()::text)
  WITH CHECK (auth.uid() = user_id AND profile_key = auth.uid()::text);
