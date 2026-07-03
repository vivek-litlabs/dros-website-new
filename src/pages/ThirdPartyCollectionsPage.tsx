export const route = '/collections/third-party';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { trackCta } from '../lib/analytics';

// ─── Scroll reveal hook ───────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('tp-in'); obs.disconnect(); } },
      { threshold: 0.06, rootMargin: '0px 0px -36px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`tp-rv ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function Eyebrow({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <div className="flex items-center justify-center mb-5">
      <span className={`inline-block border rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase ${light ? 'border-slate-300 text-slate-600' : 'border-white/20 text-slate-300'}`}>{label}</span>
    </div>
  );
}

function EyebrowLeft({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <div className="flex items-center mb-5">
      <span className={`inline-block border rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase ${light ? 'border-slate-300 text-slate-600' : 'border-white/20 text-slate-300'}`}>{label}</span>
    </div>
  );
}

function DarkInlineCta({ icon, title, desc, linkLabel, linkHref }: { icon: string; title: string; desc: string; linkLabel: string; linkHref: string }) {
  return (
    <div className="mt-12 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-5 py-6 sm:px-9 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-wrap">
      <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-bold text-white mb-1">{title}</div>
        <div className="text-sm text-slate-400 leading-relaxed">{desc}</div>
      </div>
      <a
        href={linkHref}
        onClick={() => trackCta(linkLabel)}
        className="text-sm font-bold text-cyan-400 flex items-center gap-1.5 hover:gap-3 transition-all flex-shrink-0"
      >
        {linkLabel} <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}

function LightInlineCta({ icon, title, desc, linkLabel, linkHref }: { icon: string; title: string; desc: string; linkLabel: string; linkHref: string }) {
  return (
    <div className="mt-12 bg-[#F3F8FC] border border-slate-200 rounded-2xl px-5 py-6 sm:px-9 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-wrap shadow-sm">
      <div className="w-10 h-10 bg-teal-600/10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-bold text-slate-900 mb-1">{title}</div>
        <div className="text-sm text-slate-500 leading-relaxed">{desc}</div>
      </div>
      <a
        href={linkHref}
        onClick={() => trackCta(linkLabel)}
        className="text-sm font-bold text-teal-600 flex items-center gap-1.5 hover:gap-3 transition-all flex-shrink-0"
      >
        {linkLabel} <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ThirdPartyCollectionsPage() {
  const [activePersona, setActivePersona] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <style>{`
        .tp-rv { opacity: 0; transform: translateY(20px); transition: opacity .65s cubic-bezier(.22,.68,0,1.1), transform .65s cubic-bezier(.22,.68,0,1.1); }
        .tp-in { opacity: 1; transform: none; }
      `}</style>

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

      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-slate-950 pt-24 sm:pt-28 pb-16 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-slate-950 to-blue-950/20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-[radial-gradient(ellipse_at_50%_30%,rgba(6,182,212,.07)_0%,rgba(6,182,212,.03)_40%,transparent_65%)]" />
          <div
            className="absolute inset-0 opacity-100"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)',
              backgroundSize: '72px 72px',
              maskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%,black 0%,transparent 100%)',
            }}
          />
        </div>
        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-6 lg:px-14 text-center">
          <Reveal>
            <h1
              className="font-bold text-white mb-5 max-w-3xl mx-auto"
              style={{ fontSize: 'clamp(38px,5.5vw,66px)', lineHeight: 1.07, letterSpacing: '-.03em' }}
            >
              AI-powered engagement for{' '}
              <em className="not-italic text-cyan-400">third-party debt collection</em>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-[560px] mx-auto mb-11 font-normal">
              Orchestrate AI agents, human agents, and your existing systems across every client portfolio.
            </p>
            <div className="flex gap-3.5 justify-center flex-wrap">
              <Link
                to="/book-meeting"
                onClick={() => trackCta('Book an agency walkthrough')}
                className="inline-flex items-center gap-2 font-bold text-base px-7 py-4 rounded-xl transition-all hover:-translate-y-0.5" style={{ background: '#03D2FC', color: '#010C20' }}
              >
                Book an agency walkthrough <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/resources/videos"
                className="inline-flex items-center gap-2 bg-transparent text-slate-300 hover:text-white font-semibold text-base px-7 py-4 rounded-xl border border-white/[0.14] hover:border-white/30 transition-all"
              >
                See AI agents in action
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="bg-slate-900 border-y border-white/[0.05] py-5">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 flex-wrap">
          {[
            'FDCPA & Reg F enforced before the first dial',
            'Separate workspaces per client portfolio',
            'AI voice agents + human agents in one platform',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm font-medium text-slate-400 text-center sm:text-left">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── PAIN STATS ── */}
      <section className="bg-white py-16 md:py-[120px]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 lg:px-14">
          <Reveal>
            <div className="max-w-[720px] mx-auto text-center mb-10 md:mb-14">
              <Eyebrow label="The agency reality" light />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.12] text-slate-900 mb-4">
                More volume. Thinner margins.<br />
                <em className="not-italic text-teal-600">Higher compliance pressure.</em>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-[560px] mx-auto mt-4">
                The tools most agencies run on weren't built for this environment. DROS was.
              </p>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-200 rounded-[20px] overflow-hidden">
              {[
                {
                  n: '42', suffix: '%',
                  t: 'Rise in compliance complaints',
                  d: 'Reg F, TCPA, and FDCPA violations are now the fastest-growing source of agency risk - often from mis-tuned dialers, not bad intent.',
                },
                {
                  n: '3-5', suffix: '×',
                  t: 'Tools agencies manually coordinate',
                  d: 'Most shops stitch together dialers, a CRM, spreadsheets, and SMS - each with its own rules, its own compliance logic, its own lists.',
                },
                {
                  n: '68', suffix: '%',
                  t: 'RFPs now ask about AI strategy',
                  d: 'Modern creditors expect a tech-forward answer on AI, compliance, and omnichannel. Promising higher dial volume no longer wins placements.',
                },
              ].map((s, i) => (
                <div key={i} className={`px-7 sm:px-11 py-10 sm:py-12 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-slate-200' : ''}`}>
                  <div className="text-[56px] sm:text-[72px] font-bold leading-none mb-3 text-teal-600">
                    {s.n}<span className="text-[24px] sm:text-[28px] font-bold">{s.suffix}</span>
                  </div>
                  <div className="text-[16px] sm:text-[17px] font-bold text-slate-900 mb-2">{s.t}</div>
                  <div className="text-[14px] sm:text-[15px] text-slate-500 leading-[1.7]">{s.d}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AI + HUMAN ── */}
      <section className="bg-[#f7f9fc] border-y border-slate-200/60 py-16 md:py-[120px]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 lg:px-14">
          <Reveal>
            <div className="max-w-[720px] mx-auto text-center mb-10 md:mb-14">
              <Eyebrow label="AI + human collaboration" light />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.12] text-slate-900 mb-4">
                AI agents handle the volume.<br />
                <em className="not-italic text-teal-600">Your people handle the hard conversations.</em>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-[560px] mx-auto mt-4">
                Most debt collection agencies are leaving after-hours coverage and early-stage volume on the table. AI voice agents cover that work - and hand off with full account context when a human agent needs to step in.
              </p>
            </div>
          </Reveal>

          {/* Split card */}
          <Reveal delay={160}>
            <div className="grid grid-cols-1 md:grid-cols-2 rounded-[20px] overflow-hidden">
              <div className="bg-[#f0fdf9] border border-cyan-100 p-7 sm:p-11 md:p-12">
                <span className="inline-block text-xs font-bold tracking-[0.08em] uppercase px-4 py-1.5 rounded-full bg-cyan-100 text-teal-700 mb-4">AI agents handle</span>
                <h3 className="text-xl font-bold text-slate-900 leading-tight mb-5">Scale the work that doesn't need a human</h3>
                <ul className="space-y-0">
                  {[
                    'High-volume early-stage reminders',
                    'Right-party verification calls',
                    'After-hours and weekend coverage',
                    'Basic info delivery and promise-to-pay',
                    'Overflow when human queues fill',
                    'Transcripts, summaries, and queue tags',
                  ].map((item, i) => (
                    <li key={i} className="text-[16px] text-slate-700 py-2.5 border-b border-slate-200/70 last:border-b-0 leading-snug font-medium">{item}</li>
                  ))}
                </ul>
                <div className="mt-6 p-4 rounded-xl bg-cyan-100/60 text-teal-700 text-[15px] leading-[1.65] font-medium">
                  Every AI call leaves a full transcript, summary, and tags - feeding directly into the human agent's queue context.
                </div>
              </div>
              <div className="bg-[#fff7ed] border border-orange-100 md:border-l-0 p-7 sm:p-11 md:p-12">
                <span className="inline-block text-xs font-bold tracking-[0.08em] uppercase px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 mb-4">Human agents handle</span>
                <h3 className="text-xl font-bold text-slate-900 leading-tight mb-5">Reserve judgment for what requires it</h3>
                <ul className="space-y-0">
                  {[
                    'Settlement and payment plan negotiation',
                    'Hardship discussions and disputes',
                    'Escalations and legal threats',
                    'Client-mandated human-only accounts',
                    'Complex and sensitive situations',
                    'Relationship-sensitive portfolios',
                  ].map((item, i) => (
                    <li key={i} className="text-[16px] text-slate-700 py-2.5 border-b border-orange-100/70 last:border-b-0 leading-snug font-medium">{item}</li>
                  ))}
                </ul>
                <div className="mt-6 p-4 rounded-xl bg-orange-100/60 text-orange-800 text-[15px] leading-[1.65] font-medium">
                  DROS controls the handoff - when to transfer, which queue, and what context travels with the call. No blind transfers.
                </div>
              </div>
            </div>
          </Reveal>

          {/* Handoff graphic */}
          <Reveal delay={260}>
            <div className="mt-5 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg,#0a1628 0%,#0d2137 40%,#0a1f30 70%,#061320 100%)' }}>
              <div className="px-5 sm:px-8 py-8 sm:py-10 relative">
                <div className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-80 pointer-events-none" style={{ background: 'radial-gradient(ellipse,rgba(6,182,212,.1) 0%,transparent 65%)' }} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10">
                  {/* AI card */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,.28)]">
                    <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,transparent,#06b6d4 50%,transparent)' }} />
                    <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 flex-shrink-0" />
                      <span className="text-xs font-bold tracking-[0.08em] uppercase text-teal-700">AI agent - live call</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[13px] font-bold text-teal-700 flex-shrink-0">MJ</div>
                        <div>
                          <div className="text-[15px] font-bold text-slate-900">Marcus Johnson</div>
                          <div className="text-[12.5px] text-slate-500 mt-0.5">Acc #48210 &middot; Day 34</div>
                        </div>
                      </div>
                      <div className="bg-[#f0f9ff] border border-cyan-200/60 rounded-[4px_14px_14px_14px] px-3.5 py-3 mb-2.5">
                        <div className="text-[10.5px] font-bold tracking-[0.08em] uppercase text-teal-600 mb-1.5">AI</div>
                        <div className="text-[14px] text-slate-800">"Are you open to discussing a payment arrangement today?"</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200/60 rounded-[14px_4px_14px_14px] px-3.5 py-3 ml-2.5 mb-3">
                        <div className="text-[10.5px] font-bold tracking-[0.08em] uppercase text-slate-500 mb-1.5">Debtor</div>
                        <div className="text-[14px] text-slate-700">"Yes, I'd like to talk about a payment plan."</div>
                      </div>
                      <div className="flex items-center gap-2 text-[12.5px] text-slate-400 mt-3">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                        In call &middot; 1m 52s
                      </div>
                    </div>
                  </div>
                  {/* Human card */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,.28)]">
                    <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,transparent,#10b981 50%,transparent)' }} />
                    <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span className="text-xs font-bold tracking-[0.08em] uppercase text-emerald-700">Human agent - briefed</span>
                    </div>
                    <div className="p-5">
                      <div className="bg-[#f0fdf9] border border-emerald-200/60 rounded-xl p-4 mb-3">
                        <div className="text-[11px] font-bold tracking-[0.09em] uppercase text-emerald-500 mb-2">AI summary</div>
                        <div className="text-[14px] text-slate-700 leading-[1.7]">Debtor confirmed willingness to discuss a payment plan. Ready to negotiate.</div>
                      </div>
                      <div className="bg-[#f0fdf9] border border-emerald-200/60 rounded-xl p-3 text-center text-[14px] font-bold text-emerald-800">
                        &#10003; Ready to take the call
                      </div>
                    </div>
                  </div>
                </div>
                {/* Transfer pill */}
                <div className="relative flex items-end justify-center h-20 mt-8 z-20">
                  <div className="absolute left-0 right-0 bottom-4 h-px" style={{ background: 'linear-gradient(90deg,transparent 0%,rgba(245,158,11,.4) 20%,rgba(245,158,11,.4) 80%,transparent 100%)' }} />
                  <div className="relative bg-white border border-amber-300/50 rounded-[40px] px-7 py-3 shadow-[0_4px_24px_rgba(245,158,11,.12)] text-center">
                    <div className="text-[14px] font-bold text-amber-700 mb-0.5">&#x21C4;&thinsp;Warm transfer</div>
                    <div className="text-[12px] text-slate-400">Payment plan request detected &middot; DROS routing</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <LightInlineCta
              icon="▶"
              title="See AI-to-human handoffs live"
              desc="Watch compliance enforcement, AI calling, and warm transfer to human queue in action."
              linkLabel="Book a live walkthrough"
              linkHref="/book-meeting"
            />
          </Reveal>
        </div>
      </section>

      {/* ── ACCOUNT CONTEXT ── */}
      <section className="bg-slate-950 py-16 md:py-[120px]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 lg:px-14">
          <Reveal>
            <div className="max-w-[720px] mx-auto text-center mb-14">
              <Eyebrow label="Account context" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.12] text-white mb-4">
                Every agent knows exactly<br />
                <em className="not-italic text-cyan-400">what happened on this account before</em>
              </h2>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-[560px] mx-auto mt-4">
                In third-party collections, context is everything. AI calls, human calls, SMS, disputes, and payments all land in one timeline per account - so nothing gets repeated, missed, or worked at cross purposes across your portfolios.
              </p>
              <ul className="mt-7 text-left inline-block space-y-0 border-t border-white/[0.07]">
                {[
                  'Unified contact history across AI and human agents, SMS, email, and payment portals',
                  'Multiple placement types handled with separate strategies, same shared history',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 py-4 border-b border-white/[0.07] text-[16px] text-slate-300 leading-snug">
                    <span className="text-cyan-400 font-bold mt-0.5 flex-shrink-0">&#8594;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Timeline widget */}
          <Reveal delay={180}>
            <div className="bg-slate-800 border border-white/10 rounded-[20px] overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.18]" />
              {/* Header */}
              <div className="flex items-center gap-3 px-5 sm:px-8 py-4 sm:py-5 bg-white/[0.025] border-b border-white/[0.06] flex-wrap gap-y-2">
                <div className="flex-1">
                  <div className="text-[17px] font-bold text-white">Account #48210 - Johnson, M.</div>
                  <div className="text-[12.5px] text-slate-400 mt-0.5">Client A &middot; Primary placement &middot; Stage: negotiation</div>
                </div>
                <span className="text-[10px] font-bold tracking-[0.07em] uppercase px-2.5 py-1 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">Reg F clear</span>
                <span className="text-[10px] font-bold tracking-[0.07em] uppercase px-2.5 py-1 rounded bg-orange-400/10 text-orange-400 border border-orange-400/20">Promise pending</span>
              </div>
              {/* Entries */}
              <div className="px-5 sm:px-8">
                {[
                  {
                    dot: 'bg-cyan-400', typeColor: 'text-cyan-400', type: 'AI Voice',
                    meta: 'Day 1 &middot; 09:14am &middot; 2m 34s',
                    text: 'Right-party confirmed. Account details delivered. Debtor requested callback at 5pm - DROS queued human follow-up automatically.',
                    chip: { label: '&#8599; RPV confirmed &middot; transferred to human queue', cls: 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20' },
                  },
                  {
                    dot: 'bg-slate-500', typeColor: 'text-slate-400', type: 'System',
                    meta: 'Day 1 &middot; 09:16am',
                    text: '7-in-7 count: 1 of 7. Call-hour window closes at 9pm local. Next eligible: tomorrow 8am.',
                    chip: null,
                  },
                  {
                    dot: 'bg-orange-400', typeColor: 'text-orange-400', type: 'Human Agent',
                    meta: 'Day 1 &middot; 5:04pm &middot; 8m 12s',
                    text: 'Settlement negotiated. 3-installment payment plan agreed. Promise to pay logged against account.',
                    chip: { label: '&#10003; Promise to pay recorded', cls: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' },
                  },
                  {
                    dot: 'bg-emerald-400', typeColor: 'text-slate-400', type: 'Payment',
                    meta: 'Day 8 &middot; 2:31pm',
                    text: 'Installment 1 received - $340. Next installment due in 30 days.',
                    chip: { label: '&#x1F4B3; Payment confirmed', cls: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' },
                  },
                ].map((e, i, arr) => (
                  <div key={i} className={`flex gap-5 py-5 ${i < arr.length - 1 ? 'border-b border-white/[0.05]' : ''}`}>
                    <div className="flex flex-col items-center w-4 flex-shrink-0 pt-1">
                      <div className={`w-3 h-3 rounded-full ${e.dot} flex-shrink-0`} />
                      {i < arr.length - 1 && <div className="w-px flex-1 mt-1 bg-white/[0.07]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        {e.type && <span className={`text-[10.5px] font-bold tracking-[0.07em] uppercase ${e.typeColor}`}>{e.type}</span>}
                        <span className="text-[11.5px] text-slate-500" dangerouslySetInnerHTML={{ __html: e.meta }} />
                      </div>
                      <p className="text-[16px] text-slate-300 leading-[1.7]">{e.text}</p>
                      {e.chip && (
                        <span
                          className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded mt-2 ${e.chip.cls}`}
                          dangerouslySetInnerHTML={{ __html: e.chip.label }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <DarkInlineCta
              icon="📋"
              title="See DROS track your portfolios live"
              desc="We'll model your placement types and client rules in a live account view."
              linkLabel="Book portfolio walkthrough"
              linkHref="/book-meeting"
            />
          </Reveal>
        </div>
      </section>

      {/* ── HOW DROS FITS ── */}
      <section className="bg-slate-900 py-16 md:py-[120px]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 lg:px-14">
          <Reveal>
            <div className="max-w-[720px] mx-auto text-center mb-14">
              <Eyebrow label="How DROS fits" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.12] text-white mb-4">
                Your strategy lives in DROS.<br />
                <em className="not-italic text-cyan-400">Your tools stay exactly where they are.</em>
              </h2>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-[560px] mx-auto mt-4">
                DROS connects to your predictive dialers, preview dialers, SMS providers, CRMs, and payment portals as execution channels. If you switch a tool later, your strategy stays intact.
              </p>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="grid grid-cols-1 md:grid-cols-2 rounded-[20px] overflow-hidden border border-white/[0.08]">
              {/* Bad */}
              <div className="bg-slate-800 px-6 sm:px-10 py-8 sm:py-11">
                <div className="text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-3.5">Without DROS</div>
                <h3 className="text-[22px] font-bold text-white leading-tight mb-6">Fragmented. Manual. Risky.</h3>
                <div className="flex flex-col gap-1">
                  {[
                    'Compliance rules split across every tool',
                    'Account history scattered, no unified view',
                    'Dialer switch means rebuilding everything',
                    'Client rules enforced by human memory',
                    'No single source of truth for auditors',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3.5 px-4 py-3.5 rounded-[9px] bg-white/[0.03] text-[16px] text-slate-300 font-medium leading-snug">
                      <span className="text-red-400 text-sm font-bold w-4 flex-shrink-0">&#x2715;</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              {/* Good */}
              <div className="bg-cyan-400/[0.07] border-t md:border-t-0 border-l-0 md:border-l border-cyan-400/20 px-6 sm:px-10 py-8 sm:py-11">
                <div className="text-[11px] font-bold tracking-widest uppercase text-cyan-400 mb-3.5">With DROS</div>
                <h3 className="text-[22px] font-bold text-white leading-tight mb-6">Centralized. Compliant. Portable.</h3>
                <div className="flex flex-col gap-1">
                  {[
                    'Rules enforced at OS level before any attempt',
                    'Full account history in one unified timeline',
                    'Swap dialers without touching strategy logic',
                    'Client rules encoded, enforced, auditable',
                    'Complete audit trail - always ready for review',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3.5 px-4 py-3.5 rounded-[9px] bg-cyan-400/[0.07] text-[16px] text-slate-300 font-medium leading-snug">
                      <span className="text-cyan-400 text-sm font-bold w-4 flex-shrink-0">&#x2713;</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── COMPLIANCE ── */}
      <section className="bg-slate-950 py-16 md:py-[120px]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 lg:px-14">
          <Reveal>
            <div className="max-w-[720px] mx-auto text-center mb-14">
              <Eyebrow label="Compliance infrastructure" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.12] text-white mb-4">
                Reg F, FDCPA, TCPA -<br />
                <em className="not-italic text-cyan-400">enforced before the first dial</em>
              </h2>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-[560px] mx-auto mt-4">
                Compliance violations don't start with bad intent - they start with a dialer setting someone forgot to update. DROS enforces rules at the OS layer, before any attempt is made, by anyone.
              </p>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: '⏰', label: 'Reg F', title: 'Call-hour and 7-in-7 controls',
                  body: 'Per-debt call counts, local-time windows, and cooldowns applied at OS level. No attempt is authorized until rules are satisfied - for AI or human agents.',
                  highlight: false,
                },
                {
                  icon: '🛡', label: 'FDCPA', title: 'Documentation and dispute workflows',
                  body: 'Validation notices, cease-comm requests, and complaint workflows built in. Accounts restrict automatically. Full audit trail on every interaction - ready for regulators or clients.',
                  highlight: false,
                },
                {
                  icon: '📵', label: 'TCPA', title: 'Consent management in real time',
                  body: 'DNC and consent states managed at the OS layer. Revocations honored in real time across SMS, voice, and email. No manual syncing, no lag.',
                  highlight: false,
                },
                {
                  icon: '🤝', label: 'Per-client rules', title: 'Client strategies, modeled and auditable',
                  body: "Each client's contact frequency, allowed channels, and wording limits encoded, enforced, and ready to present at the next RFP or audit.",
                  highlight: true,
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className={`relative rounded-[20px] px-7 py-8 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 ${
                    c.highlight
                      ? 'bg-cyan-400/[0.07] border border-cyan-400/20'
                      : 'bg-slate-800 border border-white/[0.09] hover:border-white/20'
                  }`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-px ${c.highlight ? 'bg-cyan-400/30' : 'bg-white/[0.15]'}`} />
                  <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center mb-5 text-[22px] ${c.highlight ? 'bg-cyan-400/15' : 'bg-cyan-400/10'}`}>
                    {c.icon}
                  </div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-cyan-400 mb-2">{c.label}</div>
                  <div className="text-[17px] font-bold text-white mb-2.5">{c.title}</div>
                  <div className="text-[15px] text-slate-400 leading-[1.75]">{c.body}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={240}>
            <DarkInlineCta
              icon="✓"
              title="Compliance-first agency? Let's talk."
              desc="We'll show exactly how DROS enforces your regulatory and client rules in the operating layer."
              linkLabel="Book a compliance review"
              linkHref="/book-meeting"
            />
          </Reveal>
        </div>
      </section>

      {/* ── PERSONA SELECTOR ── */}
      <section className="bg-[#f7f9fc] border-y border-slate-200/60 py-16 md:py-[120px]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 lg:px-14">
          <Reveal>
            <div className="max-w-[720px] mx-auto text-center mb-12">
              <Eyebrow label="Built for every role" light />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.12] text-slate-900 mb-4">
                Built for ops, compliance,<br />
                <em className="not-italic text-teal-600">and client services</em>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-[560px] mx-auto mt-4">
                Select your role to see exactly what changes - and what stops being your problem.
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            {/* Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-200 rounded-2xl overflow-hidden mb-5">
              {PERSONAS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActivePersona(i)}
                  className={`relative text-left px-5 sm:px-7 py-5 sm:py-7 border-b md:border-b-0 md:border-r border-slate-200 last:border-0 transition-all duration-200 ${
                    activePersona === i ? 'bg-slate-950' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  {activePersona === i && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-cyan-400" />}
                  <div className={`text-[15px] font-bold leading-snug transition-colors ${activePersona === i ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {p.tab}
                  </div>
                </button>
              ))}
            </div>
            {/* Card */}
            <div
              key={activePersona}
              className="bg-[#F3F8FC] border border-slate-200 rounded-2xl p-6 sm:p-12 shadow-[0_2px_16px_rgba(10,26,47,.06)] animate-[tpfade_.22s_ease]"
              style={{ animationName: 'tpfade' }}
            >
              <style>{`@keyframes tpfade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
              <div className="text-[11px] font-bold tracking-widest uppercase text-teal-600 mb-3">{PERSONAS[activePersona].role}</div>
              <div className="text-[28px] sm:text-[30px] font-bold text-slate-900 leading-tight mb-8">{PERSONAS[activePersona].h}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PERSONAS[activePersona].items.map((item, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl px-5 py-4 pl-11 relative text-[16px] text-slate-700 leading-[1.6] font-medium shadow-sm">
                    <span className="absolute left-4 top-4 text-teal-600 font-bold text-[13px]">&#8594;</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ARCHITECTURE ── */}
      <section className="bg-slate-950 py-16 md:py-[120px]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 lg:px-14">
          <Reveal>
            <div className="max-w-[720px] mx-auto text-center mb-14">
              <Eyebrow label="Works with your stack" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.12] text-white mb-4">
                Plug DROS in on top.<br />
                <em className="not-italic text-cyan-400">Keep the tools you already have.</em>
              </h2>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-[560px] mx-auto mt-4">
                DROS connects to your predictive dialers, preview dialers, SMS providers, CRMs, and payment portals as execution channels. If you switch a collections dialer later, your strategy stays intact - it lives in DROS, not inside any one tool.
              </p>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="bg-[rgba(4,12,28,.8)] border border-white/[0.07] rounded-[20px] p-4 sm:p-8 overflow-hidden">
              {/* Desktop SVG — hidden on mobile */}
              <svg className="hidden sm:block" width="100%" viewBox="0 0 980 500" role="img" xmlns="http://www.w3.org/2000/svg" aria-label="DROS connects client portfolios to dialers, AI agents, and human agents">
                <defs>
                  <radialGradient id="tp-hubglow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(6,182,212,.25)" />
                    <stop offset="100%" stopColor="rgba(6,182,212,0)" />
                  </radialGradient>
                  <linearGradient id="tp-hubfill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0a3a50" />
                    <stop offset="100%" stopColor="#0d5a6e" />
                  </linearGradient>
                </defs>
                <ellipse cx="490" cy="248" rx="150" ry="130" fill="url(#tp-hubglow)" opacity="0.8" />

                {/* ── LEFT NODES (client portfolios) ── */}
                {[
                  { y: 68, cy: 104, label: 'Client A', sub: 'Primary' },
                  { y: 212, cy: 248, label: 'Client B', sub: 'Secondary' },
                  { y: 356, cy: 392, label: 'Client C', sub: 'Early-out' },
                ].map((n, i) => (
                  <g key={i}>
                    <rect x="24" y={n.y} width="200" height="72" rx="12" fill="#0d1f2e" stroke="rgba(255,255,255,.1)" strokeWidth="1" />
                    <circle cx="64" cy={n.cy} r="21" fill="#0a3a40" stroke="rgba(6,182,212,.35)" strokeWidth="1.5" />
                    {/* Briefcase icon */}
                    <g transform={`translate(${64 - 8},${n.cy - 8})`}>
                      <rect x="0" y="4" width="16" height="11" rx="2" fill="none" stroke="#67e8f9" strokeWidth="1.4" />
                      <path d="M5 4V2.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V4" fill="none" stroke="#67e8f9" strokeWidth="1.4" />
                      <line x1="0" y1="9" x2="16" y2="9" stroke="#67e8f9" strokeWidth="1" strokeOpacity=".5" />
                    </g>
                    <text x="96" y={n.cy - 5} fill="#ffffff" fontSize="14" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">{n.label}</text>
                    <text x="96" y={n.cy + 11} fill="#64748b" fontSize="11.5" fontFamily="Saans,-apple-system,sans-serif">{n.sub}</text>
                  </g>
                ))}

                {/* ── CONNECTORS LEFT ── */}
                <polyline points="224,104 310,104 310,248 360,248" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity=".5" />
                <circle cx="310" cy="104" r="3.5" fill="#06b6d4" opacity=".7" />
                <circle cx="310" cy="248" r="3.5" fill="#06b6d4" opacity=".7" />
                <line x1="224" y1="248" x2="360" y2="248" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity=".5" />
                <circle cx="224" cy="248" r="3.5" fill="#06b6d4" opacity=".7" />
                <polyline points="224,392 310,392 310,248 360,248" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity=".5" />
                <circle cx="310" cy="392" r="3.5" fill="#06b6d4" opacity=".7" />
                <circle cx="360" cy="248" r="5" fill="#06b6d4" opacity=".9" />

                {/* ── HUB ── */}
                {/* Hub rect: x=360 y=128 width=260 height=240 → center=(490,248) */}
                <rect x="360" y="128" width="260" height="240" rx="20" fill="url(#tp-hubfill)" stroke="#06b6d4" strokeWidth="2" />
                <line x1="376" y1="129" x2="604" y2="129" stroke="rgba(255,255,255,.15)" strokeWidth="1" />
                {/* DROS wordmark */}
                <text x="490" y="188" textAnchor="middle" fill="#ffffff" fontSize="36" fontWeight="800" fontFamily="Saans,-apple-system,sans-serif" letterSpacing="-1">DROS</text>
                <text x="490" y="209" textAnchor="middle" fill="#67e8f9" fontSize="11" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif" letterSpacing="2.5">ENGAGEMENT OS</text>
                <line x1="385" y1="226" x2="595" y2="226" stroke="rgba(6,182,212,.18)" strokeWidth="1" />
                {/* Three evenly-spaced pills inside hub — total hub width 260, center x=490 */}
                {/* pill widths: Rules=62, Context=72, Queues=68 → total=202, gaps=2×14=28, total=230 — fits 260 */}
                {/* start x = 490 - 230/2 = 490 - 115 = 375 */}
                {/* Rules: x=375 w=62 cx=406 */}
                <rect x="376" y="240" width="62" height="24" rx="7" fill="rgba(6,182,212,.1)" stroke="rgba(6,182,212,.22)" strokeWidth="1" />
                {/* shield icon at 386,246 */}
                <g transform="translate(386,246)">
                  <path d="M4 0L8 1.4L8 4.5Q8 7.5 4 9Q0 7.5 0 4.5L0 1.4Z" fill="none" stroke="#67e8f9" strokeWidth="1.2" />
                </g>
                <text x="406" y="257" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily="Saans,-apple-system,sans-serif">Rules</text>
                {/* Context: x=452 w=72 cx=488 */}
                <rect x="452" y="240" width="72" height="24" rx="7" fill="rgba(6,182,212,.1)" stroke="rgba(6,182,212,.22)" strokeWidth="1" />
                {/* layers icon at 460,246 */}
                <g transform="translate(460,246)">
                  <path d="M0 3.5L5 1.5L10 3.5L5 5.5Z" fill="none" stroke="#67e8f9" strokeWidth="1.2" />
                  <path d="M0 6.5L5 4.5L10 6.5" fill="none" stroke="#67e8f9" strokeWidth="1.2" strokeOpacity=".6" />
                </g>
                <text x="484" y="257" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily="Saans,-apple-system,sans-serif">Context</text>
                {/* Queues: x=538 w=68 cx=572 */}
                <rect x="538" y="240" width="68" height="24" rx="7" fill="rgba(6,182,212,.1)" stroke="rgba(6,182,212,.22)" strokeWidth="1" />
                {/* list icon at 547,246 */}
                <g transform="translate(547,246)">
                  <line x1="0" y1="2" x2="9" y2="2" stroke="#67e8f9" strokeWidth="1.2" />
                  <line x1="0" y1="5" x2="9" y2="5" stroke="#67e8f9" strokeWidth="1.2" />
                  <line x1="0" y1="8" x2="6" y2="8" stroke="#67e8f9" strokeWidth="1.2" />
                </g>
                <text x="571" y="257" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily="Saans,-apple-system,sans-serif">Queues</text>

                {/* Compliance row inside hub */}
                <line x1="385" y1="280" x2="595" y2="280" stroke="rgba(6,182,212,.1)" strokeWidth="1" />
                <text x="418" y="302" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="Saans,-apple-system,sans-serif">Reg F</text>
                <text x="490" y="302" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="Saans,-apple-system,sans-serif">FDCPA</text>
                <text x="562" y="302" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="Saans,-apple-system,sans-serif">TCPA</text>
                {/* small dots */}
                <circle cx="418" cy="313" r="2.5" fill="#06b6d4" opacity=".4" />
                <circle cx="490" cy="313" r="2.5" fill="#06b6d4" opacity=".4" />
                <circle cx="562" cy="313" r="2.5" fill="#06b6d4" opacity=".4" />

                <circle cx="620" cy="248" r="5" fill="#06b6d4" opacity=".9" />

                {/* ── CONNECTORS RIGHT ── */}
                <polyline points="620,248 666,248 666,104 740,104" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity=".5" />
                <circle cx="666" cy="248" r="3.5" fill="#06b6d4" opacity=".7" />
                <circle cx="666" cy="104" r="3.5" fill="#06b6d4" opacity=".7" />
                <line x1="620" y1="248" x2="740" y2="248" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity=".5" />
                <polyline points="620,248 666,248 666,392 740,392" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity=".5" />
                <circle cx="666" cy="392" r="3.5" fill="#06b6d4" opacity=".7" />

                {/* ── RIGHT NODE 1: Dialers / SMS / Email ── */}
                <rect x="740" y="68" width="218" height="72" rx="12" fill="#160d2e" stroke="rgba(255,255,255,.1)" strokeWidth="1" />
                <circle cx="779" cy="104" r="21" fill="#1a0e3a" stroke="rgba(167,139,250,.4)" strokeWidth="1.5" />
                {/* Phone icon */}
                <g transform="translate(770,95)">
                  <path d="M2 1Q1 1 1 2L1 4Q1 8.5 6.5 14Q8.5 16 10.5 16L12.5 16Q13.5 16 13.5 15L13.5 13Q13.5 12 12.5 12L10.5 12Q9.5 12 9.5 11L9.5 10Q9.5 9 8.5 9L6.5 7Q6.5 7 6 6L6 4Q6 3 5 3L3 3Q2 3 2 2Z" fill="none" stroke="#a78bfa" strokeWidth="1.3" />
                </g>
                <text x="810" y="99" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">Dialers / SMS / Email</text>
                <text x="810" y="115" fill="#64748b" fontSize="11" fontFamily="Saans,-apple-system,sans-serif">Communication channels</text>

                {/* ── RIGHT NODE 2: AI agents ── */}
                <rect x="740" y="212" width="218" height="72" rx="12" fill="#1e1408" stroke="rgba(255,255,255,.1)" strokeWidth="1" />
                <circle cx="779" cy="248" r="21" fill="#2a1a08" stroke="rgba(251,146,60,.4)" strokeWidth="1.5" />
                {/* Bot icon */}
                <g transform="translate(769,238)">
                  <rect x="1" y="3" width="18" height="13" rx="3" fill="none" stroke="#fb923c" strokeWidth="1.3" />
                  <circle cx="7" cy="9.5" r="1.8" fill="#fb923c" />
                  <circle cx="13" cy="9.5" r="1.8" fill="#fb923c" />
                  <line x1="10" y1="0" x2="10" y2="3" stroke="#fb923c" strokeWidth="1.3" />
                  <circle cx="10" cy="0" r="1.2" fill="#fb923c" />
                  <line x1="1" y1="16" x2="0" y2="19" stroke="#fb923c" strokeWidth="1.3" />
                  <line x1="19" y1="16" x2="20" y2="19" stroke="#fb923c" strokeWidth="1.3" />
                </g>
                <text x="810" y="243" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">AI agents</text>
                <text x="810" y="259" fill="#64748b" fontSize="11" fontFamily="Saans,-apple-system,sans-serif">Intelligent automation</text>

                {/* ── RIGHT NODE 3: Human agents ── */}
                <rect x="740" y="356" width="218" height="72" rx="12" fill="#0a1428" stroke="rgba(255,255,255,.1)" strokeWidth="1" />
                <circle cx="779" cy="392" r="21" fill="#0e1e40" stroke="rgba(96,165,250,.4)" strokeWidth="1.5" />
                {/* Person icon */}
                <g transform="translate(770,382)">
                  <circle cx="9" cy="4" r="3.8" fill="none" stroke="#60a5fa" strokeWidth="1.3" />
                  <path d="M1 19Q1 13 9 13Q17 13 17 19" fill="none" stroke="#60a5fa" strokeWidth="1.3" />
                </g>
                <text x="810" y="387" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">Human agents</text>
                <text x="810" y="403" fill="#64748b" fontSize="11" fontFamily="Saans,-apple-system,sans-serif">Live engagement</text>

                {/* ── TAGLINE ── */}
                <line x1="180" y1="462" x2="360" y2="462" stroke="#06b6d4" strokeWidth="1" strokeOpacity=".35" />
                <text x="490" y="466" textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily="Saans,-apple-system,sans-serif">One system. Every touchpoint. Full account context.</text>
                <line x1="620" y1="462" x2="800" y2="462" stroke="#06b6d4" strokeWidth="1" strokeOpacity=".35" />
              </svg>

              {/* Mobile card list — shown only on mobile */}
              <div className="sm:hidden space-y-3">
                {/* Hub */}
                <div className="rounded-[14px] border-2 border-cyan-500/50 bg-gradient-to-br from-[#0a3a50] to-[#0d5a6e] px-5 py-4 text-center">
                  <div className="text-2xl font-extrabold text-white tracking-tight mb-0.5">DROS</div>
                  <div className="text-[10px] font-bold tracking-[2px] text-cyan-300 uppercase mb-3">Engagement OS</div>
                  <div className="flex justify-center gap-2">
                    {['Rules', 'Context', 'Queues'].map(p => (
                      <span key={p} className="text-[10px] font-semibold text-slate-300 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1 rounded-md">{p}</span>
                    ))}
                  </div>
                </div>
                {/* Clients */}
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 text-center">Client portfolios</div>
                {[
                  { label: 'Client A', sub: 'Primary placement' },
                  { label: 'Client B', sub: 'Secondary placement' },
                  { label: 'Client C', sub: 'Early-out' },
                ].map((n, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-[#0d1f2e] border border-white/[0.08] px-4 py-3">
                    <div className="w-9 h-9 rounded-full bg-[#0a3a40] border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><rect x="0" y="4" width="18" height="12" rx="2" stroke="#67e8f9" strokeWidth="1.5"/><path d="M6 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" stroke="#67e8f9" strokeWidth="1.5"/><line x1="0" y1="10" x2="18" y2="10" stroke="#67e8f9" strokeWidth="1" strokeOpacity=".5"/></svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{n.label}</div>
                      <div className="text-xs text-slate-500">{n.sub}</div>
                    </div>
                  </div>
                ))}
                {/* Channels */}
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 text-center pt-1">Channels &amp; agents</div>
                {[
                  { label: 'Dialers / SMS / Email', sub: 'Communication channels', bg: '#160d2e', border: 'rgba(167,139,250,.35)', dot: '#a78bfa',
                    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 1Q1 1 1 2L1 4Q1 9.5 7 15.5Q9 17.5 11 17.5L13 17.5Q14 17.5 14 16.5L14 14.5Q14 13.5 13 13.5L11 13.5Q10 13.5 10 12.5L10 11.5Q10 10.5 9 10.5L7 8.5Q6.5 8.5 6.5 7.5L6.5 5.5Q6.5 4.5 5.5 4.5L3.5 4.5Q2.5 4.5 2.5 3.5Z" stroke="#a78bfa" strokeWidth="1.3"/></svg> },
                  { label: 'AI agents', sub: 'Intelligent automation', bg: '#1e1408', border: 'rgba(251,146,60,.35)', dot: '#fb923c',
                    icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="1" y="4" width="18" height="12" rx="3" stroke="#fb923c" strokeWidth="1.3"/><circle cx="7" cy="10" r="2" fill="#fb923c"/><circle cx="13" cy="10" r="2" fill="#fb923c"/><line x1="10" y1="1" x2="10" y2="4" stroke="#fb923c" strokeWidth="1.3"/><circle cx="10" cy="0.5" r="1.2" fill="#fb923c"/><line x1="1" y1="16" x2="0" y2="20" stroke="#fb923c" strokeWidth="1.3"/><line x1="19" y1="16" x2="20" y2="20" stroke="#fb923c" strokeWidth="1.3"/></svg> },
                  { label: 'Human agents', sub: 'Live engagement', bg: '#0a1428', border: 'rgba(96,165,250,.35)', dot: '#60a5fa',
                    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="5" r="4" stroke="#60a5fa" strokeWidth="1.3"/><path d="M1 17Q1 11 9 11Q17 11 17 17" stroke="#60a5fa" strokeWidth="1.3"/></svg> },
                ].map((n, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border px-4 py-3" style={{ background: n.bg, borderColor: n.border }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: n.bg, border: `1.5px solid ${n.border}` }}>
                      {n.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{n.label}</div>
                      <div className="text-xs text-slate-500">{n.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <DarkInlineCta
              icon="🔧"
              title="Book a stack review for your agency"
              desc="Bring your dialer setup and client list. We'll map exactly how DROS fits on top."
              linkLabel="Book stack review"
              linkHref="/book-meeting"
            />
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-[#f7f9fc] border-y border-slate-200/60 py-16 md:py-[120px]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 lg:px-14">
          <Reveal>
            <div className="max-w-[720px] mx-auto text-center mb-12">
              <Eyebrow label="Common questions" light />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.12] text-slate-900 mb-4">
                Common questions about<br />
                <em className="not-italic text-teal-600">DROS for third-party collections</em>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="border border-slate-200 rounded-[20px] overflow-hidden">
              {FAQS.map((faq, i) => (
                <div key={i} className={i < FAQS.length - 1 ? 'border-b border-slate-100' : ''}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className={`w-full flex items-start justify-between gap-4 text-left transition-colors hover:bg-teal-600/[0.04] px-5 py-5 sm:px-7 ${openFaq === i ? 'text-teal-700' : 'text-slate-900'}`}
                  >
                    <span className="text-[15px] sm:text-[16px] font-semibold leading-snug">{faq.q}</span>
                    <span className={`text-slate-400 flex-shrink-0 mt-0.5 text-[16px] transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-teal-600' : ''}`}>&#9662;</span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: openFaq === i ? '400px' : '0' }}
                  >
                    <div className="px-5 pb-6 sm:px-7 text-[15px] sm:text-[16px] text-slate-600 leading-[1.85]">{faq.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative bg-slate-950 py-20 md:py-[140px] overflow-hidden border-t border-white/[0.06] text-center">
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,rgba(6,182,212,.08)_0%,rgba(6,182,212,.03)_40%,transparent_65%)] pointer-events-none" />
        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-6 lg:px-14">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-cyan-400 border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 rounded-full mb-7">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              Ready to see it
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[56px] font-bold leading-[1.12] text-white mb-5">
              See DROS on your<br />
              <em className="not-italic text-cyan-400">agency portfolios</em>
            </h2>
            <p className="text-lg text-slate-400 max-w-[480px] mx-auto leading-relaxed font-normal mb-12">
              Bring your placements, dialer setup, and client requirements. We'll show you how DROS fits on top of your current stack - with compliance rules and client strategies modeled in from day one.
            </p>
            <div className="flex gap-3.5 justify-center flex-wrap mb-8">
              <Link
                to="/book-meeting"
                onClick={() => trackCta('Book an agency walkthrough - final CTA')}
                className="inline-flex items-center gap-2 font-bold text-base px-7 py-4 rounded-xl transition-all hover:-translate-y-0.5" style={{ background: '#03D2FC', color: '#010C20' }}
              >
                Book an agency walkthrough <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-transparent text-slate-300 hover:text-white font-semibold text-base px-7 py-4 rounded-xl border border-white/[0.14] hover:border-white/30 transition-all"
              >
                Talk to us about AI agents
              </Link>
            </div>
            <div className="flex items-center justify-center gap-4 sm:gap-7 flex-wrap">
              {['No commitment required', 'Stack review included', 'Compliance-first approach', 'Live account modeling'].map((t, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[13px] text-slate-500">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full flex-shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
