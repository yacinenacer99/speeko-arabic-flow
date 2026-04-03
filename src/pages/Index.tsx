import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      navigate("/home", { replace: true });
    }
  }, [isLoading, isLoggedIn, navigate]);

  return (
    <div style={{ minHeight: "100dvh", background: "#0F0F14" }}>
      <Navbar />
      <HeroSection />
      <Footer />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          padding: "16px 20px",
          paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
          background: "linear-gradient(to top, #0F0F14 60%, transparent)",
          pointerEvents: "none",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/onboarding")}
          className="font-cairo font-bold"
          style={{
            width: "100%",
            maxWidth: 400,
            display: "block",
            margin: "0 auto",
            background: "#6C63FF",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 999,
            padding: "16px 0",
            fontSize: 16,
            cursor: "pointer",
            pointerEvents: "auto",
            minHeight: 52,
          }}
        >
          ابدأ خطة التعلم اليوم
        </button>
      </div>
    </div>
  );
};

export default Index;
