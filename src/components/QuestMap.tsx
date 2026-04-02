import { Check, Lock, CheckCircle, MessageCircle, Mic, Ban, Gauge, Shuffle, Crown } from "lucide-react";

interface Stage {
  name: string;
  desc: string;
  criteria: string;
  status: "completed" | "current" | "locked" | "pro-locked";
  progress?: { current: number; total: number };
}

const stages: Stage[] = [
  { name: "مبتدئ", desc: "اكسر حاجز الصمت", criteria: "٣ جلسات بحديث أكثر من ٤٥ ثانية", status: "completed" },
  { name: "متحدث", desc: "تخلص من كلمات الحشو", criteria: "٣ جلسات متتالية بأقل من ٥ كلمات حشو", status: "current", progress: { current: 1, total: 3 } },
  { name: "واضح", desc: "رتّب أفكارك", criteria: "٥ جلسات بنقاط تدفق أكثر من ٧٥", status: "locked" },
  { name: "مؤثر", desc: "تحت الضغط", criteria: "٥ تحديات مفاجئة بنتيجة أكثر من ٧٠", status: "pro-locked" },
  { name: "خطيب", desc: "أي موضوع، أي غرفة", criteria: "١٠ تحديات متقدمة بنتيجة أكثر من ٨٠", status: "pro-locked" },
  { name: "سيد الكلام", desc: "ما يوقفك شيء", criteria: "حافظ على مستواك أو ترجع مرحلة", status: "pro-locked" },
];

const STAGE_ICONS = [MessageCircle, Mic, Ban, Gauge, Shuffle, Crown];

const currentIndex = stages.findIndex(s => s.status === "current");

