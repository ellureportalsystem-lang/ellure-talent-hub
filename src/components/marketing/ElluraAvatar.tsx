import { cn } from "@/lib/utils";
import type { ElluraMood } from "./elluraTypes";

export const ELLURA_MASCOT_SRC = "/mascot.png";

export type ElluraAvatarProps = {
  size?: number;
  /** Kept for API compatibility — same mascot asset for all moods */
  mood?: ElluraMood;
  className?: string;
  animate?: boolean;
  showHoverShadow?: boolean;
};

/** NexHire mascot — transparent PNG from `public/mascot.png` */
export function ElluraAvatar({
  size = 56,
  mood: _mood = "idle",
  className,
  animate = false,
  showHoverShadow = false,
}: ElluraAvatarProps) {
  const height = Math.round(size * 1.12);

  return (
    <div
      className={cn(
        "ellura-avatar-wrap relative inline-flex flex-col items-center justify-end bg-transparent",
        className
      )}
      style={{ width: size, minHeight: height }}
      aria-hidden
    >
      {showHoverShadow ? (
        <div
          className="ellura-avatar-ground-glow pointer-events-none"
          style={{ width: Math.round(size * 0.78) }}
        />
      ) : null}

      <img
        src={ELLURA_MASCOT_SRC}
        alt=""
        width={size}
        height={height}
        draggable={false}
        className={cn(
          "ellura-avatar-img relative z-[1] block h-auto max-w-full select-none object-contain",
          animate && "ellura-avatar-float"
        )}
        style={{
          width: size,
          height: "auto",
          maxHeight: height,
          marginBottom: showHoverShadow ? Math.round(size * 0.06) : 0,
        }}
      />
    </div>
  );
}

export default ElluraAvatar;
