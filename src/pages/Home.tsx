import { useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuestMap from "@/components/QuestMap";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative" style={{ background: "#F5F4F0", minHeight: "100vh", direction: "rtl" }}>
      <Navbar />

      {/* Atmospheric blobs */}
      <div className="blob blob-violet" style={{ width: 350, height: 350, top: "5%", right: "-10%" }} />
      <div className="blob blob-pink" style={{ width: 350, height: 350, bottom: "40%", left: "-10%" }} />
      <div className="blob blob-blue" style={{ width: 350, height: 350, top: "30%", left: "-5%" }} />

      {/* Launch Area — above fold */}
      <div
        className="flex flex-col items-center justify-center text-center"
        style={{ minHeight: "100vh", padding: "0 24px", paddingTop: 100 }}
      >
        {/* Status line */}
        <div className="flex items-center gap-2" style={{ marginBottom: 32 }}>
          <Flame size={16} color="#FF6B6B" />
          <span className="font-cairo font-light" style={{ fontSize: 14, color: "#9090A8" }}>
            12 يوم متواصل · متحدث — المرحلة 2
          </span>
        </div>

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
