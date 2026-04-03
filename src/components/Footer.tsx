import { useNavigate, useLocation } from "react-router-dom";

const hiddenPages = ["/challenge", "/onboarding", "/login", "/streak-lost", "/level-up"];

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (hiddenPages.some(p => location.pathname === p)) return null;

  const linkStyle: React.CSSProperties = {
    fontFamily: "Cairo, sans-serif",
    fontWeight: 300,
    fontSize: 13,
    color: "#9090A8",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "right",
    lineHeight: 2.2,
    padding: 0,
    display: "block",
    transition: "color 0.2s",
    minHeight: 44,
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: "Cairo, sans-serif",
    fontWeight: 700,
    fontSize: 13,
    color: "#9090A8",
    marginBottom: 12,
  };

  const LinkButton = ({ label, path }: { label: string; path: string }) => (
    <button
      onClick={() => navigate(path)}
      style={linkStyle}
      onMouseEnter={e => { e.currentTarget.style.color = "#FFFFFF"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "#9090A8"; }}
    >
      {label}
    </button>
  );

  return (
    <footer className="footer-responsive" style={{ background: "#0F0F14", padding: "32px 16px 24px", direction: "rtl" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div className="footer-grid">
          <div>
            <h4 className="font-cairo font-bold" style={{ fontSize: 18, color: "#FFFFFF", marginBottom: 8 }}>ملسون</h4>
            <p className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8" }}>تدرّب على الكلام بثقة</p>
          </div>
          <div>
            <h5 style={headingStyle}>الصفحات</h5>
            <LinkButton label="الرئيسية" path="/" />
            <LinkButton label="من نحن" path="/contact" />
            <LinkButton label="المدونة" path="/blog" />
            <LinkButton label="الاشتراك" path="/subscribe" />
          </div>
          <div>
            <h5 style={headingStyle}>المزيد</h5>
            <LinkButton label="تواصل معنا" path="/contact" />
            <LinkButton label="سياسة الخصوصية" path="/privacy" />
          </div>
        </div>
        <div style={{ borderTop: "1px solid #2A2A3E", marginTop: 32, paddingTop: 20 }}>
          <p className="font-cairo font-light text-center" style={{ fontSize: 11, color: "#9090A8" }}>
            © 2026 ملسون. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .footer-responsive { padding: 40px 32px !important; }
          .footer-grid {
            flex-direction: row;
            gap: 40px;
          }
          .footer-grid > div { flex: 1; }
        }
        @media (min-width: 1024px) {
          .footer-responsive { padding: 48px 24px 32px !important; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
