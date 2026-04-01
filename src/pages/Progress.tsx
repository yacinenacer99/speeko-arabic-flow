import { useState } from "react";
import { Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import ProGateModal from "@/components/ProGateModal";

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
    <div style={{ background: "#F5F4F0", minHeight: "100vh", direction: "rtl", paddingBottom: 80 }}>
      <Navbar />
      <ProGateModal open={proModal} onClose={() => setProModal(false)} />

      <div style={{ padding: "80px 24px 24px", maxWidth: 480, margin: "0 auto" }}>
        <h1 className="font-cairo font-bold" style={{ fontSize: 24, color: "#1A1A2E", marginBottom: 24 }}>تقدمي</h1>

        {/* Chart card */}
        <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: 16 }}>
          <p className="font-cairo font-bold" style={{ fontSize: 16, color: "#1A1A2E" }}>نقاط التدفق</p>
          <p className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8", marginBottom: 16 }}>آخر 7 جلسات</p>
          <div className="flex items-end justify-between" style={{ height: 120, gap: 8 }}>
            {chartData.map((val, i) => (
              <div key={i} className="flex flex-col items-center flex-1 gap-1">
                <div
                  style={{
                    width: "100%",
                    maxWidth: 32,
                    height: `${(val / maxVal) * 100}%`,
                    background: "linear-gradient(to top, #6C63FF, #A89CFF)",
                    borderRadius: 6,
                    transition: "height 0.3s ease",
                  }}
                />
                <span className="font-cairo font-light" style={{ fontSize: 10, color: "#9090A8" }}>{days[i]}</span>
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
            <div key={s.label} className="flex-1 flex flex-col items-center" style={{ background: "white", borderRadius: 16, padding: 16 }}>
              <span className="font-cairo font-bold" style={{ fontSize: 24, color: "#A89CFF" }}>{s.value}</span>
              <span className="font-cairo font-light" style={{ fontSize: 11, color: "#9090A8" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Session history */}
        <h2 className="font-cairo font-bold" style={{ fontSize: 18, color: "#1A1A2E", marginBottom: 12 }}>جلساتي</h2>
        <div className="flex flex-col gap-3">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between" style={{ background: "white", borderRadius: 16, padding: 16 }}>
              <div>
                <p className="font-cairo font-bold" style={{ fontSize: 14, color: "#1A1A2E" }}>{s.topic}</p>
                <p className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8" }}>{s.date}</p>
              </div>
              <span
                className="font-cairo font-bold"
                style={{
                  fontSize: 14,
                  color: "#6C63FF",
                  background: "rgba(108,99,255,0.1)",
                  borderRadius: 999,
                  padding: "4px 12px",
                }}
              >
                {s.score}
              </span>
            </div>
          ))}
        </div>

        {/* Weak points (pro) */}
        <h2 className="font-cairo font-bold" style={{ fontSize: 18, color: "#1A1A2E", marginTop: 32, marginBottom: 12 }}>نقاط ضعفك</h2>
        <div className="relative" style={{ borderRadius: 16, overflow: "hidden" }}>
          <div style={{ filter: "blur(5px)", padding: 16, background: "white", borderRadius: 16 }}>
            <p className="font-cairo font-light" style={{ fontSize: 14, color: "#9090A8" }}>كلمات الحشو الأكثر استخداماً</p>
            <p className="font-cairo font-light" style={{ fontSize: 14, color: "#9090A8" }}>متوسط فترات السكوت</p>
            <p className="font-cairo font-light" style={{ fontSize: 14, color: "#9090A8" }}>الكلمات الممنوعة المتكررة</p>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Lock size={20} color="#A89CFF" />
            <button
              onClick={() => setProModal(true)}
              className="font-cairo font-bold text-white"
              style={{ background: "#6C63FF", border: "none", borderRadius: 999, padding: "10px 24px", fontSize: 13, cursor: "pointer", boxShadow: "0 0 20px rgba(108,99,255,0.4)" }}
            >
              افتح التحليل الكامل
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Progress;
