import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchConversations, getTotalUnread } from "@/services/messageService";

export function useUnreadMessageCount() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["unread-messages-total", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const conversations = await fetchConversations(user.id);
      return getTotalUnread(conversations, user.id);
    },
    enabled: !!user?.id,
    refetchInterval: 45_000,
  });
}
