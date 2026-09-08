'use client';
import { motion } from 'framer-motion';
import type { ReactNode, ElementType } from 'react';
import { fadeUp, fadeUpLg, viewportOnce, springStd } from '../lib/motion';

interface RevealProps {
  children: ReactNode;
  /** Render as a different element/tag. Defaults to div. */
  as?: ElementType;
  className?: string;
  /** Delay before this element reveals (seconds). */
  delay?: number;
  /** Use the larger hero-scale travel distance. */
  large?: boolean;
  /** Render this element as a stagger container for child <Reveal.Item>s. */
  stagger?: number;
}

const MotionDiv = motion.div;

/**
 * Scroll-reveal wrapper applying the shared fade-up + spring. Fires once
 * when ~40% in view. Set `stagger` to sequence children that each use
 * <RevealItem>.
 */
export default function Reveal({
  children,
  as,
  className,
  delay = 0,
  large = false,
  stagger,
}: RevealProps) {
  const Comp = (as ? motion(as) : MotionDiv) as typeof MotionDiv;

  if (stagger != null) {
    return (
      <Comp
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {children}
      </Comp>
    );
  }

  const variants = large ? fadeUpLg : fadeUp;
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={{
        hidden: variants.hidden,
        show: {
          ...(variants.show as object),
          transition: { ...springStd, delay },
        },
      }}
    >
      {children}
    </Comp>
  );
}

/** A single staggered child. Place inside a <Reveal stagger={...}> parent. */
export function RevealItem({
  children,
  as,
  className,
  large = false,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  large?: boolean;
}) {
  const Comp = (as ? motion(as) : MotionDiv) as typeof MotionDiv;
  return (
    <Comp className={className} variants={large ? fadeUpLg : fadeUp}>
      {children}
    </Comp>
  );
}
