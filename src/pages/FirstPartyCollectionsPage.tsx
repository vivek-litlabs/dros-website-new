export const route = '/collections/first-party';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChevronDown, TrendingUp, AlertTriangle, Layers } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { trackCta } from '../lib/analytics';

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
    color: 'emerald' as const,
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
    color: 'cyan' as const,
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
    color: 'orange' as const,
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

const lcTabColor: Record<string, string> = {
  emerald: 'after:bg-emerald-500',
  cyan: 'after:bg-cyan-500',
  orange: 'after:bg-orange-500',
};

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
        <a href="/features/context-aware-voice-ai-agents-for-debt-collection" className="underline underline-offset-2 hover:opacity-80 transition-opacity" style={{ color: 'inherit' }}>DROS's <strong>AI Voice Agents for Debt Collection</strong></a> handle high-volume early-stage outreach - payment reminders, balance confirmations, standard payment plan suggestions, and 24/7 inbound queries - using your approved scripts, brand intros, and disclosures. When a hardship signal, dispute, or escalation trigger is detected mid-call, the AI routes <strong>immediately to a human agent with the full account timeline attached</strong>, so agents walk in context-ready.
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

// ─── Component ───────────────────────────────────────────────────────────────
export default function FirstPartyCollectionsPage() {
  const [activePersona, setActivePersona] = useState(0);
  const [activeLifecycle, setActiveLifecycle] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function toggleFaq(i: number) {
    setOpenFaq(openFaq === i ? null : i);
  }

  const lc = LIFECYCLE[activeLifecycle];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
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
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is first-party collections software?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "First-party collections software helps creditors manage in-house debt recovery in their own name, typically for early-stage and pre-charge-off accounts. Unlike third-party platforms built for separate agencies, first-party software must enforce brand tone, CX policies, and compliance rules alongside standard collections workflows. DROS is built specifically for this: it orchestrates AI voice agents, human agents, and omnichannel outreach from a single platform, with Reg F compliance and brand rules enforced before any contact attempt."
              }
            },
            {
              "@type": "Question",
              "name": "How is first-party collections different from third-party collections?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "First-party outreach happens in the creditor's own name, typically early in the delinquency lifecycle, with emphasis on brand continuity, customer retention, and respectful communication. Third-party involves a separate brand at later or charged-off stages. DROS is purpose-built for first-party: it enforces brand tone, CX rules, and compliance at the operating layer - not just call-frequency caps."
              }
            },
            {
              "@type": "Question",
              "name": "How do AI voice agents work in first-party collections?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "DROS AI voice agents handle high-volume early-stage outreach - payment reminders, balance confirmations, standard payment plan suggestions, and 24/7 inbound queries - using your approved scripts, brand intros, and disclosures. When a hardship signal, dispute, or escalation trigger is detected mid-call, the AI routes immediately to a human agent with the full account timeline attached, so agents walk in context-ready."
              }
            },
            {
              "@type": "Question",
              "name": "Does DROS support Reg F compliance for in-house collections teams?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. DROS bakes Reg F, UDAAP, and configurable internal policies into the operating layer as default guardrails - including 7-in-7-style call frequency caps, quiet hour enforcement, and real-time consent management across all channels. Many first-party teams also voluntarily follow FDCPA-style best practices; these can be encoded directly into DROS workflows per product line or account type."
              }
            },
            {
              "@type": "Question",
              "name": "Does DROS replace our existing CRM, billing system, or dialer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No - and that's intentional. DROS connects to your existing tools as execution endpoints. Your current stack stays. Switching a dialer or adding a new channel is a configuration change, not a rebuild - because your engagement logic lives in DROS, not inside any single platform."
              }
            },
            {
              "@type": "Question",
              "name": "How does DROS enforce brand tone alongside compliance rules?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "DROS applies brand tone, approved scripts, and disclosure requirements at the same layer as compliance rules - before any AI or human agent makes a contact attempt. AI voice agents use your approved intros, language guidelines, and disclaimers. Human agents see the same script library."
              }
            },
            {
              "@type": "Question",
              "name": "How does DROS help with handoff to third-party agencies or debt buyers?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "When accounts reach pre-placement stage, DROS provides a rich account timeline, updated contact data, and documented outreach history. That context improves agency performance and debt-buyer pricing - and it's already there, produced naturally by running DROS throughout the collections lifecycle."
              }
            }
          ]
        })}</script>
      </Helmet>
      <Navbar />

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 pt-40 pb-0 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-slate-950 to-blue-950/20" />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '56px 56px', maskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%,black 0%,transparent 100%)' }} />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/12 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-xs font-bold tracking-[.12em] text-emerald-400 uppercase">First-party &amp; in-house collections teams</span>
          </div>
          <h1
            className="font-bold text-white mb-5 max-w-3xl mx-auto"
            style={{ fontSize: 'clamp(38px,5.5vw,66px)', lineHeight: 1.07, letterSpacing: '-.03em' }}
          >
            The engagement OS for{' '}
            <em className="not-italic text-cyan-400">first-party collections</em>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-[500px] mx-auto mb-10">
            DROS sits above your existing tools and orchestrates AI agents, human agents, and every channel - within your brand, compliance, and CX rules.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-24">
            <a
              href="https://dros.ai/book-meeting"
              onClick={() => trackCta('fp_hero_book_demo')}
              className="inline-flex items-center gap-2 font-bold text-base px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
              style={{ letterSpacing: '-.01em', background: '#03D2FC', color: '#010C20' }}
            >
              Book a demo <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 border-y border-white/6 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              'AI voice agents tuned for first-party',
              'Works with your existing CRM, dialer & billing systems',
              'Reg F, UDAAP, and consent - built into every workflow',
            ].map((item, i, arr) => (
              <div key={i} className="flex items-center gap-6">
                <div className="flex items-center gap-2.5 text-slate-400 text-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                  {item}
                </div>
                {i < arr.length - 1 && <div className="hidden sm:block w-px h-4 bg-white/8" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── §1 THE CHALLENGE (white) ─────────────────────────────────────── */}
      <section className="bg-white py-24 text-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="inline-flex items-center text-[10.5px] font-bold tracking-[.12em] uppercase px-4 py-1.5 rounded-full mb-5 text-teal-700 bg-teal-700/8 border border-teal-700/18">The first-party reality</span>
            <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.12, letterSpacing: '-.022em' }}>
              Early-stage is where you save<br />
              <em className="not-italic text-teal-700">the relationship - and the debt.</em>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed max-w-xl mx-auto" style={{ letterSpacing: '.005em' }}>
              Volume, complexity, and scrutiny have all spiked for in-house collections teams. More segments, more channels, more regulatory pressure - with tools that weren't built for this.
            </p>
          </div>

          {/* Pain cards */}
          <div className="grid md:grid-cols-3 rounded-2xl overflow-hidden shadow-[0_2px_20px_rgba(10,26,47,.08),0_0_0_1px_rgba(10,26,47,.12)]">
            {[
              {
                Icon: TrendingUp,
                iconBg: 'bg-orange-500/10',
                iconColor: 'text-orange-500',
                accent: 'from-orange-500',
                title: 'Volume vs headcount',
                desc: 'More accounts rolling into early delinquency with no proportional increase in budget or team size. Manual prioritisation means good accounts go untouched for days.',
              },
              {
                Icon: AlertTriangle,
                iconBg: 'bg-cyan-500/10',
                iconColor: 'text-cyan-500',
                accent: 'from-cyan-500',
                title: 'Brand and CX risk',
                desc: 'Collections must sound like your company, not a third-party. A tone-deaf call or off-script AI exchange impacts NPS, churn, and regulatory standing simultaneously.',
              },
              {
                Icon: Layers,
                iconBg: 'bg-teal-700/10',
                iconColor: 'text-teal-700',
                accent: 'from-teal-600',
                title: 'Fragmented customer view',
                desc: 'Context scattered across CRM, billing, dialers, and ticketing. Agents repeat themselves, miss signals, and can\'t see the full story before the call connects.',
              },
            ].map((card, i, arr) => (
              <div
                key={card.title}
                className="relative bg-white px-6 py-8 sm:px-9 sm:py-11 overflow-hidden"
                style={{ borderRight: i < arr.length - 1 ? '1px solid rgba(10,26,47,.12)' : undefined }}
              >
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.accent} to-transparent`} />
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${card.iconBg}`}>
                  <card.Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <div className="text-[17px] font-bold text-slate-900 mb-2.5" style={{ letterSpacing: '-.01em' }}>{card.title}</div>
                <p className="text-[15.5px] text-slate-600 leading-[1.72]" style={{ letterSpacing: '.005em' }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── §2 AI + HUMAN (white) ────────────────────────────────────────── */}
      <section className="bg-white pb-24 text-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="inline-flex items-center text-[10.5px] font-bold tracking-[.12em] uppercase px-4 py-1.5 rounded-full mb-5 text-teal-700 bg-teal-700/8 border border-teal-700/18">AI + human agents</span>
            <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.12, letterSpacing: '-.022em' }}>
              AI agents as a capacity multiplier,{' '}<em className="not-italic text-teal-700">not a replacement</em>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed max-w-xl mx-auto" style={{ letterSpacing: '.005em' }}>
              You define the rules. DROS executes them - routing each contact to the right agent, on the right channel, with the right script. AI handles volume. Humans handle judgment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(10,26,47,.10)]">
            {/* AI */}
            <div className="bg-[#f0fdf9] border border-cyan-500/22 p-6 sm:p-9 md:p-11">
              <span className="inline-block text-[10.5px] font-bold tracking-[.09em] uppercase px-3 py-1.5 rounded-full mb-4 text-teal-700 bg-cyan-500/14 border border-cyan-500/25">AI agents</span>
              <div className="text-xl font-bold text-slate-900 mb-5" style={{ lineHeight: 1.2, letterSpacing: '-.02em' }}>High-volume, on-brand, always-on</div>
              <ul className="space-y-0 divide-y divide-slate-900/7">
                {[
                  'Early reminders via SMS, email, and voice - in your tone',
                  'Balance confirmations and standard payment plans within policy',
                  'Portal links, contact detail updates, direct debit confirmations',
                  '24/7 inbound - balance, payment options, due date changes',
                  'Pre-charge-off explainers and last-chance outreach',
                ].map((item) => (
                  <li key={item} className="py-2.5 pl-5 text-[15.5px] text-slate-700 leading-[1.55] relative" style={{ letterSpacing: '.005em' }}>
                    <span className="absolute left-0 top-3 text-slate-400 text-xs font-bold">-</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 p-4 rounded-xl bg-cyan-500/10 text-teal-700 text-sm leading-relaxed font-medium">
                Scales to every account - from day 1 to pre-placement - without headcount.
              </div>
            </div>
            {/* Human */}
            <div className="bg-[#fff7ed] border border-orange-500/20 md:border-l-0 p-6 sm:p-9 md:p-11">
              <span className="inline-block text-[10.5px] font-bold tracking-[.09em] uppercase px-3 py-1.5 rounded-full mb-4 text-orange-800 bg-orange-500/12 border border-orange-500/25">Human agents</span>
              <div className="text-xl font-bold text-slate-900 mb-5" style={{ lineHeight: 1.2, letterSpacing: '-.02em' }}>High-stakes, high-judgment conversations</div>
              <ul className="space-y-0 divide-y divide-slate-900/7">
                {[
                  'Hardship - financial vulnerability, arrangements beyond policy',
                  'Disputes, complaints, regulatory or bureau mentions',
                  'Complex multi-account or high-balance negotiations',
                  'VIP and high-exposure accounts flagged for human-first',
                  'Keep-in-house vs outsource vs sell decisions',
                ].map((item) => (
                  <li key={item} className="py-2.5 pl-5 text-[15.5px] text-slate-700 leading-[1.55] relative" style={{ letterSpacing: '.005em' }}>
                    <span className="absolute left-0 top-3 text-slate-400 text-xs font-bold">-</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 p-4 rounded-xl bg-orange-500/10 text-orange-800 text-sm leading-relaxed font-medium">
                Every human pickup comes with full account context - no rebriefing needed.
              </div>
            </div>
          </div>
          <p className="text-center mt-5 text-[14px] text-slate-500 leading-relaxed">
            <strong className="text-slate-900">You set the routing rules.</strong> DROS enforces them - for every account, on every attempt.
          </p>
        </div>
      </section>

      {/* ─── §3 HOW DROS FITS - split + stack SVG (white) ─────────────────── */}
      <section className="bg-white pb-24 text-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 items-center gap-10 lg:gap-[72px]">
            {/* Copy */}
            <div className="w-full max-w-[460px]">
              <span className="inline-flex items-center text-[10.5px] font-bold tracking-[.12em] uppercase px-4 py-1.5 rounded-full mb-4 text-teal-700 bg-teal-700/8 border border-teal-700/18">How DROS fits</span>
              <h2 className="font-bold text-slate-900 mb-3.5 text-left" style={{ fontSize: 'clamp(24px,2.8vw,38px)', lineHeight: 1.12, letterSpacing: '-.022em' }}>
                Strategy lives in DROS.<br />
                <em className="not-italic text-teal-700">Your tools stay the same.</em>
              </h2>
              <p className="text-[16px] text-slate-600 leading-[1.78] mb-6" style={{ letterSpacing: '.005em' }}>
                DROS sits above your CRM and dialers as a single engagement and orchestration layer. Brand rules, Reg F compliance, and omnichannel routing all live in one place - not scattered across tools.
              </p>
              <ul className="divide-y divide-slate-900/7">
                {[
                  'Brand tone, scripts, and compliance enforced before any attempt is made',
                  'Every touch in one unified account timeline - AI, human, and every channel',
                  'Swap dialers or add channels; your logic stays in DROS, no rebuild needed',
                ].map((item) => (
                  <li key={item} className="py-2.5 pl-5 text-[15.5px] text-slate-700 leading-[1.6] relative" style={{ letterSpacing: '.005em' }}>
                    <span className="absolute left-0 top-3 text-teal-700 text-xs font-bold">→</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <a
                  href="https://dros.ai/book-meeting"
                  onClick={() => trackCta('fp_stack_walkthrough')}
                  className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
                  style={{ letterSpacing: '-.01em', background: 'linear-gradient(135deg, #DD39F9, #03D2FC)', color: 'white', WebkitTextFillColor: 'white' }}
                >
                  Book a stack walkthrough →
                </a>
              </div>
            </div>
            {/* Stack SVG */}
            <div className="rounded-[18px] p-7" style={{ background: '#f1f6fb', border: '1px solid rgba(10,26,47,.12)', boxShadow: '0 4px 20px rgba(10,26,47,.06)' }}>
              <svg viewBox="0 0 480 440" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }} aria-label="DROS sits as a layer above your existing tools">
                <rect x="16" y="16" width="448" height="72" rx="14" fill="#fff" stroke="#e2e8f0" strokeWidth="1"/>
                <text x="240" y="38" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif" letterSpacing=".1em">AGENTS &amp; CHANNELS</text>
                <rect x="36" y="46" width="120" height="30" rx="7" fill="rgba(16,185,129,.1)" stroke="rgba(16,185,129,.25)" strokeWidth="1"/>
                <text x="96" y="66" textAnchor="middle" fill="#059669" fontSize="12.5" fontWeight="600" fontFamily="Saans,-apple-system,sans-serif">AI Voice Agents</text>
                <rect x="170" y="46" width="120" height="30" rx="7" fill="rgba(139,92,246,.08)" stroke="rgba(139,92,246,.22)" strokeWidth="1"/>
                <text x="230" y="66" textAnchor="middle" fill="#7c3aed" fontSize="12.5" fontWeight="600" fontFamily="Saans,-apple-system,sans-serif">Human Agents</text>
                <rect x="304" y="46" width="144" height="30" rx="7" fill="rgba(6,182,212,.08)" stroke="rgba(6,182,212,.25)" strokeWidth="1"/>
                <text x="376" y="66" textAnchor="middle" fill="#0e7490" fontSize="12.5" fontWeight="600" fontFamily="Saans,-apple-system,sans-serif">SMS / Email / Portal</text>
                <line x1="120" y1="88" x2="120" y2="134" stroke="rgba(6,182,212,.4)" strokeWidth="1.5" strokeDasharray="5,4"/>
                <line x1="240" y1="88" x2="240" y2="134" stroke="rgba(6,182,212,.4)" strokeWidth="1.5" strokeDasharray="5,4"/>
                <line x1="376" y1="88" x2="376" y2="134" stroke="rgba(6,182,212,.4)" strokeWidth="1.5" strokeDasharray="5,4"/>
                <rect x="16" y="134" width="448" height="116" rx="14" fill="#0c4a6e" stroke="#06b6d4" strokeWidth="1.5"/>
                <rect x="17" y="135" width="446" height="1.5" rx="1" fill="rgba(255,255,255,.2)"/>
                <text x="240" y="158" textAnchor="middle" fill="#67e8f9" fontSize="11" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif" letterSpacing=".12em">DROS - ENGAGEMENT OS</text>
                <rect x="32" y="168" width="128" height="66" rx="9" fill="rgba(6,182,212,.15)" stroke="rgba(6,182,212,.35)" strokeWidth="1"/>
                <text x="96" y="205" textAnchor="middle" fill="#e0f2fe" fontSize="13" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">Brand &amp; Compliance</text>
                <rect x="176" y="168" width="128" height="66" rx="9" fill="rgba(6,182,212,.15)" stroke="rgba(6,182,212,.35)" strokeWidth="1"/>
                <text x="240" y="205" textAnchor="middle" fill="#e0f2fe" fontSize="13" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">AI + Human Routing</text>
                <rect x="320" y="168" width="128" height="66" rx="9" fill="rgba(6,182,212,.15)" stroke="rgba(6,182,212,.35)" strokeWidth="1"/>
                <text x="384" y="205" textAnchor="middle" fill="#e0f2fe" fontSize="13" fontWeight="700" fontFamily="Saans,-apple-system,sans-serif">Account Timeline</text>
                <line x1="75" y1="250" x2="75" y2="296" stroke="rgba(6,182,212,.35)" strokeWidth="1.5" strokeDasharray="5,4"/>
                <line x1="170" y1="250" x2="170" y2="296" stroke="rgba(6,182,212,.35)" strokeWidth="1.5" strokeDasharray="5,4"/>
                <line x1="258" y1="250" x2="258" y2="296" stroke="rgba(6,182,212,.35)" strokeWidth="1.5" strokeDasharray="5,4"/>
                <line x1="348" y1="250" x2="348" y2="296" stroke="rgba(6,182,212,.35)" strokeWidth="1.5" strokeDasharray="5,4"/>
                <line x1="424" y1="250" x2="424" y2="296" stroke="rgba(6,182,212,.35)" strokeWidth="1.5" strokeDasharray="5,4"/>
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
            </div>
          </div>
        </div>
      </section>

      {/* ─── §4 ACCOUNT TIMELINE - split (white) ─────────────────────────── */}
      <section className="bg-white pb-24 text-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 items-center gap-10 lg:gap-[72px]">
            {/* Timeline UI - first on mobile */}
            <div className="rounded-2xl overflow-hidden order-2 lg:order-1" style={{ background: '#fff', border: '1px solid rgba(10,26,47,.09)', boxShadow: '0 12px 40px rgba(10,26,47,.10)' }}>
              <div className="h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-500/20" />
              {/* Header */}
              <div className="px-6 py-4 flex items-start gap-3 justify-between" style={{ background: '#f3f8fc', borderBottom: '1px solid rgba(10,26,47,.07)' }}>
                <div>
                  <div className="text-[15px] font-bold text-slate-900">Account #29410 - Patel, S.</div>
                  <div className="text-[11.5px] text-slate-500 mt-0.5">Retail bank · 22 days past due · Early outreach</div>
                </div>
              </div>
              {/* Entries */}
              <div className="px-6 divide-y divide-slate-900/5">
                {[
                  {
                    dot: 'bg-emerald-500',
                    type: 'SMS · AI',
                    typeColor: 'text-emerald-700',
                    meta: 'Day 1 · 08:52am',
                    text: 'Payment reminder sent via approved brand template. Portal link included. No response in 48h - AI voice follow-up scheduled.',
                    chip: 'Brand script v4 · consent verified',
                    chipStyle: 'bg-emerald-500/8 text-emerald-700 border border-emerald-500/18',
                  },
                  {
                    dot: 'bg-cyan-500',
                    type: 'AI Voice',
                    typeColor: 'text-teal-700',
                    meta: 'Day 3 · 10:11am · 1m 48s',
                    text: 'RPC confirmed. 7-day extension requested - within policy threshold. DROS applied extension and logged promise-to-pay.',
                    chip: '↗ PTP recorded · no human review required',
                    chipStyle: 'bg-cyan-500/8 text-teal-700 border border-cyan-500/18',
                  },
                  {
                    dot: 'bg-orange-500',
                    type: 'AI Voice',
                    typeColor: 'text-orange-700',
                    meta: 'Day 10 · 02:34pm · 3m 07s',
                    text: 'PTP missed. Customer mentioned redundancy - hardship keyword detected. AI ceased collection script and transferred to human queue.',
                    chip: '⚠ Hardship flag · escalated · full context attached',
                    chipStyle: 'bg-orange-500/8 text-orange-700 border border-orange-500/18',
                  },
                  {
                    dot: 'bg-violet-500',
                    type: 'Human',
                    typeColor: 'text-violet-700',
                    meta: 'Day 10 · 02:41pm · Agent: T. Okoro',
                    text: 'Picked up with full context. Agreed 6-week reduced-payment arrangement under hardship policy.',
                    chip: '✓ Arrangement agreed · hardship policy applied',
                    chipStyle: 'bg-emerald-500/8 text-emerald-700 border border-emerald-500/18',
                    last: true,
                  },
                ].map((entry, ei) => (
                  <div key={ei} className="flex gap-3.5 py-4">
                    <div className="flex flex-col items-center w-3 flex-shrink-0 pt-1">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${entry.dot}`} />
                      {!entry.last && <div className="w-px flex-1 mt-1" style={{ background: 'rgba(10,26,47,.12)' }} />}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex gap-2 mb-1 flex-wrap text-[10.5px] text-slate-500">
                        <span className={`font-bold uppercase tracking-[.07em] text-[10px] ${entry.typeColor}`}>{entry.type}</span>
                        <span>{entry.meta}</span>
                      </div>
                      <p className="text-[14px] text-slate-700 leading-[1.65]" style={{ letterSpacing: '.005em' }}>{entry.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Copy */}
            <div className="w-full max-w-[460px] order-1 lg:order-2">
              <span className="inline-flex items-center text-[10.5px] font-bold tracking-[.12em] uppercase px-4 py-1.5 rounded-full mb-4 text-teal-700 bg-teal-700/8 border border-teal-700/18">Account context</span>
              <h2 className="font-bold text-slate-900 mb-3.5" style={{ fontSize: 'clamp(24px,2.8vw,38px)', lineHeight: 1.12, letterSpacing: '-.022em' }}>
                One timeline. Every AI agent and{' '}
                <em className="not-italic text-teal-700">human agent walks in ready</em>
              </h2>
              <p className="text-[16px] text-slate-600 leading-[1.78] mb-6" style={{ letterSpacing: '.005em' }}>
                Every AI voice call, human call, SMS, dispute, and payment lands in one account view. No rebriefing. No repeated questions. Context travels with the account.
              </p>
              <ul className="divide-y divide-slate-900/7">
                {[
                  'AI escalates to human with full context attached - no rebriefing',
                  'Promises-to-pay tracked automatically; missed PTPs trigger next step',
                  'Hardship keywords detected mid-call and acted on immediately',
                  'Every entry stamped with agent type, channel, script version, and outcome',
                ].map((item) => (
                  <li key={item} className="py-2.5 pl-5 text-[15.5px] text-slate-700 leading-[1.6] relative" style={{ letterSpacing: '.005em' }}>
                    <span className="absolute left-0 top-3 text-teal-700 text-xs font-bold">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PERSONAS (light) ────────────────────────────────────────────── */}
      <section className="py-24 text-slate-900" style={{ background: '#f1f6fb', borderTop: '1px solid rgba(10,26,47,.07)', borderBottom: '1px solid rgba(10,26,47,.07)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="inline-flex items-center text-[10.5px] font-bold tracking-[.12em] uppercase px-4 py-1.5 rounded-full mb-5 text-teal-700 bg-teal-700/8 border border-teal-700/18">Built for every role</span>
            <h2 className="font-bold text-slate-900 mb-3" style={{ fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.12, letterSpacing: '-.022em' }}>
              Built for every role on<br />
              <em className="not-italic text-teal-700">your in-house collections team</em>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed" style={{ letterSpacing: '.005em' }}>Select a role to see what changes for you.</p>
          </div>

          {/* Persona tabs */}
          <div className="flex flex-col sm:grid sm:grid-cols-3 rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid rgba(10,26,47,.12)', boxShadow: '0 1px 6px rgba(10,26,47,.07)' }}>
            {PERSONAS.map((p, i) => (
              <button
                key={i}
                onClick={() => setActivePersona(i)}
                className="relative bg-white px-5 py-5 sm:px-6 sm:py-7 text-left transition-all duration-150 overflow-hidden focus:outline-none min-h-[44px]"
                style={{
                  borderRight: i < PERSONAS.length - 1 ? undefined : undefined,
                  borderBottom: i < PERSONAS.length - 1 ? '1px solid rgba(10,26,47,.12)' : undefined,
                  background: activePersona === i ? '#020817' : undefined,
                }}
              >
                <div className={`text-[15px] sm:text-[17px] font-bold leading-[1.3] transition-colors duration-150 pr-6 ${activePersona === i ? 'text-white' : 'text-slate-900'}`} style={{ letterSpacing: '-.01em' }}>
                  {p.role}
                </div>
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xl font-light transition-all duration-200 ${activePersona === i ? 'text-cyan-400 rotate-90' : 'text-slate-300'}`}>›</span>
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors duration-150 ${activePersona === i ? 'bg-cyan-500' : 'bg-transparent'}`} />
              </button>
            ))}
          </div>

          {/* Persona card */}
          <div
            key={activePersona}
            className="bg-white rounded-2xl p-9 md:p-10"
            style={{ border: '1px solid rgba(10,26,47,.12)', boxShadow: '0 4px 20px rgba(10,26,47,.07)', animation: 'fadeSlideUp .22s ease' }}
          >
            <div className="text-[10.5px] font-bold tracking-[.11em] uppercase text-teal-700 mb-2">{PERSONAS[activePersona].role}</div>
            <div className="text-[26px] font-bold text-slate-900 mb-6" style={{ letterSpacing: '-.03em', lineHeight: 1.15 }}>{PERSONAS[activePersona].h}</div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {PERSONAS[activePersona].items.map((item, ii) => (
                <div
                  key={ii}
                  className="relative text-[15px] text-slate-700 leading-[1.6] pl-8 py-3.5 px-4 rounded-xl"
                  style={{ background: '#f3f8fc', border: '1px solid rgba(10,26,47,.09)', letterSpacing: '.005em' }}
                >
                  <span className="absolute left-3 top-4 text-teal-700 text-xs font-bold">→</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIFECYCLE (light) ───────────────────────────────────────────── */}
      <section className="py-24 text-slate-900" style={{ background: '#f1f6fb', borderBottom: '1px solid rgba(10,26,47,.07)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="inline-flex items-center text-[10.5px] font-bold tracking-[.12em] uppercase px-4 py-1.5 rounded-full mb-5 text-teal-700 bg-teal-700/8 border border-teal-700/18">Lifecycle coverage</span>
            <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.12, letterSpacing: '-.022em' }}>
              AI agents and human agents -<br />
              <em className="not-italic text-teal-700">every stage of the collections lifecycle</em>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed" style={{ letterSpacing: '.005em' }}>
              From early delinquency through pre-charge-off, DROS manages every stage of the first-party collections lifecycle - with different AI/human splits, scripts, and escalation rules per stage.
            </p>
          </div>

          {/* LC Tabs */}
          <div className="flex flex-col sm:grid sm:grid-cols-3 rounded-t-2xl overflow-hidden" style={{ border: '1px solid rgba(10,26,47,.12)', boxShadow: '0 1px 6px rgba(10,26,47,.07)' }}>
            {LIFECYCLE.map((stage, i) => {
              const accentMap: Record<string, string> = { emerald: 'bg-emerald-500', cyan: 'bg-cyan-500', orange: 'bg-orange-500' };
              return (
                <button
                  key={i}
                  onClick={() => setActiveLifecycle(i)}
                  className="relative px-5 py-4 sm:px-8 sm:py-6 text-left transition-all duration-150 focus:outline-none min-h-[44px]"
                  style={{
                    background: activeLifecycle === i ? '#020817' : '#fff',
                    borderBottom: i < LIFECYCLE.length - 1 ? '1px solid rgba(10,26,47,.12)' : undefined,
                  }}
                >
                  <div className={`text-[16px] sm:text-[18px] font-bold mb-0.5 transition-colors duration-150 ${activeLifecycle === i ? 'text-white' : 'text-slate-900'}`} style={{ letterSpacing: '-.02em' }}>
                    {stage.stage}
                  </div>
                  <div className="text-[12px] sm:text-[13px] text-slate-500 font-medium">{stage.days}</div>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors duration-150 ${activeLifecycle === i ? accentMap[stage.color] : 'bg-transparent'}`} />
                </button>
              );
            })}
          </div>

          {/* LC Panel */}
          <div
            key={activeLifecycle}
            className="bg-white rounded-b-2xl overflow-hidden"
            style={{ border: '1px solid rgba(10,26,47,.12)', borderTop: 'none', boxShadow: '0 4px 20px rgba(10,26,47,.07)', animation: 'fadeSlideUp .22s ease' }}
          >
            <div className="grid md:grid-cols-2" style={{ minHeight: '280px' }}>
              {/* AI side */}
              <div className="px-6 py-8 sm:px-10 sm:py-10 md:px-14 md:py-12" style={{ borderRight: '1px solid rgba(10,26,47,.07)' }}>
                <div className="text-[13px] font-bold tracking-[.1em] uppercase text-teal-700 mb-6" style={{ fontSize: '15px', letterSpacing: '.08em' }}>AI Handles</div>
                {lc.ai.map((item, i) => (
                  <div key={item} className="py-3 sm:py-4" style={{ borderBottom: i < lc.ai.length - 1 ? '1px solid rgba(10,26,47,.06)' : 'none' }}>
                    <div className="text-[15px] sm:text-[16px] text-slate-700 leading-[1.65]" style={{ letterSpacing: '.005em' }}>{item}</div>
                  </div>
                ))}
              </div>
              {/* Human side */}
              <div className="px-6 py-8 sm:px-10 sm:py-10 md:px-14 md:py-12" style={{ borderTop: '1px solid rgba(10,26,47,.07)' }}>
                <div className="text-[13px] font-bold tracking-[.1em] uppercase text-orange-700 mb-6" style={{ fontSize: '15px', letterSpacing: '.08em' }}>Humans Handle</div>
                {lc.hu.map((item, i) => (
                  <div key={item} className="py-3 sm:py-4" style={{ borderBottom: i < lc.hu.length - 1 ? '1px solid rgba(10,26,47,.06)' : 'none' }}>
                    <div className="text-[15px] sm:text-[16px] text-slate-700 leading-[1.65]" style={{ letterSpacing: '.005em' }}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* DROS footer row */}
            <div className="px-6 py-5 sm:px-10 md:px-14 flex items-start gap-4" style={{ borderTop: '1px solid rgba(10,26,47,.08)', background: 'rgba(10,26,47,.02)' }}>
              <span className="flex-shrink-0 text-[10.5px] font-bold tracking-[.1em] uppercase text-slate-500 mt-0.5">DROS</span>
              <div className="text-[14px] text-slate-500 leading-[1.6]" style={{ letterSpacing: '.005em' }}>{lc.os}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── §5 COMPLIANCE (dark) ─────────────────────────────────────────── */}
      <section className="bg-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="inline-flex items-center text-[10.5px] font-bold tracking-[.12em] uppercase px-4 py-1.5 rounded-full mb-5 text-cyan-400 bg-cyan-500/12 border border-cyan-500/20">Compliance &amp; brand safety</span>
            <h2 className="font-bold text-white mb-4" style={{ fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.12, letterSpacing: '-.022em' }}>
              Reg F, brand rules, and consent -<br />
              <em className="not-italic text-cyan-400">enforced before any contact is made</em>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto" style={{ letterSpacing: '.005em' }}>
              Whether it's Reg F call caps, brand tone, or consent management - DROS applies every rule before an AI voice agent or human is authorized to make contact.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5">
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
            ].map((card, i) => (
              <div
                key={i}
                className="relative rounded-2xl p-8 overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: card.highlight ? 'rgba(6,182,212,.09)' : 'rgb(30,41,59)',
                  border: card.highlight ? '1px solid rgba(6,182,212,.28)' : '1px solid rgba(255,255,255,.09)',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: card.highlight ? 'rgba(6,182,212,.4)' : 'rgba(255,255,255,.14)' }} />
                <div className="text-[18.5px] font-bold text-white mb-2.5" style={{ lineHeight: 1.25, letterSpacing: '-.02em' }}>{card.title}</div>
                <p className="text-[15.5px] text-slate-300 leading-[1.75]" style={{ letterSpacing: '.005em' }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── §6 INTEGRATIONS (white, hub & spoke SVG) ───────────────────── */}
      <section className="bg-white py-24 text-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="inline-flex items-center text-[10.5px] font-bold tracking-[.12em] uppercase px-4 py-1.5 rounded-full mb-5 text-teal-700 bg-teal-700/8 border border-teal-700/18">Integrations</span>
            <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.12, letterSpacing: '-.022em' }}>
              Your existing stack stays.<br />
              <em className="not-italic text-teal-700">DROS sits above it.</em>
            </h2>
          </div>

          <div className="rounded-[20px] p-4 sm:p-8 md:p-10 overflow-x-auto" style={{ background: '#f3f8fc', border: '1px solid rgba(10,26,47,.09)', boxShadow: '0 4px 20px rgba(10,26,47,.06)' }}>
            <svg viewBox="0 0 900 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '860px', display: 'block', margin: '0 auto' }} aria-label="DROS integration hub and spoke diagram">
              <line x1="276" y1="200" x2="384" y2="200" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,4"/>
              <line x1="276" y1="100" x2="384" y2="182" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,4"/>
              <line x1="276" y1="300" x2="384" y2="218" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,4"/>
              <line x1="624" y1="200" x2="516" y2="200" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="5,4" opacity=".7"/>
              <line x1="624" y1="100" x2="516" y2="182" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="5,4" opacity=".7"/>
              <line x1="624" y1="300" x2="516" y2="218" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="5,4" opacity=".7"/>
              <rect x="384" y="156" width="132" height="88" rx="16" fill="#0c4a6e" stroke="#06b6d4" strokeWidth="2"/>
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
              <text x="739" y="378" textAnchor="middle" fill="#06b6d4" fontSize="10.5" fontFamily="Saans,-apple-system,sans-serif" fontWeight="600" letterSpacing=".07em">EXECUTION CHANNELS</text>
            </svg>
          </div>

          {/* Inline CTA */}
          <div className="mt-8 rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5" style={{ background: 'linear-gradient(135deg,rgba(6,182,212,.04),rgba(16,185,129,.03))', border: '1px solid rgba(6,182,212,.15)' }}>
            <div className="flex-1">
              <div className="text-[16px] font-bold text-slate-900 mb-1" style={{ letterSpacing: '-.01em' }}>Adding a channel? Swapping a dialer? It's a config change.</div>
              <div className="text-[15px] text-slate-600 leading-[1.55]">Engagement logic lives in DROS - so it travels with you when your tooling evolves. Your investment in rules and strategy doesn't depreciate.</div>
            </div>
            <a
              href="https://dros.ai/book-meeting"
              onClick={() => trackCta('fp_stack_talk')}
              className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 flex-shrink-0 min-h-[44px]"
              style={{ letterSpacing: '-.01em', background: 'linear-gradient(135deg, #DD39F9, #03D2FC)', color: 'white', WebkitTextFillColor: 'white' }}
            >
              Talk to us about your stack →
            </a>
          </div>
        </div>
      </section>

      {/* ─── §7 OUTCOMES (light) ─────────────────────────────────────────── */}
      <section className="py-24 text-slate-900" style={{ background: '#f1f6fb', borderTop: '1px solid rgba(10,26,47,.07)', borderBottom: '1px solid rgba(10,26,47,.07)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="inline-flex items-center text-[10.5px] font-bold tracking-[.12em] uppercase px-4 py-1.5 rounded-full mb-5 text-teal-700 bg-teal-700/8 border border-teal-700/18">Outcomes</span>
            <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.12, letterSpacing: '-.022em' }}>
              What in-house collections teams see<br />
              <em className="not-italic text-teal-700">after running DROS</em>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed max-w-xl mx-auto" style={{ letterSpacing: '.005em' }}>
              Recovery, coverage, brand, and handoff quality - all moving in the right direction across the first-party collections lifecycle.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5">
            {[
              {
                stat: '↑',
                sup: '%',
                title: 'Higher recoveries on fresher debt',
                desc: 'AI-supported first-party outreach catches issues before charge-off - when the relationship and the money are still salvageable.',
              },
              {
                stat: '3-5',
                sup: '×',
                title: 'More coverage without hiring',
                desc: 'AI handles tier-1 volume so human agents focus on high-leverage conversations: hardship, high balances, complex cases.',
              },
              {
                stat: '↓',
                sup: '%',
                title: 'Fewer complaints. Stronger brand.',
                desc: 'Consistent scripts, gentler channels, and full account context on every call reduce friction and reputational risk.',
              },
              {
                stat: '✓',
                sup: '',
                title: 'Cleaner handoff when you outsource',
                desc: 'At placement or sale, accounts carry a rich timeline and updated contact data. Downstream agencies and buyers perform better.',
              },
            ].map((oc, i) => (
              <div key={i} className="bg-white rounded-2xl p-8" style={{ border: '1px solid rgba(10,26,47,.09)', boxShadow: '0 2px 8px rgba(10,26,47,.05)' }}>
                <div className="text-[44px] font-bold text-teal-700 leading-none mb-2" style={{ letterSpacing: '-.04em' }}>
                  {oc.stat}{oc.sup && <sup className="text-[19px] font-semibold align-super">{oc.sup}</sup>}
                </div>
                <div className="text-[17px] font-bold text-slate-900 mb-2" style={{ letterSpacing: '-.01em' }}>{oc.title}</div>
                <p className="text-[15px] text-slate-600 leading-[1.72]" style={{ letterSpacing: '.005em' }}>{oc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── §8 ROLLOUT (light) ──────────────────────────────────────────── */}
      <section className="py-24 text-slate-900" style={{ background: '#f1f6fb' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="inline-flex items-center text-[10.5px] font-bold tracking-[.12em] uppercase px-4 py-1.5 rounded-full mb-5 text-teal-700 bg-teal-700/8 border border-teal-700/18">How rollout works</span>
            <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.12, letterSpacing: '-.022em' }}>
              From your current workflows<br />
              <em className="not-italic text-teal-700">to a live first-party platform - three steps</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 rounded-[18px] overflow-hidden bg-white mb-8" style={{ border: '1px solid rgba(10,26,47,.09)', boxShadow: '0 4px 20px rgba(10,26,47,.07)' }}>
            {[
              {
                n: '01',
                title: 'Map your current first-party flows',
                desc: "Bring your portfolios, systems, policies, and scripts. Together we map your early, mid, and pre-placement workflows - and identify coverage gaps and brand risk.",
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
            ].map((step, i, arr) => (
              <div key={step.n} className="px-6 py-8 sm:px-8 sm:py-10" style={{ borderRight: i < arr.length - 1 ? '1px solid rgba(10,26,47,.09)' : undefined }}>
                <div className="text-[52px] font-bold leading-none mb-3.5" style={{ color: '#dde5ef', letterSpacing: '-.04em' }}>{step.n}</div>
                <div className="text-[18px] font-bold text-slate-900 mb-2.5" style={{ letterSpacing: '-.02em', lineHeight: 1.25 }}>{step.title}</div>
                <p className="text-[15px] text-slate-600 leading-[1.72]" style={{ letterSpacing: '.005em' }}>{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Inline CTA */}
          <div className="rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5" style={{ background: 'linear-gradient(135deg,rgba(6,182,212,.04),rgba(16,185,129,.03))', border: '1px solid rgba(6,182,212,.15)' }}>
            <div className="flex-1">
              <div className="text-[16px] font-bold text-slate-900 mb-1" style={{ letterSpacing: '-.01em' }}>Map DROS to your first-party flows</div>
              <div className="text-[15px] text-slate-600 leading-[1.55]">Bring your portfolios, systems, and current policies. We'll show you how DROS sits above your existing stack - brand rules and compliance modeled in from day one.</div>
            </div>
            <a
              href="https://dros.ai/book-meeting"
              onClick={() => trackCta('fp_rollout_walkthrough')}
              className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 flex-shrink-0 min-h-[44px]"
              style={{ letterSpacing: '-.01em', background: 'linear-gradient(135deg, #DD39F9, #03D2FC)', color: 'white', WebkitTextFillColor: 'white' }}
            >
              Book a first-party walkthrough →
            </a>
          </div>
        </div>
      </section>

      {/* ─── FAQ (white) ─────────────────────────────────────────────────── */}
      <section className="bg-white py-24 text-slate-900">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center text-[10.5px] font-bold tracking-[.12em] uppercase px-4 py-1.5 rounded-full mb-5 text-teal-700 bg-teal-700/8 border border-teal-700/18">Common questions</span>
            <h2 className="font-bold text-slate-900" style={{ fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.12, letterSpacing: '-.022em' }}>
              Common questions about<br />
              <em className="not-italic text-teal-700">first-party collections and DROS</em>
            </h2>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(10,26,47,.09)', boxShadow: '0 2px 8px rgba(10,26,47,.05)' }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{ borderBottom: i < FAQ.length - 1 ? '1px solid rgba(10,26,47,.07)' : undefined }}>
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full bg-transparent border-none px-6 py-5 text-left flex justify-between items-start gap-4 cursor-pointer hover:bg-cyan-500/4 transition-colors min-h-[44px] focus:outline-none"
                  style={{ fontFamily: 'inherit' }}
                >
                  <span className={`text-[15.5px] font-semibold leading-[1.45] ${openFaq === i ? 'text-teal-700' : 'text-slate-900'}`}>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-teal-700' : 'text-slate-400'}`}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: openFaq === i ? '400px' : '0' }}
                >
                  <div className="px-6 pb-6 text-[15.5px] text-slate-600 leading-[1.85]">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING TEASER ──────────────────────────────────────────────── */}
      <section className="bg-white py-18 pb-24 text-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            className="relative rounded-[20px] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12 overflow-hidden px-6 py-10 sm:px-10 sm:py-12 md:px-16 md:py-14"
            style={{ background: 'linear-gradient(135deg,#0c4a6e,#0f172a)', border: '1px solid rgba(6,182,212,.2)' }}
          >
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(6,182,212,.1),transparent 70%)', transform: 'translate(60px,-60px)' }} />
            <div className="flex-1 relative">
              <div className="text-[32px] font-bold text-white mb-3" style={{ letterSpacing: '-.03em', lineHeight: 1.1 }}>Simple pricing.<br />No surprises.</div>
              <div className="text-[16px] text-slate-400 leading-[1.65] max-w-md">Built for first-party teams of all sizes - from a single portfolio to enterprise-scale operations.</div>
            </div>
            <div className="flex-shrink-0 text-center relative">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 font-bold text-[15px] px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ letterSpacing: '-.01em', background: '#03D2FC', color: '#010C20' }}
              >
                See pricing →
              </Link>
              <div className="mt-3 text-[13px] text-slate-500">No commitment required</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="bg-slate-950 py-28 relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px] pointer-events-none" style={{ background: 'radial-gradient(ellipse,rgba(16,185,129,.08) 0%,rgba(6,182,212,.05) 40%,transparent 60%)' }} />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-flex items-center text-[10.5px] font-bold tracking-[.12em] uppercase px-4 py-1.5 rounded-full mb-6 text-cyan-400 bg-cyan-500/12 border border-cyan-500/20">Ready to see it</span>
          <h2
            className="font-bold text-white mb-4"
            style={{ fontSize: 'clamp(34px,4.8vw,60px)', lineHeight: 1.12, letterSpacing: '-.022em' }}
          >
            See DROS on your<br />
            <em className="not-italic text-cyan-400">first-party collections flows</em>
          </h2>
          <p className="text-lg text-slate-400 max-w-[500px] mx-auto mb-10 leading-relaxed">
            Bring your portfolios and existing tools. We'll show you exactly how it fits.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <a
              href="https://dros.ai/book-meeting"
              onClick={() => trackCta('fp_final_cta_walkthrough')}
              className="inline-flex items-center gap-2 font-bold text-base px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
              style={{ letterSpacing: '-.01em', background: '#03D2FC', color: '#010C20' }}
            >
              Book a first-party walkthrough <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://dros.ai/book-meeting"
              onClick={() => trackCta('fp_final_cta_ai_agents')}
              className="inline-flex items-center gap-2 border text-slate-300 hover:text-white hover:border-slate-500 font-medium text-base px-7 py-3.5 rounded-xl transition-all hover:bg-slate-900/60"
              style={{ borderColor: 'rgb(51,65,85)', letterSpacing: '-.01em' }}
            >
              Talk to us about AI agents
            </a>
          </div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              'No commitment required',
              'Stack review included',
              'Brand + compliance rules modeled live',
              'Works with your existing tools',
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-[13px] text-slate-500">
                <span className="w-1 h-1 rounded-full bg-cyan-500 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

