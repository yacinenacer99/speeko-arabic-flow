import { useNavigate, useLocation } from "react-router-dom";
import { Home, TrendingUp, User } from "lucide-react";

const tabs = [
  { label: "ملفي", icon: User, path: "/profile" },
  { label: "تقدمي", icon: TrendingUp, path: "/progress" },
  { label: "الرئيسية", icon: Home, path: "/home" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[900] flex items-center justify-around md:hidden"
      style={{
        background: "#0F0F14",
        borderTop: "1px solid #2A2A3E",
        padding: "8px 0 env(safe-area-inset-bottom, 8px)",
        direction: "rtl",
      }}
    >
      {tabs.map((tab) => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer"
            style={{ padding: "6px 16px" }}
          >
            <tab.icon size={20} color={active ? "#A89CFF" : "#9090A8"} />
            <span
              className="font-cairo font-light"
              style={{ fontSize: 11, color: active ? "#A89CFF" : "#9090A8" }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
