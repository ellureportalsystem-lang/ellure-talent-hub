import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";

interface ApplicantProfileDrawerProps {
  applicantId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplicantProfileDrawer({ applicantId, open, onOpenChange }: ApplicantProfileDrawerProps) {
  const [applicant, setApplicant] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !applicantId) return;
    setLoading(true);
    supabase
      .from("applicants")
      .select("id, name, email, mobile, key_skills, total_experience_years, city, highest_qualification, summary, profile_image")
      .eq("id", applicantId)
      .single()
      .then(({ data }) => setApplicant(data))
      .finally(() => setLoading(false));
  }, [applicantId, open]);

  const skills = (() => {
    const ks = applicant?.key_skills;
    if (Array.isArray(ks)) return ks as string[];
    if (typeof ks === "string") return ks.split(/[,;|]/).map((s) => s.trim()).filter(Boolean);
    return [];
  })();

  const initials = String(applicant?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-[var(--surface-1)]">
        <SheetHeader>
          <SheetTitle>Applicant Profile</SheetTitle>
        </SheetHeader>
        {loading ? (
          <div className="space-y-3 mt-6">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : applicant ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={applicant.profile_image as string} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{String(applicant.name)}</p>
                <p className="text-sm text-muted-foreground">{String(applicant.email || "")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Experience</span><p>{String(applicant.total_experience_years ?? "—")} yrs</p></div>
              <div><span className="text-muted-foreground">City</span><p>{String(applicant.city ?? "—")}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground">Education</span><p>{String(applicant.highest_qualification ?? "—")}</p></div>
            </div>
            {skills.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Key Skills</p>
                <div className="flex flex-wrap gap-1">
                  {skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
                </div>
              </div>
            )}
            {applicant.summary && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Summary</p>
                <p className="text-sm">{String(applicant.summary)}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm mt-6">Profile not found.</p>
        )}
      </SheetContent>
    </Sheet>
  );
}
