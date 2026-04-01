import { ArrowRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

const allBadges = [
  { name: "أول جلسة", icon: "🎙️", desc: "أكمل جلستك الأولى", status: "earned" as const, date: "قبل 12 يوم" },
  { name: "7 أيام متواصلة", icon: "🔥", desc: "حافظ على سترك 7 أيام", status: "earned" as const, date: "قبل 5 أيام" },
  { name: "صفر حشو", icon: "✨", desc: "أكمل جلسة بدون كلمات حشو", status: "progress" as const, progress: 60 },
  { name: "متقدم في المسار", icon: "⭐", desc: "وصل للمرحلة الثالثة", status: "progress" as const, progress: 30 },
  { name: "30 يوم", icon: "💎", desc: "حافظ على سترك 30 يوم", status: "locked" as const },
  { name: "خطيب", icon: "👑", desc: "أكمل كل المراحل", status: "locked" as const },
  { name: "أسرع متكلم", icon: "⚡", desc: "حقق 150 كلمة في الدقيقة", status: "locked" as const },
  { name: "صامد", icon: "🏆", desc: "10 جلسات بدون كلمات ممنوعة", status: "locked" as const },
];

const Badges = () => {
  const navigate = useNavigate();
  const earned = allBadges.filter((b) => b.status === "earned");
  const inProgress = allBadges.filter((b) => b.status === "progress");
  const locked = allBadges.filter((b) => b.status === "locked");

  const renderBadge = (b: typeof allBadges[0]) => (
    <div
      key={b.name}
      className="flex flex-col items-center text-center"
      style={{
        background: "white",
        borderRadius: 16,
        padding: 20,
        position: "relative",
        opacity: b.status === "locked" ? 0.5 : 1,
      }}
    >
      <span style={{ fontSize: 40 }}>{b.icon}</span>
      <p className="font-cairo font-bold" style={{ fontSize: 15, color: "#1A1A2E", marginTop: 8 }}>{b.name}</p>
      <p className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8", marginTop: 4 }}>{b.desc}</p>
      {b.status === "earned" && b.date && (
        <p className="font-cairo font-light" style={{ fontSize: 11, color: "#5DBE8A", marginTop: 6 }}>✓ {b.date}</p>
      )}
      {b.status === "progress" && "progress" in b && (
        <div style={{ width: "100%", marginTop: 8 }}>
          <div style={{ background: "#E8E6F0", borderRadius: 999, height: 6 }}>
            <div style={{ background: "#6C63FF", borderRadius: 999, height: 6, width: `${b.progress}%` }} />
          </div>
        </div>
      )}
      {b.status === "locked" && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ borderRadius: 16 }}>
          <Lock size={20} color="#9090A8" />
        </div>
      )}
    </div>
  );

  return (
    <div style={{ background: "#F5F4F0", minHeight: "100vh", direction: "rtl", paddingBottom: 80 }}>
      <Navbar />

      <div style={{ padding: "80px 24px 24px", maxWidth: 480, margin: "0 auto" }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 font-cairo font-light" style={{ fontSize: 13, color: "#9090A8", background: "none", border: "none", cursor: "pointer", marginBottom: 16 }}>
          <ArrowRight size={14} />
          رجوع
        </button>

        <h1 className="font-cairo font-bold" style={{ fontSize: 24, color: "#1A1A2E", marginBottom: 24 }}>الإنجازات</h1>

        {earned.length > 0 && (
          <>
            <h2 className="font-cairo font-bold" style={{ fontSize: 16, color: "#1A1A2E", marginBottom: 12 }}>المكتسبة</h2>
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 24 }}>{earned.map(renderBadge)}</div>
          </>
        )}
        {inProgress.length > 0 && (
          <>
            <h2 className="font-cairo font-bold" style={{ fontSize: 16, color: "#1A1A2E", marginBottom: 12 }}>قيد التقدم</h2>
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 24 }}>{inProgress.map(renderBadge)}</div>
          </>
        )}
        {locked.length > 0 && (
          <>
            <h2 className="font-cairo font-bold" style={{ fontSize: 16, color: "#1A1A2E", marginBottom: 12 }}>مقفلة</h2>
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 24 }}>{locked.map(renderBadge)}</div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Badges;
