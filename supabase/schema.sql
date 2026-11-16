-- ============================================================================
-- ACHSOO! GERMAN FLASHCARDS — SUPABASE POSTGRES SCHEMA & RLS SETUP
-- Project: ibwxofzqeaavnsongqoa (https://ibwxofzqeaavnsongqoa.supabase.co)
-- Run this entire script once in:
-- Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. APPEND-ONLY REVIEW LOGS (Authoritative Event History)
-- Every rating ('again' | 'hard' | 'good' | 'easy') and 'undo' event is stored
-- with a unique UUID so multiple devices (MacBook, iPad, iPhone) merge
-- idempotently without ever losing a review.
CREATE TABLE IF NOT EXISTS public.achsoo_review_logs (
  id UUID PRIMARY KEY,
  profile_key TEXT NOT NULL DEFAULT 'default',
  event_type TEXT NOT NULL DEFAULT 'review' CHECK (event_type IN ('review', 'undo')),
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

CREATE INDEX IF NOT EXISTS idx_achsoo_review_logs_profile_reviewed
  ON public.achsoo_review_logs (profile_key, reviewed_at ASC);

CREATE INDEX IF NOT EXISTS idx_achsoo_review_logs_profile_card
  ON public.achsoo_review_logs (profile_key, card_id);

CREATE INDEX IF NOT EXISTS idx_achsoo_review_logs_profile_day
  ON public.achsoo_review_logs (profile_key, study_day_key);

-- 2. MATERIALIZED CARD SRS STATES (Per-Card FSRS Progress Snapshot)
-- Stores current interval, ease, FSRS stability/difficulty, due date, and mastery
-- for every vocabulary card.
CREATE TABLE IF NOT EXISTS public.achsoo_card_states (
  profile_key TEXT NOT NULL DEFAULT 'default',
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

CREATE INDEX IF NOT EXISTS idx_achsoo_card_states_profile_due
  ON public.achsoo_card_states (profile_key, due_at ASC);

-- 3. USER STATISTICS SNAPSHOT (Streaks, Daily Reviews, Mastery Velocity, Study Time)
-- Mirrors derived StudyStats so you can inspect your streak, retention %,
-- and daily history directly inside Supabase Table Editor.
CREATE TABLE IF NOT EXISTS public.achsoo_user_stats (
  profile_key TEXT PRIMARY KEY DEFAULT 'default',
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

-- 4. USER-CREATED CUSTOM VOCABULARY CARDS
-- Stores custom German flashcards added via the "+ New Card" modal.
CREATE TABLE IF NOT EXISTS public.achsoo_custom_cards (
  profile_key TEXT NOT NULL DEFAULT 'default',
  card_id TEXT NOT NULL,
  lemma TEXT NOT NULL,
  category TEXT NOT NULL,
  cefr TEXT NOT NULL,
  card_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (profile_key, card_id)
);

-- 5. USER WORKSPACE & CUSTOMIZATION (Folders, Custom Decks, Deck Overrides, Theme)
-- Stores custom folders, custom decks, deck icon/color overrides, sort order, and theme.
CREATE TABLE IF NOT EXISTS public.achsoo_user_workspace (
  profile_key TEXT PRIMARY KEY DEFAULT 'default',
  folders JSONB NOT NULL DEFAULT '[]'::jsonb,
  custom_decks JSONB NOT NULL DEFAULT '[]'::jsonb,
  deck_overrides JSONB NOT NULL DEFAULT '{}'::jsonb,
  deck_sort TEXT NOT NULL DEFAULT 'name',
  theme_prefs JSONB NOT NULL DEFAULT '{"themeId":"nordic","colorMode":"light"}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR CLIENT PUBLISHABLE KEY SYNC
-- ============================================================================
ALTER TABLE public.achsoo_review_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achsoo_card_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achsoo_user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achsoo_custom_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achsoo_user_workspace ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public sync on achsoo_review_logs" ON public.achsoo_review_logs;
CREATE POLICY "Allow public sync on achsoo_review_logs"
  ON public.achsoo_review_logs
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public sync on achsoo_card_states" ON public.achsoo_card_states;
CREATE POLICY "Allow public sync on achsoo_card_states"
  ON public.achsoo_card_states
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public sync on achsoo_user_stats" ON public.achsoo_user_stats;
CREATE POLICY "Allow public sync on achsoo_user_stats"
  ON public.achsoo_user_stats
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public sync on achsoo_custom_cards" ON public.achsoo_custom_cards;
CREATE POLICY "Allow public sync on achsoo_custom_cards"
  ON public.achsoo_custom_cards
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public sync on achsoo_user_workspace" ON public.achsoo_user_workspace;
CREATE POLICY "Allow public sync on achsoo_user_workspace"
  ON public.achsoo_user_workspace
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
