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
  Star,
  FolderPlus,
  Download,
  Trash2,
  Mail,
  UserPlus,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  File,
  X,
} from "lucide-react";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  isAdmin?: boolean;
}

const BulkActionsBar = ({
  selectedCount,
  onClearSelection,
  isAdmin = true,
}: BulkActionsBarProps) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
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
              >
                <Star className="h-4 w-4" />
                Shortlist
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-background hover:bg-background/20 gap-2"
              >
                <FolderPlus className="h-4 w-4" />
                Add to Folder
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-background hover:bg-background/20 gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-success" />
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4 text-destructive" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <File className="mr-2 h-4 w-4 text-primary" />
                    Export as Word
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                className="text-background hover:bg-background/20 gap-2"
              >
                <Mail className="h-4 w-4" />
                Message
              </Button>

              {isAdmin && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-background hover:bg-background/20 gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Assign
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/20 gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActionsBar;
