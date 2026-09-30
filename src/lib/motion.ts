import type { Variants, Transition } from 'framer-motion';

/**
 * Shared motion language, ported from the Lateral Framer project.
 * Spring: damping 30 / stiffness 125 / mass 1. Fade-up reveals start at
 * opacity 0.001 + y 16px. Stagger 0.1s. Premium tween eases on the
 * [0.44, 0, 0.11, 1] curve. All reveals respect prefers-reduced-motion
 * via the global CSS rule in index.css (transforms collapse instantly).
 */

export const springStd: Transition = {
  type: 'spring',
  damping: 30,
  stiffness: 125,
  mass: 1,
};

export const springSnappy: Transition = {
  type: 'spring',
  damping: 30,
  stiffness: 125,
  mass: 0.1,
};

export const premiumTween: Transition = {
  type: 'tween',
  duration: 1.2,
  ease: [0.44, 0, 0.11, 1],
};

/** Standard in-view viewport config: fire once, when ~15% is visible. */
export const viewportOnce = { once: true, amount: 0.15 } as const;

/**
 * In-view config for a container whose height is driven by how many children it has.
 *
 * `amount` is a fraction of the ELEMENT, not of the viewport, so a threshold like 0.15
 * becomes unreachable once the element grows past ~6.7x the viewport height - the
 * observer can never see 15% of it at once, never fires, and every child stays at its
 * `hidden` opacity. The blog grid hit exactly this: 30 cards, 11112px tall, 812px
 * viewport, so at most 7.3% was ever visible and the whole grid rendered blank while
 * sitting in the DOM at full size.
 *
 * `'some'` fires as soon as any part of the container intersects, which cannot be
 * starved by height. Correct for a stagger parent anyway: the children carry the
 * sequencing, so the parent only needs to say "we have arrived".
 */
export const viewportContainer = { once: true, amount: 'some' } as const;

/** Fade-up reveal for a single element. */
export const fadeUp: Variants = {
  hidden: { opacity: 0.001, y: 16 },
  show: { opacity: 1, y: 0, transition: springStd },
};

/** Larger fade-up for hero-scale elements. */
export const fadeUpLg: Variants = {
  hidden: { opacity: 0.001, y: 28 },
  show: { opacity: 1, y: 0, transition: springStd },
};

/** Container that staggers its children's reveals. */
export const staggerContainer = (stagger = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});
