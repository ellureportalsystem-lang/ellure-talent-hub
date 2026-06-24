import type { AuthError } from "@supabase/supabase-js";

export function isInvalidSessionError(error: AuthError | Error | null | undefined): boolean {
  if (!error) return false;
  const message = (error.message || "").toLowerCase();
  return (
    message.includes("refresh token") ||
    message.includes("invalid refresh") ||
    message.includes("session not found") ||
    message.includes("jwt expired") ||
    message.includes("token is expired") ||
    (error as AuthError).code === "refresh_token_not_found"
  );
}

export function clearSupabaseAuthStorage(): void {
  if (typeof window === "undefined") return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith("sb-") || key.includes("supabase.auth"))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
