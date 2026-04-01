import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [lang, setLang] = useState("ar");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 24 }}>
      <p className="font-cairo font-bold" style={{ fontSize: 14, color: "#9090A8", marginBottom: 8, paddingRight: 4 }}>{title}</p>
      <div style={{ background: "white", borderRadius: 16, overflow: "hidden" }}>{children}</div>
    </div>
  );

  const Row = ({ label, right, onClick, danger }: { label: string; right?: React.ReactNode; onClick?: () => void; danger?: boolean }) => (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full font-cairo font-light"
      style={{
        padding: "14px 16px",
        fontSize: 15,
        color: danger ? "#FF6B6B" : "#1A1A2E",
        background: "none",
        border: "none",
        borderBottom: "1px solid #E8E6F0",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <span>{label}</span>
      {right || (onClick && <ChevronLeft size={16} color="#9090A8" />)}
    </button>
  );

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <div
      onClick={onToggle}
      style={{
        width: 44,
        height: 24,
        borderRadius: 999,
        background: on ? "#6C63FF" : "#E8E6F0",
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
    <div style={{ background: "#F5F4F0", minHeight: "100vh", direction: "rtl", padding: "0 24px" }}>
      <Navbar />

      <div style={{ paddingTop: 80, maxWidth: 480, margin: "0 auto" }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 font-cairo font-light" style={{ fontSize: 13, color: "#9090A8", background: "none", border: "none", cursor: "pointer", marginBottom: 16 }}>
          <ArrowRight size={14} />
          رجوع
        </button>

        <h1 className="font-cairo font-bold" style={{ fontSize: 24, color: "#1A1A2E", marginBottom: 24 }}>الإعدادات</h1>

        <Section title="الحساب">
          <Row label="الاسم" right={<span className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8" }}>أحمد</span>} />
          <Row label="البريد الإلكتروني" right={<span className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8" }}>ahmed@email.com</span>} />
          <Row label="كلمة المرور" onClick={() => {}} />
        </Section>

        <Section title="التفضيلات">
          <Row label="اللغة" right={
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="font-cairo font-bold" style={{ fontSize: 13, color: "#6C63FF", background: "none", border: "none", cursor: "pointer" }}>
              {lang === "ar" ? "العربية" : "English"}
            </button>
          } />
          <Row label="الإشعارات" right={<Toggle on={notifications} onToggle={() => setNotifications(!notifications)} />} />
        </Section>

        <Section title="الاشتراك">
          <Row label="اشتراكي" right={<span className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8" }}>مجاني</span>} onClick={() => navigate("/subscribe")} />
        </Section>

        <Section title="الدعم">
          <Row label="تواصل معنا" onClick={() => navigate("/contact")} />
          <Row label="سياسة الخصوصية" onClick={() => navigate("/privacy")} />
          <Row label="الشروط والأحكام" onClick={() => navigate("/terms")} />
        </Section>

        <div style={{ background: "white", borderRadius: 16, overflow: "hidden", marginBottom: 40 }}>
          <Row label="حذف الحساب" danger onClick={() => setShowDeleteConfirm(true)} />
        </div>

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }} onClick={() => setShowDeleteConfirm(false)}>
            <div style={{ background: "white", borderRadius: 20, padding: 24, maxWidth: 320, width: "calc(100% - 48px)" }} onClick={(e) => e.stopPropagation()}>
              <p className="font-cairo font-bold text-center" style={{ fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>حذف الحساب</p>
              <p className="font-cairo font-light text-center" style={{ fontSize: 14, color: "#9090A8", marginBottom: 24 }}>هل أنت متأكد؟ لا يمكن التراجع عن هذا القرار.</p>
              <button className="font-cairo font-bold text-white w-full" style={{ background: "#FF6B6B", border: "none", borderRadius: 999, padding: "14px 0", fontSize: 15, cursor: "pointer", marginBottom: 8 }}>
                نعم، احذف حسابي
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="font-cairo font-light w-full" style={{ background: "none", border: "none", color: "#9090A8", fontSize: 13, cursor: "pointer", padding: 8 }}>
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
