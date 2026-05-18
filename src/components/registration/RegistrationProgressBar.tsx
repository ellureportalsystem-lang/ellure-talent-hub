import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { REGISTRATION_STEPS } from "@/services/registrationService";
import { cn } from "@/lib/utils";

interface RegistrationProgressBarProps {
  currentStep: number;
}

export function RegistrationProgressBar({ currentStep }: RegistrationProgressBarProps) {
  return (
    <nav className="mb-8 overflow-x-auto pb-2" aria-label="Registration progress">
      <ol className="flex min-w-[640px] gap-1">
        {REGISTRATION_STEPS.map((step) => {
          const done = step.num < currentStep;
          const active = step.num === currentStep;
          const clickable = done;

          const content = (
            <>
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold border-2 transition-colors",
                  done && "bg-primary border-primary text-primary-foreground",
                  active && !done && "border-primary text-primary bg-primary/10",
                  !done && !active && "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : step.num}
              </span>
              <span
                className={cn(
                  "text-[11px] mt-1 text-center max-w-[72px] leading-tight",
                  active ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </>
          );

          return (
            <li key={step.num} className="flex-1 flex flex-col items-center">
              {clickable ? (
                <Link to={step.path} className="flex flex-col items-center hover:opacity-80">
                  {content}
                </Link>
              ) : (
                <div className="flex flex-col items-center">{content}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
