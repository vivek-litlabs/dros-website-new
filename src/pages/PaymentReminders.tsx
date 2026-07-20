export const route = '/use-cases/ai-voice-agent-payment-reminders';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import Footer from './Footer';

const BOOK_DEMO = 'https://dros.ai/book-meeting';

/* ─── reusable primitives ─── */
function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: 'linear-gradient(135deg,#DD39F9,#03D2FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
      {children}
    </span>
  );
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className="inline-flex items-center text-[11px] font-medium tracking-[0.1em] uppercase rounded-full px-[18px] py-[7px] mb-5"
      style={light
        ? { background: '#F0F2FB', border: '1px solid rgba(26,35,126,0.15)', color: '#1A237E' }
        : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}
    >
      {children}
    </span>
  );
}

function BtnPrimary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-2 font-medium text-sm rounded-lg px-7 py-3.5 transition-opacity hover:opacity-90"
      style={{ background: '#03D2FC', color: '#010C20', fontFamily: "'Saans','Inter',sans-serif" }}
    >
      {children}
    </a>
  );
}

function BtnGhost({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-2 font-medium text-sm rounded-lg px-7 py-3.5 text-white transition-colors hover:border-white/50"
      style={{ border: '1px solid rgba(255,255,255,0.2)', fontFamily: "'Saans','Inter',sans-serif" }}
    >
      {children}
    </a>
  );
}

/* ─── Industries tab data ─── */
const industries = [
  {
    id: 'tp',
    label: 'Third-Party Collections',
    heading: 'Debt Collection Agencies',
    body: 'Third-party agencies operate on thin margins with high volumes. DROS lets you work more accounts without adding headcount, scaling outreach across multiple client portfolios simultaneously.',
    useCases: [
      'Multi-client portfolio management with separate compliance rules per creditor',
      'FDCPA-compliant call scripts, disclosures, and Mini-Miranda delivery',
      'Automated cease-and-desist and dispute flagging',
      'Account prioritization based on collectability scores',
      'Human agent handoff for complex escalations',
    ],
    stats: [
      { val: '3-5x', lbl: 'More accounts touched per day' },
      { val: '100%', lbl: 'Compliant call delivery' },
      { val: '~60%', lbl: 'Reduction in cost per contact' },
      { val: '24/7', lbl: 'Calling window coverage' },
    ],
    compNote: 'Key compliance considerations handled automatically',
    tags: ['FDCPA', 'Reg F', 'TCPA', 'State call time rules', 'Mini-Miranda'],
  },
  {
    id: '1p',
    label: 'First-Party Collections',
    heading: 'First-Party Collections & AR',
    body: 'Lenders, banks, and credit unions managing their own delinquent accounts. DROS preserves the customer relationship while increasing payment recovery, operating as an extension of your team.',
    useCases: [
      'Pre-charge-off outreach across DPD buckets (1-30, 31-60, 61-90)',
      'Payment plan negotiation and PTP capture',
      'Real-time CRM sync - core banking, LOS, or servicing platform',
      'Brand-consistent voice with your institution\'s name',
    ],
    stats: [
      { val: 'Early', lbl: 'Stage recovery before charge-off' },
      { val: 'CRM', lbl: 'Synced in real time' },
      { val: '24/7', lbl: 'Automated outreach coverage' },
      { val: 'Live', lbl: 'Transfer to human agent' },
    ],
    compNote: 'Built for regulated lending environments',
    tags: ['UDAAP', 'TCPA', 'Reg F', 'GLBA', 'SOC 2'],
  },
  {
    id: 'bnpl',
    label: 'BNPL / Fintech',
    heading: 'BNPL & Fintech Lenders',
    body: 'Buy-now-pay-later platforms and digital lenders face massive outbound volume with young, mobile-first customer bases and razor-thin unit economics. DROS keeps recovery costs low while maintaining NPS.',
    useCases: [
      'High-frequency installment reminders (weekly / bi-weekly schedules)',
      'Outbound follow-up on failed or missed payments',
      'Multi-channel coordination - voice + SMS follow-up',
      'API-first integration with modern fintech stacks',
      'Branded voice - your product name, your tone',
    ],
    stats: [
      { val: 'Weekly', lbl: 'Installment cadence support' },
      { val: 'API', lbl: 'Native integration' },
      { val: 'Instant', lbl: 'Failed payment trigger' },
      { val: 'Low', lbl: 'Cost per recovered dollar' },
    ],
    compNote: 'BNPL-specific compliance requirements',
    tags: ['TCPA', 'CFPB guidelines', 'Reg F'],
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    heading: 'Healthcare Revenue Cycle',
    body: 'Hospitals, health systems, and medical practices handling patient billing. DROS navigates the sensitivity of healthcare conversations while reducing days-in-AR and bad debt write-offs.',
    useCases: [
      'Post-insurance balance reminders - patient responsibility calls',
      'Payment plan offers and financial assistance screening',
      'Pre-service deposit reminders for scheduled procedures',
      'HIPAA-compliant call flows - no PHI in transcripts',
    ],
    stats: [
      { val: 'Days', lbl: 'Reduction in AR cycle time' },
      { val: 'HIPAA', lbl: 'Compliant by design' },
      { val: '24/7', lbl: 'Outreach coverage' },
      { val: 'Empathy', lbl: 'Sensitive call tone' },
    ],
    compNote: 'Healthcare-specific data and communication rules',
    tags: ['HIPAA', 'TCPA', 'No Surprises Act', 'CFPB'],
  },
  {
    id: 'utilities',
    label: 'Utilities',
    heading: 'Utilities & Telecom',
    body: 'Electric, gas, water, and telecom providers managing high-volume residential accounts. DROS handles pre-disconnection notices and payment arrangement calls at massive scale.',
    useCases: [
      'Pre-disconnection notices with payment options and reconnection info',
      'Budget billing and payment plan enrollment via voice',
      'Seasonal high-volume spikes handled without agent ramp-up',
      'Consistent script compliance across all accounts, every call',
    ],
    stats: [
      { val: 'High', lbl: 'Volume - scales with your book' },
      { val: 'Spike', lbl: 'Seasonal load handling' },
      { val: '100%', lbl: 'Script compliance' },
      { val: 'PUC', lbl: 'Regulatory compliance' },
    ],
    compNote: 'Utility-specific consumer protection rules',
    tags: ['TCPA', 'PUC rules', 'Disconnect notice laws', 'State regulations'],
  },
  {
    id: 'auto',
    label: 'Auto Finance',
    heading: 'Auto Finance & Lending',
    body: 'Auto lenders, captives, and credit unions managing vehicle loan portfolios. DROS helps reduce repossession rates by increasing early-stage contact and payment arrangements.',
    useCases: [
      'Early DPD outreach - 1-15 days past due, before the account ages',
      'Deferral and extension offer delivery with terms captured',
      'Self-cure path offered before escalation - reduces repo risk',
      'Dealer finance and indirect lending portfolio support',
    ],
    stats: [
      { val: 'Early', lbl: 'DPD intervention window' },
      { val: 'Early', lbl: 'Intervention before repo' },
      { val: 'Deferral', lbl: 'Offer automation' },
      { val: 'Live', lbl: 'Loan system sync' },
    ],
    compNote: 'Auto lending and UCC compliance',
    tags: ['TCPA', 'Reg F', 'UDAP', 'State repo laws'],
  },
];

