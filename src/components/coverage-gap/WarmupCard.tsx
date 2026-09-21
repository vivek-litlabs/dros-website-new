import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui';
import Option from './Option';
import AccountGrid from './AccountGrid';
import CountUp from './CountUp';
import { INITIAL_STATE, calc } from './assessmentLogic';

/*
 * Hero warm-up card, told in three acts:
 *
 *   1. Idle    - the question, with "your file" sitting there as 100 dots.
 *   2. Verdict - a badge fades in over the card (plus particles when right).
 *   3. Payoff  - the grid resolves into the coverage gap, with the number
 *                counting up and the supporting facts appearing.
 *
 * The headline number is derived from the same calc() the assessment uses, at
 * its default assumptions, so it can never drift from the real model.
 *
 * Layout note: the grid is mounted once and never unmounts, and everything the
 * answer reveals is appended *below* it. That leaves exactly one height
 * animation on the card. An earlier version cross-faded a separate idle block
 * out while the payoff block expanded in, so the card shrank and then grew -
 * which read as a shake.
 */

const OPTIONS = [
  { k: 'A', text: 'The collector didn’t push hard enough on the call' },
  { k: 'B', text: 'Bad phone numbers - a skip-trace problem' },
  { k: 'C', text: 'They never got a compliant right-party contact in the window', right: true },
  { k: 'D', text: 'The consumer simply couldn’t afford to pay' },
];

const EXPLAIN =
  'Under Reg F you get a fixed number of attempts per account. Collectors spend them on the accounts that answer - and the rest go quiet, then out of statute, without ever hearing from you.';

const FACTS = ['Reg F caps attempts', 'Answer rates keep falling', 'Collectors work the answerers'];

/** Total steps in the funnel: this warm-up plus the assessment's seven. */
const STEPS = 8;

const VERDICT_MS = 1700;

/** Small cyan burst behind the verdict badge on a correct answer. */
function Particles() {
  const bits = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return { x: Math.cos(angle) * 54, y: Math.sin(angle) * 34, d: i * 0.012 };
      }),
    [],
  );
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: b.x, y: b.y, scale: 0.3 }}
          transition={{ duration: 0.75, delay: b.d, ease: 'easeOut' }}
          className="absolute h-1.5 w-1.5 rounded-full bg-accent"
        />
      ))}
    </span>
  );
}

