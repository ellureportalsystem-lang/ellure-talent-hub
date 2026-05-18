import { supabase } from "@/lib/supabase";

export interface ConversationRow {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  unread_count_participant1: number;
  unread_count_participant2: number;
  other_profile?: {
    id: string;
    full_name: string | null;
    display_name: string | null;
    email: string | null;
    role: string | null;
    profile_image: string | null;
  };
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  from_user_id: string;
  to_user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

function otherParticipantId(c: ConversationRow, userId: string) {
  return c.participant1_id === userId ? c.participant2_id : c.participant1_id;
}

function unreadForUser(c: ConversationRow, userId: string) {
  return c.participant1_id === userId ? c.unread_count_participant1 : c.unread_count_participant2;
}

export async function fetchConversations(userId: string): Promise<ConversationRow[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error) throw new Error(error.message);

  const rows = data || [];
  const otherIds = [...new Set(rows.map((r) => otherParticipantId(r as ConversationRow, userId)))];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, display_name, email, role, profile_image")
    .in("id", otherIds);

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

  return rows.map((r) => ({
    ...(r as ConversationRow),
    other_profile: profileMap.get(otherParticipantId(r as ConversationRow, userId)),
  }));
}

export async function fetchMessages(conversationId: string, limit = 30, before?: string) {
  let q = supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (before) q = q.lt("created_at", before);

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return ((data || []) as MessageRow[]).reverse();
}

export async function sendMessage(
  conversationId: string,
  fromUserId: string,
  toUserId: string,
  text: string,
) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      from_user_id: fromUserId,
      to_user_id: toUserId,
      message: text,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  const preview = text.slice(0, 120);
  const { data: conv } = await supabase.from("conversations").select("*").eq("id", conversationId).single();
  if (conv) {
    const isP1Sender = conv.participant1_id === fromUserId;
    await supabase
      .from("conversations")
      .update({
        last_message_at: new Date().toISOString(),
        last_message_preview: preview,
        unread_count_participant1: isP1Sender
          ? conv.unread_count_participant1
          : (conv.unread_count_participant1 || 0) + 1,
        unread_count_participant2: !isP1Sender
          ? conv.unread_count_participant2
          : (conv.unread_count_participant2 || 0) + 1,
      })
      .eq("id", conversationId);
  }

  return data as MessageRow;
}

export async function markConversationRead(conversationId: string, userId: string) {
  const { data: conv } = await supabase.from("conversations").select("*").eq("id", conversationId).single();
  if (!conv) return;

  const isP1 = conv.participant1_id === userId;
  await supabase
    .from("conversations")
    .update(isP1 ? { unread_count_participant1: 0 } : { unread_count_participant2: 0 })
    .eq("id", conversationId);

  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .eq("to_user_id", userId)
    .eq("is_read", false);
}

export async function getOrCreateConversation(userId: string, otherUserId: string) {
  const [a, b] = userId < otherUserId ? [userId, otherUserId] : [otherUserId, userId];

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("participant1_id", a)
    .eq("participant2_id", b)
    .maybeSingle();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("conversations")
    .insert({ participant1_id: a, participant2_id: b })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

export async function searchMessageUsers(currentUserId: string, query: string, roles?: string[]) {
  let q = supabase
    .from("profiles")
    .select("id, full_name, display_name, email, role, profile_image")
    .neq("id", currentUserId)
    .limit(20);

  if (query.trim()) {
    q = q.or(`full_name.ilike.%${query}%,email.ilike.%${query}%,display_name.ilike.%${query}%`);
  }
  if (roles?.length) {
    q = q.in("role", roles);
  }

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
}

export function getConversationUnread(c: ConversationRow, userId: string) {
  return unreadForUser(c, userId);
}

export function getTotalUnread(conversations: ConversationRow[], userId: string) {
  return conversations.reduce((sum, c) => sum + unreadForUser(c, userId), 0);
}
