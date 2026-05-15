-- LYCA pageant database schema (run in Supabase SQL Editor)

-- Users (id matches auth.users.id)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'voter' CHECK (role IN ('voter', 'admin', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Candidates
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  candidate_number INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('male', 'female')),
  image_url TEXT,
  bio TEXT,
  votes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (candidate_number, category)
);

-- Votes
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('male', 'female')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_votes_user_id ON public.votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_candidate_id ON public.votes(candidate_id);

-- Keep candidates.votes in sync
CREATE OR REPLACE FUNCTION public.update_candidate_votes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.candidates SET votes = votes + 1 WHERE id = NEW.candidate_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.candidates SET votes = GREATEST(votes - 1, 0) WHERE id = OLD.candidate_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS votes_count_trigger ON public.votes;
CREATE TRIGGER votes_count_trigger
  AFTER INSERT OR DELETE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_candidate_votes_count();

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Users: read own row; insert/update own row
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Candidates: public read; admins write
CREATE POLICY "candidates_select_all" ON public.candidates
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "candidates_admin_insert" ON public.candidates
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "candidates_admin_update" ON public.candidates
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "candidates_admin_delete" ON public.candidates
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Votes: users manage own votes
CREATE POLICY "votes_select_own" ON public.votes
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "votes_insert_own" ON public.votes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "votes_delete_own" ON public.votes
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
