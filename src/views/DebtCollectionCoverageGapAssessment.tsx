export const route = '/debt-collection-coverage-gap-assessment';
import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Section, Container, Eyebrow, Heading, Button } from '../components/ui';
import Reveal, { RevealItem } from '../components/Reveal';
import PageFade from '../components/PageFade';
import HeroBg from '../components/HeroBg';
import CoverageNav from '../components/coverage-gap/CoverageNav';
import CoverageFooter from '../components/coverage-gap/CoverageFooter';
import WarmupCard from '../components/coverage-gap/WarmupCard';
import Assessment from '../components/coverage-gap/Assessment';
import useBannerDismissed from '../components/coverage-gap/useBannerDismissed';
import { INITIAL_STATE } from '../components/coverage-gap/assessmentLogic';
import type { AssessmentState } from '../components/coverage-gap/assessmentLogic';
import { trackCta } from '../lib/analytics';

/*
 * Coverage Gap Assessment landing page (campaign page). Rebuilt from the
 * standalone landing HTML on the site's design system. It deliberately uses
 * its own banner/nav and footer (CoverageNav / CoverageFooter) rather than the
 * shared Navbar/Footer.
 */

const CANONICAL = 'https://dros.ai/debt-collection-coverage-gap-assessment';
const TITLE = 'The Coverage Gap Assessment for Collection Teams | DROS';
const DESCRIPTION =
  "Take the 2-minute Coverage Gap Assessment: find out how much of your paper never gets a compliant right-party contact, what it's costing you, and the one fix that closes it.";

const HERO_CHECKS: ReactNode[] = [
  <>
    See the share of your accounts that get <b className="font-semibold text-ink">zero</b> contact
    inside the window
  </>,
  'Get the dollar figure sitting in untouched, in-statute balances',
  'Find where the leak is: contactability, timing or treatment',
  'Learn the one fix that closes it - inside Reg F and TCPA',
];

const TRUST = [
  'SOC 2 · ISO 27001 · ISO 42001',
  'US data stays in the US',
  'Built for first- and third-party collections',
];

const WHY = [
  {
    t: 'Reg F fixed the ceiling',
    p: '7-in-7 caps mean you cannot dial your way out of a coverage gap. Extra collectors buy nothing above the cap.',
  },
  {
    t: 'TCPA raised the stakes',
    p: 'The 2024 artificial-voice ruling and 2025 revocation rules mean consent and opt-outs must be honored in real time, on every channel.',
  },
  {
    t: 'Answer rates keep falling',
    p: 'Consumers don’t pick up unknown numbers. The same attempts buy fewer right-party contacts every quarter.',
  },
  {
    t: 'Collectors keep leaving',
    p: 'Hiring and training cost keeps rising. Night and weekend coverage is unaffordable with people alone.',
  },
];

const HOW = [
  {
    t: 'Connect',
    p: 'DROS reads placements, balances and dispositions from Latitude, Quantrax/RMEx, CUBS, Beam or SimplicityCollect - or via CSV/API. Nothing leaves your system of record.',
  },
  {
    t: 'Configure',
    p: 'Your compliance officer sets attempt caps, state call windows, disclosures, consent flags and DNC - then locks them.',
  },
  {
    t: 'Contact',
    p: 'Every account gets a respectful, compliant attempt each day across voice and SMS. DROS remembers every prior conversation.',
  },
  {
    t: 'Convert',
    p: 'Live conversations transfer warm to your collectors, or DROS takes the payment in-call. Promises and payments post back to your platform.',
  },
  {
    t: 'Confirm',
    p: 'Every disclosure, promise and payment lands in the Compliance & Evidence Locker. Weekly reports show where recovery was missed - and why.',
  },
];

const COMPLIANCE = [
  {
    k: 'Rules',
    t: 'Rules live in the engine',
    p: 'Reg F frequency caps counted across every channel and vendor. State call-time windows, disclosures and mini-Miranda enforced before a word is spoken. TCPA consent and revocation honored in real time. You configure, you lock - DROS cannot override.',
  },
  {
    k: 'Evidence',
    t: 'Evidence on every call',
    p: 'The Compliance & Evidence Locker logs every disclosure, promise and payment, tied to the account record with recordings and transcripts. Audit-ready exports for clients and regulators. Kill switch and per-portfolio guardrails.',
  },
  {
    k: 'Engine',
    t: 'The engine behind it',
    p: 'Built on the Vodex voice engine already running enterprise deployments. SOC 2, ISO 27001 and ISO 42001 (AI management) certified. All US customer data stays in US geography. Your team signs off on QA before any portfolio goes live.',
  },
];

