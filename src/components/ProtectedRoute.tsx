import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PROTECTED_PREFIXES = ["/home", "/challenge", "/results", "/progress", "/profile", "/badges", "/settings", "/weeklyReport", "/streakLost", "/levelup"];

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;
  return <>{children}</>;
};

export default ProtectedRoute;
