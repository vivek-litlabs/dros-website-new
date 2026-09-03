export const route = '/features/context-aware-voice-ai-agents-for-debt-collection';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import VideoModal from '../VideoModal';
import { trackCta } from '../../lib/analytics';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('va-in'); obs.disconnect(); } },
      { threshold: 0.05, rootMargin: '0px 0px -32px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`va-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function CheckCircle({ color }: { color: 'teal' | 'navy' }) {
  const stroke = color === 'teal' ? '#03D2FC' : '#1A237E';
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="10" cy="10" r="9" stroke={stroke} strokeWidth="1.5" />
      <path d="M6.5 10l2.5 2.5 4.5-5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FAQ_SCHEMA_ANSWERS = [
  'Every DROS AI voice agent runs against an approved script with modular blocks. Prohibited phrases are enforced at the platform layer - if a phrase is not in the approved set, it is never spoken. A confidence threshold also triggers automatic escalation to a human agent before the conversation can drift off-script.',
  'DROS AI voice agents support modular disclosure blocks including Mini-Miranda (FDCPA §807), call recording consent, and jurisdiction-specific statements. These are inserted at the correct point in the call flow and cannot be skipped by the agent or overridden at runtime.',
  "The agent escalates immediately when: a dispute or hardship is mentioned, the debtor explicitly requests a human agent, or the agent's confidence score drops below the configured threshold. The human collector receives a full call summary and key flags before they speak. Any promise to pay or commitment made during the AI call is already logged before the handover.",
  'Yes. DROS supports first-party in-house collection teams, third-party collection agencies, and debt buyers on the same platform. Compliance rule sets, scripts, and guardrails are configurable per portfolio or program.',
  "AI voice is part of DROS's omnichannel collections layer. The AI voice agent sees prior SMS and email engagement - including link clicks and page visits - before every call. Outcomes from AI voice calls automatically trigger follow-up steps across other channels.",
  "Yes. DROS includes a test call sandbox where you can preview the agent's voice, listen to a simulated call with your actual script and account variables, and make adjustments before enabling the agent in production.",
];

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: 'How do you stop the AI voice agent from going off-script in debt collection calls?',
    a: 'Every DROS AI voice agent runs against an approved script with modular blocks. Prohibited phrases are enforced at the platform layer - if a phrase is not in the approved set, it is never spoken. A confidence threshold also triggers automatic escalation to a human agent before the conversation can drift off-script.',
  },
  {
    q: 'What FDCPA disclosures can the AI voice agent deliver?',
    a: 'DROS AI voice agents support modular disclosure blocks including Mini-Miranda (FDCPA §807), call recording consent, and jurisdiction-specific statements. These are inserted at the correct point in the call flow and cannot be skipped by the agent or overridden at runtime.',
  },
  {
    q: 'When does the AI voice agent hand off to a human debt collector?',
    a: 'The agent escalates immediately when: a dispute or hardship is mentioned, the debtor explicitly requests a human agent, or the agent\'s confidence score drops below the configured threshold. The human collector receives a full call summary and key flags before they speak. Any promise to pay or commitment made during the AI call is already logged before the handover.',
  },
  {
    q: 'Can DROS AI voice agents work in first-party and third-party collections programs?',
    a: <>Yes. DROS supports <Link to="/collections/first-party" className="underline underline-offset-2 hover:opacity-80 transition-opacity" style={{ color: '#1A237E' }}>first-party in-house collection teams</Link>, <Link to="/collections/third-party" className="underline underline-offset-2 hover:opacity-80 transition-opacity" style={{ color: '#1A237E' }}>third-party collection agencies</Link>, and <Link to="/collections/debt-buyer" className="underline underline-offset-2 hover:opacity-80 transition-opacity" style={{ color: '#1A237E' }}>debt buyers</Link> on the same platform. Compliance rule sets, scripts, and guardrails are configurable per portfolio or program.</>,
  },
  {
    q: 'How do AI voice agents work alongside SMS and email in a collections strategy?',
    a: "AI voice is part of DROS's omnichannel collections layer. The AI voice agent sees prior SMS and email engagement - including link clicks and page visits - before every call. Outcomes from AI voice calls automatically trigger follow-up steps across other channels.",
  },
  {
    q: 'Can we test the AI voice agent before going live in production?',
    a: 'Yes. DROS includes a test call sandbox where you can preview the agent\'s voice, listen to a simulated call with your actual script and account variables, and make adjustments before enabling the agent in production.',
  },
];

const gradStyle = {
  background: 'linear-gradient(135deg, #DD39F9, #03D2FC)',
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent' as const,
  backgroundClip: 'text' as const,
};
const gradBg = { background: 'linear-gradient(135deg, #DD39F9, #03D2FC)' };

