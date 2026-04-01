import { Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const nodes = [
  { label: "مبتدئ", desc: "تكلم 30 ثانية بدون توقف", status: "current" as const },
  { label: "متحدث", desc: "تخلص من كلمات الحشو", status: "locked" as const },
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

  const pathD = "M 200 40 C 200 100, 100 100, 100 160 C 100 220, 300 220, 300 280 C 300 340, 100 340, 100 400 C 100 460, 200 460, 200 520";
  const pathLength = 700;

  // Node positions: zigzag left/right
  const nodePositions = [
    { x: 200, y: 40, textSide: "right" as const },
    { x: 100, y: 160, textSide: "right" as const },
    { x: 300, y: 280, textSide: "left" as const },
    { x: 100, y: 400, textSide: "right" as const },
  ];

  return (
    <section className="px-6 py-24" ref={sectionRef}>
      <div className="max-w-[720px] mx-auto">
        <div className="text-center mb-14">
          <h3 className="text-3xl md:text-[32px] font-bold font-cairo text-foreground mb-3">
            مسارك نحو الثقة
          </h3>
          <p className="text-lg font-light font-cairo text-muted-foreground">
            من مبتدئ إلى خطيب — خطوة بخطوة
          </p>
        </div>

        <div className="relative mx-auto" style={{ width: 400, height: 560 }}>
          <svg
            className="absolute inset-0"
            width="400"
            height="560"
            viewBox="0 0 400 560"
            fill="none"
          >
            <path
              d={pathD}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="8 8"
              strokeDashoffset={pathLength * (1 - drawProgress)}
              strokeLinecap="round"
              fill="none"
              opacity="0.3"
              style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
            />
          </svg>

          {nodes.map((node, i) => {
            const pos = nodePositions[i];
            const isTextRight = pos.textSide === "right";
            const isCurrent = node.status === "current";

            return (
              <div
                key={i}
                data-index={i}
                className="path-node absolute"
                style={{
                  left: pos.x,
                  top: pos.y,
                  transform: "translate(-50%, -50%)",
                  opacity: visibleNodes[i] ? 1 : 0,
                  transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
                  ...(visibleNodes[i] ? {} : { transform: "translate(-50%, calc(-50% + 20px))" }),
                }}
              >
                <div
                  className="flex items-center gap-4"
                  style={{ flexDirection: isTextRight ? "row" : "row-reverse" }}
                >
                  {/* Circle */}
                  <div
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center shrink-0
                      ${isCurrent ? "bg-primary animate-pulse-glow" : "bg-[#2A2A3E]"}
                    `}
                  >
                    {isCurrent ? (
                      <span className="text-sm font-bold font-cairo text-primary-foreground">
                        {node.label}
                      </span>
                    ) : (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Text */}
                  <div
                    className="whitespace-nowrap"
                    style={{ textAlign: isTextRight ? "right" : "left" }}
                  >
                    <span
                      className="block font-bold font-cairo"
                      style={{ fontSize: 16, color: "#1A1A2E" }}
                    >
                      {node.label}
                    </span>
                    <span
                      className="block font-light font-cairo"
                      style={{ fontSize: 13, color: "#9090A8" }}
                    >
                      {node.desc}
                    </span>
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