export default function WarmupCard({
  onAnswer,
  onStart,
}: {
  onAnswer: (key: string) => void;
  onStart: () => void;
}) {
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState<string | null>(null);
  const [showVerdict, setShowVerdict] = useState(false);

  const answered = picked !== null;
  const correct = picked === 'C';

  // 67 of every 100 accounts, straight from the assessment's own model.
  const gap = Math.round(calc(INITIAL_STATE).pNoMonth * 100);
  const reached = 100 - gap;

  function pick(k: string) {
    if (answered) return;
    setPicked(k);
    setShowVerdict(true);
    onAnswer(k);
  }

  useEffect(() => {
    if (!showVerdict) return;
    const t = window.setTimeout(() => setShowVerdict(false), VERDICT_MS);
    return () => window.clearTimeout(t);
  }, [showVerdict]);

  return (
    <div className="relative overflow-hidden rounded-card border border-white/10 bg-surface/85 text-ink shadow-[0_24px_60px_rgba(4,7,15,0.45)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-gradient-to-r from-accent to-[#5ee4ff] px-5 py-3 text-sm font-semibold text-ink-dark">
        Start the Coverage Gap Assessment
        <span className="font-medium opacity-80">· Takes 2 minutes</span>
      </div>

      <div className="p-5 sm:p-6">
        {/* Progress pips: this card is step 1 of 8. */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: STEPS }, (_, i) => (
              <motion.span
                key={i}
                animate={{
                  width: i === 0 && answered ? 18 : 6,
                  opacity: i === 0 ? 1 : 0.3,
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={`h-1.5 rounded-full ${i === 0 ? 'bg-accent' : 'bg-white/40'}`}
              />
            ))}
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink/45">
            {answered ? 'Step 1 done · 7 to go' : 'Question 01 · Warm-up'}
          </span>
        </div>

        <h3 className="mb-4 font-display text-[19px] font-medium leading-snug tracking-[-0.01em] text-white sm:text-[22px]">
          Most low-balance accounts that never pay have one thing in common. Can you guess what it
          is?
        </h3>

        <div className="relative grid gap-2.5">
          {OPTIONS.map((o) => {
            const isPick = o.k === picked;
            const tone = !answered
              ? undefined
              : isPick && correct
                ? ('correct' as const)
                : isPick
                  ? ('wrong' as const)
                  : o.right
                    ? ('correct' as const)
                    : undefined;
            return (
              <Option
                key={o.k}
                k={o.k}
                disabled={answered}
                tone={tone}
                dim={answered && !isPick && !o.right}
                badge={answered && !correct && o.right ? 'The answer' : undefined}
                onClick={() => pick(o.k)}
              >
                {o.text}
              </Option>
            );
          })}

          {/* Act 2: the verdict pops over the options, then hands off. */}
          <AnimatePresence>
            {showVerdict && (
              <motion.div
                key="verdict"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3, ease: 'easeOut' } }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute inset-0 z-10 grid place-items-center"
              >
                {correct && !reduce && <Particles />}
                <span
                  className={`relative inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold shadow-[0_18px_40px_-16px_rgba(4,7,15,0.9)] backdrop-blur-md ${
                    correct
                      ? 'border-accent/50 bg-accent text-ink-dark'
                      : 'border-amber-400/50 bg-amber-400/95 text-ink-dark'
                  }`}
                >
                  {correct ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  {correct ? 'Exactly right' : 'Almost - it’s C'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The file: mounted once, in the same spot before and after. */}
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.07em] text-ink/45">
            Your file · 100 accounts
          </span>
          <span
            className={`font-mono text-[11px] transition-colors duration-500 ${
              answered ? 'text-accent' : 'text-ink/35'
            }`}
          >
            {answered ? `${reached} reached` : 'answer to reveal'}
          </span>
        </div>
        <div className="mt-2">
          <AccountGrid untouched={gap} revealed={answered} />
        </div>

        {/* Act 3: the payoff, appended below the grid so nothing above moves. */}
        <AnimatePresence initial={false}>
          {answered && (
            <motion.div
              key="story"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{
                height: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.3 },
                opacity: { duration: 0.45, ease: 'easeOut', delay: reduce ? 0 : 0.4 },
              }}
              className="overflow-hidden"
            >
              <p role="status" aria-live="polite" className="mt-3 text-[14.5px] leading-snug text-ink/80">
                <span className="font-display text-[26px] font-medium tabular-nums text-accent">
                  <CountUp to={gap} format={(n) => String(Math.round(n))} delay={650} />
                </span>{' '}
                never get a compliant contact in 30 days.
              </p>
              <p className="mt-1 font-mono text-[11px] leading-snug text-ink/40">
                Illustrative: {INITIAL_STATE.att} attempts a week at a {INITIAL_STATE.ans}% answer
                rate.
              </p>

              <p className="mt-3 border-t border-hair pt-3 text-[14.5px] leading-relaxed text-ink/75">
                {EXPLAIN}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {FACTS.map((f, i) => (
                  <motion.span
                    key={f}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                      delay: reduce ? 0 : 0.95 + i * 0.1,
                    }}
                    className="rounded-full border border-hair bg-white/[0.04] px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.05em] text-ink/55"
                  >
                    {f}
                  </motion.span>
                ))}
              </div>

              <Button variant="primary" size="lg" onClick={onStart} className="mt-4 w-full">
                See where YOUR coverage is leaking
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Button>
              <small className="mt-3 block text-center font-mono text-[11px] text-ink/45">
                7 quick questions · ~2 minutes · free
              </small>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
