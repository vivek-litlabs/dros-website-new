import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/* Subtle whole-page fade-in on mount / route change.
   Opacity only (no transform) so the fixed Navbar keeps its
   viewport-anchored positioning - a lingering transform on an
   ancestor would re-scope position: fixed and break sticky nav. */
export default function PageFade({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
