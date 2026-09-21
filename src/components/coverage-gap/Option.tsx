import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export type OptionTone = 'correct' | 'wrong';

/*
 * Answer option shared by the hero warm-up card and the assessment steps.
 * Hover lifts and lights the border, tap presses, selection pops the key chip.
 *
 * `tone` is the warm-up card's graded state: 'correct' rings the option in
 * accent, 'wrong' tints it amber. Both settle through colour alone - no
 * positional wobble, so picking an answer reads as calm rather than jittery.
 */
export default function Option({
  k,
  selected = false,
  dim = false,
  disabled = false,
  tone,
  badge,
  onClick,
  children,
}: {
  k?: string;
  selected?: boolean;
  dim?: boolean;
  disabled?: boolean;
  tone?: OptionTone;
  /** Small tag pinned to the right, e.g. "The answer". */
  badge?: ReactNode;
  onClick: () => void;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const wrong = tone === 'wrong';
  const highlighted = selected || tone === 'correct';

  const surface = wrong
    ? 'border-amber-400/60 bg-amber-400/[0.08] text-white'
    : highlighted
      ? 'border-accent bg-accent/10 text-white shadow-[0_0_0_1px_rgba(3,210,252,0.35),0_10px_30px_-12px_rgba(3,210,252,0.45)]'
      : 'border-hair bg-surface-2 text-ink enabled:hover:border-accent/50 enabled:hover:bg-[#132038] enabled:hover:shadow-[0_10px_30px_-14px_rgba(3,210,252,0.35)]';

  const chip = wrong
    ? 'border-amber-400/60 bg-amber-400/80 text-ink-dark'
    : highlighted
      ? 'border-accent bg-accent text-ink-dark'
      : 'border-hair bg-white/[0.06] text-ink/70 group-hover:border-accent/40 group-hover:text-accent';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      // y is driven here (not left to whileHover alone) so that when the
      // options disable on answering, a hovered option eases back to rest
      // instead of snapping down under the cursor.
      animate={{ opacity: dim ? 0.45 : 1, y: 0 }}
      transition={{
        opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        default: { type: 'spring', stiffness: 260, damping: 30 },
      }}
      className={`group flex min-h-[48px] w-full items-center gap-3 rounded-[14px] border px-4 py-3 text-left text-[15px] leading-snug transition-[border-color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:cursor-default ${surface}`}
    >
      {k && (
        <motion.span
          animate={highlighted || wrong ? { scale: reduce ? 1 : [1, 1.14, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`grid h-[26px] w-[26px] shrink-0 place-items-center rounded-lg border font-mono text-xs transition-colors duration-200 ${chip}`}
        >
          {wrong ? '✕' : tone === 'correct' ? '✓' : k}
        </motion.span>
      )}
      <span className="flex-1">{children}</span>
      {badge && (
        <motion.span
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-accent"
        >
          {badge}
        </motion.span>
      )}
    </motion.button>
  );
}
