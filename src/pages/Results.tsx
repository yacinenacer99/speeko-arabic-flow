import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  HelpCircle,
  Clock,
  MessageSquare,
  Gauge,
  AlertCircle,
  PauseCircle,
  XCircle,
  Sparkles,
  CheckSquare,
  Zap,
  Target,
  ChevronLeft,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TOOLTIP_CONTENT: Record<string, string> = {
  المدة: "مدة حديثك الفعلي مقارنة بوقت الجلسة الكامل",
  الكلمات: "عدد الكلمات اللي قلتها خلال الجلسة",
  السرعة: "معدل كلماتك في الدقيقة — المثالي بين 110 و 150",
  الحشو: "الكلمات اللي تعبئ الفراغ بدون معنى مثل يعني وبصراحة",
  "أطول توقف": "أطول فترة سكوت خلال حديثك — فوق 3 ثواني يأثر على انسيابيتك",
  الممنوعة: "عدد الكلمات الممنوعة اللي استخدمتها في هذا التحدي",
};

const METRICS = [
  { icon: Clock, dot: "hsl(var(--success))", label: "المدة", value: "0:58 / 1:00" },
  { icon: MessageSquare, dot: "hsl(var(--success))", label: "الكلمات", value: "127 كلمة" },
  { icon: Gauge, dot: "hsl(var(--success))", label: "السرعة", value: "128 ك/د" },
  { icon: AlertCircle, dot: "hsl(var(--warning))", label: "الحشو", value: "4" },
  { icon: PauseCircle, dot: "hsl(var(--warning))", label: "أطول توقف", value: "3.2 ث" },
  { icon: XCircle, dot: "hsl(var(--danger))", label: "الممنوعة", value: "2 كلمات" },
];

const COACHING = [
  {
    title: "وش سويت صح",
    Icon: CheckSquare,
    bg: "rgba(93,190,138,0.15)",
    color: "#5DBE8A",
  },
  {
    title: "وين تعثرت",
    Icon: Zap,
    bg: "rgba(245,158,11,0.15)",
    color: "#F59E0B",
  },
  {
    title: "وش تركز عليه الجلسة الجاية",
    Icon: Target,
    bg: "rgba(255,107,107,0.15)",
    color: "#FF6B6B",
  },
];