/* ─── How It Works steps ─── */
const steps = [
  {
    title: 'Account ingestion & prioritisation',
    details: [
      'Pull from CRM, dialer, or flat file via API or SFTP',
      'DPD bucket routing - different scripts per stage',
      'Compliance pre-check - scrubs against DNC, state rules',
      'Time-zone mapping for dial-window compliance',
    ],
  },
  {
    title: 'Compliant outbound dialing',
    details: [
      'State-by-state call window enforcement',
      'Consent status check before each attempt',
      'TCPA disclosure and Mini-Miranda (if applicable)',
      'Max-attempt limits per account per regulation',
    ],
  },
  {
    title: 'Live conversation & intent handling',
    details: [
      'Natural language understanding - handles off-script responses',
      'Payment plan negotiation - min payment, full balance, PTP date',
      'Objection handling - "I\'ll pay next week," "I can\'t afford it"',
      'Dispute flagging - routes to compliance queue instantly',
    ],
  },
  {
    title: 'Escalation & live transfer',
    details: [
      'Warm transfer with full call context passed through',
      'Agent screen-pop - account details ready before pickup',
      'Configurable escalation triggers per portfolio',
      'Zero-queue fallback - voicemail with callback prompt',
    ],
  },
  {
    title: 'Outcome logging & next action',
    details: [
      'Structured call disposition - PTP, refused, no answer, etc.',
      'Real-time CRM write-back - zero manual data entry',
      'Auto-scheduled follow-ups based on outcome',
      'Full call recording and transcript stored for compliance',
    ],
  },
];

