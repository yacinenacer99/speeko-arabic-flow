import { useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuestMap from "@/components/QuestMap";

const Home = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("user_name") || "أحمد";

  return (
    <div className="relative" style={{ background: "#F5F4F0", minHeight: "100vh", direction: "rtl" }}>
      <Navbar />

      {/* Atmospheric blobs */}
      <div className="blob blob-violet" style={{ width: 350, height: 350, top: "5%", right: "-10%" }} />
      <div className="blob blob-pink" style={{ width: 350, height: 350, bottom: "40%", left: "-10%" }} />
      <div className="blob blob-blue" style={{ width: 350, height: 350, top: "30%", left: "-5%" }} />

      {/* Launch Area — above fold */}
      <div
        className="flex flex-col items-center text-center"
        style={{ minHeight: "100vh", padding: "0 24px", paddingTop: 90 }}
      >
        {/* Greeting */}
        <h1
          className="font-cairo font-bold"
          style={{ fontSize: 32, color: "#1A1A2E" }}
        >
          هلا، {userName}
        </h1>

        {/* Streak */}
        <div className="flex items-center gap-2" style={{ marginTop: 16 }}>
          <Flame size={16} color="#FF6B6B" />
          <span className="font-cairo font-light" style={{ fontSize: 14, color: "#9090A8" }}>
            12 يوم متواصل
          </span>
        </div>

        {/* Stage Progress Card */}
        <div
          style={{
            marginTop: 20,
            maxWidth: 300,
            width: "100%",
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            borderRadius: 16,
            padding: "16px 20px",
          }}
        >
          {/* Top row */}
          <div className="flex items-center justify-between">
            <span className="font-cairo font-bold" style={{ fontSize: 14, color: "#1A1A2E" }}>
              متحدث
            </span>
            <span className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8" }}>
              المرحلة 2
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 10, height: 5, background: "#E8E6F0", borderRadius: 999, overflow: "hidden" }}>
            <div
              style={{
                width: "33%",
                height: "100%",
                background: "linear-gradient(90deg, #6C63FF, #A89CFF)",
                borderRadius: 999,
                transition: "width 0.6s ease",
              }}
            />
          </div>

          {/* Criteria */}
          <p className="font-cairo font-light text-center" style={{ fontSize: 11, color: "#9090A8", marginTop: 6 }}>
            1/3 جلسات متتالية نظيفة
          </p>
        </div>

        {/* Spacer before circle */}
        <div style={{ height: 40 }} />

        {/* Glow bg */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 400, height: 400, borderRadius: "50%",
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
                <span className="font-cairo font-bold" style={{ fontSize: 22, color: "white", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                  ابدأ التحدي
                </span>
                <span className="font-cairo font-light" style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
                  تكلم الآن
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quest Map — below fold */}
      <div style={{ paddingTop: 60, paddingBottom: 48 }}>
        <QuestMap />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
