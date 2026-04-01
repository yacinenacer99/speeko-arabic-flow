import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProgressionPath from "@/components/ProgressionPath";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProgressionPath />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
