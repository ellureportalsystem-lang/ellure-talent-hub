import { Link } from "react-router-dom";
import { MessageCircle, Phone, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const WHATSAPP_URL = "https://wa.me/917517383196";
const PHONE_URL = "tel:+917517383196";

/** Fixed bottom conversion bar on phone — hidden from md up. */
export function MarketingMobileCTA({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "marketing-mobile-cta fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-md md:hidden",
        className
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="navigation"
      aria-label="Quick actions"
    >
      <div className="flex items-stretch gap-2 px-3 py-2.5">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="touch-target flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3.5 text-sm font-semibold text-white shadow-sm active:scale-95 transition-transform"
        >
          <MessageCircle className="h-5 w-5 shrink-0" />
          <span className="truncate">WhatsApp</span>
        </a>
        <a
          href={PHONE_URL}
          className="touch-target flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-sm active:scale-95 transition-transform"
          aria-label="Call us"
        >
          <Phone className="h-5 w-5" />
        </a>
        <Link
          to="/contact"
          className="touch-target flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm active:scale-95 transition-transform"
        >
          <UserPlus className="h-5 w-5 shrink-0" />
          <span className="truncate">Hire</span>
        </Link>
      </div>
    </div>
  );
}