export default function VoiceAgentsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <style>{`
        .va-reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .va-in { opacity: 1; transform: none; }
        .va-pill-d { display: inline-block; font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; border-radius: 40px; padding: 7px 18px; margin-bottom: 24px; color: rgba(255,255,255,0.88); border: 1.5px solid rgba(255,255,255,0.3); }
        .va-pill-l { display: inline-block; font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; border-radius: 40px; padding: 7px 18px; margin-bottom: 24px; color: #0A1225; border: 1.5px solid rgba(10,18,37,0.28); }
      `}</style>

      <Helmet>
        <title>AI Voice Agents for Debt Collection &amp; Recovery — DROS</title>
        <meta name="description" content="Context-aware AI voice agents for debt collection. Every call starts with full account history, FDCPA compliance guardrails, and automatic human handoff. Inbound and outbound." />
        <link rel="canonical" href="https://dros.ai/features/context-aware-voice-ai-agents-for-debt-collection" />
        <meta property="og:title" content="AI Voice Agents for Debt Collection &amp; Recovery — DROS" />
        <meta property="og:description" content="Every call starts with account history, compliance guardrails, and human handoff logic built in. Inbound and outbound AI voice agents for collections." />
        <meta property="og:url" content="https://dros.ai/features/context-aware-voice-ai-agents-for-debt-collection" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "DROS AI Voice Agents",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "Context-aware AI voice agents for debt collection and recovery. DROS AI voice agents load full account history, compliance rules, and call objectives before every call - inbound and outbound - with automatic escalation to human agents.",
          "url": "https://dros.ai/features/context-aware-voice-ai-agents-for-debt-collection",
          "offers": { "@type": "Offer", "url": "https://dros.ai/book-meeting" },
          "provider": { "@type": "Organization", "name": "DROS", "url": "https://dros.ai" },
          "featureList": [
            "Context-aware AI voice agents for debt collection",
            "Inbound and outbound AI collections calls",
            "FDCPA and Reg F compliant call guardrails",
            "Automatic human agent handoff",
            "Broken PTP follow-up automation",
            "Real-time account context during calls",
            "Configurable agent scripts and objectives",
            "Multi-language voice support"
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQS.map((f, i) => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": FAQ_SCHEMA_ANSWERS[i] }
          }))
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "DROS", "item": "https://dros.ai" },
            { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://dros.ai/features" },
            { "@type": "ListItem", "position": 3, "name": "AI Voice Agents", "item": "https://dros.ai/features/context-aware-voice-ai-agents-for-debt-collection" }
          ]
        })}</script>
      </Helmet>

      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden text-center pt-28 pb-20 md:pt-32 md:pb-28" style={{ background: '#010C20' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 900px 700px at 50% -10%, rgba(221,57,249,0.10) 0%, transparent 65%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 700px 500px at 50% 120%, rgba(3,210,252,0.07) 0%, transparent 65%)' }} />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-6">
          <Reveal>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[74px] font-semibold leading-[1.12] tracking-tight mb-5 sm:mb-6 text-white">
              AI voice agents for<br />
              <span style={gradStyle}>debt collection &amp; recovery</span>
            </h1>
            <p className="text-lg sm:text-xl font-light leading-relaxed mb-8 sm:mb-12 max-w-[600px] mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Every call starts with full account history, compliance rules, and next-step logic already loaded - AI voice agents for collections built for speed, accuracy, and regulated industries.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-11">
              <Link
                to="/book-meeting"
                onClick={() => trackCta('voice_agents_hero_demo')}
                className="inline-flex items-center justify-center gap-2 font-semibold text-base px-7 sm:px-9 py-4 rounded-xl transition-all hover:-translate-y-0.5 w-full sm:w-auto"
                style={{ background: '#03D2FC', color: '#010C20' }}
              >
                Book a demo <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => { trackCta('voice_agents_hero_see_how'); setVideoOpen(true); }}
                className="inline-flex items-center justify-center gap-2.5 font-semibold text-base px-7 sm:px-9 py-4 rounded-xl transition-all w-full sm:w-auto"
                style={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
              >
                See how it works
              </button>
            </div>
            <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Built by the team behind{' '}
              <a href="https://vodex.ai" target="_blank" rel="noopener noreferrer">
                <img loading="lazy" decoding="async" src="/base_logo_transparent_background.png" alt="Vodex" className="inline h-10 sm:h-12 opacity-90 hover:opacity-100 transition-opacity ml-1 align-middle" />
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div style={{ background: '#010C20', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-6 py-3 sm:py-0 sm:h-14 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
          {[
            'Full account context before every call',
            'Inbound and outbound agents',
            'Script, rule, and compliance guardrails built in',
          ].map((item, i) => (
            <div key={item} className="flex items-center w-full sm:w-auto">
              <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-9 text-sm font-light w-full sm:w-auto justify-center" style={{ color: 'rgba(255,255,255,0.75)' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#03D2FC' }} />
                {item}
              </div>
              {i < 2 && <div className="hidden sm:block w-px h-5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* ════ S1: CONTEXT - light ════ */}
      <section id="context" className="py-16 sm:py-20 md:py-28 bg-white">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Copy */}
            <Reveal>
              <span className="va-pill-l">Context</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug tracking-tight mb-5" style={{ color: '#0A1225' }}>
                Every AI collections call starts with{' '}
                <span style={gradStyle}>full account context</span>
              </h2>
              <p className="text-base font-light leading-relaxed mb-8" style={{ color: 'rgba(10,18,37,0.58)' }}>
                DROS agents don't dial cold. They load the full account picture before speaking a single word - so every call picks up exactly where the last interaction left off.
              </p>
              <div className="flex flex-col">
                {[
                  'Payment history and broken promises to pay (PTPs)',
                  'Open disputes and hardship flags',
                  'Recent SMS, email, and portal activity',
                  'Agent notes, language, and call preferences',
                  'Risk segment and recommended next action',
                ].map((item, i) => (
                  <div key={item} className="flex items-center gap-4 py-4" style={{ borderBottom: i < 4 ? '1px solid rgba(10,18,37,0.08)' : 'none' }}>
                    <CheckCircle color="navy" />
                    <span className="text-base font-medium" style={{ color: '#0A1225' }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Context card graphic */}
            <Reveal delay={100}>
              <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'white', border: '1px solid rgba(10,18,37,0.1)' }}>
                {/* Account header */}
                <div className="px-4 sm:px-7 py-4 sm:py-5 flex items-start sm:items-center justify-between gap-3" style={{ borderBottom: '1px solid rgba(10,18,37,0.07)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A237E, #412F69)' }}>RJ</div>
                    <div>
                      <div className="text-sm sm:text-base font-semibold" style={{ color: '#0A1225' }}>Robert Johnson</div>
                      <div className="text-xs sm:text-sm mt-0.5" style={{ color: 'rgba(10,18,37,0.42)' }}>$3,240 balance · Account #48821</div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl flex-shrink-0" style={{ background: '#F5F7FF', border: '1px solid rgba(10,18,37,0.1)', color: '#0A1225' }}>Next call: Today 9am</div>
                </div>
                {/* Two-col body - stacks on small screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {/* Left: history */}
                  <div className="p-4 sm:p-6" style={{ borderBottom: '1px solid rgba(10,18,37,0.07)' }}>
                    <div className="sm:hidden" style={{ borderRight: 'none' }} />
                    <div className="hidden sm:block absolute" />
                    <div className="text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4" style={{ color: 'rgba(10,18,37,0.35)' }}>Account history</div>
                    <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 sm:gap-3">
                      {[
                        { bg: '#FFF5F5', border: 'rgba(220,50,50,0.14)', titleColor: '#CC3333', title: 'Broken PTP', sub: 'Promised $800 by Apr 28 · missed' },
                        { bg: '#F0FDFF', border: 'rgba(3,210,252,0.2)', titleColor: '#0099BB', title: 'SMS opened, no reply', sub: 'Sent May 3 · Link clicked once' },
                        { bg: '#F5F5FF', border: 'rgba(65,47,105,0.15)', titleColor: '#412F69', title: 'Agent note', sub: '"Prefers mornings, avoid Fridays"' },
                        { bg: '#F0FFF5', border: 'rgba(0,160,80,0.15)', titleColor: '#0A7040', title: 'Last payment', sub: '$1,560 received · Feb 12, 2026' },
                      ].map(({ bg, border, titleColor, title, sub }) => (
                        <div key={title} className="rounded-xl p-3" style={{ background: bg, border: `1px solid ${border}` }}>
                          <div className="text-xs sm:text-sm font-semibold mb-1" style={{ color: titleColor }}>{title}</div>
                          <div className="text-xs leading-relaxed" style={{ color: 'rgba(10,18,37,0.5)' }}>{sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Right: AI carries into call */}
                  <div className="p-4 sm:p-6" style={{ borderTop: '0', borderLeft: '0' }}>
                    <div className="text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4" style={{ color: 'rgba(10,18,37,0.35)' }}>AI carries into next call</div>
                    <div className="flex flex-col">
                      {[
                        'Acknowledge the broken promise - don\'t lead with it',
                        'Reference clicked link - debtor showed intent',
                        'Morning call window only - agent note honoured',
                        'Has payment history - offer a new arrangement',
                      ].map((line, i) => (
                        <div key={i} className="flex items-start gap-3 py-3" style={{ borderBottom: i < 3 ? '1px solid rgba(10,18,37,0.06)' : 'none' }}>
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold" style={{ background: 'rgba(10,18,37,0.06)', color: 'rgba(10,18,37,0.4)' }}>→</div>
                          <div className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(10,18,37,0.7)' }}>{line}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════ S2: CONFIGURE - dark ════ */}
      <section id="configure" className="py-16 sm:py-20 md:py-28" style={{ background: '#060F28' }}>
        <div className="max-w-[1160px] mx-auto px-5 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Configure modal graphic */}
            <Reveal>
              <div className="rounded-3xl overflow-hidden" style={{ background: '#0B1220', border: '1px solid rgba(255,255,255,0.09)' }}>
                {/* Modal header + tabs */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center justify-between px-5 sm:px-7 pt-5 sm:pt-7 pb-4 sm:pb-5">
                    <div>
                      <div className="text-sm sm:text-base font-semibold text-white">Configure Voice AI Agent</div>
                      <div className="text-xs sm:text-sm mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Configure your voice AI agent settings</div>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>✕</div>
                  </div>
                  <div className="flex px-2 overflow-x-auto scrollbar-none">
                    {['⚙ Basic', '💬 Context', '🎙 Voice', '📞 Number', '⇄ Transfer', '⚙ Advanced'].map((tab, i) => (
                      <div key={tab} className="px-3 sm:px-4 py-2.5 text-xs whitespace-nowrap" style={{ color: i === 1 ? '#03D2FC' : 'rgba(255,255,255,0.35)', borderBottom: i === 1 ? '2px solid #03D2FC' : '2px solid transparent', fontWeight: i === 1 ? 500 : 300 }}>{tab}</div>
                    ))}
                  </div>
                </div>
                {/* Body */}
                <div className="p-5 sm:p-7">
                  <div className="text-sm font-semibold text-white mb-1.5">Context</div>
                  <div className="text-xs mb-4 sm:mb-5" style={{ color: 'rgba(255,255,255,0.32)' }}>Define how the AI agent should behave, what it should do, and any guidelines it should follow.</div>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-medium" style={{ background: '#03D2FC', color: '#030F1E' }}>+ Insert Variable</div>
                      <div className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.09)' }}>👁 Preview</div>
                    </div>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>1325 characters</span>
                  </div>
                  {/* Prompt editor */}
                  <div className="rounded-2xl p-4 sm:p-5 text-sm leading-relaxed mb-4 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '140px', color: 'rgba(255,255,255,0.6)' }}>
                    You are a professional and empathetic debt collection agent named{' '}
                    <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(3,210,252,0.14)', color: '#03D2FC', border: '1px solid rgba(3,210,252,0.28)' }}>{'{{agent_name}}'}</span>
                    {' '}from{' '}
                    <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(3,210,252,0.14)', color: '#03D2FC', border: '1px solid rgba(3,210,252,0.28)' }}>{'{{company_name}}'}</span>.
                    The customer has an outstanding balance of{' '}
                    <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(3,210,252,0.14)', color: '#03D2FC', border: '1px solid rgba(3,210,252,0.28)' }}>{'{{balance}}'}</span>
                    {' '}due on{' '}
                    <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(221,57,249,0.12)', color: '#DD39F9', border: '1px solid rgba(221,57,249,0.25)' }}>{'{{due_date}}'}</span>.<br /><br />
                    <span style={{ color: 'rgba(255,255,255,0.38)' }}>Key responsibilities:</span><br />
                    — Verify identity before discussing account details<br />
                    — Explain balance and payment options clearly<br />
                    — Always comply with FDCPA regulations
                    <div className="absolute bottom-0 left-0 right-0 h-10 rounded-b-2xl pointer-events-none" style={{ background: 'linear-gradient(transparent, rgba(11,18,32,0.9))' }} />
                  </div>
                  {/* Variable chips */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs mr-1" style={{ color: 'rgba(255,255,255,0.28)' }}>Variables:</span>
                    {[
                      { label: '{{balance}}', c: '#03D2FC', bg: 'rgba(3,210,252,0.1)', border: 'rgba(3,210,252,0.2)' },
                      { label: '{{due_date}}', c: '#03D2FC', bg: 'rgba(3,210,252,0.1)', border: 'rgba(3,210,252,0.2)' },
                      { label: '{{last_ptp}}', c: '#03D2FC', bg: 'rgba(3,210,252,0.1)', border: 'rgba(3,210,252,0.2)' },
                      { label: '{{agent_name}}', c: '#DD39F9', bg: 'rgba(221,57,249,0.1)', border: 'rgba(221,57,249,0.2)' },
                      { label: '{{company_name}}', c: '#DD39F9', bg: 'rgba(221,57,249,0.1)', border: 'rgba(221,57,249,0.2)' },
                    ].map(({ label, c, bg, border }) => (
                      <span key={label} className="px-2.5 py-1 rounded-lg text-xs" style={{ color: c, background: bg, border: `1px solid ${border}` }}>{label}</span>
                    ))}
                    <span className="px-2.5 py-1 rounded-lg text-xs" style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>+ Add</span>
                  </div>
                </div>
                {/* Footer */}
                <div className="flex justify-end gap-3 px-5 sm:px-7 py-4 sm:py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="px-4 sm:px-6 py-2.5 rounded-xl text-xs cursor-pointer" style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</div>
                  <div className="px-4 sm:px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer" style={{ background: '#03D2FC', color: '#010C20' }}>💾 Save Configuration</div>
                </div>
              </div>
            </Reveal>

            {/* Copy */}
            <Reveal delay={100}>
              <span className="va-pill-d">Configuration</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug tracking-tight mb-5 text-white">
                Configure your AI collections agent,{' '}
                <span style={gradStyle}>not just the script</span>
              </h2>
              <p className="text-base font-light leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Set the brief, load account variables, pick the objective, and define guardrails. DROS turns that into safe, repeatable behaviour at scale.
              </p>
              <div className="flex flex-col">
                {[
                  'Agent brief - goals, tone, context window',
                  'Custom variables: balance, due date, segment',
                  'Objective selector: reminder, PTP, dispute triage',
                  'Pre-built templates for common collection scenarios',
                ].map((item, i) => (
                  <div key={item} className="flex items-center gap-4 py-4" style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                    <CheckCircle color="teal" />
                    <span className="text-base font-medium text-white">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════ S3: INBOUND & OUTBOUND - light ════ */}
      <section id="inbound-outbound" className="py-16 sm:py-20 md:py-28" style={{ background: '#EEF1FB' }}>
        <div className="max-w-[1160px] mx-auto px-5 sm:px-6 lg:px-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <span className="va-pill-l">Inbound &amp; Outbound</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug tracking-tight mb-4" style={{ color: '#0A1225' }}>
                One platform. <span style={gradStyle}>Both directions.</span>
              </h2>
              <p className="text-base sm:text-lg font-light leading-relaxed" style={{ color: 'rgba(10,18,37,0.58)' }}>
                DROS AI voice agents work across both inbound and outbound collections calls - same context, same compliance rules, same escalation logic on every interaction.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Inbound */}
            <Reveal>
              <div className="rounded-2xl p-6 sm:p-8 md:p-10 bg-white shadow-sm" style={{ border: '1px solid rgba(10,18,37,0.1)' }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#0099BB' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#0099BB' }}>Inbound</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 leading-snug" style={{ color: '#0A1225' }}>After-hours. Overflow. Simple queries.</h3>
                <p className="text-sm font-light leading-relaxed mb-6" style={{ color: 'rgba(10,18,37,0.56)' }}>
                  When a debtor calls and your team isn't available, DROS picks up - already knowing who they are and where the account stands.
                </p>
                <div className="h-px mb-6" style={{ background: 'rgba(10,18,37,0.07)' }} />
                <div className="mb-5">
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'rgba(10,18,37,0.35)' }}>Handles</div>
                  <div className="flex flex-wrap gap-2">
                    {['Balance queries', 'Payment status', 'Plan options', 'Due date queries', 'After-hours overflow'].map(chip => (
                      <span key={chip} className="text-xs font-normal px-3 py-1.5 rounded-full" style={{ background: 'rgba(10,18,37,0.06)', color: '#0A1225' }}>{chip}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: '⚡', label: 'Escalates', desc: 'Disputes, hardship, human requested', bg: 'rgba(255,170,60,0.1)' },
                    { icon: '📋', label: 'Logs', desc: 'Full transcript + outcome to timeline', bg: 'rgba(0,153,187,0.1)' },
                  ].map(({ icon, label, desc, bg }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm" style={{ background: bg }}>{icon}</div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(10,18,37,0.5)' }}>{label}</div>
                        <div className="text-sm" style={{ color: '#0A1225' }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Outbound */}
            <Reveal delay={80}>
              <div className="rounded-2xl p-6 sm:p-8 md:p-10 bg-white shadow-sm" style={{ border: '1px solid rgba(10,18,37,0.1)' }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#1A237E' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1A237E' }}>Outbound</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 leading-snug" style={{ color: '#0A1225' }}>Reminders. Follow-ups. Pre-charge-off.</h3>
                <p className="text-sm font-light leading-relaxed mb-6" style={{ color: 'rgba(10,18,37,0.56)' }}>
                  Launch AI outbound from the queue or from an account - with the right objective, script, and compliance rules pre-loaded.
                </p>
                <div className="h-px mb-6" style={{ background: 'rgba(10,18,37,0.07)' }} />
                <div className="mb-5">
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'rgba(10,18,37,0.35)' }}>Handles</div>
                  <div className="flex flex-wrap gap-2">
                    {['Payment reminders', 'Broken PTP follow-up', 'Pre-charge-off', 'PTP confirmations', 'Campaign queues'].map(chip => (
                      <span key={chip} className="text-xs font-normal px-3 py-1.5 rounded-full" style={{ background: 'rgba(10,18,37,0.06)', color: '#0A1225' }}>{chip}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: '⚡', label: 'Escalates', desc: 'Disputes, hardship, complex objections', bg: 'rgba(255,170,60,0.1)' },
                    { icon: '📋', label: 'Logs', desc: 'Promise, flags, next-step to account', bg: 'rgba(26,35,126,0.08)' },
                  ].map(({ icon, label, desc, bg }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm" style={{ background: bg }}>{icon}</div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(10,18,37,0.5)' }}>{label}</div>
                        <div className="text-sm" style={{ color: '#0A1225' }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════ S4: USE CASES - dark ════ */}
      <section id="use-cases" className="py-16 sm:py-20 md:py-28" style={{ background: '#010C20' }}>
        <div className="max-w-[1160px] mx-auto px-5 sm:px-6 lg:px-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <span className="va-pill-d">Use Cases</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-snug tracking-tight mb-4">
                Where teams <span style={gradStyle}>start with AI voice</span>
              </h2>
              <p className="text-base sm:text-lg font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Most operations start with one or two high-volume, low-complexity use cases. Here's where AI voice delivers the fastest, lowest-risk results.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { num: '01', title: 'High-volume payment reminder calls', desc: 'Consistent scripts, no agent fatigue, and instant scale. Pre-due and post-due reminders are the most common first deployment for AI voice in debt collection.', link: '/use-cases/ai-voice-agent-payment-reminders' },
              { num: '02', title: 'After-hours & weekend coverage', desc: "Debtors call outside business hours. AI voice handles inbound balance queries, payment confirmations, and simple plan questions without staffing cost." },
              { num: '03', title: 'Broken PTP follow-up outreach', desc: 'High volume, well-established scripts, clear intent signal from prior contact. A natural first deployment for AI-first outbound debt recovery calls.' },
              { num: '04', title: 'Inbound status and balance queries', desc: '"What do I owe?" "When is it due?" AI resolves these instantly on inbound, freeing collectors for complex, judgment-heavy accounts.' },
            ].map(({ num, title, desc, link }, i) => (
              <Reveal key={num} delay={i * 60}>
                <div className="rounded-2xl p-6 sm:p-8 h-full transition-all duration-200" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(3,210,252,0.4)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
                >
                  <div className="text-xs font-normal tracking-widest mb-4 sm:mb-5" style={{ color: '#03D2FC', letterSpacing: '0.14em' }}>{num}</div>
                  <h4 className="text-lg sm:text-xl font-semibold text-white mb-3 leading-snug">
                    {link ? (
                      <a href={link} title="AI Voice Agent for Payment Reminders" className="hover:text-[#03D2FC] transition-colors">{title}</a>
                    ) : title}
                  </h4>
                  <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
                  {link && (
                    <a href={link} className="inline-flex items-center gap-1 mt-4 text-sm font-light transition-all group" style={{ color: '#03D2FC' }}>
                      Learn more <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ S5: COMPLIANCE - light ════ */}
      <section id="compliance" className="py-16 sm:py-20 md:py-28" style={{ background: '#EEF1FB' }}>
        <div className="max-w-[1160px] mx-auto px-5 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Copy */}
            <Reveal>
              <span className="va-pill-l">Compliance</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug tracking-tight mb-5" style={{ color: '#0A1225' }}>
                FDCPA-compliant AI voice agents with <span style={gradStyle}>guardrails built in</span>
              </h2>
              <p className="text-base font-light leading-relaxed mb-8" style={{ color: 'rgba(10,18,37,0.58)' }}>
                Debt collection is regulated. DROS enforces compliance at the platform layer - not as an add-on. Every call runs against approved scripts, checks DNC, and logs everything.
              </p>
              <div className="flex flex-col">
                {[
                  'Mini-Miranda, DNC, and call window rules',
                  'Prohibited phrases blocked at the model layer',
                  'Per-portfolio rule sets for first and third party',
                  'Full transcript and QA flags on every call',
                ].map((item, i) => (
                  <div key={item} className="flex items-center gap-4 py-4" style={{ borderBottom: i < 3 ? '1px solid rgba(10,18,37,0.08)' : 'none' }}>
                    <CheckCircle color="navy" />
                    <span className="text-base font-medium" style={{ color: '#0A1225' }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Compliance capability cards */}
            <Reveal delay={100}>
              <div className="flex flex-col gap-4">
                {[
                  { icon: '🕐', iconBg: 'rgba(3,210,252,0.12)', title: 'Call time and frequency rules', desc: 'Call windows, DNC checks, and attempt frequency caps enforced before every dial - automatically, per jurisdiction.' },
                  { icon: '📋', iconBg: 'rgba(221,57,249,0.12)', title: 'Required disclosures, delivered every time', desc: 'Mini-Miranda, call recording consent, and state-level statements inserted at the right point in every call - unskippable.' },
                  { icon: '🔇', iconBg: 'rgba(255,80,80,0.1)', title: 'Prohibited language, never spoken', desc: 'Phrases like interest charges, garnishment, or legal threats are blocked at the model layer. Not filtered after - never generated.' },
                ].map(({ icon, iconBg, title, desc }) => (
                  <div key={title} className="flex items-start gap-4 sm:gap-5 rounded-2xl p-5 sm:p-6 bg-white shadow-sm" style={{ border: '1px solid rgba(10,18,37,0.09)' }}>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl sm:text-2xl" style={{ background: iconBg }}>{icon}</div>
                    <div>
                      <div className="text-sm sm:text-base font-semibold mb-1.5 sm:mb-2" style={{ color: '#0A1225' }}>{title}</div>
                      <div className="text-sm font-light leading-relaxed" style={{ color: 'rgba(10,18,37,0.52)' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════ S6: HUMAN HANDOFF - dark ════ */}
      <section id="handoff" className="py-16 sm:py-20 md:py-28" style={{ background: '#010C20' }}>
        <div className="max-w-[1160px] mx-auto px-5 sm:px-6 lg:px-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <span className="va-pill-d">Human Handoff</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-snug tracking-tight mb-4">
                Human-in-the-loop: when the <span style={gradStyle}>AI hands off to a collector</span>
              </h2>
              <p className="text-base sm:text-lg font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                AI voice agents handle volume and consistency. Human collectors handle judgment, empathy, and complex negotiation. DROS knows exactly where that line is - and crosses it cleanly, passing full context to the human agent before they speak a single word.
              </p>
            </div>
          </Reveal>

          {/* Flow steps - stacks on mobile */}
          <Reveal>
            <div className="flex flex-col md:flex-row items-center justify-center gap-0 mb-10 sm:mb-16 max-w-4xl mx-auto">
              {[
                { n: '01', icon: '🤖', title: 'AI call in progress', desc: 'Context loaded, script running, outcome and compliance tracking active', bg: 'white' },
                { n: '02', icon: '⚡', title: 'Escalation triggered', desc: 'Dispute, hardship, or debtor requests a human collector', bg: '#FDF5FF', borderStyle: 'border border-[rgba(221,57,249,0.22)]' },
                { n: '03', icon: '👤', title: 'Human continues', desc: 'Full call summary, flags, and transcript handed over instantly', bg: '#F0FDFF', borderStyle: 'border border-[rgba(3,210,252,0.28)]' },
              ].map(({ n, icon, title, desc, bg, borderStyle }, i) => (
                <div key={n} className="flex flex-col md:flex-row items-center w-full md:flex-1">
                  <div className={`w-full rounded-2xl p-7 sm:p-10 text-center ${borderStyle ?? 'border border-slate-100'}`} style={{ background: bg }}>
                    <div className="text-xs uppercase tracking-widest mb-4 sm:mb-5" style={{ color: 'rgba(10,18,37,0.35)', letterSpacing: '0.15em' }}>{n}</div>
                    <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">{icon}</div>
                    <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 leading-snug" style={{ color: '#0A1225' }}>{title}</h4>
                    <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(10,18,37,0.52)' }}>{desc}</p>
                  </div>
                  {i < 2 && (
                    <>
                      <div className="md:hidden text-2xl py-2 flex-shrink-0" style={{ color: 'rgba(10,18,37,0.25)' }}>↓</div>
                      <div className="hidden md:block text-3xl px-4 flex-shrink-0" style={{ color: 'rgba(10,18,37,0.2)' }}>→</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          {/* Handoff detail cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {[
              { icon: '⚑', iconBg: 'rgba(0,153,187,0.1)', title: 'Dispute or hardship mentioned', desc: 'Detected by keyword and intent model. Human collector takes over mid-call with full context, flags, and AI summary already visible.' },
              { icon: '👤', iconBg: 'rgba(26,35,126,0.08)', title: 'Debtor requests a human', desc: 'Immediately honoured - no second prompt, no delay. Transfer opens with the AI summary already loaded for the receiving agent.' },
              { icon: '◎', iconBg: 'rgba(255,170,60,0.1)', title: 'Conversation complexity threshold', desc: 'When confidence drops below the set threshold, the agent escalates automatically before call quality or compliance can degrade.' },
            ].map(({ icon, iconBg, title, desc }, i) => (
              <Reveal key={title} delay={i * 70}>
                <div className="rounded-2xl p-6 sm:p-8 bg-white shadow-sm h-full" style={{ border: '1px solid rgba(10,18,37,0.09)' }}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-5" style={{ background: iconBg }}>{icon}</div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-2.5 leading-snug" style={{ color: '#0A1225' }}>{title}</h3>
                  <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(10,18,37,0.56)' }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ S7: VOICE & TONE - light ════ */}
      <section id="voice-tone" className="py-16 sm:py-20 md:py-28" style={{ background: '#EEF1FB' }}>
        <div className="max-w-[1160px] mx-auto px-5 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Copy */}
            <Reveal>
              <span className="va-pill-l">Voice &amp; Tone</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug tracking-tight mb-5" style={{ color: '#0A1225' }}>
                Not a generic bot. <span style={gradStyle}>Your voice, your rules.</span>
              </h2>
              <p className="text-base font-light leading-relaxed mb-8" style={{ color: 'rgba(10,18,37,0.58)' }}>
                Choose the voice, language, and tone that fits your debtor base - then preview before a single call goes live.
              </p>
              <div className="flex flex-col">
                {[
                  'Multiple voices, accents, and languages',
                  'Filter by accent, gender, and age',
                  'Custom voice ID support via ElevenLabs',
                  'Preview any voice before going live',
                ].map((item, i) => (
                  <div key={item} className="flex items-center gap-4 py-4" style={{ borderBottom: i < 3 ? '1px solid rgba(10,18,37,0.08)' : 'none' }}>
                    <CheckCircle color="navy" />
                    <span className="text-base font-medium" style={{ color: '#0A1225' }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Voice modal graphic */}
            <Reveal delay={100}>
              <div className="rounded-3xl overflow-hidden" style={{ background: '#0B1220', border: '1px solid rgba(255,255,255,0.09)' }}>
                {/* Header + tabs */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center justify-between px-5 sm:px-7 pt-5 sm:pt-7 pb-4 sm:pb-5">
                    <div>
                      <div className="text-sm sm:text-base font-semibold text-white">Configure Voice AI Agent</div>
                      <div className="text-xs sm:text-sm mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Configure your voice AI agent settings</div>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>✕</div>
                  </div>
                  <div className="flex px-2 overflow-x-auto scrollbar-none">
                    {['⚙ Basic', '💬 Context', '🎙 Voice', '📞 Number', '⇄ Transfer', '⚙ Advanced'].map((tab, i) => (
                      <div key={tab} className="px-3 sm:px-4 py-2.5 text-xs whitespace-nowrap" style={{ color: i === 2 ? '#03D2FC' : 'rgba(255,255,255,0.35)', borderBottom: i === 2 ? '2px solid #03D2FC' : '2px solid transparent', fontWeight: i === 2 ? 500 : 300 }}>{tab}</div>
                    ))}
                  </div>
                </div>
                {/* Body */}
                <div className="p-5 sm:p-7">
                  <div className="text-sm font-semibold text-white mb-3">Voice Provider</div>
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-4 text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)' }}>
                    ElevenLabs <span className="opacity-40 text-xs">▾</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 sm:py-4 rounded-xl mb-4 sm:mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div>
                      <div className="text-sm font-semibold text-white">Use Custom Voice ID</div>
                      <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Manually enter a voice ID instead of selecting from library</div>
                    </div>
                    <div className="relative flex-shrink-0 ml-3" style={{ width: 40, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.15)' }}>
                      <div className="absolute" style={{ top: 4, left: 4, width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-white mb-3">Select Voice</div>
                  {/* Filter grid - 2 cols on mobile, 4 on sm+ */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                    {[['Language', 'All'], ['Accent', 'american'], ['Gender', 'female'], ['Age', 'young']].map(([label, val]) => (
                      <div key={label}>
                        <div className="text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</div>
                        <div className="flex justify-between items-center px-2 sm:px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)' }}><span className="truncate">{val}</span> <span className="opacity-40 ml-1 flex-shrink-0">▾</span></div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Showing 3 of 22 voices</div>
                  {/* Voice cards - 1 col on mobile, 3 on sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { name: 'Sarah', sub: 'Mature, Reassuring', active: true },
                      { name: 'Laura', sub: 'Enthusiast, Quirky', active: false },
                      { name: 'Jessica', sub: 'Playful, Bright, Warm', active: false },
                    ].map(({ name, sub, active }) => (
                      <div key={name} className="rounded-2xl p-3 sm:p-4" style={{ background: active ? 'rgba(3,210,252,0.07)' : 'rgba(255,255,255,0.03)', border: active ? '1px solid rgba(3,210,252,0.3)' : '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex justify-between items-start mb-2 sm:mb-3">
                          <div>
                            <div className="text-sm font-semibold text-white">{name}</div>
                            <div className="text-xs font-light mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{sub}</div>
                          </div>
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 pl-px ml-2" style={{ border: active ? '1px solid rgba(3,210,252,0.5)' : '1px solid rgba(255,255,255,0.2)', color: active ? '#03D2FC' : 'rgba(255,255,255,0.4)' }}>▶</div>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {['female', 'american', 'young'].map(tag => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-md" style={{ color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.07)' }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Footer */}
                <div className="flex justify-end gap-3 px-5 sm:px-7 py-4 sm:py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="px-4 sm:px-6 py-2.5 rounded-xl text-xs cursor-pointer" style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</div>
                  <div className="px-4 sm:px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer" style={{ background: '#03D2FC', color: '#010C20' }}>💾 Save Configuration</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════ S8: WORKFLOW - dark ════ */}
      <section id="workflow" className="py-16 sm:py-20 md:py-28" style={{ background: '#060F28' }}>
        <div className="max-w-[1160px] mx-auto px-5 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Copy */}
            <Reveal>
              <span className="va-pill-d">Workflow</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug tracking-tight mb-5 text-white">
                AI voice built into <span style={gradStyle}>the collections workflow</span>
              </h2>
              <p className="text-base font-light leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Not a bolt-on. Launch AI calls, review contact history, and see outcomes - all from the account page your collectors already work from.
              </p>
              <div className="flex flex-col">
                {[
                  'AI Voice Call button with call type selector',
                  'All AI and human calls in one unified timeline',
                  'Outcomes and flags written back automatically',
                  'Works in individual accounts and bulk queues',
                ].map((item, i) => (
                  <div key={item} className="flex items-center gap-4 py-4" style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                    <CheckCircle color="teal" />
                    <span className="text-base font-medium text-white">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Account workflow card */}
            <Reveal delay={100}>
              <div className="rounded-3xl overflow-hidden" style={{ background: '#0D1628', border: '1px solid rgba(255,255,255,0.09)' }}>
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 sm:px-7 py-3 sm:py-4 flex-wrap gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm sm:text-base font-semibold text-white">Sarah Okonkwo</span>
                    <span className="text-xs px-2.5 py-1 rounded-lg" style={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.07)' }}>Acc #3341</span>
                  </div>
                  <span className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Balance: $2,180 · Risk: High</span>
                </div>
                {/* Body - stacks on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Left: snapshot + trigger */}
                  <div className="p-4 sm:p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="grid grid-cols-2 gap-3 mb-4 sm:mb-5">
                      {[['$2,180', 'Current balance'], ['Broken PTP', '$600 due May 1']].map(([val, sub], i) => (
                        <div key={sub} className="rounded-2xl p-3 sm:p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <div className="text-base sm:text-lg font-semibold" style={{ color: i === 1 ? '#FFAA3C' : 'white' }}>{val}</div>
                          <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>{sub}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2 mb-4 sm:mb-5">
                      {[['Contact status', 'Connected', '#50C878'], ['Payment status', 'PTP Given', '#FFAA3C'], ['Preferred window', 'Mornings only', 'rgba(255,255,255,0.7)'], ['Open disputes', 'None', 'rgba(255,255,255,0.7)']].map(([label, val, color]) => (
                        <div key={label as string} className="flex justify-between text-xs sm:text-sm py-1">
                          <span style={{ color: 'rgba(255,255,255,0.38)' }}>{label}</span>
                          <span style={{ color: color as string, fontWeight: 500 }}>{val}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mb-3 sm:mb-4">
                      <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Select Voice AI Agent</div>
                      <div className="flex justify-between items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)' }}>
                        Broken PTP Follow-up <span className="opacity-40">▾</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2.5 rounded-2xl p-3 sm:p-4 cursor-pointer" style={gradBg}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                      <span className="text-sm font-semibold text-white">Make AI Call</span>
                    </div>
                  </div>
                  {/* Right: timeline */}
                  <div className="p-4 sm:p-6">
                    <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.32)', letterSpacing: '0.12em' }}>Contact timeline</div>
                    <div className="flex flex-col gap-4">
                      {[
                        { dot: gradBg, title: 'AI Voice - Broken PTP follow-up', meta: 'Today, 9:14am · 2m 38s', outcomeStyle: { background: 'rgba(80,200,120,0.1)', border: '1px solid rgba(80,200,120,0.2)' }, outcomeText: '✓ PTP set - $600 by May 15', outcomeSub: 'Auto-logged · No escalation needed', outcomeColor: '#50C878' },
                        { dot: { background: 'rgba(255,255,255,0.2)' }, title: 'Human call - Escalated from AI', meta: 'Apr 28 · Agent: M. Torres', outcomeStyle: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }, outcomeText: 'Dispute raised - account reviewed', outcomeSub: 'Summary passed from AI · Resolved', outcomeColor: 'rgba(255,255,255,0.6)' },
                        { dot: gradBg, title: 'AI Voice - Payment reminder', meta: 'Apr 24 · 8:00am', outcomeStyle: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }, outcomeText: 'No answer · Voicemail left', outcomeSub: 'Auto-logged · SMS triggered', outcomeColor: 'rgba(255,255,255,0.5)' },
                      ].map(({ dot, title, meta, outcomeStyle, outcomeText, outcomeSub, outcomeColor }, i) => (
                        <div key={i} className="relative pl-6">
                          <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full" style={dot} />
                          {i < 2 && <div className="absolute left-[6px] top-5 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.07)', height: 'calc(100% + 8px)' }} />}
                          <div className="text-xs sm:text-sm font-semibold text-white mb-1">{title}</div>
                          <div className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{meta}</div>
                          <div className="rounded-xl px-3 py-2.5" style={outcomeStyle}>
                            <div className="text-xs font-medium mb-0.5" style={{ color: outcomeColor }}>{outcomeText}</div>
                            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.32)' }}>{outcomeSub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════ S9: FAQ - light ════ */}
      <section id="faq" className="py-16 sm:py-20 md:py-28 bg-white">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-6 lg:px-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <span className="va-pill-l">FAQ</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug tracking-tight" style={{ color: '#0A1225' }}>
                Questions about AI voice agents <span style={gradStyle}>for debt collection</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={(i % 2) * 60}>
                <div className="rounded-2xl p-5 sm:p-7 bg-white cursor-pointer select-none" style={{ border: '1px solid rgba(10,18,37,0.09)', boxShadow: '0 2px 14px rgba(10,18,37,0.04)' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div className="flex justify-between items-start gap-3 sm:gap-4">
                    <span className="text-sm sm:text-base font-semibold leading-snug" style={{ color: '#0A1225' }}>{faq.q}</span>
                    <div className="flex-shrink-0 mt-0.5 transition-transform duration-200" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>
                      <ChevronDown className="w-5 h-5" style={{ color: 'rgba(10,18,37,0.3)' }} />
                    </div>
                  </div>
                  <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: openFaq === i ? '300px' : '0', paddingTop: openFaq === i ? '12px' : '0' }}>
                    <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(10,18,37,0.55)' }}>{faq.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FINAL CTA ════ */}
      <section className="py-20 sm:py-28 text-center relative overflow-hidden" style={{ background: '#010C20' }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(221,57,249,0.09) 0%, transparent 65%)' }} />
        </div>
        <div className="relative max-w-2xl mx-auto px-5 sm:px-6">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight tracking-tight mb-4 sm:mb-5">
              See DROS AI voice agents in a{' '}
              <span style={gradStyle}>real collections workflow</span>
            </h2>
            <p className="text-base sm:text-lg font-light leading-relaxed mb-8 sm:mb-12 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Configured for your accounts, your scripts, your compliance rules. Book a 30-minute demo with the team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/book-meeting"
                onClick={() => trackCta('voice_agents_cta_demo')}
                className="inline-flex items-center justify-center gap-2 font-semibold text-base px-7 sm:px-9 py-4 rounded-xl transition-all hover:-translate-y-0.5 w-full sm:w-auto"
                style={{ background: '#03D2FC', color: '#010C20' }}
              >
                Book a demo <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 font-semibold text-base px-7 sm:px-9 py-4 rounded-xl transition-all w-full sm:w-auto"
                style={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
              >
                See all features
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
      <VideoModal videoId="mNe-zfIOx1A" isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
    </div>
  );
}
