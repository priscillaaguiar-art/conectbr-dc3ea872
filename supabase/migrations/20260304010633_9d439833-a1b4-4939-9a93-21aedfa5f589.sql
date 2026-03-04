
-- Fix SELECT policies on businesses table
DROP POLICY IF EXISTS "Public can view approved businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins can view all businesses" ON public.businesses;
DROP POLICY IF EXISTS "Users can view own businesses" ON public.businesses;

-- 1. Anyone can view approved businesses
CREATE POLICY "public_view_approved"
  ON public.businesses FOR SELECT
  USING (status = 'approved');

-- 2. Authenticated owner can view own businesses (any status)
CREATE POLICY "owner_view_own"
  ON public.businesses FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = owner_id);

-- 3. Admin can view ALL businesses
CREATE POLICY "admin_view_all"
  ON public.businesses FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Ensure user_roles table exists with proper structure
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Index for performance
CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON public.user_roles(user_id);

-- RLS on rate_limits (currently has none)
CREATE POLICY "rate_limits_insert_all"
  ON public.rate_limits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "rate_limits_select_admin"
  ON public.rate_limits FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Add update_updated_at trigger on businesses
CREATE OR REPLACE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes on businesses for common queries
CREATE INDEX IF NOT EXISTS idx_businesses_status ON public.businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON public.businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON public.businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON public.businesses(owner_id);
