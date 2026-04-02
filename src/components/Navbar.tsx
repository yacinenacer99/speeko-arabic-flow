import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, TrendingUp, User, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const { isLoggedIn } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const activeColor = "#A89CFF";
  const inactiveColor = "#9090A8";

  const loggedInNavItems = [
    { label: "الرئيسية", icon: Home, path: "/home" },
    { label: "تقدمي", icon: TrendingUp, path: "/progress" },
    { label: "ملفي", icon: User, path: "/profile" },
  ];

  return (
    <div
      className="fixed z-[1000] navbar-pill"
      style={{
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#0F0F14",
        border: "1px solid #2A2A3E",
        borderRadius: 999,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        maxWidth: "90vw",
      }}
    >
      {isLoggedIn ? (
        <div className="flex items-center nav-logged-in" style={{ padding: "8px 16px", height: 48, gap: 0 }}>
          {loggedInNavItems.map((item) => {
            const active = isActive(item.path);
            const color = active ? activeColor : inactiveColor;
            return (
              <div key={item.path} className="flex items-center">
                <button
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center justify-center transition-colors duration-200"
                  style={{ padding: "0 12px", color, gap: 2, minHeight: 44, minWidth: 44 }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#FFFFFF"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = inactiveColor; }}
                >
                  <item.icon size={16} className="nav-icon" />
                  <span className="font-cairo font-light nav-label" style={{ fontSize: 10 }}>{item.label}</span>
                </button>
                <div style={{ width: 1, height: 24, background: "#2A2A3E" }} />
              </div>
            );
          })}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="flex flex-col items-center justify-center transition-colors duration-200"
            style={{ padding: "0 12px", color: inactiveColor, gap: 2, minHeight: 44, minWidth: 44 }}
            onMouseEnter={e => { e.currentTarget.style.color = "#FFFFFF"; }}
            onMouseLeave={e => { e.currentTarget.style.color = inactiveColor; }}
          >
            <Globe size={16} className="nav-icon" />
            <span className="font-cairo font-light nav-label" style={{ fontSize: 10 }}>اللغة</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center nav-logged-out" style={{ padding: "14px 16px", gap: 0 }}>
          <span
            className="font-cairo font-bold cursor-pointer"
            style={{ fontSize: 12, color: "#FFFFFF", padding: "0 10px", whiteSpace: "nowrap" }}
            onClick={() => navigate("/")}
          >
            ملسون
          </span>
          <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.15)" }} />
          <button
            onClick={() => navigate("/login")}
            className="font-cairo font-light transition-colors duration-200"
            style={{ fontSize: 11, color: inactiveColor, padding: "0 10px", whiteSpace: "nowrap", minHeight: 44, display: "flex", alignItems: "center" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#FFFFFF"; }}
            onMouseLeave={e => { e.currentTarget.style.color = inactiveColor; }}
          >
            تسجيل الدخول
          </button>
          <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.15)" }} />
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="font-cairo font-light transition-colors duration-200"
            style={{ fontSize: 11, color: inactiveColor, padding: "0 10px", whiteSpace: "nowrap", minHeight: 44, display: "flex", alignItems: "center" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#FFFFFF"; }}
            onMouseLeave={e => { e.currentTarget.style.color = inactiveColor; }}
          >
            اللغة
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .nav-logged-out { padding: 8px 20px !important; }
          .nav-logged-out span, .nav-logged-out button { font-size: 12px !important; }
          .nav-logged-out .font-bold { font-size: 13px !important; }
          .nav-logged-out div[style*="height: 14px"] { height: 16px !important; }
          .nav-logged-in { padding: 8px 20px !important; }
          .nav-logged-in button { padding: 0 16px !important; }
          .nav-icon { width: 18px !important; height: 18px !important; }
          .nav-label { font-size: 11px !important; }
        }
        @media (min-width: 1024px) {
          .nav-logged-out { padding: 10px 24px !important; }
          .nav-logged-out span, .nav-logged-out button { font-size: 13px !important; }
          .nav-logged-out .font-bold { font-size: 14px !important; }
          .navbar-pill { top: 16px !important; }
          .nav-logged-in { padding: 10px 24px !important; }
          .nav-logged-in button { padding: 0 18px !important; }
        }
      `}</style>
    </div>
  );
};

export default Navbar;
