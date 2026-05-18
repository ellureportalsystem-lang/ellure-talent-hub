import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CVLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limit: number;
  resetDate: string;
}

export function CVLimitModal({ open, onOpenChange, limit, resetDate }: CVLimitModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>CV download limit reached</DialogTitle>
          <DialogDescription>
            You&apos;ve used all {limit} CV downloads for this month. Your limit resets on {resetDate}.
            Upgrade your plan for more downloads.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>OK</Button>
          <Button asChild>
            <Link to="/dashboard/client/billing">Upgrade Plan</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
