import { useNavigate } from "react-router-dom";
import { Lock, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

const stages = [
  { name: "مبتدئ", desc: "تكلم 30 ثانية بدون توقف", status: "completed" as const },
  { name: "متحدث", desc: "تخلص من كلمات الحشو", status: "current" as const },
  { name: "مؤثر", desc: "بنِ أفكارك بوضوح", status: "locked" as const },
  { name: "خطيب", desc: "أي موضوع، أي غرفة", status: "locked" as const },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#F5F4F0", minHeight: "100vh", direction: "rtl", paddingBottom: 80 }}>
      <Navbar />

      {/* Hero section */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ height: "100vh", padding: "0 24px", paddingTop: 70 }}
      >
        <p className="font-cairo font-bold" style={{ fontSize: 26, color: "#1A1A2E", marginBottom: 8 }}>
          مرحباً، أحمد 👋
        </p>
        <div className="flex items-center gap-3" style={{ marginBottom: 40 }}>
          <span className="font-cairo font-light" style={{ fontSize: 14, color: "#9090A8" }}>🔥 12 يوم</span>
          <span className="font-cairo font-light" style={{ fontSize: 14, color: "#9090A8" }}>⚡ 340 XP</span>
        </div>

        {/* Glow bg */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(108,99,255,0.12), transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Circle button */}
        <div className="hero-float" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-stroke-wrapper" style={{ padding: 5 }}>
            <div
              className="hero-circle"
              style={{ width: 260, height: 260, cursor: "pointer" }}
              onClick={() => navigate("/challenge")}
            >
              <div className="hero-text-overlay">
                <span className="font-cairo font-bold text-[18px] text-white" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                  ابدأ تحديك اليومي
                </span>
                <span className="font-cairo font-light text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                  التحدي جاهز
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8", marginTop: 16 }}>
          اضغط للبدء
        </p>
      </div>

      {/* Quest map */}
      <div style={{ padding: "40px 24px 24px" }}>
        <h2 className="font-cairo font-bold" style={{ fontSize: 22, color: "#1A1A2E", marginBottom: 24 }}>
          مسارك
        </h2>

        <div className="relative flex flex-col items-center" style={{ gap: 32 }}>
          {stages.map((stage, i) => (
            <div
              key={i}
              className="flex items-center w-full gap-4"
              style={{ flexDirection: i % 2 === 0 ? "row" : "row-reverse" }}
            >
              {/* Node */}
              <div
                className={`flex items-center justify-center shrink-0 ${stage.status === "current" ? "animate-pulse-glow" : ""}`}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background:
                    stage.status === "completed"
                      ? "#6C63FF"
                      : stage.status === "current"
                        ? "white"
                        : "#E8E6F0",
                  border: stage.status === "current" ? "3px solid #6C63FF" : "none",
                }}
              >
                {stage.status === "completed" && <Check size={24} color="white" />}
                {stage.status === "locked" && <Lock size={20} color="#9090A8" />}
              </div>

              {/* Label */}
              <div>
                <p
                  className="font-cairo font-bold"
                  style={{
                    fontSize: 15,
                    color: stage.status === "locked" ? "#9090A8" : "#1A1A2E",
                  }}
                >
                  {stage.name}
                </p>
                <p className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8" }}>
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
