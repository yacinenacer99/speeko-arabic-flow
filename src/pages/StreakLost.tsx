import { useNavigate } from "react-router-dom";
import { Flame, X } from "lucide-react";

const StreakLost = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ height: "100vh", overflow: "hidden", background: "#0F0F14", direction: "rtl", padding: "0 24px" }}
    >
      <div style={{ position: "relative", marginBottom: 16 }}>
        <div
          className="flex items-center justify-center"
          style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,107,107,0.15)" }}
        >
          <Flame size={32} color="#FF6B6B" />
        </div>
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: -4,
            right: -4,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#FF6B6B",
          }}
        >
          <X size={12} color="white" />
        </div>
      </div>

      <p className="font-cairo font-bold text-white" style={{ fontSize: 28 }}>انقطع سترك</p>
      <p className="font-cairo font-light" style={{ fontSize: 16, color: "hsl(var(--muted-foreground))", marginTop: 8 }}>كان عندك 12 يوم</p>

      <div
        className="flex flex-col items-center w-full glass-card-dark"
        style={{ padding: 20, marginTop: 32, maxWidth: 320 }}
      >
        <p className="font-cairo font-light text-white" style={{ fontSize: 14 }}>عندك رمز تجميد واحد</p>
        <p className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>يحفظ سترك بدون يوم تدريب</p>
        <button
          className="font-cairo font-bold w-full"
          style={{
            border: "1px solid hsl(var(--primary))",
            color: "hsl(var(--primary))",
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
          background: "hsl(var(--primary))",
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
      <p className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 12 }}>
        لا يهم — كل يوم بداية جديدة
      </p>
    </div>
  );
};

export default StreakLost;
