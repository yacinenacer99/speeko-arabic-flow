// Mock Whisper transcription service (real API will be wired later).

import type { WhisperResult } from "@/types/session";

/**
 * Transcribe an audio blob into a WhisperResult (mock or real backend).
 * @param audioBlob Recorded audio.
 * @param forbiddenWords Forbidden words to optionally inject for testing.
 * @returns Promise with Whisper-style transcript and word timings.
 */
export async function transcribeAudio(
  audioBlob: Blob,
  forbiddenWords: string[],
): Promise<WhisperResult> {
  const useMock = import.meta.env.VITE_MOCK_WHISPER === "true";
  if (!useMock) {
    throw new Error("WHISPER_NOT_CONFIGURED");
  }

  console.log("[MLASOON] Mock transcription started, blob bytes:", audioBlob.size);

  const baseText =
    "اسمي أحمد وأحاول أطور مهارات الكلام عندي قدام الناس لأن كثير مواقف تمر بدون ما أقدر أعبّر فيها عن نفسي بشكل واضح " +
    "اليوم قاعد أتكلم عن أهمية الوقت وكيف أن تنظيم يومك يساعدك تحقق أهدافك لما تصحى بدري وتخطط لليوم تتغير نظرتك للمهام " +
    "بدل ما تقول ما عندي وقت تقدر تقسّم الأشياء لقطع صغيرة وتبدأ بخطوة بسيطة وبعدين خطوة ثانية وثالثة " +
    "أحياناً نخاف من الفشل بس الكلام بصوت عالي عن أفكارك يساعدك ترتّبها وتشوف وين نقاط القوة والضعف في طريقتك " +
    "بصراحة كل جلسة تدريب زي هذه تخليك أجرأ مع الوقت وتخفف التوتر قدام الجمهور أو حتى في الاجتماعات اليومية في الشغل أو الجامعة";

  const fillers = ["يعني", "آآآ", "حرفياً", "بصراحة"];
  const injectedForbidden: string[] = [];
  const topicWords = baseText.split(" ");

  if (forbiddenWords.length > 0) {
    const candidates = forbiddenWords.slice(0, 2);
    for (const w of candidates) {
      injectedForbidden.push(w);
      const idx = Math.floor(Math.random() * topicWords.length);
      topicWords.splice(idx, 0, w);
    }
  }

  const fillerCount = 2 + Math.floor(Math.random() * 2);
  const chosenFillers = [...fillers].sort(() => Math.random() - 0.5).slice(0, fillerCount);
  for (const filler of chosenFillers) {
    const idx = Math.floor(Math.random() * topicWords.length);
    topicWords.splice(idx, 0, filler);
  }

  const finalWords = topicWords.slice(0, 120);
  const transcript = finalWords.join(" ");
  const transcriptWordCount = transcript.split(/\s+/).filter(Boolean).length;
  const safeWordCount = Math.max(transcriptWordCount, 1);
  const totalDuration = 55;
  const avgStep = totalDuration / safeWordCount;

  const pauseIndices = new Set<number>();
  pauseIndices.add(Math.floor(finalWords.length * 0.25));
  pauseIndices.add(Math.floor(finalWords.length * 0.5));
  pauseIndices.add(Math.floor(finalWords.length * 0.8));

  const words: WhisperResult["words"] = [];
  let t = 0;

  finalWords.forEach((w, i) => {
    const start = Math.min(t, 59.8);
    const end = Math.min(60, Math.max(start + 0.05, start + avgStep * 0.7));
    words.push({ word: w, start, end });
    t = end;
    if (pauseIndices.has(i)) {
      t += 2 + Math.random();
    }
  });

  await new Promise((res) => setTimeout(res, 2000));

  console.log("[MLASOON] Transcript received, word count:", transcriptWordCount);

  return { transcript, words };
}

