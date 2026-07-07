export const route = '/collections/first-party';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChevronDown, TrendingUp, AlertTriangle, Layers } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Section, Container, Eyebrow, Heading, Button, Card } from '../components/ui';
import Reveal, { RevealItem } from '../components/Reveal';
import PageFade from '../components/PageFade';
import { trackCta } from '../lib/analytics';
import HeroBg from '../components/HeroBg';

/*
 * First-party collections page. Content is sourced verbatim from the
 * reference first-party.pdf (original dros.ai/collections/first-party
 * page). Visual layer follows the Customer.io-inspired system already
 * built for the homepage and Pricing page - shared primitives
 * (Section/Container/Heading/Button/Card), Reveal scroll animation, and
 * the single-accent token palette - instead of the old bespoke dark clone.
 */

// ─── Persona data ───────────────────────────────────────────────────────────
const PERSONAS = [
  {
    role: 'Collections / Operations Director',
    h: 'One OS. Every channel. Every segment.',
    items: [
      'Coordinate AI and human campaigns from a single OS - no more juggling dialer dashboards and list exports',
      'Build routing rules around delinquency stage, risk tier, product type, and account exposure - not manual queues',
      'See AI vs human performance, contact rates, and coverage gaps in one live view',
      'Swap or add dialers without rebuilding strategy logic - it lives in DROS, not inside each platform',
    ],
  },
  {
    role: 'Compliance / QA Lead',
    h: "Brand rules and regs - in the platform. Not people's heads.",
    items: [
      'Encode brand tone, Reg F, UDAAP, and internal restrictions once - applied before any AI or human touches an account',
      'Consent revocations and opt-outs honored in real time across every channel - no lag, no manual syncing',
      'Review recordings, transcripts, and scripts from one pane when QA, auditors, or regulators arrive',
      'Hardship, dispute, and complaint keywords trigger automatic escalation - not manual flag-and-call workflows',
    ],
  },
  {
    role: 'VP / Head of Recovery',
    h: 'Better recoveries. Cleaner handoffs.',
    items: [
      'Increase early-stage resolution rates by giving every account the right touch - AI or human - at the right moment',
      'Cover more accounts without headcount growth - AI handles tier-1 volume so humans focus on high-value conversations',
      'When accounts reach placement or sale, they carry a rich timeline and updated data - improving downstream performance',
      'Demonstrate a modern, AI-orchestrated recovery capability that satisfies internal and regulatory scrutiny',
    ],
  },
];

// ─── Lifecycle data ──────────────────────────────────────────────────────────
const LIFECYCLE = [
  {
    stage: 'Early delinquency',
    days: '1-30 days past due',
    ai: [
      'Reminders via SMS, email, and voice - in your brand tone',
      'Balance confirmations and portal links',
      'Due-date nudges and direct debit confirmations',
      '24/7 inbound - balance, payment options, due date queries',
    ],
    hu: [
      'Hardship signals detected mid-call - immediate transfer to trained agent',
      'VIP and high-exposure accounts flagged for human-first treatment',
    ],
    os: 'Enforces contact schedules, approved scripts, brand tone, and channel consent before every attempt.',
  },
  {
    stage: 'Mid-stage',
    days: '30-90 days past due',
    ai: [
      'Structured follow-ups on promises-to-pay per schedule',
      'Payment plan reminders and confirmations',
      'Simple rescheduling within policy limits',
    ],
    hu: [
      'Complex and bespoke negotiations',
      "Missed PTPs beyond AI's authority to resolve",
      'Multi-account and high-balance situations',
    ],
    os: 'Tracks every promise, conditions, and auto-flags risk accounts for human review - no manual monitoring needed.',
  },
  {
    stage: 'Pre-charge-off',
    days: '90+ days · pre-placement',
    ai: [
      'Last-chance outreach before charge-off',
      'Address, email, and phone data clean-up',
      'Proactive explainers on consequences of non-resolution',
    ],
    hu: [
      'Keep-in-house vs outsource vs sell decisions',
      'Escalations, complaints, and regulatory mentions',
    ],
    os: 'Provides response data by segment - informing which accounts to retain, place, or sell.',
  },
];

// ─── FAQ data ────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: 'What is first-party collections software?',
    a: (
      <>
        First-party collections software helps creditors manage in-house debt recovery <strong>in their own name</strong>, typically for early-stage and pre-charge-off accounts. Unlike third-party platforms built for separate agencies, first-party software must enforce brand tone, CX policies, and compliance rules alongside standard collections workflows. DROS is built specifically for this: it orchestrates <strong>AI voice agents, human agents, and omnichannel outreach</strong> from a single platform, with Reg F compliance and brand rules enforced before any contact attempt.
      </>
    ),
  },
  {
    q: 'How is first-party collections different from third-party collections?',
    a: (
      <>
        First-party outreach happens <strong>in the creditor's own name</strong>, typically early in the delinquency lifecycle, with emphasis on brand continuity, customer retention, and respectful communication. Third-party involves a separate brand at later or charged-off stages. DROS is purpose-built for first-party: it enforces <strong>brand tone, CX rules, and compliance</strong> at the operating layer - not just call-frequency caps.
      </>
    ),
  },
  {
    q: 'How do AI voice agents work in first-party collections?',
    a: (
      <>
        <a href="/features/context-aware-voice-ai-agents-for-debt-collection" className="text-accent underline underline-offset-2 transition-opacity hover:opacity-80">DROS's <strong>AI Voice Agents for Debt Collection</strong></a> handle high-volume early-stage outreach - payment reminders, balance confirmations, standard payment plan suggestions, and 24/7 inbound queries - using your approved scripts, brand intros, and disclosures. When a hardship signal, dispute, or escalation trigger is detected mid-call, the AI routes <strong>immediately to a human agent with the full account timeline attached</strong>, so agents walk in context-ready.
      </>
    ),
  },
  {
    q: 'Does DROS support Reg F compliance for in-house collections teams?',
    a: (
      <>
        Yes. DROS bakes <strong>Reg F, UDAAP, and configurable internal policies</strong> into the operating layer as default guardrails - including 7-in-7-style call frequency caps, quiet hour enforcement, and real-time consent management across all channels. Many first-party teams also voluntarily follow FDCPA-style best practices; these can be encoded directly into DROS workflows per product line or account type.
      </>
    ),
  },
  {
    q: 'Does DROS replace our existing CRM, billing system, or dialer?',
    a: (
      <>
        No - and that's intentional. DROS connects to your existing tools as execution endpoints. Your current stack stays. <strong>Switching a dialer or adding a new channel is a configuration change</strong>, not a rebuild - because your engagement logic lives in DROS, not inside any single platform.
      </>
    ),
  },
  {
    q: 'How does DROS enforce brand tone alongside compliance rules?',
    a: (
      <>
        DROS applies brand tone, approved scripts, and disclosure requirements <strong>at the same layer as compliance rules</strong> - before any AI or human agent makes a contact attempt. AI voice agents use your approved intros, language guidelines, and disclaimers. Human agents see the same script library.
      </>
    ),
  },
  {
    q: 'How does DROS help with handoff to third-party agencies or debt buyers?',
    a: (
      <>
        When accounts reach pre-placement stage, DROS provides a <strong>rich account timeline, updated contact data, and documented outreach history</strong>. That context improves agency performance and debt-buyer pricing - and it's already there, produced naturally by running DROS throughout the collections lifecycle.
      </>
    ),
  },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is first-party collections software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "First-party collections software helps creditors manage in-house debt recovery in their own name, typically for early-stage and pre-charge-off accounts. Unlike third-party platforms built for separate agencies, first-party software must enforce brand tone, CX policies, and compliance rules alongside standard collections workflows. DROS is built specifically for this: it orchestrates AI voice agents, human agents, and omnichannel outreach from a single platform, with Reg F compliance and brand rules enforced before any contact attempt.",
      },
    },
    {
      '@type': 'Question',
      name: 'How is first-party collections different from third-party collections?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "First-party outreach happens in the creditor's own name, typically early in the delinquency lifecycle, with emphasis on brand continuity, customer retention, and respectful communication. Third-party involves a separate brand at later or charged-off stages. DROS is purpose-built for first-party: it enforces brand tone, CX rules, and compliance at the operating layer - not just call-frequency caps.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do AI voice agents work in first-party collections?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DROS AI voice agents handle high-volume early-stage outreach - payment reminders, balance confirmations, standard payment plan suggestions, and 24/7 inbound queries - using your approved scripts, brand intros, and disclosures. When a hardship signal, dispute, or escalation trigger is detected mid-call, the AI routes immediately to a human agent with the full account timeline attached, so agents walk in context-ready.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does DROS support Reg F compliance for in-house collections teams?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. DROS bakes Reg F, UDAAP, and configurable internal policies into the operating layer as default guardrails - including 7-in-7-style call frequency caps, quiet hour enforcement, and real-time consent management across all channels. Many first-party teams also voluntarily follow FDCPA-style best practices; these can be encoded directly into DROS workflows per product line or account type.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does DROS replace our existing CRM, billing system, or dialer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No - and that's intentional. DROS connects to your existing tools as execution endpoints. Your current stack stays. Switching a dialer or adding a new channel is a configuration change, not a rebuild - because your engagement logic lives in DROS, not inside any single platform.",
      },
    },
    {
      '@type': 'Question',
      name: 'How does DROS enforce brand tone alongside compliance rules?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DROS applies brand tone, approved scripts, and disclosure requirements at the same layer as compliance rules - before any AI or human agent makes a contact attempt. AI voice agents use your approved intros, language guidelines, and disclaimers. Human agents see the same script library.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does DROS help with handoff to third-party agencies or debt buyers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "When accounts reach pre-placement stage, DROS provides a rich account timeline, updated contact data, and documented outreach history. That context improves agency performance and debt-buyer pricing - and it's already there, produced naturally by running DROS throughout the collections lifecycle.",
      },
    },
  ],
};

