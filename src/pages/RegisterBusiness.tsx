import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Upload, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { t } from "@/lib/i18n";
import { CATEGORIES, ONTARIO_CITIES } from "@/lib/data";
import { useInsertBusiness } from "@/hooks/use-businesses";
import { useLang } from "@/lib/LangContext";

const STEPS_PT = ["Informações", "Contato", "Revisão"];
const STEPS_EN = ["Information", "Contact", "Review"];

export default function RegisterBusiness() {
  const { lang, setLang } = useLang();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const insertBusiness = useInsertBusiness();

  const steps = lang === "pt" ? STEPS_PT : STEPS_EN;

  const [form, setForm] = useState({
    name: "",
    category: "",
    city: "",
    type: "company",
    description: "",
    whatsapp: "",
    instagram: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validateStep = (s: number) => {
    const newErrors: Partial<typeof form> = {};
    if (s === 0) {
      if (!form.name.trim()) newErrors.name = lang === "pt" ? "Nome obrigatório" : "Name required";
      if (!form.category) newErrors.category = lang === "pt" ? "Selecione uma categoria" : "Select a category";
      if (!form.city) newErrors.city = lang === "pt" ? "Selecione uma cidade" : "Select a city";
      if (!form.description.trim()) newErrors.description = lang === "pt" ? "Descrição obrigatória" : "Description required";
    }
    if (s === 1) {
      if (!form.whatsapp && !form.phone && !form.email) {
        newErrors.whatsapp = lang === "pt" ? "Informe ao menos um contato" : "Provide at least one contact";
      }
    }
    return newErrors;
  };

  const nextStep = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, 2));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    // validate all steps
    const errs0 = validateStep(0);
    const errs1 = validateStep(1);
    const allErrs = { ...errs0, ...errs1 };
    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs);
      if (Object.keys(errs0).length) setStep(0);
      else if (Object.keys(errs1).length) setStep(1);
      return;
    }
    try {
      await insertBusiness.mutateAsync({
        name: form.name,
        category: form.category,
        city: form.city,
        description: form.description,
        type: form.type,
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
          <div className="text-center max-w-md animate-fade-up">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-3">
              {t(lang, "form_success")}
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">{t(lang, "form_success_desc")}</p>
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

      <main className="container mx-auto px-4 py-12 max-w-2xl flex-1">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(lang, "back")}
        </button>

        <div className="mb-10">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
            {t(lang, "register_title")}
          </h1>
          <p className="text-muted-foreground">{t(lang, "register_subtitle")}</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-1 mb-10">
          {steps.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-center">
                <div className={`flex-1 h-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-border"}`} />
              </div>
              <span className={`text-xs font-medium transition-colors ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          {/* Step 0: Info */}
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
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
                <label className="block text-sm font-medium text-foreground mb-1.5">{t(lang, "form_name")} *</label>
                <input type="text" value={form.name} onChange={update("name")} className={fieldClass(errors.name)}
                  placeholder={lang === "pt" ? "Ex: João Silva ou Restaurante Bom Gosto" : "E.g.: João Silva or Bom Gosto Restaurant"} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              {/* Category + City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t(lang, "form_category")} *</label>
                  <div className="relative">
                    <select value={form.category} onChange={update("category")} className={`${fieldClass(errors.category)} appearance-none pr-8`}>
                      <option value="">{t(lang, "select_category")}</option>
                      {CATEGORIES.map((c) => (<option key={c.key} value={c.key}>{c.emoji} {t(lang, c.labelKey as any)}</option>))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t(lang, "form_city")} *</label>
                  <div className="relative">
                    <select value={form.city} onChange={update("city")} className={`${fieldClass(errors.city)} appearance-none pr-8`}>
                      <option value="">{t(lang, "select_city")}</option>
                      {ONTARIO_CITIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t(lang, "form_description")} *</label>
                <textarea value={form.description} onChange={update("description")} rows={4} maxLength={400}
                  className={`${fieldClass(errors.description)} resize-none`}
                  placeholder={lang === "pt" ? "Descreva seu negócio ou serviço em poucas palavras..." : "Describe your business or service in a few words..."} />
                <div className="flex justify-between mt-1">
                  {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                  <p className="text-xs text-muted-foreground ml-auto">{form.description.length}/400</p>
                </div>
              </div>

              <button type="button" onClick={nextStep} className="btn-primary w-full py-4 text-base">
                {lang === "pt" ? "Continuar" : "Continue"}
              </button>
            </div>
          )}

          {/* Step 1: Contact */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-muted/50 rounded-2xl p-6 space-y-4">
                <p className="text-sm font-semibold text-foreground">
                  {lang === "pt" ? "Informações de contato" : "Contact information"}{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    ({lang === "pt" ? "ao menos um obrigatório" : "at least one required"})
                  </span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t(lang, "form_whatsapp")}</label>
                    <input type="tel" value={form.whatsapp} onChange={update("whatsapp")} className={`${fieldClass(errors.whatsapp)} text-sm`} placeholder="+1 (416) 555-0001" />
                    {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t(lang, "form_instagram")}</label>
                    <input type="text" value={form.instagram} onChange={update("instagram")} className="input-search w-full text-sm" placeholder="@seunegocio" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t(lang, "form_phone")}</label>
                    <input type="tel" value={form.phone} onChange={update("phone")} className="input-search w-full text-sm" placeholder="+1 (416) 555-0001" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t(lang, "form_email")}</label>
                    <input type="email" value={form.email} onChange={update("email")} className="input-search w-full text-sm" placeholder="seu@email.com" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={prevStep} className="btn-outline flex-1 py-4 text-base">
                  {lang === "pt" ? "Voltar" : "Back"}
                </button>
                <button type="button" onClick={nextStep} className="btn-primary flex-1 py-4 text-base">
                  {lang === "pt" ? "Continuar" : "Continue"}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-bold text-lg text-foreground">
                  {lang === "pt" ? "Revise seu cadastro" : "Review your listing"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">{t(lang, "form_name")}:</span> <span className="font-medium text-foreground">{form.name}</span></div>
                  <div><span className="text-muted-foreground">{t(lang, "form_category")}:</span> <span className="font-medium text-foreground">{(() => { const sc = CATEGORIES.find((c) => c.key === form.category); return sc ? `${sc.emoji} ${t(lang, sc.labelKey as any)}` : "-"; })()}</span></div>
                  <div><span className="text-muted-foreground">{t(lang, "form_city")}:</span> <span className="font-medium text-foreground">{form.city}</span></div>
                  {form.whatsapp && <div><span className="text-muted-foreground">WhatsApp:</span> <span className="font-medium text-foreground">{form.whatsapp}</span></div>}
                  {form.instagram && <div><span className="text-muted-foreground">Instagram:</span> <span className="font-medium text-foreground">{form.instagram}</span></div>}
                  {form.phone && <div><span className="text-muted-foreground">{t(lang, "phone")}:</span> <span className="font-medium text-foreground">{form.phone}</span></div>}
                  {form.email && <div><span className="text-muted-foreground">Email:</span> <span className="font-medium text-foreground">{form.email}</span></div>}
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">{t(lang, "description")}:</span>
                  <p className="text-sm text-foreground mt-1">{form.description}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={prevStep} className="btn-outline flex-1 py-4 text-base">
                  {lang === "pt" ? "Voltar" : "Back"}
                </button>
                <button type="button" onClick={handleSubmit} disabled={insertBusiness.isPending} className="btn-accent flex-1 py-4 text-base">
                  {insertBusiness.isPending
                    ? (lang === "pt" ? "Salvando..." : "Saving...")
                    : t(lang, "form_save")}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
