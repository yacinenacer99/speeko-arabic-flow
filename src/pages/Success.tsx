import { useNavigate } from "react-router-dom";

const items = [
  { icon: "✨", text: "التحليل الكامل بعد كل جلسة" },
  { icon: "📊", text: "تقريرك الأسبوعي المخصص" },
  { icon: "🔓", text: "المراحل المتقدمة 4-6" },
];

const Success = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ height: "100vh", overflow: "hidden", background: "#0F0F14", direction: "rtl", padding: "0 24px" }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "3px solid #5DBE8A",
          animation: "scaleIn 0.5s ease forwards",
          marginBottom: 24,
        }}
      >
        <span className="font-cairo font-bold" style={{ fontSize: 40, color: "#5DBE8A" }}>✓</span>
      </div>

      <style>{`
        @keyframes scaleIn { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>

      <p className="font-cairo font-bold text-white" style={{ fontSize: 28 }}>أهلاً بك في برو! 🎉</p>
      <p className="font-cairo font-light" style={{ fontSize: 16, color: "#9090A8", marginTop: 8, marginBottom: 32 }}>اشتراكك فعّال الآن</p>

      <div className="flex flex-col gap-4 w-full" style={{ maxWidth: 320 }}>
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3"
            style={{ animation: `fadeInUp 0.5s ease ${0.3 + i * 0.2}s both` }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span className="font-cairo font-light text-white" style={{ fontSize: 15 }}>{item.text}</span>
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
          fontSize: 16,
          cursor: "pointer",
          marginTop: 40,
          maxWidth: 400,
        }}
      >
        ابدأ تدريبك الآن
      </button>
    </div>
  );
};

export default Success;
