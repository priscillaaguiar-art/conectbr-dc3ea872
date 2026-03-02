import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { t } from "@/lib/i18n";
import { CATEGORIES, ONTARIO_CITIES } from "@/lib/data";
import { BusinessRow, useUpdateBusiness } from "@/hooks/use-businesses";
import { Lang } from "@/lib/i18n";

interface EditBusinessModalProps {
  business: BusinessRow;
  lang: Lang;
  onClose: () => void;
}

export function EditBusinessModal({ business, lang, onClose }: EditBusinessModalProps) {
  const updateBusiness = useUpdateBusiness();
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
    status: business.status,
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSave = async () => {
    await updateBusiness.mutateAsync({
      id: business.id,
      name: form.name,
      category: form.category,
      city: form.city,
      description: form.description,
      whatsapp: form.whatsapp || null,
      instagram: form.instagram || null,
      phone: form.phone || null,
      email: form.email || null,
      type: form.type,
      status: form.status,
    });
    onClose();
  };

  const inputClass = "input-search w-full text-sm";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-lg text-foreground">
            {lang === "pt" ? "Editar cadastro" : "Edit listing"}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">{t(lang, "form_name")}</label>
            <input type="text" value={form.name} onChange={update("name")} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">{t(lang, "form_category")}</label>
              <div className="relative">
                <select value={form.category} onChange={update("category")} className={`${inputClass} appearance-none pr-8`}>
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>{c.emoji} {t(lang, c.labelKey as any)}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">{t(lang, "form_city")}</label>
              <div className="relative">
                <select value={form.city} onChange={update("city")} className={`${inputClass} appearance-none pr-8`}>
                  {ONTARIO_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">{t(lang, "form_description")}</label>
            <textarea value={form.description} onChange={update("description")} rows={3} className={`${inputClass} resize-none`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">WhatsApp</label>
              <input type="tel" value={form.whatsapp} onChange={update("whatsapp")} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Instagram</label>
              <input type="text" value={form.instagram} onChange={update("instagram")} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">{t(lang, "form_phone")}</label>
              <input type="tel" value={form.phone} onChange={update("phone")} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
              <input type="email" value={form.email} onChange={update("email")} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {lang === "pt" ? "Tipo" : "Type"}
              </label>
              <div className="relative">
                <select value={form.type} onChange={update("type")} className={`${inputClass} appearance-none pr-8`}>
                  <option value="company">{lang === "pt" ? "Empresa" : "Company"}</option>
                  <option value="freelancer">{lang === "pt" ? "Autônomo" : "Freelancer"}</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
              <div className="relative">
                <select value={form.status} onChange={update("status")} className={`${inputClass} appearance-none pr-8`}>
                  <option value="pending">{lang === "pt" ? "Pendente" : "Pending"}</option>
                  <option value="approved">{lang === "pt" ? "Aprovado" : "Approved"}</option>
                  <option value="rejected">{lang === "pt" ? "Rejeitado" : "Rejected"}</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-outline flex-1 py-3 text-sm">
            {lang === "pt" ? "Cancelar" : "Cancel"}
          </button>
          <button
            onClick={handleSave}
            disabled={updateBusiness.isPending}
            className="btn-primary flex-1 py-3 text-sm"
          >
            {updateBusiness.isPending
              ? (lang === "pt" ? "Salvando..." : "Saving...")
              : (lang === "pt" ? "Salvar alterações" : "Save changes")}
          </button>
        </div>
      </div>
    </div>
  );
}