/* ─── FAQ items ─── */
const faqs = [
  {
    q: 'Is this just a robocall? How is it different?',
    a: 'DROS conducts a real two-way conversation - not a one-way recorded message. The AI listens, understands what the debtor says, responds naturally, handles objections, negotiates payment amounts, and captures arrangements. It\'s closer to a trained collections agent than a robocall.',
  },
  {
    q: 'How does DROS handle compliance - TCPA, FDCPA, Reg F?',
    a: 'Compliance is enforced at the infrastructure level - not left to script configuration. DROS automatically checks consent status before every dial, enforces state-specific call-time windows, delivers required disclosures, scrubs against DNC lists, and respects Reg F attempt limits. Every call is recorded and transcribed for audit purposes.',
  },
  {
    q: 'What happens when the debtor wants to speak to a human?',
    a: 'DROS warm-transfers to a live agent with full call context passed through - the agent sees the account, the conversation summary, and any payment intent captured before they pick up. You can configure escalation triggers per portfolio or campaign.',
  },
  {
    q: 'How does it integrate with our existing systems?',
    a: 'DROS connects via REST API and can pull account queues from your CRM, dialer, or loan management system, and write outcomes back in real time. Flat file ingestion via SFTP is also available for teams not ready for full API integration.',
  },
  {
    q: 'Can we control the tone and script for each campaign?',
    a: 'Yes. You can configure voice profiles, tone settings, and call flow logic per campaign - so a pre-due reminder sounds different from a 30-day past-due call. Scripts stay compliant at the system level regardless of tone configuration.',
  },
  {
    q: 'How quickly can we go live?',
    a: 'Most deployments go live within a few weeks. The timeline depends on integration complexity and campaign configuration. Simpler setups using flat file ingestion can move faster. We\'ll scope this with you during the demo.',
  },
];

const complianceBadges = [
  'TCPA Compliant Dialing',
  'FDCPA Call Flows',
  'Reg F Ready',
  'HIPAA Safe Handling',
  'DNC Scrubbing',
  'State Call-Time Rules',
  'Consent Management',
  'Call Recording & Transcripts',
  'SOC 2 Type II',
];

