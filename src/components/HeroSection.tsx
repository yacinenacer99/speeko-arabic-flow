import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, ChevronRight } from "lucide-react";
import AnalysisLoading from "@/components/AnalysisLoading";
import { requestMicrophoneAccess, startRecording, RecordingHandle, getAudioDuration } from "@/lib/audioRecorder";
import { processSession } from "@/lib/sessionProcessor";
import { useSessionContext } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRecordingContext } from "@/contexts/RecordingContext";
import { supabase } from "@/lib/supabase";
import { transcribeAudio } from "@/lib/whisperService";
import { analyzeTranscript } from "@/lib/speechAnalysis";
import { CONSTANTS } from "@/lib/constants";
import { selectTopic, type Topic } from "@/lib/topics";
import type { SessionResult, XPBreakdown, StageAdvancement } from "@/types/session";

type State = "landing" | "sport" | "topic" | "recording";

const formatTime = (t: number) =>
  `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

const WAVE_BARS = [
  { min: 8, max: 24, dur: 0.4 },
  { min: 12, max: 32, dur: 0.6 },
  { min: 6, max: 28, dur: 0.5 },
  { min: 16, max: 36, dur: 0.45 },
  { min: 8, max: 22, dur: 0.55 },
  { min: 10, max: 30, dur: 0.5 },
  { min: 6, max: 18, dur: 0.65 },
];

const FILLER_PREVIEW = ["يعني", "أأأأء", "حرفياً", "بصراحة"] as const;

const HeroSection = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { setIsRecording } = useRecordingContext();
  const { setLatestSession } = useSessionContext();
  const [userStage, setUserStage] = useState<number>(1);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [state, setState] = useState<State>("landing");
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [flashKey, setFlashKey] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [showSilence, setShowSilence] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const recordingStartRef = useRef(0);
  const recordingRef = useRef<RecordingHandle | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const isProcessingRef = useRef(false);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const [waveHeights, setWaveHeights] = useState<number[]>(() => Array(7).fill(10));
  const [showLoading, setShowLoading] = useState(false);
  const [processingDone, setProcessingDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
  const [swapCount, setSwapCount] = useState(0);
  const [topicFadeIn, setTopicFadeIn] = useState(true);
  const [currentTopic, setCurrentTopic] = useState<Topic>(() =>
    selectTopic(1, [], []),
  );

  /**
   * Pick a topic using stage/interests and optionally avoid one topic id.
   * @param excludeId Optional current topic id to avoid.
   * @returns A selected topic.
   */
  const pickTopic = useCallback(
    (excludeId?: number) => {
      const selected = selectTopic(userStage, userInterests, []);
      if (excludeId && selected.id === excludeId) {
        const retry = selectTopic(userStage, userInterests, [excludeId]);
        return retry;
      }
      return selected;
    },
    [userStage, userInterests],
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleNavigateToResults = useCallback(() => navigate("/results"), [navigate]);

  useEffect(() => {
    if (!session?.user?.id) return;
    void (async () => {
      try {
        const { data, error } = await supabase
          .from("progress")
          .select("stage")
          .eq("user_id", session.user.id)
          .maybeSingle();
        if (error) {
          console.log("[MLASOON:DB_ERROR] progress:", error.message);
          return;
        }
        if (data?.stage) {
          setUserStage(data.stage);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.log("[MLASOON:DB_ERROR] progress:", message);
      }
    })();
  }, [session]);

  useEffect(() => {
    if (!session?.user?.id) {
      setUserInterests([]);
      return;
    }
    void (async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("interests")
          .eq("id", session.user.id)
          .maybeSingle();
        if (error) {
          console.log("[MLASOON:DB_ERROR] users:", error.message);
          return;
        }
        if (Array.isArray(data?.interests)) {
          const normalized = data.interests.filter((entry): entry is string => typeof entry === "string");
          setUserInterests(normalized);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.log("[MLASOON:DB_ERROR] users:", message);
      }
    })();
  }, [session]);

  useEffect(() => {
    if (state === "sport") {
      const id = setTimeout(() => setState("topic"), 700);
      return () => clearTimeout(id);
    }
  }, [state]);

  useEffect(() => {
    if (state === "recording") {
      setTimeLeft(60);
      recordingStartRef.current = Date.now();
      lastActivityRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
      return clearTimer;
    }
  }, [state, clearTimer]);

  useEffect(() => {
    if (timeLeft === 0 && state === "recording") {
      clearTimer();
      void stopRecordingAndProcess();
    }
  }, [timeLeft, state, clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  useEffect(() => {
    const shouldHide = state === "recording";
    setIsRecording(shouldHide);
    return () => setIsRecording(false);
  }, [state, setIsRecording]);

  useEffect(() => {
    if (state === "landing") {
      setSwapCount(0);
      setTopicFadeIn(true);
      setCurrentTopic(pickTopic());
    }
  }, [state, pickTopic]);

  useEffect(() => {
    if (state === "landing") {
      setCurrentTopic(pickTopic());
      console.log("[MLASOON] Topic refreshed after user data loaded");
    }
  }, [userStage, userInterests]);

  useEffect(() => {
    if (state !== "recording") return;
    const schedule = () => {
      const delay = 8000 + Math.random() * 4000;
      return setTimeout(() => {
        setShowFlash(true);
        setFlashKey((k) => k + 1);
        lastActivityRef.current = Date.now();
        setTimeout(() => setShowFlash(false), 400);
        idRef = schedule();
      }, delay);
    };
    let idRef = schedule();
    return () => clearTimeout(idRef);
  }, [state]);

  useEffect(() => {
    if (state !== "recording") {
      setShowSilence(false);
      return;
    }
    const interval = setInterval(() => {
      const elapsed = Date.now() - recordingStartRef.current;
      const sinceActivity = Date.now() - lastActivityRef.current;
      if (elapsed > 5000 && sinceActivity > 3000) {
        setShowSilence(true);
        setTimeout(() => setShowSilence(false), 2000);
        lastActivityRef.current = Date.now();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  const isLanding = state === "landing";
  const isDark = state !== "landing";
  const isSmall = !isLanding;
  const showTopic = state === "topic" || state === "recording";
  const isRecording = state === "recording";

  const timerColor =
    timeLeft > 30
      ? "#FFFFFF"
      : timeLeft > 10
        ? "#F59E0B"
        : "#FF4444";

  useEffect(() => {
    if (!isRecording || showLoading) {
      setWaveHeights(Array(7).fill(10));
      return;
    }
    let rafId = 0;
    const freqData = analyserNode ? new Uint8Array(analyserNode.frequencyBinCount) : null;
    const tick = () => {
      if (analyserNode && freqData) {
        analyserNode.getByteFrequencyData(freqData);
        const bucket = Math.floor(freqData.length / 7);
        const nextHeights = Array.from({ length: 7 }, (_, i) => {
          const start = i * bucket;
          const end = i === 6 ? freqData.length : start + bucket;
          let sum = 0;
          for (let j = start; j < end; j += 1) sum += freqData[j];
          const avg = end > start ? sum / (end - start) : 0;
          return Math.max(6, Math.min(50, (avg / 255) * 50));
        });
        setWaveHeights(nextHeights);
      } else {
        setWaveHeights(Array.from({ length: 7 }, () => 8 + Math.random() * 42));
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isRecording, analyserNode, showLoading]);

  const beginRecordingFromLanding = () => {
    setMicErrorMessage(null);
    setErrorMessage(null);

    requestMicrophoneAccess()
      .then((stream) => {
        micStreamRef.current = stream;
        setState("sport");
        console.log("[MLASOON] Mic access granted, stream stored");
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "MICROPHONE_UNKNOWN";
        if (message === "MICROPHONE_DENIED") {
          setMicErrorMessage(
            "يرجى السماح بالوصول للميكروفون من إعدادات المتصفح",
          );
        } else if (message === "MICROPHONE_NOT_SUPPORTED") {
          setMicErrorMessage(
            "متصفحك لا يدعم التسجيل — جرب Chrome أو Safari",
          );
        } else {
          setMicErrorMessage("حدث خطأ غير متوقع في الميكروفون");
        }
      });
  };

  const swapTopic = () => {
    if (swapCount >= 2) return;
    setTopicFadeIn(false);
    window.setTimeout(() => {
      const nextTopic = pickTopic(currentTopic.id);
      setCurrentTopic(nextTopic);
      setSwapCount((count) => count + 1);
      setTopicFadeIn(true);
      console.log("[MLASOON] Topic swapped");
    }, 200);
  };

  const handleCircleClick = () => {
    if (state === "landing") {
      beginRecordingFromLanding();
    } else if (state === "topic") {
      if (!micStreamRef.current) {
        setErrorMessage("انتهت صلاحية الميكروفون — حاول مجدداً");
        setState("landing");
        return;
      }
      const handle = startRecording(micStreamRef.current);
      recordingRef.current = handle;
      setAnalyserNode(handle.analyserNode);
      isProcessingRef.current = false;
      setState("recording");
      console.log("[MLASOON] Recording started");
    } else if (state === "recording") {
      clearTimer();
      void stopRecordingAndProcess();
    }
  };

  /**
   * Run a trial session pipeline without DB writes (no XP/progress updates).
   * @param audioBlob Recorded audio.
   * @param topic Topic label.
   * @param forbiddenWords Forbidden words for this session.
   * @returns SessionResult with sessionId="trial" and analysis-only fields.
   */
  const processTrial = async (
    audioBlob: Blob,
    topic: string,
    forbiddenWords: string[],
  ): Promise<SessionResult> => {
    const safeDuration = (d: number): number =>
      (typeof d === "number" && Number.isFinite(d) && d > 0)
        ? d
        : CONSTANTS.SESSION_DURATION_SECONDS;

    const whisper = await transcribeAudio(audioBlob, forbiddenWords);
    const rawDuration = await getAudioDuration(audioBlob);
    const duration = safeDuration(rawDuration);

    const wordCount = whisper.transcript.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < CONSTANTS.MIN_WORD_COUNT) {
      throw new Error("EMPTY_RECORDING");
    }

    const analysis = analyzeTranscript(
      whisper.transcript,
      whisper.words,
      forbiddenWords,
      duration,
      1,
    );

    const zeroXP: XPBreakdown = {
      sessionComplete: 0,
      beatPersonalBest: 0,
      zeroFillers: 0,
      zeroForbidden: 0,
      streakBonus: 0,
      total: 0,
    };

    const zeroAdv: StageAdvancement = {
      advanced: false,
      newStage: null,
      newStageName: null,
    };

    return {
      sessionId: "trial",
      topic,
      analysis,
      xp: zeroXP,
      stageAdvancement: zeroAdv,
      streakCount: 0,
      timestamp: new Date().toISOString(),
    };
  };

  const stopRecordingAndProcess = async () => {
    if (isProcessingRef.current) {
      console.log("[MLASOON] stopRecordingAndProcess already running — skipping");
      return;
    }
    try {
      isProcessingRef.current = true;
      console.log("[MLASOON] step 1: guard passed, isProcessingRef set");

      const handle = recordingRef.current;
      console.log("[MLASOON] step 2: handle =", handle ? "exists" : "null");
      if (!handle) {
        throw new Error("EMPTY_RECORDING");
      }

      console.log("[MLASOON] step 3: calling handle.stop()");
      const blob = await handle.stop();
      console.log("[MLASOON] step 4: blob received, size =", blob.size);

      recordingRef.current = null;
      micStreamRef.current = null;
      setAnalyserNode(null);
      setShowLoading(true);
      setProcessingDone(false);
      console.log("[MLASOON] step 5: showLoading = true");

      const challengeForbiddenForAuth =
        userStage >= 3 ? currentTopic.forbiddenWords : [];
      console.log("[MLASOON] step 6: userId =", session?.user?.id ?? "guest", "stage =", userStage);

      const result: SessionResult =
        session?.user?.id
          ? await processSession(
              blob,
              currentTopic.question,
              challengeForbiddenForAuth,
              session.user.id,
              userStage,
            )
          : await processTrial(blob, currentTopic.question, currentTopic.forbiddenWords);

      console.log("[MLASOON] step 7: result received, flowScore =", result.analysis.flowScore);
      setLatestSession(result);
      setProcessingDone(true);
      console.log("[MLASOON] step 8: processingDone = true");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error ? err.stack : "no stack";
      console.log("[MLASOON] ERROR MESSAGE:", message);
      console.log("[MLASOON] ERROR STACK:", stack);
      if (message === "SESSION_SAVE_FAILED") {
        setErrorMessage("تعذّر حفظ الجلسة — تحقق من اتصالك وحاول مجدداً");
      } else if (message === "EMPTY_RECORDING") {
        setErrorMessage("لم نسمع شيء — حاول مرة ثانية");
      } else if (message === "WHISPER_NOT_CONFIGURED") {
        setErrorMessage("خدمة النص الصوتي غير مفعّلة — تحقق من إعدادات VITE_MOCK_WHISPER");
      } else {
        setErrorMessage("حدث خطأ أثناء تحليل الجلسة");
      }
      setShowLoading(false);
    } finally {
      isProcessingRef.current = false;
      console.log("[MLASOON] isProcessingRef reset");
    }
  };

  return (
    <section
      className="relative flex flex-col items-center overflow-hidden"
      style={{
        minHeight: "100dvh",
        margin: 0,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        backgroundColor: isDark ? "#0F0F14" : "#F5F4F0",
        transition: `background-color 0.7s ease`,
        direction: "rtl",
      }}
    >
      {(state === "topic" || state === "recording") && (
        <button
          type="button"
          onClick={() => {
            clearTimer();
            if (recordingRef.current) {
              recordingRef.current.stop().catch(() => {});
              recordingRef.current = null;
            }
            if (micStreamRef.current) {
              micStreamRef.current.getTracks().forEach((t) => t.stop());
              micStreamRef.current = null;
            }
            setAnalyserNode(null);
            setIsRecording(false);
            isProcessingRef.current = false;
            setShowLoading(false);
            setProcessingDone(false);
            setState("landing");
            console.log("[MLASOON] Back pressed — recorder stopped, stream released");
          }}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 1100,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 999,
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          aria-label="رجوع"
        >
          <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
        </button>
      )}

      {/* Edge flash overlay */}
      <div
        key={flashKey}
        className="recording-flash"
        style={{
          position: "fixed",
          inset: 0,
          border: "6px solid #FF4444",
          borderRadius: 0,
          pointerEvents: "none",
          zIndex: 999,
          opacity: 0,
          animation: showFlash ? "edgeFlash 0.4s ease forwards" : "none",
        }}
      />

      {/* Atmospheric blobs — landing only */}
      {isLanding && (
        <>
          <div className="blob blob-violet" style={{ width: 200, height: 200, top: "15%", right: "-10%" }} />
          <div className="blob blob-pink" style={{ width: 200, height: 200, bottom: "20%", left: "-5%" }} />
          <div className="blob blob-blue" style={{ width: 200, height: 200, top: "50%", left: "30%" }} />
        </>
      )}

      {/* Background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: "min(500px, 100vw)",
          height: "min(500px, 100vw)",
          background: "radial-gradient(circle, hsla(244, 100%, 68%, 0.15), transparent 70%)",
          filter: "blur(80px)",
          opacity: isDark ? 0.5 : 1,
          transition: "opacity 0.7s ease",
        }}
      />

      {/* Main content area */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 400,
          justifyContent: isLanding ? "center" : "flex-start",
          paddingTop: isLanding ? 0 : 80,
          paddingLeft: "var(--page-padding-mobile)",
          paddingRight: "var(--page-padding-mobile)",
          transition: "all 0.7s ease",
        }}
      >
        <p
          className="font-cairo font-light text-center"
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
            opacity: isRecording ? 1 : 0,
            marginBottom: isRecording ? 16 : 0,
            minHeight: isRecording ? 20 : 0,
            transition: "opacity 0.2s ease",
            pointerEvents: "none",
          }}
        >
          اضغط للإيقاف
        </p>

        {/* Hero text */}
        <div
          className="py-[14px]"
          style={{
            opacity: isLanding ? 1 : 0,
            maxHeight: isLanding ? 200 : 0,
            overflow: "hidden",
            transition: `opacity 0.4s ease, max-height 0.7s ${EASE}`,
            pointerEvents: isLanding ? "auto" : "none",
          }}
        >
          <h1
            className="font-bold font-cairo text-foreground text-center hero-heading"
            style={{ fontSize: 28, lineHeight: 1.3, marginBottom: 12, padding: "0 var(--page-padding-mobile)" }}
          >
            سكوتك يضيع عليك فرص.
          </h1>
          <p
            className="font-light font-cairo text-muted-foreground text-center"
            style={{ fontSize: 14, marginBottom: 44, padding: "0 var(--page-padding-mobile)" }}
          >
            تحدياتنا تعلمك كيف تسولف بدون توتر
          </p>
        </div>

        {/* Circle */}
        <div
          className={isLanding ? "hero-float" : ""}
          style={{
            display: "inline-block",
            marginTop: 0,
            marginBottom: 0,
            opacity: 1,
            transform: "scale(1)",
            transition: `margin-top 0.7s ${EASE}, margin-bottom 0.7s ${EASE}, opacity 0.5s ease, transform 0.5s ease`,
            pointerEvents: "auto",
          }}
        >
          <div
            className="hero-stroke-wrapper"
            style={{
              padding: isSmall ? 4 : 5,
              transition: `padding 0.7s ${EASE}`,
            }}
          >
            <div
              className="hero-circle hero-circle-responsive"
              style={{
                width: isSmall ? 160 : 260,
                height: isSmall ? 160 : 260,
                cursor: "pointer",
                transition: `width 0.7s ${EASE}, height 0.7s ${EASE}`,
                animationDuration: isRecording ? "2s" : "3s",
                maxWidth: "calc(100vw - 40px)",
              }}
              onClick={handleCircleClick}
            >
              <div className="hero-text-overlay">
                {/* Landing text */}
                <span
                  className="font-cairo font-bold text-white"
                  style={{
                    fontSize: 18,
                    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                    opacity: isLanding ? 1 : 0,
                    position: isLanding ? "relative" : "absolute",
                    transition: "opacity 0.3s ease",
                  }}
                >
                  ابدأ التحدي
                </span>
                <span
                  className="font-cairo font-light"
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.6)",
                    opacity: isLanding ? 1 : 0,
                    position: isLanding ? "relative" : "absolute",
                    transition: "opacity 0.3s ease",
                  }}
                >
                  تكلم الآن
                </span>

                {/* Timer text */}
                <span
                  className="font-cairo font-bold"
                  style={{
                    fontSize: 28,
                    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                    opacity: isDark ? 1 : 0,
                    position: isDark ? "relative" : "absolute",
                    transition: "opacity 0.3s ease 0.3s, color 0.5s ease",
                    color: isRecording ? timerColor : "#FFFFFF",
                    animation:
                      isRecording && timeLeft <= 10
                        ? "timerPulse 0.8s ease-in-out infinite"
                        : "none",
                  }}
                >
                  {isRecording ? formatTime(timeLeft) : "1:00"}
                </span>
                <span
                  className="font-cairo font-light"
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.6)",
                    opacity: state === "topic" ? 1 : 0,
                    position: state === "topic" ? "relative" : "absolute",
                    transition: "opacity 0.3s ease",
                  }}
                >
                  جاهز؟
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Waveform bars */}
        <div
          className="flex items-center justify-center"
          style={{
            gap: 5,
            width: 80,
            height: 50,
            marginTop: isRecording ? 16 : 0,
            opacity: isRecording ? 1 : 0,
            transition: "opacity 0.4s ease, margin-top 0.4s ease",
            pointerEvents: "none",
          }}
        >
          {WAVE_BARS.map((_, i) => (
            <div
              key={i}
              className="waveform-bar"
              style={{
                width: 6,
                borderRadius: 999,
                backgroundColor: "#6C63FF",
                height: isRecording ? waveHeights[i] : 6,
                opacity: isRecording ? 1 : 0.3,
                transition: "height 0.1s linear",
              }}
            />
          ))}
        </div>

        {/* Silence indicator */}
        <p
          className="font-cairo font-light text-center"
          style={{
            fontSize: 13,
            color: "hsl(var(--muted-foreground))",
            opacity: showSilence && isRecording ? 1 : 0,
            transition: "opacity 0.4s ease",
            marginTop: 8,
            pointerEvents: "none",
          }}
        >
          استمر...
        </p>

        {/* Topic info */}
        <div
          style={{
            opacity: showTopic && topicFadeIn ? 1 : 0,
            transform: showTopic ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.2s ease, transform 0.5s ease",
            maxWidth: "calc(100% - 32px)",
            pointerEvents: showTopic ? "auto" : "none",
            maxHeight: showTopic ? 500 : 0,
            overflow: "hidden",
            padding: "0 var(--page-padding-mobile)",
          }}
        >
          <p className="font-cairo text-center" style={{ fontWeight: 300, fontSize: 12, color: "hsl(var(--muted-foreground))", marginBottom: 6 }}>
            تكلم عن:
          </p>
          <p className="font-cairo font-bold text-white text-center" style={{ fontSize: 18, marginBottom: 20 }}>
            {currentTopic.question}
          </p>
          <p className="font-cairo text-center" style={{ fontWeight: 300, fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
            الكلمات الممنوعة:
          </p>
          <div className="flex flex-wrap justify-center" style={{ gap: 8, maxWidth: 320, margin: "0 auto" }}>
            {currentTopic.forbiddenWords.slice(0, 3).map((word) => (
              <span
                key={word}
                className="font-cairo font-bold"
                style={{
                  fontSize: 13,
                  background: "rgba(255,68,68,0.08)",
                  border: "1px solid rgba(255,107,107,0.35)",
                  borderRadius: 999,
                  padding: "6px 16px",
                  color: "#FF6B6B",
                }}
              >
                {word}
              </span>
            ))}
          </div>

          <div style={{ height: 16 }} />
          <p className="font-cairo text-center" style={{ fontWeight: 300, fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
            كلمات الحشو:
          </p>
          <div className="flex flex-wrap justify-center" style={{ gap: 8, maxWidth: 320, margin: "0 auto" }}>
            {FILLER_PREVIEW.map((word) => (
              <span
                key={word}
                className="font-cairo font-bold"
                style={{
                  fontSize: 13,
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.35)",
                  borderRadius: 999,
                  padding: "6px 16px",
                  color: "#F59E0B",
                }}
              >
                {word}
              </span>
            ))}
          </div>

          {state === "topic" && swapCount < 2 && (
            <button
              type="button"
              onClick={swapTopic}
              className="font-cairo font-light"
              style={{
                marginTop: 20,
                border: "none",
                background: "none",
                color: "rgba(255,255,255,0.4)",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                cursor: "pointer",
                minHeight: 44,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.4)";
              }}
            >
              <RefreshCw size={18} />
              غيّر السؤال
            </button>
          )}
        </div>

        <AnalysisLoading
          processingDone={processingDone}
          visible={showLoading}
          onComplete={handleNavigateToResults}
        />

        {micErrorMessage && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 3000,
              backgroundColor: "#0F0F14",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 var(--page-padding-mobile)",
            }}
          >
            <div
              className="glass-card-dark"
              style={{
                width: "100%",
                maxWidth: 340,
                padding: 20,
                borderRadius: 20,
              }}
            >
              <p className="font-cairo font-light" style={{ fontSize: 14, color: "#FFFFFF", textAlign: "center" }}>
                {micErrorMessage}
              </p>
              <button
                type="button"
                onClick={beginRecordingFromLanding}
                className="font-cairo font-bold w-full"
                style={{
                  marginTop: 16,
                  background: "hsl(var(--primary))",
                  color: "white",
                  border: "none",
                  borderRadius: 999,
                  padding: "14px 0",
                  fontSize: 14,
                  cursor: "pointer",
                  minHeight: 44,
                }}
              >
                حاول مرة أخرى
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <p
            className="font-cairo font-light text-center mt-4"
            style={{ fontSize: 12, color: "#FF6B6B" }}
          >
            {errorMessage}
          </p>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .hero-heading { font-size: 34px !important; }
          .hero-circle-responsive { width: ${isSmall ? '160px' : '260px'} !important; height: ${isSmall ? '160px' : '260px'} !important; }
        }
        @media (min-width: 1024px) {
          .hero-heading { font-size: 38px !important; }
          .hero-circle-responsive { width: ${isSmall ? '160px' : '260px'} !important; height: ${isSmall ? '160px' : '260px'} !important; }
        }
        @media (max-width: 359px) {
          .hero-circle-responsive { width: ${isSmall ? '120px' : '200px'} !important; height: ${isSmall ? '120px' : '200px'} !important; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
