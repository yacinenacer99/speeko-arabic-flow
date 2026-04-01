import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

const badges = [
  { name: "أول جلسة", icon: "🎙️", earned: true, date: "قبل 12 يوم" },
  { name: "7 أيام", icon: "🔥", earned: true, date: "قبل 5 أيام" },
  { name: "صفر حشو", icon: "✨", earned: false },
  { name: "أسبوع نظيف", icon: "💎", earned: false },
  { name: "مبدع", icon: "⭐", earned: false },
  { name: "ملتزم", icon: "🏆", earned: false },
];

const menuItems = [
  { label: "الإعدادات", path: "/settings" },
  { label: "الاشتراك", path: "/subscribe" },
  { label: "تواصل معنا", path: "/contact" },
];

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#F5F4F0", minHeight: "100vh", direction: "rtl", paddingBottom: 80 }}>
      <Navbar />

      <div style={{ padding: "80px 24px 24px", maxWidth: 480, margin: "0 auto" }}>
        {/* Header */}
        <div className="flex flex-col items-center" style={{ marginBottom: 32 }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6C63FF, #A89CFF)",
              marginBottom: 12,
            }}
          >
            <span className="font-cairo font-bold text-white" style={{ fontSize: 32 }}>أ</span>
          </div>
          <p className="font-cairo font-bold" style={{ fontSize: 22, color: "#1A1A2E" }}>أحمد</p>
          <span
            className="font-cairo font-bold"
            style={{
              fontSize: 13,
              color: "#6C63FF",
              background: "rgba(108,99,255,0.1)",
              borderRadius: 999,
              padding: "4px 14px",
              marginTop: 8,
            }}
          >
            متحدث
          </span>
        </div>

        {/* Stats */}
        <div className="flex gap-3" style={{ marginBottom: 24 }}>
          {[
            { value: "24", label: "الجلسات" },
            { value: "2", label: "الشارات" },
            { value: "12", label: "السترك" },
          ].map((s) => (
            <div key={s.label} className="flex-1 flex flex-col items-center" style={{ background: "white", borderRadius: 16, padding: 16 }}>
              <span className="font-cairo font-bold" style={{ fontSize: 24, color: "#A89CFF" }}>{s.value}</span>
              <span className="font-cairo font-light" style={{ fontSize: 11, color: "#9090A8" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* XP bar */}
        <div style={{ background: "white", borderRadius: 16, padding: 16, marginBottom: 24 }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
            <span className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8" }}>340 / 500 XP للمستوى التالي</span>
          </div>
          <div style={{ background: "#E8E6F0", borderRadius: 999, height: 8 }}>
            <div style={{ background: "#6C63FF", borderRadius: 999, height: 8, width: "68%", transition: "width 0.5s ease" }} />
          </div>
        </div>

        {/* Badges */}
        <h2 className="font-cairo font-bold" style={{ fontSize: 18, color: "#1A1A2E", marginBottom: 12 }}>إنجازاتي</h2>
        <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 32 }}>
          {badges.map((b) => (
            <div
              key={b.name}
              className="flex flex-col items-center text-center"
              style={{
                background: "white",
                borderRadius: 16,
                padding: 16,
                opacity: b.earned ? 1 : 0.4,
                position: "relative",
              }}
            >
              <span style={{ fontSize: 28 }}>{b.icon}</span>
              <p className="font-cairo font-bold" style={{ fontSize: 12, color: "#1A1A2E", marginTop: 6 }}>{b.name}</p>
              {b.earned && b.date && (
                <p className="font-cairo font-light" style={{ fontSize: 10, color: "#9090A8" }}>{b.date}</p>
              )}
              {!b.earned && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ borderRadius: 16 }}>
                  <Lock size={16} color="#9090A8" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Menu */}
        <div style={{ background: "white", borderRadius: 16, overflow: "hidden", marginBottom: 12 }}>
          {menuItems.map((item, i) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center justify-between w-full font-cairo font-light"
              style={{
                padding: "14px 16px",
                fontSize: 15,
                color: "#1A1A2E",
                background: "none",
                border: "none",
                borderBottom: i < menuItems.length - 1 ? "1px solid #E8E6F0" : "none",
                cursor: "pointer",
              }}
            >
              <span>{item.label}</span>
              <ChevronLeft size={16} color="#9090A8" />
            </button>
          ))}
        </div>

        <div style={{ background: "white", borderRadius: 16, overflow: "hidden" }}>
          <button
            className="w-full font-cairo font-light"
            style={{ padding: "14px 16px", fontSize: 15, color: "#FF6B6B", background: "none", border: "none", cursor: "pointer", textAlign: "right" }}
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
