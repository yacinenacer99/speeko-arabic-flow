import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mic, Flame, Sparkles, Award, Zap, Diamond, Crown, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const allBadges = [
  { name: "أول جلسة", Icon: Mic, desc: "أكمل جلستك الأولى", status: "earned" as const, date: "قبل 12 يوم" },
  { name: "7 أيام متواصلة", Icon: Flame, desc: "حافظ على سترك 7 أيام", status: "earned" as const, date: "قبل 5 أيام" },
  { name: "صفر حشو", Icon: Sparkles, desc: "أكمل جلسة بدون كلمات حشو", status: "progress" as const, progress: 60 },
  { name: "متقدم في المسار", Icon: Award, desc: "وصل للمرحلة الثالثة", status: "progress" as const, progress: 30 },
  { name: "30 يوم", Icon: Diamond, desc: "حافظ على سترك 30 يوم", status: "locked" as const },
  { name: "خطيب", Icon: Crown, desc: "أكمل كل المراحل", status: "locked" as const },
  { name: "أسرع متكلم", Icon: Zap, desc: "حقق 150 كلمة في الدقيقة", status: "locked" as const },
  { name: "صامد", Icon: Trophy, desc: "10 جلسات بدون كلمات ممنوعة", status: "locked" as const },
];

const Badges = () => {
  const navigate = useNavigate();
  const earned = allBadges.filter((b) => b.status === "earned");
  const inProgress = allBadges.filter((b) => b.status === "progress");
  const locked = allBadges.filter((b) => b.status === "locked");

  const renderBadge = (b: typeof allBadges[0]) => (
    <div
      key={b.name}
      className="flex flex-col items-center text-center glass-card-light"
      style={{
        padding: 16,
        position: "relative",
        opacity: b.status === "locked" ? 0.5 : 1,
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: b.status === "earned" ? "rgba(93,190,138,0.15)" : b.status === "progress" ? "rgba(108,99,255,0.1)" : "rgba(144,144,168,0.1)",
        }}
      >
        <b.Icon size={24} color={b.status === "earned" ? "#5DBE8A" : b.status === "progress" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
      </div>
      <p className="font-cairo font-bold" style={{ fontSize: 13, color: "hsl(var(--foreground))", marginTop: 8 }}>{b.name}</p>
      <p className="font-cairo font-light" style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>{b.desc}</p>
      {b.status === "earned" && b.date && (
        <p className="font-cairo font-light flex items-center gap-1" style={{ fontSize: 10, color: "#5DBE8A", marginTop: 6 }}>
          <Sparkles size={10} /> {b.date}
        </p>
      )}
      {b.status === "progress" && "progress" in b && (
        <div style={{ width: "100%", marginTop: 8 }}>
          <div style={{ background: "hsl(var(--border))", borderRadius: 999, height: 6 }}>
            <div style={{ background: "hsl(var(--primary))", borderRadius: 999, height: 6, width: `${b.progress}%` }} />
          </div>
        </div>
      )}
      {b.status === "locked" && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ borderRadius: 20 }}>
          <Lock size={20} color="hsl(var(--muted-foreground))" />
        </div>
      )}
    </div>
  );

  return (
    <div className="relative" style={{ background: "hsl(var(--background))", minHeight: "100dvh", direction: "rtl", paddingBottom: 80 }}>
      <Navbar />
      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "10%", right: "-10%" }} />

      <div className="page-narrow" style={{ paddingTop: 80 }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", background: "none", border: "none", cursor: "pointer", marginBottom: 16, minHeight: 44 }}>
          <ArrowRight size={14} />
          رجوع
        </button>

        <h1 className="font-cairo font-bold" style={{ fontSize: 24, color: "hsl(var(--foreground))", marginBottom: 24 }}>الإنجازات</h1>

        {earned.length > 0 && (
          <>
            <h2 className="font-cairo font-bold" style={{ fontSize: 16, color: "hsl(var(--foreground))", marginBottom: 12 }}>المكتسبة</h2>
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 24 }}>{earned.map(renderBadge)}</div>
          </>
        )}
        {inProgress.length > 0 && (
          <>
            <h2 className="font-cairo font-bold" style={{ fontSize: 16, color: "hsl(var(--foreground))", marginBottom: 12 }}>قيد التقدم</h2>
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 24 }}>{inProgress.map(renderBadge)}</div>
          </>
        )}
        {locked.length > 0 && (
          <>
            <h2 className="font-cairo font-bold" style={{ fontSize: 16, color: "hsl(var(--foreground))", marginBottom: 12 }}>مقفلة</h2>
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 24 }}>{locked.map(renderBadge)}</div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Badges;
