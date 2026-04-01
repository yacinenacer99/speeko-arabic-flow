const Footer = () => {
  return (
    <footer className="bg-surface-dark">
      <div className="max-w-[680px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Logo column */}
          <div>
            <h4 className="text-xl font-bold font-cairo text-primary-foreground mb-2">ملسون</h4>
            <p className="text-sm font-light font-cairo text-muted-foreground">تدرب على صوتك كل يوم</p>
          </div>

          {/* Links column */}
          <div>
            <h5 className="text-sm font-bold font-cairo text-primary-foreground mb-4">روابط</h5>
            <ul className="space-y-2">
              {["الرئيسية", "مسار التعلم", "ابدأ مجاناً"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm font-light font-cairo text-primary-foreground/70 hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h5 className="text-sm font-bold font-cairo text-primary-foreground mb-4">تواصل</h5>
            <ul className="space-y-2">
              {["تواصل معنا", "سياسة الخصوصية", "الشروط والأحكام"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm font-light font-cairo text-primary-foreground/70 hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-[hsl(240_12%_15%)] pt-6">
          <p className="text-center text-xs font-light font-cairo text-muted-foreground">
            © 2025 ملسون. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
