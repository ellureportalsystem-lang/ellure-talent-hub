import { BrandLogo } from "@/components/brand/BrandLogo";

type BrandWordmarkProps = {
  className?: string;
  size?: "nav" | "footer" | "md" | "lg";
  /** Subtle glow on dark hero chrome */
  onDark?: boolean;
};

/** Full horizontal logo — mark (part 1) + name (part 2) */
export function BrandWordmark({ className, size = "md", onDark = false }: BrandWordmarkProps) {
  return <BrandLogo className={className} size={size} onDark={onDark} />;
}
