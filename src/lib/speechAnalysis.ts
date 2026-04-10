// Local transcript analysis utilities — fillers, pace, pauses, and flow scoring.

import { CONSTANTS } from "@/lib/constants";
import type { AnalysisResult, WhisperWord } from "@/types/session";

const ARABIC_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

/**
 * Normalize Arabic/Latin text for comparison.
 * Strips diacritics, unifies alef variants, ta marbuta, alef maqsura, lowercases.
 */
function normalize(text: string): string {
  return text
    .normalize("NFC")
    .replace(ARABIC_DIACRITICS, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .toLowerCase();
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

  console.log("[MLASOON] normalized transcript:", normalizedText.slice(0, 150));
  console.log("[MLASOON] word timestamps received:", wordTimestamps.length);

  const fillerMap = new Map<string, number>();
  const normalizedFillers = CONSTANTS.FILLER_WORDS_AR.map((w) => normalize(w));
  const normalizedHesitations = HESITATION_VARIANTS.map((v) => normalize(v));
  const normalizedAAALabel = normalize("أأأأء");

  for (const token of words) {
    // Hesitation sounds — exact token match after normalization
    if (normalizedHesitations.includes(token)) {
      fillerMap.set(normalizedAAALabel, (fillerMap.get(normalizedAAALabel) ?? 0) + 1);
      continue;
    }
    // Filler words — exact match after normalization (normalization handles alef/ta marbuta variants)
    for (const filler of normalizedFillers) {
      if (token === filler) {
        fillerMap.set(filler, (fillerMap.get(filler) ?? 0) + 1);
      }
    }
  }

  const fillerWords = Array.from(fillerMap.entries())
    .filter(([, count]) => count > 0)
    .map(([word, count]) => ({ word, count }));
  const fillerCount = fillerWords.reduce((sum, f) => sum + f.count, 0);

  console.log("[MLASOON] fillers found:", fillerCount);

  const pace = safeDuration > 0 ? Math.round((wordCount / safeDuration) * 60) : 0;

  const wordBoundaryMatch = (text: string, word: string): boolean => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|\\s|[،,:.!?])${escaped}($|\\s|[،,:.!?])`, "u");
    return regex.test(text);
  };

  // Always detect forbidden words regardless of stage.
  // Stage gate only controls whether they count against scoring/advancement.
  const normalizedForbidden = forbiddenWords.map((w) => normalize(w));
  const forbiddenUsed = normalizedForbidden.filter((w) => wordBoundaryMatch(normalizedText, w));
  console.log("[MLASOON] forbidden found:", forbiddenUsed.length);

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

  // 0–100 score components
  const continuity = (speakingDuration / safeDuration) * 100;

  // Short sessions are penalized — 60s = 100, 30s = 50, 18s = 30
  const durationScore = Math.min(100, (safeDuration / CONSTANTS.SESSION_DURATION_SECONDS) * 100);

  // 12 points deducted per filler (was 8) — more aggressive
  const fillerPenalty = Math.max(0, 100 - fillerCount * 12);

  let paceScore = 100;
  if (pace < CONSTANTS.PACE_MIN) {
    paceScore = Math.max(0, 100 - (CONSTANTS.PACE_MIN - pace) * 3);
  } else if (pace > CONSTANTS.PACE_MAX) {
    paceScore = Math.max(0, 100 - (pace - CONSTANTS.PACE_MAX) * 3);
  }

  // 25 points deducted per forbidden word — only applied to score at stage 3+
  const forbiddenPenalty =
    userStage >= 3 ? Math.max(0, 100 - forbiddenUsed.length * 25) : 100;

  console.log("[MLASOON] score inputs — continuity:", Math.round(continuity), "duration:", Math.round(durationScore), "filler:", Math.round(fillerPenalty), "pace:", Math.round(paceScore), "forbidden:", Math.round(forbiddenPenalty));

  let flowScore: number;
  if (userStage <= 1) {
    // Stage 1: reward speaking at all — duration and continuity dominate
    flowScore =
      continuity * 0.4 +
      durationScore * 0.4 +
      paceScore * 0.2;
  } else if (userStage === 2) {
    // Stage 2: add filler penalty
    flowScore =
      continuity * 0.3 +
      durationScore * 0.25 +
      fillerPenalty * 0.3 +
      paceScore * 0.15;
  } else {
    // Stage 3+: all factors including forbidden
    flowScore =
      continuity * 0.25 +
      durationScore * 0.2 +
      fillerPenalty * 0.25 +
      paceScore * 0.15 +
      forbiddenPenalty * 0.15;
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

