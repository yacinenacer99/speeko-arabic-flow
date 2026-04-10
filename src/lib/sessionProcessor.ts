// Session processor — transcription, analysis, XP, and Supabase persistence.

import { CONSTANTS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { getAudioDuration } from "@/lib/audioRecorder";
import { analyzeTranscript } from "@/lib/speechAnalysis";
import { transcribeAudio } from "@/lib/whisperService";
import type { AnalysisResult, CoachingNotes, SessionResult, StageAdvancement, XPBreakdown } from "@/types/session";

interface CoachingResult {
  relevancyScore: number;
  answerQualityScore: number;
  coachingFeedback: string;
  strengths: string[];
  improvements: string[];
}

const getCoaching = async (
  transcript: string,
  topic: string,
  metrics: {
    fillerCount: number;
    forbiddenUsed: number;
    duration: number;
    pace: number;
    flowScore: number;
  },
): Promise<CoachingResult | null> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
    const response = await fetch(`${supabaseUrl}/functions/v1/coach`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ transcript, topic, metrics }),
    });
    if (!response.ok) return null;
    return await response.json() as CoachingResult;
  } catch {
    return null;
  }
};

type ProgressRow = {
  user_id: string;
  stage: number;
  xp: number;
  streak: number;
  stage_progress_count: number;
  stage_progress_required: number;
  last_session_date: string | null;
  freeze_tokens: number;
};

type SessionRow = {
  id: string;
};

/**
 * Get current date in YYYY-MM-DD (UTC) for streak logic.
 * @returns ISO date string.
 */
function currentDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Compute XP breakdown for a session.
 * @param userId User identifier.
 * @param analysis AnalysisResult for this recording.
 * @param stage Current stage.
 * @param streak Current streak after applying streak logic.
 * @returns XP breakdown with all components.
 */
