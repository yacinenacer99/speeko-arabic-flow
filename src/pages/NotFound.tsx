import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("[MLASOON] 404 route:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "#F5F4F0",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            className="font-cairo"
            style={{ fontSize: 72, fontWeight: 700, color: "#1A1A2E", lineHeight: 1, marginBottom: 16 }}
          >
            404
          </h1>
          <p
            className="font-cairo"
            style={{ fontSize: 18, fontWeight: 300, color: "#1A1A2E", marginBottom: 32 }}
          >
            الصفحة غير موجودة
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="font-cairo"
            style={{
              fontWeight: 700,
              fontSize: 15,
              background: "#6C63FF",
              color: "white",
              border: "none",
              borderRadius: 999,
              padding: "14px 32px",
              cursor: "pointer",
              minHeight: 48,
            }}
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
