import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Eases a number from 0 to `to` on mount, formatting each frame through
 * `format`. Snaps straight to the final value under reduced motion.
 *
 * Distinct from src/components/Counter.tsx, which starts when scrolled into
 * view; these counters fire the moment their panel is revealed.
 */
export default function CountUp({
  to,
  format,
  duration = 1200,
  delay = 0,
}: {
  to: number;
  format: (n: number) => string;
  duration?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);

  useEffect(() => {
    if (reduce) {
      setV(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const p = Math.min(Math.max((now - t0) / duration, 0), 1);
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, delay, reduce]);

  return <>{format(v)}</>;
}