async function computeXP(
  userId: string,
  analysis: AnalysisResult,
  stage: number,
  streak: number,
): Promise<XPBreakdown> {
  let personalBestXP = 0;
  try {
    const { data, error } = await supabase
      .from("sessions")
      .select("flow_score")
      .eq("user_id", userId)
      .order("flow_score", { ascending: false })
      .limit(1);
    if (error) {
      console.log("[MLASOON:DB_ERROR] sessions:", error.message);
    } else {
      const maxPrev = data?.[0]?.flow_score as number | undefined;
      if (maxPrev === undefined || analysis.flowScore > maxPrev) {
        personalBestXP = CONSTANTS.XP_VALUES.personalBest;
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.log("[MLASOON:DB_ERROR] sessions:", message);
  }

  const sessionComplete = CONSTANTS.XP_VALUES.session;
  const zeroFillers = analysis.fillerCount === 0 ? CONSTANTS.XP_VALUES.zeroFillers : 0;
  const zeroForbidden =
    stage >= 3 && analysis.forbiddenUsed.length === 0
      ? CONSTANTS.XP_VALUES.zeroForbidden
      : 0;
  const streakBonus = streak > 0 ? CONSTANTS.XP_VALUES.streak : 0;

  const total = sessionComplete + personalBestXP + zeroFillers + zeroForbidden + streakBonus;

  return {
    sessionComplete,
    beatPersonalBest: personalBestXP,
    zeroFillers,
    zeroForbidden,
    streakBonus,
    total,
  };
}

/**
 * Determine whether this session meets the criterion for the current stage.
 * @param stage Current numeric stage (1–6).
 * @param analysis Session analysis result.
 * @returns Boolean indicating if criteria are met.
 */
function meetsStageCriterion(stage: number, analysis: AnalysisResult): boolean {
  if (stage === 1) {
    return analysis.speakingDuration >= 45;
  }
  if (stage === 2) {
    return analysis.fillerCount < 4;
  }
  if (stage === 3) {
    return analysis.flowScore >= 65 && analysis.forbiddenUsed.length < 2;
  }
  if (stage === 4) {
    return (
      analysis.flowScore >= 75 &&
      analysis.pace >= CONSTANTS.PACE_MIN &&
      analysis.pace <= CONSTANTS.PACE_MAX
    );
  }
  if (stage === 5) {
    return analysis.flowScore >= 70;
  }
  return true;
}

/**
 * Update progress row with streak and stage advancement.
 * Computes XP internally after resolving the real streak count.
 * @param userId User identifier.
 * @param analysis Session analysis.
 * @returns StageAdvancement, new streak count, stage, and XP breakdown.
 */
async function updateProgress(
  userId: string,
  analysis: AnalysisResult,
): Promise<{ stageAdvancement: StageAdvancement; streakCount: number; stage: number; xp: XPBreakdown; streakLost: boolean; previousStreak: number }> {
  const today = currentDate();
  let row: ProgressRow | null = null;

  try {
    const { data, error } = await supabase
      .from("progress")
      .select(
        "user_id, stage, xp, streak, stage_progress_count, stage_progress_required, last_session_date, freeze_tokens",
      )
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      console.log("[MLASOON:DB_ERROR] progress:", error.message);
    } else if (data) {
      row = data as ProgressRow;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.log("[MLASOON:DB_ERROR] progress:", message);
  }

  if (!row) {
    row = {
      user_id: userId,
      stage: 1,
      xp: 0,
      streak: 0,
      stage_progress_count: 0,
      stage_progress_required: CONSTANTS.STAGE_CRITERIA[0].requirement ?? 1,
      last_session_date: null,
      freeze_tokens: 0,
    };
  }

  let { stage, xp: currentXP, streak, stage_progress_count, stage_progress_required, last_session_date, freeze_tokens } =
    row;

  const prevStreak = streak;
  let streakWasLost = false;

  if (last_session_date === today) {
    // keep streak as is
  } else if (last_session_date) {
    const last = new Date(last_session_date);
    const delta =
      Math.floor((new Date(today).getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    if (delta === 1) {
      streak += 1;
    } else if (delta > 1) {
      if (freeze_tokens > 0) {
        freeze_tokens -= 1;
      } else {
        if (prevStreak >= 2) streakWasLost = true;
        streak = 1;
      }
    }
  } else {
    streak = 1;
  }

  const criterion = CONSTANTS.STAGE_CRITERIA.find((c) => c.stage === stage);
  const meets = meetsStageCriterion(stage, analysis);

  if (criterion) {
    if (criterion.consecutive) {
      if (meets) {
        stage_progress_count += 1;
      } else {
        stage_progress_count = 0;
      }
    } else {
      if (meets) {
        stage_progress_count += 1;
      }
    }

    const required = criterion.requirement ?? stage_progress_required;
    stage_progress_required = required;

    if (required !== null && stage_progress_count >= required && stage < 6) {
      stage += 1;
      stage_progress_count = 0;
      const nextCriterion = CONSTANTS.STAGE_CRITERIA.find((c) => c.stage === stage);
      stage_progress_required = nextCriterion?.requirement ?? stage_progress_required;
    }
  }

  last_session_date = today;

  const stageMeta = CONSTANTS.STAGE_CRITERIA.find((c) => c.stage === stage);
  const stageAdvancement: StageAdvancement = {
    advanced: Boolean(criterion && stage !== row.stage),
    newStage: stage,
    newStageName: stageMeta?.name ?? null,
  };

  const xp = await computeXP(userId, analysis, stage, streak);
  currentXP += xp.total;

  try {
    const { error } = await supabase.from("progress").upsert(
      {
        user_id: userId,
        stage,
        xp: currentXP,
        streak,
        stage_progress_count,
        stage_progress_required,
        last_session_date,
        freeze_tokens,
      },
      { onConflict: "user_id" },
    );
    if (error) {
      console.log("[MLASOON:DB_ERROR] progress:", error.message);
    } else {
      console.log(
        "[MLASOON] Progress updated — stage:",
        stage,
        "xp:",
        currentXP,
        "streak:",
        streak,
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.log("[MLASOON:DB_ERROR] progress:", message);
  }

  return { stageAdvancement, streakCount: streak, stage, xp, streakLost: streakWasLost, previousStreak: prevStreak };
}

/**
 * Derive a challenge type label for this stage for storage in sessions.
 * @param stage Current stage.
 * @returns Challenge type string.
 */
function getChallengeType(stage: number): string {
  switch (stage) {
    case 1:
      return "confidence";
    case 2:
      return "filler_reduction";
    case 3:
      return "clarity";
    case 4:
      return "pressure";
    case 5:
      return "advanced";
    case 6:
      return "mastery";
    default:
      return "unknown";
  }
}

/**
 * Process a full speaking session: transcription, analysis, XP, and database save.
 * @param audioBlob Recorded audio blob.
 * @param topic Challenge topic label.
 * @param forbiddenWords Forbidden tokens for this challenge.
 * @param userId Auth user id.
 * @param userStage Current stage.
 * @returns SessionResult with ids, metrics, xp, and stage advancement.
 */
export async function processSession(
  audioBlob: Blob,
  topic: string,
  forbiddenWords: string[],
  userId: string,
  userStage: number,
  recordedDurationMs?: number,
): Promise<SessionResult> {
  const safeDuration = (d: number): number =>
    (typeof d === "number" && Number.isFinite(d) && d > 0)
      ? d
      : CONSTANTS.SESSION_DURATION_SECONDS;

  const whisper = await transcribeAudio(audioBlob, forbiddenWords);
  const rawDuration = await getAudioDuration(audioBlob);
  console.log("[MLASOON] rawDuration from audio element:", rawDuration, "recordedDurationMs:", recordedDurationMs, "word timestamps:", whisper.words.length);

  let duration: number;
  const realDuration = recordedDurationMs != null && recordedDurationMs > 0
    ? recordedDurationMs / 1000
    : 0;

  if (realDuration > 0) {
    duration = realDuration;
    console.log("[MLASOON] using real recorder duration:", duration);
  } else if (rawDuration > 0) {
    duration = rawDuration;
    console.log("[MLASOON] using audio element duration:", duration);
  } else if (whisper.words.length > 0) {
    // WebM duration metadata unavailable (Infinity→0 or timeout) — derive from Whisper timestamps
    const lastWordEnd = whisper.words[whisper.words.length - 1].end;
    duration = lastWordEnd > 0 ? lastWordEnd : CONSTANTS.SESSION_DURATION_SECONDS;
    console.log("[MLASOON] getAudioDuration failed, using Whisper last word end:", duration);
  } else {
    duration = CONSTANTS.SESSION_DURATION_SECONDS;
    console.log("[MLASOON] getAudioDuration failed, no Whisper timestamps, using constant:", duration);
  }

  const wordCount = whisper.transcript.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < CONSTANTS.MIN_WORD_COUNT) {
    throw new Error("EMPTY_RECORDING");
  }

  const lastWordEnd = whisper.words.length > 0 ? whisper.words[whisper.words.length - 1].end : 0;
  const trailingPause = lastWordEnd > 0 && duration > lastWordEnd ? duration - lastWordEnd : 0;
  console.log("[MLASOON] trailingPause:", trailingPause, "lastWordEnd:", lastWordEnd, "duration:", duration);

  const analysis = analyzeTranscript(
    whisper.transcript,
    whisper.words,
    forbiddenWords,
    duration,
    userStage,
    trailingPause,
  );
  console.log("[MLASOON] Analysis complete, flow score:", analysis.flowScore);

  console.log("[MLASOON] Calling coaching function");
  const coaching = await getCoaching(
    whisper.transcript,
    topic,
    {
      fillerCount: analysis.fillerCount,
      forbiddenUsed: analysis.forbiddenUsed.length,
      duration: analysis.speakingDuration,
      pace: analysis.pace,
      flowScore: analysis.flowScore,
    },
  );
  console.log("[MLASOON] Coaching received:", !!coaching, coaching?.relevancyScore);

  let finalFlowScore = analysis.flowScore;
  if (coaching && analysis.flowDimensions) {
    const { fillerScore, durationScore, paceScore, sustainedScore, cognitiveScore } = analysis.flowDimensions;

    // Normalize local dimension scores to 0-100
    const fillerNorm = (fillerScore / 35) * 100;
    const durationNorm = (durationScore / 25) * 100;
    const paceNorm = (paceScore / 20) * 100;
    const sustainedNorm = (sustainedScore / 12) * 100;
    const cognitiveNorm = (cognitiveScore / 8) * 100;

    finalFlowScore = Math.min(100, Math.max(0, Math.round(
      (coaching.relevancyScore * 0.25) +
      (coaching.answerQualityScore * 0.20) +
      (fillerNorm * 0.20) +
      (durationNorm * 0.15) +
      (paceNorm * 0.10) +
      (sustainedNorm * 0.07) +
      (cognitiveNorm * 0.03),
    )));
    console.log("[MLASOON] AI-adjusted flowScore:", finalFlowScore);
  }

  const finalAnalysis: AnalysisResult = { ...analysis, flowScore: finalFlowScore };
  const coachingNotes: CoachingNotes | null = coaching ?? null;

  const { stageAdvancement, streakCount, stage, xp, streakLost, previousStreak } = await updateProgress(
    userId,
    finalAnalysis,
  );

  const nowIso = new Date().toISOString();

  const { data: sessionRow, error: sessionError } = await supabase
    .from("sessions")
    .insert({
      user_id: userId,
      topic,
      duration: Math.round(duration),
      flow_score: finalFlowScore,
      filler_count: finalAnalysis.fillerCount,
      forbidden_used: finalAnalysis.forbiddenUsed.length,
      pace: Math.round(finalAnalysis.pace),
      longest_pause: finalAnalysis.longestPause,
      word_count: finalAnalysis.wordCount,
      transcript: whisper.transcript,
      challenge_type: getChallengeType(stage),
      analysis: finalAnalysis,
      xp_breakdown: xp,
      stage_advancement: stageAdvancement,
      streak_count: streakCount,
      coaching_notes: coachingNotes,
    })
    .select<SessionRow>("id")
    .single();

  if (sessionError || !sessionRow) {
    console.log("[MLASOON] SESSION INSERT ERROR:", JSON.stringify(sessionError));
    console.log("[MLASOON] SESSION INSERT DATA:", JSON.stringify(sessionRow));
    throw new Error("SESSION_SAVE_FAILED");
  }

  const sessionId = sessionRow.id;
  console.log("[MLASOON] Session saved, id:", sessionId);

  return {
    sessionId,
    topic,
    analysis: finalAnalysis,
    xp,
    stageAdvancement,
    streakCount,
    streakLost,
    previousStreak,
    timestamp: nowIso,
    coachingNotes,
  };
}

