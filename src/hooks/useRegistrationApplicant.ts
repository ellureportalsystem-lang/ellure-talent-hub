import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getOrCreateApplicant, loadRegistrationData } from "@/services/registrationService";

export function useRegistrationApplicant() {
  const { user, profile } = useAuth();
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [data, setData] = useState<Awaited<ReturnType<typeof loadRegistrationData>>>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.id || !user.email) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const applicant = await getOrCreateApplicant(user.id, user.email);
      setApplicantId(applicant.id);
      const full = await loadRegistrationData(user.id);
      setData(full);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.email]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    user,
    profile,
    applicantId,
    data,
    loading,
    refresh,
    email: user?.email || profile?.email || "",
  };
}
