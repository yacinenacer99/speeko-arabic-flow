import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

const Challenge = () => {
  return (
    <div style={{ minHeight: "100dvh", background: "#0F0F14" }}>
      <Navbar />
      <HeroSection autoStart={true} />
    </div>
  );
};

export default Challenge;
