import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProGateModalProps {
  open: boolean;
  onClose: () => void;
}

const ProGateModal = ({ open, onClose }: ProGateModalProps) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center text-center"
        style={{
          background: "#1A1A28",
          borderRadius: 24,
          padding: 32,
          maxWidth: 340,
          width: "calc(100% - 48px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Lock size={32} color="#A89CFF" />
        <p className="font-cairo font-bold text-white" style={{ fontSize: 20, marginTop: 16 }}>
          هذه الميزة للمشتركين
        </p>
        <p className="font-cairo font-light" style={{ fontSize: 14, color: "#9090A8", marginTop: 8, marginBottom: 24 }}>
          اشترك في برو للوصول إلى التحليل الكامل والتقارير الأسبوعية
        </p>
        <button
          onClick={() => navigate("/subscribe")}
          className="font-cairo font-bold text-white w-full"
          style={{
            background: "#6C63FF",
            border: "none",
            borderRadius: 999,
            padding: "14px 0",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          افتح برو — 9$ / شهر
        </button>
        <button
          onClick={onClose}
          className="font-cairo font-light"
          style={{
            background: "none",
            border: "none",
            color: "#9090A8",
            fontSize: 13,
            marginTop: 16,
            cursor: "pointer",
          }}
        >
          لا شكراً
        </button>
      </div>
    </div>
  );
};

export default ProGateModal;
