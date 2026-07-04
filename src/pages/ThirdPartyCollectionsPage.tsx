export const route = '/collections/third-party';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Section, Container, Eyebrow, Heading, Button } from '../components/ui';
import Reveal, { RevealItem } from '../components/Reveal';
import PageFade from '../components/PageFade';
import { trackCta } from '../lib/analytics';

/*
 * Third-party collections page. Content sourced verbatim from the
 * reference third-party.pdf (original dros.ai/collections/third-party
 * page). Visual layer follows the Customer.io-inspired system already
 * built for the homepage and Pricing page - shared primitives, Reveal
 * scroll animation, and the single-accent token palette - instead of
 * the old bespoke dark clone. Embedded product-mockup graphics (call
 * cards, timeline widget, hub-and-spoke diagram) keep their detailed
 * illustrative styling since they're informational graphics rather
 * than page chrome.
 */

function HeroBg() {
  return (
    <div aria-hidden="true" className="absolute inset-0 z-0">
      <img loading="lazy" decoding="async" src="/industries/third-party.jpg" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 [background:linear-gradient(180deg,rgba(4,7,15,0.35)_0%,rgba(4,7,15,0.82)_100%)]" />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}

// ─── Persona data ─────────────────────────────────────────────────────────────
const PERSONAS = [
  {
    tab: 'Operations / CC Director',
    role: 'Operations / Contact Center Director',
    h: 'One OS. Every queue. Every channel.',
    items: [
      'Coordinate AI and human campaigns from a single OS - no more juggling multiple dialer dashboards and list exports',
      'Build queues around portfolio, risk tier, client, and agent skill - not alphabetical lists and manual routing',
      'See AI vs human performance, contact rates, and agent utilization in one live view',
      'Swap or add dialers without rebuilding strategy logic - it lives in DROS, not inside each platform',
    ],
  },
  {
    tab: 'Compliance / QA Lead',
    role: 'Compliance / QA Lead',
    h: "Rules in the platform. Not in people's heads.",
    items: [
      'Encode Reg F, FDCPA, TCPA, and client-specific restrictions once - applied before any AI or human touches an account',
      'DNC and consent revocations honored in real time across every channel - no lag, no manual syncing',
      'Review recordings, transcripts, and dispute workflows from one pane when auditors or regulators arrive',
      'Accounts pause or restrict automatically when cease-communication requests or legal threats surface',
    ],
  },
  {
    tab: 'Client Services / VP',
    role: 'Client Services / Agency Owner / VP',
    h: 'Win RFPs. Keep demanding clients.',
    items: [
      "Answer 'what's your AI story?' with specifics - not promises - when competing for new placements",
      'Show clients a platform that flexes to their strategy, channel, and frequency requirements',
      'Produce per-client MI packs: contact journeys, outcomes, and compliance signals',
      'Onboard new clients without rebuilding infrastructure - portfolio-level rules contain each relationship',
    ],
  },
];

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'What is an engagement OS and how is it different from a collections dialer?',
    a: 'A collections dialer optimizes for more calls per hour. DROS is a third-party collections software platform that orchestrates your dialers, AI agents, and human agents from one place - deciding which accounts are dialable, when, how often, and through which channel, with FDCPA and Reg F compliance enforced before any attempt is authorized.',
  },
  {
    q: 'Does DROS replace our existing debt collection dialers and CRM?',
    a: "No. DROS connects to your existing dialers, SMS providers, CRMs, and payment portals as execution channels. Your current tools stay in place; DROS adds the compliance and strategy layer above them. Switching dialers later is easy because your workflows live in DROS, not inside any single platform.",
  },
  {
    q: 'How does DROS handle Reg F 7-in-7 and FDCPA compliance for third-party agencies?',
    a: 'DROS enforces Reg F 7-in-7 call limits, local call-hour windows, FDCPA validation and dispute workflows, and cease-communication rules at the platform layer - before any AI or human agent is authorized to make an attempt. Accounts pause or restrict automatically when triggered. Every interaction logs a full audit trail for client or regulator review.',
  },
  {
    q: 'Can AI agents handle third-party debt collection calls compliantly?',
    a: 'Yes. DROS AI voice agents follow the same FDCPA and TCPA rules as human agents - identical consent checks, call-hour windows, and DNC logic. When a situation requires human judgment, the AI transfers the call to the right agent queue with full account context. Every AI call produces a transcript and summary.',
  },
  {
    q: 'How does DROS support agencies managing multiple client portfolios?',
    a: 'Each client portfolio in DROS has its own strategy rules - contact frequency, allowed channels, wording limits. AI and human agents share infrastructure but every account is governed by its client-specific rules. Agencies can produce per-client MI packs showing contact journeys, outcomes, and compliance signals.',
  },
  {
    q: 'Can DROS help a debt collection agency win RFPs?',
    a: "DROS gives agencies specific, demonstrable answers to what modern creditors ask during RFPs: how do you handle AI compliance? What is your omnichannel strategy? How do you enforce client-specific contact rules? Instead of promising higher dial volume, you can show a modern debt collection agency software stack with compliance and strategy built into the platform.",
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

export default function ThirdPartyCollectionsPage() {
  const [activePersona, setActivePersona] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <PageFade className="min-h-screen bg-base text-ink">
      <Helmet>
        <title>AI-Powered Third-Party Collections Software for Agencies | DROS</title>
        <meta name="description" content="DROS coordinates AI voice agents, human agents, and your existing dialers across every client portfolio - with FDCPA, Reg F, and TCPA compliance enforced before the first dial." />
        <meta name="keywords" content="third-party collections software, debt collection agency software, collections agency platform, AI voice agents debt collection, FDCPA compliant collections software, Reg F 7-in-7 compliance, TCPA consent management, multi-portfolio collections management, collections dialer compliance, third party debt collection technology, collections engagement platform" />
        <link rel="canonical" href="https://dros.ai/collections/third-party" />
        <meta property="og:title" content="AI-Powered Third-Party Collections Software for Agencies | DROS" />
        <meta property="og:description" content="DROS coordinates AI voice agents, human agents, and your existing dialers across every client portfolio. FDCPA, Reg F, and TCPA compliance enforced before the first dial." />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/collections/third-party" />
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
          <HeroBg />

          <Container wide className="relative z-40">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs text-white/85 backdrop-blur-md">
                  Agencies &amp; third-party collections teams
                </span>
              </Reveal>

              <Reveal large>
                <h1 className="font-saans text-[36px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[48px] xl:text-[56px]">
                  <span className="block text-white">AI-powered engagement for</span>
                  <span className="block text-white/55">third-party debt collection</span>
                </h1>
              </Reveal>

              <Reveal>
                <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
                  Orchestrate AI agents, human agents, and your existing systems across every client portfolio.
                </p>
              </Reveal>

              <Reveal delay={0.1} className="flex flex-wrap justify-center gap-3">
                <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('Book an agency walkthrough')}>
                  Book an agency walkthrough <ArrowRight className="h-4 w-4" />
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
                'FDCPA & Reg F enforced before the first dial',
                'Separate workspaces per client portfolio',
                'AI voice agents + human agents in one platform',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-ink/60">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </div>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── PAIN STATS ── */}
        <Section tone="light" spacing="lg" id="agency-reality">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">The agency reality</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                More volume. Thinner margins. Higher compliance pressure.
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-grey">
                The tools most agencies run on weren't built for this environment. DROS was.
              </p>
            </Reveal>

            <Reveal stagger={0.08} className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { n: '42', suffix: '%', t: 'Rise in compliance complaints', d: 'Reg F, TCPA, and FDCPA violations are now the fastest-growing source of agency risk - often from mis-tuned dialers, not bad intent.' },
                { n: '3-5', suffix: '×', t: 'Tools agencies manually coordinate', d: "Most shops stitch together dialers, a CRM, spreadsheets, and SMS - each with its own rules, its own compliance logic, its own lists." },
                { n: '68', suffix: '%', t: 'RFPs now ask about AI strategy', d: 'Modern creditors expect a tech-forward answer on AI, compliance, and omnichannel. Promising higher dial volume no longer wins placements.' },
              ].map((s) => (
                <RevealItem key={s.t}>
                  <div className="h-full rounded-card border border-line-dark bg-white p-8">
                    <div className="mb-3 font-display text-5xl leading-none text-ink-dark">
                      {s.n}<span className="text-2xl font-semibold text-accent">{s.suffix}</span>
                    </div>
                    <div className="mb-2 text-[17px] font-semibold text-ink-dark">{s.t}</div>
                    <div className="text-[15px] leading-relaxed text-ink-grey">{s.d}</div>
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
              <Eyebrow className="justify-center text-ink/45">AI + human collaboration</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                AI agents handle the volume. Your people handle the hard conversations.
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                Most debt collection agencies are leaving after-hours coverage and early-stage volume on the table. AI voice agents cover that work - and hand off with full account context when a human agent needs to step in.
              </p>
            </Reveal>

            <Reveal delay={0.1} stagger={0.1} className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
              <RevealItem>
                <div className="h-full rounded-card border border-hair bg-surface-2/60 p-7 sm:p-9">
                  <span className="inline-block rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[.08em] text-accent">AI agents handle</span>
                  <h3 className="mt-4 text-xl font-semibold leading-tight text-ink">Scale the work that doesn't need a human</h3>
                  <ul className="mt-5 divide-y divide-hair">
                    {[
                      'High-volume early-stage reminders',
                      'Right-party verification calls',
                      'After-hours and weekend coverage',
                      'Basic info delivery and promise-to-pay',
                      'Overflow when human queues fill',
                      'Transcripts, summaries, and queue tags',
                    ].map((item) => (
                      <li key={item} className="py-2.5 text-[15px] leading-relaxed text-ink/70">{item}</li>
                    ))}
                  </ul>
                  <div className="mt-5 rounded-xl bg-accent/10 p-4 text-sm leading-relaxed text-accent">
                    Every AI call leaves a full transcript, summary, and tags - feeding directly into the human agent's queue context.
                  </div>
                </div>
              </RevealItem>
              <RevealItem>
                <div className="h-full rounded-card border border-hair bg-surface-2/60 p-7 sm:p-9">
                  <span className="inline-block rounded-full border border-orange-400/25 bg-orange-400/10 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[.08em] text-orange-300">Human agents handle</span>
                  <h3 className="mt-4 text-xl font-semibold leading-tight text-ink">Reserve judgment for what requires it</h3>
                  <ul className="mt-5 divide-y divide-hair">
                    {[
                      'Settlement and payment plan negotiation',
                      'Hardship discussions and disputes',
                      'Escalations and legal threats',
                      'Client-mandated human-only accounts',
                      'Complex and sensitive situations',
                      'Relationship-sensitive portfolios',
                    ].map((item) => (
                      <li key={item} className="py-2.5 text-[15px] leading-relaxed text-ink/70">{item}</li>
                    ))}
                  </ul>
                  <div className="mt-5 rounded-xl bg-orange-400/10 p-4 text-sm leading-relaxed text-orange-300">
                    DROS controls the handoff - when to transfer, which queue, and what context travels with the call. No blind transfers.
                  </div>
                </div>
              </RevealItem>
            </Reveal>

            {/* Handoff graphic */}
            <Reveal delay={0.2} className="mt-6 overflow-hidden rounded-card border border-hair">
              <div className="relative px-5 py-8 sm:px-8 sm:py-10" style={{ background: 'linear-gradient(135deg,#0a1628 0%,#0d2137 40%,#0a1f30 70%,#061320 100%)' }}>
                <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full opacity-80" style={{ background: 'radial-gradient(ellipse,rgba(3,210,252,.1) 0%,transparent 65%)' }} />
                <div className="relative z-10 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                  <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,.28)]">
                    <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,transparent,#03D2FC 50%,transparent)' }} />
                    <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50 px-5 py-3.5">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
                      <span className="text-xs font-bold uppercase tracking-[0.08em] text-teal-700">AI agent - live call</span>
                    </div>
                    <div className="p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-[13px] font-bold text-teal-700">MJ</div>
                        <div>
                          <div className="text-[15px] font-bold text-slate-900">Marcus Johnson</div>
                          <div className="mt-0.5 text-[12.5px] text-slate-500">Acc #48210 · Day 34</div>
                        </div>
                      </div>
                      <div className="mb-2.5 rounded-[4px_14px_14px_14px] border border-cyan-200/60 bg-[#f0f9ff] px-3.5 py-3">
                        <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-teal-600">AI</div>
                        <div className="text-[14px] text-slate-800">"Are you open to discussing a payment arrangement today?"</div>
                      </div>
                      <div className="mb-3 ml-2.5 rounded-[14px_4px_14px_14px] border border-slate-200/60 bg-slate-50 px-3.5 py-3">
                        <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-slate-500">Debtor</div>
                        <div className="text-[14px] text-slate-700">"Yes, I'd like to talk about a payment plan."</div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-[12.5px] text-slate-400">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                        In call · 1m 52s
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,.28)]">
                    <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,transparent,#10b981 50%,transparent)' }} />
                    <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50 px-5 py-3.5">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold uppercase tracking-[0.08em] text-emerald-700">Human agent - briefed</span>
                    </div>
                    <div className="p-5">
                      <div className="mb-3 rounded-xl border border-emerald-200/60 bg-[#f0fdf9] p-4">
                        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.09em] text-emerald-500">AI summary</div>
                        <div className="text-[14px] leading-[1.7] text-slate-700">Debtor confirmed willingness to discuss a payment plan. Ready to negotiate.</div>
                      </div>
                      <div className="rounded-xl border border-emerald-200/60 bg-[#f0fdf9] p-3 text-center text-[14px] font-bold text-emerald-800">
                        &#10003; Ready to take the call
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative z-20 mt-8 flex h-20 items-end justify-center">
                  <div className="absolute inset-x-0 bottom-4 h-px" style={{ background: 'linear-gradient(90deg,transparent 0%,rgba(245,158,11,.4) 20%,rgba(245,158,11,.4) 80%,transparent 100%)' }} />
                  <div className="relative rounded-[40px] border border-amber-300/50 bg-white px-7 py-3 text-center shadow-[0_4px_24px_rgba(245,158,11,.12)]">
                    <div className="mb-0.5 text-[14px] font-bold text-amber-700">&#x21C4;&thinsp;Warm transfer</div>
                    <div className="text-[12px] text-slate-400">Payment plan request detected · DROS routing</div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.25} className="mt-6 flex flex-col items-start gap-5 rounded-card border border-accent/15 bg-accent/[0.04] p-7 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="mb-1 text-[16px] font-semibold text-ink">See AI-to-human handoffs live</div>
                <div className="text-[15px] leading-relaxed text-ink/55">Watch compliance enforcement, AI calling, and warm transfer to human queue in action.</div>
              </div>
              <Button variant="secondary" size="lg" to="/book-meeting" onClick={() => trackCta('Book a live walkthrough')} className="shrink-0">
                Book a live walkthrough
              </Button>
            </Reveal>
          </Container>
        </Section>

        {/* ── ACCOUNT CONTEXT ── */}
        <Section tone="light" spacing="lg" id="account-context">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">Account context</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                Every agent knows exactly what happened on this account before
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-grey">
                In third-party collections, context is everything. AI calls, human calls, SMS, disputes, and payments all land in one timeline per account - so nothing gets repeated, missed, or worked at cross purposes across your portfolios.
              </p>
              <ul className="mx-auto mt-6 inline-block max-w-lg divide-y divide-line-dark border-t border-line-dark text-left">
                {[
                  'Unified contact history across AI and human agents, SMS, email, and payment portals',
                  'Multiple placement types handled with separate strategies, same shared history',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 py-4 text-[15px] leading-snug text-ink-grey">
                    <span className="mt-0.5 shrink-0 font-bold text-accent">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 overflow-hidden rounded-card border border-line-dark bg-surface-2 shadow-[0_20px_60px_rgba(12,30,69,.18)]">
              <div className="flex flex-wrap items-center gap-3 border-b border-hair bg-white/[0.02] px-6 py-4 sm:px-8">
                <div className="flex-1">
                  <div className="text-[17px] font-semibold text-ink">Account #48210 - Johnson, M.</div>
                  <div className="mt-0.5 text-[12.5px] text-ink/45">Client A · Primary placement · Stage: negotiation</div>
                </div>
                <span className="rounded border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.07em] text-accent">Reg F clear</span>
                <span className="rounded border border-orange-400/25 bg-orange-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.07em] text-orange-300">Promise pending</span>
              </div>
              <div className="px-6 sm:px-8">
                {[
                  { dot: 'bg-accent', color: 'text-accent', type: 'AI Voice', meta: 'Day 1 · 09:14am · 2m 34s', text: 'Right-party confirmed. Account details delivered. Debtor requested callback at 5pm - DROS queued human follow-up automatically.' },
                  { dot: 'bg-ink/30', color: 'text-ink/45', type: 'System', meta: 'Day 1 · 09:16am', text: '7-in-7 count: 1 of 7. Call-hour window closes at 9pm local. Next eligible: tomorrow 8am.' },
                  { dot: 'bg-orange-400', color: 'text-orange-300', type: 'Human Agent', meta: 'Day 1 · 5:04pm · 8m 12s', text: 'Settlement negotiated. 3-installment payment plan agreed. Promise to pay logged against account.' },
                  { dot: 'bg-emerald-400', color: 'text-emerald-300', type: 'Payment', meta: 'Day 8 · 2:31pm', text: 'Installment 1 received - $340. Next installment due in 30 days.' },
                ].map((e, i, arr) => (
                  <div key={i} className={`flex gap-5 py-5 ${i < arr.length - 1 ? 'border-b border-hair' : ''}`}>
                    <div className="flex w-4 shrink-0 flex-col items-center pt-1">
                      <div className={`h-3 w-3 shrink-0 rounded-full ${e.dot}`} />
                      {i < arr.length - 1 && <div className="mt-1 w-px flex-1 bg-hair" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                        <span className={`text-[10.5px] font-bold uppercase tracking-[0.07em] ${e.color}`}>{e.type}</span>
                        <span className="text-[11.5px] text-ink/40">{e.meta}</span>
                      </div>
                      <p className="text-[15px] leading-[1.7] text-ink/70">{e.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15} className="mt-6 flex flex-col items-start gap-5 rounded-card border border-line-dark bg-white p-7 shadow-sm sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="mb-1 text-[16px] font-semibold text-ink-dark">See DROS track your portfolios live</div>
                <div className="text-[15px] leading-relaxed text-ink-grey">We'll model your placement types and client rules in a live account view.</div>
              </div>
              <Button variant="onLight" size="lg" to="/book-meeting" onClick={() => trackCta('Book portfolio walkthrough')} className="shrink-0">
                Book portfolio walkthrough
              </Button>
            </Reveal>
          </Container>
        </Section>

        {/* ── HOW DROS FITS ── */}
        <Section tone="base" spacing="lg" id="how-it-fits">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">How DROS fits</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                Your strategy lives in DROS. Your tools stay exactly where they are.
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                DROS connects to your predictive dialers, preview dialers, SMS providers, CRMs, and payment portals as execution channels. If you switch a tool later, your strategy stays intact.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-12 grid grid-cols-1 overflow-hidden rounded-card border border-hair md:grid-cols-2">
              <div className="bg-surface-2/60 px-6 py-8 sm:px-10 sm:py-11">
                <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-widest text-ink/40">Without DROS</div>
                <h3 className="mb-6 text-[22px] font-semibold leading-tight text-ink">Fragmented. Manual. Risky.</h3>
                <div className="flex flex-col gap-1">
                  {[
                    'Compliance rules split across every tool',
                    'Account history scattered, no unified view',
                    'Dialer switch means rebuilding everything',
                    'Client rules enforced by human memory',
                    'No single source of truth for auditors',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3.5 rounded-[9px] bg-white/[0.03] px-4 py-3.5 text-[15px] leading-snug text-ink/70">
                      <span className="w-4 shrink-0 text-sm font-bold text-red-400">&#x2715;</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-accent/20 bg-accent/[0.07] px-6 py-8 sm:border-l sm:border-t-0 sm:px-10 sm:py-11">
                <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-widest text-accent">With DROS</div>
                <h3 className="mb-6 text-[22px] font-semibold leading-tight text-ink">Centralized. Compliant. Portable.</h3>
                <div className="flex flex-col gap-1">
                  {[
                    'Rules enforced at OS level before any attempt',
                    'Full account history in one unified timeline',
                    'Swap dialers without touching strategy logic',
                    'Client rules encoded, enforced, auditable',
                    'Complete audit trail - always ready for review',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3.5 rounded-[9px] bg-accent/[0.07] px-4 py-3.5 text-[15px] leading-snug text-ink/70">
                      <span className="w-4 shrink-0 text-sm font-bold text-accent">&#x2713;</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ── COMPLIANCE ── */}
        <Section tone="light" spacing="lg" id="compliance">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">Compliance infrastructure</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                Reg F, FDCPA, TCPA - enforced before the first dial
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-grey">
                Compliance violations don't start with bad intent - they start with a dialer setting someone forgot to update. DROS enforces rules at the OS layer, before any attempt is made, by anyone.
              </p>
            </Reveal>

            <Reveal stagger={0.08} className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { icon: '⏰', label: 'Reg F', title: 'Call-hour and 7-in-7 controls', body: 'Per-debt call counts, local-time windows, and cooldowns applied at OS level. No attempt is authorized until rules are satisfied - for AI or human agents.', highlight: false },
                { icon: '🛡', label: 'FDCPA', title: 'Documentation and dispute workflows', body: 'Validation notices, cease-comm requests, and complaint workflows built in. Accounts restrict automatically. Full audit trail on every interaction - ready for regulators or clients.', highlight: false },
                { icon: '📵', label: 'TCPA', title: 'Consent management in real time', body: 'DNC and consent states managed at the OS layer. Revocations honored in real time across SMS, voice, and email. No manual syncing, no lag.', highlight: false },
                { icon: '🤝', label: 'Per-client rules', title: 'Client strategies, modeled and auditable', body: "Each client's contact frequency, allowed channels, and wording limits encoded, enforced, and ready to present at the next RFP or audit.", highlight: true },
              ].map((c) => (
                <RevealItem key={c.title}>
                  <div className={`h-full rounded-card p-7 ${c.highlight ? 'border border-accent/30 bg-accent/[0.06]' : 'border border-line-dark bg-white shadow-sm'}`}>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-[22px]">{c.icon}</div>
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-accent">{c.label}</div>
                    <div className="mb-2.5 text-[17px] font-semibold text-ink-dark">{c.title}</div>
                    <div className="text-[15px] leading-[1.75] text-ink-grey">{c.body}</div>
                  </div>
                </RevealItem>
              ))}
            </Reveal>

            <Reveal delay={0.2} className="mt-6 flex flex-col items-start gap-5 rounded-card border border-line-dark bg-white p-7 shadow-sm sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="mb-1 text-[16px] font-semibold text-ink-dark">Compliance-first agency? Let's talk.</div>
                <div className="text-[15px] leading-relaxed text-ink-grey">We'll show exactly how DROS enforces your regulatory and client rules in the operating layer.</div>
              </div>
              <Button variant="onLight" size="lg" to="/book-meeting" onClick={() => trackCta('Book a compliance review')} className="shrink-0">
                Book a compliance review
              </Button>
            </Reveal>
          </Container>
        </Section>

        {/* ── PERSONA SELECTOR ── */}
        <Section tone="light" spacing="lg" id="personas">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">Built for every role</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                Built for ops, compliance, and client services
              </Heading>
              <p className="mt-3 text-[15px] text-ink-grey">Select your role to see exactly what changes - and what stops being your problem.</p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 flex flex-col gap-3 sm:grid sm:grid-cols-3">
              {PERSONAS.map((p, i) => (
                <button
                  key={p.tab}
                  onClick={() => setActivePersona(i)}
                  className={`rounded-xl border px-5 py-4 text-left text-[14px] font-medium leading-snug transition-colors ${
                    activePersona === i ? 'border-accent/40 bg-base text-white' : 'border-line-dark bg-white text-ink-dark hover:border-accent/30'
                  }`}
                >
                  {p.tab}
                </button>
              ))}
            </Reveal>

            <div key={activePersona} className="mt-4 rounded-card border border-line-dark bg-white p-8 shadow-sm md:p-10">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-accent">{PERSONAS[activePersona].role}</div>
              <h3 className="mb-6 text-[26px] font-semibold leading-tight text-ink-dark">{PERSONAS[activePersona].h}</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PERSONAS[activePersona].items.map((item) => (
                  <div key={item} className="relative rounded-xl border border-line-dark bg-[#F9FBFF] px-5 py-4 pl-9 text-[15px] leading-relaxed text-ink-dark/80">
                    <span className="absolute left-4 top-4 text-[13px] font-bold text-accent">→</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* ── ARCHITECTURE ── */}
        <Section tone="base" spacing="lg" id="architecture">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">Works with your stack</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                Plug DROS in on top. Keep the tools you already have.
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                DROS connects to your predictive dialers, preview dialers, SMS providers, CRMs, and payment portals as execution channels. If you switch a collections dialer later, your strategy stays intact - it lives in DROS, not inside any one tool.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-12 overflow-hidden rounded-card border border-hair bg-[rgba(4,12,28,.8)] p-4 sm:p-8">
              {/* Mobile card list */}
              <div className="space-y-3">
                <div className="rounded-[14px] border-2 border-accent/50 bg-gradient-to-br from-[#0a3a50] to-[#0d5a6e] px-5 py-4 text-center">
                  <div className="mb-0.5 text-2xl font-extrabold tracking-tight text-white">DROS</div>
                  <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-cyan-300">Engagement OS</div>
                  <div className="flex justify-center gap-2">
                    {['Rules', 'Context', 'Queues'].map((p) => (
                      <span key={p} className="rounded-md border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold text-slate-300">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Client portfolios</div>
                {[
                  { label: 'Client A', sub: 'Primary placement' },
                  { label: 'Client B', sub: 'Secondary placement' },
                  { label: 'Client C', sub: 'Early-out' },
                ].map((n) => (
                  <div key={n.label} className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0d1f2e] px-4 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-[#0a3a40]">
                      <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><rect x="0" y="4" width="18" height="12" rx="2" stroke="#67e8f9" strokeWidth="1.5"/><path d="M6 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" stroke="#67e8f9" strokeWidth="1.5"/><line x1="0" y1="10" x2="18" y2="10" stroke="#67e8f9" strokeWidth="1" strokeOpacity=".5"/></svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{n.label}</div>
                      <div className="text-xs text-slate-500">{n.sub}</div>
                    </div>
                  </div>
                ))}
                <div className="pt-1 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Channels &amp; agents</div>
                {[
                  { label: 'Dialers / SMS / Email', sub: 'Communication channels', bg: '#160d2e', border: 'rgba(167,139,250,.35)', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 1Q1 1 1 2L1 4Q1 9.5 7 15.5Q9 17.5 11 17.5L13 17.5Q14 17.5 14 16.5L14 14.5Q14 13.5 13 13.5L11 13.5Q10 13.5 10 12.5L10 11.5Q10 10.5 9 10.5L7 8.5Q6.5 8.5 6.5 7.5L6.5 5.5Q6.5 4.5 5.5 4.5L3.5 4.5Q2.5 4.5 2.5 3.5Z" stroke="#a78bfa" strokeWidth="1.3"/></svg> },
                  { label: 'AI agents', sub: 'Intelligent automation', bg: '#1e1408', border: 'rgba(251,146,60,.35)', icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="1" y="4" width="18" height="12" rx="3" stroke="#fb923c" strokeWidth="1.3"/><circle cx="7" cy="10" r="2" fill="#fb923c"/><circle cx="13" cy="10" r="2" fill="#fb923c"/><line x1="10" y1="1" x2="10" y2="4" stroke="#fb923c" strokeWidth="1.3"/><circle cx="10" cy="0.5" r="1.2" fill="#fb923c"/><line x1="1" y1="16" x2="0" y2="20" stroke="#fb923c" strokeWidth="1.3"/><line x1="19" y1="16" x2="20" y2="20" stroke="#fb923c" strokeWidth="1.3"/></svg> },
                  { label: 'Human agents', sub: 'Live engagement', bg: '#0a1428', border: 'rgba(96,165,250,.35)', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="5" r="4" stroke="#60a5fa" strokeWidth="1.3"/><path d="M1 17Q1 11 9 11Q17 11 17 17" stroke="#60a5fa" strokeWidth="1.3"/></svg> },
                ].map((n) => (
                  <div key={n.label} className="flex items-center gap-3 rounded-xl border px-4 py-3" style={{ background: n.bg, borderColor: n.border }}>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: n.bg, border: `1.5px solid ${n.border}` }}>
                      {n.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{n.label}</div>
                      <div className="text-xs text-slate-500">{n.sub}</div>
                    </div>
                  </div>
                ))}
                <p className="pt-2 text-center text-[13px] text-slate-500">One system. Every touchpoint. Full account context.</p>
              </div>
            </Reveal>

            <Reveal delay={0.25} className="mt-6 flex flex-col items-start gap-5 rounded-card border border-hair bg-surface-2/60 p-7 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="mb-1 text-[16px] font-semibold text-ink">Book a stack review for your agency</div>
                <div className="text-[15px] leading-relaxed text-ink/55">Bring your dialer setup and client list. We'll map exactly how DROS fits on top.</div>
              </div>
              <Button variant="secondary" size="lg" to="/book-meeting" onClick={() => trackCta('Book stack review')} className="shrink-0">
                Book stack review
              </Button>
            </Reveal>
          </Container>
        </Section>

        {/* ── FAQ ── */}
        <Section tone="light" spacing="lg" id="faq">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
              <Reveal>
                <Eyebrow className="text-ink-grey">Common questions</Eyebrow>
                <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                  DROS for third-party collections
                </Heading>
                <p className="mt-4 text-sm leading-relaxed text-ink-grey">
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
                    <div
                      className={`cursor-pointer rounded-xl border bg-white px-5 py-4 shadow-sm transition-colors duration-200 ${
                        openFaq === i ? 'border-accent/40' : 'border-line-dark'
                      }`}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-sm font-medium leading-snug text-ink-dark">{faq.q}</span>
                        <ChevronDown
                          className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 ${
                            openFaq === i ? 'rotate-180 text-accent' : 'text-ink-grey/50'
                          }`}
                        />
                      </div>
                      {openFaq === i && <p className="mt-3 text-sm leading-relaxed text-ink-grey">{faq.a}</p>}
                    </div>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
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
                  See DROS on your agency portfolios
                </Heading>
                <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink/55">
                  Bring your placements, dialer setup, and client requirements. We'll show you how DROS fits on top of your current stack - with compliance rules and client strategies modeled in from day one.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('Book an agency walkthrough - final CTA')}>
                    Book an agency walkthrough <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="lg" to="/contact">
                    Talk to us about AI agents
                  </Button>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {['No commitment required', 'Stack review included', 'Compliance-first approach', 'Live account modeling'].map((perk) => (
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
