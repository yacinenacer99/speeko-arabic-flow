import { useNavigate } from "react-router-dom";
import { Flame, Mic, Clock, Ban } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuestMap from "@/components/QuestMap";

const Home = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("user_name") || "أحمد";

  return (
    <div className="relative" style={{ background: "#F5F4F0", minHeight: "100dvh", direction: "rtl" }}>
      <Navbar />

      {/* Atmospheric blobs */}
      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "5%", right: "-10%" }} />
      <div className="blob blob-pink" style={{ width: 200, height: 200, bottom: "40%", left: "-10%" }} />
      <div className="blob blob-blue" style={{ width: 200, height: 200, top: "30%", left: "-5%" }} />

      {/* Welcome Card */}
      <div className="flex justify-center home-welcome-area" style={{ paddingTop: 80, paddingLeft: "var(--page-padding-mobile)", paddingRight: "var(--page-padding-mobile)" }}>
        <div
          className="home-welcome-card"
          style={{
            maxWidth: "calc(100% - 32px)",
            width: 340,
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            borderRadius: 20,
            padding: "16px 20px",
          }}
        >
          <div className="flex items-center justify-between" style={{ direction: "rtl" }}>
            <div>
              <p className="font-cairo font-bold" style={{ fontSize: 18, color: "#1A1A2E" }}>
                هلا، {userName}
              </p>
              <div className="flex items-center gap-1" style={{ marginTop: 4 }}>
                <Flame size={14} color="#FF6B6B" />
                <span className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8" }}>
                  12 يوم متواصل
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(108,99,255,0.1)",
                  border: "1.5px solid rgba(108,99,255,0.3)",
                }}
              >
                <Mic size={18} color="#6C63FF" />
              </div>
              <span className="font-cairo font-bold" style={{ fontSize: 10, color: "#6C63FF", marginTop: 4 }}>
                متحدث
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer before circle */}
      <div className="home-gap-1" style={{ height: 32 }} />

      {/* Circle button — centered */}
      <div className="flex flex-col items-center" style={{ padding: "0 var(--page-padding-mobile)" }}>
        <div
          className="absolute pointer-events-none"
          style={{
            width: "min(400px, 100vw)", height: "min(400px, 100vw)", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,99,255,0.12), transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="hero-float" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-stroke-wrapper" style={{ padding: 5 }}>
            <div
              className="hero-circle home-circle"
              style={{ width: 220, height: 220, cursor: "pointer", maxWidth: "calc(100vw - 40px)" }}
              onClick={() => navigate("/challenge")}
            >
              <div className="hero-text-overlay">
                <span className="font-cairo font-bold" style={{ fontSize: 18, color: "white", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                  ابدأ التحدي
                </span>
                <span className="font-cairo font-light" style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  تكلم الآن
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer before challenge card */}
      <div className="home-gap-2" style={{ height: 24 }} />

      {/* Daily Challenge Card */}
      <div className="flex justify-center" style={{ padding: "0 var(--page-padding-mobile)" }}>
        <div
          className="home-challenge-card"
          style={{
            maxWidth: "calc(100% - 32px)",
            width: 340,
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            borderRadius: 20,
            padding: "16px 20px",
          }}
        >
          <p className="font-cairo font-bold text-center" style={{ fontSize: 15, color: "#1A1A2E" }}>
            تحدي اليوم
          </p>
          <p className="font-cairo font-bold text-center" style={{ fontSize: 16, color: "#6C63FF", marginTop: 16 }}>
            جلسة بدون حشو
          </p>
          <p className="font-cairo font-light text-center" style={{ fontSize: 12, color: "#9090A8", lineHeight: 1.6, marginTop: 8 }}>
            تكلم ٦٠ ثانية بأقل عدد كلمات حشو
          </p>
          <div className="flex items-center justify-center" style={{ marginTop: 16, gap: 16 }}>
            <div className="flex items-center" style={{ gap: 6 }}>
              <Clock size={14} color="#9090A8" />
              <span className="font-cairo font-light" style={{ fontSize: 11, color: "#9090A8" }}>٦٠ ثانية</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quest Map — below */}
      <div style={{ paddingTop: 48, paddingBottom: 48 }}>
        <QuestMap />
      </div>

      <Footer />

      <style>{`
        @media (min-width: 768px) {
          .home-welcome-area { padding-top: 90px !important; }
          .home-welcome-card { max-width: 360px !important; padding: 20px 24px !important; }
          .home-gap-1 { height: 40px !important; }
          .home-circle { width: 240px !important; height: 240px !important; }
          .home-gap-2 { height: 32px !important; }
          .home-challenge-card { max-width: 360px !important; }
        }
        @media (min-width: 1024px) {
          .home-welcome-area { padding-top: 100px !important; }
          .home-welcome-card { max-width: 340px !important; padding: 20px 24px !important; }
          .home-gap-1 { height: 48px !important; }
          .home-circle { width: 260px !important; height: 260px !important; }
          .home-gap-2 { height: 40px !important; }
          .home-challenge-card { max-width: 340px !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
