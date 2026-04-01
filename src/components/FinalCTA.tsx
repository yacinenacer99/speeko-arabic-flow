import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="px-6 py-32">
      <div className="max-w-[680px] mx-auto text-center">
        <h3 className="text-3xl md:text-[40px] md:leading-[1.2] font-bold font-cairo text-foreground mb-4">
          ابدأ اليوم — مجاناً
        </h3>
        <p className="text-lg font-light font-cairo text-muted-foreground mb-14">
          لا تحتاج بطاقة ائتمانية. فقط صوتك.
        </p>

        <button
          onClick={() => navigate("/onboarding")}
          className="mx-auto w-44 h-44 rounded-full bg-surface-dark flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
          style={{
            boxShadow: "0 0 60px rgba(108, 99, 255, 0.25)",
          }}
        >
          <span className="text-lg font-bold font-cairo text-primary-foreground">ابدأ التحدي</span>
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;