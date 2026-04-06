// Session context — shares latest session result between challenge and results pages.

import { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { SessionResult } from "@/types/session";

interface SessionContextType {
  latestSession: SessionResult | null;
  setLatestSession: (session: SessionResult | null) => void;
  loadSessionById: (sessionId: string) => Promise<SessionResult | null>;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType>({
  latestSession: null,
  setLatestSession: () => {},
  loadSessionById: async () => null,
  clearSession: () => {},
});

/**
 * Provider for session state and loading helpers.
 * @param children React subtree to wrap.
 */
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [latestSession, setLatestSessionState] = useState<SessionResult | null>(null);

  const setLatestSession = (session: SessionResult | null) => {
    setLatestSessionState(session);
  };

  const clearSession = () => setLatestSessionState(null);

  const loadSessionById = async (sessionId: string): Promise<SessionResult | null> => {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select(
          "id, topic, duration, flow_score, filler_count, forbidden_used, pace, longest_pause, word_count, transcript, challenge_type, analysis, xp_breakdown, stage_advancement, streak_count, created_at",
        )
        .eq("id", sessionId)
        .maybeSingle();

      if (error) {
        console.log("[MLASOON:DB_ERROR] sessions:", error.message);
        return null;
      }
      if (!data) return null;

      const analysis = data.analysis as SessionResult["analysis"];
      const xp = data.xp_breakdown as SessionResult["xp"];
      const stageAdvancement = data.stage_advancement as SessionResult["stageAdvancement"];

      return {
        sessionId: data.id,
        topic: data.topic ?? "",
        analysis,
        xp,
        stageAdvancement,
        streakCount: data.streak_count ?? 0,
        streakLost: false,
        previousStreak: 0,
        timestamp: data.created_at ?? new Date().toISOString(),
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.log("[MLASOON:DB_ERROR] sessions:", message);
      return null;
    }
  };

  return (
    <SessionContext.Provider
      value={{
        latestSession,
        setLatestSession,
        loadSessionById,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

/**
 * Hook to use the current SessionContext.
 * @returns Session context value.
 */
export const useSessionContext = () => useContext(SessionContext);

