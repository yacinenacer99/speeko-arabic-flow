import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, Mic, Flame, Sparkles, Award, Diamond, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


const badges = [
  { name: "أول جلسة", Icon: Mic, earned: true, date: "قبل 12 يوم" },
  { name: "7 أيام", Icon: Flame, earned: true, date: "قبل 5 أيام" },
  { name: "صفر حشو", Icon: Sparkles, earned: false },
  { name: "أسبوع نظيف", Icon: Diamond, earned: false },
  { name: "مبدع", Icon: Award, earned: false },
  { name: "ملتزم", Icon: Trophy, earned: false },
];

const menuItems = [
  { label: "الإعدادات", path: "/settings" },
  { label: "الاشتراك", path: "/subscribe" },
  { label: "تواصل معنا", path: "/contact" },
];

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="relative" style={{ background: "hsl(var(--background))", minHeight: "100vh", direction: "rtl", paddingBottom: 80 }}>
      <Navbar />
      <div className="blob blob-violet" style={{ width: 300, height: 300, top: "5%", right: "-10%" }} />

      <div style={{ padding: "80px 24px 24px", maxWidth: 480, margin: "0 auto" }}>
        {/* Header */}
        <div className="flex flex-col items-center" style={{ marginBottom: 32 }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-soft)))",
              marginBottom: 12,
            }}
          >
            <span className="font-cairo font-bold text-white" style={{ fontSize: 32 }}>أ</span>
          </div>
          <p className="font-cairo font-bold" style={{ fontSize: 22, color: "hsl(var(--foreground))" }}>أحمد</p>
          <span
            className="font-cairo font-bold"
            style={{
              fontSize: 13,
              color: "hsl(var(--primary))",
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
            <div key={s.label} className="flex-1 flex flex-col items-center glass-card-light" style={{ padding: 16 }}>
              <span className="font-cairo font-bold" style={{ fontSize: 24, color: "hsl(var(--primary-soft))" }}>{s.value}</span>
              <span className="font-cairo font-light" style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* XP bar */}
        <div className="glass-card-light" style={{ padding: 16, marginBottom: 24 }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
            <span className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>340 / 500 XP للمستوى التالي</span>
          </div>
          <div style={{ background: "hsl(var(--border))", borderRadius: 999, height: 8 }}>
            <div style={{ background: "hsl(var(--primary))", borderRadius: 999, height: 8, width: "68%", transition: "width 0.5s ease" }} />
          </div>
        </div>

        {/* Badges */}
        <h2 className="font-cairo font-bold" style={{ fontSize: 18, color: "hsl(var(--foreground))", marginBottom: 12 }}>إنجازاتي</h2>
        <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 32 }}>
          {badges.map((b) => (
            <div
              key={b.name}
              className="flex flex-col items-center text-center glass-card-light"
              style={{ padding: 16, opacity: b.earned ? 1 : 0.4, position: "relative" }}
            >
              <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: "50%", background: b.earned ? "rgba(93,190,138,0.1)" : "rgba(144,144,168,0.1)" }}>
                <b.Icon size={20} color={b.earned ? "#5DBE8A" : "hsl(var(--muted-foreground))"} />
              </div>
              <p className="font-cairo font-bold" style={{ fontSize: 12, color: "hsl(var(--foreground))", marginTop: 6 }}>{b.name}</p>
              {b.earned && b.date && (
                <p className="font-cairo font-light" style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>{b.date}</p>
              )}
              {!b.earned && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ borderRadius: 20 }}>
                  <Lock size={16} color="hsl(var(--muted-foreground))" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="glass-card-light" style={{ overflow: "hidden", marginBottom: 12, padding: 0 }}>
          {menuItems.map((item, i) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center justify-between w-full font-cairo font-light"
              style={{
                padding: "14px 16px",
                fontSize: 15,
                color: "hsl(var(--foreground))",
                background: "none",
                border: "none",
                borderBottom: i < menuItems.length - 1 ? "1px solid hsl(var(--border))" : "none",
                cursor: "pointer",
              }}
            >
              <span>{item.label}</span>
              <ChevronLeft size={16} color="hsl(var(--muted-foreground))" />
            </button>
          ))}
        </div>

        <div className="glass-card-light" style={{ overflow: "hidden", padding: 0 }}>
          <button
            className="w-full font-cairo font-light"
            style={{ padding: "14px 16px", fontSize: 15, color: "#FF6B6B", background: "none", border: "none", cursor: "pointer", textAlign: "right" }}
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
