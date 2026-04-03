import { useState } from "react";
import { ArrowUp, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProGateModal from "@/components/ProGateModal";
import BackButton from "@/components/BackButton";

const WeeklyReport = () => {
  const [proModal, setProModal] = useState(false);

  return (
    <div className="relative" style={{ background: "hsl(var(--background))", minHeight: "100dvh", direction: "rtl", paddingBottom: 80 }}>
      <Navbar />
      <BackButton variant="light" />
      <ProGateModal open={proModal} onClose={() => setProModal(false)} />
      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "10%", right: "-8%" }} />

      <div className="page-narrow" style={{ paddingTop: 80 }}>
        <h1 className="font-cairo font-bold" style={{ fontSize: 24, color: "hsl(var(--foreground))", marginBottom: 4 }}>تقريرك الأسبوعي</h1>
        <p className="font-cairo font-light" style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginBottom: 24 }}>الأسبوع اللي فات</p>

        <div className="glass-card-light" style={{ padding: 24, marginBottom: 24 }}>
          <p className="font-cairo font-bold" style={{ fontSize: 16, color: "hsl(var(--success))", marginBottom: 16 }}>تحسنت هذا الأسبوع</p>
          {[
            { text: "كلمات الحشو -22%" },
            { text: "سرعة الكلام أثبت" },
            { text: "نقاط التدفق +8" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2" style={{ marginBottom: 10 }}>
              <ArrowUp size={14} color="hsl(var(--success))" />
              <span className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--foreground))" }}>{item.text}</span>
            </div>
          ))}
        </div>

        <div className="relative" style={{ borderRadius: 20, overflow: "hidden" }}>
          <div className="glass-card-light" style={{ filter: "blur(5px)", padding: 24 }}>
            <p className="font-cairo font-bold" style={{ fontSize: 16, color: "hsl(var(--foreground))" }}>وش تركز عليه الأسبوع الجاي</p>
            <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginTop: 8 }}>ركز على تقليل فترات السكوت</p>
            <p className="font-cairo font-light" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>حاول تتكلم بدون يعني</p>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Lock size={20} color="hsl(var(--primary-soft))" />
            <button
              onClick={() => setProModal(true)}
              className="font-cairo font-bold text-white"
              style={{ background: "hsl(var(--primary))", border: "none", borderRadius: 999, padding: "10px 24px", fontSize: 13, cursor: "pointer", boxShadow: "0 0 20px rgba(108,99,255,0.4)", minHeight: 44 }}
            >
              افتح التحليل الكامل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
