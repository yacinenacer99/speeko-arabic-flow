import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AFFIRMATIONS = [
  { max: 20, text: "نحلل أداءك..." },
  { max: 40, text: "كل جلسة تقرّبك من هدفك" },
  { max: 60, text: "نقيّم طلاقتك وانسيابيتك" },
  { max: 80, text: "الثقة تُبنى بالتكرار" },
  { max: 99, text: "جاهز تشوف نتيجتك؟" },
];

const DURATION = 4000;
const HOLD = 500;

interface AnalysisLoadingProps {
  onComplete?: () => void;
}

const AnalysisLoading = ({ onComplete }: AnalysisLoadingProps) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [affirmation, setAffirmation] = useState(AFFIRMATIONS[0].text);
  const [affirmationOpacity, setAffirmationOpacity] = useState(1);
  const startRef = useRef(0);
  const rafRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        setTimeout(() => {
          if (onComplete) onComplete();
          else navigate("/results");
        }, HOLD);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [navigate, onComplete]);

  useEffect(() => {
    const current = AFFIRMATIONS.find((a) => progress <= a.max);
    const newText = current?.text || AFFIRMATIONS[AFFIRMATIONS.length - 1].text;
    if (newText !== affirmation) {
      setAffirmationOpacity(0);
      const timeout = setTimeout(() => {
        setAffirmation(newText);
        setAffirmationOpacity(1);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [progress, affirmation]);

  const displayNum = Math.floor(progress);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        backgroundColor: "#0F0F14",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        direction: "rtl",
        minHeight: "100dvh",
        padding: "0 24px",
      }}
    >
      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "15%", right: "-5%" }} />
      <div className="blob blob-pink" style={{ width: 200, height: 200, bottom: "20%", left: "-5%" }} />

      <div className="flex items-baseline" style={{ gap: 4 }}>
        <span
          className="font-cairo font-bold loading-percent"
          style={{
            fontSize: 64,
            background: "linear-gradient(135deg, #FF9DC4, #C4A8FF, #6C63FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 30px rgba(108,99,255,0.3))",
          }}
        >
          {displayNum}
        </span>
        <span className="font-cairo font-light" style={{ fontSize: 24, color: "#9090A8" }}>%</span>
      </div>

      <p
        className="font-cairo font-light"
        style={{
          fontSize: 14,
          color: "#FFFFFF",
          textAlign: "center",
          maxWidth: 260,
          marginTop: 24,
          opacity: affirmationOpacity,
          transition: "opacity 0.4s ease",
        }}
      >
        {affirmation}
      </p>

      <p className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8", textAlign: "center", marginTop: 16 }}>
        ملسون يجهّز تحليلك
      </p>

      <style>{`
        @media (min-width: 1024px) {
          .loading-percent { font-size: 80px !important; }
        }
      `}</style>
    </div>
  );
};

export default AnalysisLoading;
