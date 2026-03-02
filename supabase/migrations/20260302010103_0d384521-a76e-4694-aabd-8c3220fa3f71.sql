
INSERT INTO storage.buckets (id, name, public) VALUES ('business-photos', 'business-photos', true);

CREATE POLICY "Anyone can upload business photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'business-photos');

CREATE POLICY "Anyone can view business photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business-photos');
