import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid hsl(var(--border))",
    borderRadius: 12,
    padding: "14px 16px",
    fontSize: 15,
    fontFamily: "Cairo, sans-serif",
    fontWeight: 300,
    background: "hsla(0, 0%, 100%, 0.6)",
    backdropFilter: "blur(10px)",
    color: "hsl(var(--foreground))",
    outline: "none",
    direction: "rtl",
  };

  return (
    <div
      className="flex flex-col items-center justify-center relative"
      style={{ minHeight: "100vh", background: "hsl(var(--background))", direction: "rtl", padding: "0 24px" }}
    >
      <Navbar />
      <div className="blob blob-violet" style={{ width: 300, height: 300, top: "20%", right: "-10%" }} />
      <div className="blob blob-pink" style={{ width: 200, height: 200, bottom: "15%", left: "-5%" }} />

      <div className="w-full relative z-10" style={{ maxWidth: 380 }}>
        <p className="font-cairo font-bold text-center" style={{ fontSize: 24, color: "hsl(var(--foreground))", marginBottom: 32 }}>
          ملسون
        </p>

        <div className="glass-card-light" style={{ padding: 32 }}>
          <h1 className="font-cairo font-bold text-center" style={{ fontSize: 22, color: "hsl(var(--foreground))", marginBottom: 4 }}>
            أنشئ حسابك
          </h1>
          <p className="font-cairo font-light text-center" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginBottom: 24 }}>
            مجاناً — لا تحتاج بطاقة
          </p>

          {/* Google */}
          <button
            onClick={() => navigate("/home")}
            className="font-cairo font-bold w-full flex items-center justify-center gap-2 glass-card-light"
            style={{ borderRadius: 999, padding: 14, fontSize: 15, color: "hsl(var(--foreground))", cursor: "pointer" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
            تابع مع Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1" style={{ height: 1, background: "hsl(var(--border))" }} />
            <span className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>أو</span>
            <div className="flex-1" style={{ height: 1, background: "hsl(var(--border))" }} />
          </div>

          <div className="flex flex-col gap-3">
            <input style={inputStyle} placeholder="البريد الإلكتروني" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="relative">
              <input style={inputStyle} placeholder="كلمة المرور" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
              <button onClick={() => setShowPw(!showPw)} className="absolute top-1/2 -translate-y-1/2" style={{ left: 14, background: "none", border: "none", cursor: "pointer" }}>
                {showPw ? <EyeOff size={18} color="hsl(var(--muted-foreground))" /> : <Eye size={18} color="hsl(var(--muted-foreground))" />}
              </button>
            </div>
            <button
              onClick={() => navigate("/home")}
              className="font-cairo font-bold text-white w-full"
              style={{ background: "hsl(var(--primary))", border: "none", borderRadius: 999, padding: "14px 0", fontSize: 16, cursor: "pointer", marginTop: 8 }}
            >
              أنشئ الحساب
            </button>
          </div>

          <p className="font-cairo font-light text-center" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 20 }}>
            عندك حساب؟{" "}
            <button onClick={() => navigate("/login")} className="font-cairo font-bold" style={{ background: "none", border: "none", color: "hsl(var(--primary))", cursor: "pointer", fontSize: 13 }}>
              سجل دخول
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
