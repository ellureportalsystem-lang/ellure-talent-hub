import { FeatureBentoCard, type FeatureBentoItem } from "@/components/marketing/FeatureBentoCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

type FeaturesBentoGridProps = {
  features: FeatureBentoItem[];
  className?: string;
};

/** Bento layout: tall lead card, four compact cells, wide closing card */
export function FeaturesBentoGrid({ features, className }: FeaturesBentoGridProps) {
  const [lead, analytics, bulk, security, collaboration, matching] = features;

  if (!lead || features.length < 6) {
    return null;
  }

  return (
    <motion.div
      className={cn(
        "grid w-full grid-cols-1 gap-4 auto-rows-[minmax(160px,auto)] md:grid-cols-3 md:grid-rows-3 md:gap-5",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-2">
        <FeatureBentoCard feature={lead} size="tall" />
      </motion.div>

      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        <FeatureBentoCard feature={analytics} />
      </motion.div>

      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        <FeatureBentoCard feature={bulk} />
      </motion.div>

      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        <FeatureBentoCard feature={security} />
      </motion.div>

      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        <FeatureBentoCard feature={collaboration} />
      </motion.div>

      <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1">
        <FeatureBentoCard feature={matching} size="wide" />
      </motion.div>
    </motion.div>
  );
}
