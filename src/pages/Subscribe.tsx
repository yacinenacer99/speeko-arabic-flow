import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import Navbar from "@/components/Navbar";

const Subscribe = () => {
  const navigate = useNavigate();

  const Feature = ({ text, included }: { text: string; included: boolean }) => (
    <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
      {included ? <Check size={16} color="#5DBE8A" /> : <X size={16} color="#9090A8" />}
      <span
        className="font-cairo font-light"
        style={{
          fontSize: 14,
          color: included ? "#1A1A2E" : "#9090A8",
          textDecoration: included ? "none" : "line-through",
        }}
      >
        {text}
      </span>
    </div>
  );

  return (
    <div style={{ background: "#F5F4F0", minHeight: "100vh", direction: "rtl", padding: "0 24px", paddingBottom: 40 }}>
      <Navbar />

      <div style={{ paddingTop: 80, maxWidth: 400, margin: "0 auto" }}>
        <h1 className="font-cairo font-bold text-center" style={{ fontSize: 28, color: "#1A1A2E", marginBottom: 8 }}>ارتقِ بكلامك</h1>
        <p className="font-cairo font-light text-center" style={{ fontSize: 16, color: "#9090A8", marginBottom: 32 }}>افتح كل قوة ملسون</p>

        {/* Free card */}
        <div style={{ border: "1px solid #E8E6F0", borderRadius: 20, padding: 24, background: "white", marginBottom: 16 }}>
          <p className="font-cairo font-bold" style={{ fontSize: 20, color: "#1A1A2E" }}>مجاني</p>
          <p className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8", marginBottom: 16 }}>للأبد</p>
          <Feature text="جلسات غير محدودة" included />
          <Feature text="مقاييس أساسية" included />
          <Feature text="مسار التعلم كامل" included />
          <Feature text="XP وسترك وشارات" included />
          <Feature text="تحليل كامل" included={false} />
          <Feature text="تقرير أسبوعي" included={false} />
        </div>

        {/* Pro card */}
        <div style={{ border: "2px solid #6C63FF", borderRadius: 20, padding: 24, background: "rgba(108,99,255,0.03)" }}>
          <p className="font-cairo font-bold" style={{ fontSize: 20, color: "#1A1A2E" }}>برو</p>
          <div className="flex items-baseline gap-1" style={{ marginBottom: 4 }}>
            <span className="font-cairo font-bold" style={{ fontSize: 32, color: "#6C63FF" }}>9$</span>
            <span className="font-cairo font-light" style={{ fontSize: 14, color: "#9090A8" }}>/ شهر</span>
          </div>
          <p className="font-cairo font-light" style={{ fontSize: 12, color: "#9090A8", marginBottom: 16 }}>إلغاء في أي وقت</p>
          <Feature text="كل ميزات المجاني" included />
          <Feature text="تحليل كامل بعد كل جلسة" included />
          <Feature text="تشخيص نقاط الضعف" included />
          <Feature text="تقرير أسبوعي مخصص" included />
          <Feature text="مراحل متقدمة 4-6" included />
          <Feature text="تاريخ الجلسات كامل" included />

          <button
            onClick={() => navigate("/success")}
            className="font-cairo font-bold text-white w-full"
            style={{
              background: "#6C63FF",
              border: "none",
              borderRadius: 999,
              padding: "16px 0",
              fontSize: 16,
              cursor: "pointer",
              marginTop: 16,
            }}
          >
            اشترك الآن
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
