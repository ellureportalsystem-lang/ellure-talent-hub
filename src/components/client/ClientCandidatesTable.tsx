import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Lock } from "lucide-react";
import type { Applicant } from "@/hooks/useApplicants";
import { parseSkills } from "@/lib/applicantProfileUtils";

type ClientCandidatesTableProps = {
  applicants: Applicant[];
  canSeeContact: boolean;
  onDownloadCv: (applicantId: string) => void;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ClientCandidatesTable({
  applicants,
  canSeeContact,
  onDownloadCv,
}: ClientCandidatesTableProps) {
  return (
    <div className="dashboard-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-sm">
          <thead className="bg-[var(--surface-2)] text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2.5 text-left font-medium">Candidate</th>
              <th className="px-3 py-2.5 text-left font-medium">Experience</th>
              <th className="px-3 py-2.5 text-left font-medium">Location</th>
              <th className="px-3 py-2.5 text-left font-medium">Skills</th>
              <th className="px-3 py-2.5 text-left font-medium whitespace-nowrap">Contact</th>
              <th className="px-3 py-2.5 text-left font-medium whitespace-nowrap">Profile</th>
              <th className="px-3 py-2.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((a) => {
              const skills = parseSkills(a.key_skills).slice(0, 3);
              const extraSkills = parseSkills(a.key_skills).length - skills.length;
              const completion = a.profile_complete_percent ?? a.profileCompletion ?? 0;
              const name = a.name || "Unknown";
              const role =
                a.current_designation || a.designation || a.job_role || "—";
              const exp =
                a.total_experience_years != null ? `${a.total_experience_years} yrs` : "—";
              const city = a.city || a.currentCity || "—";
              const phone = a.phone || a.mobile_number;
              const email = a.email || a.email_address;

              return (
                <tr
                  key={a.id}
                  className="border-t border-[var(--surface-border)] hover:bg-[var(--surface-2)]/60"
                >
                  <td className="px-3 py-2.5 max-w-[220px]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={a.profile_image || a.profilePhoto || undefined} />
                        <AvatarFallback className="text-[10px]">{initials(name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <Link
                          to={`/dashboard/client/candidates/${a.id}`}
                          className="font-medium text-foreground hover:text-primary truncate block"
                          title={name}
                        >
                          {name}
                        </Link>
                        <p className="text-xs text-muted-foreground truncate" title={role}>
                          {role}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">{exp}</td>
                  <td className="px-3 py-2.5 max-w-[120px]">
                    <span className="truncate block text-muted-foreground" title={city}>
                      {city}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 max-w-[180px]">
                    <div className="flex flex-wrap gap-1">
                      {skills.length === 0 ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <>
                          {skills.map((s) => (
                            <Badge
                              key={s}
                              variant="secondary"
                              className="text-[10px] font-normal max-w-[5.5rem] truncate"
                            >
                              {s}
                            </Badge>
                          ))}
                          {extraSkills > 0 && (
                            <span className="text-[10px] text-muted-foreground self-center">
                              +{extraSkills}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 max-w-[160px]">
                    {canSeeContact ? (
                      <div className="min-w-0 space-y-0.5 text-xs">
                        <p className="truncate" title={phone || undefined}>
                          {phone || "—"}
                        </p>
                        <p className="truncate text-muted-foreground" title={email || undefined}>
                          {email || "—"}
                        </p>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-muted-foreground/25 bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground">
                        <Lock className="h-3 w-3 shrink-0" />
                        <span>Plan upgrade</span>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="text-xs font-medium tabular-nums">{completion}%</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="outline" className="h-8 px-2 text-xs" asChild>
                        <Link to={`/dashboard/client/candidates/${a.id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-xs"
                        onClick={() => onDownloadCv(a.id)}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}



