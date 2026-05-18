import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface OldApplicantWelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

export function OldApplicantWelcomeModal({ open, onClose }: OldApplicantWelcomeModalProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome back!</DialogTitle>
          <DialogDescription>
            We&apos;ve pre-loaded your profile from our records. Please review and complete any
            missing details so recruiters can find you.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              onClose();
              navigate("/dashboard/applicant/profile");
            }}
          >
            Review My Profile
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={onClose}>
            Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
