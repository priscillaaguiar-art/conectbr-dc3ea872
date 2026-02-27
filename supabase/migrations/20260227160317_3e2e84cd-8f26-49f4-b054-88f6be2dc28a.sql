
DROP POLICY IF EXISTS "Admins can view roles" ON public.user_roles;

CREATE POLICY "Admins can view roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
