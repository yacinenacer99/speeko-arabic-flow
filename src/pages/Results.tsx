import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";

const TOOLTIP_CONTENT: Record<string, string> = {
  "سرعة الكلام": "معدل كلماتك في الدقيقة — المثالي بين 110 و 150",
  "كلمات الحشو": "الكلمات اللي تعبئ الفراغ بدون معنى مثل يعني وبصراحة",
  "الكلمات الممنوعة": "عدد الكلمات الممنوعة اللي استخدمتها في هذا التحدي",
  "فترات الصمت": "أطول فترة سكوت خلال حديثك — فوق 3 ثواني يأثر على انسيابيتك",
};

const Results = () => {
  const navigate = useNavigate();
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (openTooltip && containerRef.current) {
        const target = e.target as HTMLElement;
        if (!target.closest("[data-tooltip-trigger]")) {
          setOpenTooltip(null);
        }
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openTooltip]);

  const metrics = [
    {
      icon: "🎙️",
      label: "سرعة الكلام",
      value: "متوسط",
      detail: "١٢٠ كلمة/دقيقة",
    },
    {
      icon: "🔴",
      label: "كلمات الحشو",
      value: "يعني × 3",
      detail: "أقل من المتوسط — أداء جيد",
    },
    {
      icon: "🚫",
      label: "الكلمات الممنوعة",
      value: "استخدمت 2 من 5",
      detail: "حاول تجنب المزيد في المرة القادمة",
    },
    {
      icon: "⏱️",
      label: "فترات الصمت",
      value: "3 مرات",
      detail: "حاول تقليل التوقف الطويل",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#0F0F14",
        direction: "rtl",
        padding: "70px 24px 40px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Header */}
        <p
          className="font-cairo font-bold text-white text-center"
          style={{ fontSize: 24, marginBottom: 8 }}
        >
          التحليل الكامل
        </p>
        <p
          className="font-cairo font-light text-center"
          style={{ fontSize: 14, color: "#9090A8", marginBottom: 32 }}
        >
          إليك تفاصيل أدائك في هذه الجلسة
        </p>

        {/* Flow Score Hero */}
        <div
          className="flex flex-col items-center"
          style={{
            background: "#1A1A28",
            border: "1px solid #2A2A3E",
            borderRadius: 24,
            padding: "28px 24px",
            marginBottom: 16,
          }}
        >
          <span
            className="font-cairo font-bold"
            style={{ fontSize: 48, color: "#A89CFF" }}
          >
            74
          </span>
          <span
            className="font-cairo font-light"
            style={{ fontSize: 14, color: "#9090A8", marginTop: 4 }}
          >
            نقاط التدفق
          </span>
          <div
            style={{
              width: "100%",
              height: 6,
              background: "#2A2A3E",
              borderRadius: 999,
              marginTop: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "74%",
                height: "100%",
                background: "linear-gradient(90deg, #6C63FF, #A89CFF)",
                borderRadius: 999,
              }}
            />
          </div>
        </div>

        {/* Metric Cards */}
        <div className="flex flex-col" style={{ gap: 10, marginBottom: 32 }}>
          {metrics.map((m) => (
            <div
              key={m.label}
              style={{
                background: "#1A1A28",
                border: "1px solid #2A2A3E",
                borderRadius: 20,
                padding: "20px 24px",
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{m.icon}</span>
                  <div className="flex items-center" style={{ gap: 4, position: "relative" }}>
                    <span
                      className="font-cairo font-light"
                      style={{ fontSize: 14, color: "#9090A8" }}
                    >
                      {m.label}
                    </span>
                    <div
                      data-tooltip-trigger
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenTooltip(openTooltip === m.label ? null : m.label);
                      }}
                      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                    >
                      <HelpCircle size={13} color="#9090A8" />
                    </div>
                    {/* Tooltip */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "calc(100% + 8px)",
                        right: 0,
                        background: "#2A2A3E",
                        border: "1px solid #3A3A4E",
                        borderRadius: 12,
                        padding: "10px 14px",
                        maxWidth: 200,
                        zIndex: 50,
                        opacity: openTooltip === m.label ? 1 : 0,
                        transform: openTooltip === m.label ? "translateY(0)" : "translateY(4px)",
                        transition: "opacity 0.2s ease, transform 0.2s ease",
                        pointerEvents: openTooltip === m.label ? "auto" : "none",
                      }}
                    >
                      <p
                        className="font-cairo font-light"
                        style={{ fontSize: 12, color: "white", lineHeight: 1.5, margin: 0 }}
                      >
                        {TOOLTIP_CONTENT[m.label]}
                      </p>
                    </div>
                  </div>
                </div>
                <span className="font-cairo font-bold text-white" style={{ fontSize: 14 }}>
                  {m.value}
                </span>
              </div>
              <p
                className="font-cairo font-light"
                style={{ fontSize: 12, color: "#6B6B80", paddingRight: 32 }}
              >
                {m.detail}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/onboarding")}
          className="font-cairo font-bold text-[16px] w-full"
          style={{
            background: "white",
            color: "#0F0F14",
            borderRadius: 999,
            padding: "18px 0",
            border: "none",
            cursor: "pointer",
            maxWidth: 320,
            margin: "0 auto",
            display: "block",
          }}
        >
          علمني كيف أسولف
        </button>
        <p
          className="font-cairo font-light text-center"
          style={{ fontSize: 11, color: "#9090A8", marginTop: 8 }}
        >
          مجاناً — لا تحتاج حساب
        </p>
      </div>
    </div>
  );
};

export default Results;
