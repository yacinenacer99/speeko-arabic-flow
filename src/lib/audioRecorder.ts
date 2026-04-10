// Audio recording utilities — microphone access, MediaRecorder, and duration helpers.

/**
 * Request access to the user's microphone.
 * @returns Promise that resolves with an audio MediaStream.
 */
export async function requestMicrophoneAccess(): Promise<MediaStream> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    console.log("[MLASOON] getUserMedia unsupported");
    throw new Error("MICROPHONE_NOT_SUPPORTED");
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: { ideal: 16000 },
      },
    });
    console.log("[MLASOON] Microphone access granted");
    return stream;
  } catch (err) {
    console.log("[MLASOON] Microphone access denied", err);
    throw new Error("MICROPHONE_DENIED");
  }
}

export interface RecordingHandle {
  stop: () => Promise<{ blob: Blob; durationMs: number }>;
  mediaRecorder: MediaRecorder;
  analyserNode: AnalyserNode;
}

/**
 * Start recording audio from a given MediaStream.
 * @param stream Active MediaStream from the microphone.
 * @returns Recording handle with stop function, MediaRecorder, and AnalyserNode.
 */
export function startRecording(stream: MediaStream): RecordingHandle {
  const mimeTypes = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"];
  let mimeType = "";
  for (const type of mimeTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      mimeType = type;
      break;
    }
  }

  const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
  const mediaRecorder = new MediaRecorder(stream, options);
  const chunks: BlobPart[] = [];
  const startTime = Date.now();

  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  const AudioContextCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) {
    throw new Error("AUDIO_CONTEXT_NOT_SUPPORTED");
  }
  const audioContext = new AudioContextCtor();
  const source = audioContext.createMediaStreamSource(stream);
  const analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 256;
  source.connect(analyserNode);

  console.log("[MLASOON] Recording started");
  mediaRecorder.start(1000);

  const stop = () =>
    new Promise<{ blob: Blob; durationMs: number }>((resolve) => {
      const finalize = () => {
        const durationMs = Date.now() - startTime;
        const blob = new Blob(chunks, { type: mimeType || "audio/webm" });
        console.log(
          "[MLASOON] Recording stopped, blob size:",
          blob.size,
          "bytes, mimeType:",
          blob.type,
          "durationMs:",
          durationMs,
        );
        resolve({ blob, durationMs });
        stream.getTracks().forEach((t) => t.stop());
        audioContext.close().catch(() => {});
      };

      if (mediaRecorder.state === "inactive") {
        finalize();
      } else {
        mediaRecorder.onstop = finalize;
        mediaRecorder.stop();
      }
    });

  return { stop, mediaRecorder, analyserNode };
}

/**
 * Compute the duration of an audio Blob using an HTMLAudioElement.
 * @param blob Recorded audio blob.
 * @returns Promise with duration in seconds.
 */
export function getAudioDuration(blob: Blob): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio();
    let settled = false;

    const finish = (duration: number) => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(url);
      resolve(duration);
    };

    // Fallback: if loadedmetadata never fires (common with WebM), resolve with 0
    // so safeDuration in the caller can apply the default.
    const timeout = window.setTimeout(() => {
      console.log("[MLASOON] getAudioDuration timed out — using fallback");
      finish(0);
    }, 3000);

    audio.addEventListener("loadedmetadata", () => {
      window.clearTimeout(timeout);
      finish(isNaN(audio.duration) || !isFinite(audio.duration) ? 0 : audio.duration);
    });

    audio.addEventListener("error", () => {
      window.clearTimeout(timeout);
      console.log("[MLASOON] getAudioDuration error event");
      finish(0);
    });

    audio.src = url;
  });
}