const BADGES = ['FDCPA', 'Reg F 7-in-7', 'TCPA', 'State call windows', 'SOC 2', 'ISO 27001', 'ISO 42001'];

const WHO = [
  {
    t: 'For the owner',
    p: 'More recovered dollars from the same paper, without hiring. Payback inside the first quarter.',
    accent: true,
  },
  {
    t: 'For the compliance officer',
    p: 'Set the rules once; the engine cannot break them. Evidence for every audit.',
  },
  {
    t: 'For the collections manager',
    p: 'Every account gets a compliant attempt every day. Your people get the live conversations - not voicemail.',
  },
  {
    t: 'For your clients',
    p: 'Higher liquidation, lower complaint rate, and call records on request.',
  },
];

const PROOF = [
  {
    k: 'Week 0',
    t: 'Set up',
    p: 'Onboarding form, platform integration, rule configuration by your compliance officer.',
  },
  {
    k: 'Week 1',
    t: 'Certify',
    p: 'QA on real call samples, compliance sign-off, staged ramp on the portfolio.',
  },
  {
    k: 'Weeks 2-4',
    t: 'Run',
    p: 'Full portfolio live. Weekly review of coverage, right-party contacts and dollars collected.',
  },
  {
    k: 'Day 30',
    t: 'Decide',
    p: 'Results against your 90-day baseline, and an expansion decision - yours to make.',
    accent: true,
  },
];

