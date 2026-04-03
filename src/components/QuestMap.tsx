import { Check, Lock, CheckCircle, MessageCircle, Mic, Ban, Gauge, Shuffle, Crown } from "lucide-react";
import { STAGE_NODES } from "@/lib/stageContent";

interface Stage {
  name: string;
  desc: string;
  criteria: string;
  status: "completed" | "current" | "locked" | "pro-locked";
  progress?: { current: number; total: number };
}

const STAGE_ICONS = [MessageCircle, Mic, Ban, Gauge, Shuffle, Crown];

export interface QuestMapProps {
  currentStage: number;
  stageProgressCount: number;
  stageProgressRequired: number;
  plan: "free" | "pro";
}

function buildStages(props: QuestMapProps): Stage[] {
  const cs = Math.min(Math.max(Math.floor(props.currentStage), 1), 6);
  const req = Math.max(props.stageProgressRequired, 1);
  return STAGE_NODES.map((base, i) => {
    const n = i + 1;
    let status: Stage["status"];
    if (n < cs) status = "completed";
    else if (n === cs) status = "current";
    else if (props.plan === "free" && n >= 4) status = "pro-locked";
    else status = "locked";

    const progress =
      n === cs
        ? {
            current: props.stageProgressCount,
            total: req,
          }
        : undefined;

    return {
      name: base.name,
      desc: base.desc,
      criteria: base.criteria,
      status,
      progress,
    };
  });
}

function motivationalLine(currentStage: number): string {
  const cs = Math.min(Math.max(Math.floor(currentStage), 1), 6);
  const remainingStages = 6 - cs;
  if (remainingStages <= 0) return "وصلت لأعلى مستوى — أنت سيد الكلام";
  if (remainingStages === 1) return "مرحلة واحدة تفصلك عن سيد الكلام";
  return `${remainingStages} مراحل تفصلك عن سيد الكلام`;
}

