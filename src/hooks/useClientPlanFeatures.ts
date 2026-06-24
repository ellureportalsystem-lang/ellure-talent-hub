import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useClientContext } from "@/hooks/useClientContext";
import { resolveCvDownloadLimit } from "@/services/clientPlanHelper";
import { supabase } from "@/lib/supabase";

type PlanFeatures = {
  can_send_nvite?: boolean;
  can_boolean_search?: boolean;
  can_radius_search?: boolean;
};

export function useClientPlanFeatures() {
  const { data: ctx, isLoading } = useClientContext();
  const clientId = ctx?.client?.id;

  const { data: savedSearchCount = 0 } = useQuery({
    queryKey: ["saved-search-count", clientId],
    queryFn: async () => {
      if (!clientId) return 0;
      const { count } = await supabase
        .from("saved_searches")
        .select("*", { count: "exact", head: true })
        .eq("client_id", clientId);
      return count ?? 0;
    },
    enabled: !!clientId,
  });

  return useMemo(() => {
    const client = ctx?.client;
    const plan = client?.subscription_plans;
    const features = (plan?.features ?? {}) as PlanFeatures;

    const cvUsed = (client?.cv_downloads_used_this_month as number) ?? 0;
    const cvLimit = resolveCvDownloadLimit(client ?? {}, plan);
    const jobsUsed = (client?.job_postings_used as number) ?? 0;
    const jobsLimit = plan?.max_active_jobs ?? plan?.max_job_postings ?? 0;
    const maxSaved = plan?.max_saved_searches ?? 10;

    const canBulkDownload = plan?.can_bulk_download === true;
    const canDownloadCV = canBulkDownload || cvUsed < cvLimit;
    const canSeeContactDetails = plan?.can_see_contact_details === true;
    const canSendNvite = features.can_send_nvite === true;
    const canBooleanSearch = features.can_boolean_search !== false;
    const canExportExcel = plan?.can_export_excel === true;

    return {
      isLoading,
      client,
      plan,
      canDownloadCV,
      canSeeContactDetails,
      canSendNvite,
      canBooleanSearch,
      canExportExcel,
      remainingCVs: Math.max(0, cvLimit - cvUsed),
      remainingJobs: Math.max(0, jobsLimit - jobsUsed),
      remainingSavedSearches: Math.max(0, maxSaved - savedSearchCount),
      cvLimit,
      cvUsed,
      savedSearchCount,
    };
  }, [ctx, isLoading, savedSearchCount]);
}
