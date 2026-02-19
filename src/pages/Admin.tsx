import { useState } from "react";
import { CheckCircle, XCircle, Trash2, MessageSquare, Building2, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Lang, t } from "@/lib/i18n";
import { MOCK_BUSINESSES, FEEDBACKS, Business, CATEGORIES } from "@/lib/data";

type Tab = "pending" | "approved" | "feedbacks";

export default function Admin() {
  const [lang, setLang] = useState<Lang>("pt");
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);

  const pending = businesses.filter((b) => b.status === "pending");
  const approved = businesses.filter((b) => b.status === "approved");

  const approve = (id: string) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "approved" } : b))
    );
  };

  const reject = (id: string) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "rejected" } : b))
    );
  };

  const remove = (id: string) => {
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: "pending", label: t(lang, "admin_pending"), icon: <Clock className="w-4 h-4" />, count: pending.length },
    { key: "approved", label: t(lang, "admin_approved"), icon: <CheckCircle className="w-4 h-4" />, count: approved.length },
    { key: "feedbacks", label: t(lang, "admin_feedbacks"), icon: <MessageSquare className="w-4 h-4" />, count: FEEDBACKS.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar lang={lang} onLangChange={setLang} />

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">{t(lang, "admin_title")}</h1>
            <p className="text-sm text-muted-foreground">BRConect — backoffice</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  activeTab === tab.key ? "bg-primary-muted text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Pending */}
        {activeTab === "pending" && (
          <div>
            {pending.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <CheckCircle className="w-10 h-10 mx-auto mb-3 text-secondary" />
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
                    showApprove
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Approved */}
        {activeTab === "approved" && (
          <div className="space-y-4">
            {approved.map((b) => (
              <BusinessAdminCard
                key={b.id}
                business={b}
                lang={lang}
                onDelete={() => remove(b.id)}
              />
            ))}
          </div>
        )}

        {/* Feedbacks */}
        {activeTab === "feedbacks" && (
          <div className="space-y-4">
            {FEEDBACKS.map((f) => (
              <div key={f.id} className="bg-card border border-border rounded-2xl p-5">
                <p className="text-foreground mb-2 leading-relaxed">"{f.message}"</p>
                <p className="text-xs text-muted-foreground">{new Date(f.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface BusinessAdminCardProps {
  business: Business;
  lang: Lang;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete: () => void;
  showApprove?: boolean;
}

function BusinessAdminCard({ business, lang, onApprove, onReject, onDelete, showApprove }: BusinessAdminCardProps) {
  const cat = CATEGORIES.find((c) => c.key === business.category);
  const initials = business.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shrink-0">
        <span className="font-display font-bold text-sm text-primary-foreground">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-semibold text-foreground">{business.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {cat && <span className="text-xs text-muted-foreground">{cat.emoji} {t(lang, cat.labelKey as any)}</span>}
              <span className="text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{business.city}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{new Date(business.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{business.description}</p>

        <div className="flex gap-2 mt-4 flex-wrap">
          {showApprove && onApprove && (
            <button
              onClick={onApprove}
              className="flex items-center gap-1.5 bg-secondary-muted text-secondary border border-secondary/20 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-secondary/20 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              {t(lang, "approve")}
            </button>
          )}
          {showApprove && onReject && (
            <button
              onClick={onReject}
              className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-orange-100 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              {t(lang, "reject")}
            </button>
          )}
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-destructive/20 transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            {t(lang, "delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
