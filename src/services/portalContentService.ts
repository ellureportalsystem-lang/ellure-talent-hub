import { supabase } from "@/lib/supabase";

export type PortalAudience = "recruiter" | "applicant" | "admin" | "all";

export type PortalBanner = {
  id: string;
  title: string;
  body: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_link: string | null;
  audience: PortalAudience;
  sort_order: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type PortalWebinar = {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  timezone: string | null;
  registration_url: string | null;
  audience: PortalAudience;
  is_active: boolean;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
};

export type PortalFaq = {
  id: string;
  question: string;
  answer: string;
  audience: PortalAudience;
  sort_order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

function audienceFilter(audience: PortalAudience) {
  return `audience.eq.${audience},audience.eq.all`;
}

export async function fetchActiveBanners(audience: PortalAudience) {
  const { data, error } = await supabase
    .from("portal_banners")
    .select("*")
    .or(audienceFilter(audience))
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as PortalBanner[];
}

export async function fetchUpcomingWebinars(audience: PortalAudience, limit = 5) {
  const { data, error } = await supabase
    .from("portal_webinars")
    .select("*")
    .or(audienceFilter(audience))
    .gte("scheduled_at", new Date(Date.now() - 86400000).toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as PortalWebinar[];
}

export async function fetchActiveFaqs(audience: PortalAudience) {
  const { data, error } = await supabase
    .from("portal_faqs")
    .select("*")
    .or(audienceFilter(audience))
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as PortalFaq[];
}

export async function fetchAllBannersAdmin() {
  const { data, error } = await supabase
    .from("portal_banners")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as PortalBanner[];
}

export async function fetchAllWebinarsAdmin() {
  const { data, error } = await supabase
    .from("portal_webinars")
    .select("*")
    .order("scheduled_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as PortalWebinar[];
}

export async function fetchAllFaqsAdmin() {
  const { data, error } = await supabase
    .from("portal_faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as PortalFaq[];
}

export async function upsertBanner(
  payload: Partial<PortalBanner> & Pick<PortalBanner, "title" | "audience">,
  userId?: string
) {
  const row = {
    ...payload,
    updated_at: new Date().toISOString(),
    ...(userId && !payload.id ? { created_by: userId } : {}),
  };
  if (payload.id) {
    const { data, error } = await supabase
      .from("portal_banners")
      .update(row)
      .eq("id", payload.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as PortalBanner;
  }
  const { data, error } = await supabase.from("portal_banners").insert(row).select().single();
  if (error) throw new Error(error.message);
  return data as PortalBanner;
}

export async function upsertWebinar(
  payload: Partial<PortalWebinar> & Pick<PortalWebinar, "title" | "scheduled_at" | "audience">,
  userId?: string
) {
  const row = {
    ...payload,
    updated_at: new Date().toISOString(),
    ...(userId && !payload.id ? { created_by: userId } : {}),
  };
  if (payload.id) {
    const { data, error } = await supabase
      .from("portal_webinars")
      .update(row)
      .eq("id", payload.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as PortalWebinar;
  }
  const { data, error } = await supabase.from("portal_webinars").insert(row).select().single();
  if (error) throw new Error(error.message);
  return data as PortalWebinar;
}

export async function upsertFaq(
  payload: Partial<PortalFaq> & Pick<PortalFaq, "question" | "answer" | "audience">,
  userId?: string
) {
  const row = {
    ...payload,
    updated_at: new Date().toISOString(),
    ...(userId && !payload.id ? { created_by: userId } : {}),
  };
  if (payload.id) {
    const { data, error } = await supabase
      .from("portal_faqs")
      .update(row)
      .eq("id", payload.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as PortalFaq;
  }
  const { data, error } = await supabase.from("portal_faqs").insert(row).select().single();
  if (error) throw new Error(error.message);
  return data as PortalFaq;
}

export async function deleteBanner(id: string) {
  const { error } = await supabase.from("portal_banners").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteWebinar(id: string) {
  const { error } = await supabase.from("portal_webinars").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteFaq(id: string) {
  const { error } = await supabase.from("portal_faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