const QuestMap = ({ currentStage, stageProgressCount, stageProgressRequired, plan }: QuestMapProps) => {
  const stages = buildStages({
    currentStage,
    stageProgressCount,
    stageProgressRequired,
    plan,
  });
  const currentIndex = stages.findIndex((s) => s.status === "current");

  return (
    <div className="quest-map-container" style={{ padding: "0 var(--page-padding-mobile) 48px", direction: "rtl" }}>
      <h2
        className="font-cairo font-bold quest-map-heading"
        style={{ fontSize: 22, color: "#1A1A2E", marginBottom: 32, textAlign: "right" }}
      >
        مسارك
      </h2>

      <div className="relative" style={{ maxWidth: 600, margin: "0 auto" }}>
        {stages.map((stage, i) => {
          const isLeft = i % 2 === 1;
          const isLast = i === stages.length - 1;
          const showProBadge = plan === "free" && i >= 3 && stage.status !== "completed";
          const spineColor = i <= currentIndex ? "#6C63FF" : "#E8E6F0";
          const nextSpineColor = i < currentIndex ? "#6C63FF" : "#E8E6F0";
          const StageIcon = STAGE_ICONS[i];

          return (
            <div key={i} className="relative">
              <div className="flex items-start">
                <div className="hidden md:flex w-full" style={{ justifyContent: isLeft ? "flex-start" : "flex-end" }}>
                  {isLeft && (
                    <>
                      <StageCard stage={stage} side="left" icon={StageIcon} />
                      <div className="flex flex-col items-center" style={{ position: "relative" }}>
                        <div style={{ width: 16, height: 2, background: spineColor, marginTop: 20 }} />
                      </div>
                    </>
                  )}

                  <div className="flex flex-col items-center" style={{ position: "relative", zIndex: 2 }}>
                    <SpineNode status={stage.status} icon={StageIcon} />
                    {showProBadge && <ProBadge />}
                    {!isLast && (
                      <div style={{ width: 2, height: 40, background: `linear-gradient(${spineColor}, ${nextSpineColor})` }} />
                    )}
                  </div>

                  {!isLeft && (
                    <>
                      <div className="flex flex-col items-center" style={{ position: "relative" }}>
                        <div style={{ width: 16, height: 2, background: spineColor, marginTop: 20 }} />
                      </div>
                      <StageCard stage={stage} side="right" icon={StageIcon} />
                    </>
                  )}
                </div>

                <div className="flex md:hidden w-full" style={{ gap: 0 }}>
                  <div className="flex flex-col items-center shrink-0" style={{ marginLeft: 12, position: "relative", zIndex: 2 }}>
                    <SpineNode status={stage.status} icon={StageIcon} />
                    {showProBadge && <ProBadge />}
                    {!isLast && (
                      <div style={{ width: 2, flex: 1, minHeight: 20, background: `linear-gradient(${spineColor}, ${nextSpineColor})` }} />
                    )}
                  </div>
                  <div style={{ width: 12, height: 2, background: spineColor, marginTop: 17, flexShrink: 0 }} />
                  <div style={{ flex: 1, paddingBottom: isLast ? 0 : 10 }}>
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
        {motivationalLine(currentStage)}
      </p>
    </div>
  );
};

const SpineNode = ({ status, icon: Icon }: { status: Stage["status"]; icon: React.ElementType }) => {
  const size = 36;
  if (status === "completed") {
    return (
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: size, height: size, borderRadius: "50%",
            background: "#6C63FF",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(108,99,255,0.3)",
          }}
        >
          <Icon size={14} color="white" />
        </div>
        <div
          style={{
            position: "absolute", top: -2, right: -2,
            width: 12, height: 12, borderRadius: "50%",
            background: "#5DBE8A",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 3,
          }}
        >
          <Check size={7} color="white" />
        </div>
      </div>
    );
  }
  if (status === "current") {
    return (
      <div
        className="animate-quest-glow"
        style={{
          width: size, height: size, borderRadius: "50%",
          background: "#0F0F14",
          border: "2.5px solid #6C63FF",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <Icon size={14} color="#6C63FF" />
      </div>
    );
  }
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: "rgba(255,255,255,0.3)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: 0.6,
      }}
    >
      <Lock size={14} color="#9090A8" />
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
    برو
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
        maxWidth: 240,
        background: "rgba(255,255,255,0.5)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.65)",
        borderRadius: 16,
        padding: isPro ? "14px 14px 0" : 14,
        boxShadow: "0 6px 24px rgba(0,0,0,0.05)",
        opacity: isLocked ? 0.7 : 1,
        transition: "all 0.3s ease",
        overflow: "hidden",
        position: "relative",
        ...accentBorder,
      }}
    >
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <Icon size={16} color={iconColor} />
      </div>

      <h3
        className="font-cairo font-bold"
        style={{ fontSize: 13, color: isLocked ? "#9090A8" : "#1A1A2E", marginBottom: 2 }}
      >
        {stage.name}
      </h3>
      <p
        className="font-cairo font-light"
        style={{ fontSize: 10, color: isLocked ? "#C4C4D4" : "#9090A8", marginBottom: 6 }}
      >
        {stage.desc}
      </p>

      {isCompleted && (
        <div className="flex items-center gap-1" style={{ marginTop: 4 }}>
          <CheckCircle size={11} color="#5DBE8A" />
          <span className="font-cairo font-light" style={{ fontSize: 10, color: "#5DBE8A" }}>مكتملة</span>
        </div>
      )}

      {isCurrent && stage.progress && (
        <div style={{ marginTop: 0 }}>
          <div style={{ width: "100%", height: 4, background: "#E8E6F0", borderRadius: 999 }}>
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
          <p className="font-cairo font-light" style={{ fontSize: 11, color: "#6C63FF", marginTop: 6 }}>
            {stage.progress.current}/{stage.progress.total} {stage.criteria}
          </p>
        </div>
      )}

      {isLocked && !isPro && (
        <div className="flex items-center gap-1">
          <Lock size={10} color="#C4C4D4" />
          <span className="font-cairo font-light" style={{ fontSize: 10, color: "#C4C4D4" }}>{stage.criteria}</span>
        </div>
      )}

      {isPro && (
        <>
          <div className="flex items-center gap-1" style={{ marginBottom: 14 }}>
            <Lock size={10} color="#C4C4D4" />
            <span className="font-cairo font-light" style={{ fontSize: 10, color: "#C4C4D4" }}>{stage.criteria}</span>
          </div>
          <div
            style={{
              background: "rgba(108,99,255,0.06)",
              borderTop: "1px solid rgba(108,99,255,0.15)",
              borderRadius: "0 0 16px 16px",
              padding: "5px 10px",
              margin: "0 -14px",
              textAlign: "center",
            }}
          >
            <span className="font-cairo font-light" style={{ fontSize: 10, color: "#6C63FF" }}>يتطلب اشتراك برو</span>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestMap;
