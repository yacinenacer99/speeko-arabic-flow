import { useState } from "react";
import { ArrowUp, ArrowRight, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import ProGateModal from "@/components/ProGateModal";

const WeeklyReport = () => {
  const [proModal, setProModal] = useState(false);

  return (
    <div style={{ background: "#F5F4F0", minHeight: "100vh", direction: "rtl", paddingBottom: 80 }}>
      <Navbar />
      <ProGateModal open={proModal} onClose={() => setProModal(false)} />

      <div style={{ padding: "80px 24px 24px", maxWidth: 480, margin: "0 auto" }}>
        <h1 className="font-cairo font-bold" style={{ fontSize: 24, color: "#1A1A2E", marginBottom: 4 }}>تقريرك الأسبوعي</h1>
        <p className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8", marginBottom: 24 }}>الأسبوع اللي فات</p>

        {/* Improvement card */}
        <div style={{ background: "white", borderRadius: 20, padding: 24, marginBottom: 24 }}>
          <p className="font-cairo font-bold" style={{ fontSize: 16, color: "#5DBE8A", marginBottom: 16 }}>تحسنت هذا الأسبوع</p>
          {[
            { text: "كلمات الحشو -22%", color: "#5DBE8A" },
            { text: "سرعة الكلام أثبت", color: "#5DBE8A" },
            { text: "نقاط التدفق +8", color: "#5DBE8A" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2" style={{ marginBottom: 10 }}>
              <ArrowUp size={14} color={item.color} />
              <span className="font-cairo font-light" style={{ fontSize: 14, color: "#1A1A2E" }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Focus next week (pro) */}
        <div className="relative" style={{ borderRadius: 20, overflow: "hidden" }}>
          <div style={{ filter: "blur(5px)", padding: 24, background: "white" }}>
            <p className="font-cairo font-bold" style={{ fontSize: 16, color: "#1A1A2E" }}>وش تركز عليه الأسبوع الجاي</p>
            <p className="font-cairo font-light" style={{ fontSize: 14, color: "#9090A8", marginTop: 8 }}>ركز على تقليل فترات السكوت</p>
            <p className="font-cairo font-light" style={{ fontSize: 14, color: "#9090A8", marginTop: 4 }}>حاول تتكلم بدون يعني</p>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Lock size={20} color="#A89CFF" />
            <button
              onClick={() => setProModal(true)}
              className="font-cairo font-bold text-white"
              style={{ background: "#6C63FF", border: "none", borderRadius: 999, padding: "10px 24px", fontSize: 13, cursor: "pointer", boxShadow: "0 0 20px rgba(108,99,255,0.4)" }}
            >
              افتح التحليل الكامل
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default WeeklyReport;
