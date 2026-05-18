import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchShortlists,
  createShortlist,
  deleteShortlist,
  addApplicantToShortlist,
  removeApplicantFromShortlist,
  type ShortlistWithItems,
  type ApplicantSummary,
} from "@/services/shortlistService";
import { toast } from "sonner";

export interface FolderView {
  id: string;
  name: string;
  description: string;
  color: string;
  isShared: boolean;
  createdAt: string;
  applicants: ApplicantSummary[];
}

function toFolderView(row: ShortlistWithItems): FolderView {
  const applicants = (row.shortlist_items ?? [])
    .map((item) => item.applicants)
    .filter((a): a is ApplicantSummary => Boolean(a));

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    color: row.color ?? "blue",
    isShared: row.is_shared ?? false,
    createdAt: row.created_at ? new Date(row.created_at).toLocaleDateString() : "",
    applicants,
  };
}

export function useShortlists(ownerType: "admin" | "client" = "admin") {
  const { user } = useAuth();
  const [folders, setFolders] = useState<FolderView[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) {
      setFolders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await fetchShortlists(user.id, ownerType);
    if (error) {
      toast.error(error.message);
      setFolders([]);
    } else {
      setFolders((data ?? []).map(toFolderView));
    }
    setLoading(false);
  }, [user?.id, ownerType]);

  useEffect(() => {
    void load();
  }, [load]);

  const createFolder = async (name: string, description?: string, color?: string) => {
    if (!user?.id) return false;
    const { error } = await createShortlist(user.id, ownerType, name, description, color);
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success("Folder created");
    await load();
    return true;
  };

  const removeFolder = async (id: string) => {
    const { error } = await deleteShortlist(id);
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success("Folder deleted");
    await load();
    return true;
  };

  const addToFolder = async (folderId: string, applicantIds: string[]) => {
    const results = await Promise.all(
      applicantIds.map((id) => addApplicantToShortlist(folderId, id))
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      toast.error(failed.error.message);
      return false;
    }
    toast.success(`Added ${applicantIds.length} candidate(s) to folder`);
    await load();
    return true;
  };

  const removeFromFolder = async (folderId: string, applicantId: string) => {
    const { error } = await removeApplicantFromShortlist(folderId, applicantId);
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success("Removed from folder");
    await load();
    return true;
  };

  return {
    folders,
    loading,
    reload: load,
    createFolder,
    removeFolder,
    addToFolder,
    removeFromFolder,
  };
}
