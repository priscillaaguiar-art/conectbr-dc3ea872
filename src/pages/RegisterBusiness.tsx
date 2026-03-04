import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Upload, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { t } from "@/lib/i18n";
import { CATEGORIES, ONTARIO_CITIES } from "@/lib/data";
import { useInsertBusiness } from "@/hooks/use-businesses";
import { useLang } from "@/lib/LangContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const STEPS_PT = ["Informações", "Contato", "Revisão"];
const STEPS_EN = ["Information", "Contact", "Review"];

function stripNonDigits(val: string) {
  return val.replace(/\D/g, "");
}

function formatPhoneMask(digits: string) {
  if (digits.length === 0) return "";
  if (digits.length <= 1) return `+${digits}`;
  if (digits.length <= 4) return `+${digits.slice(0, 1)} (${digits.slice(1)}`;
  if (digits.length <= 7) return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
  if (digits.length <= 11) return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  // For longer numbers (e.g. Brazil +55)
  if (digits.length <= 2) return `+${digits}`;
  if (digits.length <= 4) return `+${digits.slice(0, 2)} (${digits.slice(2)}`;
  // Generic fallback
  return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}${digits.length > 11 ? digits.slice(11) : ""}`;
}

function handlePhoneInput(rawValue: string): string {
  const digits = stripNonDigits(rawValue).slice(0, 15);
  return formatPhoneMask(digits);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function autocropImage(file: File): Promise<{ file: File; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const TARGET_RATIO = 16 / 9;
      const srcW = img.naturalWidth;
      const srcH = img.naturalHeight;
      let cropX = 0, cropY = 0, cropW = srcW, cropH = srcH;
      const currentRatio = srcW / srcH;
      if (currentRatio > TARGET_RATIO) {
        cropH = srcH;
        cropW = Math.round(srcH * TARGET_RATIO);
        cropX = Math.round((srcW - cropW) / 2);
        cropY = 0;
      } else {
        cropW = srcW;
        cropH = Math.round(srcW / TARGET_RATIO);
        cropX = 0;
        cropY = Math.round(srcH * 0.05);
        if (cropY + cropH > srcH) cropY = srcH - cropH;
        if (cropY < 0) cropY = 0;
      }
      const outW = Math.min(cropW, 1200);
      const outH = Math.round(outW / TARGET_RATIO);
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, outW, outH);
      URL.revokeObjectURL(objectUrl);
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("Canvas toBlob failed")); return; }
          const croppedFile = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, "") + "_cropped.jpg",
            { type: "image/jpeg" }
          );
          const previewUrl = URL.createObjectURL(blob);
          resolve({ file: croppedFile, previewUrl });
        },
        "image/jpeg",
        0.88
      );
    };
    img.onerror = reject;
    img.src = objectUrl;
  });
}

export default function RegisterBusiness() {
  const { lang, setLang } = useLang();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login?redirect=/cadastrar", { replace: true });
    }
  }, [user, loading, navigate]);

  const [submitted, setSubmitted] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-verde border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {lang === "pt" ? "Verificando acesso..." : "Checking access..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  const [step, setStep] = useState(0);
  const insertBusiness = useInsertBusiness();
  const formTopRef = useRef<HTMLDivElement>(null);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

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
      // Email validation
      if (form.email && !EMAIL_REGEX.test(form.email)) {
        newErrors.email = lang === "pt" ? "Por favor, insira um e-mail válido." : "Please enter a valid email.";
      }
      // WhatsApp validation
      if (form.whatsapp) {
        const digits = stripNonDigits(form.whatsapp);
        if (digits.length < 10 || digits.length > 15) {
          newErrors.whatsapp = lang === "pt"
            ? "Número inválido. Use o formato +1 (416) 555-0000"
            : "Invalid number. Use format +1 (416) 555-0000";
        }
      }
      // Phone validation
      if (form.phone) {
        const digits = stripNonDigits(form.phone);
        if (digits.length < 10 || digits.length > 15) {
          newErrors.phone = lang === "pt"
            ? "Número inválido. Use o formato +1 (416) 555-0000"
            : "Invalid number. Use format +1 (416) 555-0000";
        }
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
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
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
      let photoUrl: string | undefined = undefined;
      if (photoFile) {
        setUploadingPhoto(true);
        try {
          const ext = photoFile.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("business-photos")
            .upload(fileName, photoFile, { upsert: false });

          if (uploadError) {
            console.error("Upload error:", uploadError);
            setPhotoError(
              lang === "pt"
                ? "Erro ao enviar foto. O cadastro será salvo sem imagem."
                : "Error uploading photo. Listing will be saved without image."
            );
          } else if (uploadData) {
            const { data: urlData } = supabase.storage.from("business-photos").getPublicUrl(uploadData.path);
            photoUrl = urlData.publicUrl;
          }
        } finally {
          setUploadingPhoto(false);
        }
      }

      await insertBusiness.mutateAsync({
        name: form.name,
        category: form.category,
        city: form.city,
        description: form.description,
        type: form.type,
        whatsapp: form.whatsapp ? stripNonDigits(form.whatsapp) : undefined,
        instagram: form.instagram || undefined,
        phone: form.phone ? stripNonDigits(form.phone) : undefined,
        email: form.email || undefined,
        photo: photoUrl,
        owner_id: user?.id || undefined,
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error registering business:", err);
    }
  };

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const updatePhone = (field: "whatsapp" | "phone") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = handlePhoneInput(e.target.value);
    setForm((f) => ({ ...f, [field]: masked }));
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
        <div ref={formTopRef} />
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
                <div className="flex items-start gap-2.5 bg-accent-muted border border-accent/25 rounded-xl px-4 py-3 mb-3">
                  <span className="text-lg flex-shrink-0">📸</span>
                  <div>
                    <p className="text-xs font-semibold text-amarelo-dark mb-0.5">
                      {lang === "pt" ? "Dica para uma foto incrível!" : "Tips for an amazing photo!"}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {lang === "pt"
                        ? "Use uma foto horizontal (paisagem) com proporção 16:9 ou 3:2 — tipo foto de capa. Imagens com boa iluminação e fundo limpo causam muito mais impacto. PNG, JPG ou WEBP · máx. 5MB"
                        : "Use a horizontal (landscape) photo with 16:9 or 3:2 ratio — like a cover photo. Well-lit images with clean backgrounds make a much stronger impression. PNG, JPG or WEBP · max 5MB"}
                    </p>
                  </div>
                </div>
                <label
                  htmlFor="photo-upload-register"
                  className="block border-2 border-dashed border-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary/40 transition-colors"
                >
                  <input
                    type="file"
                    id="photo-upload-register"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        setPhotoError(lang === "pt" ? "Imagem muito grande. Máximo 5MB." : "Image too large. Max 5MB.");
                        return;
                      }
                      setPhotoError(null);
                      setPhotoPreview(URL.createObjectURL(file));
                      try {
                        const { file: croppedFile, previewUrl } = await autocropImage(file);
                        setPhotoFile(croppedFile);
                        setPhotoPreview(previewUrl);
                      } catch {
                        setPhotoFile(file);
                        setPhotoPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {photoPreview ? (
                    <div className="relative">
                      <div className="aspect-video w-full overflow-hidden">
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                        <span className="bg-white/90 text-foreground text-xs font-semibold px-4 py-2 rounded-full">
                          {lang === "pt" ? "Clique para trocar a foto" : "Click to change photo"}
                        </span>
                      </div>
                      <div className="px-4 py-2.5 bg-primary-muted border-t border-primary/15 flex items-center gap-2">
                        <span className="text-primary text-xs">✓</span>
                        <p className="text-xs text-primary font-medium">
                          {lang === "pt" ? "Foto ajustada para o formato ideal do site" : "Photo adjusted to the ideal site format"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {lang === "pt" ? "Clique para upload ou arraste aqui" : "Click to upload or drag here"}
                      </p>
                    </div>
                  )}
                </label>
                {photoError && <p className="text-xs text-destructive mt-1.5">{photoError}</p>}
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

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {lang === "pt" ? "Tipo de cadastro" : "Listing type"} *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "company", label: lang === "pt" ? "🏢 Empresa" : "🏢 Company" },
                    { value: "freelancer", label: lang === "pt" ? "👤 Autônomo" : "👤 Freelancer" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: opt.value }))}
                      className={`rounded-xl p-4 text-sm font-semibold cursor-pointer transition-all text-center ${
                        form.type === opt.value
                          ? "border-2 border-verde bg-verde-light text-verde"
                          : "border border-border bg-white text-body"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
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
                    <input type="tel" value={form.whatsapp} onChange={updatePhone("whatsapp")} className={`${fieldClass(errors.whatsapp)} text-sm`} placeholder="+1 (416) 555-0001" />
                    {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t(lang, "form_instagram")}</label>
                    <input type="text" value={form.instagram} onChange={update("instagram")} className="input-search w-full text-sm" placeholder="@seunegocio" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t(lang, "form_phone")}</label>
                    <input type="tel" value={form.phone} onChange={updatePhone("phone")} className={`${fieldClass(errors.phone)} text-sm`} placeholder="+1 (416) 555-0001" />
                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t(lang, "form_email")}</label>
                    <input type="email" value={form.email} onChange={update("email")} className={`${fieldClass(errors.email)} text-sm`} placeholder="seu@email.com" />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
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
                {photoPreview && (
                  <div className="aspect-video w-full max-w-sm overflow-hidden rounded-xl">
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover object-top" />
                  </div>
                )}
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
                <button type="button" onClick={handleSubmit} disabled={insertBusiness.isPending || uploadingPhoto} className="btn-accent flex-1 py-4 text-base">
                  {uploadingPhoto
                    ? (lang === "pt" ? "Enviando foto..." : "Uploading photo...")
                    : insertBusiness.isPending
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
