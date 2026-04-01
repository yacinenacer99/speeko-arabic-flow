import { useState } from "react";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";

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
    fontSize: 15,
    fontFamily: "Cairo, sans-serif",
    fontWeight: 300,
    background: "hsla(0, 0%, 100%, 0.6)",
    backdropFilter: "blur(10px)",
    color: "hsl(var(--foreground))",
    outline: "none",
    direction: "rtl",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="relative" style={{ background: "hsl(var(--background))", minHeight: "100vh", direction: "rtl", padding: "0 24px" }}>
      <Navbar />
      <div className="blob blob-violet" style={{ width: 250, height: 250, top: "15%", right: "-8%" }} />

      <div className="flex flex-col items-center" style={{ paddingTop: 80, maxWidth: 480, margin: "0 auto" }}>
        <h1 className="font-cairo font-bold text-center" style={{ fontSize: 28, color: "hsl(var(--foreground))", marginBottom: 4 }}>تواصل معنا</h1>
        <p className="font-cairo font-light text-center" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginBottom: 24 }}>نرد في غضون 24 ساعة</p>

        <div className="glass-card-light w-full" style={{ padding: 32 }}>
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
                style={{ ...inputStyle, minHeight: 120, resize: "none" }}
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
                  fontSize: 16,
                  cursor: "pointer",
                  marginTop: 8,
                }}
              >
                أرسل
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
