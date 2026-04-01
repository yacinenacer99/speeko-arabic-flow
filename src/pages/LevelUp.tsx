import { useNavigate } from "react-router-dom";

const LevelUp = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ height: "100vh", overflow: "hidden", background: "#0F0F14", direction: "rtl", padding: "0 24px" }}
    >
      {/* CSS confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 6 + Math.random() * 6,
              height: 6 + Math.random() * 6,
              background: ["#6C63FF", "#A89CFF", "#FF9DC4", "#5DBE8A", "#F59E0B"][i % 5],
              left: `${Math.random() * 100}%`,
              top: -10,
              animation: `confettiFall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <span style={{ fontSize: 64 }}>⭐</span>
      <p className="font-cairo font-bold text-white" style={{ fontSize: 32, marginTop: 16 }}>ترقيت!</p>
      <p className="font-cairo font-bold" style={{ fontSize: 48, color: "#A89CFF", marginTop: 8 }}>متحدث</p>
      <p className="font-cairo font-light" style={{ fontSize: 16, color: "#9090A8", marginTop: 8 }}>وصلت للمرحلة الثانية</p>

      <div
        className="flex flex-col items-center"
        style={{ background: "#1A1A28", borderRadius: 16, padding: 20, marginTop: 32, width: "100%", maxWidth: 300 }}
      >
        <span className="font-cairo font-bold" style={{ fontSize: 28, color: "#A89CFF" }}>+100 XP</span>
        <span className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8", marginTop: 4 }}>نقاط مكتسبة</span>
      </div>

      <p className="font-cairo font-light" style={{ fontSize: 14, color: "#9090A8", marginTop: 16 }}>
        فتحت: كلمات ممنوعة متعددة + تحديات أصعب
      </p>

      <button
        onClick={() => navigate("/home")}
        className="font-cairo font-bold text-white w-full"
        style={{
          background: "#6C63FF",
          border: "none",
          borderRadius: 999,
          padding: "16px 0",
          fontSize: 16,
          cursor: "pointer",
          marginTop: 32,
          maxWidth: 400,
        }}
      >
        استمر في التدريب
      </button>
    </div>
  );
};

export default LevelUp;
