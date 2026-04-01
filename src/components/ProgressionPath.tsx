import { Lock } from "lucide-react";

const nodes = [
  { label: "مبتدئ", desc: "تكلم 30 ثانية بدون توقف", status: "completed" as const },
  { label: "متحدث", desc: "تخلص من كلمات الحشو", status: "current" as const },
  { label: "مؤثر", desc: "بنِ أفكارك بوضوح", status: "locked" as const },
  { label: "خطيب", desc: "أي موضوع، أي غرفة", status: "locked" as const },
];

const ProgressionPath = () => {
  return (
    <section className="px-6 py-24">
      <div className="max-w-[680px] mx-auto text-center">
        <h3 className="text-3xl md:text-[32px] font-bold font-cairo text-foreground mb-3">
          مسارك نحو الثقة
        </h3>
        <p className="text-lg font-light font-cairo text-muted-foreground mb-16">
          من مبتدئ إلى خطيب — خطوة بخطوة
        </p>

        {/* Quest path */}
        <div className="relative flex flex-col items-center gap-4">
          {nodes.map((node, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={i} className="flex flex-col items-center">
                {/* Dashed connector */}
                {i > 0 && (
                  <div className="h-10 border-r-2 border-dashed border-border mb-2" />
                )}

                {/* Node row with zigzag offset */}
                <div
                  className="flex flex-col items-center"
                  style={{ transform: `translateX(${isEven ? 40 : -40}px)` }}
                >
                  {/* Circle */}
                  <div
                    className={`
                      w-20 h-20 rounded-full flex items-center justify-center relative
                      ${node.status === "completed" ? "bg-primary" : ""}
                      ${node.status === "current" ? "bg-background border-[3px] border-primary animate-pulse-glow" : ""}
                      ${node.status === "locked" ? "bg-muted" : ""}
                    `}
                  >
                    {node.status === "locked" ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <span
                        className={`text-sm font-bold font-cairo ${
                          node.status === "completed" ? "text-primary-foreground" : "text-primary"
                        }`}
                      >
                        {node.label}
                      </span>
                    )}
                  </div>

                  {/* Label below */}
                  <div className="mt-3 text-center">
                    {node.status === "locked" && (
                      <span className="block text-sm font-bold font-cairo text-muted-foreground">{node.label}</span>
                    )}
                    <span className="block text-xs font-light font-cairo text-muted-foreground mt-1">{node.desc}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProgressionPath;