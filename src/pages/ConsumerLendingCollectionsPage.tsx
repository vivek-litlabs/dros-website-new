export const route = '/collections/consumer-lending';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Section, Container, Eyebrow, Heading, Button } from '../components/ui';
import Reveal, { RevealItem } from '../components/Reveal';
import PageFade from '../components/PageFade';
import HeroBg from '../components/HeroBg';
import DemoWidget from '../components/home/DemoWidget';
import { trackCta } from '../lib/analytics';

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'Does DROS integrate with our loan servicing platform?',
    a: 'Yes. DROS syncs delinquent accounts via CSV or API - balances, DPD bucket, contact info, and payment history. There is no migration project and nothing changes in your system of record. Most lenders are live within days.',
  },
  {
    q: 'How does DROS decide the strategy for each bucket?',
    a: 'Each DPD bucket runs its own cadence, tone, and offer within rules you approve - friendly reminders early, escalated negotiation through the Promise-to-Pay Engine mid-cycle, and human handoff with full context once judgment is required.',
  },
  {
    q: 'Will borrowers know they are talking to AI?',
    a: 'DROS agents identify themselves per your disclosure requirements. Conversations are natural, patient, and scripted to your standards - borrowers can always request a person, and those conversations route to your team instantly with full context.',
  },
  {
    q: 'How does DROS handle Reg F, FDCPA, and state mini-FDCPA rules for first-party lending?',
    a: 'Contact frequency, timing, and disclosure rules are enforced at the system level before any attempt is made - including state-specific mini-FDCPA requirements. Every interaction is recorded, transcribed, and exportable on demand.',
  },
  {
    q: 'What does it cost?',
    a: 'Plans start at a flat monthly rate with included call minutes - no per-seat pricing, no long implementation fees. See pricing, or talk to us about your portfolio size.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const BUCKETS = [
  { label: 'DPD 1-30', sub: 'DROS works 100% of accounts here', height: 'h-[168px]', tone: 'accent' as const },
  { label: 'DPD 31-60', sub: 'Fewer accounts roll', height: 'h-[120px]', tone: 'muted' as const },
  { label: 'DPD 61-90', sub: 'Fewer still', height: 'h-[84px]', tone: 'muted' as const },
  { label: 'Charge-off', sub: 'Shrinks', height: 'h-[52px]', tone: 'red' as const },
];

export default function ConsumerLendingCollectionsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <PageFade className="min-h-screen bg-base text-ink">
      <Helmet>
        <title>AI Collections Software for Consumer Lenders | DROS</title>
        <meta name="description" content="DROS works your entire delinquent loan book from day 1 past due - every account, every channel, every day. Accounts cured in the first bucket never roll, never age, never charge off." />
        <meta name="keywords" content="consumer lending collections software, roll rate reduction, early-stage delinquency, DPD bucket strategy, first-party loan servicing, auto finance collections, personal loan collections software" />
        <link rel="canonical" href="https://dros.ai/collections/consumer-lending" />
        <meta property="og:title" content="AI Collections Software for Consumer Lenders | DROS" />
        <meta property="og:description" content="DROS works your entire delinquent loan book from day 1 past due - every account, every channel, every day. Accounts cured in the first bucket never charge off." />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/collections/consumer-lending" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Navbar transparent />

      <main>
        {/* ── HERO ── */}
        <header
          data-nav-theme="dark"
          className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden bg-base text-white"
        >
          <HeroBg image="/industries/consumer-lending.jpg" />

          <Container wide className="relative z-40">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs text-white/85 backdrop-blur-md">
                  For consumer lending
                </span>
              </Reveal>

              <Reveal large>
                <h1 className="font-saans text-[34px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[46px] xl:text-[54px]">
                  <span className="block text-white">Charge-offs aren't lost at day 120.</span>
                  <span className="block text-white/55">They're lost at day 10.</span>
                </h1>
              </Reveal>

              <Reveal>
                <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
                  DROS works your entire delinquent book from day 1 past due - every account, every day, on every channel. Accounts cured in the first bucket never roll, never age, never charge off.
                </p>
              </Reveal>

              <Reveal delay={0.1} className="flex flex-wrap justify-center gap-3">
                <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('Book a lending walkthrough')}>
                  Book a lending walkthrough <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="lg" to="/resources/videos">
                  See AI agents in action
                </Button>
              </Reveal>
            </div>
          </Container>
        </header>

        {/* ── TRUST BAR ── */}
        <Section tone="base" spacing="sm" id="trust-bar">
          <Container>
            <Reveal className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {[
                'Reg F & FDCPA aligned',
                '100% of the book worked daily',
                'Live in days, not quarters',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-ink/60">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </div>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── ROLL-RATE BUCKETS ── */}
        <Section tone="base" spacing="sm" id="roll-rate">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">Roll rate</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                Every account cured early is a charge-off that never happens.
              </Heading>
            </Reveal>

            <Reveal delay={0.1} stagger={0.08} className="mx-auto mt-10 grid max-w-3xl grid-cols-4 items-end gap-3 sm:gap-4">
              {BUCKETS.map((b) => (
                <RevealItem key={b.label} className="flex flex-col items-center">
                  <div
                    className={`flex w-full flex-col justify-end rounded-t-[10px] rounded-b-[4px] border px-3 py-4 sm:px-4 ${b.height} ${
                      b.tone === 'accent'
                        ? 'border-accent/50 bg-gradient-to-b from-accent/25 to-accent/5 text-accent'
                        : b.tone === 'red'
                        ? 'border-red-400/40 bg-red-400/10 text-red-300'
                        : 'border-hair bg-white/[0.05] text-ink/70'
                    }`}
                  >
                    <div className="font-display text-[11px] font-medium uppercase tracking-[0.06em]">{b.label}</div>
                    <div className="mt-1 text-[10.5px] leading-snug opacity-80">{b.sub}</div>
                  </div>
                </RevealItem>
              ))}
            </Reveal>

            <Reveal delay={0.2} className="mx-auto mt-8 max-w-[60ch] text-center text-sm leading-relaxed text-ink/55">
              <strong className="text-accent">The cheapest dollar to recover is the one that never rolls.</strong> Every account cured in the first bucket is a charge-off that never happens.
            </Reveal>
          </Container>
        </Section>

        {/* ── CAPACITY MATH ── */}
        <Section tone="light" spacing="sm" id="capacity">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">The capacity problem</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                Your book grows daily. Your dialer team doesn't.
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-grey">
                So teams triage - oldest and biggest balances first - while early-stage accounts sit untouched through the days that decide them.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-9 grid grid-cols-1 overflow-hidden rounded-card border border-line-dark sm:grid-cols-2">
              <div className="border-b border-line-dark bg-white p-8 sm:border-b-0 sm:border-r sm:p-11">
                <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-grey">A collector on a dialer</div>
                <div className="mb-3 font-display text-[44px] leading-none text-ink-dark sm:text-[52px]">~200</div>
                <p className="max-w-[34ch] text-[15px] leading-relaxed text-ink-grey">accounts touched per day. One channel. Business hours. Most calls unanswered.</p>
              </div>
              <div className="bg-base p-8 sm:p-11">
                <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">DROS</div>
                <div className="mb-3 font-display text-[44px] leading-none text-accent sm:text-[52px]">100%</div>
                <p className="max-w-[34ch] text-[15px] leading-relaxed text-ink/70">of your book worked every day it should be - call, text, and email, at any volume.</p>
              </div>
            </Reveal>
            <p className="mt-4 text-[12.5px] text-ink-grey/70">Illustrative capacity - actual dialer throughput varies by shop.</p>
          </Container>
        </Section>

        {/* ── BUCKET PLAYBOOK ── */}
        <Section tone="base" spacing="sm" id="playbook">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">The bucket playbook</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                A different play for every bucket. Automatically.
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                DROS runs the right cadence, tone, and offer for where each account actually is - within rules you set.
              </p>
            </Reveal>

            <Reveal stagger={0.08} className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                {
                  dpd: 'DPD 1-30',
                  h: 'Cure it before it rolls',
                  d: 'Friendly, brand-safe outreach from day 1. Most borrowers here just need a nudge and an easy way to pay.',
                  items: ["Payment reminders on the borrower's channel", 'Secure pay links in every message', 'Payment date moves, booked instantly'],
                },
                {
                  dpd: 'DPD 31-60',
                  h: 'Turn contact into commitment',
                  d: 'Escalated cadence and real negotiation - the Promise-to-Pay Engine works within the terms you approve.',
                  items: ['Split payments and plans, auto-booked', 'Broken promises chased same-day', 'Right-party contact verified on every touch'],
                },
                {
                  dpd: 'DPD 61+',
                  h: 'Escalate with full context',
                  d: 'Accounts that need judgment route to your team - or your agency - with the entire conversation history attached.',
                  items: ['Hardship and disputes flagged to humans', 'Clean handoff files, nothing re-asked', 'Every prior touch logged and traceable'],
                },
              ].map((p) => (
                <RevealItem key={p.dpd}>
                  <div className="h-full rounded-card border border-hair bg-surface-2/60 p-8">
                    <div className="mb-4 flex items-center gap-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-accent">
                      {p.dpd}
                      <span className="h-px flex-1 bg-hair" />
                    </div>
                    <h3 className="mb-3.5 text-xl font-semibold leading-tight text-white">{p.h}</h3>
                    <p className="mb-4 text-[14.5px] leading-relaxed text-ink/60">{p.d}</p>
                    <ul className="flex flex-col gap-2">
                      {p.items.map((item) => (
                        <li key={item} className="flex items-baseline gap-2.5 border-t border-hair pt-2 text-sm text-ink/70">
                          <span className="shrink-0 text-xs text-accent">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── BORROWER EXPERIENCE ── */}
        <Section tone="light" spacing="sm" id="borrower-experience">
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <Reveal>
                <Eyebrow className="text-ink-grey">Borrower experience</Eyebrow>
                <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                  It's your brand talking. Not a collection agency.
                </Heading>
                <p className="mt-4 max-w-md text-[16.5px] leading-relaxed text-ink-grey">
                  First-party outreach is a retention moment, not just a recovery one. Borrowers who get treated well come back for the next loan.
                </p>
                <ul className="mt-7 flex flex-col gap-1">
                  {[
                    'Your scripts, your tone, your disclosures',
                    "Patient conversations, 24/7, in the borrower's language",
                    'A person is always one ask away - routed with full history',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 border-t border-line-dark py-3 text-[15.5px] leading-snug text-ink-dark first:border-t-0">
                      <span className="mt-0.5 shrink-0 font-bold text-accent">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mx-auto max-w-[380px] overflow-hidden rounded-card border border-line-dark bg-base p-5 shadow-[0_24px_64px_rgba(11,15,31,.18)]">
                  <div className="mb-4 flex items-center gap-3 border-b border-hair pb-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 font-display text-[13px] font-semibold text-accent">
                      L
                    </div>
                    <div>
                      <div className="text-[13.5px] font-semibold text-white">Your Lending Brand</div>
                      <div className="text-[11.5px] text-white/50">Automated by DROS</div>
                    </div>
                  </div>
                  <div className="mb-2.5 text-center text-[10.5px] tracking-[0.04em] text-white/40">DAY 2 PAST DUE · 9:41 AM</div>
                  <div className="mb-2.5 max-w-[88%] rounded-2xl rounded-bl-sm bg-white/[0.08] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white/90">
                    Hi Marcus, quick reminder - your loan payment of $184 was due Jun 1. Reply here or tap to pay: [secure link]
                  </div>
                  <div className="mb-2.5 ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-accent px-3.5 py-2.5 text-[13.5px] leading-relaxed text-base">
                    Got paid Friday. Can it come out on the 6th instead?
                  </div>
                  <div className="mb-3 max-w-[88%] rounded-2xl rounded-bl-sm bg-white/[0.08] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white/90">
                    Done - $184 scheduled for Jun 6. You'll get a confirmation before it runs. Thanks, Marcus.
                  </div>
                  <div className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-center text-[12.5px] text-accent">
                    ✓ Payment scheduled · Logged &amp; compliant
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ── COMPLIANCE STRIP ── */}
        <Section tone="base" spacing="sm" id="compliance">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">Compliance</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                First-party outreach, held to third-party standards.
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                Every interaction scripted, logged, and audited automatically - so growth in outreach volume never becomes growth in regulatory risk.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-9 grid grid-cols-1 divide-y divide-hair overflow-hidden rounded-card border border-hair sm:grid-cols-5 sm:divide-x sm:divide-y-0">
              {[
                { t: 'Reg F & FDCPA', d: 'Frequency, timing, and disclosure rules enforced by the system' },
                { t: 'TCPA', d: 'Consent tracked per channel, revocation honored in real time' },
                { t: 'UDAAP', d: 'Approved scripts only - nothing improvised, everything showable' },
                { t: 'State mini-FDCPA', d: 'State-level rules applied automatically, every call' },
                { t: '100% audit trail', d: 'Recorded, transcribed, exportable on demand' },
              ].map((c) => (
                <div key={c.t} className="bg-surface-2/40 p-6">
                  <div className="mb-1.5 text-[15px] font-medium text-ink">{c.t}</div>
                  <div className="text-[13px] leading-relaxed text-ink/55">{c.d}</div>
                </div>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── PROOF ── */}
        <Section tone="light" spacing="sm" id="proof">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">Proof</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                Results from teams running DROS.
              </Heading>
            </Reveal>

            <div className="mt-9 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal stagger={0.06} className="flex flex-col">
                {[
                  { n: '7×', t: 'Improvement in right-party contact rates' },
                  { n: '+18%', t: 'Recovery lift in the first 90 days' },
                  { n: '1.8M+', t: 'Accounts worked on the platform' },
                ].map((s, i, arr) => (
                  <RevealItem key={s.t}>
                    <div className={`flex items-baseline gap-5 py-6 ${i > 0 ? 'border-t border-line-dark' : ''} ${i === arr.length - 1 ? 'border-b border-line-dark' : ''}`}>
                      <div className="min-w-[110px] font-display text-[42px] leading-none text-accent">{s.n}</div>
                      <div className="text-[15px] text-ink-grey">{s.t}</div>
                    </div>
                  </RevealItem>
                ))}
              </Reveal>

              <Reveal delay={0.1} className="rounded-card bg-base p-11">
                <p className="font-display text-[21px] leading-[1.5] text-white">
                  "DROS does the outreach we never had the staff for, and every call comes back fully logged and compliant. It pays for itself."
                </p>
                <cite className="mt-5 block text-sm not-italic text-white/55">
                  Darryl Brown - Principal,{' '}
                  <Link to="/customer-stories" className="text-accent underline underline-offset-2 hover:opacity-80">
                    Greystone &amp; Associates
                  </Link>
                </cite>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ── FAQ ── */}
        <Section tone="base" spacing="sm" id="faq">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
              <Reveal>
                <Eyebrow className="text-ink/45">Common questions</Eyebrow>
                <Heading as="h2" size="display" className="mt-4">
                  DROS for consumer lenders
                </Heading>
                <p className="mt-4 text-sm leading-relaxed text-ink/50">
                  Can't find your answer?{' '}
                  <Link to="/contact" className="text-accent underline underline-offset-2 hover:opacity-80">
                    Reach out to our team
                  </Link>
                  .
                </p>
              </Reveal>

              <Reveal stagger={0.05} className="grid grid-cols-1 gap-2.5">
                {FAQS.map((faq, i) => (
                  <RevealItem key={faq.q}>
                    <div className={`rounded-xl border bg-white/[0.04] transition-colors duration-200 ${openFaq === i ? 'border-accent/35' : 'border-hair'}`}>
                      <button
                        type="button"
                        aria-expanded={openFaq === i}
                        aria-controls={`cl-faq-panel-${i}`}
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
                      >
                        <span className="text-sm font-medium leading-snug text-ink">{faq.q}</span>
                        <ChevronDown
                          className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 ${
                            openFaq === i ? 'rotate-180 text-accent' : 'text-ink/30'
                          }`}
                        />
                      </button>
                      {openFaq === i && (
                        <p id={`cl-faq-panel-${i}`} className="px-5 pb-4 text-sm font-light leading-relaxed text-ink/55">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </Container>
        </Section>

        <DemoWidget />

        {/* ── PRICING TEASER ── */}
        <Section tone="light" spacing="sm" id="pricing-teaser">
          <Container>
            <Reveal className="relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-card border border-accent/20 bg-base px-8 py-10 md:flex-row md:items-center md:px-14 md:py-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 h-72 w-72 -translate-y-16 translate-x-16 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(3,210,252,0.1), transparent 70%)' }}
              />
              <div className="relative flex-1">
                <div className="mb-2 text-[26px] font-semibold leading-tight text-white">Simple pricing. No surprises.</div>
                <div className="max-w-md text-[15px] leading-relaxed text-ink/50">Built for consumer lenders of all sizes - from a single book to enterprise-scale portfolios.</div>
              </div>
              <div className="relative shrink-0 text-center">
                <Button variant="primary" size="lg" to="/pricing">
                  See pricing →
                </Button>
                <div className="mt-3 text-[13px] text-ink/40">No commitment required</div>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ── FINAL CTA ── */}
        <Section tone="light" spacing="sm" id="cta">
          <Container>
            <Reveal className="relative overflow-hidden rounded-card border border-accent/20 bg-base px-8 py-16 text-center sm:px-12 md:py-20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-1/2 h-[280px] w-[500px] -translate-x-1/2 rounded-full"
                style={{ background: 'radial-gradient(ellipse, rgba(3,210,252,0.12) 0%, transparent 70%)' }}
              />
              <div className="relative">
                <Eyebrow className="justify-center text-ink-grey">Hear it yourself</Eyebrow>
                <Heading as="h2" size="display-lg" className="mx-auto mt-4 max-w-lg">
                  See DROS on your delinquent loan book
                </Heading>
                <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink/55">
                  Bring your servicing platform and bucket strategy. We'll show you exactly how it fits.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('Book a lending walkthrough - final CTA')}>
                    Book a lending walkthrough <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="lg" to="/contact">
                    Talk to us about AI agents
                  </Button>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {['No commitment required', 'Stack review included', 'Bucket strategy modeled live', 'Works with your existing tools'].map((perk) => (
                    <span key={perk} className="rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5 text-xs text-accent/90">
                      {perk}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>
      </main>

      <Footer />
    </PageFade>
  );
}
