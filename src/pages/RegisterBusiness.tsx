import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Upload, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Lang, t } from "@/lib/i18n";
import { CATEGORIES, ONTARIO_CITIES } from "@/lib/data";
import { useInsertBusiness } from "@/hooks/use-businesses";

export default function RegisterBusiness() {
  const [lang, setLang] = useState<Lang>("pt");
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const insertBusiness = useInsertBusiness();

  const [form, setForm] = useState({
    name: "",
    category: "",
    city: "",
    description: "",
    whatsapp: "",
    instagram: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.name.trim()) newErrors.name = lang === "pt" ? "Nome obrigatório" : "Name required";
    if (!form.category) newErrors.category = lang === "pt" ? "Selecione uma categoria" : "Select a category";
    if (!form.city) newErrors.city = lang === "pt" ? "Selecione uma cidade" : "Select a city";
    if (!form.description.trim()) newErrors.description = lang === "pt" ? "Descrição obrigatória" : "Description required";
    if (!form.whatsapp && !form.phone && !form.email) {
      newErrors.whatsapp = lang === "pt" ? "Informe ao menos um contato" : "Provide at least one contact";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await insertBusiness.mutateAsync({
        name: form.name,
        category: form.category,
        city: form.city,
        description: form.description,
        whatsapp: form.whatsapp || undefined,
        instagram: form.instagram || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error registering business:", err);
    }
  };

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar lang={lang} onLangChange={setLang} />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-secondary-muted flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-3">
              {t(lang, "form_success")}
            </h2>
            <p className="text-muted-foreground mb-8">{t(lang, "form_success_desc")}</p>
            <button onClick={() => navigate("/")} className="btn-primary">
              {t(lang, "back_home")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fieldClass = (err?: string) =>
    `input-search w-full ${err ? "border-destructive ring-1 ring-destructive" : ""}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="container mx-auto px-4 py-10 max-w-2xl flex-1">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(lang, "back")}
        </button>

        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground mb-2">
            {t(lang, "register_title")}
          </h1>
          <p className="text-muted-foreground">{t(lang, "register_subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t(lang, "form_photo")} <span className="text-muted-foreground text-xs">{t(lang, "optional")}</span>
            </label>
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {lang === "pt" ? "Clique para upload ou arraste aqui" : "Click to upload or drag here"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP — máx. 5MB</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t(lang, "form_name")} *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={update("name")}
              className={fieldClass(errors.name)}
              placeholder={lang === "pt" ? "Ex: João Silva ou Restaurante Bom Gosto" : "E.g.: João Silva or Bom Gosto Restaurant"}
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>

          {/* Category + City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t(lang, "form_category")} *
              </label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={update("category")}
                  className={`${fieldClass(errors.category)} appearance-none pr-8`}
                >
                  <option value="">{t(lang, "select_category")}</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.emoji} {t(lang, c.labelKey as any)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t(lang, "form_city")} *
              </label>
              <div className="relative">
                <select
                  value={form.city}
                  onChange={update("city")}
                  className={`${fieldClass(errors.city)} appearance-none pr-8`}
                >
                  <option value="">{t(lang, "select_city")}</option>
                  {ONTARIO_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t(lang, "form_description")} *
            </label>
            <textarea
              value={form.description}
              onChange={update("description")}
              rows={4}
              maxLength={400}
              className={`${fieldClass(errors.description)} resize-none`}
              placeholder={lang === "pt" ? "Descreva seu negócio ou serviço em poucas palavras..." : "Describe your business or service in a few words..."}
            />
            <div className="flex justify-between mt-1">
              {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
              <p className="text-xs text-muted-foreground ml-auto">{form.description.length}/400</p>
            </div>
          </div>

          {/* Contact section */}
          <div className="bg-muted/50 rounded-2xl p-5 space-y-4">
            <p className="text-sm font-semibold text-foreground">
              {lang === "pt" ? "Informações de contato" : "Contact information"}{" "}
              <span className="text-xs text-muted-foreground font-normal">
                ({lang === "pt" ? "ao menos um obrigatório" : "at least one required"})
              </span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  {t(lang, "form_whatsapp")}
                </label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={update("whatsapp")}
                  className={`${fieldClass(errors.whatsapp)} text-sm`}
                  placeholder="+1 (416) 555-0001"
                />
                {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  {t(lang, "form_instagram")}
                </label>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={update("instagram")}
                  className="input-search w-full text-sm"
                  placeholder="@seunegocio"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  {t(lang, "form_phone")}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  className="input-search w-full text-sm"
                  placeholder="+1 (416) 555-0001"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  {t(lang, "form_email")}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  className="input-search w-full text-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={insertBusiness.isPending} className="btn-accent w-full py-4 text-base">
            {insertBusiness.isPending
              ? (lang === "pt" ? "Salvando..." : "Saving...")
              : t(lang, "form_save")}
          </button>
        </form>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
