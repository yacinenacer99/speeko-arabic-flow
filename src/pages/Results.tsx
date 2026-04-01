import { useNavigate } from "react-router-dom";

const Results = () => {
  const navigate = useNavigate();

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
                  <span
                    className="font-cairo font-light"
                    style={{ fontSize: 14, color: "#9090A8" }}
                  >
                    {m.label}
                  </span>
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
