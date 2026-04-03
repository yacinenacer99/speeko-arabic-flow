import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";

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
    <div className="relative" style={{ background: "hsl(var(--background))", minHeight: "100dvh", direction: "rtl", paddingBottom: 40 }}>
      <Navbar />
      <BackButton variant="light" />
      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "10%", right: "-10%" }} />
      <div className="blob blob-pink" style={{ width: 200, height: 200, bottom: "10%", left: "-5%" }} />

      <div className="page-narrow" style={{ paddingTop: 80 }}>
        <h1 className="font-cairo font-bold text-center" style={{ fontSize: 24, color: "hsl(var(--foreground))", marginBottom: 8 }}>ارتقِ بكلامك</h1>
        <p className="font-cairo font-light text-center" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginBottom: 32 }}>افتح كل قوة ملسون</p>

        <div className="subscribe-cards">
          {/* Free card */}
          <div className="glass-card-light subscribe-card" style={{ padding: 24, marginBottom: 16 }}>
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
            className="glass-card-light subscribe-card"
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
                fontSize: 15,
                cursor: "pointer",
                marginTop: 16,
                height: 50,
              }}
            >
              اشترك الآن
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .subscribe-cards {
            display: flex;
            gap: 20px;
            max-width: 700px;
            margin: 0 auto;
          }
          .subscribe-card {
            flex: 1;
            margin-bottom: 0 !important;
          }
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default Subscribe;
