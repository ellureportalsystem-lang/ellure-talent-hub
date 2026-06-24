/** Ellure TalentHub — brand name, colors, and logo asset paths */

export const BRAND_NAME = "Ellure TalentHub" as const;
export const BRAND_NAME_SHORT = "TalentHub" as const;

export const brandColors = {
  primary: "#0566CD",
  secondary: "#1A9EB0",
  wordmark: "#3D4853",
  white: "#FFFFFF",
  logoBlue: "#004aad",
  logoRed: "#d4011b",
  deepBlue: "#010c7d",
  sky: "#0EA5E9",
  gold: "#E6B82E",
  amber: "#F59E0B",
  danger: "#EF4444",
  surface1: "#F8FAFC",
  surface2: "#F1F5F9",
  muted: "#94A3B8",
} as const;

export const brandLogos = {
  /** Icon mark — part 1 */
  mark: "/ellure-talenthub-mark.png",
  /** Wordmark text — part 2 */
  name: "/ellure-talenthub-name.png",
  /** Alias for collapsed / favicon contexts */
  icon: "/ellure-talenthub-mark.png",
  /** Name image only — prefer BrandLogo for full lockup */
  wordmark: "/ellure-talenthub-name.png",
  full: "/ellure-talenthub-full.jpeg",
  legacyPng: "/ellure-talenthub-mark.png",
  legacySvg: "/ellure-talenthub-mark.png",
} as const;
