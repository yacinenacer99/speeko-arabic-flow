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
    <div style={{ minHeight: "100dvh" }}>
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default Index;
