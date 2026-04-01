import { useNavigate } from "react-router-dom";

const StreakLost = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ height: "100vh", overflow: "hidden", background: "#0F0F14", direction: "rtl", padding: "0 24px" }}
    >
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span style={{ fontSize: 48 }}>🔥</span>
        <span
          className="absolute font-cairo font-bold"
          style={{ fontSize: 24, color: "#FF6B6B", top: -4, right: -8 }}
        >
          ✕
        </span>
      </div>

      <p className="font-cairo font-bold text-white" style={{ fontSize: 28 }}>انقطع سترك</p>
      <p className="font-cairo font-light" style={{ fontSize: 16, color: "#9090A8", marginTop: 8 }}>كان عندك 12 يوم</p>

      <div
        className="flex flex-col items-center w-full"
        style={{ background: "#1A1A28", borderRadius: 16, padding: 20, marginTop: 32, maxWidth: 320 }}
      >
        <p className="font-cairo font-light text-white" style={{ fontSize: 14 }}>عندك رمز تجميد واحد</p>
        <p className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8", marginTop: 4 }}>يحفظ سترك بدون يوم تدريب</p>
        <button
          className="font-cairo font-bold w-full"
          style={{
            border: "1px solid #6C63FF",
            color: "#6C63FF",
            background: "transparent",
            borderRadius: 999,
            padding: "12px 0",
            fontSize: 14,
            cursor: "pointer",
            marginTop: 16,
          }}
        >
          استخدم الرمز
        </button>
      </div>

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
          marginTop: 16,
          maxWidth: 320,
        }}
      >
        ابدأ من جديد
      </button>
      <p className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8", marginTop: 12 }}>
        لا يهم — كل يوم بداية جديدة
      </p>
    </div>
  );
};

export default StreakLost;
