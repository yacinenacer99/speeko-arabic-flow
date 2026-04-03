import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CreditCard,
  Home,
  LogOut,
  Mail,
  Menu,
  Settings,
  TrendingUp,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRecordingContext } from "@/contexts/RecordingContext";
import { supabase } from "@/lib/supabase";

const dividerStyle = {
  width: 1,
  height: 16,
  background: "rgba(255,255,255,0.15)",
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, isLoading } = useAuth();
  const { isRecording } = useRecordingContext();

  const [openDropdown, setOpenDropdown] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const activeColor = "#A89CFF";
  const inactiveColor = "#9090A8";

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (!openDropdown) return;

    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      const target = e.target as Node;
      if (!rootRef.current.contains(target)) setOpenDropdown(false);
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [openDropdown]);

  useEffect(() => {
    setOpenDropdown(false);
  }, [location.pathname]);

  const go = (path: string) => {
    setOpenDropdown(false);
    navigate(path);
  };

  const signOutAndGoHome = async () => {
    setOpenDropdown(false);
    await supabase.auth.signOut();
    navigate("/");
  };

  if (isRecording) {
    return null;
  }

  const pillButtonBase = {
    minHeight: 44,
    minWidth: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  };

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#0F0F14",
          border: "1px solid #2A2A3E",
          borderRadius: 999,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: isLoggedIn ? "8px 20px" : "10px 20px",
          height: isLoggedIn ? 48 : 48,
          direction: "rtl",
          display: "flex",
          alignItems: "center",
          gap: 0,
          maxWidth: "92vw",
        }}
      >
        {isLoading ? (
          <span
            className="font-cairo font-bold"
            style={{ fontSize: 13, color: "#FFFFFF", padding: "0 10px", whiteSpace: "nowrap" }}
          >
            ملسون
          </span>
        ) : isLoggedIn ? (
          <>
            <span
              className="font-cairo font-bold"
              style={{
                fontSize: 13,
                color: "#FFFFFF",
                whiteSpace: "nowrap",
                padding: "0 10px",
                cursor: "pointer",
              }}
              onClick={() => go("/home")}
            >
              ملسون
            </span>
            <div style={dividerStyle} />

            {[
              { label: "الرئيسية", path: "/home", icon: Home },
              { label: "تقدمي", path: "/progress", icon: TrendingUp },
              { label: "ملفي", path: "/profile", icon: User },
            ].map((item) => {
              const active = isActive(item.path);
              const color = active ? activeColor : inactiveColor;
              const IconComp = item.icon;

              return (
                <div key={item.path} style={{ display: "flex", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => go(item.path)}
                    style={{
                      ...pillButtonBase,
                      padding: "0 12px",
                      color,
                      flexDirection: "column",
                      gap: 2,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = color;
                    }}
                  >
                    <IconComp size={16} />
                    <span className="font-cairo font-light" style={{ fontSize: 10 }}>
                      {item.label}
                    </span>
                  </button>

                  <div style={dividerStyle} />
                </div>
              );
            })}

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpenDropdown((v) => !v)}
              style={{ ...pillButtonBase, padding: "0 10px", color: inactiveColor }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = inactiveColor;
              }}
            >
              <Menu size={18} color={inactiveColor} />
            </button>
          </>
        ) : (
          <>
            <span
              className="font-cairo font-bold cursor-pointer"
              style={{ fontSize: 13, color: "#FFFFFF", padding: "0 10px", whiteSpace: "nowrap" }}
              onClick={() => go("/")}
            >
              ملسون
            </span>
            <div style={dividerStyle} />
            <button
              type="button"
              onClick={() => go("/login")}
              style={{
                ...pillButtonBase,
                padding: "0 10px",
                fontSize: 12,
                color: inactiveColor,
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = inactiveColor;
              }}
            >
              تسجيل الدخول
            </button>
            <div style={dividerStyle} />
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpenDropdown((v) => !v)}
              style={{
                ...pillButtonBase,
                padding: "0 10px",
                color: inactiveColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = inactiveColor;
              }}
            >
              <Menu size={18} color={inactiveColor} />
            </button>
          </>
        )}
      </div>

      {openDropdown && (
        <div
          style={{
            position: "fixed",
            top: 72,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(15,15,20,0.9)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 12,
            minWidth: 200,
            zIndex: 9999,
          }}
        >
          {isLoggedIn ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "الإعدادات", path: "/settings", icon: Settings },
                { label: "الاشتراك", path: "/subscribe", icon: CreditCard },
                { label: "تواصل معنا", path: "/contact", icon: Mail },
              ].map((row) => {
                const IconComp = row.icon;
                return (
                  <button
                    key={row.path}
                    type="button"
                    onClick={() => go(row.path)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: inactiveColor,
                      minHeight: 44,
                      textAlign: "right",
                      fontFamily: "Cairo, sans-serif",
                      fontSize: 13,
                      fontWeight: 300,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.color = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = inactiveColor;
                    }}
                  >
                    <IconComp size={16} />
                    <span style={{ lineHeight: 1.2 }}>{row.label}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => void signOutAndGoHome()}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#FF6B6B",
                  minHeight: 44,
                  textAlign: "right",
                  fontFamily: "Cairo, sans-serif",
                  fontSize: 13,
                  fontWeight: 300,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#FF6B6B";
                }}
              >
                <LogOut size={16} />
                <span style={{ lineHeight: 1.2 }}>تسجيل الخروج</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "المدونة", path: "/blog", icon: BookOpen },
                { label: "تواصل معنا", path: "/contact", icon: Mail },
                { label: "الاشتراك", path: "/subscribe", icon: CreditCard },
              ].map((row) => {
                const IconComp = row.icon;
                return (
                  <button
                    key={row.path}
                    type="button"
                    onClick={() => go(row.path)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: inactiveColor,
                      minHeight: 44,
                      textAlign: "right",
                      fontFamily: "Cairo, sans-serif",
                      fontSize: 13,
                      fontWeight: 300,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.color = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = inactiveColor;
                    }}
                  >
                    <IconComp size={16} />
                    <span style={{ lineHeight: 1.2 }}>{row.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
