export const route = '/collections/debt-buyer';
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
 * Debt-buyer collections page. Content sourced verbatim from the
 * reference debt-buyer.pdf (original dros.ai/collections/debt-buyer
 * page). Visual layer follows the Customer.io-inspired system already
 * built for the homepage and Pricing page - shared primitives, Reveal
 * scroll animation, and the single-accent token palette - instead of
 * the old bespoke dark clone.
 */

function HeroBg() {
  return (
    <div aria-hidden="true" className="absolute inset-0 z-0">
      <img loading="lazy" decoding="async" src="/industries/invoice.jpg" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 [background:linear-gradient(180deg,rgba(4,7,15,0.35)_0%,rgba(4,7,15,0.82)_100%)]" />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}

// ─── Persona data ─────────────────────────────────────────────────────────────
const PERSONAS = [
  {
    tab: 'Portfolio Owner / Principal',
    desc: 'Returns, strategy, oversight',
    role: 'Portfolio Owner / Principal',
    h: 'See what your acquisition is actually doing.',
    items: [
      'One workspace per portfolio - accounts, contacts, and outcomes in one place',
      "AI covers volume outreach so you're not paying for headcount to reach every account",
      'Know which accounts are in AI hands, which are in human queues, and which have been resolved',
      'Add a new acquisition as a new workspace - same rules, running in parallel without extra setup',
    ],
  },
  {
    tab: 'Collections Manager',
    desc: 'Agents, queues, coverage',
    role: 'Collections Manager',
    h: 'Run AI and human collectors from one OS.',
    items: [
      'Queues show exactly which accounts need human attention - with full context already attached',
      'Set routing rules once - DROS decides whether AI or human handles each account, automatically',
      "AI handles inbound 24/7 so after-hours contacts don't fall through the cracks",
      'Every AI interaction logged as transcript and tags - your collectors walk in informed, not cold',
    ],
  },
  {
    tab: 'Compliance Lead',
    desc: 'Guardrails, consent, audit',
    role: 'Compliance Lead',
    h: 'Guardrails in the platform, not in a policy doc.',
    items: [
      'DNC and consent revocations honored in real time across every channel - no manual syncing',
      'Call-rule enforcement, Reg F limits, and time-of-day windows encoded at the OS layer',
      'AI agents use approved scripts and disclosures on every interaction - full audit trail per account',
      'Escalation triggers route accounts out of AI reach the moment a compliance signal is detected',
    ],
  },
];

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'Can I keep a separate workspace for each portfolio I acquire?',
    a: "Yes - that's exactly how DROS is designed to be used for debt buyers. Each acquisition gets its own workspace with its own account list, queues, agent assignments, and engagement history. Portfolios don't bleed into each other. You can run multiple acquisitions in parallel and manage them independently from the same DROS account.",
  },
  {
    q: 'Does DROS replace my existing dialer or CRM?',
    a: 'No - DROS sits above your existing dialer and CRM as an engagement OS. Your current tools stay in place and connect to DROS as execution endpoints. The engagement logic, routing rules, and compliance guardrails live in DROS - so if you swap a dialer later, the rules don\'t need to be rebuilt. They live in the OS layer, not inside any individual tool.',
  },
  {
    q: 'What compliance rules does DROS handle out of the box for debt buyers?',
    a: 'DROS enforces DNC and consent management centrally - revocations are honored in real time across every channel. It applies Reg F call frequency limits, time-of-day windows, and configurable channel restrictions before any attempt is made. AI agents use your approved scripts and required disclosures on every interaction, with a full audit trail per account. You can layer in additional internal policies on top of these defaults.',
  },
  {
    q: 'How does DROS handle the handoff between AI and my human collectors?',
    a: 'You define the escalation rules - dispute language, hardship signals, balance thresholds, or any other trigger you set. When AI detects one of those signals, it stops and routes to the right human queue immediately. Your collector sees the full account timeline - every prior attempt, what the AI said, what the consumer said, and what flags were raised - before they pick up the phone. No briefing required.',
  },
  {
    q: "We're a small team. Is DROS too complex for us?",
    a: "DROS is built to scale down as well as up. A lean team running one or two portfolios can use DROS to punch above their weight - AI handles volume outreach while your collectors focus on the accounts that actually need a human conversation. You don't need a large ops team to configure it; we'll walk through your setup in the first session and get you to a working state before you go live.",
  },
];

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'DROS',
  applicationCategory: 'BusinessApplication',
  description: 'DROS is a collections engagement OS for debt buyers who self-collect on purchased portfolios. Run AI agents, human collectors, and compliance guardrails per acquisition in one platform.',
  url: 'https://dros.ai',
  featureList: [
    'Portfolio workspaces per acquisition',
    'AI voice and digital agents for debt buyer collections',
    'Human collector queues with full account context',
    'DNC and consent management',
    'Reg F and UDAAP guardrails',
    'Call-rule enforcement',
    'Escalation routing from AI to human',
    'Full engagement transcript per account',
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function DebtBuyerCollectionsPage() {
  const [activePersona, setActivePersona] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <PageFade className="min-h-screen bg-base text-ink">
      <Helmet>
        <title>AI Agents for Debt Buyer Collections | DROS</title>
        <meta name="description" content="DROS helps debt buyers who self-collect run AI agents and human collectors on purchased portfolios - with per-acquisition workspaces, Reg F guardrails, and full engagement history in one platform. Built for charged-off portfolio recovery teams." />
        <meta name="keywords" content="debt buyer collections software, AI agents for debt collection, charged off portfolio collections, purchased portfolio collections platform, debt buyer collections platform, AI debt collection software, self-collect debt buyer, collections software charged off accounts, Reg F debt buyer, debt recovery AI agents" />
        <link rel="canonical" href="https://dros.ai/collections/debt-buyer" />
        <meta property="og:title" content="AI Agents for Debt Buyer Collections | DROS" />
        <meta property="og:description" content="DROS helps debt buyers who self-collect run AI agents and human collectors on purchased portfolios - with per-acquisition workspaces, Reg F guardrails, and full engagement history in one platform." />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/collections/debt-buyer" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
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
                  Debt buyers who self-collect
                </span>
              </Reveal>

              <Reveal large>
                <h1 className="font-saans text-[34px] font-medium leading-[1.12] tracking-[-0.02em] sm:text-[46px] xl:text-[54px]">
                  <span className="block text-white">The engagement OS for</span>
                  <span className="block text-white/55">debt buyers who collect</span>
                </h1>
              </Reveal>

              <Reveal>
                <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
                  You bought the portfolio. Now run outreach on it - with AI agents, human collectors, and compliance guardrails working together in one OS, per acquisition.
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('Book a walkthrough - hero')}>
                  Book a walkthrough <ArrowRight className="h-4 w-4" />
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
                'One workspace per portfolio acquisition',
                'AI + human agents in the same OS',
                'Compliance guardrails built into the engagement layer',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-ink/60">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </div>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── SELF-COLLECT REALITY ── */}
        <Section tone="light" spacing="lg" id="reality">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">The self-collect reality</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                Most debt buyers run collections without infrastructure built for it.
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-grey">
                You have the portfolio. The problem is running outreach on it cleanly - across accounts, channels, and collectors - without stitching together tools that weren't designed to work together.
              </p>
            </Reveal>

            <Reveal stagger={0.08} className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { icon: '📋', t: 'Accounts loaded, then what?', d: 'You import a portfolio file and end up with a flat list of accounts. No prioritization logic, no channel strategy, no clear ownership of who works what - just a spreadsheet or a basic dialer queue.' },
                { icon: '🔀', t: 'No single view across agents and channels', d: "AI outreach, human collectors, and inbound calls all touch the same accounts - but there's no unified timeline. Contacts get repeated, context gets lost, and the left hand doesn't know what the right hand did." },
                { icon: '🗂️', t: 'Compliance logic lives outside the system', d: "Call rules, consent handling, and Reg F guardrails are in someone's head or a policy doc - not encoded into the platform. One missed revocation or off-script exchange can create exposure across the whole portfolio." },
              ].map((item) => (
                <RevealItem key={item.t}>
                  <div className="h-full rounded-card border border-line-dark bg-white p-8">
                    <div className="mb-4 text-3xl">{item.icon}</div>
                    <div className="mb-2 text-[17px] font-semibold text-ink-dark">{item.t}</div>
                    <div className="text-[15px] leading-[1.7] text-ink-grey">{item.d}</div>
                  </div>
                </RevealItem>
              ))}
            </Reveal>

            <Reveal delay={0.2} className="mt-6 flex items-start gap-4 rounded-card border border-line-dark bg-white p-7">
              <div className="mt-0.5 shrink-0 text-2xl">💡</div>
              <div>
                <div className="mb-1.5 text-[16px] font-semibold text-ink-dark">The fix isn't a better dialer - it's an OS layer above it</div>
                <div className="text-[15px] leading-[1.7] text-ink-grey">DROS sits above your existing tools and gives you engagement strategy, AI and human coordination, and compliance logic in one place - so every contact attempt on every account follows the same rules, automatically.</div>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ── BUILT FOR YOUR TEAM (persona tabs) ── */}
        <Section tone="base" spacing="lg" id="personas">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">Built for your team</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                Whether you're running a lean team or building a proper collections operation
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">Select a role to see what DROS changes for you.</p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 flex flex-col gap-3 sm:grid sm:grid-cols-3">
              {PERSONAS.map((p, i) => (
                <button
                  key={p.tab}
                  onClick={() => setActivePersona(i)}
                  className={`rounded-xl border px-5 py-4 text-left transition-colors ${
                    activePersona === i ? 'border-accent/40 bg-surface-2 text-white' : 'border-hair bg-surface/60 text-ink/70 hover:border-line'
                  }`}
                >
                  <div className="text-[14px] font-semibold leading-tight">{p.tab}</div>
                  <div className={`text-[12px] ${activePersona === i ? 'text-accent' : 'text-ink/40'}`}>{p.desc}</div>
                </button>
              ))}
            </Reveal>

            <div key={activePersona} className="mt-4 rounded-card border border-hair bg-surface-2/60 p-8 md:p-10">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">{PERSONAS[activePersona].role}</div>
              <h3 className="mb-6 text-2xl font-semibold leading-tight text-ink">{PERSONAS[activePersona].h}</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PERSONAS[activePersona].items.map((item) => (
                  <div key={item} className="relative rounded-xl border border-hair bg-white/[0.03] px-5 py-4 pl-9 text-[15px] leading-relaxed text-ink/70">
                    <span className="absolute left-4 top-4 text-[13px] font-bold text-accent">→</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* ── PORTFOLIO WORKSPACES ── */}
        <Section tone="base" spacing="lg" id="workspaces">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">Portfolio workspaces</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                One workspace per acquisition. Every account in its own context.
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                Load a portfolio into DROS and it becomes its own workspace - accounts, engagement history, and guardrails kept separate from every other acquisition you're running at the same time.
              </p>
            </Reveal>

            {/* Dashboard mockup */}
            <Reveal delay={0.1} className="mt-12 overflow-hidden rounded-card border border-hair shadow-[0_20px_60px_rgba(0,0,0,.5)]">
              <div className="flex flex-col sm:flex-row" style={{ background: '#0d1b2e' }}>
                <div className="hidden shrink-0 flex-col sm:flex" style={{ width: '200px', background: '#0a1628', borderRight: '1px solid rgba(255,255,255,.07)' }}>
                  <div className="border-b px-4 py-4" style={{ borderColor: 'rgba(255,255,255,.07)' }}>
                    <div className="text-[14px] font-bold text-white">DROS</div>
                    <div className="mt-0.5 text-[10px] font-light text-slate-500">Debt Resolution OS</div>
                  </div>
                  <div className="flex cursor-pointer items-center justify-between border-b px-4 py-2.5 text-[12px] font-medium text-slate-300" style={{ borderColor: 'rgba(255,255,255,.06)', background: 'rgba(255,255,255,.04)' }}>
                    <span className="mr-1 truncate">Meridian Recovery LLC</span>
                    <ChevronDown className="h-3 w-3 shrink-0 text-slate-500" />
                  </div>
                  <div className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-600">All Workspaces</div>
                  {[
                    { name: 'Q1 2025 - Retail Credit', active: false },
                    { name: 'FY24 Auto Deficiency', active: false },
                    { name: 'Q2 2025 - Mixed Consumer', active: true },
                    { name: 'Mar Telecom Batch', active: false },
                  ].map((ws) => (
                    <div
                      key={ws.name}
                      className={`truncate border-l-2 px-4 py-2 text-[11.5px] transition-all ${ws.active ? 'border-accent text-white' : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}
                      style={ws.active ? { background: 'rgba(3,210,252,.08)' } : {}}
                    >
                      {ws.name}
                    </div>
                  ))}
                  <div className="px-4 py-2 text-[12px] font-medium text-accent">+ Create Workspace</div>
                </div>

                <div className="min-w-0 flex-1 p-4 sm:p-5">
                  <div className="mb-5 hidden items-start justify-between gap-2 sm:flex">
                    <div>
                      <div className="text-[18px] font-bold leading-tight text-white">Dashboard</div>
                      <div className="mt-0.5 text-[11px] font-light text-slate-500">Q2 2025 - Mixed Consumer · 3,847 accounts</div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button className="rounded-lg bg-accent px-3 py-1.5 text-[11px] font-semibold text-slate-950">Edit Dashboard</button>
                      <button className="rounded-lg border border-white/[0.12] bg-white/[0.08] px-3 py-1.5 text-[11px] font-medium text-white">Manage</button>
                    </div>
                  </div>

                  <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {[
                      { label: 'Total to Collect', val: '$4,182,340', sub: 'Outstanding balance', ico: '$', bg: 'linear-gradient(135deg,#f97316,#ef4444)' },
                      { label: 'Total Collected', val: '$318,750', sub: 'All time collections', ico: '✓', bg: 'linear-gradient(135deg,#03D2FC,#0ea5e9)' },
                      { label: 'Total Accounts', val: '3,847', sub: 'Active accounts', ico: '👤', bg: 'linear-gradient(135deg,#03D2FC,#6366f1)' },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between gap-2 rounded-xl p-3" style={{ background: '#132035', border: '1px solid rgba(255,255,255,.08)' }}>
                        <div className="min-w-0">
                          <div className="mb-1 text-[9px] font-medium uppercase tracking-wide text-slate-400">{s.label}</div>
                          <div className="text-[16px] font-bold leading-none text-white sm:text-[18px]">{s.val}</div>
                          <div className="mt-1 text-[9px] font-light text-slate-500">{s.sub}</div>
                        </div>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-sm font-bold text-white" style={{ background: s.bg }}>{s.ico}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {[
                      { title: 'Collected Payments', ico: '↗', icoBg: '#10b981', rows: [{ label: 'May 2025', val: '$84,200', pct: 72 }, { label: 'Apr 2025', val: '$116,950', pct: 100 }], barColor: '#03D2FC' },
                      { title: 'Scheduled Payments', ico: '▦', icoBg: '#6366f1', rows: [{ label: 'Jun 2025', val: '$143,200', pct: 88 }, { label: 'Jul 2025', val: '$97,400', pct: 60 }], barColor: '#DD39F9' },
                    ].map((chart) => (
                      <div key={chart.title} className="rounded-xl p-3.5" style={{ background: '#132035', border: '1px solid rgba(255,255,255,.08)' }}>
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white" style={{ background: chart.icoBg }}>{chart.ico}</div>
                          <div className="text-[12px] font-semibold text-white sm:text-[13px]">{chart.title}</div>
                        </div>
                        {chart.rows.map((row) => (
                          <div key={row.label}>
                            <div className="mb-1.5 flex justify-between text-[10px] text-slate-400 sm:text-[11px]">
                              <span>{row.label}</span><span className="font-medium">{row.val}</span>
                            </div>
                            <div className="mb-2.5 h-1 overflow-hidden rounded bg-white/[0.07]">
                              <div className="h-full rounded" style={{ width: `${row.pct}%`, background: chart.barColor }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
            <p className="mx-auto mt-4 max-w-2xl px-2 text-center text-[13px] leading-relaxed text-ink/45">
              Each workspace shows its own dashboard - totals, scheduled payments, and activity are scoped to that acquisition only.
            </p>

            <Reveal delay={0.2} className="mt-8 flex flex-col items-start gap-5 rounded-card border border-hair bg-surface-2/60 p-7 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="mb-1 text-[16px] font-semibold text-ink">Multiple acquisitions run in parallel - never mixed together</div>
                <div className="text-[15px] leading-relaxed text-ink/55">Add a new portfolio as a new workspace. Engagement rules, account history, and compliance state stay separate from every other acquisition you're working.</div>
              </div>
              <Button variant="secondary" size="lg" to="/book-meeting" onClick={() => trackCta('Book a portfolio walkthrough')} className="shrink-0">
                Book a portfolio walkthrough
              </Button>
            </Reveal>
          </Container>
        </Section>

        {/* ── CONTEXT-AWARE AI AGENTS ── */}
        <Section tone="light" spacing="lg" id="context-aware">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">Context-aware AI agents</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                AI that knows what's already happened on every account
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-grey">
                Charged-off accounts have often been contacted before - by you, or by a previous collector. DROS AI never calls blind. It works from every prior attempt, outcome, and consumer signal already logged in that workspace.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-12 grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">What the AI sees before every contact attempt</div>
                <div className="relative flex flex-col gap-0">
                  <div className="absolute bottom-6 left-[17px] top-6 w-px bg-line-dark" />
                  {[
                    { ico: '📥', t: 'Account loaded - Q2 2025 Acquisition', d: 'Balance $2,840 · Charged off Mar 2024 · No prior contact in this workspace', time: 'Day 1', active: false },
                    { ico: '🤖', t: 'AI voice attempt - no answer', d: 'Voicemail left. Required disclosures delivered. Callback link sent via SMS.', time: 'Day 3', active: false },
                    { ico: '💬', t: 'AI SMS - consumer replied "call me after 6"', d: 'Preference logged. Outreach window updated. Next attempt scheduled 6-8pm.', time: 'Day 5', active: false },
                    { ico: '📞', t: 'AI voice - right party connected', d: 'Called at 6:14pm per consumer preference. Opened with prior voicemail reference. Consumer asked about payment options - AI offered 3-month plan within approved threshold.', time: 'Day 7 · Now', active: true },
                  ].map((ev) => (
                    <div key={ev.t} className="relative flex gap-3 py-3.5">
                      <div className={`relative z-10 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border text-base ${ev.active ? 'border-accent bg-accent/10 shadow-[0_0_0_3px_rgba(3,210,252,.14)]' : 'border-line-dark bg-slate-50'}`}>
                        {ev.ico}
                      </div>
                      <div className="min-w-0 flex-1 pt-1">
                        <div className="mb-1 text-[14px] font-semibold leading-tight text-ink-dark">{ev.t}</div>
                        {ev.active ? (
                          <div className="rounded-lg border border-accent/25 bg-accent/[0.06] p-2.5 text-[13px] leading-[1.6] text-ink-dark/80">{ev.d}</div>
                        ) : (
                          <div className="text-[13px] leading-[1.6] text-ink-grey">{ev.d}</div>
                        )}
                        <div className={`mt-1.5 text-[11px] font-medium ${ev.active ? 'text-accent' : 'text-ink-grey/60'}`}>{ev.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                {[
                  { ico: '🧠', h: 'Every prior attempt is context', d: 'The AI knows what was said, what the consumer signalled, and what was promised - on every prior interaction in that workspace. No repeated intros, no ignored preferences.' },
                  { ico: '🎯', h: 'Timing and channel adapt per account', d: 'Consumer said evening only? Replied to SMS but not calls? The AI adjusts - and logs why - so the pattern carries forward across every future attempt.' },
                  { ico: '⚠️', h: 'Escalation triggers fire instantly', d: 'Dispute language, hardship signals, "wrong person" claims, or any flag you define - AI stops mid-conversation and routes to your human queue with the full thread attached.' },
                  { ico: '📋', h: 'Full transcript, every time', d: 'Every AI call and message is logged as a transcript with tags. Your collectors, and your compliance record, have the complete picture - without anyone taking notes.' },
                ].map((pt, i, arr) => (
                  <div key={pt.h} className={`flex gap-4 py-6 ${i < arr.length - 1 ? 'border-b border-line-dark' : ''}`}>
                    <div className="mt-0.5 w-9 shrink-0 text-center text-2xl">{pt.ico}</div>
                    <div className="min-w-0">
                      <div className="mb-1.5 text-[16px] font-semibold text-ink-dark">{pt.h}</div>
                      <div className="text-[15px] leading-[1.65] text-ink-grey">{pt.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2} className="mt-8 flex flex-col items-start gap-5 rounded-card border border-line-dark bg-white p-7 shadow-sm sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="mb-1 text-[16px] font-semibold text-ink-dark">AI that gets smarter with every contact attempt</div>
                <div className="text-[15px] leading-relaxed text-ink-grey">The more accounts your team works through DROS, the richer the context the AI has to work from - on that account, and on future acquisitions in the same workspace.</div>
              </div>
              <Button variant="onLight" size="lg" to="/resources/videos" className="shrink-0">
                See AI agents in action
              </Button>
            </Reveal>
          </Container>
        </Section>

        {/* ── AI vs HUMAN ── */}
        <Section tone="base" spacing="lg" id="ai-human">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">AI + human agents</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                AI handles the volume - your team handles the judgment calls
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                Charged-off portfolios have a lot of accounts and wide variance. DROS routes each one to the right agent type - with rules for when AI must stop and a human must take over.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-12 grid grid-cols-1 overflow-hidden rounded-card border border-hair md:grid-cols-2">
              <div className="border-b border-hair bg-accent/[0.06] p-6 md:border-b-0 md:border-r md:p-11">
                <span className="inline-block rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[.08em] text-accent">AI agents</span>
                <h3 className="mb-5 mt-4 text-lg font-semibold leading-tight text-ink sm:text-xl">Volume outreach, 24/7 availability</h3>
                <ul className="divide-y divide-hair">
                  {[
                    'Reach high volumes of accounts without proportional headcount - consistent tone every time',
                    'Right-party verification, balance confirmation, and payment collection within your policy limits',
                    'Offer payment plans and settle within pre-approved thresholds - no human needed',
                    'Inbound calls and messages handled around the clock on every active portfolio',
                    'Full transcript and tags logged per interaction - ready for any human who picks up the account next',
                  ].map((item) => (
                    <li key={item} className="py-2.5 text-[15px] leading-snug text-ink/70">{item}</li>
                  ))}
                </ul>
                <div className="mt-5 rounded-xl bg-accent/10 p-4 text-[14px] leading-[1.65] text-accent">
                  AI coverage means you can work far more accounts per dollar on a purchased portfolio - without sacrificing consistency or documentation quality.
                </div>
              </div>
              <div className="bg-surface-2/60 p-6 md:p-11">
                <span className="inline-block rounded-full border border-hair bg-white/[0.06] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[.08em] text-ink/70">Human collectors</span>
                <h3 className="mb-5 mt-4 text-lg font-semibold leading-tight text-ink sm:text-xl">High-stakes, high-judgment conversations</h3>
                <ul className="divide-y divide-hair">
                  {[
                    'Accounts where the consumer raises a dispute, challenge, or documentation question',
                    'Hardship cases, arrangements beyond standard policy, or sensitive account flags',
                    'High-balance accounts your team has flagged for personal attention',
                    'Any escalation trigger your rules define - DROS routes with the full account timeline attached',
                    'Settlement negotiations where judgment matters more than script',
                  ].map((item) => (
                    <li key={item} className="py-2.5 text-[15px] leading-snug text-ink/70">{item}</li>
                  ))}
                </ul>
                <div className="mt-5 rounded-xl bg-white/[0.05] p-4 text-[14px] leading-[1.65] text-ink/70">
                  When AI detects an escalation signal, it stops and routes to your human queue - with every prior touch, outcome, and note visible before your collector says hello.
                </div>
              </div>
            </Reveal>

            <p className="mx-auto mt-5 max-w-2xl px-2 text-center text-[14px] leading-relaxed text-ink/45">
              <strong className="text-ink/70">You set the routing rules.</strong> DROS enforces them on every account, on every channel, every time - without anyone having to remember the policy manually.
            </p>
          </Container>
        </Section>

        {/* ── COMPLIANCE GUARDRAILS ── */}
        <Section tone="base" spacing="lg" id="compliance">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">Engagement guardrails</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                Compliance in the platform - not in people's heads
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                Debt buyers who self-collect carry the same compliance exposure as any collections operation. DROS encodes the rules once and enforces them automatically - on every account, every contact attempt.
              </p>
            </Reveal>

            <Reveal stagger={0.08} className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                { ico: '🔕', label: 'DNC & consent management', h: 'Revocations honored in real time', d: 'DNC registrations and consent revocations are held centrally. The moment a consumer opts out - on any channel - all future attempts on that account stop automatically. No manual syncing, no lag, no missed revocations.', highlight: true },
                { ico: '📞', label: 'Call-rule enforcement', h: 'Frequency, timing, and channel limits', d: 'Contact frequency caps, time-of-day windows, and channel restrictions are enforced at the OS layer before any attempt is made - by AI or human agents. Rules apply consistently across every account in every portfolio workspace.', highlight: false },
                { ico: '⚖️', label: 'Reg F & UDAAP guardrails', h: 'Policies encoded as operating rules', d: 'Reg F call limits, required disclosures, and UDAAP-aware escalation triggers are configured into DROS as guardrails - not policy documents. AI agents use approved scripts and disclosures on every interaction, with a full audit trail per account.', highlight: false },
              ].map((c) => (
                <RevealItem key={c.h}>
                  <div className={`h-full rounded-card p-6 sm:p-8 ${c.highlight ? 'border border-accent/25 bg-accent/[0.07]' : 'border border-hair bg-surface-2/60'}`}>
                    <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-accent">
                      <span>{c.ico}</span>{c.label}
                    </div>
                    <div className="mb-2.5 text-[17px] font-semibold leading-tight text-ink sm:text-[19px]">{c.h}</div>
                    <div className="text-[14px] leading-[1.75] text-ink/55 sm:text-[15px]">{c.d}</div>
                  </div>
                </RevealItem>
              ))}
            </Reveal>

            <Reveal delay={0.2} className="mt-6 flex flex-col items-start gap-5 rounded-card border border-hair bg-surface-2/60 p-7 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="mb-1 text-[16px] font-semibold text-ink">Every contact attempt is logged and auditable</div>
                <div className="text-[15px] leading-relaxed text-ink/55">Who contacted the account, on what channel, with what script, and what the outcome was - all stored per account. Clean audit trail without any extra work from your team.</div>
              </div>
              <Button variant="secondary" size="lg" to="/book-meeting" onClick={() => trackCta('Talk about compliance setup')} className="shrink-0">
                Talk about compliance setup
              </Button>
            </Reveal>
          </Container>
        </Section>

        {/* ── WITHOUT vs WITH ── */}
        <Section tone="light" spacing="lg" id="difference">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">The DROS difference</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                From disconnected tools to one engagement OS per portfolio
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-grey">
                Most self-collecting debt buyers are stitching things together. DROS replaces that with a single layer that coordinates everything.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-12 grid grid-cols-1 overflow-hidden rounded-card border border-line-dark md:grid-cols-2">
              <div className="border-b border-line-dark bg-[#F3F8FC] p-6 md:border-b-0 md:border-r md:p-11">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-grey">Without DROS</div>
                <div className="mb-4 text-[18px] font-semibold leading-tight text-ink-dark sm:text-[20px]">Stitched together, hard to control</div>
                <div className="flex flex-col gap-1">
                  {[
                    'Portfolio accounts sit in a spreadsheet or flat dialer list - no prioritization, no strategy layer',
                    'AI outreach and human collectors work from different systems - no shared timeline per account',
                    "Compliance rules live in a doc or someone's head - inconsistently applied, hard to prove",
                    'Each new portfolio acquisition means repeating the same setup across disconnected tools',
                    'No clean view of who touched what account, when, and what happened',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-lg bg-white/60 p-3">
                      <span className="mt-0.5 shrink-0 text-[13px] font-bold text-red-400">✗</span>
                      <span className="text-[15px] leading-[1.55] text-ink-grey">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 md:p-11">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">With DROS</div>
                <div className="mb-4 text-[18px] font-semibold leading-tight text-ink-dark sm:text-[20px]">One OS, every portfolio, every channel</div>
                <div className="flex flex-col gap-1">
                  {[
                    "Each acquisition gets its own workspace - accounts, queues, strategy, and history in one place",
                    'AI and human agents work from the same account timeline - nothing repeated, nothing missed',
                    'Compliance guardrails encoded at the OS layer - enforced automatically on every contact attempt',
                    'New portfolio loaded? Workspace is ready - same rules, same setup, running in parallel',
                    'Full account timeline per contact - auditable, attributable, no manual logging',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-lg bg-accent/[0.05] p-3">
                      <span className="mt-0.5 shrink-0 text-[13px] font-bold text-accent">✓</span>
                      <span className="text-[15px] leading-[1.55] text-ink-dark/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ── GETTING STARTED ── */}
        <Section tone="base" spacing="lg" id="getting-started">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">Getting started</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                Load a portfolio and start collecting in three steps
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                We start from your actual portfolio file, team setup, and current workflow - not a blank slate.
              </p>
            </Reveal>

            <Reveal stagger={0.08} className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { num: '01', h: 'Load your portfolio as a workspace', d: "Bring your portfolio file. We'll help you load accounts into a DROS workspace, review your current engagement setup, and identify what rules need to be encoded before outreach starts.", items: ['Portfolio accounts loaded per acquisition', 'Existing dialer and CRM connections reviewed', 'Initial segmentation and strategy mapped'] },
                { num: '02', h: 'Configure AI, human routing, and guardrails', d: 'Define which accounts go to AI first, when escalation kicks in, and what the compliance rules are. DROS models your exact setup - approved scripts, call rules, consent handling - encoded once and applied everywhere.', items: ['AI vs human routing thresholds set', 'Compliance rules and call windows encoded', 'Approved scripts and disclosures configured'] },
                { num: '03', h: 'Go live, monitor, and add portfolios', d: 'Start outreach on a defined slice. Track contacts, escalations, and outcomes across AI and human agents in one view. Add the next portfolio acquisition as a new workspace - your setup carries over.', items: ['Live contact and escalation tracking', 'AI and human performance in one view', 'Next acquisition ready to load immediately'] },
              ].map((step) => (
                <RevealItem key={step.num}>
                  <div className="h-full rounded-card border border-hair bg-surface-2/60 p-8">
                    <div className="mb-4 font-display text-4xl leading-none text-accent/40 sm:text-5xl">{step.num}</div>
                    <div className="mb-2.5 text-[17px] font-semibold leading-tight text-ink sm:text-[18px]">{step.h}</div>
                    <div className="mb-4 text-[15px] leading-[1.7] text-ink/55">{step.d}</div>
                    <ul className="space-y-1.5">
                      {step.items.map((item) => (
                        <li key={item} className="relative pl-4 text-[14px] leading-snug text-ink/45">
                          <span className="absolute left-0 top-1 text-[11px] font-bold text-accent">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealItem>
              ))}
            </Reveal>

            <Reveal delay={0.2} className="mt-8 flex flex-col items-start gap-5 rounded-card border border-hair bg-surface-2/60 p-7 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="mb-1 text-[16px] font-semibold text-ink">Bring a real portfolio file</div>
                <div className="text-[15px] leading-relaxed text-ink/55">We'll walk through how DROS would set up a workspace for it - accounts, routing logic, compliance rules, and AI vs human split - based on your actual team and current workflow.</div>
              </div>
              <Button variant="secondary" size="lg" to="/book-meeting" onClick={() => trackCta('Book a portfolio walkthrough - getting started')} className="shrink-0">
                Book a portfolio walkthrough
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
                  DROS for debt buyers
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
                  See DROS on your next portfolio acquisition
                </Heading>
                <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink/55">
                  Bring a recent portfolio file and your current team setup. We'll walk through how DROS would run it - workspaces, AI and human routing, compliance guardrails - based on your actual workflow.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('Book a portfolio walkthrough - footer')}>
                    Book a portfolio walkthrough <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="lg" to="/contact">
                    Talk to us about debt-buyer collections
                  </Button>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {['No commitment required', 'Bring a real portfolio file', 'Works with your existing stack', 'Small team or growing operation'].map((perk) => (
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
