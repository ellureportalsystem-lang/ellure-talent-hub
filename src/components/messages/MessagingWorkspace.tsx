import { useCallback, useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Send, MessageSquare, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markConversationRead,
  getOrCreateConversation,
  searchMessageUsers,
  getConversationUnread,
  type ConversationRow,
  type MessageRow,
} from "@/services/messageService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MessagingWorkspaceProps {
  searchRoles?: string[];
  dashboardRole: "admin" | "client" | "applicant";
}

export function MessagingWorkspace({ searchRoles, dashboardRole }: MessagingWorkspaceProps) {
  const { user, profile } = useAuth();
  const userId = user?.id || "";
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [compose, setCompose] = useState("");
  const [sending, setSending] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [userResults, setUserResults] = useState<Awaited<ReturnType<typeof searchMessageUsers>>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    if (!userId) return;
    setLoadingConvs(true);
    try {
      const data = await fetchConversations(userId);
      setConversations(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load conversations");
    } finally {
      setLoadingConvs(false);
    }
  }, [userId]);

  const loadMessages = useCallback(async (convId: string) => {
    setLoadingMsgs(true);
    try {
      const data = await fetchMessages(convId);
      setMessages(data);
      await markConversationRead(convId, userId);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                unread_count_participant1: c.participant1_id === userId ? 0 : c.unread_count_participant1,
                unread_count_participant2: c.participant2_id === userId ? 0 : c.unread_count_participant2,
              }
            : c,
        ),
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load messages");
    } finally {
      setLoadingMsgs(false);
    }
  }, [userId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId);
  }, [activeId, loadMessages]);

  useEffect(() => {
    if (!activeId || !userId) return;
    const channel = supabase
      .channel(`messages:${activeId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${activeId}` },
        (payload) => {
          const row = payload.new as MessageRow;
          setMessages((prev) => (prev.some((m) => m.id === row.id) ? prev : [...prev, row]));
          if (row.to_user_id === userId) markConversationRead(activeId, userId);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeId, userId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!newOpen) return;
    const t = setTimeout(() => {
      searchMessageUsers(userId, userQuery, searchRoles).then(setUserResults);
    }, 300);
    return () => clearTimeout(t);
  }, [userQuery, newOpen, userId, searchRoles]);

  const activeConv = conversations.find((c) => c.id === activeId);
  const otherId = activeConv
    ? activeConv.participant1_id === userId
      ? activeConv.participant2_id
      : activeConv.participant1_id
    : null;

  const displayName = (p?: ConversationRow["other_profile"]) =>
    p?.full_name || p?.display_name || p?.email || "User";

  const handleSend = async () => {
    if (!compose.trim() || !activeId || !otherId) return;
    setSending(true);
    try {
      const msg = await sendMessage(activeId, userId, otherId, compose.trim());
      setMessages((prev) => [...prev, msg]);
      setCompose("");
      loadConversations();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Send failed");
    } finally {
      setSending(false);
    }
  };

  const startConversation = async (otherUserId: string) => {
    try {
      const id = await getOrCreateConversation(userId, otherUserId);
      setNewOpen(false);
      await loadConversations();
      setActiveId(id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start conversation");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Messages</h1>
        <p className="text-sm text-muted-foreground">Real-time conversations</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 min-h-[520px]">
        <Card className="lg:col-span-1 border-[var(--surface-border)] bg-[var(--surface-1)]">
          <CardContent className="p-0">
            <div className="p-3 border-b border-[var(--surface-border)]">
              <Button className="w-full" size="sm" onClick={() => setNewOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> New Message
              </Button>
            </div>
            <div className="max-h-[480px] overflow-y-auto divide-y divide-[var(--surface-border)]">
              {loadingConvs ? (
                <div className="p-3 space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
              ) : conversations.length === 0 ? (
                <EmptyState icon={MessageSquare} title="No conversations" description="Start a new message." className="py-8" />
              ) : (
                conversations.map((c) => {
                  const unread = getConversationUnread(c, userId);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      className={cn(
                        "w-full text-left p-3 hover:bg-[var(--surface-2)] transition-colors",
                        activeId === c.id && "bg-[var(--surface-2)]",
                      )}
                    >
                      <div className="flex gap-2">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={c.other_profile?.profile_image || undefined} />
                          <AvatarFallback>{displayName(c.other_profile).slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-1">
                            <span className="font-medium text-sm truncate">{displayName(c.other_profile)}</span>
                            {unread > 0 && <Badge className="h-5 min-w-5 px-1">{unread}</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{c.last_message_preview || "No messages yet"}</p>
                          {c.last_message_at && (
                            <p className="text-[10px] text-muted-foreground">
                              {formatDistanceToNow(new Date(c.last_message_at), { addSuffix: true })}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-[var(--surface-border)] bg-[var(--surface-1)] flex flex-col">
          <CardContent className="p-0 flex flex-col flex-1 min-h-[520px]">
            {!activeId ? (
              <EmptyState icon={MessageSquare} title="Select a conversation" description="Choose a thread or start a new one." className="flex-1 py-24" />
            ) : (
              <>
                <div className="p-4 border-b border-[var(--surface-border)]">
                  <p className="font-semibold">{displayName(activeConv?.other_profile)}</p>
                  <p className="text-xs text-muted-foreground capitalize">{activeConv?.other_profile?.role || dashboardRole}</p>
                </div>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[360px]">
                  {loadingMsgs ? (
                    <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-2/3" />)}</div>
                  ) : (
                    messages.map((m) => {
                      const mine = m.from_user_id === userId;
                      return (
                        <div key={m.id} className={cn("flex gap-2", mine && "flex-row-reverse")}>
                          <div
                            className={cn(
                              "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                              mine ? "bg-primary text-primary-foreground" : "bg-[var(--surface-2)]",
                            )}
                          >
                            <p className="whitespace-pre-wrap">{m.message}</p>
                            <p className={cn("text-[10px] mt-1", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                              {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="p-3 border-t border-[var(--surface-border)] flex gap-2">
                  <Textarea
                    value={compose}
                    onChange={(e) => setCompose(e.target.value)}
                    placeholder="Type a message…"
                    rows={2}
                    className="resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void handleSend();
                      }
                    }}
                  />
                  <Button size="icon" disabled={sending || !compose.trim()} onClick={() => void handleSend()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New conversation</DialogTitle></DialogHeader>
          <Input placeholder="Search by name or email" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} />
          <ul className="max-h-64 overflow-y-auto mt-2 divide-y">
            {userResults.map((u) => (
              <li key={u.id}>
                <button type="button" className="w-full text-left py-2 hover:bg-muted rounded px-2" onClick={() => void startConversation(u.id)}>
                  {u.full_name || u.email} <span className="text-xs text-muted-foreground">({u.role})</span>
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
