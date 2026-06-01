import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import { BharatGoFinalCta } from "@/components/marketing/bharatgo/BharatGoFinalCta";

type MarketingSaasShellProps = {
  children: ReactNode;
  showMobileCta?: boolean;
  showFinalCta?: boolean;
};

/** BharatGo-style marketing chrome: light layout, saas nav, light footer */
export function MarketingSaasShell({
  children,
  showMobileCta = true,
  showFinalCta = true,
}: MarketingSaasShellProps) {
  return (
    <MarketingLayout variant="saas" showMobileCta={showMobileCta}>
      <Navbar variant="saas" />
      {children}
      {showFinalCta ? <BharatGoFinalCta /> : null}
      <Footer variant="light" />
    </MarketingLayout>
  );
}
