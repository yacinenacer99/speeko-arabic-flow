import { useNavigate } from "react-router-dom";
import { Sparkles, BarChart3, Unlock, Check } from "lucide-react";
import BackButton from "@/components/BackButton";

const items = [
  { Icon: Sparkles, text: "التحليل الكامل بعد كل جلسة" },
  { Icon: BarChart3, text: "تقريرك الأسبوعي المخصص" },
  { Icon: Unlock, text: "المراحل المتقدمة 4-6" },
];

const Success = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ minHeight: "100dvh", overflow: "hidden", background: "#0F0F14", direction: "rtl", padding: "0 var(--page-padding-mobile)" }}
    >
      <BackButton variant="dark" />
      <div
        className="flex items-center justify-center"
        style={{
          width: 80, height: 80, borderRadius: "50%",
          border: "3px solid hsl(var(--success))",
          animation: "scaleIn 0.5s ease forwards",
          marginBottom: 24,
        }}
      >
        <Check size={40} color="hsl(var(--success))" />
      </div>

      <style>{`
        @keyframes scaleIn { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>

      <p className="font-cairo font-bold text-white" style={{ fontSize: 24 }}>أهلاً بك في برو!</p>
      <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginTop: 8, marginBottom: 32 }}>اشتراكك فعّال الآن</p>

      <div className="flex flex-col gap-4 w-full" style={{ maxWidth: 320 }}>
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3"
            style={{ animation: `fadeInUp 0.5s ease ${0.3 + i * 0.2}s both` }}
          >
            <item.Icon size={20} color="hsl(var(--primary-soft))" />
            <span className="font-cairo font-light text-white" style={{ fontSize: 14 }}>{item.text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/home")}
        className="font-cairo font-bold w-full"
        style={{
          background: "white",
          color: "#0F0F14",
          border: "none",
          borderRadius: 999,
          padding: "16px 0",
          fontSize: 15,
          cursor: "pointer",
          marginTop: 40,
          maxWidth: 400,
          height: 50,
        }}
      >
        ابدأ تدريبك الآن
      </button>
    </div>
  );
};

export default Success;
