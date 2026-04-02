import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [lang, setLang] = useState("ar");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 24 }}>
      <p className="font-cairo font-bold" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginBottom: 8, paddingRight: 4 }}>{title}</p>
      <div className="glass-card-light" style={{ overflow: "hidden", padding: 0 }}>{children}</div>
    </div>
  );

  const Row = ({ label, right, onClick, danger }: { label: string; right?: React.ReactNode; onClick?: () => void; danger?: boolean }) => (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full font-cairo font-light"
      style={{
        padding: "14px 16px",
        fontSize: 15,
        color: danger ? "#FF6B6B" : "hsl(var(--foreground))",
        background: "none",
        border: "none",
        borderBottom: "1px solid hsl(var(--border))",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <span>{label}</span>
      {right || (onClick && <ChevronLeft size={16} color="hsl(var(--muted-foreground))" />)}
    </button>
  );

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <div
      onClick={onToggle}
      style={{
        width: 44,
        height: 24,
        borderRadius: 999,
        background: on ? "hsl(var(--primary))" : "hsl(var(--border))",
        padding: 2,
        cursor: "pointer",
        transition: "background 0.2s ease",
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
    <div className="relative" style={{ background: "hsl(var(--background))", minHeight: "100vh", direction: "rtl", padding: "0 24px" }}>
      <Navbar />
      <div className="blob blob-violet" style={{ width: 250, height: 250, top: "10%", right: "-8%" }} />

      <div style={{ paddingTop: 80, maxWidth: 480, margin: "0 auto" }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", background: "none", border: "none", cursor: "pointer", marginBottom: 16 }}>
          <ArrowRight size={14} />
          رجوع
        </button>

        <h1 className="font-cairo font-bold" style={{ fontSize: 24, color: "hsl(var(--foreground))", marginBottom: 24 }}>الإعدادات</h1>

        <Section title="الحساب">
          <Row label="الاسم" right={<span className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>أحمد</span>} />
          <Row label="البريد الإلكتروني" right={<span className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>ahmed@email.com</span>} />
          <Row label="كلمة المرور" onClick={() => {}} />
        </Section>

        <Section title="التفضيلات">
          <Row label="اللغة" right={
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="font-cairo font-bold" style={{ fontSize: 13, color: "hsl(var(--primary))", background: "none", border: "none", cursor: "pointer" }}>
              {lang === "ar" ? "العربية" : "English"}
            </button>
          } />
          <Row label="الإشعارات" right={<Toggle on={notifications} onToggle={() => setNotifications(!notifications)} />} />
        </Section>

        <Section title="الاشتراك">
          <Row label="اشتراكي" right={<span className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>مجاني</span>} onClick={() => navigate("/subscribe")} />
        </Section>

        <Section title="الدعم">
          <Row label="تواصل معنا" onClick={() => navigate("/contact")} />
          <Row label="سياسة الخصوصية" onClick={() => navigate("/privacy")} />
          <Row label="الشروط والأحكام" onClick={() => navigate("/terms")} />
        </Section>

        <div className="glass-card-light" style={{ overflow: "hidden", marginBottom: 40, padding: 0 }}>
          <Row label="حذف الحساب" danger onClick={() => setShowDeleteConfirm(true)} />
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} onClick={() => setShowDeleteConfirm(false)}>
            <div className="glass-card-light" style={{ padding: 24, maxWidth: 320, width: "calc(100% - 48px)" }} onClick={(e) => e.stopPropagation()}>
              <p className="font-cairo font-bold text-center" style={{ fontSize: 18, color: "hsl(var(--foreground))", marginBottom: 8 }}>حذف الحساب</p>
              <p className="font-cairo font-light text-center" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginBottom: 24 }}>هل أنت متأكد؟ لا يمكن التراجع عن هذا القرار.</p>
              <button className="font-cairo font-bold text-white w-full" style={{ background: "#FF6B6B", border: "none", borderRadius: 999, padding: "14px 0", fontSize: 15, cursor: "pointer", marginBottom: 8 }}>
                نعم، احذف حسابي
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="font-cairo font-light w-full" style={{ background: "none", border: "none", color: "hsl(var(--muted-foreground))", fontSize: 13, cursor: "pointer", padding: 8 }}>
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
