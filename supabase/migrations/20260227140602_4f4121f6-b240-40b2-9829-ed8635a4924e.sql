
-- Drop existing SELECT policy on businesses
DROP POLICY IF EXISTS "Anyone can view approved businesses" ON public.businesses;
DROP POLICY IF EXISTS "Anyone can view approved businesses " ON public.businesses;
DROP POLICY IF EXISTS "Public can view approved businesses" ON public.businesses;
DROP POLICY IF EXISTS "Authenticated admin can view all businesses" ON public.businesses;

-- Public can view approved businesses
CREATE POLICY "Public can view approved businesses"
  ON public.businesses FOR SELECT
  USING (status = 'approved');

-- Authenticated users can view ALL businesses (for admin panel)
CREATE POLICY "Authenticated admin can view all businesses"
  ON public.businesses FOR SELECT
  TO authenticated
  USING (true);

-- Drop and recreate feedbacks SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view feedback" ON public.feedbacks;
DROP POLICY IF EXISTS "Authenticated users can view feedback " ON public.feedbacks;
DROP POLICY IF EXISTS "Authenticated admin can view feedbacks" ON public.feedbacks;

CREATE POLICY "Authenticated admin can view feedbacks"
  ON public.feedbacks FOR SELECT
  TO authenticated
  USING (true);
