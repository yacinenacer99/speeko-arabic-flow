import { Lock, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const nodes = [
  { label: "مبتدئ", desc: "تكلم 30 ثانية بدون توقف", status: "completed" as const },
  { label: "متحدث", desc: "تخلص من كلمات الحشو", status: "current" as const },
  { label: "مؤثر", desc: "بنِ أفكارك بوضوح", status: "locked" as const },
  { label: "خطيب", desc: "أي موضوع، أي غرفة", status: "locked" as const },
];

const ProgressionPath = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [drawProgress, setDrawProgress] = useState(0);
  const [visibleNodes, setVisibleNodes] = useState<boolean[]>([false, false, false, false]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio;
            setDrawProgress(Math.min(ratio * 2.5, 1));
          }
        });
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 20) }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nodeEls = document.querySelectorAll(".path-node");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setVisibleNodes((prev) => {
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    nodeEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // SVG path that winds left and right
  const pathD = "M 150 40 C 150 100, 80 100, 80 160 C 80 220, 220 220, 220 280 C 220 340, 80 340, 80 400 C 80 460, 150 460, 150 520";
  const pathLength = 700;

  // Node positions along the path
  const nodePositions = [
    { x: 150, y: 40 },
    { x: 80, y: 160 },
    { x: 220, y: 280 },
    { x: 80, y: 400 },
  ];

  return (
    <section className="px-6 py-24" ref={sectionRef}>
      <div className="max-w-[720px] mx-auto bg-surface-dark rounded-[28px] p-8 md:p-12">
        <div className="text-center mb-14">
          <h3 className="text-3xl md:text-[32px] font-bold font-cairo text-primary-foreground mb-3">
            مسارك نحو الثقة
          </h3>
          <p className="text-lg font-light font-cairo text-[hsl(240_10%_58%)]">
            من مبتدئ إلى خطيب — خطوة بخطوة
          </p>
        </div>

        {/* Path visualization */}
        <div className="relative mx-auto" style={{ width: 300, height: 560 }}>
          {/* SVG winding path */}
          <svg
            className="absolute inset-0"
            width="300"
            height="560"
            viewBox="0 0 300 560"
            fill="none"
          >
            <path
              d={pathD}
              stroke="hsl(244 100% 68%)"
              strokeWidth="2"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength * (1 - drawProgress)}
              strokeLinecap="round"
              fill="none"
              style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
            />
          </svg>

          {/* Nodes */}
          {nodes.map((node, i) => {
            const pos = nodePositions[i];
            return (
              <div
                key={i}
                data-index={i}
                className="path-node absolute flex flex-col items-center"
                style={{
                  left: pos.x,
                  top: pos.y,
                  transform: "translate(-50%, -50%)",
                  opacity: visibleNodes[i] ? 1 : 0,
                  transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
                  ...(visibleNodes[i] ? {} : { transform: "translate(-50%, calc(-50% + 20px))" }),
                }}
              >
                {/* "You are here" badge for current */}
                {node.status === "current" && (
                  <span className="mb-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold font-cairo">
                    أنت هنا
                  </span>
                )}

                {/* Circle */}
                <div className="relative">
                  <div
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center relative
                      ${node.status === "completed" ? "bg-primary" : ""}
                      ${node.status === "current" ? "bg-primary-foreground border-[3px] border-primary animate-pulse-glow" : ""}
                      ${node.status === "locked" ? "bg-[hsl(240_20%_18%)]" : ""}
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

                  {/* Checkmark badge for completed */}
                  {node.status === "completed" && (
                    <span className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center shadow">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center max-w-[120px]">
                  {node.status === "locked" && (
                    <span className="block text-sm font-bold font-cairo text-muted-foreground">{node.label}</span>
                  )}
                  <span className={`block text-xs font-light font-cairo mt-1 ${
                    node.status === "locked" ? "text-muted-foreground" : "text-primary-foreground/70"
                  }`}>
                    {node.desc}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Fade hint at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, hsl(240 12% 5%))" }}
          />
        </div>
      </div>
    </section>
  );
};

export default ProgressionPath;
