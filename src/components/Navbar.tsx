import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Headphones, Globe, Menu, BookOpen, Map, Shield, FileText } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const iconColor = (path: string) =>
    isActive(path) ? "hsl(244 100% 68%)" : undefined;

  const dropdownItems = [
    { label: "الرئيسية", icon: Home, path: "/" },
    { label: "المدونة", icon: BookOpen, path: "/blog" },
    { label: "تواصل معنا", icon: Headphones, path: "/contact" },
    { label: "مسار التعلم", icon: Map, path: "/learning-path" },
    { label: "سياسة الخصوصية", icon: Shield, path: "/privacy" },
    { label: "الشروط والأحكام", icon: FileText, path: "/terms" },
  ];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000]" ref={menuRef}>
      {/* Pill */}
      <div
        className="flex items-center gap-4 rounded-full px-5 py-2.5 transition-colors duration-300"
        style={{
          background: scrolled ? "rgba(15,15,20,0.95)" : "#0F0F14",
          border: "1px solid #2A2A3E",
          boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
          backdropFilter: "blur(16px)",
          width: "fit-content",
        }}
      >
        {/* 1. Speeko wordmark */}
        <span className="font-cairo font-bold text-[13px] text-white whitespace-nowrap cursor-pointer" onClick={() => navigate("/")}>
          Speeko
        </span>

        {/* Divider */}
        <div className="w-px h-4" style={{ background: "#2A2A3E" }} />

        {/* 2. Icon group */}
        <div className="flex items-center gap-5">
          {/* Home */}
          <div className="relative">
            <button
              onClick={() => navigate("/")}
              onMouseEnter={() => setTooltip("home")}
              onMouseLeave={() => setTooltip(null)}
              className="text-muted-foreground hover:text-white transition-colors duration-200"
              style={isActive("/") ? { color: "hsl(244 100% 68%)" } : undefined}
            >
              <Home size={18} />
            </button>
            {tooltip === "home" && (
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-cairo text-white whitespace-nowrap animate-fade-in" style={{ background: "#1A1A28" }}>
                الرئيسية
              </span>
            )}
          </div>

          {/* Headphones */}
          <div className="relative">
            <button
              onClick={() => navigate("/contact")}
              onMouseEnter={() => setTooltip("contact")}
              onMouseLeave={() => setTooltip(null)}
              className="text-muted-foreground hover:text-white transition-colors duration-200"
              style={isActive("/contact") ? { color: "hsl(244 100% 68%)" } : undefined}
            >
              <Headphones size={18} />
            </button>
            {tooltip === "contact" && (
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-cairo text-white whitespace-nowrap animate-fade-in" style={{ background: "#1A1A28" }}>
                تواصل معنا
              </span>
            )}
          </div>

          {/* Globe */}
          <div className="relative flex items-center gap-1.5">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              onMouseEnter={() => setTooltip("lang")}
              onMouseLeave={() => setTooltip(null)}
              className="text-muted-foreground hover:text-white transition-colors duration-200"
            >
              <Globe size={18} />
            </button>
            <span className="font-cairo font-light text-[13px] text-muted-foreground">
              {lang === "ar" ? "EN" : "ع"}
            </span>
            {tooltip === "lang" && (
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-cairo text-white whitespace-nowrap animate-fade-in" style={{ background: "#1A1A28" }}>
                {lang === "ar" ? "English" : "العربية"}
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-4" style={{ background: "#2A2A3E" }} />

        {/* 3. المدونة — hidden on mobile */}
        <button
          onClick={() => navigate("/blog")}
          className="hidden md:block font-cairo font-light text-[13px] text-muted-foreground hover:text-white transition-colors duration-200 whitespace-nowrap"
        >
          المدونة
        </button>

        {/* Divider — hidden on mobile */}
        <div className="hidden md:block w-px h-4" style={{ background: "#2A2A3E" }} />

        {/* 4. Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white transition-colors duration-200"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Dropdown */}
      {menuOpen && (
        <div
          className="mx-auto mt-2 p-5 rounded-2xl"
          style={{
            background: "#0F0F14",
            border: "1px solid #2A2A3E",
            minWidth: 220,
            animation: "fade-in 0.15s ease-out",
          }}
        >
          {dropdownItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full px-2 py-2.5 rounded-lg font-cairo font-light text-sm text-muted-foreground hover:text-white transition-colors duration-200"
              style={{ direction: "rtl" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(108,99,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
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
