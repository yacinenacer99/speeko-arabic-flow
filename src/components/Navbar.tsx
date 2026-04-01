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
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        hamburgerRef.current && !hamburgerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const dropdownItems = [
    { label: "الرئيسية", icon: Home, path: "/" },
    { label: "المدونة", icon: BookOpen, path: "/blog" },
    { label: "تواصل معنا", icon: Headphones, path: "/contact" },
    { label: "مسار التعلم", icon: Map, path: "/learning-path" },
    { label: "سياسة الخصوصية", icon: Shield, path: "/privacy" },
    { label: "الشروط والأحكام", icon: FileText, path: "/terms" },
  ];

  const activeColor = "#A89CFF";
  const inactiveColor = "#9090A8";

  return (
    <>
      {/* Hamburger circle — outside pill, to the left */}
      <button
        ref={hamburgerRef}
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed z-[1001] flex items-center justify-center"
        style={{
          top: 16,
          left: "calc(50% - var(--pill-offset))",
          transform: "translateX(-100%)",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "#0F0F14",
          border: "1px solid #2A2A3E",
          boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
          color: "white",
          marginLeft: -8,
        }}
      >
        <Menu size={18} />
      </button>

      {/* Pill + Dropdown wrapper */}
      <div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000]"
        ref={menuRef}
        style={{ ["--pill-offset" as string]: "0px" }}
      >
        {/* Pill */}
        <div
          id="navbar-pill"
          className="flex items-center gap-4 rounded-full transition-colors duration-300"
          style={{
            background: scrolled ? "rgba(15,15,20,0.95)" : "#0F0F14",
            border: "1px solid #2A2A3E",
            boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
            backdropFilter: "blur(16px)",
            width: "fit-content",
            padding: "10px 20px",
          }}
        >
          {/* Speeko wordmark */}
          <span
            className="font-cairo font-bold text-[13px] text-white whitespace-nowrap cursor-pointer"
            onClick={() => navigate("/")}
          >
            Speeko
          </span>

          {/* Divider */}
          <div className="w-px h-4" style={{ background: "#2A2A3E" }} />

          {/* Icon group */}
          <div className="flex items-center gap-5">
            {/* Home */}
            <div className="relative flex items-center">
              <button
                onClick={() => navigate("/")}
                onMouseEnter={() => setTooltip("home")}
                onMouseLeave={() => setTooltip(null)}
                className="transition-colors duration-200 hover:text-white"
                style={{ color: isActive("/") ? activeColor : inactiveColor }}
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
            <div className="relative flex items-center">
              <button
                onClick={() => navigate("/contact")}
                onMouseEnter={() => setTooltip("contact")}
                onMouseLeave={() => setTooltip(null)}
                className="transition-colors duration-200 hover:text-white"
                style={{ color: isActive("/contact") ? activeColor : inactiveColor }}
              >
                <Headphones size={18} />
              </button>
              {tooltip === "contact" && (
                <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-cairo text-white whitespace-nowrap animate-fade-in" style={{ background: "#1A1A28" }}>
                  تواصل معنا
                </span>
              )}
            </div>

            {/* Globe — no text label */}
            <div className="relative flex items-center">
              <button
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                onMouseEnter={() => setTooltip("lang")}
                onMouseLeave={() => setTooltip(null)}
                className="transition-colors duration-200 hover:text-white"
                style={{ color: inactiveColor }}
              >
                <Globe size={18} />
              </button>
              {tooltip === "lang" && (
                <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-cairo text-white whitespace-nowrap animate-fade-in" style={{ background: "#1A1A28" }}>
                  {lang === "ar" ? "English" : "العربية"}
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-4" style={{ background: "#2A2A3E" }} />

          {/* المدونة — hidden on mobile */}
          <button
            onClick={() => navigate("/blog")}
            className="hidden md:block font-cairo font-light text-[13px] hover:text-white transition-colors duration-200 whitespace-nowrap"
            style={{ color: inactiveColor }}
          >
            المدونة
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
                className="flex items-center gap-3 w-full px-2 py-2.5 rounded-lg font-cairo font-light text-sm transition-colors duration-200"
                style={{ direction: "rtl", color: inactiveColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(108,99,255,0.1)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = inactiveColor;
                }}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
