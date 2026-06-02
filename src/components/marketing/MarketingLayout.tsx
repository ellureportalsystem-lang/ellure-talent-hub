import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import FloatingGeometry from "./FloatingGeometry";

import { MarketingMobileCTA } from "./MarketingMobileCTA";

import { ElluraChatbot } from "./ElluraChatbot";



type MarketingLayoutProps = {

  children: React.ReactNode;

  className?: string;

  showGeometry?: boolean;

  /** Fixed bottom WhatsApp / call / hire bar on phone */

  showMobileCta?: boolean;

  /** Clean white SaaS landing (BharatGo-style) — no floating geometry */

  variant?: "default" | "saas";

};



/** Wraps public marketing pages — floating geometry + mobile-safe overflow + optional bottom CTA */

const MarketingLayout = ({

  children,

  className,

  showGeometry = true,

  showMobileCta = false,

  variant = "default",

}: MarketingLayoutProps) => (

  <div

    className={cn(

      "min-h-screen relative overflow-x-hidden",

      variant === "saas" ? "marketing-layout-saas bg-background" : "bg-gradient-subtle",

      className

    )}

  >

    {showGeometry && variant !== "saas" && <FloatingGeometry />}

    <motion.div

      className={cn(

        "relative z-[1]",

        showMobileCta && "marketing-mobile-content-pad md:pb-0"

      )}

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      transition={{ duration: 0.35 }}

    >

      {children}

    </motion.div>

    {showMobileCta ? <ElluraChatbot /> : null}

  </div>

);



export default MarketingLayout;

