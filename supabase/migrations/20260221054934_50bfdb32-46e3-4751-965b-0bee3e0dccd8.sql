
-- Create businesses table
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT,
  whatsapp TEXT,
  instagram TEXT,
  phone TEXT,
  email TEXT,
  photo TEXT,
  type TEXT NOT NULL DEFAULT 'company',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved businesses
CREATE POLICY "Anyone can view approved businesses"
  ON public.businesses FOR SELECT
  USING (status = 'approved');

-- Anyone can insert (register) a new business
CREATE POLICY "Anyone can register a business"
  ON public.businesses FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (admins) can update businesses
CREATE POLICY "Authenticated users can update businesses"
  ON public.businesses FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Only authenticated users (admins) can delete businesses
CREATE POLICY "Authenticated users can delete businesses"
  ON public.businesses FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Create feedbacks table
CREATE TABLE public.feedbacks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Anyone can submit feedback
CREATE POLICY "Anyone can submit feedback"
  ON public.feedbacks FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can view feedback
CREATE POLICY "Authenticated users can view feedback"
  ON public.feedbacks FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with initial data
INSERT INTO public.businesses (name, category, city, description, description_en, whatsapp, instagram, phone, email, type, status) VALUES
('Sabor do Brasil', 'food', 'Toronto', 'Comida brasileira autêntica no coração de Toronto. Feijoada, coxinha, pão de queijo e muito mais!', 'Authentic Brazilian food in the heart of Toronto. Feijoada, coxinha, pão de queijo, and more!', '+14165550001', 'sabordoBrasil', '+14165550001', 'contato@sabordoBrasil.ca', 'company', 'approved'),
('Dra. Ana Lima — Clínica Médica', 'health', 'Mississauga', 'Atendimento médico em português. Clínica geral, check-up e orientações para imigrantes.', 'Medical care in Portuguese. General practice, check-ups and guidance for immigrants.', '+19055550002', 'draaналима', '+19055550002', 'dranalima@gmail.com', 'freelancer', 'approved'),
('BR Imigração', 'immigration', 'Toronto', 'Assessoria completa para processos de imigração no Canadá. RCIC certificado.', 'Complete immigration consulting in Canada. RCIC certified.', '+14165550003', 'brimigracaoCA', '+14165550003', 'info@brimigracao.ca', 'company', 'approved'),
('Fernanda Beauty Studio', 'beauty', 'Brampton', 'Especialista em cabelos cacheados, tranças e tratamentos capilares brasileiros.', 'Specialist in curly hair, braids and Brazilian hair treatments.', '+19055550004', 'fernandabeautyca', '+19055550004', NULL, 'freelancer', 'approved'),
('João Pintor Profissional', 'services', 'Mississauga', 'Pintura residencial e comercial. Mais de 10 anos de experiência. Orçamento gratuito!', 'Residential and commercial painting. Over 10 years of experience. Free quote!', '+19055550005', NULL, '+19055550005', 'joaopintor@gmail.com', 'freelancer', 'approved'),
('EscolaPortuguêsCA', 'professionals', 'Toronto', 'Aulas de português para crianças e adultos. Online e presencial. Professores nativos.', 'Portuguese classes for children and adults. Online and in-person. Native teachers.', '+14165550006', 'escolaportuguesCA', NULL, 'escola@portuguesCA.ca', 'company', 'approved'),
('Doces da Vovó Maria', 'food', 'Hamilton', 'Brigadeiros, beijinhos, bolo de cenoura e doces brasileiros artesanais para encomenda.', 'Brigadeiros, beijinhos, carrot cake and homemade Brazilian sweets for order.', '+19055550007', 'docesdavovoMaria', NULL, NULL, 'freelancer', 'approved'),
('BR Transporte', 'transport', 'Vaughan', 'Serviço de transporte particular para aeroportos, consulados e eventos. 24h disponível.', 'Private transport to airports, consulates and events. Available 24h.', '+14165550008', NULL, '+14165550008', NULL, 'company', 'approved'),
('Mercadinho Brasil', 'products', 'Toronto', 'Produtos brasileiros importados: guaraná, farofa, feijão, temperos e muito mais.', 'Imported Brazilian products: guaraná, farofa, beans, spices and much more.', '+14165550009', 'mercadinhobrasilCA', NULL, 'mercadinho@brasil.ca', 'company', 'approved'),
('Salão BeautyBR', 'beauty', 'Ottawa', 'Salão especializado em técnicas brasileiras de beleza.', NULL, '+16135550010', NULL, NULL, NULL, 'company', 'pending');
