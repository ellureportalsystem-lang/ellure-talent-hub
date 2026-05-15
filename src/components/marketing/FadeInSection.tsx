import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type FadeInSectionProps = HTMLMotionProps<"section"> & {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "section" | "motion.div";
};

export const FadeInSection = ({
  children,
  delay = 0,
  className,
  as = "section",
  ...props
}: FadeInSectionProps) => {
  const Component = as === "section" ? motion.section : motion.div;
  return (
    <Component
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative z-[1]", className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export default FadeInSection;
