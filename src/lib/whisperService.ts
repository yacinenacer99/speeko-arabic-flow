import { supabase } from "@/lib/supabase";
import type { WhisperResult } from "@/types/session";

export async function transcribeAudio(
  audioBlob: Blob,
  forbiddenWords: string[]
): Promise<WhisperResult> {
  const isMock = import.meta.env.VITE_MOCK_WHISPER === "true";

  if (isMock) {
    console.log("[MLASOON] Mock Whisper mode");
    await new Promise((r) => setTimeout(r, 800));
    const mockTranscript = "هذا نص تجريبي للاختبار وهو يحتوي على بعض الكلمات المفيدة في هذا الموضوع المهم جداً للنقاش";
    return {
      transcript: mockTranscript,
      words: mockTranscript.split(" ").map((word, i) => ({
        word,
        start: i * 0.5,
        end: i * 0.5 + 0.4,
      })),
      language: "ar",
    };
  }

  // Real Whisper via Supabase Edge Function
  console.log("[MLASOON] Calling real Whisper Edge Function");

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

  let accessToken = supabaseAnonKey;
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
      accessToken = data.session.access_token;
    }
  } catch {
    console.log("[MLASOON] getSession failed, using anon key");
  }

  const audioFile = new File([audioBlob], "audio.webm", {
    type: audioBlob.type || "audio/webm",
  });

  const formData = new FormData();
  formData.append("audio", audioFile);
  formData.append("forbiddenWords", JSON.stringify(forbiddenWords));

  console.log("[MLASOON] blob size:", audioBlob.size, "type:", audioBlob.type);
  console.log("[MLASOON] url:", `${supabaseUrl}/functions/v1/transcribe`);
  console.log("[MLASOON] token length:", accessToken.length);

  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/transcribe`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: supabaseAnonKey,
        },
        body: formData,
      }
    );

    console.log("[MLASOON] response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("[MLASOON] Whisper Edge Function error:", errorText);
      throw new Error("WHISPER_FAILED");
    }

    const data = await response.json() as WhisperResult;
    console.log("[MLASOON] Whisper transcript received, length:", data.transcript.length);
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.log("[MLASOON] fetch error:", message);
    if (message === "WHISPER_FAILED") throw err;
    throw new Error("WHISPER_FAILED");
  }
}
