import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Decorative violet blob */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsla(244, 100%, 68%, 0.15), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 text-center max-w-[680px] mx-auto">
        <h2 className="text-4xl md:text-[56px] md:leading-[1.2] font-bold font-cairo text-foreground mt-0 mb-[33px]">
          سكوتك يضيع عليك فرص!
        </h2>
        <p className="text-lg md:text-xl font-light font-cairo text-muted-foreground mb-16">
          تحدياتنا تعلمك كيف تسولف بدون توتر ونعطيك خطة تطورك أسبوع بعد أسبوع.
        </p>

        {/* Siri-style orb button */}
        <button
          onClick={() => navigate("/onboarding")}
          className="siri-orb mx-auto w-44 h-44 rounded-full bg-surface-dark flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 relative"
        >
          {/* Gradient blobs */}
          <span className="siri-blob siri-blob-violet" />
          <span className="siri-blob siri-blob-purple" />
          <span className="siri-blob siri-blob-pink" />
          <span className="siri-blob siri-blob-teal" />

          {/* Inner glow */}
          <span className="absolute inset-0 rounded-full" style={{ boxShadow: "inset 0 0 30px rgba(108, 99, 255, 0.15)" }} />

          {/* Text */}
          <span className="relative z-10 text-lg font-bold font-cairo text-primary-foreground">ابدأ التحدي</span>
          <span className="relative z-10 text-[13px] font-light font-cairo text-primary-foreground/60 mt-1">تكلم الأن</span>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
