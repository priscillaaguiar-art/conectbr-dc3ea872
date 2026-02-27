
-- Add database constraints for input validation
ALTER TABLE public.businesses
  ADD CONSTRAINT chk_name_length CHECK (length(name) <= 200),
  ADD CONSTRAINT chk_description_length CHECK (length(description) <= 1000),
  ADD CONSTRAINT chk_category_valid CHECK (category IN ('food', 'health', 'beauty', 'immigration', 'services', 'professionals', 'transport', 'products', 'others')),
  ADD CONSTRAINT chk_type_valid CHECK (type IN ('company', 'freelancer')),
  ADD CONSTRAINT chk_status_valid CHECK (status IN ('pending', 'approved', 'rejected')),
  ADD CONSTRAINT chk_email_length CHECK (email IS NULL OR length(email) <= 255),
  ADD CONSTRAINT chk_whatsapp_length CHECK (whatsapp IS NULL OR length(whatsapp) <= 30),
  ADD CONSTRAINT chk_phone_length CHECK (phone IS NULL OR length(phone) <= 30),
  ADD CONSTRAINT chk_instagram_length CHECK (instagram IS NULL OR length(instagram) <= 100),
  ADD CONSTRAINT chk_city_length CHECK (length(city) <= 100);

ALTER TABLE public.feedbacks
  ADD CONSTRAINT chk_feedback_message_length CHECK (length(message) <= 2000),
  ADD CONSTRAINT chk_feedback_email_length CHECK (length(email) <= 255),
  ADD CONSTRAINT chk_feedback_name_length CHECK (name IS NULL OR length(name) <= 200);
