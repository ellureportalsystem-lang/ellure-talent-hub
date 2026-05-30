import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const WHATSAPP_URL = "https://wa.me/917517383196";

/** Floating WhatsApp — tablet/desktop only; phone uses MarketingMobileCTA bar. */
export function MarketingWhatsAppFab({ className }: { className?: string }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        "fixed bottom-6 right-6 z-30 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 md:flex",
        className
      )}
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