const QuestMap = () => {
  return (
    <div style={{ padding: "0 24px 48px", direction: "rtl" }}>
      <h2
        className="font-cairo font-bold"
        style={{ fontSize: 22, color: "#1A1A2E", marginBottom: 32, textAlign: "right" }}
      >
        مسارك
      </h2>

      <div className="relative" style={{ maxWidth: 700, margin: "0 auto" }}>
        {stages.map((stage, i) => {
          const isLeft = i % 2 === 1;
          const isLast = i === stages.length - 1;
          const isPro = stage.status === "pro-locked";
          const spineColor = i <= currentIndex ? "#6C63FF" : "#E8E6F0";
          const nextSpineColor = i < currentIndex ? "#6C63FF" : "#E8E6F0";
          const StageIcon = STAGE_ICONS[i];

          return (
            <div key={i} className="relative">
              <div className="flex items-start">
                {/* Desktop layout */}
                <div className="hidden md:flex w-full" style={{ justifyContent: isLeft ? "flex-start" : "flex-end" }}>
                  {isLeft && (
                    <>
                      <StageCard stage={stage} side="left" icon={StageIcon} />
                      <div className="flex flex-col items-center" style={{ position: "relative" }}>
                        <div style={{ width: 16, height: 2, background: spineColor, marginTop: 17 }} />
                      </div>
                    </>
                  )}

                  <div className="flex flex-col items-center" style={{ position: "relative", zIndex: 2 }}>
                    <SpineNode status={stage.status} icon={StageIcon} />
                    {isPro && <ProBadge />}
                    {!isLast && (
                      <div style={{ width: 2, height: 60, background: `linear-gradient(${spineColor}, ${nextSpineColor})` }} />
                    )}
                  </div>

                  {!isLeft && (
                    <>
                      <div className="flex flex-col items-center" style={{ position: "relative" }}>
                        <div style={{ width: 24, height: 2, background: spineColor, marginTop: 23 }} />
                      </div>
                      <StageCard stage={stage} side="right" icon={StageIcon} />
                    </>
                  )}
                </div>

                {/* Mobile layout */}
                <div className="flex md:hidden w-full" style={{ gap: 0 }}>
                  <div className="flex flex-col items-center shrink-0" style={{ marginLeft: 16, position: "relative", zIndex: 2 }}>
                    <SpineNode status={stage.status} icon={StageIcon} />
                    {isPro && <ProBadge />}
                    {!isLast && (
                      <div style={{ width: 2, flex: 1, minHeight: 40, background: `linear-gradient(${spineColor}, ${nextSpineColor})` }} />
                    )}
                  </div>
                  <div style={{ width: 16, height: 2, background: spineColor, marginTop: 23, flexShrink: 0 }} />
                  <div style={{ flex: 1, paddingBottom: isLast ? 0 : 16 }}>
                    <StageCard stage={stage} side="right" icon={StageIcon} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p
        className="font-cairo font-light text-center"
        style={{ fontSize: 14, color: "#9090A8", marginTop: 40 }}
      >
        ٤ مراحل تفصلك عن سيد الكلام
      </p>
    </div>
  );
};

const SpineNode = ({ status, icon: Icon }: { status: Stage["status"]; icon: React.ElementType }) => {
  if (status === "completed") {
    return (
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "#6C63FF",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(108,99,255,0.3)",
          }}
        >
          <Icon size={20} color="white" />
        </div>
        {/* Completion check overlay */}
        <div
          style={{
            position: "absolute", top: -2, right: -2,
            width: 16, height: 16, borderRadius: "50%",
            background: "#5DBE8A",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 3,
          }}
        >
          <Check size={10} color="white" />
        </div>
      </div>
    );
  }
  if (status === "current") {
    return (
      <div
        className="animate-quest-glow"
        style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "#0F0F14",
          border: "2.5px solid #6C63FF",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <Icon size={20} color="#6C63FF" />
      </div>
    );
  }
  // locked or pro-locked — show Lock icon
  return (
    <div
      style={{
        width: 48, height: 48, borderRadius: "50%",
        background: "rgba(255,255,255,0.3)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: 0.6,
      }}
    >
      <Lock size={20} color="#9090A8" />
    </div>
  );
};

const ProBadge = () => (
  <span
    className="font-cairo font-bold"
    style={{
      fontSize: 9, color: "#6C63FF",
      background: "rgba(108,99,255,0.08)",
      border: "1px solid rgba(108,99,255,0.2)",
      borderRadius: 6, padding: "2px 8px",
      marginTop: 4,
    }}
  >
    Pro
  </span>
);

const StageCard = ({ stage, side, icon: Icon }: { stage: Stage; side: "left" | "right"; icon: React.ElementType }) => {
  const isCompleted = stage.status === "completed";
  const isCurrent = stage.status === "current";
  const isLocked = stage.status === "locked" || stage.status === "pro-locked";
  const isPro = stage.status === "pro-locked";

  const iconColor = isCompleted ? "#6C63FF" : isCurrent ? "#6C63FF" : "#9090A8";

  const accentBorder = isCurrent
    ? side === "right"
      ? { borderRight: "3px solid #6C63FF" }
      : { borderLeft: "3px solid #6C63FF" }
    : {};

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 280,
        background: "rgba(255,255,255,0.5)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.65)",
        borderRadius: 20,
        padding: isPro ? "24px 24px 0" : 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        opacity: isLocked ? 0.7 : 1,
        transition: "all 0.3s ease",
        overflow: "hidden",
        position: "relative",
        ...accentBorder,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(108,99,255,0.25)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(108,99,255,0.08)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.65)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.06)";
      }}
    >
      {/* Stage icon in top-left corner (RTL: top-right visually) */}
      <div style={{ position: "absolute", top: 16, left: 16 }}>
        <Icon size={24} color={iconColor} />
      </div>

      <h3
        className="font-cairo font-bold"
        style={{ fontSize: 17, color: isLocked ? "#9090A8" : "#1A1A2E", marginBottom: 4 }}
      >
        {stage.name}
      </h3>
      <p
        className="font-cairo font-light"
        style={{ fontSize: 13, color: isLocked ? "#C4C4D4" : "#9090A8", marginBottom: 12 }}
      >
        {stage.desc}
      </p>

      {isCompleted && (
        <div className="flex items-center gap-1" style={{ marginTop: 4 }}>
          <CheckCircle size={12} color="#5DBE8A" />
          <span className="font-cairo font-light" style={{ fontSize: 11, color: "#5DBE8A" }}>مكتملة</span>
        </div>
      )}

      {isCurrent && stage.progress && (
        <div style={{ marginTop: 0 }}>
          <div style={{ width: "100%", height: 6, background: "#E8E6F0", borderRadius: 999 }}>
            <div
              style={{
                width: `${(stage.progress.current / stage.progress.total) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg, #6C63FF, #A89CFF)",
                borderRadius: 999,
                transition: "width 0.6s ease",
              }}
            />
          </div>
          <p className="font-cairo font-light" style={{ fontSize: 12, color: "#6C63FF", marginTop: 8 }}>
            {stage.progress.current}/{stage.progress.total} {stage.criteria}
          </p>
        </div>
      )}

      {isLocked && !isPro && (
        <div className="flex items-center gap-1">
          <Lock size={10} color="#C4C4D4" />
          <span className="font-cairo font-light" style={{ fontSize: 11, color: "#C4C4D4" }}>{stage.criteria}</span>
        </div>
      )}

      {isPro && (
        <>
          <div className="flex items-center gap-1" style={{ marginBottom: 16 }}>
            <Lock size={10} color="#C4C4D4" />
            <span className="font-cairo font-light" style={{ fontSize: 11, color: "#C4C4D4" }}>{stage.criteria}</span>
          </div>
          <div
            style={{
              background: "rgba(108,99,255,0.06)",
              borderTop: "1px solid rgba(108,99,255,0.15)",
              borderRadius: "0 0 20px 20px",
              padding: "8px 16px",
              margin: "0 -24px",
              textAlign: "center",
            }}
          >
            <span className="font-cairo font-light" style={{ fontSize: 11, color: "#6C63FF" }}>يتطلب اشتراك Pro</span>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestMap;
