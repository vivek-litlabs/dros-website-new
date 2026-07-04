import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Section, Container, Eyebrow, Heading } from '../ui';
import Reveal, { RevealItem } from '../Reveal';

/* ──────────────────────────────────────────────────────────
   "Meet your AI Agent" - Customer.io-inspired accordion +
   auto-rotating illustration panel.
   ────────────────────────────────────────────────────────── */

const ROTATE_MS = 8500;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface AgentFeature {
  id: string;
  title: string;
  description: string;
}

const AGENT_FEATURES: AgentFeature[] = [
  {
    id: 'build',
    title: 'Build campaigns in a conversation',
    description:
      'Go from a single prompt to a fully configured campaign with triggers, content, timing, and logic, so you can launch more quickly.',
  },
  {
    id: 'analyze',
    title: 'Analyze performance instantly',
    description: 'Ask how any campaign is doing and get clear, data-grounded recommendations.',
  },
  {
    id: 'remember',
    title: 'Remember everything about your business',
    description:
      'Your Agent automatically carries your brand voice, goals, and preferences across every session.',
  },
];

const PANEL_TRANSITION = { duration: 0.55, ease: [0.44, 0, 0.11, 1] as const };

/* Conversation beat timings shared by every panel: the "message" appears
   first, a typing indicator plays while the agent "thinks", then the
   reply card lands and its own content fills in. */
const T_MESSAGE = 0;
const T_TYPING = 0.8;
const T_REPLY = 2.0;
const T_CONTENT = 2.45;

/* ── Typing indicator: three bouncing dots that appear then vanish
   right before the reply card lands. ── */
function TypingDots({ reduced, align = 'left' }: { reduced: boolean; align?: 'left' | 'right' }) {
  if (reduced) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: [0, 1, 1, 0], y: 0 }}
      transition={{ duration: T_REPLY - T_TYPING, times: [0, 0.25, 0.75, 1], delay: T_TYPING }}
      className={`flex w-fit items-center gap-1 rounded-2xl bg-white px-3.5 py-2.5 shadow-[0_10px_30px_rgba(12,30,69,0.08)] ${
        align === 'right' ? 'ml-auto rounded-tr-md' : 'rounded-tl-md'
      }`}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-ink-grey/50"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.7, repeat: 2, delay: T_TYPING + 0.15 + i * 0.16 }}
        />
      ))}
    </motion.div>
  );
}

function messageMotion(reduced: boolean, fromRight = false) {
  return {
    initial: reduced ? undefined : { opacity: 0, y: 8, x: fromRight ? 8 : 0 },
    animate: { opacity: 1, y: 0, x: 0 },
    transition: reduced ? { duration: 0 } : { duration: 0.55, delay: T_MESSAGE, ease: 'easeOut' as const },
  };
}

function replyMotion(reduced: boolean) {
  return {
    initial: reduced ? undefined : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: reduced ? { duration: 0 } : { duration: 0.6, delay: T_REPLY, ease: [0.44, 0, 0.11, 1] as const },
  };
}

