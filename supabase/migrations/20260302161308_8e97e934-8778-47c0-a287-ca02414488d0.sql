-- Ensure photo column exists (idempotent)
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS photo TEXT;

-- Add owner_id column to businesses
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- Create user_businesses linking table
CREATE TABLE IF NOT EXISTS public.user_businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, business_id)
);

ALTER TABLE public.user_businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own business links"
  ON public.user_businesses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business links"
  ON public.user_businesses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own businesses
CREATE POLICY "Users can update own businesses"
  ON public.businesses FOR UPDATE
  USING (auth.uid() = owner_id);

-- Users can view own businesses (even pending)
CREATE POLICY "Users can view own businesses"
  ON public.businesses FOR SELECT
  USING (auth.uid() = owner_id);