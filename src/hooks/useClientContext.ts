import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchClientByProfile } from "@/services/clientService";

export function useClientContext() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["client-context", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return fetchClientByProfile(user.id);
    },
    enabled: !!user?.id,
  });
}
