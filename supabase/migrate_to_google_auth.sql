-- ============================================================================
-- ACHSOO! ZERO-LOSS MIGRATION: SINGLE 'default' PROFILE -> GOOGLE AUTH
-- Project: ibwxofzqeaavnsongqoa
-- ============================================================================
-- HOW TO RUN SAFELY (2 SIMPLE PHASES):
--
-- PHASE 1: Run "PART 1" below in Supabase Dashboard -> SQL Editor BEFORE you sign in.
--   - It adds `user_id` to all 5 tables and locks down public access.
--   - Your existing 'default' data (2-week streak, reviews, cards) stays 100% untouched.
--
-- THEN: Open the Achsoo web app (or updated APK) and sign in with YOUR Google account once.
--
-- PHASE 2: Replace YOUR_GOOGLE_EMAIL@gmail.com in "PART 2" below and run it in SQL Editor.
--   - It safely moves all 'default' rows into YOUR Google account!
--   - Refresh the app and your 2-week streak & progress will appear immediately.
-- ============================================================================


-- ============================================================================
-- PART 1: ADD user_id COLUMNS, INDEXES & STRICT PER-USER RLS
-- ============================================================================
ALTER TABLE public.achsoo_review_logs
  ADD COLUMN IF NOT EXISTS user_id UUID NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.achsoo_card_states
  ADD COLUMN IF NOT EXISTS user_id UUID NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.achsoo_user_stats
  ADD COLUMN IF NOT EXISTS user_id UUID NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.achsoo_custom_cards
  ADD COLUMN IF NOT EXISTS user_id UUID NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.achsoo_user_workspace
  ADD COLUMN IF NOT EXISTS user_id UUID NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_achsoo_review_logs_user_reviewed
  ON public.achsoo_review_logs (user_id, reviewed_at ASC);
CREATE INDEX IF NOT EXISTS idx_achsoo_review_logs_user_card
  ON public.achsoo_review_logs (user_id, card_id);
CREATE INDEX IF NOT EXISTS idx_achsoo_review_logs_user_day
  ON public.achsoo_review_logs (user_id, study_day_key);
CREATE INDEX IF NOT EXISTS idx_achsoo_card_states_user_due
  ON public.achsoo_card_states (user_id, due_at ASC);
CREATE INDEX IF NOT EXISTS idx_achsoo_custom_cards_user_id
  ON public.achsoo_custom_cards (user_id);

-- Lock down all 5 tables so each authenticated Google user can only read/write their own rows.
-- Existing 'default' rows have user_id IS NULL, so nobody else can touch them while waiting for Part 2.
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


-- ============================================================================
-- PART 2: CLAIM YOUR 'default' DATA INTO YOUR GOOGLE ACCOUNT
-- (Run ONLY AFTER you have signed in with Google once in Achsoo!)
-- Replace 'YOUR_GOOGLE_EMAIL@gmail.com' with your exact Gmail address and run:
-- ============================================================================
/*
DO $$
DECLARE
  target_uid UUID;
  target_key TEXT;
BEGIN
  SELECT id INTO target_uid
  FROM auth.users
  WHERE lower(email) = lower('YOUR_GOOGLE_EMAIL@gmail.com')
  ORDER BY created_at ASC
  LIMIT 1;

  IF target_uid IS NULL THEN
    RAISE EXCEPTION 'No auth.users row found for that email. Sign in with Google in Achsoo first, then run Part 2.';
  END IF;

  target_key := target_uid::text;

  -- 1. Move all append-only review logs
  UPDATE public.achsoo_review_logs
  SET user_id = target_uid,
      profile_key = target_key
  WHERE profile_key = 'default';

  -- 2. Move card states without failing if you already tapped a card after signing in
  INSERT INTO public.achsoo_card_states (
    user_id, profile_key, card_id, interval_minutes, ease_factor, repetitions,
    review_count, last_reviewed_at, due_at, last_rating, mastered, fsrs_state,
    stability, difficulty, elapsed_days, scheduled_days, lapses, learning_steps,
    state_json, updated_at
  )
  SELECT
    target_uid, target_key, card_id, interval_minutes, ease_factor, repetitions,
    review_count, last_reviewed_at, due_at, last_rating, mastered, fsrs_state,
    stability, difficulty, elapsed_days, scheduled_days, lapses, learning_steps,
    state_json, updated_at
  FROM public.achsoo_card_states
  WHERE profile_key = 'default'
  ON CONFLICT (profile_key, card_id) DO NOTHING;

  DELETE FROM public.achsoo_card_states WHERE profile_key = 'default';

  -- 3. Move user stats snapshot (replace empty newly-seeded stats if 'default' exists)
  INSERT INTO public.achsoo_user_stats (
    user_id, profile_key, streak_days, last_study_date, total_reviews_today,
    today_date, retention_pct, time_studied_ms_today, total_time_studied_ms,
    daily_mastered_history, daily_reviews_history, updated_at
  )
  SELECT
    target_uid, target_key, streak_days, last_study_date, total_reviews_today,
    today_date, retention_pct, time_studied_ms_today, total_time_studied_ms,
    daily_mastered_history, daily_reviews_history, updated_at
  FROM public.achsoo_user_stats
  WHERE profile_key = 'default'
  ON CONFLICT (profile_key) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    streak_days = GREATEST(public.achsoo_user_stats.streak_days, EXCLUDED.streak_days),
    last_study_date = COALESCE(EXCLUDED.last_study_date, public.achsoo_user_stats.last_study_date),
    total_reviews_today = GREATEST(public.achsoo_user_stats.total_reviews_today, EXCLUDED.total_reviews_today),
    retention_pct = EXCLUDED.retention_pct,
    time_studied_ms_today = GREATEST(public.achsoo_user_stats.time_studied_ms_today, EXCLUDED.time_studied_ms_today),
    total_time_studied_ms = GREATEST(public.achsoo_user_stats.total_time_studied_ms, EXCLUDED.total_time_studied_ms),
    daily_mastered_history = EXCLUDED.daily_mastered_history,
    daily_reviews_history = EXCLUDED.daily_reviews_history,
    updated_at = NOW();

  DELETE FROM public.achsoo_user_stats WHERE profile_key = 'default';

  -- 4. Move custom cards
  INSERT INTO public.achsoo_custom_cards (
    user_id, profile_key, card_id, lemma, category, cefr, card_data, updated_at
  )
  SELECT
    target_uid, target_key, card_id, lemma, category, cefr, card_data, updated_at
  FROM public.achsoo_custom_cards
  WHERE profile_key = 'default'
  ON CONFLICT (profile_key, card_id) DO NOTHING;

  DELETE FROM public.achsoo_custom_cards WHERE profile_key = 'default';

  -- 5. Move workspace (folders, custom decks, theme)
  INSERT INTO public.achsoo_user_workspace (
    user_id, profile_key, folders, custom_decks, deck_overrides, deck_sort, theme_prefs, updated_at
  )
  SELECT
    target_uid, target_key, folders, custom_decks, deck_overrides, deck_sort, theme_prefs, updated_at
  FROM public.achsoo_user_workspace
  WHERE profile_key = 'default'
  ON CONFLICT (profile_key) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    folders = EXCLUDED.folders,
    custom_decks = EXCLUDED.custom_decks,
    deck_overrides = EXCLUDED.deck_overrides,
    deck_sort = EXCLUDED.deck_sort,
    theme_prefs = EXCLUDED.theme_prefs,
    updated_at = NOW();

  DELETE FROM public.achsoo_user_workspace WHERE profile_key = 'default';
END $$;
*/
