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
 * Detect hesitation sounds by regex — catches variants not in HESITATION_VARIANTS.
 * Matches repeated Arabic throat/vowel characters (≥2) or known hesitation phrases.
 */
function isHesitation(word: string): boolean {
  const n = normalize(word);
  return /^[اأإآءهى]{2,}$/.test(n) || /^(اه|اهه|آه|أه|عه)$/.test(n);
}

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
  trailingPause?: number,
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
    // Hesitation sounds — exact list match OR regex-based detection
    if (normalizedHesitations.includes(token) || isHesitation(token)) {
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

  // pauseSum uses threshold to avoid counting micro-gaps as silence (for speakingDuration accuracy)
  let pauseSum = 0;
  for (let i = 0; i < wordTimestamps.length - 1; i += 1) {
    const gap = wordTimestamps[i + 1].start - wordTimestamps[i].end;
    if (gap > CONSTANTS.PAUSE_THRESHOLD_SECONDS) pauseSum += gap;
  }

  // longestPause captures the single biggest gap with no threshold — all gaps count
  const calculateLongestPause = (words: WhisperWord[]): number => {
    if (!words || words.length < 2) return 0;
    let longest = 0;
    for (let i = 1; i < words.length; i++) {
      const gap = words[i].start - words[i - 1].end;
      if (gap > longest) longest = gap;
    }
    return Math.round(longest * 10) / 10;
  };
  const longestWordGap = calculateLongestPause(wordTimestamps);
  const longestPause = Math.round(Math.max(longestWordGap, trailingPause ?? 0) * 10) / 10;

  console.log("[MLASOON] words array length:", wordTimestamps.length);
  console.log("[MLASOON] longestWordGap:", longestWordGap, "trailingPause:", trailingPause ?? 0, "longestPause:", longestPause);

  const speakingDuration = Math.max(safeDuration - pauseSum, 0);

  // ── 5-Dimension Flow Score ─────────────────────────────────────────────
  // TODO: When Claude AI integrated, add relevancy (30%) and coherence (15%)
  // Scale down current dimensions proportionally at that point

  // Dimension 1: Filler Density (35 pts max)
  const fillerDensity = speakingDuration > 0 ? (fillerCount / speakingDuration) * 60 : 0;
  let fillerScore: number;
  if (fillerDensity === 0) fillerScore = 35;
  else if (fillerDensity <= 1) fillerScore = 28;
  else if (fillerDensity <= 2) fillerScore = 20;
  else if (fillerDensity <= 4) fillerScore = 10;
  else if (fillerDensity <= 6) fillerScore = 4;
  else fillerScore = 0;

  // Dimension 2: Speaking Duration (25 pts max)
  const speakingRatio = speakingDuration / CONSTANTS.SESSION_DURATION_SECONDS;
  let durationScore: number;
  if (speakingRatio >= 0.90) durationScore = 25;
  else if (speakingRatio >= 0.75) durationScore = 20;
  else if (speakingRatio >= 0.60) durationScore = 14;
  else if (speakingRatio >= 0.45) durationScore = 8;
  else if (speakingRatio >= 0.30) durationScore = 3;
  else durationScore = 0;

  // Dimension 3: Pace (20 pts max)
  // paceDuration floor at 50% of safeDuration prevents inflated WPM from tiny speakingDuration
  const paceDuration = Math.max(speakingDuration, safeDuration * 0.5);
  const wpm = paceDuration > 0 ? (wordCount / paceDuration) * 60 : 0;
  let paceScore: number;
  if (wpm >= 120 && wpm <= 140) paceScore = 20;
  else if ((wpm >= 100 && wpm < 120) || (wpm > 140 && wpm <= 160)) paceScore = 15;
  else if ((wpm >= 80 && wpm < 100) || (wpm > 160 && wpm <= 180)) paceScore = 8;
  else if ((wpm >= 60 && wpm < 80) || (wpm > 180 && wpm <= 200)) paceScore = 3;
  else paceScore = 0;

  // Dimension 4: Sustained Speech (12 pts max)
  // Neutral fallback (6 pts) when no word timestamps are available.
  let sustainedScore: number;
  if (wordTimestamps.length < 2) {
    sustainedScore = 6;
  } else if (longestPause <= 1.0) sustainedScore = 12;
  else if (longestPause <= 2.0) sustainedScore = 9;
  else if (longestPause <= 3.5) sustainedScore = 6;
  else if (longestPause <= 5.0) sustainedScore = 3;
  else sustainedScore = 0;

  // Dimension 5: Cognitive Control (8 pts max)
  // Stage 1-2: full points — not yet trained on forbidden word avoidance.
  // Stage 3+: deducted per forbidden word used.
  let cognitiveScore: number;
  if (userStage < 3) {
    cognitiveScore = 8;
  } else if (forbiddenUsed.length === 0) cognitiveScore = 8;
  else if (forbiddenUsed.length === 1) cognitiveScore = 4;
  else if (forbiddenUsed.length === 2) cognitiveScore = 1;
  else cognitiveScore = 0;

  console.log("[MLASOON] flow dimensions:", { fillerScore, durationScore, paceScore, sustainedScore, cognitiveScore });

  const flowScore = Math.min(100, Math.max(0, Math.round(
    fillerScore + durationScore + paceScore + sustainedScore + cognitiveScore,
  )));

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

