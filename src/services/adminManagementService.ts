import { supabase } from "@/lib/supabase";

export type RecruiterExpiryRow = {
  id: string;
  company_name: string;
  contact_email: string | null;
  subscription_plan: string | null;
  subscription_end_date: string;
  days_left: number;
};

export async function fetchRecruitersNearExpiry(withinDays = 7): Promise<RecruiterExpiryRow[]> {
  const now = new Date();
  const end = new Date();
  end.setDate(end.getDate() + withinDays);

  const { data, error } = await supabase
    .from("clients")
    .select("id, company_name, contact_email, subscription_plan, subscription_end_date")
    .eq("is_active", true)
    .not("subscription_end_date", "is", null)
    .gte("subscription_end_date", now.toISOString())
    .lte("subscription_end_date", end.toISOString())
    .order("subscription_end_date", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((r) => {
    const endDate = new Date(r.subscription_end_date!);
    const days_left = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      id: r.id,
      company_name: r.company_name,
      contact_email: r.contact_email,
      subscription_plan: r.subscription_plan,
      subscription_end_date: r.subscription_end_date!,
      days_left,
    };
  });
}
