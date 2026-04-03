import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";

const PrivacyPolicy = () => {
  return (
    <div style={{ minHeight: "100dvh", background: "#0F0F14", direction: "rtl" }}>
      <Navbar />
      <BackButton variant="dark" />
      <div className="page-narrow" style={{ paddingTop: 88, paddingBottom: 48, paddingLeft: "var(--page-padding-mobile)", paddingRight: "var(--page-padding-mobile)" }}>
        <h1 className="font-cairo font-bold" style={{ fontSize: 24, color: "#FFFFFF", marginBottom: 20, textAlign: "right" }}>
          سياسة الخصوصية
        </h1>
        <div style={{ maxWidth: 640, marginRight: "auto" }}>
          <p className="font-cairo font-light" style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: 16, textAlign: "right" }}>
            نلتزم بحماية بياناتك. تُخزَّن معلومات حسابك وتقدّمك بأمان على خوادمنا، ولا نشاركها مع أطراف ثالثة لأغراض تسويقية.
          </p>
          <p className="font-cairo font-light" style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: 16, textAlign: "right" }}>
            تسجيل الصوت يُعالَج لتحليل أدائك ضمن التطبيق فقط، وفق ما تحتاجه الخدمة.
          </p>
          <p className="font-cairo font-light" style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.8, textAlign: "right" }}>
            لأي استفسار يخص الخصوصية، يمكنك التواصل معنا من صفحة «تواصل معنا».
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
