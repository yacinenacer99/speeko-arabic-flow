import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const Settings = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("mlasoon_notifications") !== "false";
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [displayEmail, setDisplayEmail] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    void (async () => {
      const { data, error } = await supabase.from("users").select("name").eq("id", session.user.id).maybeSingle();
      if (error) {
        console.log("[MLASOON] settings user load:", error.message);
        return;
      }
      const n = data?.name;
      setDisplayName(typeof n === "string" && n.trim() ? n.trim() : "");
    })();
  }, [session?.user?.id]);

  useEffect(() => {
    const email = session?.user?.email;
    setDisplayEmail(typeof email === "string" ? email : "");
  }, [session?.user?.email]);

  const handlePasswordReset = async () => {
    setPasswordMessage(null);
    const email = session?.user?.email;
    if (!email) {
      setPasswordMessage("لا يوجد بريد مرتبط بالحساب");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings`,
    });
    if (error) {
      console.log("[MLASOON] reset password:", error.message);
      setPasswordMessage("تعذّر إرسال الرابط — حاول مجدداً");
      return;
    }
    setPasswordMessage("تم إرسال رابط تغيير كلمة المرور إلى بريدك");
  };

  const handleNotificationsToggle = (value: boolean) => {
    setNotifications(value);
    localStorage.setItem("mlasoon_notifications", String(value));
    console.log("[MLASOON] Notifications preference saved:", value);
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 24 }}>
      <p className="font-cairo font-bold" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginBottom: 8, paddingRight: 4 }}>{title}</p>
      <div className="glass-card-light" style={{ overflow: "hidden", padding: 0 }}>{children}</div>
    </div>
  );

  const Row = ({ label, right, onClick, danger, isLast }: { label: string; right?: React.ReactNode; onClick?: () => void; danger?: boolean; isLast?: boolean }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between w-full font-cairo font-light"
      style={{
        padding: "14px 16px",
        fontSize: 14,
        color: danger ? "#FF6B6B" : "hsl(var(--foreground))",
        background: "none",
        border: "none",
        borderBottom: isLast ? "none" : "1px solid hsl(var(--border))",
        cursor: onClick ? "pointer" : "default",
        minHeight: 44,
      }}
    >
      <span>{label}</span>
      {right || (onClick && <ChevronLeft size={16} color="hsl(var(--muted-foreground))" />)}
    </button>
  );

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <div
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onToggle();
      }}
      role="switch"
      aria-checked={on}
      tabIndex={0}
      style={{
        width: 44,
        height: 24,
        borderRadius: 999,
        background: on ? "hsl(var(--primary))" : "hsl(var(--border))",
        padding: 2,
        cursor: "pointer",
        transition: "background 0.2s ease",
        minHeight: 44,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "white",
          transform: on ? "translateX(0)" : "translateX(20px)",
          transition: "transform 0.2s ease",
        }}
      />
    </div>
  );

  return (
    <div className="relative" style={{ background: "hsl(var(--background))", minHeight: "100dvh", direction: "rtl" }}>
      <Navbar />
      <BackButton variant="light" />
      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "10%", right: "-8%" }} />

      <div className="page-narrow" style={{ paddingTop: 80 }}>
        <h1 className="font-cairo font-bold" style={{ fontSize: 24, color: "hsl(var(--foreground))", marginBottom: 24 }}>الإعدادات</h1>

        {passwordMessage && (
          <p className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--foreground))", marginBottom: 12 }}>
            {passwordMessage}
          </p>
        )}
        {deleteMessage && (
          <p className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--foreground))", marginBottom: 12 }}>
            {deleteMessage}
          </p>
        )}

        <Section title="الحساب">
          <Row label="الاسم" right={<span className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>{displayName || "—"}</span>} />
          <Row label="البريد الإلكتروني" right={<span className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>{displayEmail || "—"}</span>} />
          <Row label="كلمة المرور" onClick={() => void handlePasswordReset()} isLast />
        </Section>

        <Section title="التفضيلات">
          <Row
            label="اللغة"
            right={
              <span className="font-cairo font-bold" style={{ fontSize: 13, color: "hsl(var(--primary))", minHeight: 44, display: "flex", alignItems: "center" }}>
                العربية
              </span>
            }
          />
          <div
            className="flex items-center justify-between w-full font-cairo font-light"
            style={{
              padding: "14px 16px",
              fontSize: 14,
              color: "hsl(var(--foreground))",
              minHeight: 44,
            }}
          >
            <span>الإشعارات</span>
            <Toggle on={notifications} onToggle={() => handleNotificationsToggle(!notifications)} />
          </div>
        </Section>

        <Section title="الاشتراك">
          <Row label="اشتراكي" right={<span className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>مجاني</span>} onClick={() => navigate("/subscribe")} isLast />
        </Section>

        <Section title="الدعم">
          <Row label="تواصل معنا" onClick={() => navigate("/contact")} />
          <Row label="سياسة الخصوصية" onClick={() => navigate("/privacy")} />
          <Row label="الشروط والأحكام" onClick={() => navigate("/privacy")} isLast />
        </Section>

        <div className="glass-card-light" style={{ overflow: "hidden", marginBottom: 40, padding: 0 }}>
          <Row label="حذف الحساب" danger onClick={() => setShowDeleteConfirm(true)} isLast />
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} onClick={() => setShowDeleteConfirm(false)}>
            <div className="glass-card-light" style={{ padding: 24, maxWidth: 320, width: "calc(100% - 48px)" }} onClick={(e) => e.stopPropagation()}>
              <p className="font-cairo font-bold text-center" style={{ fontSize: 18, color: "hsl(var(--foreground))", marginBottom: 8 }}>حذف الحساب</p>
              <p className="font-cairo font-light text-center" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginBottom: 24 }}>هل أنت متأكد؟ لا يمكن التراجع عن هذا القرار.</p>
              <button
                type="button"
                className="font-cairo font-bold text-white w-full"
                style={{ background: "#FF6B6B", border: "none", borderRadius: 999, padding: "14px 0", fontSize: 15, cursor: "pointer", marginBottom: 8, height: 50 }}
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteMessage("تواصل معنا لحذف حسابك نهائياً");
                  navigate("/contact?subject=حذف-الحساب");
                }}
              >
                نعم، احذف حسابي
              </button>
              <button type="button" onClick={() => setShowDeleteConfirm(false)} className="font-cairo font-light w-full" style={{ background: "none", border: "none", color: "hsl(var(--muted-foreground))", fontSize: 13, cursor: "pointer", padding: 8, minHeight: 44 }}>
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