const FAQ = [
  {
    q: 'Is an AI voice even allowed to make collection calls?',
    a: 'Yes, within the same rules a collector follows - FDCPA disclosures, Reg F frequency and time-of-day limits, state licensing rules and TCPA consent. The 2024 FCC ruling treats AI-generated voices as “artificial voice” under TCPA, which is exactly why DROS enforces consent and revocation inside the engine rather than leaving it to a script.',
  },
  {
    q: 'Will this replace my collectors?',
    a: 'No. DROS works the accounts that never get reached and hands live conversations to your team with full context. In our ACA 2026 field research, fear of replacement - not compliance - was the biggest reason agencies stalled on AI. We design and roll out with your floor, not around it.',
  },
  {
    q: 'Which platforms do you integrate with?',
    a: 'Latitude, Quantrax/RMEx, CUBS, Beam and SimplicityCollect today, plus CSV and API for anything else. Your platform stays the system of record; DROS reads placements and writes back dispositions, promises and payments.',
  },
  {
    q: 'How long until we’re live?',
    a: 'Two to four weeks for a first portfolio, including integration, rule configuration and QA sign-off by your compliance team.',
  },
  {
    q: 'How is DROS priced?',
    a: 'A prepaid monthly platform floor sized to your active accounts, plus usage above the floor. An optional performance component lets you trade a lower floor for a small share of DROS-collected dollars - we win when you do. We’ll share the current price list on the first call.',
  },
  {
    q: 'Where is our data held?',
    a: 'All US customer data stays in US geography. Vodex holds SOC 2, ISO 27001 and ISO 42001 certifications.',
  },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

/** Card with a springy hover lift; wrap in RevealItem for the scroll-in. */
function HoverCard({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={`group h-full rounded-card border p-6 transition-[border-color,box-shadow,background-color] duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

const lightCard =
  'border-line-dark bg-white shadow-sm hover:border-accent/45 hover:shadow-[0_18px_40px_-22px_rgba(12,30,69,0.35)]';
const darkCard =
  'border-hair bg-surface-2/60 hover:border-accent/35 hover:shadow-[0_18px_40px_-22px_rgba(3,210,252,0.3)]';

function Idx({ children }: { children: ReactNode }) {
  return (
    <span className="mb-3.5 block font-mono text-[13px] text-accent transition-transform duration-300 group-hover:translate-x-1">
      {children}
    </span>
  );
}

export default function DebtCollectionCoverageGapAssessment() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<AssessmentState>(INITIAL_STATE);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // Owned here because the banner's height also shifts the hero and the
  // anchor-scroll offset, not just the nav.
  const { dismissed: bannerDismissed, dismiss: dismissBanner } = useBannerDismissed();

  // The banner and nav are both fixed, so a hash landing (/...#faq, scrolled
  // natively by the browser) has to clear their combined height, and the hero
  // fills what is left of the viewport.
  const anchorClass = bannerDismissed ? 'scroll-mt-[68px]' : 'scroll-mt-[132px]';
  const heroClass = bannerDismissed
    ? 'lg:min-h-[calc(100vh-68px)]'
    : 'lg:min-h-[calc(100vh-112px)]';

  const update = useCallback(
    (patch: Partial<AssessmentState>) => setState((s) => ({ ...s, ...patch })),
    [],
  );
  const start = useCallback(() => {
    trackCta('coverage_gap_start');
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <PageFade className="min-h-screen bg-base text-ink">
        <Helmet>
          <title>{TITLE}</title>
          <meta name="description" content={DESCRIPTION} />
          <link rel="canonical" href={CANONICAL} />
          <meta property="og:title" content="How much of your paper never hears from you? - DROS Coverage Gap Assessment" />
          <meta property="og:description" content="7 quick questions. See the accounts your collectors never reach, the dollars sitting in them, and where the leak is." />
          <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
          <meta property="og:url" content={CANONICAL} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
          <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
        </Helmet>

        <CoverageNav
          onStart={start}
          bannerDismissed={bannerDismissed}
          onDismissBanner={dismissBanner}
        />

        <main>
          {/* ── HERO ── */}
          <header
            id="top"
            data-nav-theme="dark"
            className={`relative flex w-full items-center overflow-hidden bg-base text-white ${heroClass}`}
          >
            <HeroBg image="/adoption-gap-report-hero.jpg" />

            <Container className="relative z-40 grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
              <div>
                <Reveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs text-white/85 backdrop-blur-md">
                    <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10.5px] font-bold text-ink-dark">
                      DROS
                    </span>
                    Coverage Gap Assessment
                  </span>
                </Reveal>

                <Reveal large>
                  <h1 className="mt-5 font-saans text-[36px] font-medium leading-[1.08] tracking-[-0.02em] sm:text-[48px] xl:text-[56px]">
                    <span className="block text-white">
                      How to recover more from the paper you already have
                    </span>
                    <span className="block text-white/55">without adding a single collector.</span>
                  </h1>
                </Reveal>

                <Reveal>
                  <p className="mt-5 max-w-[34rem] text-base leading-relaxed text-white/75 sm:text-lg">
                    Take the <b className="font-semibold text-white">2-minute Coverage Gap Assessment</b>{' '}
                    to find out how much of your in-statute paper never gets a compliant right-party
                    contact - and how many dollars are sitting in it.
                  </p>
                </Reveal>

                <Reveal stagger={0.08} delay={0.1} className="mb-6 mt-6 grid gap-3">
                  {HERO_CHECKS.map((c, i) => (
                    <RevealItem key={i} className="group flex items-start gap-3 text-[15px] leading-snug text-white/85">
                      <span className="mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-md border border-accent/40 bg-accent/10 text-[12px] font-bold text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-ink-dark">
                        ✓
                      </span>
                      <span>{c}</span>
                    </RevealItem>
                  ))}
                </Reveal>

                <Reveal delay={0.2} className="flex flex-wrap gap-x-5 gap-y-2.5 border-t border-white/10 pt-5 text-[13px] text-white/55">
                  {TRUST.map((t) => (
                    <span key={t} className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {t}
                    </span>
                  ))}
                </Reveal>
              </div>

              <Reveal large delay={0.15}>
                <WarmupCard onAnswer={(k) => update({ warm: k })} onStart={start} />
              </Reveal>
            </Container>
          </header>

          {/* ── 01 WHY ── */}
          <Section tone="light" spacing="lg" id="why" className={anchorClass}>
            <Container>
              <Reveal className="mx-auto max-w-2xl text-center">
                <Eyebrow className="justify-center text-ink-grey">01 - Why more collectors won’t fix it</Eyebrow>
                <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                  The ceiling is fixed. The floor keeps dropping.
                </Heading>
              </Reveal>
              <Reveal stagger={0.08} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {WHY.map((w, i) => (
                  <RevealItem key={w.t}>
                    <HoverCard className={lightCard}>
                      <Idx>{String(i + 1).padStart(2, '0')}</Idx>
                      <h3 className="mb-2 text-[17px] font-semibold leading-snug text-ink-dark">{w.t}</h3>
                      <p className="text-[15px] leading-relaxed text-ink-grey">{w.p}</p>
                    </HoverCard>
                  </RevealItem>
                ))}
              </Reveal>
            </Container>
          </Section>

          {/* ── 02 HOW ── */}
          <Section tone="base" spacing="lg" id="how" className={anchorClass}>
            <Container>
              <Reveal className="mx-auto max-w-2xl text-center">
                <Eyebrow className="justify-center text-ink/45">02 - How DROS works</Eyebrow>
                <Heading as="h2" size="display" className="mt-4">
                  Every account. Every day. On record.
                </Heading>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                  DROS is the AI-native engagement OS for US collections. It works the accounts your
                  collectors never get to - and hands them the live conversations.
                </p>
              </Reveal>
              <Reveal stagger={0.08} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {HOW.map((s, i) => (
                  <RevealItem key={s.t}>
                    <HoverCard className={darkCard}>
                      <Idx>{String(i + 1).padStart(2, '0')}</Idx>
                      <h3 className="mb-1.5 text-[18px] font-semibold text-ink">{s.t}</h3>
                      <p className="text-[14px] leading-relaxed text-ink/55">{s.p}</p>
                    </HoverCard>
                  </RevealItem>
                ))}
              </Reveal>
            </Container>
          </Section>

          {/* ── 03 COMPLIANCE ── */}
          <Section tone="light" spacing="lg" id="compliance" className={anchorClass}>
            <Container>
              <Reveal className="mx-auto max-w-2xl text-center">
                <Eyebrow className="justify-center text-ink-grey">03 - For your compliance officer</Eyebrow>
                <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                  Compliant by design. Not by exception.
                </Heading>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-grey">
                  Try to break it. The rules live inside the engine, and every call leaves evidence.
                </p>
              </Reveal>
              <Reveal stagger={0.1} className="mt-12 grid gap-4 md:grid-cols-3">
                {COMPLIANCE.map((c) => (
                  <RevealItem key={c.k}>
                    <HoverCard className={`${lightCard} p-7`}>
                      <Idx>{c.k}</Idx>
                      <h3 className="mb-2 text-[17px] font-semibold leading-snug text-ink-dark">{c.t}</h3>
                      <p className="text-[15px] leading-relaxed text-ink-grey">{c.p}</p>
                    </HoverCard>
                  </RevealItem>
                ))}
              </Reveal>
              <Reveal stagger={0.04} delay={0.1} className="mt-8 flex flex-wrap justify-center gap-2">
                {BADGES.map((b) => (
                  <RevealItem key={b}>
                    <motion.span
                      whileHover={{ y: -2, scale: 1.04 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="inline-block cursor-default rounded-full border border-line-dark bg-white px-3.5 py-1.5 font-mono text-[12.5px] text-ink-dark/80 transition-colors duration-200 hover:border-accent/50 hover:text-ink-dark"
                    >
                      {b}
                    </motion.span>
                  </RevealItem>
                ))}
              </Reveal>
            </Container>
          </Section>

          {/* ── 04 WHO ── */}
          <Section tone="base" spacing="lg" id="who" className={anchorClass}>
            <Container>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <Reveal>
                  <Eyebrow className="text-ink/45">04 - Built for collections teams</Eyebrow>
                  <Heading as="h2" size="display" className="mt-4">
                    25-200 seats. Fresh, low-balance paper. Clients who read scorecards.
                  </Heading>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink/55">
                    DROS is priced and implemented for the mid-market agency that enterprise vendors
                    ignore - healthcare, utilities, telecom, auto deficiency, consumer loans and
                    membership paper, in-statute and high-volume. First-party teams, third-party
                    agencies, debt buyers, credit unions and consumer lenders.
                  </p>
                  <blockquote className="mt-6 border-l-2 border-accent pl-4 text-[17px] leading-[1.5] tracking-[-0.01em] text-ink/90 sm:text-[19px]">
                    “Every in-statute account you don’t reach is a dollar your client’s next agency
                    collects - and a point off your scorecard at the next placement review.”
                    <footer className="mt-3 text-[13px] tracking-normal text-ink/45">
                      What we hear from agency owners at ACA International, 2026
                    </footer>
                  </blockquote>
                </Reveal>

                <Reveal stagger={0.08} className="grid gap-3">
                  {WHO.map((w) => (
                    <RevealItem key={w.t}>
                      <HoverCard
                        className={
                          w.accent
                            ? 'border-accent/25 bg-accent/[0.07] hover:border-accent/50 hover:shadow-[0_18px_40px_-22px_rgba(3,210,252,0.4)]'
                            : darkCard
                        }
                      >
                        <h3 className="mb-1.5 text-[17px] font-semibold text-ink">{w.t}</h3>
                        <p className="text-[15px] leading-relaxed text-ink/60">{w.p}</p>
                      </HoverCard>
                    </RevealItem>
                  ))}
                </Reveal>
              </div>
            </Container>
          </Section>

          {/* ── 05 PROOF ── */}
          <Section tone="light" spacing="lg" id="proof" className={anchorClass}>
            <Container>
              <Reveal className="mx-auto max-w-2xl text-center">
                <Eyebrow className="justify-center text-ink-grey">05 - How we start</Eyebrow>
                <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                  A 30-day proof on one portfolio
                </Heading>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-grey">
                  Your rules. Your QA sign-off. Your numbers decide.
                </p>
              </Reveal>
              <Reveal stagger={0.08} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {PROOF.map((p) => (
                  <RevealItem key={p.k}>
                    <HoverCard
                      className={
                        p.accent
                          ? 'border-accent/25 bg-base text-ink hover:border-accent/60 hover:shadow-[0_18px_40px_-22px_rgba(3,210,252,0.45)]'
                          : lightCard
                      }
                    >
                      <Idx>{p.k}</Idx>
                      <h3 className={`mb-2 text-[17px] font-semibold ${p.accent ? 'text-ink' : 'text-ink-dark'}`}>{p.t}</h3>
                      <p className={`text-[15px] leading-relaxed ${p.accent ? 'text-ink/65' : 'text-ink-grey'}`}>{p.p}</p>
                    </HoverCard>
                  </RevealItem>
                ))}
              </Reveal>
            </Container>
          </Section>

          {/* ── 06 FAQ ── */}
          <Section tone="base" spacing="lg" id="faq" className={anchorClass}>
            <Container className="max-w-[880px]">
              <Reveal className="mx-auto max-w-2xl text-center">
                <Eyebrow className="justify-center text-ink/45">06 - Questions owners ask us</Eyebrow>
                <Heading as="h2" size="display" className="mt-4">
                  FAQ
                </Heading>
              </Reveal>

              <Reveal stagger={0.05} className="mt-10 grid gap-2.5">
                {FAQ.map((item, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <RevealItem key={item.q}>
                      <div
                        className={`rounded-xl border bg-white/[0.04] transition-colors duration-200 ${
                          isOpen ? 'border-accent/35' : 'border-hair hover:border-white/20'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : i)}
                          aria-expanded={isOpen}
                          aria-controls={`cg-faq-${i}`}
                          className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                        >
                          <span className="text-[15px] font-medium leading-snug text-ink">{item.q}</span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                              isOpen ? 'rotate-180 text-accent' : 'text-ink/35'
                            }`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              id={`cg-faq-${i}`}
                              key="a"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="px-5 pb-4 text-[15px] font-light leading-relaxed text-ink/60">
                                {item.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </RevealItem>
                  );
                })}
              </Reveal>
            </Container>
          </Section>

          {/* ── FINAL CTA ── */}
          <Section tone="light" spacing="lg" id="cta">
            <Container>
              <Reveal className="relative overflow-hidden rounded-card border border-accent/20 bg-base px-8 py-14 sm:px-12 md:py-16">
                <motion.div
                  aria-hidden="true"
                  animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="pointer-events-none absolute bottom-0 left-1/2 h-[280px] w-[520px] -translate-x-1/2 rounded-full"
                  style={{ background: 'radial-gradient(ellipse, rgba(3,210,252,0.14) 0%, transparent 70%)' }}
                />
                <div className="relative grid items-center gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
                  <div>
                    <Eyebrow className="text-ink/45">Next step</Eyebrow>
                    <Heading as="h2" size="display" className="mt-4">
                      Find your coverage gap in two minutes.
                    </Heading>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                      Seven questions, your numbers, a personalised report - and a 30-day proof plan
                      if you want one. Or write to{' '}
                      <a
                        href="mailto:sales@vodex.ai"
                        className="text-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                      >
                        sales@vodex.ai
                      </a>
                      .
                    </p>
                  </div>
                  <div className="md:justify-self-end">
                    <Button variant="primary" size="lg" onClick={start} className="w-full md:w-auto">
                      Take the assessment
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </div>
              </Reveal>
            </Container>
          </Section>
        </main>

        <CoverageFooter />
      </PageFade>

      <Assessment
        open={open}
        state={state}
        onChange={update}
        onClose={close}
        bannerVisible={!bannerDismissed}
      />
    </MotionConfig>
  );
}
