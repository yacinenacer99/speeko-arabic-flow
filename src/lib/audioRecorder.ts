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
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("[MLASOON] Microphone access granted");
    return stream;
  } catch (err) {
    console.log("[MLASOON] Microphone access denied", err);
    throw new Error("MICROPHONE_DENIED");
  }
}

export interface RecordingHandle {
  stop: () => Promise<Blob>;
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
    new Promise<Blob>((resolve) => {
      const finalize = () => {
        const blob = new Blob(chunks, { type: mimeType || "audio/webm" });
        console.log(
          "[MLASOON] Recording stopped, blob size:",
          blob.size,
          "bytes, mimeType:",
          blob.type,
        );
        resolve(blob);
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
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio();
    audio.src = url;
    audio.addEventListener("loadedmetadata", () => {
      if (isNaN(audio.duration)) {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to read audio duration"));
        return;
      }
      const duration = audio.duration;
      URL.revokeObjectURL(url);
      resolve(duration);
    });
    audio.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load audio for duration"));
    });
  });
}

