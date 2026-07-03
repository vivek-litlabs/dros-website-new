import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, Container, Button } from '../ui';
import Reveal, { RevealItem } from '../Reveal';

interface Feature {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  image: string;
}

const FEATURES: Feature[] = [
  {
    id: 'ai-agents',
    label: 'AI Agents',
    title: 'AI Agents',
    subtitle: 'Human-quality conversations, fully compliant, working around the clock',
    image: '/features/ai-agents.jpg',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    title: 'Dashboard',
    subtitle: 'Every account, every agent, one real-time view',
    image: '/features/dashboard.jpg',
  },
  {
    id: 'ask-ai',
    label: 'Ask AI',
    title: 'Ask AI',
    subtitle: 'Plain-English answers pulled straight from your data',
    image: '/features/ask-ai.jpg',
  },
  {
    id: 'omnichannel',
    label: 'Omnichannel',
    title: 'Omnichannel',
    subtitle: 'Voice, SMS, email and chat, one continuous conversation',
    image: '/features/omnichannel.jpg',
  },
  {
    id: 'workflows',
    label: 'Workflows',
    title: 'Workflows',
    subtitle: 'Automate escalations, holds and hand-offs without code',
    image: '/features/workflows.jpg',
  },
  {
    id: 'call-analytics',
    label: 'Call Analytics',
    title: 'Call Analytics',
    subtitle: 'Every call scored, transcribed and searchable in seconds',
    image: '/features/call-analytics.jpg',
  },
  {
    id: 'payments',
    label: 'Payments',
    title: 'Payments',
    subtitle: 'Frictionless, compliant payment capture on every channel',
    image: '/features/payments.jpg',
  },
];

export default function Features() {
  const [active, setActive] = useState(0);
  const current = FEATURES[active];

  return (
    <Section id="features" tone="light" spacing="sm">
      <Container>
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <RevealItem>
            <h2 className="mx-auto max-w-[20ch] font-display text-display text-ink-dark">
              One AI platform. Every part of collections.
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-ink-grey">
              AI Agents, Dashboard, Ask AI, Omnichannel, Workflows, Call Analytics and Payments -
              seven capabilities built to work as one connected system, not seven different tools.
            </p>
          </RevealItem>

          <RevealItem className="flex w-full justify-center">
            <div
              role="tablist"
              aria-label="DROS features"
              className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full bg-[#F5F5F5] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {FEATURES.map((f, i) => (
                <button
                  key={f.id}
                  role="tab"
                  id={`features-tab-${f.id}`}
                  aria-selected={active === i}
                  aria-controls="features-panel"
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                    active === i
                      ? 'bg-white text-ink-dark shadow-sm'
                      : 'text-ink-grey hover:text-ink-dark'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </RevealItem>
        </Reveal>

        <div
          id="features-panel"
          role="tabpanel"
          aria-labelledby={`features-tab-${current.id}`}
          className="relative mt-10 w-full sm:mt-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.44, 0, 0.11, 1] }}
              className="relative flex h-[460px] w-full flex-col items-center justify-end overflow-hidden rounded-lg px-6 pb-11 pt-40 md:h-[600px] md:rounded-card md:pt-[210px] lg:pt-[240px]"
            >
              <img loading="lazy" decoding="async"
                src={current.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 73%, rgba(0,0,0,0.35) 100%)',
                }}
              />
              <div className="relative z-10 flex w-full max-w-[800px] flex-col items-center gap-2 text-center">
                <h3 className="font-display text-3xl text-white sm:text-4xl lg:text-5xl">
                  {current.title}
                </h3>
              </div>
              <div className="relative z-10 mt-4 flex w-full flex-col items-center gap-4">
                <p className="max-w-md text-center text-sm text-white/80 sm:text-[1rem]">{current.subtitle}</p>
                {/* Placeholder CTA - copy/link/behavior TBD */}
                <Button variant="primary" size="md">
                  Explore more
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </Section>
  );
}
