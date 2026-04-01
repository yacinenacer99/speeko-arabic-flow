import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import Navbar from "@/components/Navbar";

const Subscribe = () => {
  const navigate = useNavigate();

  const Feature = ({ text, included }: { text: string; included: boolean }) => (
    <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
      {included ? <Check size={16} color="hsl(var(--success))" /> : <X size={16} color="hsl(var(--muted-foreground))" />}
      <span
        className="font-cairo font-light"
        style={{
          fontSize: 14,
          color: included ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
          textDecoration: included ? "none" : "line-through",
        }}
      >
        {text}
      </span>
    </div>
  );

  return (
    <div className="relative" style={{ background: "hsl(var(--background))", minHeight: "100vh", direction: "rtl", padding: "0 24px", paddingBottom: 40 }}>
      <Navbar />
      <div className="blob blob-violet" style={{ width: 300, height: 300, top: "10%", right: "-10%" }} />
      <div className="blob blob-pink" style={{ width: 250, height: 250, bottom: "10%", left: "-5%" }} />

      <div style={{ paddingTop: 80, maxWidth: 400, margin: "0 auto" }}>
        <h1 className="font-cairo font-bold text-center" style={{ fontSize: 28, color: "hsl(var(--foreground))", marginBottom: 8 }}>ارتقِ بكلامك</h1>
        <p className="font-cairo font-light text-center" style={{ fontSize: 16, color: "hsl(var(--muted-foreground))", marginBottom: 32 }}>افتح كل قوة ملسون</p>

        {/* Free card */}
        <div className="glass-card-light" style={{ padding: 24, marginBottom: 16 }}>
          <p className="font-cairo font-bold" style={{ fontSize: 20, color: "hsl(var(--foreground))" }}>مجاني</p>
          <p className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginBottom: 16 }}>للأبد</p>
          <Feature text="جلسات غير محدودة" included />
          <Feature text="مقاييس أساسية" included />
          <Feature text="مسار التعلم كامل" included />
          <Feature text="XP وسترك وشارات" included />
          <Feature text="تحليل كامل" included={false} />
          <Feature text="تقرير أسبوعي" included={false} />
        </div>

        {/* Pro card */}
        <div
          className="glass-card-light"
          style={{
            padding: 24,
            border: "2px solid hsl(var(--primary))",
            boxShadow: "0 0 40px rgba(108,99,255,0.15), 0 8px 32px rgba(0, 0, 0, 0.06)",
          }}
        >
          <p className="font-cairo font-bold" style={{ fontSize: 20, color: "hsl(var(--foreground))" }}>برو</p>
          <div className="flex items-baseline gap-1" style={{ marginBottom: 4 }}>
            <span className="font-cairo font-bold" style={{ fontSize: 32, color: "hsl(var(--primary))" }}>9$</span>
            <span className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>/ شهر</span>
          </div>
          <p className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginBottom: 16 }}>إلغاء في أي وقت</p>
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
              background: "hsl(var(--primary))",
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
