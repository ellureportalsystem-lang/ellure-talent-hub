import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import FloatingGeometry from "./FloatingGeometry";

type MarketingLayoutProps = {
  children: React.ReactNode;
  className?: string;
  showGeometry?: boolean;
};

/** Wraps public marketing pages — floating geometry + mobile-safe overflow */
const MarketingLayout = ({ children, className, showGeometry = true }: MarketingLayoutProps) => (
  <div className={cn("min-h-screen bg-gradient-subtle relative overflow-x-hidden", className)}>
    {showGeometry && <FloatingGeometry />}
    <motion.div
      className="relative z-[1]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  </div>
);

export default MarketingLayout;
