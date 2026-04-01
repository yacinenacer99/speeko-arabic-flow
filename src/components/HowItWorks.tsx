import { Zap, Mic, TrendingUp } from "lucide-react";

const cards = [
  {
    icon: Zap,
    title: "احصل على تحدي",
    description: "موضوع + كلمات ممنوعة تتولد لك يومياً",
  },
  {
    icon: Mic,
    title: "تكلم وتحلل",
    description: "الذكاء الاصطناعي يسمع، يكتشف الحشو، ويقيس انسيابيتك",
  },
  {
    icon: TrendingUp,
    title: "تطور يومياً",
    description: "ملاحظات تدريبية + مسار تطور يفتح لك مراحل جديدة",
  },
];

const HowItWorks = () => {
  return (
    <section className="px-6 py-24">
      <div className="max-w-[680px] mx-auto">
        <h3 className="text-3xl md:text-[32px] font-bold font-cairo text-foreground text-center mb-14">
          كيف يشتغل؟
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-card rounded-card p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-button bg-primary/10 flex items-center justify-center mb-5">
                <card.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-bold font-cairo text-card-foreground mb-2">{card.title}</h4>
              <p className="text-sm font-light font-cairo text-muted-foreground leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;