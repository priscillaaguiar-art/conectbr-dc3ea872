INSERT INTO public.user_roles (user_id, role)
VALUES ('9949f2bb-f3bd-4203-94a3-f3656e931803', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;