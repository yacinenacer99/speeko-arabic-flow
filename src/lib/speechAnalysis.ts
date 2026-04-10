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

  // ── 5-Dimension Flow Score ─────────────────────────────────────────────

  // Dimension 1: Speaking Duration (25 pts max)
  // Measures how much of the session the user actually filled with speech.
  const speakingRatio = speakingDuration / CONSTANTS.SESSION_DURATION_SECONDS;
  let durationScore: number;
  if (speakingRatio >= 0.90) durationScore = 25;
  else if (speakingRatio >= 0.75) durationScore = 20;
  else if (speakingRatio >= 0.60) durationScore = 15;
  else if (speakingRatio >= 0.45) durationScore = 10;
  else if (speakingRatio >= 0.30) durationScore = 5;
  else durationScore = 0;

  // Dimension 2: Pace (20 pts max)
  // WPM based on speakingDuration (pauses excluded) — 120-140 is optimal Arabic pace.
  const wpm = speakingDuration > 0 ? (wordCount / speakingDuration) * 60 : 0;
  let paceScore: number;
  if (wpm >= 120 && wpm <= 140) paceScore = 20;
  else if ((wpm >= 100 && wpm < 120) || (wpm > 140 && wpm <= 160)) paceScore = 16;
  else if ((wpm >= 80 && wpm < 100) || (wpm > 160 && wpm <= 180)) paceScore = 10;
  else if ((wpm >= 60 && wpm < 80) || (wpm > 180 && wpm <= 200)) paceScore = 5;
  else paceScore = 0;

  // Dimension 3: Filler Density (25 pts max)
  // Fillers per minute of speaking — rate matters more than raw count.
  const fillerDensity = speakingDuration > 0 ? (fillerCount / speakingDuration) * 60 : 0;
  let fillerScore: number;
  if (fillerDensity === 0) fillerScore = 25;
  else if (fillerDensity <= 1) fillerScore = 20;
  else if (fillerDensity <= 2) fillerScore = 14;
  else if (fillerDensity <= 4) fillerScore = 8;
  else if (fillerDensity <= 6) fillerScore = 3;
  else fillerScore = 0;

  // Dimension 4: Sustained Speech (20 pts max)
  // Longest pause indicates hesitation and loss of flow.
  // Neutral fallback (10 pts) when no word timestamps are available.
  let sustainedScore: number;
  if (wordTimestamps.length < 2) {
    sustainedScore = 10;
  } else if (longestPause <= 1.0) sustainedScore = 20;
  else if (longestPause <= 2.0) sustainedScore = 16;
  else if (longestPause <= 3.5) sustainedScore = 10;
  else if (longestPause <= 5.0) sustainedScore = 5;
  else sustainedScore = 0;

  // Dimension 5: Cognitive Control (10 pts max)
  // Stage 1-2: full points — not yet trained on forbidden word avoidance.
  // Stage 3+: deducted per forbidden word used.
  let cognitiveScore: number;
  if (userStage < 3) {
    cognitiveScore = 10;
  } else if (forbiddenUsed.length === 0) cognitiveScore = 10;
  else if (forbiddenUsed.length === 1) cognitiveScore = 6;
  else if (forbiddenUsed.length === 2) cognitiveScore = 2;
  else cognitiveScore = 0;

  console.log("[MLASOON] flow dimensions:", { durationScore, paceScore, fillerScore, sustainedScore, cognitiveScore });

  const rawScore = durationScore + paceScore + fillerScore + sustainedScore + cognitiveScore;
  const flowScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  console.log("[MLASOON] final flowScore:", flowScore);

  return {
    fillerCount,
    fillerWords,
    wordCount,
    pace,
    forbiddenUsed,
    longestPause: longestPause > 0 ? Number(longestPause.toFixed(1)) : 0,
    speakingDuration,
    flowScore,
  };
}

