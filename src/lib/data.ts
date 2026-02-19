export type BusinessStatus = "approved" | "pending" | "rejected";
export type BusinessType = "company" | "freelancer";

export type CategoryKey =
  | "services"
  | "food"
  | "beauty"
  | "health"
  | "products"
  | "professionals"
  | "transport"
  | "immigration"
  | "others";

export interface Business {
  id: string;
  name: string;
  category: CategoryKey;
  city: string;
  description: string;
  descriptionEn?: string;
  whatsapp?: string;
  instagram?: string;
  phone?: string;
  email?: string;
  photo?: string;
  type: BusinessType;
  status: BusinessStatus;
  createdAt: string;
}

export const ONTARIO_CITIES = [
  "Toronto",
  "Mississauga",
  "Brampton",
  "Ottawa",
  "Hamilton",
  "London",
  "Markham",
  "Vaughan",
  "Kitchener",
  "Windsor",
  "Richmond Hill",
  "Oakville",
  "Burlington",
  "Sudbury",
  "Thunder Bay",
];

export const CATEGORIES: { key: CategoryKey; emoji: string; labelKey: string }[] = [
  { key: "food", emoji: "🍽️", labelKey: "cat_food" },
  { key: "services", emoji: "🔧", labelKey: "cat_services" },
  { key: "beauty", emoji: "💅", labelKey: "cat_beauty" },
  { key: "health", emoji: "🏥", labelKey: "cat_health" },
  { key: "products", emoji: "🛍️", labelKey: "cat_products" },
  { key: "professionals", emoji: "👔", labelKey: "cat_professionals" },
  { key: "transport", emoji: "🚗", labelKey: "cat_transport" },
  { key: "immigration", emoji: "🌎", labelKey: "cat_immigration" },
  { key: "others", emoji: "✨", labelKey: "cat_others" },
];

export const MOCK_BUSINESSES: Business[] = [
  {
    id: "1",
    name: "Sabor do Brasil",
    category: "food",
    city: "Toronto",
    description: "Comida brasileira autêntica no coração de Toronto. Feijoada, coxinha, pão de queijo e muito mais!",
    descriptionEn: "Authentic Brazilian food in the heart of Toronto. Feijoada, coxinha, pão de queijo, and more!",
    whatsapp: "+14165550001",
    instagram: "sabordoBrasil",
    phone: "+14165550001",
    email: "contato@sabordoBrasil.ca",
    type: "company",
    status: "approved",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Dra. Ana Lima — Clínica Médica",
    category: "health",
    city: "Mississauga",
    description: "Atendimento médico em português. Clínica geral, check-up e orientações para imigrantes.",
    descriptionEn: "Medical care in Portuguese. General practice, check-ups and guidance for immigrants.",
    whatsapp: "+19055550002",
    instagram: "draaналима",
    phone: "+19055550002",
    email: "dranalima@gmail.com",
    type: "freelancer",
    status: "approved",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "BR Imigração",
    category: "immigration",
    city: "Toronto",
    description: "Assessoria completa para processos de imigração no Canadá. RCIC certificado.",
    descriptionEn: "Complete immigration consulting in Canada. RCIC certified.",
    whatsapp: "+14165550003",
    instagram: "brimigracaoCA",
    phone: "+14165550003",
    email: "info@brimigracao.ca",
    type: "company",
    status: "approved",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "Fernanda Beauty Studio",
    category: "beauty",
    city: "Brampton",
    description: "Especialista em cabelos cacheados, tranças e tratamentos capilares brasileiros.",
    descriptionEn: "Specialist in curly hair, braids and Brazilian hair treatments.",
    whatsapp: "+19055550004",
    instagram: "fernandabeautyca",
    phone: "+19055550004",
    type: "freelancer",
    status: "approved",
    createdAt: "2024-02-10",
  },
  {
    id: "5",
    name: "João Pintor Profissional",
    category: "services",
    city: "Mississauga",
    description: "Pintura residencial e comercial. Mais de 10 anos de experiência. Orçamento gratuito!",
    descriptionEn: "Residential and commercial painting. Over 10 years of experience. Free quote!",
    whatsapp: "+19055550005",
    phone: "+19055550005",
    email: "joaopintor@gmail.com",
    type: "freelancer",
    status: "approved",
    createdAt: "2024-02-15",
  },
  {
    id: "6",
    name: "EscolaPortuguêsCA",
    category: "professionals",
    city: "Toronto",
    description: "Aulas de português para crianças e adultos. Online e presencial. Professores nativos.",
    descriptionEn: "Portuguese classes for children and adults. Online and in-person. Native teachers.",
    whatsapp: "+14165550006",
    instagram: "escolaportuguesCA",
    email: "escola@portuguesCA.ca",
    type: "company",
    status: "approved",
    createdAt: "2024-02-20",
  },
  {
    id: "7",
    name: "Doces da Vovó Maria",
    category: "food",
    city: "Hamilton",
    description: "Brigadeiros, beijinhos, bolo de cenoura e doces brasileiros artesanais para encomenda.",
    descriptionEn: "Brigadeiros, beijinhos, carrot cake and homemade Brazilian sweets for order.",
    whatsapp: "+19055550007",
    instagram: "docesdavovoMaria",
    type: "freelancer",
    status: "approved",
    createdAt: "2024-03-01",
  },
  {
    id: "8",
    name: "BR Transporte",
    category: "transport",
    city: "Vaughan",
    description: "Serviço de transporte particular para aeroportos, consulados e eventos. 24h disponível.",
    descriptionEn: "Private transport to airports, consulates and events. Available 24h.",
    whatsapp: "+14165550008",
    phone: "+14165550008",
    type: "company",
    status: "approved",
    createdAt: "2024-03-05",
  },
  {
    id: "9",
    name: "Mercadinho Brasil",
    category: "products",
    city: "Toronto",
    description: "Produtos brasileiros importados: guaraná, farofa, feijão, temperos e muito mais.",
    descriptionEn: "Imported Brazilian products: guaraná, farofa, beans, spices and much more.",
    whatsapp: "+14165550009",
    instagram: "mercadinhobrasilCA",
    email: "mercadinho@brasil.ca",
    type: "company",
    status: "approved",
    createdAt: "2024-03-10",
  },
  {
    id: "pending1",
    name: "Salão BeautyBR",
    category: "beauty",
    city: "Ottawa",
    description: "Salão especializado em técnicas brasileiras de beleza.",
    type: "company",
    status: "pending",
    createdAt: "2024-03-18",
    whatsapp: "+16135550010",
  },
];

export const FEEDBACKS: { id: string; message: string; createdAt: string }[] = [
  { id: "f1", message: "Adorei a plataforma! Seria incrível ter avaliações nos perfis.", createdAt: "2024-03-12" },
  { id: "f2", message: "Could you add a filter by language spoken?", createdAt: "2024-03-14" },
];
