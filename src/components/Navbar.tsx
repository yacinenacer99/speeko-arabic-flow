import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, TrendingUp, User, Globe } from "lucide-react";

const publicPages = ["/", "/onboarding", "/signup", "/login", "/subscribe", "/blog", "/contact"];
const loggedInPages = ["/home", "/challenge", "/results", "/progress", "/profile", "/badges", "/settings", "/weeklyReport", "/streakLost", "/levelup"];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState<"ar" | "en">("ar");

  const isLoggedIn = loggedInPages.some(p => location.pathname.startsWith(p));

  const darkPages = ["/challenge"];
  const isDark = darkPages.some(p => location.pathname === p);
  const wordmarkColor = isDark ? "#FFFFFF" : "#0F0F14";

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
      className="fixed z-[1000]"
      style={{
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#0F0F14",
        border: "1px solid #2A2A3E",
        borderRadius: 999,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {isLoggedIn ? (
        <div className="flex items-center" style={{ padding: "8px 20px", height: 48, gap: 0 }}>
          {loggedInNavItems.map((item) => {
            const active = isActive(item.path);
            const color = active ? activeColor : inactiveColor;
            return (
              <div key={item.path} className="flex items-center">
                <button
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center justify-center transition-colors duration-200"
                  style={{ padding: "0 14px", color, gap: 2 }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#FFFFFF"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = inactiveColor; }}
                >
                  <item.icon size={16} />
                  <span className="font-cairo font-light" style={{ fontSize: 10 }}>{item.label}</span>
                </button>
                <div style={{ width: 1, height: 24, background: "#2A2A3E" }} />
              </div>
            );
          })}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="flex flex-col items-center justify-center transition-colors duration-200"
            style={{ padding: "0 14px", color: inactiveColor, gap: 2 }}
            onMouseEnter={e => { e.currentTarget.style.color = "#FFFFFF"; }}
            onMouseLeave={e => { e.currentTarget.style.color = inactiveColor; }}
          >
            <Globe size={16} />
            <span className="font-cairo font-light" style={{ fontSize: 10 }}>اللغة</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center py-[14px] px-[21px]" style={{ gap: 0 }}>
          <span
            className="font-cairo font-bold cursor-pointer"
            style={{ fontSize: 14, color: "#FFFFFF", padding: "0 12px", whiteSpace: "nowrap" }}
            onClick={() => navigate("/")}
          >
            ملسون
          </span>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.15)" }} />
          <button
            onClick={() => navigate("/login")}
            className="font-cairo font-light transition-colors duration-200"
            style={{ fontSize: 12, color: inactiveColor, padding: "0 12px", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#FFFFFF"; }}
            onMouseLeave={e => { e.currentTarget.style.color = inactiveColor; }}
          >
            تسجيل الدخول
          </button>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.15)" }} />
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="font-cairo font-light transition-colors duration-200"
            style={{ fontSize: 12, color: inactiveColor, padding: "0 12px", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#FFFFFF"; }}
            onMouseLeave={e => { e.currentTarget.style.color = inactiveColor; }}
          >
            اللغة
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
