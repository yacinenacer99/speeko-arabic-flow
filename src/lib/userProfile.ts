import type { SupabaseClient } from "@supabase/supabase-js";

export type UserProfilePayload = {
  id: string;
  name: string;
  interests: string[];
  goal: string | null;
  level: string;
  language: string;
};

export const PENDING_ONBOARDING_KEY = "speeko_pending_onboarding";

export async function upsertUserProfile(supabase: SupabaseClient, payload: UserProfilePayload) {
  return supabase.from("users").upsert(
    {
      id: payload.id,
      name: payload.name,
      interests: payload.interests,
      goal: payload.goal,
      level: payload.level,
      language: payload.language,
    },
    { onConflict: "id" },
  );
}

export const defaultSignupProfile = (userId: string): UserProfilePayload => ({
  id: userId,
  name: "",
  interests: [],
  goal: null,
  level: "beginner",
  language: "ar",
});
