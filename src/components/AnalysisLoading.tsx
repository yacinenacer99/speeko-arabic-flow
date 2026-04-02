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
const CIRCLE_SIZE = 120;
const STROKE_WIDTH = 3;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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
          if (onComplete) {
            onComplete();
          } else {
            navigate("/results");
          }
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

  const dashOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
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
      }}
    >
      {/* Blobs */}
      <div
        style={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "#6C63FF",
          filter: "blur(80px)",
          opacity: 0.1,
          top: "15%",
          right: "-5%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "#FF9DC4",
          filter: "blur(80px)",
          opacity: 0.1,
          bottom: "20%",
          left: "-5%",
          pointerEvents: "none",
        }}
      />

      {/* Progress circle */}
      <div style={{ position: "relative", width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
        <svg
          width={CIRCLE_SIZE}
          height={CIRCLE_SIZE}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#2A2A3E"
            strokeWidth={STROKE_WIDTH}
          />
          {/* Progress arc */}
          <circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#6C63FF"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        {/* Percentage number */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="font-cairo font-bold"
            style={{
              fontSize: 32,
              color: "#FFFFFF",
              textShadow: "0 0 20px rgba(108,99,255,0.3)",
            }}
          >
            {displayNum}
          </span>
        </div>
      </div>

      {/* Affirmation */}
      <p
        className="font-cairo font-light"
        style={{
          fontSize: 15,
          color: "#FFFFFF",
          textAlign: "center",
          maxWidth: 280,
          marginTop: 24,
          opacity: affirmationOpacity,
          transition: "opacity 0.4s ease",
        }}
      >
        {affirmation}
      </p>

      {/* Static subtitle */}
      <p
        className="font-cairo font-light"
        style={{
          fontSize: 12,
          color: "#9090A8",
          textAlign: "center",
          marginTop: 16,
        }}
      >
        ملسون يجهّز تحليلك
      </p>
    </div>
  );
};

export default AnalysisLoading;
