import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Pencil, X, CheckCircle, Clock, XCircle, Upload } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useMyBusinesses, useUpdateMyBusiness } from "@/hooks/use-user-businesses";
import { useLang } from "@/lib/LangContext";
import { CATEGORIES, ONTARIO_CITIES } from "@/lib/data";
import { t } from "@/lib/i18n";
import type { BusinessRow } from "@/hooks/use-businesses";
import { supabase } from "@/integrations/supabase/client";

const STATUS_BADGE: Record<string, { label: { pt: string; en: string }; className: string; icon: React.ReactNode }> = {
  pending: { label: { pt: "Pendente", en: "Pending" }, className: "bg-amber-50 text-amber-700 border-amber-200", icon: <Clock className="w-3.5 h-3.5" /> },
  approved: { label: { pt: "Aprovado", en: "Approved" }, className: "bg-verde-light text-verde border-verde/20", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  rejected: { label: { pt: "Rejeitado", en: "Rejected" }, className: "bg-red-50 text-red-600 border-red-200", icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function MinhaConta() {
  const { lang, setLang } = useLang();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: myBusinesses = [], isLoading } = useMyBusinesses(user?.id);
  const updateBusiness = useUpdateMyBusiness();
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">{lang === "pt" ? "Carregando..." : "Loading..."}</p>
      </div>
    );
  }

  const initial = (user.email || "U")[0].toUpperCase();
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="container mx-auto px-4 py-10 max-w-3xl flex-1">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-verde flex items-center justify-center shrink-0 overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-display font-bold text-xl">{initial}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-xl text-foreground truncate">
              {user.user_metadata?.full_name || user.email}
            </h1>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
          <button
            onClick={async () => { await signOut(); navigate("/"); }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive border border-border rounded-xl px-4 py-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {lang === "pt" ? "Sair" : "Sign out"}
          </button>
        </div>

        {/* My businesses */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-lg text-foreground">
            {lang === "pt" ? "Meus Negócios" : "My Businesses"}
          </h2>
          <button onClick={() => navigate("/cadastrar")} className="flex items-center gap-1.5 btn-accent text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            {lang === "pt" ? "Novo negócio" : "New business"}
          </button>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-10">{lang === "pt" ? "Carregando..." : "Loading..."}</p>
        ) : myBusinesses.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <div className="text-5xl mb-4">🏪</div>
            <p className="font-display font-semibold text-lg text-foreground mb-2">
              {lang === "pt" ? "Nenhum negócio cadastrado" : "No businesses registered"}
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              {lang === "pt" ? "Cadastre seu primeiro negócio e apareça no BRConect!" : "Register your first business and appear on BRConect!"}
            </p>
            <button onClick={() => navigate("/cadastrar")} className="btn-primary">
              <Plus className="w-4 h-4 inline mr-1" />
              {lang === "pt" ? "Cadastrar negócio" : "Register business"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myBusinesses.map((b) => (
              <div key={b.id}>
                {editingId === b.id ? (
                  <EditForm
                    business={b}
                    lang={lang}
                    onCancel={() => setEditingId(null)}
                    onSave={async (fields) => {
                      await updateBusiness.mutateAsync({ id: b.id, ...fields });
                      setEditingId(null);
                    }}
                    saving={updateBusiness.isPending}
                  />
                ) : (
                  <MyBusinessCard
                    business={b}
                    lang={lang}
                    onEdit={() => setEditingId(b.id)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer lang={lang} />
    </div>
  );
}

function MyBusinessCard({ business, lang, onEdit }: { business: BusinessRow; lang: "pt" | "en"; onEdit: () => void }) {
  const cat = CATEGORIES.find((c) => c.key === business.category);
  const badge = STATUS_BADGE[business.status] || STATUS_BADGE.pending;
  const initials = business.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shrink-0 overflow-hidden">
        {business.photo ? (
          <img src={business.photo} alt={business.name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-display font-bold text-sm text-white">{initials}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-foreground">{business.name}</h3>
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${badge.className}`}>
            {badge.icon}
            {badge.label[lang]}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          {cat && <span>{cat.emoji} {t(lang, cat.labelKey as any)}</span>}
          <span>·</span>
          <span>{business.city}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{business.description}</p>
        <button onClick={onEdit} className="flex items-center gap-1.5 mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
          <Pencil className="w-3.5 h-3.5" />
          {lang === "pt" ? "Editar" : "Edit"}
        </button>
      </div>
    </div>
  );
}

function EditForm({ business, lang, onCancel, onSave, saving }: {
  business: BusinessRow;
  lang: "pt" | "en";
  onCancel: () => void;
  onSave: (fields: Partial<BusinessRow>) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    name: business.name,
    category: business.category,
    city: business.city,
    description: business.description,
    whatsapp: business.whatsapp || "",
    instagram: business.instagram || "",
    phone: business.phone || "",
    email: business.email || "",
    type: business.type,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(business.photo || null);
  const [success, setSuccess] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSave = async () => {
    let photoUrl = business.photo || undefined;
    if (photoFile) {
      const ext = photoFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("business-photos")
        .upload(fileName, photoFile, { upsert: false });
      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from("business-photos").getPublicUrl(uploadData.path);
        photoUrl = urlData.publicUrl;
      }
    }
    await onSave({
      name: form.name,
      category: form.category,
      city: form.city,
      description: form.description,
      whatsapp: form.whatsapp || null,
      instagram: form.instagram || null,
      phone: form.phone || null,
      email: form.email || null,
      type: form.type,
      photo: photoUrl || null,
    } as any);
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-card border-2 border-verde/30 rounded-2xl p-6 space-y-4">
      {success && (
        <div className="bg-verde-light text-verde rounded-xl px-4 py-3 text-sm font-medium">
          {lang === "pt" ? "Suas alterações foram enviadas para aprovação." : "Your changes have been submitted for approval."}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">{t(lang, "form_name")}</label>
          <input value={form.name} onChange={update("name")} className="input-search w-full text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">{t(lang, "form_category")}</label>
          <select value={form.category} onChange={update("category")} className="input-search w-full text-sm">
            {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.emoji} {t(lang, c.labelKey as any)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">{t(lang, "form_city")}</label>
          <select value={form.city} onChange={update("city")} className="input-search w-full text-sm">
            {ONTARIO_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">WhatsApp</label>
          <input value={form.whatsapp} onChange={update("whatsapp")} className="input-search w-full text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Instagram</label>
          <input value={form.instagram} onChange={update("instagram")} className="input-search w-full text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
          <input value={form.email} onChange={update("email")} className="input-search w-full text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">{t(lang, "form_description")}</label>
        <textarea value={form.description} onChange={update("description")} rows={3} className="input-search w-full text-sm resize-none" />
      </div>
      {/* Photo */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">{t(lang, "form_photo")}</label>
        <label className="border border-dashed border-border rounded-xl p-4 text-center cursor-pointer block hover:border-verde/40 transition-colors">
          <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) return;
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
          }} />
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className="max-h-24 mx-auto rounded-lg object-contain" />
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Upload className="w-4 h-4" />
              {lang === "pt" ? "Alterar foto" : "Change photo"}
            </div>
          )}
        </label>
      </div>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-outline flex-1 py-2.5 text-sm">
          <X className="w-4 h-4 inline mr-1" />
          {lang === "pt" ? "Cancelar" : "Cancel"}
        </button>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-2.5 text-sm">
          {saving ? "..." : (lang === "pt" ? "Salvar alterações" : "Save changes")}
        </button>
      </div>
    </div>
  );
}
