/** Fixed copy for the 6 quest stages (aligned with progress.stage 1–6). */
export const STAGE_NODES = [
  { name: "مبتدئ", desc: "اكسر حاجز الصمت", criteria: "٣ جلسات بحديث أكثر من ٤٥ ثانية" },
  { name: "متحدث", desc: "تخلص من كلمات الحشو", criteria: "٣ جلسات متتالية بأقل من ٥ كلمات حشو" },
  { name: "واضح", desc: "رتّب أفكارك", criteria: "٥ جلسات بنقاط تدفق أكثر من ٧٥" },
  { name: "مؤثر", desc: "تحت الضغط", criteria: "٥ تحديات مفاجئة بنتيجة أكثر من ٧٠" },
  { name: "خطيب", desc: "أي موضوع، أي غرفة", criteria: "١٠ تحديات متقدمة بنتيجة أكثر من ٨٠" },
  { name: "سيد الكلام", desc: "ما يوقفك شيء", criteria: "حافظ على مستواك أو ترجع مرحلة" },
] as const;

export const DAILY_CHALLENGE_BY_STAGE: Record<
  number,
  { title: string; body: string; durationLabel: string }
> = {
  1: {
    title: "جلسة ثقة",
    body: "تكلم ٦٠ ثانية عن نفسك بدون توقف طويل",
    durationLabel: "٦٠ ثانية",
  },
  2: {
    title: "جلسة بدون حشو",
    body: "تكلم ٦٠ ثانية بأقل عدد كلمات حشو",
    durationLabel: "٦٠ ثانية",
  },
  3: {
    title: "جلسة وضوح",
    body: "رتّب فكرتك في ٦٠ ثانية بنقاط واضحة",
    durationLabel: "٦٠ ثانية",
  },
  4: {
    title: "تحدي تحت الضغط",
    body: "جاوب على سؤال مفاجئ في دقيقة كاملة",
    durationLabel: "٦٠ ثانية",
  },
  5: {
    title: "خطاب سريع",
    body: "قدّم فكرتك في دقيقة أمام جمهور وهمي",
    durationLabel: "٦٠ ثانية",
  },
  6: {
    title: "أداء متكامل",
    body: "جلسة حرة بأعلى تركيز — أظهر مستواك",
    durationLabel: "٦٠ ثانية",
  },
};

export function getDailyChallengeForStage(stage: number) {
  const s = Math.min(Math.max(Math.floor(stage), 1), 6);
  return DAILY_CHALLENGE_BY_STAGE[s];
}
