import { useNavigate, useLocation } from "react-router-dom";

const hiddenPages = ["/challenge", "/onboarding", "/signup", "/login", "/streakLost", "/levelup"];

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (hiddenPages.some(p => location.pathname === p)) return null;

  const linkStyle: React.CSSProperties = {
    fontFamily: "Cairo, sans-serif",
    fontWeight: 300,
    fontSize: 14,
    color: "#9090A8",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "right",
    lineHeight: 2.2,
    padding: 0,
    display: "block",
    transition: "color 0.2s",
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
    <footer style={{ background: "#0F0F14", padding: "48px 24px 32px 24px", direction: "rtl" }}>
      <div className="max-w-[800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {/* Brand */}
          <div>
            <h4 className="font-cairo font-bold" style={{ fontSize: 18, color: "#FFFFFF", marginBottom: 8 }}>ملسون</h4>
            <p className="font-cairo font-light" style={{ fontSize: 13, color: "#9090A8" }}>تدرّب على الكلام بثقة</p>
          </div>

          {/* Pages */}
          <div>
            <h5 style={headingStyle}>الصفحات</h5>
            <LinkButton label="الرئيسية" path="/" />
            <LinkButton label="من نحن" path="/contact" />
            <LinkButton label="المدونة" path="/blog" />
            <LinkButton label="الاشتراك" path="/subscribe" />
          </div>

          {/* More */}
          <div>
            <h5 style={headingStyle}>المزيد</h5>
            <LinkButton label="تواصل معنا" path="/contact" />
            <LinkButton label="الشروط والأحكام" path="/" />
            <LinkButton label="سياسة الخصوصية" path="/" />
          </div>
        </div>

        {/* Divider + Copyright */}
        <div style={{ borderTop: "1px solid #2A2A3E", marginTop: 32, paddingTop: 20 }}>
          <p className="font-cairo font-light text-center" style={{ fontSize: 12, color: "#9090A8" }}>
            © 2026 ملسون. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
