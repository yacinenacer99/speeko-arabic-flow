import { useState } from "react";
import { Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProGateModal from "@/components/ProGateModal";
import BackButton from "@/components/BackButton";

const chartData = [62, 68, 71, 65, 74, 78, 74];
const days = ["سبت", "أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"];

const sessions = [
  { topic: "تكلم عن أهمية الوقت", date: "اليوم", score: 74 },
  { topic: "وش رأيك في التقنية؟", date: "أمس", score: 78 },
  { topic: "تكلم عن شخص أثّر فيك", date: "قبل يومين", score: 65 },
];

const Progress = () => {
  const [proModal, setProModal] = useState(false);
  const maxVal = Math.max(...chartData);

  return (
    <div className="relative" style={{ background: "hsl(var(--background))", minHeight: "100dvh", direction: "rtl", paddingBottom: 80 }}>
      <Navbar />
      <BackButton variant="light" />
      <ProGateModal open={proModal} onClose={() => setProModal(false)} />
      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "5%", right: "-10%" }} />
      <div className="blob blob-pink" style={{ width: 200, height: 200, bottom: "20%", left: "-5%" }} />

      <div className="page-narrow" style={{ paddingTop: 80 }}>
        <h1 className="font-cairo font-bold" style={{ fontSize: 24, color: "hsl(var(--foreground))", marginBottom: 24 }}>تقدمي</h1>

        {/* Chart card */}
        <div className="glass-card-light progress-chart" style={{ padding: 16, marginBottom: 16 }}>
          <p className="font-cairo font-bold" style={{ fontSize: 16, color: "hsl(var(--foreground))" }}>نقاط التدفق</p>
          <p className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginBottom: 16 }}>آخر 7 جلسات</p>
          <div className="flex items-end justify-between" style={{ height: 200, gap: 8 }}>
            {chartData.map((val, i) => (
              <div key={i} className="flex flex-col items-center flex-1 gap-1">
                <div
                  style={{
                    width: "100%",
                    maxWidth: 32,
                    height: `${(val / maxVal) * 100}%`,
                    background: "linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary-soft)))",
                    borderRadius: 6,
                    transition: "height 0.3s ease",
                  }}
                />
                <span className="font-cairo font-light" style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3" style={{ marginBottom: 24 }}>
          {[
            { value: "72", label: "متوسط النقاط" },
            { value: "12", label: "أطول سترك" },
            { value: "24", label: "إجمالي الجلسات" },
          ].map((s) => (
            <div key={s.label} className="flex-1 flex flex-col items-center glass-card-light" style={{ padding: 14 }}>
              <span className="font-cairo font-bold" style={{ fontSize: 22, color: "hsl(var(--primary-soft))" }}>{s.value}</span>
              <span className="font-cairo font-light" style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Session history */}
        <h2 className="font-cairo font-bold" style={{ fontSize: 18, color: "hsl(var(--foreground))", marginBottom: 12 }}>جلساتي</h2>
        <div className="flex flex-col gap-3">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between glass-card-light" style={{ padding: 14 }}>
              <div>
                <p className="font-cairo font-bold" style={{ fontSize: 14, color: "hsl(var(--foreground))" }}>{s.topic}</p>
                <p className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>{s.date}</p>
              </div>
              <span
                className="font-cairo font-bold flex items-center justify-center"
                style={{
                  fontSize: 14,
                  color: "hsl(var(--primary))",
                  background: "rgba(108,99,255,0.1)",
                  borderRadius: 999,
                  padding: "4px 12px",
                  minWidth: 36,
                  minHeight: 36,
                }}
              >
                {s.score}
              </span>
            </div>
          ))}
        </div>

        {/* Weak points (pro) */}
        <h2 className="font-cairo font-bold" style={{ fontSize: 18, color: "hsl(var(--foreground))", marginTop: 32, marginBottom: 12 }}>نقاط ضعفك</h2>
        <div className="relative" style={{ borderRadius: 20, overflow: "hidden" }}>
          <div className="glass-card-light" style={{ filter: "blur(5px)", padding: 16 }}>
            <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>كلمات الحشو الأكثر استخداماً</p>
            <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>متوسط فترات السكوت</p>
            <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>الكلمات الممنوعة المتكررة</p>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Lock size={20} color="hsl(var(--primary-soft))" />
            <button
              onClick={() => setProModal(true)}
              className="font-cairo font-bold text-white"
              style={{ background: "hsl(var(--primary))", border: "none", borderRadius: 999, padding: "10px 24px", fontSize: 13, cursor: "pointer", boxShadow: "0 0 20px rgba(108,99,255,0.4)", minHeight: 44 }}
            >
              افتح التحليل الكامل
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .progress-chart { height: 280px; padding: 24px !important; }
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default Progress;
