import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PortalFormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function PortalFormSection({ title, description, children, className }: PortalFormSectionProps) {
  return (
    <section className={cn("portal-panel-card overflow-hidden", className)}>
      <div className="border-b border-border/50 bg-muted/20 px-5 py-3.5">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}
