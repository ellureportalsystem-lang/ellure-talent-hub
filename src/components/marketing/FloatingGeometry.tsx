import { motion } from "framer-motion";

/** Subtle floating shapes for marketing pages — pointer-events none, sits behind content */
const FloatingGeometry = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <motion.div
      className="geo-shape geo-shape-1"
      animate={{ y: [0, -20, 0], x: [0, 14, 0] }}
      transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="geo-shape geo-shape-2"
      animate={{ y: [0, -18, 0], x: [0, 12, 0], rotate: [0, 8, 0] }}
      transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="geo-shape geo-shape-3"
      animate={{ y: [0, 14, 0], x: [0, -10, 0], rotate: [0, -6, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="geo-ring geo-ring-1"
      animate={{ rotate: 360 }}
      transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="geo-ring geo-ring-2"
      animate={{ rotate: -360 }}
      transition={{ duration: 56, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export default FloatingGeometry;
