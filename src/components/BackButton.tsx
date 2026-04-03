import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  variant?: "light" | "dark";
}

const BackButton = ({ variant = "light" }: BackButtonProps) => {
  const navigate = useNavigate();
  const iconColor = variant === "dark" ? "#FFFFFF" : "#1A1A2E";

  const onBack = () => {
    if (window.history.length <= 1) {
      navigate("/home");
      return;
    }
    navigate(-1);
  };

  return (
    <button
      type="button"
      aria-label="رجوع"
      onClick={onBack}
      style={{
        position: "fixed",
        top: 60,
        right: 20,
        zIndex: 100,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        opacity: 0.7,
        transition: "opacity 0.2s ease",
        minWidth: 44,
        minHeight: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "0.7";
      }}
    >
      <ArrowRight size={20} color={iconColor} />
    </button>
  );
};

export default BackButton;
