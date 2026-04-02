import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, TrendingUp, User, Globe, Menu, X, BookOpen, Mail, CreditCard, Settings, LogOut } from "lucide-react";

const publicPages = ["/", "/onboarding", "/signup", "/login", "/subscribe", "/blog", "/contact"];
const loggedInPages = ["/home", "/challenge", "/results", "/progress", "/profile", "/badges", "/settings", "/weeklyReport", "/streakLost", "/levelup", "/success"];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = loggedInPages.some(p => location.pathname.startsWith(p));

  // Determine if on dark background page
  const darkPages = ["/challenge", "/signup", "/login", "/onboarding"];
  const isDark = darkPages.some(p => location.pathname === p) || isLoggedIn;
  const textColor = isDark ? "#FFFFFF" : "#0F0F14";

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const activeColor = "#A89CFF";
  const inactiveColor = "#9090A8";

  const loggedOutMenuItems = [
    { label: "المدونة", icon: BookOpen, path: "/blog" },
    { label: "تواصل معنا", icon: Mail, path: "/contact" },
    { label: "الاشتراك", icon: CreditCard, path: "/subscribe" },
  ];

  const loggedInMenuItems = [
    { label: "الإعدادات", icon: Settings, path: "/settings" },
    { label: "الاشتراك", icon: CreditCard, path: "/subscribe" },
    { label: "تواصل معنا", icon: Mail, path: "/contact" },
  ];

  const loggedInNavItems = [
    { label: "الرئيسية", icon: Home, path: "/home" },
    { label: "تقدمي", icon: TrendingUp, path: "/progress" },
    { label: "ملفي", icon: User, path: "/profile" },
  ];

  return (
    <div ref={wrapperRef} className="fixed top-0 left-0 right-0 z-[1000]" style={{ direction: "rtl", pointerEvents: "none" }}>
      <div
        className="flex items-center justify-between"
        style={{ height: 72, paddingRight: 20, paddingLeft: 20, pointerEvents: "auto" }}
      >
        {/* RIGHT: Wordmark */}
        <span
          className="font-cairo font-bold cursor-pointer"
          style={{ fontSize: 14, color: textColor, zIndex: 10 }}
          onClick={() => navigate("/")}
        >
          ملسون
        </span>

        {/* CENTER: Floating Pill */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: 14,
            background: "#0F0F14",
            border: "1px solid #2A2A3E",
            borderRadius: 999,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            pointerEvents: "auto",
          }}
        >
          {isLoggedIn ? (
            /* LOGGED-IN PILL */
            <div className="flex items-center" style={{ padding: "8px 24px", height: 56, gap: 0 }}>
              {loggedInNavItems.map((item, i) => {
                const active = isActive(item.path);
                const color = active ? activeColor : inactiveColor;
                return (
                  <div key={item.path} className="flex items-center">
                    <button
                      onClick={() => navigate(item.path)}
                      className="flex flex-col items-center justify-center transition-colors duration-200"
                      style={{ padding: "0 20px", color, gap: 2 }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#FFFFFF"; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.color = inactiveColor; }}
                    >
                      <item.icon size={18} />
                      <span className="font-cairo font-light" style={{ fontSize: 11 }}>{item.label}</span>
                    </button>
                    {i < loggedInNavItems.length && (
                      <div style={{ width: 1, height: 28, background: "#2A2A3E" }} />
                    )}
                  </div>
                );
              })}
              {/* Language toggle */}
              <button
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                className="flex flex-col items-center justify-center transition-colors duration-200"
                style={{ padding: "0 20px", color: inactiveColor, gap: 2 }}
                onMouseEnter={e => { e.currentTarget.style.color = "#FFFFFF"; }}
                onMouseLeave={e => { e.currentTarget.style.color = inactiveColor; }}
              >
                <Globe size={18} />
                <span className="font-cairo font-light" style={{ fontSize: 11 }}>اللغة</span>
              </button>
            </div>
          ) : (
            /* LOGGED-OUT PILL */
            <div className="flex items-center" style={{ padding: "10px 24px", height: 44, gap: 0 }}>
              <button
                onClick={() => navigate("/contact")}
                className="font-cairo font-light transition-colors duration-200"
                style={{ fontSize: 13, color: inactiveColor, padding: "0 12px", whiteSpace: "nowrap" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#FFFFFF"; }}
                onMouseLeave={e => { e.currentTarget.style.color = inactiveColor; }}
              >
                من نحن
              </button>
              <div style={{ width: 1, height: 16, background: "#2A2A3E" }} />
              <button
                onClick={() => navigate("/login")}
                className="font-cairo font-light transition-colors duration-200"
                style={{ fontSize: 13, color: inactiveColor, padding: "0 12px", whiteSpace: "nowrap" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#FFFFFF"; }}
                onMouseLeave={e => { e.currentTarget.style.color = inactiveColor; }}
              >
                تسجيل الدخول
              </button>
              <div style={{ width: 1, height: 16, background: "#2A2A3E" }} />
              <button
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                className="flex items-center gap-1.5 font-cairo font-light transition-colors duration-200"
                style={{ fontSize: 13, color: inactiveColor, padding: "0 12px", whiteSpace: "nowrap" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#FFFFFF"; }}
                onMouseLeave={e => { e.currentTarget.style.color = inactiveColor; }}
              >
                <Globe size={14} />
                <span>اللغة</span>
              </button>
            </div>
          )}
        </div>

        {/* LEFT: Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="transition-colors duration-200"
          style={{ background: "none", border: "none", cursor: "pointer", color: textColor, zIndex: 10 }}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          className="absolute"
          style={{
            top: 64,
            left: 20,
            width: 220,
            background: "rgba(15, 15, 20, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 12,
            pointerEvents: "auto",
          }}
        >
          {(isLoggedIn ? loggedInMenuItems : loggedOutMenuItems).map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMenuOpen(false); }}
              className="flex items-center w-full font-cairo font-light transition-all duration-200"
              style={{
                gap: 10,
                padding: "10px 16px",
                borderRadius: 10,
                fontSize: 13,
                color: inactiveColor,
                direction: "rtl",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#FFFFFF"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = inactiveColor; }}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}
          {isLoggedIn && (
            <button
              onClick={() => { navigate("/"); setMenuOpen(false); }}
              className="flex items-center w-full font-cairo font-light transition-all duration-200"
              style={{
                gap: 10,
                padding: "10px 16px",
                borderRadius: 10,
                fontSize: 13,
                color: "#FF6B6B",
                direction: "rtl",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <LogOut size={16} />
              <span>تسجيل الخروج</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
