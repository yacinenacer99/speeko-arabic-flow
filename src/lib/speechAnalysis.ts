// Local transcript analysis utilities — fillers, pace, pauses, and flow scoring.

import { CONSTANTS } from "@/lib/constants";
import type { AnalysisResult, WhisperWord } from "@/types/session";

const ARABIC_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

/**
 * Normalize Arabic/Latin text for comparison (lowercase, strip diacritics).
 * @param text Raw transcript text.
 * @returns Normalized string.
 */
function normalize(text: string): string {
  return text.normalize("NFC").replace(ARABIC_DIACRITICS, "").toLowerCase();
}

const HESITATION_VARIANTS = [
  "آآآ",
  "اااا",
  "آه",
  "اه",
  "أأأ",
  "ءءء",
  "اآآ",
  "آآ",
  "آ",
  "ااه",
  "أه",
] as const;

/**
 * Analyze a transcript and its word timings into speaking metrics.
 * @param transcript Full transcript text.
 * @param wordTimestamps Whisper word timing array.
 * @param forbiddenWords Forbidden words for this challenge.
 * @param totalDuration Total audio duration in seconds.
 * @param userStage Current user stage (1–6).
 * @returns AnalysisResult with counts, pace, pauses, and flow score.
 */
export function analyzeTranscript(
  transcript: string,
  wordTimestamps: WhisperWord[],
  forbiddenWords: string[],
  totalDuration: number,
  userStage: number,
): AnalysisResult {
  const safeDuration =
    typeof totalDuration === "number" && Number.isFinite(totalDuration) && totalDuration > 0
      ? totalDuration
      : 1;
  const normalizedText = normalize(transcript);

  const words = normalizedText
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean);

  const wordCount = words.length;

  const fillerMap = new Map<string, number>();
  const normalizedFillers = CONSTANTS.FILLER_WORDS_AR.map((w) => normalize(w));
  const normalizedHesitations = HESITATION_VARIANTS.map((v) => normalize(v));
  const normalizedAAALabel = normalize("أأأأء");

  for (const token of words) {
    if (normalizedHesitations.includes(token)) {
      fillerMap.set(normalizedAAALabel, (fillerMap.get(normalizedAAALabel) ?? 0) + 1);
      continue;
    }
    for (const filler of normalizedFillers) {
      if (token === filler) fillerMap.set(filler, (fillerMap.get(filler) ?? 0) + 1);
    }
  }

  const fillerWords = Array.from(fillerMap.entries())
    .filter(([, count]) => count > 0)
    .map(([word, count]) => ({ word, count }));
  const fillerCount = fillerWords.reduce((sum, f) => sum + f.count, 0);

  const pace = safeDuration > 0 ? Math.round((wordCount / safeDuration) * 60) : 0;

  let forbiddenUsed: string[] = [];
  if (userStage >= 3) {
    const normalizedForbidden = forbiddenWords.map((w) => normalize(w));
    forbiddenUsed = normalizedForbidden.filter((w) => normalizedText.includes(w));
  }

  let longestPause = 0;
  let pauseSum = 0;
  for (let i = 0; i < wordTimestamps.length - 1; i += 1) {
    const current = wordTimestamps[i];
    const next = wordTimestamps[i + 1];
    const gap = next.start - current.end;
    if (gap > CONSTANTS.PAUSE_THRESHOLD_SECONDS) {
      pauseSum += gap;
      if (gap > longestPause) longestPause = gap;
    }
  }

  const speakingDuration = Math.max(safeDuration - pauseSum, 0);

  const continuity = (speakingDuration / safeDuration) * 100;
  const fillerPenalty = Math.max(0, 100 - fillerCount * 8);

  let paceScore = 100;
  if (pace < CONSTANTS.PACE_MIN) {
    paceScore = Math.max(0, 100 - (CONSTANTS.PACE_MIN - pace) * 3);
  } else if (pace > CONSTANTS.PACE_MAX) {
    paceScore = Math.max(0, 100 - (pace - CONSTANTS.PACE_MAX) * 3);
  }

  const forbiddenPenalty =
    userStage >= 3 ? Math.max(0, 100 - forbiddenUsed.length * 20) : 100;

  let flowScore: number;
  if (userStage <= 1) {
    flowScore =
      continuity * 0.7 +
      paceScore * 0.15 +
      100 * 0.15;
  } else if (userStage === 2) {
    flowScore =
      continuity * 0.4 +
      fillerPenalty * 0.35 +
      paceScore * 0.25;
  } else {
    flowScore =
      continuity * 0.35 +
      fillerPenalty * 0.25 +
      paceScore * 0.2 +
      forbiddenPenalty * 0.2;
  }

  const rawScore = Number.isFinite(flowScore) ? flowScore : 0;
  const roundedFlow = Math.round(Math.min(100, Math.max(0, rawScore)));

  return {
    fillerCount,
    fillerWords,
    wordCount,
    pace,
    forbiddenUsed,
    longestPause: longestPause > 0 ? Number(longestPause.toFixed(1)) : 0,
    speakingDuration,
    flowScore: roundedFlow,
  };
}

