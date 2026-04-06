import { Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";

const articles = [
  {
    category: "مهارات",
    title: "كيف تتحدث بثقة في الاجتماعات",
    excerpt: "تعلم تقنيات بسيطة تخليك تتكلم بثقة وتوصل أفكارك بوضوح في أي اجتماع.",
    date: "25 مارس 2026",
    readTime: "4 دقائق",
  },
  {
    category: "نصائح",
    title: "5 تقنيات لتقليل كلمات الحشو",
    excerpt: "كلمات مثل يعني وبصراحة تضعف كلامك — إليك كيف تتخلص منها بخطوات عملية.",
    date: "22 مارس 2026",
    readTime: "3 دقائق",
  },
  {
    category: "تحفيز",
    title: "لماذا التدريب اليومي يغير كل شيء",
    excerpt: "الفرق بين اللي يتحسن واللي يراوح مكانه هو الالتزام — وملسون يساعدك.",
    date: "18 مارس 2026",
    readTime: "5 دقائق",
  },
];

const Blog = () => {
  return (
    <div className="relative" style={{ background: "hsl(var(--background))", minHeight: "100dvh", direction: "rtl" }}>
      <Navbar />
      <BackButton variant="light" />
      <div className="blob blob-violet" style={{ width: 200, height: 200, top: "10%", right: "-8%" }} />

      <div className="page-narrow" style={{ paddingTop: 80, paddingBottom: 40 }}>
        <h1 className="font-cairo font-bold" style={{ fontSize: 24, color: "hsl(var(--foreground))", marginBottom: 24 }}>المدونة</h1>

        <div className="flex flex-col gap-4">
          {articles.map((a, i) => (
            <div key={i} className="flex flex-col glass-card-light" style={{ padding: 20 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <span
                  className="font-cairo font-bold"
                  style={{
                    fontSize: 11,
                    color: "white",
                    background: "hsl(var(--primary))",
                    borderRadius: 999,
                    padding: "3px 10px",
                  }}
                >
                  {a.category}
                </span>
                <span className="font-cairo font-bold" style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", background: "hsl(var(--muted))", borderRadius: 999, padding: "3px 10px" }}>
                  قريباً
                </span>
              </div>
              <p className="font-cairo font-bold" style={{ fontSize: 18, color: "hsl(var(--foreground))", marginBottom: 8 }}>{a.title}</p>
              <p
                className="font-cairo font-light"
                style={{
                  fontSize: 14,
                  color: "hsl(var(--muted-foreground))",
                  marginBottom: 12,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {a.excerpt}
              </p>
              <div className="flex items-center gap-1">
                <Clock size={12} color="hsl(var(--muted-foreground))" />
                <span className="font-cairo font-light" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>
                  {a.date} · {a.readTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
