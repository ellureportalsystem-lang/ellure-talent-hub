import { cn } from "@/lib/utils";
import {
  authCartoonAlt,
  authCartoonAssets,
  type AuthCartoonVariant,
} from "@/lib/authCartoonAssets";

type AuthCartoonArtProps = {
  variant: AuthCartoonVariant;
  className?: string;
};

export function AuthCartoonArt({ variant, className }: AuthCartoonArtProps) {
  return (
    <div className={cn("auth-cartoon-wrap relative mx-auto w-full max-w-[340px]", className)}>
      <div
        className="pointer-events-none absolute inset-x-[12%] bottom-[4%] h-[18%] rounded-[50%] bg-[#0566CD]/10 blur-2xl"
        aria-hidden
      />
      <img
        src={authCartoonAssets[variant]}
        alt={authCartoonAlt[variant]}
        className="auth-cartoon-art relative z-[1] mx-auto h-auto w-full max-h-[280px] object-contain drop-shadow-[0_12px_28px_rgba(0,120,219,0.12)]"
        loading="eager"
      />
    </div>
  );
}
