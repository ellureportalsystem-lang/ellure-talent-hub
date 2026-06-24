import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { naukriCardClass } from "@/components/dashboard/naukri/naukriShellStyles";
import type { PortalWebinar } from "@/services/portalContentService";
import { cn } from "@/lib/utils";

function formatWebinarDate(iso: string, timezone?: string | null) {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const tz = timezone?.replace("_", " ") ?? "IST";
  return { date, time: `${time} ${tz}` };
}

type PortalWebinarsPanelProps = {
  webinars: PortalWebinar[];
  className?: string;
};

export function PortalWebinarsPanel({ webinars, className }: PortalWebinarsPanelProps) {
  if (webinars.length === 0) return null;

  return (
    <Card className={cn(naukriCardClass, "bg-[#f4f5f7] border-[#e8e8e8]", className)}>
      <CardContent className="p-5">
        <p className="text-sm font-semibold text-[#333] mb-3">Upcoming webinars</p>
        <div className="space-y-4">
          {webinars.slice(0, 3).map((w) => {
            const { date, time } = formatWebinarDate(w.scheduled_at, w.timezone);
            return (
              <div key={w.id}>
                <span className="inline-block rounded bg-[#0566CD] px-2 py-0.5 text-[10px] font-medium text-white">
                  {date}
                </span>
                <p className="mt-2 text-sm text-[#333] leading-relaxed">{w.title}</p>
                {w.description && (
                  <p className="mt-1 text-xs text-[#666] line-clamp-2">{w.description}</p>
                )}
                <p className="text-xs text-[#666] mt-1">{time}</p>
                {w.registration_url && (
                  <Button variant="link" className="mt-1 h-auto p-0 text-[#0566CD] text-sm" asChild>
                    <a href={w.registration_url} target="_blank" rel="noreferrer">
                      Register now
                    </a>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