export default function PaymentReminders() {
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const industry = industries[activeIndustry];

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Saans','Inter',sans-serif", background: '#010C20', color: '#fff' }}>
      <Helmet>
        <title>AI Voice Agent for Payment Reminders | DROS</title>
        <meta name="description" content="DROS AI voice agents automate payment reminder calls at scale - pre-due nudges, past-due outreach, PTP follow-ups. Compliant with FDCPA, TCPA & Reg F. Used by first-party collections, BNPL, healthcare, auto finance & utilities teams." />
        <link rel="canonical" href="https://dros.ai/use-cases/ai-voice-agent-payment-reminders" />
        <meta property="og:title" content="AI Voice Agent for Payment Reminders | DROS" />
        <meta property="og:description" content="Automate payment reminder calls at scale - pre-due nudges, past-due outreach, and PTP follow-ups. Compliant, consistent, 24/7." />
        <meta property="og:url" content="https://dros.ai/use-cases/ai-voice-agent-payment-reminders" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="DROS" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Voice Agent for Payment Reminders | DROS" />
        <meta name="twitter:description" content="Automate payment reminder calls at scale - pre-due nudges, past-due outreach, and PTP follow-ups. FDCPA, TCPA & Reg F compliant." />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebPage", "url": "https://dros.ai/use-cases/ai-voice-agent-payment-reminders", "name": "AI Voice Agent for Payment Reminders | DROS", "description": "Use DROS AI voice agents to automate high-volume payment reminder calls - pre-due, past-due, and promise-to-pay follow-ups. FDCPA, TCPA, and Reg F compliant." },
            { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://dros.ai" }, { "@type": "ListItem", "position": 2, "name": "Use Cases", "item": "https://dros.ai/use-cases" }, { "@type": "ListItem", "position": 3, "name": "AI Voice Agent for Payment Reminders", "item": "https://dros.ai/use-cases/ai-voice-agent-payment-reminders" }] },
            { "@type": "FAQPage", "mainEntity": [
              { "@type": "Question", "name": "Is this just a robocall? How is it different?", "acceptedAnswer": { "@type": "Answer", "text": "DROS conducts a real two-way conversation - not a one-way recorded message. The AI listens, understands what the debtor says, responds naturally, handles objections, negotiates payment amounts, and captures arrangements." } },
              { "@type": "Question", "name": "How does DROS handle compliance - TCPA, FDCPA, Reg F?", "acceptedAnswer": { "@type": "Answer", "text": "Compliance is enforced at the infrastructure level. DROS automatically checks consent status before every dial, enforces state-specific call-time windows, delivers required disclosures, scrubs against DNC lists, and respects Reg F attempt limits." } },
              { "@type": "Question", "name": "What happens when the debtor wants to speak to a human?", "acceptedAnswer": { "@type": "Answer", "text": "DROS warm-transfers to a live agent with full call context passed through - the agent sees the account, conversation summary, and any payment intent captured before they pick up." } }
            ] }
          ]
        })}</script>
      </Helmet>

      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(221,57,249,0.08),transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-20 w-[480px] h-[480px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(3,210,252,0.06),transparent 70%)' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full text-xs font-medium mb-7 px-4 py-1.5" style={{ background: 'rgba(3,210,252,0.08)', border: '1px solid rgba(3,210,252,0.2)', color: '#03D2FC' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#03D2FC] animate-pulse" />
                Use Case
              </div>
              <h1 className="text-5xl lg:text-[58px] font-medium leading-[1.08] mb-6">
                AI Voice Agent for <GradientText>Payment Reminders</GradientText>
              </h1>
              <p className="text-lg text-white/70 font-light leading-relaxed mb-9 max-w-[520px]">
                Automate high-volume <strong className="text-white/90 font-medium">payment reminder calls</strong> with DROS AI voice agents - reaching more accounts, capturing payment arrangements, and staying compliant at every step.
              </p>
              <div className="flex gap-3 flex-wrap">
                <BtnPrimary href={BOOK_DEMO}>Book a Demo →</BtnPrimary>
                <BtnGhost href={BOOK_DEMO}>See How It Works</BtnGhost>
              </div>
            </div>

            {/* right - call simulation */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(3,210,252,0.12)' }}>
              {/* header */}
              <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#DD39F9,#03D2FC)' }}>AI</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">DROS Voice Agent · David R.</p>
                  <p className="text-xs" style={{ color: '#03D2FC' }}>● 0:42 into call</p>
                </div>
                <span className="text-[10px] font-medium tracking-wide rounded-full px-2.5 py-1" style={{ background: 'rgba(3,210,252,0.1)', border: '1px solid rgba(3,210,252,0.25)', color: '#03D2FC' }}>LIVE</span>
              </div>

              {/* messages */}
              <div className="flex flex-col gap-3 mb-4 text-sm leading-relaxed">
                <div className="self-end max-w-[88%] rounded-[10px_2px_10px_10px] px-3.5 py-2.5" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)' }}>
                  Look, I just - I can't do the full amount right now. Things are tight.
                </div>
                <div className="self-start max-w-[88%] rounded-[2px_10px_10px_10px] px-3.5 py-2.5" style={{ background: 'rgba(3,210,252,0.08)', border: '1px solid rgba(3,210,252,0.12)', color: 'rgba(255,255,255,0.9)' }}>
                  I hear you. We can work with that. Your outstanding balance is <strong>$312.00</strong> - would a partial payment today help you get back on track?
                </div>
                <div className="self-end max-w-[88%] rounded-[10px_2px_10px_10px] px-3.5 py-2.5" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)' }}>
                  Yeah, maybe like $100 or something?
                </div>
                <div className="self-start max-w-[88%] rounded-[2px_10px_10px_10px] px-3.5 py-2.5" style={{ background: 'rgba(3,210,252,0.08)', border: '1px solid rgba(3,210,252,0.12)', color: 'rgba(255,255,255,0.9)' }}>
                  That works. If you do <strong>$100 today</strong>, I can set a reminder for the remaining <strong>$212</strong> on the 28th - would that timeline work for you?
                </div>
                <div className="self-start flex items-center gap-2 text-xs rounded-[2px_10px_10px_10px] px-3.5 py-2.5" style={{ background: 'rgba(3,210,252,0.05)', border: '1px solid rgba(3,210,252,0.1)', color: '#03D2FC' }}>
                  Logging payment arrangement
                  <span className="flex gap-1">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <span key={i} className="w-1 h-1 rounded-full bg-[#03D2FC]" style={{ animation: `bounce 1.2s ${d}s infinite` }} />
                    ))}
                  </span>
                </div>
              </div>

              {/* mini stats */}
              <div className="grid grid-cols-3 gap-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {[{ val: '0:42', lbl: 'Call duration' }, { val: '$312', lbl: 'Balance' }, { val: 'PTP', lbl: 'Outcome' }].map(s => (
                  <div key={s.lbl} className="text-center">
                    <p className="text-lg font-medium" style={{ background: 'linear-gradient(135deg,#DD39F9,#03D2FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.val}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.lbl}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── METRICS BAR ─── */}
      <div style={{ background: '#050F2A', borderTop: '1px solid rgba(3,210,252,0.08)', borderBottom: '1px solid rgba(3,210,252,0.08)' }} className="py-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              { val: '10x', lbl: 'More accounts reached vs. manual dialing' },
              { val: '24/7', lbl: 'Availability - no shift limits' },
              { val: '100%', lbl: 'Script compliance, every call' },
              { val: '~60%', lbl: 'Reduction in cost per contact' },
            ].map((m, i) => (
              <div key={i} className="text-center px-8 py-4 lg:py-0" style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : undefined }}>
                <p className="text-4xl lg:text-[42px] font-medium leading-none mb-2" style={{ background: 'linear-gradient(135deg,#DD39F9,#03D2FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{m.val}</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{m.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── WHAT DROS DOES ─── */}
      <section style={{ background: '#F5F7FF' }} className="py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div>
              <Eyebrow light>What DROS Does</Eyebrow>
              <h2 className="text-3xl lg:text-[40px] font-medium leading-[1.15]" style={{ color: '#010C20' }}>
                AI agents that handle the full payment conversation
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed" style={{ color: '#5A6480' }}>
                DROS deploys conversational AI voice agents that conduct natural, two-way payment reminder calls - not robocall blasts. The agent understands context, responds to debtor intent, captures payment arrangements, and hands off to a human when needed.
              </p>
            </div>
            <div className="flex flex-col gap-3.5">
              {[
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#03D2FC" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
                  bg: 'rgba(3,210,252,0.1)', border: 'rgba(3,210,252,0.2)',
                  title: 'Natural two-way dialogue',
                  body: 'Handles objections, questions, and partial payment negotiations - not a one-way message broadcast.',
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DD39F9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
                  bg: 'rgba(221,57,249,0.1)', border: 'rgba(221,57,249,0.2)',
                  title: 'Intelligent retry logic',
                  body: 'Automatically reschedules unanswered calls based on time-zone, prior contact history, and account priority.',
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B8FD4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
                  bg: 'rgba(123,143,212,0.1)', border: 'rgba(123,143,212,0.2)',
                  title: 'CRM & system integration',
                  body: 'Pulls live account data, logs every call outcome, and syncs payment arrangements back to your platform in real time.',
                },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4 rounded-xl p-5" style={{ background: '#fff', border: '1px solid rgba(26,35,126,0.1)', boxShadow: '0 1px 4px rgba(26,35,126,0.05)' }}>
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1" style={{ color: '#010C20' }}>{item.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#5A6480' }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── REMINDER TYPES ─── */}
      <section className="py-24" style={{ background: '#010C20' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-[600px] mx-auto mb-12">
            <Eyebrow>Reminder Types</Eyebrow>
            <h2 className="text-3xl lg:text-[40px] font-medium leading-[1.15]">Every stage of the payment cycle, covered</h2>
            <p className="mt-4 text-base" style={{ color: 'rgba(255,255,255,0.55)' }}>DROS handles the full spectrum - from friendly pre-due nudges to post-due recovery conversations.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                iconStroke: '#03D2FC', iconBg: 'rgba(3,210,252,0.12)', iconBorder: 'rgba(3,210,252,0.25)',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#03D2FC" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
                title: 'Pre-Due Reminders',
                body: 'Proactive calls 3-7 days before the due date. Reduces delinquency before it occurs - the most cost-effective intervention point.',
                tags: ['Day -7', 'Day -3', 'Soft tone'],
              },
              {
                iconStroke: '#DD39F9', iconBg: 'rgba(221,57,249,0.12)', iconBorder: 'rgba(221,57,249,0.25)',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DD39F9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                title: 'Due-Date Notifications',
                body: 'Same-day calls for accounts that haven\'t paid. Friendly, informational tone - confirms payment methods and drives same-day resolution.',
                tags: ['Day 0', 'Payment link', 'Self-serve'],
              },
              {
                iconStroke: '#7B8FD4', iconBg: 'rgba(65,47,105,0.12)', iconBorder: 'rgba(65,47,105,0.25)',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7B8FD4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
                title: 'Early-Stage Past Due',
                body: '1-30 days past due. Higher urgency tone, intent qualification, and payment plan offers. Keeps accounts in-house before they age further.',
                tags: ['Day 1-30', 'PTP capture', 'Plan offers'],
              },
              {
                iconStroke: '#03D2FC', iconBg: 'rgba(3,210,252,0.12)', iconBorder: 'rgba(3,210,252,0.25)',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#03D2FC" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
                title: 'Promise-to-Pay Follow-Ups',
                body: 'Automated calls on the day a debtor promised to pay. Confirms the arrangement, processes payment, or re-negotiates if needed.',
                tags: ['PTP date', 'Confirmation', 'Re-negotiation'],
              },
            ].map(card => (
              <div key={card.title} className="rounded-2xl p-7 transition-transform hover:-translate-y-0.5" style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div className="w-11 h-11 rounded-[10px] flex items-center justify-center mb-5" style={{ background: card.iconBg, border: `1px solid ${card.iconBorder}` }}>
                  {card.icon}
                </div>
                <h3 className="text-[17px] font-medium mb-2.5 tracking-[-0.01em]" style={{ color: '#010C20' }}>{card.title}</h3>
                <p className="text-sm leading-[1.65]" style={{ color: '#5A6480' }}>{card.body}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {card.tags.map(t => (
                    <span key={t} className="text-[11px] font-medium rounded-full px-3 py-1" style={{ background: '#F0F2FB', border: '1px solid rgba(26,35,126,0.1)', color: '#1A237E' }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INLINE CTA 1 ─── */}
      <div className="py-12" style={{ background: 'linear-gradient(135deg,#0D1535,#1A237E)', borderTop: '1px solid rgba(3,210,252,0.1)', borderBottom: '1px solid rgba(3,210,252,0.1)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <p className="text-xl font-medium mb-1.5">See DROS handle a live payment call</p>
              <p className="text-sm max-w-[480px]" style={{ color: 'rgba(255,255,255,0.55)' }}>We'll run a demo on your account types, your call flows, your compliance environment.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <BtnPrimary href={BOOK_DEMO}>Book a Demo →</BtnPrimary>
              <BtnGhost href={BOOK_DEMO}>Talk to Sales</BtnGhost>
            </div>
          </div>
        </div>
      </div>

      {/* ─── INDUSTRIES ─── */}
      <section style={{ background: '#F5F7FF' }} className="py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <Eyebrow light>Industries</Eyebrow>
            <h2 className="text-3xl lg:text-[40px] font-medium leading-[1.15]" style={{ color: '#010C20' }}>Built for collections-heavy industries</h2>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: '#5A6480' }}>Whether you're running first-party AR or third-party collections, DROS adapts to your compliance environment and volume.</p>
          </div>

          {/* tab selector */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-1 rounded-2xl p-1.5" style={{ background: 'rgba(26,35,126,0.05)', border: '1px solid rgba(26,35,126,0.08)' }}>
              {industries.map((ind, i) => (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndustry(i)}
                  className="px-5 py-3 text-sm rounded-xl font-normal transition-all whitespace-nowrap"
                  style={activeIndustry === i
                    ? { background: '#fff', color: '#1A237E', fontWeight: 500, boxShadow: '0 0 0 1px rgba(3,210,252,0.35),0 0 14px rgba(3,210,252,0.18),0 2px 6px rgba(26,35,126,0.1)' }
                    : { color: '#5A6480' }}
                >
                  {ind.label}
                </button>
              ))}
            </div>
          </div>

          {/* panel */}
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <h3 className="text-2xl lg:text-[26px] font-medium mb-3.5" style={{ color: '#010C20' }}>{industry.heading}</h3>
              <p className="text-[15px] leading-[1.7] mb-6" style={{ color: '#5A6480' }}>{industry.body}</p>
              <div className="flex flex-col gap-2.5">
                {industry.useCases.map((uc, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm" style={{ color: '#5A6480' }}>
                    <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 text-[9px] mt-0.5" style={{ background: 'linear-gradient(135deg,rgba(221,57,249,0.15),rgba(3,210,252,0.15))', border: '1px solid rgba(3,210,252,0.2)', color: '#1A237E', fontWeight: 700 }}>✓</div>
                    {uc}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-8" style={{ background: 'linear-gradient(135deg,#F0F2FB,#EBF0FF)', border: '1px solid rgba(26,35,126,0.08)' }}>
              <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                {industry.stats.map((s, i) => (
                  <div key={i} className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid rgba(26,35,126,0.06)' }}>
                    <p className="text-2xl font-medium mb-1.5" style={{ background: 'linear-gradient(135deg,#DD39F9,#03D2FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.val}</p>
                    <p className="text-xs leading-snug" style={{ color: '#5A6480' }}>{s.lbl}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid rgba(26,35,126,0.06)' }}>
                <p className="text-sm font-medium mb-1.5" style={{ color: '#010C20' }}>Regulatory coverage</p>
                <p className="text-xs mb-2.5" style={{ color: '#5A6480' }}>{industry.compNote}</p>
                <div className="flex flex-wrap gap-1.5">
                  {industry.tags.map(t => (
                    <span key={t} className="text-[11px] font-medium rounded px-2 py-1" style={{ background: 'rgba(26,35,126,0.06)', border: '1px solid rgba(26,35,126,0.1)', color: '#1A237E' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24" style={{ background: '#010C20' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-[560px] mx-auto mb-14">
            <Eyebrow>How It Works</Eyebrow>
            <h2 className="text-3xl lg:text-[40px] font-medium leading-[1.15]">
              From account queue to <GradientText>logged outcome</GradientText>
            </h2>
            <p className="mt-3.5 text-[15px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Click any step to see what DROS does at each stage of the call.</p>
          </div>
          <div className="grid lg:grid-cols-[400px_1fr] gap-16 items-start">
            {/* left: step list */}
            <div className="flex flex-col gap-1.5">
              {steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className="flex items-center gap-4 text-left rounded-xl px-5 py-[18px] transition-all"
                  style={activeStep === i
                    ? { background: 'rgba(3,210,252,0.06)', border: '1px solid rgba(3,210,252,0.2)' }
                    : { border: '1px solid transparent', background: 'transparent' }}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 transition-all"
                    style={activeStep === i
                      ? { background: 'linear-gradient(135deg,#DD39F9,#03D2FC)', color: '#fff', boxShadow: '0 0 12px rgba(3,210,252,0.3)' }
                      : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)' }}
                  >
                    {i + 1}
                  </div>
                  <p className="flex-1 text-base transition-all leading-snug" style={{ color: activeStep === i ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)', fontWeight: activeStep === i ? 500 : 400 }}>
                    {s.title}
                  </p>
                  <svg className="w-4 h-4 flex-shrink-0 transition-all" style={{ color: '#03D2FC', opacity: activeStep === i ? 1 : 0, transform: activeStep === i ? 'translateX(2px)' : undefined }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              ))}
            </div>

            {/* right: stacked cards */}
            <div className="flex flex-col gap-2.5">
              {steps.map((s, i) => (
                <div
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className="rounded-2xl overflow-hidden cursor-pointer transition-all"
                  style={activeStep === i
                    ? { background: '#fff', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }
                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {/* always-visible header */}
                  <div className="flex items-center gap-3.5" style={{ padding: activeStep === i ? '22px 26px 0' : '18px 22px' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 transition-all"
                      style={activeStep === i
                        ? { background: 'linear-gradient(135deg,#DD39F9,#03D2FC)', color: '#fff', boxShadow: '0 0 10px rgba(3,210,252,0.35)' }
                        : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)' }}
                    >
                      {i + 1}
                    </div>
                    {activeStep !== i && (
                      <p className="flex-1 text-[15px] font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.title}</p>
                    )}
                    {activeStep !== i && (
                      <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    )}
                  </div>
                  {/* expanded body */}
                  {activeStep === i && (
                    <div className="px-[26px] pb-7 pt-5">
                      <div className="flex flex-col gap-4">
                        {s.details.map((d, j) => (
                          <div key={j} className="flex items-center gap-3.5 text-[15px]" style={{ color: '#3D4B6E' }}>
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#03D2FC]" />
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BEFORE & AFTER ─── */}
      <section style={{ background: '#F5F7FF' }} className="py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-[600px] mx-auto mb-14">
            <Eyebrow light>Before & After</Eyebrow>
            <h2 className="text-3xl lg:text-[38px] font-medium leading-[1.15]" style={{ color: '#010C20' }}>When collections teams switch to DROS</h2>
            <p className="mt-3.5 text-[15px]" style={{ color: '#5A6480' }}>Here's what actually changes on the ground.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* without */}
            <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(26,35,126,0.08)' }}>
              <div className="flex items-center justify-center gap-3 py-6" style={{ borderBottom: '1px solid rgba(26,35,126,0.07)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(26,35,126,0.15)' }} />
                <span className="text-[15px] font-medium" style={{ color: '#8A94AA' }}>Without DROS</span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(26,35,126,0.15)' }} />
              </div>
              {[
                'Agents dial manually - 60-80 calls per person, per day',
                'Priority accounts go untouched after hours and on weekends',
                'Script drift creates compliance exposure with every new hire',
                'Call outcomes logged manually - slow, error-prone, incomplete',
                'Growing volume means growing headcount - costs don\'t scale down',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-5 px-8 py-6" style={{ borderBottom: i < 4 ? '1px solid rgba(26,35,126,0.05)' : undefined, color: '#9AA0B4', fontSize: 15, lineHeight: '1.55' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(200,40,40,0.08)', color: '#C82828' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </div>
                  {text}
                </div>
              ))}
            </div>
            {/* with */}
            <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(3,210,252,0.35)', boxShadow: '0 0 32px rgba(3,210,252,0.08)' }}>
              <div className="flex items-center justify-center gap-3 py-6" style={{ background: 'linear-gradient(135deg,rgba(221,57,249,0.06),rgba(3,210,252,0.06))', borderBottom: '1px solid rgba(3,210,252,0.15)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#03D2FC]" />
                <span className="text-[15px] font-medium" style={{ color: '#010C20' }}>With DROS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#03D2FC]" />
              </div>
              {[
                'Every account in the queue worked simultaneously - no cap',
                'Calls run 24/7 within compliant time windows - no gaps',
                'Compliance enforced at the system level - zero script drift',
                'Every outcome auto-logged and synced to your CRM instantly',
                'Volume scales with your portfolio - not your payroll',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-5 px-8 py-6" style={{ borderBottom: i < 4 ? '1px solid rgba(26,35,126,0.05)' : undefined, color: '#3D4B6E', fontSize: 15, lineHeight: '1.55' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(3,210,252,0.1)', color: '#03D2FC' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── INLINE CTA 2 ─── */}
      <section className="py-14" style={{ background: '#F5F7FF', borderTop: '1px solid rgba(26,35,126,0.07)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10 text-center">
          <h3 className="text-2xl lg:text-[26px] font-medium mb-3" style={{ color: '#010C20' }}>Ready to stop leaving accounts on the table?</h3>
          <p className="text-[15px] mb-7 max-w-[480px] mx-auto" style={{ color: '#5A6480' }}>DROS works your full queue, every day - not just what your team gets to.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <BtnPrimary href={BOOK_DEMO}>Book a Demo →</BtnPrimary>
            <a href="/customer-stories"
              className="inline-flex items-center gap-2 font-medium text-sm rounded-lg px-7 py-3.5 transition-colors"
              style={{ border: '1px solid rgba(26,35,126,0.2)', color: '#1A237E', fontFamily: "'Saans','Inter',sans-serif" }}
            >
              See a customer story →
            </a>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{ background: '#F5F7FF' }} className="pb-24" aria-label="Frequently Asked Questions">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-[560px] mx-auto mb-14">
            <Eyebrow light>FAQ</Eyebrow>
            <h2 className="text-3xl lg:text-[38px] font-medium leading-[1.2]" style={{ color: '#010C20' }}>Common questions about AI voice agents for payment reminders</h2>
          </div>
          <div className="max-w-[760px] mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid rgba(26,35,126,0.08)', borderTop: i === 0 ? '1px solid rgba(26,35,126,0.08)' : undefined }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-[22px] text-left transition-colors"
                  style={{ background: 'none', border: 'none', fontFamily: "'Saans','Inter',sans-serif", fontSize: 16, fontWeight: 500, color: openFaq === i ? '#1A237E' : '#010C20', cursor: 'pointer' }}
                >
                  <span>{faq.q}</span>
                  <svg className="flex-shrink-0 transition-transform" style={{ color: openFaq === i ? '#1A237E' : '#9AA0B4', transform: openFaq === i ? 'rotate(180deg)' : undefined }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {openFaq === i && (
                  <p className="pb-[22px] text-[15px] leading-[1.75] max-w-[680px]" style={{ color: '#374151' }}>{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMPLIANCE ─── */}
      <div className="py-20" style={{ background: '#050F2A', borderTop: '1px solid rgba(3,210,252,0.08)', borderBottom: '1px solid rgba(3,210,252,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-[560px] mx-auto mb-12">
            <Eyebrow>Compliance & Security</Eyebrow>
            <h2 className="text-3xl lg:text-[38px] font-medium leading-[1.2]">
              Built for regulated industries - <GradientText>compliance is the baseline</GradientText>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-[860px] mx-auto">
            {complianceBadges.map(badge => (
              <div key={badge} className="flex items-center gap-2.5 rounded-xl px-5 py-4 text-sm transition-all hover:border-[rgba(3,210,252,0.35)]" style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#03D2FC]" />
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 text-center relative overflow-hidden" style={{ background: '#010C20' }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full" style={{ background: 'radial-gradient(ellipse,rgba(3,210,252,0.07),transparent 70%)' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
          <Eyebrow>Get Started</Eyebrow>
          <h2 className="text-3xl lg:text-[42px] font-medium leading-[1.15] max-w-[580px] mx-auto mb-4">
            Ready to automate your <GradientText>payment reminder operation?</GradientText>
          </h2>
          <p className="text-base mb-9 max-w-[480px] mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            See DROS running live payment reminder calls - on your accounts, your call flows, your compliance rules.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <BtnPrimary href={BOOK_DEMO}>Book a Demo →</BtnPrimary>
            <BtnGhost href={BOOK_DEMO}>Talk to Sales</BtnGhost>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
