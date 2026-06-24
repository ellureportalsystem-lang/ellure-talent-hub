import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderPlus, Download, ChevronDown, FileSpreadsheet, X, Trash2 } from "lucide-react";
import type { Applicant } from "@/hooks/useApplicants";
import type { FolderView } from "@/hooks/useShortlists";

interface BulkActionsBarProps {
  selectedCount: number;
  selectedIds: string[];
  selectedApplicants: Applicant[];
  folders: FolderView[];
  onClearSelection: () => void;
  onAddToFolder: (folderId: string, applicantIds: string[]) => Promise<boolean>;
  onExportExcel: (applicants: Applicant[]) => void;
  onExportCsv: (applicants: Applicant[]) => void;
  onStatusChange?: (status: string, applicantIds: string[]) => Promise<void>;
  onDelete?: (applicantIds: string[]) => Promise<void>;
  isAdmin?: boolean;
}

const BulkActionsBar = ({
  selectedCount,
  selectedIds,
  selectedApplicants,
  folders,
  onClearSelection,
  onAddToFolder,
  onExportExcel,
  onExportCsv,
  onStatusChange,
  onDelete,
  isAdmin = true,
}: BulkActionsBarProps) => {
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAddToFolder = async () => {
    if (!selectedFolderId || selectedIds.length === 0) return;
    const ok = await onAddToFolder(selectedFolderId, selectedIds);
    if (ok) {
      setFolderDialogOpen(false);
      setSelectedFolderId("");
      onClearSelection();
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !selectedIds.length) return;
    setDeleting(true);
    try {
      await onDelete(selectedIds);
      setDeleteOpen(false);
      onClearSelection();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-foreground text-background px-6 py-3 rounded-full shadow-2xl flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  {selectedCount}
                </Badge>
                <span className="text-sm font-medium">selected</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSelection}
                  className="h-6 w-6 p-0 hover:bg-background/20 text-background"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-6 w-px bg-background/30" />
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-background hover:bg-background/20 gap-2"
                  onClick={() => setFolderDialogOpen(true)}
                >
                  <FolderPlus className="h-4 w-4" />
                  Add to Folder
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-background hover:bg-background/20 gap-2">
                      <Download className="h-4 w-4" />
                      Export
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    <DropdownMenuItem onClick={() => onExportCsv(selectedApplicants)}>
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExportExcel(selectedApplicants)}>
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-success" />
                      Export as Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {isAdmin && onStatusChange && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-background hover:bg-background/20 gap-2">
                        Set status
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                      {["submitted", "under_review", "shortlisted", "on_hold", "rejected", "hired"].map((s) => (
                        <DropdownMenuItem
                          key={s}
                          onClick={() => void onStatusChange(s, selectedIds).then(onClearSelection)}
                        >
                          {s.replace("_", " ")}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {isAdmin && onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-300 hover:bg-red-500/20 hover:text-red-200 gap-2"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add {selectedCount} candidates to folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {folders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No folders yet. Create one from the Folders page.</p>
            ) : (
              <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name} ({f.applicants.length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setFolderDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => void handleAddToFolder()} disabled={!selectedFolderId}>
                Add to folder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCount} candidate(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              Candidates will be soft-deleted and hidden from ResDex search. This action is logged in the audit
              trail. You can re-import them later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BulkActionsBar;
