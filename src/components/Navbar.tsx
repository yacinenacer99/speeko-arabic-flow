import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Headphones, Globe, Menu, X, BookOpen, Map, Shield, FileText, TrendingUp, User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const loggedInPages = ["/home", "/progress", "/profile", "/badges", "/settings", "/weeklyReport", "/subscribe", "/challenge", "/results", "/levelup", "/streakLost", "/success"];
  const showPillNav = loggedInPages.some(p => location.pathname.startsWith(p));

  const pillTabs = [
    { label: "الرئيسية", icon: Home, path: "/home" },
    { label: "تقدمي", icon: TrendingUp, path: "/progress" },
    { label: "ملفي", icon: User, path: "/profile" },
  ];

  const menuItems = [
    { label: "الرئيسية", icon: Home, path: "/" },
    { label: "لوحة التحكم", icon: Home, path: "/home" },
    { label: "تقدمي", icon: TrendingUp, path: "/progress" },
    { label: "ملفي", icon: User, path: "/profile" },
    { label: "المدونة", icon: BookOpen, path: "/blog" },
    { label: "تواصل معنا", icon: Headphones, path: "/contact" },
    { label: "مسار التعلم", icon: Map, path: "/learning-path" },
    { label: "سياسة الخصوصية", icon: Shield, path: "/privacy" },
    { label: "الشروط والأحكام", icon: FileText, path: "/terms" },
  ];

  const activeColor = "#A89CFF";
  const inactiveColor = "#9090A8";

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000]" ref={wrapperRef} style={{ direction: "rtl" }}>
      {/* Main header bar */}
      <div
        className="flex items-center justify-between transition-colors duration-300 px-5 md:px-8"
        style={{
          background: scrolled ? "rgba(15,15,20,0.95)" : "#0F0F14",
          borderBottom: showPillNav ? "none" : "1px solid #2A2A3E",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          height: 56,
        }}
      >
        {/* Wordmark */}
        <span
          className="font-cairo font-bold text-[15px] whitespace-nowrap cursor-pointer text-white"
          onClick={() => navigate("/")}
        >
          ملسون
        </span>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "الرئيسية", path: "/" },
            { label: "المدونة", path: "/blog" },
            { label: "تواصل معنا", path: "/contact" },
          ].map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="font-cairo font-light text-[13px] transition-colors duration-200 hover:text-white"
              style={{ color: isActive(link.path) ? activeColor : inactiveColor }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Language + Hamburger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="hidden md:flex items-center gap-1.5 transition-colors duration-200 hover:text-white"
            style={{ color: inactiveColor }}
          >
            <Globe size={16} />
            <span className="font-cairo font-light text-[12px]">{lang === "ar" ? "EN" : "ع"}</span>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center transition-colors duration-200 text-white hover:text-white/80"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Secondary pill nav for logged-in pages */}
      {showPillNav && (
        <div
          className="flex items-center justify-center"
          style={{
            background: scrolled ? "rgba(15,15,20,0.95)" : "#0F0F14",
            borderBottom: "1px solid #2A2A3E",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            paddingBottom: 8,
            paddingTop: 2,
          }}
        >
          <div
            className="flex items-center gap-1 rounded-full"
            style={{
              background: "#1A1A28",
              border: "1px solid #2A2A3E",
              padding: "4px 6px",
            }}
          >
            {pillTabs.map((tab) => {
              const active = isActive(tab.path);
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className="flex items-center gap-1.5 rounded-full font-cairo font-light text-[12px] transition-all duration-200"
                  style={{
                    padding: "6px 14px",
                    color: active ? "white" : inactiveColor,
                    background: active ? "rgba(108,99,255,0.2)" : "transparent",
                  }}
                >
                  <tab.icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          className="absolute left-4 right-4 md:left-auto md:right-auto md:w-[280px] p-4 rounded-2xl md:left-4"
          style={{
            top: showPillNav ? 90 : 56,
            marginTop: 4,
            background: "rgba(15,15,20,0.97)",
            border: "1px solid #2A2A3E",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
            borderRadius: 16,
          }}
        >
          {/* Mobile language toggle */}
          <div className="flex items-center justify-between px-2 py-2 mb-2 md:hidden">
            <span className="font-cairo font-light text-[13px]" style={{ color: inactiveColor }}>اللغة</span>
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors duration-200"
              style={{ background: "rgba(108,99,255,0.1)", color: activeColor }}
            >
              <Globe size={14} />
              <span className="font-cairo font-light text-[12px]">{lang === "ar" ? "English" : "العربية"}</span>
            </button>
          </div>
          <div className="md:hidden w-full h-px mb-2" style={{ background: "#2A2A3E" }} />

          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-cairo font-light text-sm transition-all duration-200"
              style={{
                direction: "rtl",
                color: isActive(item.path) ? "white" : inactiveColor,
                background: isActive(item.path) ? "rgba(108,99,255,0.1)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = "rgba(108,99,255,0.08)";
                  e.currentTarget.style.color = "white";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = inactiveColor;
                }
              }}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