export default function FirstPartyCollectionsPage() {
  const [activePersona, setActivePersona] = useState(0);
  const [activeLifecycle, setActiveLifecycle] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const lc = LIFECYCLE[activeLifecycle];

  return (
    <PageFade className="min-h-screen bg-base text-ink">
      <Helmet>
        <title>AI-Powered First-Party Collections Platform | DROS</title>
        <meta name="description" content="DROS is the AI-powered engagement OS for first-party and in-house collections teams. Orchestrate AI voice agents, human agents, and omnichannel workflows — with Reg F compliance, brand rules, and CX guardrails enforced at the platform layer." />
        <link rel="canonical" href="https://dros.ai/collections/first-party" />
        <meta property="og:title" content="AI-Powered First-Party Collections Platform | DROS" />
        <meta property="og:description" content="DROS is the AI-powered engagement OS for first-party and in-house collections teams. Orchestrate AI voice agents, human agents, and omnichannel workflows — with Reg F compliance, brand rules, and CX guardrails enforced at the platform layer." />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/collections/first-party" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navbar transparent />

      <main>
        {/* ── HERO ── */}
        <header
          data-nav-theme="dark"
          className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden bg-base text-white"
        >
          <HeroBg image="/industries/first-party.jpg" />

          <Container wide className="relative z-40">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs text-white/85 backdrop-blur-md">
                  First-party &amp; in-house collections teams
                </span>
              </Reveal>

              <Reveal large>
                <h1 className="font-saans text-[38px] font-medium leading-[1.08] tracking-[-0.02em] sm:text-[52px] xl:text-[60px]">
                  <span className="block text-white">The engagement OS for</span>
                  <span className="block text-white/55">first-party collections</span>
                </h1>
              </Reveal>

              <Reveal>
                <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
                  DROS sits above your existing tools and orchestrates AI agents, human agents, and every channel - within your brand, compliance, and CX rules.
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <Button variant="primary" size="lg" href="https://dros.ai/book-meeting" onClick={() => trackCta('fp_hero_book_demo')}>
                  Book a demo <ArrowRight className="h-4 w-4" />
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
                'AI voice agents tuned for first-party',
                'Works with your existing CRM, dialer & billing systems',
                'Reg F, UDAAP, and consent - built into every workflow',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-ink/60">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </div>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── THE CHALLENGE ── */}
        <Section tone="light" spacing="lg" id="challenge">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">The first-party reality</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                Early-stage is where you save the relationship - and the debt.
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-grey">
                Volume, complexity, and scrutiny have all spiked for in-house collections teams. More segments, more channels, more regulatory pressure - with tools that weren't built for this.
              </p>
            </Reveal>

            <Reveal stagger={0.08} className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  Icon: TrendingUp,
                  title: 'Volume vs headcount',
                  desc: 'More accounts rolling into early delinquency with no proportional increase in budget or team size. Manual prioritisation means good accounts go untouched for days.',
                },
                {
                  Icon: AlertTriangle,
                  title: 'Brand and CX risk',
                  desc: 'Collections must sound like your company, not a third-party. A tone-deaf call or off-script AI exchange impacts NPS, churn, and regulatory standing simultaneously.',
                },
                {
                  Icon: Layers,
                  title: 'Fragmented customer view',
                  desc: "Context scattered across CRM, billing, dialers, and ticketing. Agents repeat themselves, miss signals, and can't see the full story before the call connects.",
                },
              ].map(({ Icon, title, desc }) => (
                <RevealItem key={title}>
                  <div className="h-full rounded-card border border-line-dark bg-white p-7 shadow-sm">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="mb-2.5 text-[17px] font-semibold text-ink-dark">{title}</div>
                    <p className="text-[15px] leading-relaxed text-ink-grey">{desc}</p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── AI + HUMAN ── */}
        <Section tone="base" spacing="lg" id="ai-human">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">AI + human agents</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                AI agents as a capacity multiplier, not a replacement
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                You define the rules. DROS executes them - routing each contact to the right agent, on the right channel, with the right script. AI handles volume. Humans handle judgment.
              </p>
            </Reveal>

            <Reveal stagger={0.1} className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
              <RevealItem>
                <Card className="h-full p-7 sm:p-9">
                  <span className="inline-block rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[.09em] text-accent">AI agents</span>
                  <div className="mt-4 text-xl font-semibold text-ink">High-volume, on-brand, always-on</div>
                  <ul className="mt-5 divide-y divide-hair">
                    {[
                      'Early reminders via SMS, email, and voice - in your tone',
                      'Balance confirmations and standard payment plans within policy',
                      'Portal links, contact detail updates, direct debit confirmations',
                      '24/7 inbound - balance, payment options, due date changes',
                      'Pre-charge-off explainers and last-chance outreach',
                    ].map((item) => (
                      <li key={item} className="py-2.5 text-[15px] leading-relaxed text-ink/70">{item}</li>
                    ))}
                  </ul>
                  <div className="mt-5 rounded-xl bg-accent/10 p-4 text-sm font-medium leading-relaxed text-accent">
                    Scales to every account - from day 1 to pre-placement - without headcount.
                  </div>
                </Card>
              </RevealItem>
              <RevealItem>
                <Card className="h-full p-7 sm:p-9">
                  <span className="inline-block rounded-full border border-orange-400/25 bg-orange-400/10 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[.09em] text-orange-300">Human agents</span>
                  <div className="mt-4 text-xl font-semibold text-ink">High-stakes, high-judgment conversations</div>
                  <ul className="mt-5 divide-y divide-hair">
                    {[
                      'Hardship - financial vulnerability, arrangements beyond policy',
                      'Disputes, complaints, regulatory or bureau mentions',
                      'Complex multi-account or high-balance negotiations',
                      'VIP and high-exposure accounts flagged for human-first',
                      'Keep-in-house vs outsource vs sell decisions',
                    ].map((item) => (
                      <li key={item} className="py-2.5 text-[15px] leading-relaxed text-ink/70">{item}</li>
                    ))}
                  </ul>
                  <div className="mt-5 rounded-xl bg-orange-400/10 p-4 text-sm font-medium leading-relaxed text-orange-300">
                    Every human pickup comes with full account context - no rebriefing needed.
                  </div>
                </Card>
              </RevealItem>
            </Reveal>
            <p className="mt-6 text-center text-[13px] text-ink/45">
              <strong className="text-ink/70">You set the routing rules.</strong> DROS enforces them - for every account, on every attempt.
            </p>
          </Container>
        </Section>

        {/* ── HOW DROS FITS ── */}
        <Section tone="light" spacing="lg" id="how-it-fits">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal>
                <Eyebrow className="text-ink-grey">How DROS fits</Eyebrow>
                <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                  Strategy lives in DROS. Your tools stay the same.
                </Heading>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-grey">
                  DROS sits above your CRM and dialers as a single engagement and orchestration layer. Brand rules, Reg F compliance, and omnichannel routing all live in one place - not scattered across tools.
                </p>
                <ul className="mt-6 divide-y divide-line-dark">
                  {[
                    'Brand tone, scripts, and compliance enforced before any attempt is made',
                    'Every touch in one unified account timeline - AI, human, and every channel',
                    'Swap dialers or add channels; your logic stays in DROS, no rebuild needed',
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 py-2.5 text-[15px] leading-relaxed text-ink-dark/80">
                      <span className="text-accent">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Button variant="onLight" size="lg" href="https://dros.ai/book-meeting" onClick={() => trackCta('fp_stack_walkthrough')}>
                    Book a stack walkthrough →
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={0.1} className="rounded-[18px] border border-line-dark bg-white p-7 shadow-sm">
                <svg viewBox="0 0 480 440" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }} aria-label="DROS sits as a layer above your existing tools">
                  <rect x="16" y="16" width="448" height="72" rx="14" fill="#fff" stroke="#e2e8f0" strokeWidth="1"/>
                  <text x="240" y="38" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif" letterSpacing=".1em">AGENTS &amp; CHANNELS</text>
                  <rect x="36" y="46" width="120" height="30" rx="7" fill="rgba(3,210,252,.1)" stroke="rgba(3,210,252,.25)" strokeWidth="1"/>
                  <text x="96" y="66" textAnchor="middle" fill="#0891a8" fontSize="12.5" fontWeight="600" fontFamily="Saans,-apple-system,sans-serif">AI Voice Agents</text>
                  <rect x="170" y="46" width="120" height="30" rx="7" fill="rgba(139,92,246,.08)" stroke="rgba(139,92,246,.22)" strokeWidth="1"/>
                  <text x="230" y="66" textAnchor="middle" fill="#7c3aed" fontSize="12.5" fontWeight="600" fontFamily="Saans,-apple-system,sans-serif">Human Agents</text>
                  <rect x="304" y="46" width="144" height="30" rx="7" fill="rgba(3,210,252,.08)" stroke="rgba(3,210,252,.25)" strokeWidth="1"/>
                  <text x="376" y="66" textAnchor="middle" fill="#0891a8" fontSize="12.5" fontWeight="600" fontFamily="Saans,-apple-system,sans-serif">SMS / Email / Portal</text>
                  <line x1="120" y1="88" x2="120" y2="134" stroke="rgba(3,210,252,.4)" strokeWidth="1.5" strokeDasharray="5,4"/>
                  <line x1="240" y1="88" x2="240" y2="134" stroke="rgba(3,210,252,.4)" strokeWidth="1.5" strokeDasharray="5,4"/>
                  <line x1="376" y1="88" x2="376" y2="134" stroke="rgba(3,210,252,.4)" strokeWidth="1.5" strokeDasharray="5,4"/>
                  <rect x="16" y="134" width="448" height="116" rx="14" fill="#0C1E45" stroke="#03D2FC" strokeWidth="1.5"/>
                  <rect x="17" y="135" width="446" height="1.5" rx="1" fill="rgba(255,255,255,.2)"/>
                  <text x="240" y="158" textAnchor="middle" fill="#67e8f9" fontSize="11" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif" letterSpacing=".12em">DROS - ENGAGEMENT OS</text>
                  <rect x="32" y="168" width="128" height="66" rx="9" fill="rgba(3,210,252,.15)" stroke="rgba(3,210,252,.35)" strokeWidth="1"/>
                  <text x="96" y="205" textAnchor="middle" fill="#e0f2fe" fontSize="13" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">Brand &amp; Compliance</text>
                  <rect x="176" y="168" width="128" height="66" rx="9" fill="rgba(3,210,252,.15)" stroke="rgba(3,210,252,.35)" strokeWidth="1"/>
                  <text x="240" y="205" textAnchor="middle" fill="#e0f2fe" fontSize="13" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">AI + Human Routing</text>
                  <rect x="320" y="168" width="128" height="66" rx="9" fill="rgba(3,210,252,.15)" stroke="rgba(3,210,252,.35)" strokeWidth="1"/>
                  <text x="384" y="205" textAnchor="middle" fill="#e0f2fe" fontSize="13" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">Account Timeline</text>
                  <line x1="75" y1="250" x2="75" y2="296" stroke="rgba(3,210,252,.35)" strokeWidth="1.5" strokeDasharray="5,4"/>
                  <line x1="170" y1="250" x2="170" y2="296" stroke="rgba(3,210,252,.35)" strokeWidth="1.5" strokeDasharray="5,4"/>
                  <line x1="258" y1="250" x2="258" y2="296" stroke="rgba(3,210,252,.35)" strokeWidth="1.5" strokeDasharray="5,4"/>
                  <line x1="348" y1="250" x2="348" y2="296" stroke="rgba(3,210,252,.35)" strokeWidth="1.5" strokeDasharray="5,4"/>
                  <line x1="424" y1="250" x2="424" y2="296" stroke="rgba(3,210,252,.35)" strokeWidth="1.5" strokeDasharray="5,4"/>
                  <rect x="16" y="296" width="448" height="96" rx="14" fill="#fff" stroke="#e2e8f0" strokeWidth="1"/>
                  <text x="240" y="318" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif" letterSpacing=".1em">YOUR EXISTING TOOLS</text>
                  <rect x="28" y="326" width="84" height="50" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
                  <text x="70" y="347" textAnchor="middle" fill="#334155" fontSize="11.5" fontWeight="600" fontFamily="Saans,-apple-system,sans-serif">Core System</text>
                  <text x="70" y="363" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Saans,-apple-system,sans-serif">Billing / Loans</text>
                  <rect x="122" y="326" width="84" height="50" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
                  <text x="164" y="347" textAnchor="middle" fill="#334155" fontSize="11.5" fontWeight="600" fontFamily="Saans,-apple-system,sans-serif">CRM</text>
                  <text x="164" y="363" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Saans,-apple-system,sans-serif">Customer data</text>
                  <rect x="216" y="326" width="84" height="50" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
                  <text x="258" y="347" textAnchor="middle" fill="#334155" fontSize="11.5" fontWeight="600" fontFamily="Saans,-apple-system,sans-serif">Dialer</text>
                  <text x="258" y="363" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Saans,-apple-system,sans-serif">Outbound calls</text>
                  <rect x="310" y="326" width="84" height="50" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
                  <text x="352" y="347" textAnchor="middle" fill="#334155" fontSize="11.5" fontWeight="600" fontFamily="Saans,-apple-system,sans-serif">Ticketing</text>
                  <text x="352" y="363" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Saans,-apple-system,sans-serif">Disputes</text>
                  <rect x="404" y="326" width="44" height="50" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
                  <text x="426" y="347" textAnchor="middle" fill="#334155" fontSize="11.5" fontWeight="600" fontFamily="Saans,-apple-system,sans-serif">SMS</text>
                  <text x="426" y="363" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Saans,-apple-system,sans-serif">Email</text>
                  <text x="240" y="418" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="500" fontFamily="Saans,-apple-system,sans-serif">Swap any tool below without rebuilding your strategy above</text>
                </svg>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ── ACCOUNT TIMELINE ── */}
        <Section tone="base" spacing="lg" id="account-timeline">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal className="order-2 overflow-hidden rounded-card border border-hair bg-surface-2/60 lg:order-1">
                <div className="h-0.5 bg-gradient-to-r from-accent to-accent/20" />
                <div className="flex items-start justify-between gap-3 border-b border-hair bg-white/[0.02] px-6 py-4">
                  <div>
                    <div className="text-[15px] font-semibold text-ink">Account #29410 - Patel, S.</div>
                    <div className="mt-0.5 text-[11.5px] text-ink/45">Retail bank · 22 days past due · Early outreach</div>
                  </div>
                </div>
                <div className="divide-y divide-hair px-6">
                  {[
                    {
                      dot: 'bg-emerald-400',
                      type: 'SMS · AI',
                      typeColor: 'text-emerald-300',
                      meta: 'Day 1 · 08:52am',
                      text: 'Payment reminder sent via approved brand template. Portal link included. No response in 48h - AI voice follow-up scheduled.',
                    },
                    {
                      dot: 'bg-accent',
                      type: 'AI Voice',
                      typeColor: 'text-accent',
                      meta: 'Day 3 · 10:11am · 1m 48s',
                      text: 'RPC confirmed. 7-day extension requested - within policy threshold. DROS applied extension and logged promise-to-pay.',
                    },
                    {
                      dot: 'bg-orange-400',
                      type: 'AI Voice',
                      typeColor: 'text-orange-300',
                      meta: 'Day 10 · 02:34pm · 3m 07s',
                      text: 'PTP missed. Customer mentioned redundancy - hardship keyword detected. AI ceased collection script and transferred to human queue.',
                    },
                    {
                      dot: 'bg-violet-400',
                      type: 'Human',
                      typeColor: 'text-violet-300',
                      meta: 'Day 10 · 02:41pm · Agent: T. Okoro',
                      text: 'Picked up with full context. Agreed 6-week reduced-payment arrangement under hardship policy.',
                      last: true,
                    },
                  ].map((entry, ei) => (
                    <div key={ei} className="flex gap-3.5 py-4">
                      <div className="flex w-3 shrink-0 flex-col items-center pt-1">
                        <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${entry.dot}`} />
                        {!entry.last && <div className="mt-1 w-px flex-1 bg-hair" />}
                      </div>
                      <div className="flex-1 pb-1">
                        <div className="mb-1 flex flex-wrap gap-2 text-[10.5px] text-ink/40">
                          <span className={`text-[10px] font-semibold uppercase tracking-[.07em] ${entry.typeColor}`}>{entry.type}</span>
                          <span>{entry.meta}</span>
                        </div>
                        <p className="text-[14px] leading-[1.65] text-ink/70">{entry.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.1} className="order-1 lg:order-2">
                <Eyebrow className="text-ink/45">Account context</Eyebrow>
                <Heading as="h2" size="display" className="mt-4">
                  One timeline. Every AI agent and human agent walks in ready
                </Heading>
                <p className="mt-4 text-[15px] leading-relaxed text-ink/55">
                  Every AI voice call, human call, SMS, dispute, and payment lands in one account view. No rebriefing. No repeated questions. Context travels with the account.
                </p>
                <ul className="mt-6 divide-y divide-hair">
                  {[
                    'AI escalates to human with full context attached - no rebriefing',
                    'Promises-to-pay tracked automatically; missed PTPs trigger next step',
                    'Hardship keywords detected mid-call and acted on immediately',
                    'Every entry stamped with agent type, channel, script version, and outcome',
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 py-2.5 text-[15px] leading-relaxed text-ink/70">
                      <span className="text-accent">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ── PERSONAS ── */}
        <Section tone="light" spacing="lg" id="personas">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">Built for every role</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                Built for every role on your in-house collections team
              </Heading>
              <p className="mt-3 text-[15px] text-ink-grey">Select a role to see what changes for you.</p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 flex flex-col gap-3 sm:grid sm:grid-cols-3">
              {PERSONAS.map((p, i) => (
                <button
                  key={p.role}
                  onClick={() => setActivePersona(i)}
                  className={`rounded-xl border px-5 py-4 text-left text-[14px] font-medium leading-snug transition-colors ${
                    activePersona === i ? 'border-accent/40 bg-base text-white' : 'border-line-dark bg-white text-ink-dark hover:border-accent/30'
                  }`}
                >
                  {p.role}
                </button>
              ))}
            </Reveal>

            <div key={activePersona} className="mt-4 rounded-card border border-line-dark bg-white p-8 shadow-sm md:p-10">
              <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[.11em] text-accent">{PERSONAS[activePersona].role}</div>
              <div className="mb-6 text-[24px] font-semibold leading-tight text-ink-dark">{PERSONAS[activePersona].h}</div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {PERSONAS[activePersona].items.map((item) => (
                  <div key={item} className="rounded-xl border border-line-dark bg-[#F9FBFF] px-4 py-3.5 pl-8 text-[15px] leading-relaxed text-ink-dark/80" style={{ position: 'relative' }}>
                    <span className="absolute left-3 top-3.5 text-xs font-bold text-accent">→</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* ── LIFECYCLE ── */}
        <Section tone="base" spacing="lg" id="lifecycle">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">Lifecycle coverage</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                AI agents and human agents - every stage of the collections lifecycle
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                From early delinquency through pre-charge-off, DROS manages every stage of the first-party collections lifecycle - with different AI/human splits, scripts, and escalation rules per stage.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 flex flex-col gap-3 sm:grid sm:grid-cols-3">
              {LIFECYCLE.map((stage, i) => (
                <button
                  key={stage.stage}
                  onClick={() => setActiveLifecycle(i)}
                  className={`rounded-xl border px-5 py-4 text-left transition-colors ${
                    activeLifecycle === i ? 'border-accent/40 bg-surface-2 text-white' : 'border-hair bg-surface/60 text-ink/70 hover:border-line'
                  }`}
                >
                  <div className="text-[16px] font-semibold">{stage.stage}</div>
                  <div className="text-[12px] text-ink/45">{stage.days}</div>
                </button>
              ))}
            </Reveal>

            <div key={activeLifecycle} className="mt-4 overflow-hidden rounded-card border border-hair bg-surface-2/60">
              <div className="grid md:grid-cols-2">
                <div className="border-b border-hair px-6 py-8 md:border-b-0 md:border-r md:px-10 md:py-10">
                  <div className="mb-5 text-[13px] font-semibold uppercase tracking-[.08em] text-accent">AI Handles</div>
                  {lc.ai.map((item, i) => (
                    <div key={item} className={`py-3 text-[15px] leading-relaxed text-ink/70 ${i < lc.ai.length - 1 ? 'border-b border-hair' : ''}`}>{item}</div>
                  ))}
                </div>
                <div className="px-6 py-8 md:px-10 md:py-10">
                  <div className="mb-5 text-[13px] font-semibold uppercase tracking-[.08em] text-orange-300">Humans Handle</div>
                  {lc.hu.map((item, i) => (
                    <div key={item} className={`py-3 text-[15px] leading-relaxed text-ink/70 ${i < lc.hu.length - 1 ? 'border-b border-hair' : ''}`}>{item}</div>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-4 border-t border-hair bg-white/[0.02] px-6 py-5 md:px-10">
                <span className="shrink-0 text-[10.5px] font-semibold uppercase tracking-[.1em] text-ink/40">DROS</span>
                <div className="text-[14px] leading-relaxed text-ink/50">{lc.os}</div>
              </div>
            </div>
          </Container>
        </Section>

        {/* ── COMPLIANCE ── */}
        <Section tone="base" spacing="lg" id="compliance">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">Compliance &amp; brand safety</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                Reg F, brand rules, and consent - enforced before any contact is made
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                Whether it's Reg F call caps, brand tone, or consent management - DROS applies every rule before an AI voice agent or human is authorized to make contact.
              </p>
            </Reveal>

            <Reveal stagger={0.08} className="mt-12 grid gap-2.5 sm:grid-cols-2">
              {[
                {
                  highlight: true,
                  title: 'Call frequency caps and quiet hours - built in',
                  body: 'Reg F 7-in-7-style limits, quiet hour windows, and channel preferences enforced before any attempt. Accounts pause or restrict automatically.',
                },
                {
                  highlight: false,
                  title: 'AI sounds like your brand. Every time.',
                  body: 'State-, product-, and brand-specific scripts at the OS layer. AI agents use your approved intros, disclaimers, and language guidelines. Human agents see the same library.',
                },
                {
                  highlight: false,
                  title: 'Centralized opt-out and consent management',
                  body: 'DROS checks and logs consent before triggering any outreach - SMS, email, or voice. Revocations honored in real time across every channel.',
                },
                {
                  highlight: false,
                  title: 'Every interaction logged - who, what, when, which script',
                  body: 'AI calls, human calls, SMS, and emails all logged with full context. QA reviews, regulator responses, and audits served from one pane.',
                },
              ].map((card) => (
                <RevealItem key={card.title}>
                  <div className={`h-full rounded-card p-7 ${card.highlight ? 'border border-accent/25 bg-accent/[0.07]' : 'border border-hair bg-surface-2/60'}`}>
                    <div className="mb-2.5 text-[17px] font-semibold text-ink">{card.title}</div>
                    <p className="text-[15px] leading-relaxed text-ink/55">{card.body}</p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── INTEGRATIONS ── */}
        <Section tone="light" spacing="lg" id="integrations">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">Integrations</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                Your existing stack stays. DROS sits above it.
              </Heading>
            </Reveal>

            <Reveal delay={0.1} className="mt-12 overflow-x-auto rounded-[20px] border border-line-dark bg-white p-4 shadow-sm sm:p-8 md:p-10">
              <svg viewBox="0 0 900 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '860px', display: 'block', margin: '0 auto' }} aria-label="DROS integration hub and spoke diagram">
                <line x1="276" y1="200" x2="384" y2="200" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,4"/>
                <line x1="276" y1="100" x2="384" y2="182" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,4"/>
                <line x1="276" y1="300" x2="384" y2="218" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,4"/>
                <line x1="624" y1="200" x2="516" y2="200" stroke="#03D2FC" strokeWidth="1.5" strokeDasharray="5,4" opacity=".7"/>
                <line x1="624" y1="100" x2="516" y2="182" stroke="#03D2FC" strokeWidth="1.5" strokeDasharray="5,4" opacity=".7"/>
                <line x1="624" y1="300" x2="516" y2="218" stroke="#03D2FC" strokeWidth="1.5" strokeDasharray="5,4" opacity=".7"/>
                <rect x="384" y="156" width="132" height="88" rx="16" fill="#0C1E45" stroke="#03D2FC" strokeWidth="2"/>
                <rect x="385" y="157" width="130" height="1" rx="1" fill="rgba(255,255,255,.2)"/>
                <text x="450" y="194" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" fontFamily="Saans,-apple-system,sans-serif" letterSpacing="-0.04em">DROS</text>
                <text x="450" y="211" textAnchor="middle" fill="#67e8f9" fontSize="9" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif" letterSpacing=".1em">ENGAGEMENT OS</text>
                <text x="450" y="229" textAnchor="middle" fill="rgba(103,232,249,.55)" fontSize="8.5" fontFamily="Saans,-apple-system,sans-serif">Strategy · Brand · Compliance</text>
                <rect x="56" y="66" width="210" height="68" rx="12" fill="#fff" stroke="#e2e8f0" strokeWidth="1"/>
                <circle cx="93" cy="100" r="19" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1"/>
                <text x="93" y="105" textAnchor="middle" fontSize="15" fill="#0369a1">🏦</text>
                <text x="120" y="93" fill="#0f172a" fontSize="13" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">Core / Loan System</text>
                <text x="120" y="110" fill="#64748b" fontSize="11" fontFamily="Saans,-apple-system,sans-serif">Balance, status &amp; account data</text>
                <rect x="56" y="166" width="210" height="68" rx="12" fill="#fff" stroke="#e2e8f0" strokeWidth="1"/>
                <circle cx="93" cy="200" r="19" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1"/>
                <text x="93" y="205" textAnchor="middle" fontSize="15" fill="#0369a1">📊</text>
                <text x="120" y="193" fill="#0f172a" fontSize="13" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">CRM</text>
                <text x="120" y="210" fill="#64748b" fontSize="11" fontFamily="Saans,-apple-system,sans-serif">Customer profile &amp; history</text>
                <rect x="56" y="266" width="210" height="68" rx="12" fill="#fff" stroke="#e2e8f0" strokeWidth="1"/>
                <circle cx="93" cy="300" r="19" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1"/>
                <text x="93" y="305" textAnchor="middle" fontSize="15" fill="#0369a1">📞</text>
                <text x="120" y="293" fill="#0f172a" fontSize="13" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">Dialer / Contact Centre</text>
                <text x="120" y="310" fill="#64748b" fontSize="11" fontFamily="Saans,-apple-system,sans-serif">Outbound &amp; inbound calls</text>
                <rect x="634" y="66" width="210" height="68" rx="12" fill="#f0fdfa" stroke="#a7f3d0" strokeWidth="1"/>
                <circle cx="671" cy="100" r="19" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1"/>
                <text x="671" y="105" textAnchor="middle" fontSize="15">💬</text>
                <text x="698" y="93" fill="#0f172a" fontSize="13" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">SMS / Email</text>
                <text x="698" y="110" fill="#64748b" fontSize="11" fontFamily="Saans,-apple-system,sans-serif">Omnichannel outreach</text>
                <rect x="634" y="166" width="210" height="68" rx="12" fill="#ecfeff" stroke="#a5f3fc" strokeWidth="1"/>
                <circle cx="671" cy="200" r="19" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="1"/>
                <text x="671" y="205" textAnchor="middle" fontSize="15">🤖</text>
                <text x="698" y="193" fill="#0f172a" fontSize="13" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">AI Voice Agents</text>
                <text x="698" y="210" fill="#64748b" fontSize="11" fontFamily="Saans,-apple-system,sans-serif">Brand-tuned automation</text>
                <rect x="634" y="266" width="210" height="68" rx="12" fill="#f0fdfa" stroke="#a7f3d0" strokeWidth="1"/>
                <circle cx="671" cy="300" r="19" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1"/>
                <text x="671" y="305" textAnchor="middle" fontSize="15">🎫</text>
                <text x="698" y="293" fill="#0f172a" fontSize="13" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">Ticketing / Disputes</text>
                <text x="698" y="310" fill="#64748b" fontSize="11" fontFamily="Saans,-apple-system,sans-serif">Case &amp; complaint management</text>
                <text x="161" y="378" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily="Saans,-apple-system,sans-serif" fontWeight="600" letterSpacing=".07em">YOUR EXISTING TOOLS</text>
                <text x="739" y="378" textAnchor="middle" fill="#0891a8" fontSize="10.5" fontFamily="Saans,-apple-system,sans-serif" fontWeight="600" letterSpacing=".07em">EXECUTION CHANNELS</text>
              </svg>
            </Reveal>

            <Reveal delay={0.15} className="mt-8 flex flex-col items-start gap-5 rounded-card border border-accent/15 bg-accent/[0.04] p-7 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="mb-1 text-[16px] font-semibold text-ink-dark">Adding a channel? Swapping a dialer? It's a config change.</div>
                <div className="text-[15px] leading-relaxed text-ink-grey">Engagement logic lives in DROS - so it travels with you when your tooling evolves. Your investment in rules and strategy doesn't depreciate.</div>
              </div>
              <Button variant="onLight" size="lg" href="https://dros.ai/book-meeting" onClick={() => trackCta('fp_stack_talk')} className="shrink-0">
                Talk to us about your stack →
              </Button>
            </Reveal>
          </Container>
        </Section>

        {/* ── OUTCOMES ── */}
        <Section tone="base" spacing="lg" id="outcomes">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">Outcomes</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                What in-house collections teams see after running DROS
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                Recovery, coverage, brand, and handoff quality - all moving in the right direction across the first-party collections lifecycle.
              </p>
            </Reveal>

            <Reveal stagger={0.08} className="mt-12 grid gap-2.5 sm:grid-cols-2">
              {[
                {
                  stat: '↑', sup: '%',
                  title: 'Higher recoveries on fresher debt',
                  desc: 'AI-supported first-party outreach catches issues before charge-off - when the relationship and the money are still salvageable.',
                },
                {
                  stat: '3-5', sup: '×',
                  title: 'More coverage without hiring',
                  desc: 'AI handles tier-1 volume so human agents focus on high-leverage conversations: hardship, high balances, complex cases.',
                },
                {
                  stat: '↓', sup: '%',
                  title: 'Fewer complaints. Stronger brand.',
                  desc: 'Consistent scripts, gentler channels, and full account context on every call reduce friction and reputational risk.',
                },
                {
                  stat: '✓', sup: '',
                  title: 'Cleaner handoff when you outsource',
                  desc: 'At placement or sale, accounts carry a rich timeline and updated contact data. Downstream agencies and buyers perform better.',
                },
              ].map((oc) => (
                <RevealItem key={oc.title}>
                  <div className="h-full rounded-card border border-hair bg-surface-2/60 p-7">
                    <div className="mb-2 font-display text-4xl leading-none text-ink">
                      {oc.stat}{oc.sup && <sup className="align-super text-lg font-semibold text-accent">{oc.sup}</sup>}
                    </div>
                    <div className="mb-2 text-[17px] font-semibold text-ink">{oc.title}</div>
                    <p className="text-[15px] leading-relaxed text-ink/55">{oc.desc}</p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── ROLLOUT ── */}
        <Section tone="light" spacing="lg" id="rollout">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">How rollout works</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                From your current workflows to a live first-party platform - three steps
              </Heading>
            </Reveal>

            <Reveal stagger={0.08} className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  n: '01',
                  title: 'Map your current first-party flows',
                  desc: 'Bring your portfolios, systems, policies, and scripts. Together we map your early, mid, and pre-placement workflows - and identify coverage gaps and brand risk.',
                },
                {
                  n: '02',
                  title: 'Design AI + human roles and guardrails',
                  desc: 'Decide which interactions go to AI, what the escalation rules are, and how tone and compliance are enforced. DROS models your exact rule set - not a generic template.',
                },
                {
                  n: '03',
                  title: 'Pilot, measure, expand',
                  desc: 'Start with a defined portfolio or segment. Monitor recovery, CX, and QA outcomes. Then expand to more segments and channels at your pace.',
                },
              ].map((step) => (
                <RevealItem key={step.n}>
                  <div className="h-full rounded-card border border-line-dark bg-white p-8">
                    <div className="mb-3.5 font-display text-5xl leading-none text-line-dark">{step.n}</div>
                    <div className="mb-2.5 text-[18px] font-semibold text-ink-dark">{step.title}</div>
                    <p className="text-[15px] leading-relaxed text-ink-grey">{step.desc}</p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>

            <Reveal delay={0.15} className="mt-8 flex flex-col items-start gap-5 rounded-card border border-accent/15 bg-accent/[0.04] p-7 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="mb-1 text-[16px] font-semibold text-ink-dark">Map DROS to your first-party flows</div>
                <div className="text-[15px] leading-relaxed text-ink-grey">Bring your portfolios, systems, and current policies. We'll show you how DROS sits above your existing stack - brand rules and compliance modeled in from day one.</div>
              </div>
              <Button variant="onLight" size="lg" href="https://dros.ai/book-meeting" onClick={() => trackCta('fp_rollout_walkthrough')} className="shrink-0">
                Book a first-party walkthrough →
              </Button>
            </Reveal>
          </Container>
        </Section>

        {/* ── FAQ ── */}
        <Section tone="base" spacing="lg" id="faq">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
              <Reveal>
                <Eyebrow className="text-ink/45">Common questions</Eyebrow>
                <Heading as="h2" size="display" className="mt-4">
                  First-party collections and DROS
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
                {FAQ.map((item, i) => (
                  <RevealItem key={i}>
                    <div
                      className={`cursor-pointer rounded-xl border bg-white/[0.04] px-5 py-4 transition-colors duration-200 ${
                        openFaq === i ? 'border-accent/35' : 'border-hair'
                      }`}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-sm font-medium leading-snug text-ink">{item.q}</span>
                        <ChevronDown
                          className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 ${
                            openFaq === i ? 'rotate-180 text-accent' : 'text-ink/30'
                          }`}
                        />
                      </div>
                      {openFaq === i && <p className="mt-3 text-sm font-light leading-relaxed text-ink/55">{item.a}</p>}
                    </div>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </Container>
        </Section>

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
                <div className="max-w-md text-[15px] leading-relaxed text-ink/50">Built for first-party teams of all sizes - from a single portfolio to enterprise-scale operations.</div>
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
        <Section tone="light" spacing="lg" id="cta">
          <Container>
            <Reveal className="relative overflow-hidden rounded-card border border-accent/20 bg-base px-8 py-16 text-center sm:px-12 md:py-20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-1/2 h-[280px] w-[500px] -translate-x-1/2 rounded-full"
                style={{ background: 'radial-gradient(ellipse, rgba(3,210,252,0.12) 0%, transparent 70%)' }}
              />
              <div className="relative">
                <Eyebrow className="justify-center text-ink-grey">Ready to see it</Eyebrow>
                <Heading as="h2" size="display-lg" className="mx-auto mt-4 max-w-lg">
                  See DROS on your first-party collections flows
                </Heading>
                <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink/55">
                  Bring your portfolios and existing tools. We'll show you exactly how it fits.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button variant="primary" size="lg" href="https://dros.ai/book-meeting" onClick={() => trackCta('fp_final_cta_walkthrough')}>
                    Book a first-party walkthrough <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="lg" href="https://dros.ai/book-meeting" onClick={() => trackCta('fp_final_cta_ai_agents')}>
                    Talk to us about AI agents
                  </Button>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {['No commitment required', 'Stack review included', 'Brand + compliance rules modeled live', 'Works with your existing tools'].map((perk) => (
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
