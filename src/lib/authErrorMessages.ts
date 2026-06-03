type SignInPortal = "applicant" | "admin" | "client" | "default";

/** User-facing auth error text (Supabase returns generic messages). */
export function getSignInErrorMessage(
  message: string,
  portal: SignInPortal = "default"
): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid credentials")) {
    if (portal === "applicant") {
      return "Incorrect email or password. If you registered online, use the password you chose. Bulk-imported accounts may use applicant@123. Use Forgot password to reset.";
    }
    return "Incorrect email or password. Use Forgot password, or sign in via Admin Login if this is an admin account.";
  }
  if (
    m.includes("email not confirmed") ||
    m.includes("email_not_confirmed") ||
    m.includes("confirm your email")
  ) {
    return "Please confirm your email before signing in (check your inbox and spam folder).";
  }
  if (m.includes("user already registered") || m.includes("already been registered")) {
    return "This email is already registered. Sign in instead, or use Forgot password.";
  }
  if (m.includes("too many requests")) {
    return "Too many attempts. Wait a few minutes and try again.";
  }
  return message;
}