const Results = () => {
  const navigate = useNavigate();
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [expandedCoach, setExpandedCoach] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (openTooltip) {
        const target = e.target as HTMLElement;
        if (!target.closest("[data-tooltip-trigger]")) {
          setOpenTooltip(null);
        }
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openTooltip]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        minHeight: "100dvh",
        backgroundColor: "hsl(var(--background))",
        direction: "rtl",
        paddingBottom: 120,
      }}
    >
      <Navbar />

      {/* Atmospheric blobs */}
      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "5%", right: "-10%" }} />
      <div className="blob blob-blue" style={{ width: 200, height: 200, bottom: "30%", left: "-8%" }} />

      <div className="page-narrow">
        {/* Nav bar */}
        <div style={{ paddingTop: 80, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => navigate(-1)}
            className="font-cairo"
            style={{
              background: "none",
              border: "none",
              color: "hsl(var(--muted-foreground))",
              fontSize: 13,
              fontWeight: 300,
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
              minHeight: 44,
            }}
          >
            رجوع
            <ArrowRight size={14} color="hsl(var(--muted-foreground))" />
          </button>
        </div>

        {/* Top section */}
        <div style={{ textAlign: "center", paddingTop: 24 }}>
          <p
            className="font-cairo"
            style={{ fontSize: 13, fontWeight: 300, color: "hsl(var(--muted-foreground))", marginBottom: 16 }}
          >
            السؤال · قدم نفسك في مقابلة عمل
          </p>
          <div style={{ marginBottom: 8 }}>
            <span
              className="font-cairo results-score"
              style={{ fontSize: 48, fontWeight: 700, color: "hsl(var(--primary-soft))", lineHeight: 1 }}
            >
              74
            </span>
            <span
              className="font-cairo"
              style={{ fontSize: 18, fontWeight: 300, color: "hsl(var(--muted-foreground))" }}
            >
              /100
            </span>
          </div>
          <p
            className="font-cairo"
            style={{ fontSize: 14, fontWeight: 300, color: "hsl(var(--muted-foreground))", marginBottom: 28 }}
          >
            جلسة ممتازة — في طريقك للتقدم
          </p>
        </div>

        {/* Metric Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {METRICS.map((m) => {
            const IconComp = m.icon;
            return (
              <div key={m.label} className="glass-card-light" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10, minHeight: 100 }}>
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <IconComp size={15} color="hsl(var(--muted-foreground))" />
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: m.dot, flexShrink: 0 }} />
                </div>
                {/* Label with tooltip */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, position: "relative" }}>
                  <span className="font-cairo" style={{ fontSize: 11, fontWeight: 300, color: "hsl(var(--muted-foreground))" }}>
                    {m.label}
                  </span>
                  <div
                    data-tooltip-trigger
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenTooltip(openTooltip === m.label ? null : m.label);
                    }}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center", minHeight: 44, minWidth: 44, justifyContent: "center" }}
                  >
                    <HelpCircle size={13} color="hsl(var(--muted-foreground))" />
                  </div>
                  {/* Tooltip */}
                  <div
                    className="glass-card-dark"
                    style={{
                      position: "absolute",
                      bottom: "calc(100% + 8px)",
                      right: 0,
                      padding: "10px 14px",
                      maxWidth: 200,
                      zIndex: 50,
                      opacity: openTooltip === m.label ? 1 : 0,
                      transform: openTooltip === m.label ? "translateY(0)" : "translateY(4px)",
                      transition: "opacity 0.2s ease, transform 0.2s ease",
                      pointerEvents: openTooltip === m.label ? "auto" : "none",
                      borderRadius: 12,
                    }}
                  >
                    <p className="font-cairo" style={{ fontSize: 12, fontWeight: 300, color: "white", lineHeight: 1.5, margin: 0 }}>
                      {TOOLTIP_CONTENT[m.label]}
                    </p>
                  </div>
                </div>
                {/* Value */}
                <span className="font-cairo results-metric-value" style={{ fontSize: 20, fontWeight: 700, color: "hsl(var(--foreground))" }}>
                  {m.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Coaching Notes */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "28px 0 12px" }}>
          <Sparkles size={18} color="hsl(var(--primary-soft))" />
          <span className="font-cairo" style={{ fontSize: 17, fontWeight: 700, color: "hsl(var(--foreground))" }}>
            ملاحظات المدرب
          </span>
        </div>

        {COACHING.map((item, idx) => {
          const isOpen = expandedCoach === idx;
          return (
            <div key={idx} className="glass-card-light" style={{ marginBottom: 10, overflow: "hidden", padding: 0 }}>
              {/* Header */}
              <button
                onClick={() => setExpandedCoach(isOpen ? null : idx)}
                className="font-cairo"
                style={{
                  width: "100%",
                  padding: "18px 16px",
                  background: "none",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                  minHeight: 44,
                }}
              >
                <div
                  style={{
                    background: item.bg,
                    padding: 8,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <item.Icon size={18} color={item.color} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: "hsl(var(--foreground))", flex: 1, textAlign: "right" }}>
                  {item.title}
                </span>
                <ChevronLeft
                  size={18}
                  color="hsl(var(--muted-foreground))"
                  style={{
                    transform: isOpen ? "rotate(-90deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    flexShrink: 0,
                  }}
                />
              </button>
              {/* Content */}
              <div style={{ maxHeight: isOpen ? 200 : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
                <div style={{ padding: "0 16px 18px", position: "relative" }}>
                  <div style={{ filter: "blur(5px)", pointerEvents: "none" }}>
                    <p className="font-cairo" style={{ fontSize: 13, fontWeight: 300, color: "hsl(var(--muted-foreground))", lineHeight: 1.8, margin: 0 }}>
                      أداؤك في بداية الجلسة كان ممتاز وبدأت بثقة واضحة
                    </p>
                    <p className="font-cairo" style={{ fontSize: 13, fontWeight: 300, color: "hsl(var(--muted-foreground))", lineHeight: 1.8, margin: 0 }}>
                      استخدمت أمثلة جيدة ومناسبة للموضوع
                    </p>
                    <p className="font-cairo" style={{ fontSize: 13, fontWeight: 300, color: "hsl(var(--muted-foreground))", lineHeight: 1.8, margin: 0 }}>
                      سرعة كلامك كانت مناسبة ومريحة للمستمع
                    </p>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <Lock size={20} color="hsl(var(--primary-soft))" />
                    <button
                      onClick={() => navigate("/subscribe")}
                      className="font-cairo"
                      style={{
                        background: "hsl(var(--primary))",
                        color: "white",
                        fontSize: 13,
                        fontWeight: 700,
                        border: "none",
                        borderRadius: 999,
                        padding: "10px 24px",
                        cursor: "pointer",
                        boxShadow: "0 0 20px rgba(108,99,255,0.4)",
                        minHeight: 44,
                      }}
                    >
                      افتح التحليل الكامل
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed bottom bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(to top, hsl(40 14% 95%) 60%, transparent)",
          padding: "16px var(--page-padding-mobile)",
          paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
          zIndex: 100,
        }}
      >
        <button
          onClick={() => navigate("/onboarding")}
          className="font-cairo"
          style={{
            width: "100%",
            maxWidth: 400,
            margin: "0 auto",
            display: "block",
            background: "hsl(var(--primary))",
            color: "white",
            fontSize: 15,
            fontWeight: 700,
            borderRadius: 999,
            padding: "16px 0",
            border: "none",
            cursor: "pointer",
            height: 52,
          }}
        >
          ابدأ خطة التعلم
        </button>
      </div>
      <div style={{ height: 100 }} />
      <Footer />

      <style>{`
        @media (min-width: 1024px) {
          .results-score { font-size: 72px !important; }
          .results-metric-value { font-size: 24px !important; }
        }
      `}</style>
    </div>
  );
};

export default Results;