/* ── Panel 1: prompt bar (message) + suggestion pills (reply) ── */
function PromptPanel({ reduced }: { reduced: boolean }) {
  const suggestions = [
    'Automate touch points',
    'Recommended send time',
    'Identify opportunities',
    'Surface key findings',
    'Suggest event description',
    'Audience insights',
  ];
  return (
    <div className="flex w-full flex-col gap-3 px-6 pt-10 sm:px-10 sm:pt-14">
      <motion.div
        {...messageMotion(reduced)}
        className="flex w-full items-center gap-3 rounded-full bg-white px-3 py-2 shadow-[0_10px_30px_rgba(12,30,69,0.08)]"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="flex-1 truncate text-sm text-ink-grey">How can I help you today?</span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-dark text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </motion.div>

      <TypingDots reduced={reduced} align="left" />

      <motion.div
        className="flex flex-col gap-2.5 pt-2"
        initial={reduced ? undefined : 'hidden'}
        animate={reduced ? undefined : 'show'}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: T_CONTENT } } }}
      >
        {suggestions.map((s) => (
          <motion.div
            key={s}
            variants={
              reduced
                ? undefined
                : { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.4 } } }
            }
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#DCF5DA] px-4 py-2 text-sm font-medium text-ink-dark"
          >
            {s}
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Panel 2: chat bubble (message) + bar chart (reply) ── */
function AnalyticsPanel({ reduced }: { reduced: boolean }) {
  const bars = [
    { label: 'Day 0 - Welcome', value: 62 },
    { label: 'Day3 - Plan Comparison', value: 38 },
    { label: 'Day10 - Promo', value: 48 },
    { label: 'Day13 - Final Urgency', value: 58 },
  ];
  return (
    <div className="flex w-full flex-col gap-4 px-6 pt-10 sm:px-10 sm:pt-14">
      <div className="flex justify-end">
        <motion.div
          {...messageMotion(reduced, true)}
          className="max-w-[80%] rounded-2xl rounded-tr-md bg-[#DCF5DA] px-4 py-2.5 text-sm font-medium text-ink-dark"
        >
          How is my trial campaign performing?
        </motion.div>
      </div>

      <TypingDots reduced={reduced} align="left" />

      <motion.div
        {...replyMotion(reduced)}
        className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(12,30,69,0.08)]"
      >
        <p className="text-sm text-ink-dark">
          Your Trial to Upgrade Journey campaign is performing exceptionally:
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-ink-dark">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Click-Through Rate by Email
        </div>
        <div className="relative mt-4 flex h-40 items-end gap-4 border-b border-line-dark pl-6">
          <div className="pointer-events-none absolute left-0 top-0 flex h-40 flex-col justify-between text-[11px] text-ink-grey">
            <span>60</span>
            <span>40</span>
            <span>20</span>
            <span>0</span>
          </div>
          {bars.map((b, i) => (
            <div key={b.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <motion.div
                className="w-full rounded-t-sm bg-[#1C6CFF]"
                initial={reduced ? undefined : { height: 0 }}
                animate={{ height: `${(b.value / 70) * 100}%` }}
                transition={
                  reduced ? { duration: 0 } : { duration: 0.7, delay: T_CONTENT + i * 0.16, ease: 'easeOut' }
                }
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-4 pl-6">
          {bars.map((b) => (
            <span key={b.label} className="flex-1 text-center text-[11px] leading-tight text-ink-grey">
              {b.label}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Panel 3: chat bubble (message) + brand tone & voice sliders (reply) ── */
function BrandVoicePanel({ reduced }: { reduced: boolean }) {
  const sliders = [
    { label: 'FORMALITY', left: 'Casual', right: 'Formal', value: 35 },
    { label: 'HUMOR', left: 'Serious', right: 'Humorous', value: 6 },
    { label: 'RESPECT', left: 'Irreverent', right: 'Very Respectful', value: 95 },
    { label: 'HUMOR', left: 'Calm & Direct', right: 'Enthusiastic', value: 28 },
  ];
  return (
    <div className="flex w-full flex-col gap-3 px-6 pt-10 sm:px-10 sm:pt-14">
      <div className="flex justify-end">
        <motion.div
          {...messageMotion(reduced, true)}
          className="max-w-[80%] rounded-2xl rounded-tr-md bg-[#DCF5DA] px-4 py-2.5 text-sm font-medium text-ink-dark"
        >
          What's my brand voice?
        </motion.div>
      </div>

      <TypingDots reduced={reduced} align="left" />

      <motion.div {...replyMotion(reduced)} className="flex flex-col gap-3">
        <div className="rounded-xl bg-white px-5 py-3 shadow-[0_10px_30px_rgba(12,30,69,0.08)]">
          <span className="text-sm font-semibold text-ink-dark">Brand Tone &amp; Voice</span>
        </div>
        <div className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(12,30,69,0.08)]">
          {sliders.map((s, i) => (
            <div key={`${s.label}-${i}`} className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold tracking-wide text-ink-grey">{s.label}</span>
              <div className="flex justify-between text-xs text-ink-grey">
                <span>{s.left}</span>
                <span>{s.right}</span>
              </div>
              <div className="relative h-1 w-full rounded-full bg-line-dark">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-[#E8873A]"
                  initial={reduced ? undefined : { width: '0%' }}
                  animate={{ width: `${s.value}%` }}
                  transition={
                    reduced ? { duration: 0 } : { duration: 0.85, delay: T_CONTENT + i * 0.16, ease: 'easeOut' }
                  }
                />
                <motion.div
                  className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-[#E8873A] bg-white"
                  initial={reduced ? undefined : { left: '0%' }}
                  animate={{ left: `calc(${s.value}% - 6px)` }}
                  transition={
                    reduced ? { duration: 0 } : { duration: 0.85, delay: T_CONTENT + i * 0.16, ease: 'easeOut' }
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

const PANELS = [PromptPanel, AnalyticsPanel, BrandVoicePanel];

export default function MeetYourAgent() {
  const [active, setActive] = useState(0);
  const [reduced] = useState(prefersReducedMotion);
  const ActivePanel = PANELS[active];

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setActive((v) => (v + 1) % AGENT_FEATURES.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduced, active]);

  return (
    <Section id="ai-agent" tone="light" spacing="lg">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal className="order-1 flex flex-col gap-8">
            <RevealItem className="flex flex-col gap-4 sm:gap-6">
              <Eyebrow className="text-ink-grey">AI Agent</Eyebrow>
              <Heading as="h2" size="heading" className="max-w-[20ch] text-ink-dark">
                Meet your AI Agent
              </Heading>
              <p className="max-w-[48ch] text-lg leading-relaxed text-ink-grey">
                Tell it what you want, and it gets to work so your team spends less time
                configuring and more time on what matters most.
              </p>
              <a
                href="#demo"
                className="group inline-flex w-fit items-center gap-2 text-base font-semibold text-ink-dark"
              >
                Meet your Agent
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </a>
            </RevealItem>

            <RevealItem>
              <div role="tablist" aria-label="AI Agent capabilities" className="flex flex-col">
                {AGENT_FEATURES.map((f, i) => {
                  const isActive = active === i;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActive(i)}
                      className="relative flex w-full flex-col items-start gap-2 border-b border-line-dark py-4 text-left"
                    >
                      <h3
                        className={`text-lg font-medium transition-colors duration-200 ${
                          isActive ? 'text-ink-dark' : 'text-ink-grey'
                        }`}
                      >
                        {f.title}
                      </h3>
                      <div
                        className={`grid w-full overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${
                          isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="min-h-0 max-w-[48ch]">
                          <p className="text-base text-ink-grey">{f.description}</p>
                        </div>
                      </div>
                      <div className="absolute inset-x-0 -bottom-px h-px bg-line-dark">
                        {isActive && !reduced && (
                          <motion.div
                            key={active}
                            className="h-full bg-accent"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: ROTATE_MS / 1000, ease: 'linear' }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </RevealItem>
          </Reveal>

          <RevealItem
            as="div"
            className="relative order-2 flex aspect-square w-full items-center overflow-hidden rounded-card md:aspect-auto md:h-[34rem]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 z-0"
              style={{
                backgroundColor: '#DAD7D2',
                backgroundImage:
                  'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), transparent 45%), radial-gradient(circle at 80% 75%, rgba(0,0,0,0.06), transparent 50%)',
              }}
            />
            <div className="relative z-10 flex h-full w-full items-start justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={PANEL_TRANSITION}
                  className="flex w-full justify-center"
                >
                  <ActivePanel reduced={reduced} />
                </motion.div>
              </AnimatePresence>
            </div>
          </RevealItem>
        </div>
      </Container>
    </Section>
  );
}
