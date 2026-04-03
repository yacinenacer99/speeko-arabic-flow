import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, session, navigate]);

  if (isLoading) {
    return (
      <>
        <style>{`
          @keyframes mlasoonPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.35; transform: scale(0.85); }
          }
        `}</style>
        <div
          style={{
            minHeight: "100dvh",
            background: "#F5F4F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            direction: "rtl",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#6C63FF",
              animation: "mlasoonPulse 1s ease-in-out infinite",
            }}
          />
        </div>
      </>
    );
  }

  if (!session) return null;
  return <>{children}</>;
};

export default ProtectedRoute;
