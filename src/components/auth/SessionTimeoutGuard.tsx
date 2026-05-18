import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useInactivityTimeout } from "@/hooks/useInactivityTimeout";
import { SessionExpiryModal } from "@/components/auth/SessionExpiryModal";

export function SessionTimeoutGuard({ children }: { children: React.ReactNode }) {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const onExpire = useCallback(async () => {
    await signOut();
    navigate("/auth/login?reason=timeout");
  }, [signOut, navigate]);

  const { showWarning, secondsLeft, stayLoggedIn } = useInactivityTimeout(onExpire, !!session);

  return (
    <>
      {children}
      <SessionExpiryModal open={showWarning} secondsLeft={secondsLeft} onStayLoggedIn={stayLoggedIn} />
    </>
  );
}
