import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/*
 * "Your file" visualisation: 100 dots standing in for 100 accounts.
 *
 * Idle, every dot is neutral - the file before anyone works it. On reveal, the
 * accounts that get a right-party contact light up in accent and the rest fade
 * to ghosts, which is the coverage gap made literal.
 *
 * The dots are plain spans with a staggered CSS transition-delay rather than
 * 100 motion components, because this sits above the fold in the hero.
 */

const TOTAL = 100;

/**
 * Deterministic shuffle (mulberry32 on a fixed seed) so the dots dim in a
 * scattered, organic order instead of a solid block, and so every visitor and
 * every screenshot sees the same pattern.
 */
function shuffledOrder(): number[] {
  let s = 0x6d2b79f5;
  const rand = () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const order = Array.from({ length: TOTAL }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export default function AccountGrid({
  untouched,
  revealed,
}: {
  /** How many of the 100 accounts never get a compliant contact. */
  untouched: number;
  /** False while idle (all dots neutral), true to play the reveal. */
  revealed: boolean;
}) {
  const reduce = useReducedMotion();

  // Map each cell to its position in the shuffled order, so the first
  // `untouched` entries of that order are the ones that go dark.
  const rank = useMemo(() => {
    const order = shuffledOrder();
    const out = new Array<number>(TOTAL);
    order.forEach((cell, i) => {
      out[cell] = i;
    });
    return out;
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl border border-hair bg-black/25 p-3">
      {/* 20 x 5 keeps the grid wide and short, so the card stays compact. */}
      <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[3px]">
        {rank.map((r, i) => {
          const dark = revealed && r < untouched;
          const lit = revealed && r >= untouched;
          return (
            <span
              key={i}
              className={`aspect-square rounded-[2px] transition-colors duration-500 ${
                dark ? 'bg-white/[0.07]' : lit ? 'bg-accent' : 'bg-white/20'
              }`}
              style={reduce ? undefined : { transitionDelay: `${(r % 50) * 14}ms` }}
            />
          );
        })}
      </div>

      {/* Idle sweep, so the card looks alive before anyone answers. */}
      {!revealed && !reduce && (
        <motion.div
          aria-hidden="true"
          initial={{ x: '-60%' }}
          animate={{ x: '160%' }}
          transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
          className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-accent/15 to-transparent"
        />
      )}
    </div>
  );
}
