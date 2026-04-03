import type { AuthError } from "@supabase/supabase-js";

export function getAuthErrorMessageAr(error: AuthError, mode: "signup" | "login"): string {
  const msg = (error.message || "").toLowerCase();
  const code = error.code || "";

  if (mode === "signup") {
    if (
      code === "user_already_exists" ||
      msg.includes("already registered") ||
      msg.includes("user already") ||
      msg.includes("already been registered")
    ) {
      return "البريد مستخدم مسبقاً";
    }
    if (code === "weak_password" || msg.includes("password should") || msg.includes("password is")) {
      return "كلمة المرور ضعيفة";
    }
  }

  if (mode === "login") {
    if (
      code === "invalid_credentials" ||
      msg.includes("invalid login") ||
      msg.includes("invalid email or password")
    ) {
      return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
    }
  }

  if (msg.includes("email not confirmed") || msg.includes("confirm")) {
    return "يرجى تأكيد البريد الإلكتروني أولاً";
  }
  if (msg.includes("rate limit") || msg.includes("too many")) {
    return "محاولات كثيرة، حاول لاحقاً";
  }
  if (msg.includes("network") || msg.includes("fetch")) {
    return "تعذر الاتصال، تحقق من الشبكة";
  }

  return "حدث خطأ، حاول مرة أخرى";
}
