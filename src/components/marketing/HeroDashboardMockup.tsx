import { motion } from "framer-motion";

const HeroDashboardMockup = ({ className = "" }: { className?: string }) => (
  <motion.div
    className={`relative w-full max-w-[280px] sm:max-w-md mx-auto lg:mx-0 lg:ml-auto ${className}`}
    initial={{ opacity: 0, y: 24, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
    aria-hidden
  >
    <div className="hero-mockup-glow absolute -inset-4 rounded-3xl opacity-60 blur-2xl" />
    <motion.div
      className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-3 sm:p-4 shadow-2xl"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute -right-2 sm:-right-3 -top-2 sm:-top-3 w-24 sm:w-28 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm p-2 shadow-lg hidden xs:block sm:block"
        animate={{ y: [0, 8, 0], opacity: [0.7, 0.95, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="h-2 w-12 rounded bg-white/30 mb-2" />
        <motion.div className="h-8 rounded-md bg-secondary/40 mb-1.5" />
        <div className="h-2 w-16 rounded bg-white/20" />
      </motion.div>
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="h-2.5 w-2.5 rounded-full bg-white/40" />
        <div className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <div className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <div className="ml-auto h-2 w-16 sm:w-20 rounded-full bg-white/20" />
      </div>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="rounded-lg bg-white/10 p-1.5 sm:p-2 border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <div className="h-1.5 w-6 sm:w-8 rounded bg-secondary/70 mb-1.5 sm:mb-2" />
            <div className="h-3 sm:h-4 w-full rounded bg-white/25" />
          </motion.div>
        ))}
      </div>
      <motion.div className="space-y-1.5 sm:space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2 rounded-lg bg-white/[0.08] p-1.5 sm:p-2 border border-white/10"
            style={{ opacity: 1 - i * 0.12 }}
            animate={{ x: [0, i % 2 === 0 ? 2 : -2, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 shrink-0" />
            <div className="flex-1 space-y-1 min-w-0">
              <div className="h-2 w-3/4 max-w-[100px] sm:max-w-[120px] rounded bg-white/35" />
              <div className="h-1.5 w-1/2 max-w-[60px] sm:max-w-[80px] rounded bg-white/20" />
            </div>
            <div className="h-4 sm:h-5 w-10 sm:w-12 rounded-md bg-secondary/50 shrink-0" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </motion.div>
);

export default HeroDashboardMockup;
