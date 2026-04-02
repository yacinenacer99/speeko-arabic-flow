import { useNavigate } from "react-router-dom";
import { Flame, Mic } from "lucide-react";
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

      {/* Welcome Card */}
      <div className="flex justify-center" style={{ paddingTop: 90, paddingLeft: 24, paddingRight: 24 }}>
        <div
          style={{
            maxWidth: 340,
            width: "100%",
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            borderRadius: 20,
            padding: "20px 24px",
          }}
        >
          <div className="flex items-center justify-between" style={{ direction: "rtl" }}>
            {/* Right side — greeting + streak */}
            <div>
              <p className="font-cairo font-bold" style={{ fontSize: 20, color: "#1A1A2E" }}>
                هلا، {userName}
              </p>
              <div className="flex items-center gap-1" style={{ marginTop: 4 }}>
                <Flame size={14} color="#FF6B6B" />
                <span className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8" }}>
                  12 يوم متواصل
                </span>
              </div>
            </div>
            {/* Left side — stage badge */}
            <div className="flex flex-col items-center">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(108,99,255,0.1)",
                  border: "1.5px solid rgba(108,99,255,0.3)",
                }}
              >
                <Mic size={18} color="#6C63FF" />
              </div>
              <span className="font-cairo font-bold" style={{ fontSize: 11, color: "#6C63FF", marginTop: 4 }}>
                متحدث
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer before circle */}
      <div style={{ height: 40 }} />

      {/* Circle button — centered */}
      <div className="flex flex-col items-center" style={{ padding: "0 24px" }}>
        {/* Glow bg */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,99,255,0.12), transparent 70%)",
            filter: "blur(60px)",
          }}
        />

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
      </div>

      {/* Quest Map — below */}
      <div style={{ paddingTop: 60, paddingBottom: 48 }}>
        <QuestMap />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
