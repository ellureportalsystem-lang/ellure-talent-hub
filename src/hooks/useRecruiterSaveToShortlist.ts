import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useShortlists } from "@/hooks/useShortlists";
import { createShortlist } from "@/services/shortlistService";
import { toast } from "sonner";

export function useRecruiterSaveToShortlist() {
  const { user } = useAuth();
  const { folders, addToFolder, reload } = useShortlists("client");

  const saveApplicant = useCallback(
    async (applicantId: string) => {
      if (!user?.id) {
        toast.error("Sign in to save candidates");
        return false;
      }

      let folderId = folders[0]?.id;
      if (!folderId) {
        const { data, error } = await createShortlist(
          user.id,
          "client",
          "Shortlist",
          "Saved from Resdex"
        );
        if (error || !data) {
          toast.error(error?.message ?? "Could not create folder");
          return false;
        }
        folderId = data.id;
        await reload();
      }

      const inFolder = folders.some((f) => f.applicants.some((a) => a.id === applicantId));
      if (inFolder) {
        toast.info("Candidate is already in your shortlist");
        return true;
      }

      return addToFolder(folderId, [applicantId]);
    },
    [user?.id, folders, addToFolder, reload]
  );

  return { saveApplicant };
}
