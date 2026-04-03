// Central configuration and magic numbers for the speaking coach.

export const CONSTANTS = {
  FILLER_WORDS_AR: ["يعني", "أأأأء", "حرفياً", "بصراحة"] as const,
  MIN_WORD_COUNT: 5,
  PAUSE_THRESHOLD_SECONDS: 1.5,
  PACE_MIN: 110,
  PACE_MAX: 150,
  SESSION_DURATION_SECONDS: 60,
  XP_VALUES: {
    session: 10,
    personalBest: 5,
    zeroFillers: 15,
    zeroForbidden: 20,
    streak: 3,
  },
  STAGE_CRITERIA: [
    {
      stage: 1,
      name: "مبتدئ",
      requirement: 3,
      consecutive: false,
      check: "speakingDuration >= 45",
    },
    {
      stage: 2,
      name: "متحدث",
      requirement: 3,
      consecutive: true,
      check: "fillerCount < 4",
    },
    {
      stage: 3,
      name: "واضح",
      requirement: 5,
      consecutive: false,
      check: "flowScore >= 65 AND forbiddenUsed < 2",
    },
    {
      stage: 4,
      name: "مؤثر",
      requirement: 5,
      consecutive: false,
      check: "flowScore >= 75 AND pace 110-150",
    },
    {
      stage: 5,
      name: "خطيب",
      requirement: 7,
      consecutive: false,
      check: "flowScore >= 70",
    },
    {
      stage: 6,
      name: "سيد الكلام",
      requirement: null,
      consecutive: false,
      check: "maintain rolling avg > 75",
    },
  ] as const,
} as const;

export type StageCriterion = (typeof CONSTANTS.STAGE_CRITERIA)[number];

