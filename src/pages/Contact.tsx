import { useState } from "react";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid hsl(var(--border))",
    borderRadius: 12,
    padding: "14px 16px",
    fontSize: 16,
    fontFamily: "Cairo, sans-serif",
    fontWeight: 300,
    background: "hsla(0, 0%, 100%, 0.6)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    color: "hsl(var(--foreground))",
    outline: "none",
    direction: "rtl",
    height: 48,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="relative" style={{ background: "hsl(var(--background))", minHeight: "100dvh", direction: "rtl" }}>
      <Navbar />
      <BackButton variant="light" />
      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "15%", right: "-8%" }} />

      <div className="page-narrow" style={{ paddingTop: 80 }}>
        <h1 className="font-cairo font-bold text-center" style={{ fontSize: 24, color: "hsl(var(--foreground))", marginBottom: 4 }}>تواصل معنا</h1>
        <p className="font-cairo font-light text-center" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginBottom: 24 }}>نرد في غضون 24 ساعة</p>

        <div className="glass-card-light contact-card" style={{ padding: "24px 20px" }}>
          {sent ? (
            <div className="flex flex-col items-center py-8">
              <div
                className="flex items-center justify-center"
                style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(93,190,138,0.15)", marginBottom: 16 }}
              >
                <Check size={24} color="hsl(var(--success))" />
              </div>
              <p className="font-cairo font-bold" style={{ fontSize: 18, color: "hsl(var(--foreground))" }}>تم الإرسال، شكراً!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input style={inputStyle} placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
              <input style={inputStyle} placeholder="البريد الإلكتروني" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <textarea
                style={{ ...inputStyle, minHeight: 120, resize: "none", height: "auto" }}
                placeholder="رسالتك"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                className="font-cairo font-bold text-white w-full"
                style={{
                  background: "hsl(var(--primary))",
                  border: "none",
                  borderRadius: 999,
                  padding: "14px 0",
                  fontSize: 15,
                  cursor: "pointer",
                  marginTop: 8,
                  height: 50,
                }}
              >
                أرسل
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .contact-card { padding: 32px 28px !important; }
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default Contact;
