import { useNavigate } from "react-router-dom";
import HeroButton from "./HeroButton";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden -mt-8 md:-mt-10">
      {/* Decorative violet blob */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsla(244, 100%, 68%, 0.15), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 text-center max-w-[680px] mx-auto">
        <h2 className="text-4xl md:text-[56px] md:leading-[1.45] font-bold font-cairo text-foreground mt-0 mb-[33px]">
          سكوتك يضيع عليك فرص.
        </h2>
        <p className="text-lg md:text-xl font-light font-cairo text-muted-foreground mb-16">
          تحدياتنا تعلمك كيف تسولف بدون توتر ونعطيك خطة تطورك أسبوع بعد أسبوع.
        </p>

        <LiquidSphere onClick={() => navigate("/onboarding")} />
      </div>
    </section>
  );
};

export default HeroSection;
