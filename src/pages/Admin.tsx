import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Trash2, MessageSquare, Building2, Clock, LogOut, Pencil, Mail } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { t } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/data";
import {
  useAllBusinesses,
  useUpdateBusinessStatus,
  useDeleteBusiness,
  useFeedbacks,
  BusinessRow,
} from "@/hooks/use-businesses";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-admin-role";
import { useLang } from "@/lib/LangContext";
import { EditBusinessModal } from "@/components/admin/EditBusinessModal";

type Tab = "pending" | "approved" | "feedbacks";

export default function Admin() {
  const { lang, setLang } = useLang();
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [editingBusiness, setEditingBusiness] = useState<BusinessRow | null>(null);

  const { data: businesses = [], isLoading } = useAllBusinesses();
  const { data: feedbacks = [] } = useFeedbacks();
  const updateStatus = useUpdateBusinessStatus();
  const deleteBusiness = useDeleteBusiness();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && !roleLoading && user && isAdmin === false) {
      navigate("/");
    }
  }, [user, authLoading, roleLoading, isAdmin, navigate]);

  const pending = businesses.filter((b) => b.status === "pending");
  const approved = businesses.filter((b) => b.status === "approved");

  const approve = (id: string) => updateStatus.mutate({ id, status: "approved" });
  const reject = (id: string) => updateStatus.mutate({ id, status: "rejected" });
  const remove = (id: string) => deleteBusiness.mutate(id);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: "pending", label: t(lang, "admin_pending"), icon: <Clock className="w-4 h-4" />, count: pending.length },
    { key: "approved", label: t(lang, "admin_approved"), icon: <CheckCircle className="w-4 h-4" />, count: approved.length },
    { key: "feedbacks", label: t(lang, "admin_feedbacks"), icon: <MessageSquare className="w-4 h-4" />, count: feedbacks.length },
  ];

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center text-mid">
          {lang === "pt" ? "Verificando acesso..." : "Checking access..."}
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar lang={lang} onLangChange={setLang} />

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-dark">{t(lang, "admin_title")}</h1>
            <p className="text-sm text-mid">BRConect — backoffice</p>
          </div>
          <button
            onClick={async () => { await signOut(); navigate("/admin/login"); }}
            className="flex items-center gap-2 text-sm text-mid hover:text-red-600 border border-border rounded-xl px-4 py-2 transition-colors ml-auto"
          >
            <LogOut className="w-4 h-4" />
            {lang === "pt" ? "Sair" : "Sign out"}
          </button>
        </div>

        <div className="flex gap-2 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? "border-verde text-verde"
                  : "border-transparent text-mid hover:text-dark"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  activeTab === tab.key ? "bg-verde-light text-verde" : "bg-verde-muted text-mid"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-mid">
            {lang === "pt" ? "Carregando..." : "Loading..."}
          </div>
        ) : (
          <>
            {activeTab === "pending" && (
              <div>
                {pending.length === 0 ? (
                  <div className="text-center py-16 text-mid">
                    <CheckCircle className="w-10 h-10 mx-auto mb-3 text-verde" />
                    <p>{t(lang, "no_pending")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pending.map((b) => (
                      <BusinessAdminCard
                        key={b.id}
                        business={b}
                        lang={lang}
                        onApprove={() => approve(b.id)}
                        onReject={() => reject(b.id)}
                        onDelete={() => remove(b.id)}
                        onEdit={() => setEditingBusiness(b)}
                        showApprove
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "approved" && (
              <div className="space-y-4">
                {approved.map((b) => (
                  <BusinessAdminCard
                    key={b.id}
                    business={b}
                    lang={lang}
                    onDelete={() => remove(b.id)}
                    onEdit={() => setEditingBusiness(b)}
                  />
                ))}
              </div>
            )}

            {activeTab === "feedbacks" && (
              <div className="space-y-4">
                {feedbacks.map((f) => (
                  <div key={f.id} className="bg-white border border-border rounded-2xl p-5">
                    <p className="text-dark mb-3 leading-relaxed italic">"{f.message}"</p>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        {f.name && <p className="text-sm font-semibold text-foreground">{f.name}</p>}
                        {f.email && (
                          <a href={`mailto:${f.email}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <Mail className="w-3.5 h-3.5" />
                            {f.email}
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-mid">{new Date(f.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {editingBusiness && (
        <EditBusinessModal
          business={editingBusiness}
          lang={lang}
          onClose={() => setEditingBusiness(null)}
        />
      )}
    </div>
  );
}

// --- Sub-component ---

interface BusinessAdminCardProps {
  business: BusinessRow;
  lang: "pt" | "en";
  onApprove?: () => void;
  onReject?: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  showApprove?: boolean;
}

function BusinessAdminCard({ business, lang, onApprove, onReject, onDelete, onEdit, showApprove }: BusinessAdminCardProps) {
  const cat = CATEGORIES.find((c) => c.key === business.category);
  const initials = business.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <div className="bg-white border border-border rounded-2xl p-5 flex items-start gap-4">
      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-border shadow-sm">
        {business.photo ? (
          <img
            src={business.photo}
            alt={business.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full gradient-hero flex items-center justify-center">
            <span className="font-display font-bold text-base text-white">
              {initials}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-semibold text-dark">{business.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {cat && <span className="text-xs text-mid">{cat.emoji} {t(lang, cat.labelKey as any)}</span>}
              <span className="text-mid">·</span>
              <span className="text-xs text-mid">{business.city}</span>
              <span className="text-mid">·</span>
              <span className="text-xs text-mid">{new Date(business.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-body mt-2 line-clamp-2">{business.description}</p>

        <div className="flex gap-2 mt-4 flex-wrap">
          {showApprove && onApprove && (
            <button
              onClick={onApprove}
              className="flex items-center gap-1.5 bg-verde-light text-verde border border-verde/20 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-verde/20 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              {t(lang, "approve")}
            </button>
          )}
          {showApprove && onReject && (
            <button
              onClick={onReject}
              className="flex items-center gap-1.5 bg-amarelo-light text-amarelo-dark border border-amarelo/20 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-amarelo/30 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              {t(lang, "reject")}
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-blue-100 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              {t(lang, "edit")}
            </button>
          )}
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-red-100 transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            {t(lang, "delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
