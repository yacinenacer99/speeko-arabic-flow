// Shared session and analysis types for recording pipeline.

export interface WhisperWord {
  word: string;
  start: number;
  end: number;
}

export interface WhisperResult {
  transcript: string;
  words: WhisperWord[];
  language?: string;
}

export interface AnalysisResult {
  fillerCount: number;
  fillerWords: Array<{ word: string; count: number }>;
  wordCount: number;
  pace: number;
  forbiddenUsed: string[];
  longestPause: number;
  speakingDuration: number;
  flowScore: number;
  flowDimensions: {
    fillerScore: number;
    durationScore: number;
    paceScore: number;
    sustainedScore: number;
    cognitiveScore: number;
  };
}

export interface XPBreakdown {
  sessionComplete: number;
  beatPersonalBest: number;
  zeroFillers: number;
  zeroForbidden: number;
  streakBonus: number;
  total: number;
}

export interface StageAdvancement {
  advanced: boolean;
  newStage: number | null;
  newStageName: string | null;
}

export interface CoachingNotes {
  relevancyScore: number;
  answerQualityScore: number;
  coachingFeedback: string;
  strengths: string[];
  improvements: string[];
}

export interface SessionResult {
  sessionId: string;
  topic: string;
  transcript?: string;
  analysis: AnalysisResult;
  xp: XPBreakdown;
  stageAdvancement: StageAdvancement;
  streakCount: number;
  streakLost: boolean;
  previousStreak: number;
  timestamp: string;
  coachingNotes: CoachingNotes | null;
}
