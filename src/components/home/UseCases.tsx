import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Landmark, Building2, ScrollText, Receipt } from 'lucide-react';
import { Section, Container, Eyebrow, Button } from '../ui';
import Reveal from '../Reveal';

const CASES = [
  {
    tab: 'First-Party',
    icon: Landmark,
    title: 'First-Party Collections',
    who: 'Banks, credit unions, and in-house teams',
    body: 'Recover your own debt earlier in the cycle while protecting the customer relationship. DROS keeps every contact on-brand, on-script, and on the right side of the line.',
    metric: { value: '3x', caption: 'Higher right-party contact' },
    image: '/industries/first-party.jpg',
    href: '/collections/first-party',
  },
  {
    tab: 'Third-Party',
    icon: Building2,
    title: 'Third-Party Agencies',
    who: 'Collection agencies operating at scale',
    body: 'Scale outreach across portfolios without adding headcount or compliance risk. AI agents work every account, around the clock, fully logged.',
    metric: { value: '24/7', caption: 'Compliant outreach at scale' },
    image: '/industries/third-party.jpg',
    href: '/collections/third-party',
  },
  {
    tab: 'Government & Utilities',
    icon: ScrollText,
    title: 'Government & Utilities',
    who: 'Parking, tax, and utility collections',
    body: 'Compliant, auditable outreach for public-sector receivables and regulated balances, with a complete record for every interaction.',
    metric: { value: '100%', caption: 'Auditable, logged outreach' },
    image: '/industries/government.jpg',
    href: '/collections/debt-buyer',
  },
  {
    tab: 'Invoice',
    icon: Receipt,
    title: 'Invoice Collections',
    who: 'SMBs and lenders chasing unpaid invoices',
    body: 'Automated reminders and follow-ups that get invoices paid without the awkward calls, so your team can focus on the relationships that matter.',
    metric: { value: '2x', caption: 'Faster days to pay' },
    image: '/industries/invoice.jpg',
    href: '/use-cases/payment-reminders',
  },
];

const DURATION = 6; // seconds per tab

export default function UseCases() {
  const [active, setActive] = useState(0);
  const progressControls = useAnimation();

  // Auto-advance timer — runs continuously, no pause on hover
  useEffect(() => {
    const t = setTimeout(() => setActive((a) => (a + 1) % CASES.length), DURATION * 1000);
    return () => clearTimeout(t);
  }, [active]);

  // Progress bar: reset and fill whenever active tab changes
  useEffect(() => {
    progressControls.set({ scaleX: 0 });
    progressControls.start({
      scaleX: 1,
      transition: { duration: DURATION, ease: 'linear' },
    });
  }, [active]);

  const current = CASES[active];

  return (
    <Section id="use-cases" tone="light" spacing="sm">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow className="text-ink-grey">Who it is for</Eyebrow>
          <h2 className="mt-6 font-display text-display text-ink-dark">
            Built for every collection scenario
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-grey">
            One platform, tuned to how your team collects. DROS adapts to your portfolio,
            your compliance posture, and your workflow - not the other way around.
          </p>
          <div className="mt-8">
            <Button variant="onLight" to="/book-meeting">Talk to Our AI Agent</Button>
          </div>
        </Reveal>

        <div className="mt-16">
          {/* Tab row */}
          <div className="flex justify-between gap-8 overflow-x-auto sm:gap-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CASES.map((c, i) => (
              <button
                key={c.tab}
                onClick={() => setActive(i)}
                className={`relative whitespace-nowrap pb-4 text-sm transition-colors ${
                  active === i
                    ? 'font-semibold text-ink-dark'
                    : 'font-normal text-ink-grey hover:text-ink-dark'
                }`}
              >
                {c.title}
                {/* Thin grey base line under every inactive tab */}
                <span className={`absolute -bottom-px left-0 right-0 h-px ${active === i ? 'bg-transparent' : 'bg-line-dark'}`} />
                {/* Animated progress fill under active tab */}
                {active === i && (
                  <motion.span
                    animate={progressControls}
                    className="absolute -bottom-px left-0 right-0 h-0.5 origin-left bg-ink-dark"
                    style={{ scaleX: 0 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="mt-8 overflow-hidden rounded-card border border-line-dark bg-[#EFEDEA]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.44, 0, 0.11, 1] }}
                className="grid md:grid-cols-[0.85fr_1.15fr]"
              >
                {/* Left: copy */}
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <div className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-wider text-ink-grey">
                    <current.icon className="h-4 w-4" /> {current.who}
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-ink-dark md:text-3xl">{current.title}</h3>
                  <p className="mt-4 max-w-md leading-relaxed text-ink-grey">{current.body}</p>
                  <div className="mt-7">
                    <Button variant="onLight" to={current.href}>Learn more</Button>
                  </div>
                </div>

                {/* Right: image + metric overlay */}
                <div className="relative min-h-[300px] overflow-hidden md:min-h-[420px]">
                  <motion.img
                    key={current.image}
                    src={current.image}
                    alt=""
                    aria-hidden="true"
                    initial={{ scale: 1.06 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.44, 0, 0.11, 1] }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <div className="font-display text-4xl text-white md:text-5xl">{current.metric.value}</div>
                    <div className="mt-2 font-mono text-[0.72rem] uppercase tracking-wider text-white/70">
                      {current.metric.caption}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Section>
  );
}
