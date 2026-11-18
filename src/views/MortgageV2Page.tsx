'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import PageFade from '../components/PageFade';
import { Section, Container, Eyebrow, Heading, Button } from '../components/ui';
import Reveal, { RevealItem } from '../components/Reveal';
import { trackCta } from '../lib/analytics';

/*
 * Mortgage Servicers (industry page) - live route /industry/mortgage.
 *
 * CONTENT: sourced verbatim from the client mock (mortgage.html). No visible
 *   wording is added, removed or paraphrased; section order matches the mock.
 *   Compliance wording and legal boundaries are reproduced exactly - DROS makes
 *   the contact and keeps the record; it does NOT meet Reg X, act as the single
 *   point of contact, or cover the FHA face-to-face requirement.
 * DESIGN: DROS design system, reusing Auto Finance V2 patterns (editorial hero,
 *   operational ledger, product-surface tab showcase, Compliance Gate,
 *   system-architecture figure, audience selector, FAQ accordion, conversion
 *   band). Two sections are purpose-built for mortgage servicing: the "first
 *   120 days" dual-track (servicer obligations vs DROS alongside) and the
 *   "what DROS does / does not" line.
 *
 * INTEGRATION NOTES:
 *   - Booking CTAs ("Book a 20-minute call") route to the existing /book-meeting
 *     route; the HubSpot scheduler referenced in the brief is NOT configured here.
 *   - The contact form replicates the mock's client-side behaviour only: it shows
 *     a success state and does NOT transmit submissions anywhere.
 */

// ─── Hero ────────────────────────────────────────────────────────────────────
const HERO_SUB = 'Early-stage reminders, document follow-up and specialist scheduling, on voice, text and email. DROS makes the contact. Your team makes every decision.';
const TRUST = ['SOC 2 Type II', 'TCPA consent and quiet hours', 'SCRA flags', 'Bankruptcy and cease-communication suppression', 'US data hosting'];

// ─── Where it runs (six jobs) ────────────────────────────────────────────────
const JOBS = [
  { tag: 'DAYS 1\u201335', h: 'Early reminders', p: 'Reach the borrower before the loan rolls, on the channel they actually answer. Pay link in the same message.' },
  { tag: 'LOSS MITIGATION', h: 'Document follow-up', p: 'Incomplete applications stall evaluations. DROS calls and names what is still missing, as many times as your rules allow.' },
  { tag: 'SCHEDULING', h: 'Specialist callbacks', p: 'The borrower picks a time while they are still on the call, straight into your specialist\u2019s calendar.' },
  { tag: 'TRIAL PLANS', h: 'Trial payment reminders', p: 'A missed trial plan payment can undo a modification. Each one is reminded ahead of its due date.' },
  { tag: 'POST-FORBEARANCE', h: 'Exit outreach', p: 'Borrowers leaving forbearance need to be reached and told to call you. DROS works that list until they do.' },
  { tag: 'ESCROW \u0026 CONTACT', h: 'Payment changes and bad numbers', p: 'Escrow analysis changes the payment and borrowers underpay. Wrong numbers get flagged, not redialled.' },
];

// ─── Platform (six tabs) ─────────────────────────────────────────────────────
const TABS = [
  { num: '01', title: 'Context-aware AI agents', body: 'The agent opens the loan, not a script. Identity confirmed before any detail is discussed.' },
  { num: '02', title: 'One cadence, three channels', body: 'Voice, text and email run as one sequence. Whichever the borrower answers on, the loan stays a single record.' },
  { num: '03', title: 'Document follow-up', body: 'An incomplete application stalls the evaluation and the clock keeps running. DROS calls the borrower and names what is still outstanding.' },
  { num: '04', title: 'Specialist scheduling', body: 'The hardest part of loss mitigation is getting the borrower and the specialist on a call together. DROS books it while the borrower is still on the line.' },
  { num: '05', title: 'Payments and pay links', body: 'For an early-stage loan that just needs bringing current, the shortest path is the message the borrower is already holding.' },
  { num: '06', title: 'Per-loan audit trail', body: 'Every attempt, on every loan, in order \u2014 the record your team reaches for when a question comes from an investor, an examiner or a borrower\u2019s counsel.' },
];

const LOAN_ROWS = [
  ['Payment due', '$1,847.00'],
  ['Delinquency', 'Day 41'],
  ['Loss mit status', 'Application incomplete'],
  ['Missing', 'Pay stubs \u00b7 hardship letter'],
  ['Prior contacts', '4 attempts \u00b7 1 reached'],
  ['Flags', 'SCRA no \u00b7 Bankruptcy no'],
];

const CADENCE: { ch: string; cells: boolean[] }[] = [
  { ch: 'Voice', cells: [true, false, true, false] },
  { ch: 'Text', cells: [false, true, false, true] },
  { ch: 'Email', cells: [true, false, false, false] },
];

const DOCS = [
  ['Bank statements', 'RECEIVED'],
  ['Tax returns', 'RECEIVED'],
  ['Pay stubs', 'OUTSTANDING'],
  ['Hardship letter', 'OUTSTANDING'],
];

const AUDIT = [
  ['02 Nov 11:04', 'Voice \u00b7 no answer, voicemail left'],
  ['04 Nov 09:12', 'Voice \u00b7 reached, hardship captured'],
  ['04 Nov 09:17', 'Specialist call booked \u00b7 18 Nov'],
  ['11 Nov 16:02', 'SMS \u00b7 pay stubs and letter chased'],
  ['17 Nov 10:00', 'Reminder \u00b7 specialist call tomorrow'],
];

// ─── The first 120 days (dual track) ─────────────────────────────────────────
const PHASES = [
  {
    days: 'Days 1\u201335', label: 'Before early intervention',
    obligation: 'No Reg X duty yet. Servicing and investor rules apply.',
    dros: 'Reminders on the borrower\u2019s channel. Pay links. Commitments captured and confirmed in writing.',
  },
  {
    days: 'Days 36\u201345', label: 'Early intervention window',
    obligation: 'Live contact attempted by day 36. Written notice by day 45. Single point of contact assigned by day 45.',
    dros: 'Attempts made and documented on every loan, so your team is not chasing dial tones. Borrower routed to your assigned contact.',
  },
  {
    days: 'Days 46\u2013119', label: 'Loss mitigation',
    obligation: 'Evaluate complete applications. Keep the single point of contact reachable. FHA face-to-face before three unpaid installments.',
    dros: 'Missing documents chased by name. Specialist callbacks booked. Trial plan payments reminded.',
  },
  {
    days: 'Day 120+', label: 'Referral possible',
    obligation: 'Referral to foreclosure may begin, subject to Reg X protections and investor rules.',
    dros: 'Outreach continues, pauses or stops entirely, per the rules you set.',
  },
];
const FIRST120_FOOT = 'DROS performs nothing in the top row. Reg X treats reasonable attempts to reach a borrower as part of good faith efforts, and DROS makes and documents those attempts \u2014 but whether your programme meets the standard is your determination, with your counsel. What DROS gives you is the record to make it with.';

// ─── Compliance ──────────────────────────────────────────────────────────────
const CHECKS = [
  ['Consent, per channel and per number', 'TCPA'],
  ['Quiet hours and contact caps', 'TCPA'],
  ['State servicing and collection rules', 'State law'],
  ['Servicemember flag', 'SCRA'],
  ['Bankruptcy or cease-communication flag', 'Suppression'],
  ['Borrower represented by counsel', 'Routing'],
  ['Approved script library', 'UDAAP'],
];
const COMPLIANCE_NOTES = [
  { h: 'Where FDCPA and Reg F apply', p: 'A sub-servicer or agency collecting on another holder\u2019s loan is covered in full. Those rules are applied where they reach the book, and not claimed where they do not.' },
  { h: 'Evidence on demand', p: 'Attempts, recordings, transcripts and disclosures sit on the loan, exportable for an investor audit, an examiner or a borrower\u2019s counsel.' },
  { h: 'Investor rules sit on top', p: 'Fannie, Freddie, FHA and VA timelines differ. Cadence and suppression are configured per investor, not once for the whole book.' },
];
const COMPLIANCE_DISCLAIMER = 'Nothing on this page is legal advice, and nothing here is a representation that your programme is compliant. DROS enforces the rules you configure; your obligations under Regulation X, FHA requirements and investor guidelines remain yours, and should be confirmed with your own counsel.';

// ─── Where the line falls (does / does not) ──────────────────────────────────
const LINE_INTRO = 'Mortgage default servicing is governed by rules that fall on you, not on a vendor. So that none of the above is read as more than it is, here is the line stated plainly.';
const DOES_ITEMS = [
  'Contacts every past-due loan in the book, daily, across voice, text and email',
  'Captures and confirms payment commitments, and sends secure pay links',
  'Chases the documents a loss mitigation application is still missing',
  'Books callbacks straight into your specialists\u2019 calendars',
  'Reminds borrowers of trial plan and post-forbearance payments',
  'Records, transcribes and logs every attempt against the loan',
];
const DOES_NOTE = 'Everything above is contact, scheduling and record-keeping.';
const DOESNOT_ITEMS = [
  'Satisfy your Regulation X early intervention obligation',
  'Act as the single point of contact that Reg X requires you to assign',
  'Satisfy the FHA face-to-face interview requirement \u2014 a phone call cannot',
  'Decide loss mitigation eligibility or quote modification terms',
  'Send required notices, or refer a loan to foreclosure',
  'Make any determination about whether you are compliant',
];
const DOESNOT_NOTE = 'DROS gives you contact and a record. Your team and your counsel own the rest.';

// ─── Who it is for (three audiences) ─────────────────────────────────────────
const AUDIENCES = [
  { h: 'Mortgage servicers and in-house lenders', items: ['Early-stage coverage without adding headcount', 'Your brand, your scripts, your disclosures', 'Specialists receive borrowers, not voicemails'] },
  { h: 'Sub-servicers', items: ['Documented coverage per client and investor', 'Call records available when a client asks', 'Different rule sets per portfolio, not one blanket cadence'] },
  { h: 'Credit unions with mortgage books', items: ['Member-appropriate tone on every contact', 'A book larger than the default team that works it', 'Hardship routed to a person, quickly'] },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQ: { q: string; a: string }[] = [
  { q: 'Does DROS make us Reg X compliant?', a: 'No, and we would be careful with any vendor who says otherwise. Regulation X obligations sit with the servicer. DROS makes contact attempts and documents them, which is the raw material your good faith efforts are built from, but the determination that your programme meets the standard is yours and your counsel\u2019s.' },
  { q: 'Can an AI call count as early intervention live contact?', a: 'That is your call to make with counsel, not ours to assert. What we can say is what DROS does: it attempts contact on the channels the borrower uses, records every attempt with its time, channel and outcome, and hands your team a complete, dated record. Several servicers use DROS for attempts and keep live contact with their own staff.' },
  { q: 'Does it satisfy the FHA face-to-face interview requirement?', a: 'No. Under 24 CFR 203.604 a phone call cannot substitute for the face-to-face meeting, and the minimum reasonable effort involves a certified letter and a visit to the property. DROS runs alongside that requirement; it does not meet it.' },
  { q: 'Does DROS replace our single point of contact?', a: 'No. Reg X requires you to assign specific personnel and keep them reachable. DROS works the other side of that problem: reaching the borrower in the first place, and getting them booked with the person you assigned.' },
  { q: 'Does it decide loss mitigation eligibility?', a: 'No. DROS does not evaluate applications, discuss options, quote terms or make any eligibility statement. It captures what the borrower says, chases outstanding documents by name, and books time with your specialist.' },
  { q: 'Does it replace our servicing platform?', a: 'No. Your servicing platform stays the system of record. DROS takes the loan file, works the borrower contact, and writes outcomes back by secure file exchange, API or webhook.' },
  { q: 'What happens to our default servicing team?', a: 'They stop spending the day on attempts that do not connect. DROS covers the volume; your specialists take the conversations that need judgement, which is where the regulated work actually sits.' },
];
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

// ─── Next step ───────────────────────────────────────────────────────────────
const NEXT_PERKS = [
  '20 minutes, no commitment',
  'Your stack reviewed, including what we do not integrate with',
  'The division of labour walked through with your compliance lead',
];

function Kicker({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`font-mono text-[10.5px] uppercase tracking-[0.11em] ${className}`}>{children}</div>;
}
const CheckIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// ── Platform tab diagrams: each a distinct product surface ───────────────────
function MortgageFigure({ tab }: { tab: number }) {
  // 01 — Context-aware loan surface
  if (tab === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between border-b border-hair pb-3">
          <Kicker className="text-ink/40">Example loan, loaded before the attempt</Kicker>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> loaded
          </span>
        </div>
        <dl className="mt-2 grid grid-cols-1 sm:grid-cols-2">
          {LOAN_ROWS.map(([k, v], i) => (
            <div key={k} className={`flex items-baseline justify-between gap-4 py-3 ${i < LOAN_ROWS.length - 2 ? 'border-b border-hair' : ''} sm:[&:nth-child(odd)]:pr-8 sm:[&:nth-child(even)]:pl-8 sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:border-hair`}>
              <dt className="text-[13px] text-ink/45">{k}</dt>
              <dd className="font-display text-[15px] text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-accent/[0.07] px-4 py-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span className="text-[13.5px] font-medium text-ink">Attempt begins</span>
        </div>
      </div>
    );
  }
  // 02 — Cadence matrix
  if (tab === 1) {
    const days = ['DAY 1', 'DAY 3', 'DAY 5', 'DAY 7'];
    return (
      <div className="w-full">
        <div className="grid grid-cols-[76px_repeat(4,1fr)] items-end gap-2 pb-2">
          <Kicker className="text-ink/40">cadence</Kicker>
          {days.map((d) => <div key={d} className="text-center font-mono text-[10px] uppercase tracking-[0.08em] text-ink/40">{d}</div>)}
        </div>
        <div className="divide-y divide-hair border-y border-hair">
          {CADENCE.map((row) => (
            <div key={row.ch} className="grid grid-cols-[76px_repeat(4,1fr)] items-center gap-2 py-2.5">
              <div className="text-[13.5px] font-medium text-ink">{row.ch}</div>
              {row.cells.map((on, i) => (
                <div key={i} className="flex justify-center">
                  <span className={`h-6 w-full rounded-[3px] ${on ? 'bg-accent' : 'border border-hair bg-transparent'}`} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 text-accent">
          <span className="h-px w-6 bg-accent/50" />
          <span className="font-mono text-[10px] uppercase tracking-[0.08em]">Borrower replies here</span>
          <span className="h-px w-6 bg-accent/50" />
        </div>
        <div className="mt-3 rounded-lg bg-surface-2/70 px-4 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-ink/45">
          One loan record underneath
        </div>
      </div>
    );
  }
  // 03 — Document follow-up (received / outstanding)
  if (tab === 2) {
    return (
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hair pb-3">
          <Kicker className="text-ink/40">Loss mitigation application</Kicker>
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink/40">Borrower response package</span>
        </div>
        <ul className="mt-2 divide-y divide-hair">
          {DOCS.map(([doc, state]) => {
            const got = state === 'RECEIVED';
            return (
              <li key={doc} className="flex items-center justify-between gap-4 py-2.5">
                <span className="flex items-center gap-3 text-[14px] text-ink/85">
                  {got
                    ? <CheckIcon className="h-3.5 w-3.5 shrink-0 text-accent" />
                    : <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-full border border-ink/30" />}
                  {doc}
                </span>
                <span className={`font-mono text-[10px] uppercase tracking-[0.06em] ${got ? 'text-accent' : 'text-ink/40'}`}>{state}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-accent/[0.07] px-4 py-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-[13.5px] font-medium text-ink">Chased by name</span>
        </div>
      </div>
    );
  }
  // 04 — Specialist scheduling
  if (tab === 3) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
          <div className="flex-1 rounded-lg bg-surface-2/70 p-4">
            <div className="text-[14px] font-semibold text-ink">On the call</div>
            <div className="mt-1 text-[12.5px] text-ink/55">borrower picks a slot</div>
          </div>
          <ArrowRight className="mx-auto h-4 w-4 shrink-0 rotate-90 text-ink/35 sm:rotate-0" />
          <div className="flex-1 rounded-lg bg-accent/[0.07] p-4 text-center">
            <Kicker className="text-accent">Booked</Kicker>
            <div className="mt-1 font-display text-[18px] text-ink">Tue 18 Nov</div>
            <div className="text-[12.5px] text-ink/55">10:30 am</div>
          </div>
          <ArrowRight className="mx-auto h-4 w-4 shrink-0 rotate-90 text-ink/35 sm:rotate-0" />
          <div className="flex-1 rounded-lg bg-surface-2/70 p-4">
            <div className="text-[14px] font-semibold text-ink">Your specialist</div>
          </div>
        </div>
        <div className="mt-4 space-y-1 border-t border-hair pt-4 text-[13px] text-ink/55">
          <p>Confirmed to the borrower in writing, and reminded the day before.</p>
          <p>DROS does not discuss options or eligibility on the call.</p>
        </div>
      </div>
    );
  }
  // 05 — Pay-link flow
  if (tab === 4) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
          <div className="flex-1 rounded-lg bg-surface-2/70 p-4">
            <div className="text-[14px] font-semibold text-ink">Agreement</div>
            <div className="mt-1 text-[12.5px] text-ink/55">on the call</div>
          </div>
          <ArrowRight className="mx-auto h-4 w-4 shrink-0 rotate-90 text-ink/35 sm:rotate-0" />
          <div className="flex-1 rounded-lg bg-surface-2/70 p-4">
            <div className="text-[14px] font-semibold text-ink">Secure pay link</div>
            <div className="mt-1 text-[12.5px] text-ink/55">same channel</div>
          </div>
          <ArrowRight className="mx-auto h-4 w-4 shrink-0 rotate-90 text-ink/35 sm:rotate-0" />
          <div className="flex-1 rounded-lg bg-accent/[0.07] p-4 text-center">
            <Kicker className="text-accent">Paid</Kicker>
            <div className="mt-1 font-display text-[22px] text-ink">$1,847.00</div>
          </div>
        </div>
        <div className="mt-4 space-y-1 border-t border-hair pt-4 text-[13px] text-ink/55">
          <p>Booked against the loan, same day.</p>
          <p>Card details stay with your payment provider.</p>
        </div>
      </div>
    );
  }
  // 06 — Audit log timeline
  return (
    <div className="w-full">
      <Kicker className="border-b border-hair pb-3 text-ink/40">One loan, in order</Kicker>
      <ol className="relative mt-2 pl-5">
        <span aria-hidden className="absolute left-[3px] top-2 bottom-2 w-px bg-hair" />
        {AUDIT.map(([t0, t1], i) => (
          <li key={t0} className="relative py-2.5">
            <span className={`absolute -left-5 top-3.5 h-1.5 w-1.5 rounded-full ${i === AUDIT.length - 1 ? 'bg-accent' : 'bg-ink/30'}`} />
            <span className="font-mono text-[11px] text-ink/40">{t0}</span>
            <span className="mt-0.5 block text-[14px] text-ink">{t1}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 border-t border-hair pt-4 text-[13px] text-ink/55">Each entry carries its recording, transcript and the disclosures given.</p>
    </div>
  );
}

export default function MortgageV2Page() {
  const [tab, setTab] = useState(0);
  const [who, setWho] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    setSent(true); // client-side only; submissions are not transmitted.
  }

  return (
    <PageFade className="min-h-screen bg-base text-ink">
      <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      <Navbar transparent />

      <main>
        {/* ── HERO (editorial, left-aligned; trust row merged in) ── */}
        <header data-nav-theme="dark" className="relative overflow-hidden bg-base text-white">
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
          <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(3,210,252,0.10),transparent)]" />
          <Container wide className="relative z-10">
            <div className="max-w-full pt-28 sm:max-w-3xl md:max-w-4xl md:pt-36">
              <Reveal>
                <Eyebrow className="text-white/55">Mortgage servicing</Eyebrow>
              </Reveal>
              <Reveal large>
                <h1 className="mt-6 font-saans text-[40px] font-medium leading-[1.0] tracking-[-0.035em] sm:text-[56px] lg:text-[68px]">
                  AI agents for mortgage default servicing.
                </h1>
              </Reveal>
            </div>
            <div className="mt-8 max-w-xl pb-16">
              <Reveal>
                <p className="text-lg leading-relaxed text-white/70">{HERO_SUB}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('mortgagev2_hero_book')}>
                    Book a 20-minute call <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="lg" href="#contact" onClick={() => trackCta('mortgagev2_hero_talk')}>
                    Talk to us
                  </Button>
                </div>
              </Reveal>
            </div>
          </Container>
          <div className="relative z-10 border-t border-hair bg-white/[0.015]">
            <Container wide>
              <Reveal className="flex flex-wrap items-center gap-x-5 gap-y-2 py-4">
                {TRUST.map((t, i) => (
                  <div key={t} className="flex items-center gap-5">
                    {i > 0 && <span aria-hidden className="text-white/15">/</span>}
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/45">{t}</span>
                  </div>
                ))}
              </Reveal>
            </Container>
          </div>
        </header>

        {/* ── WHERE IT RUNS (operational ledger, six jobs) ── */}
        <Section tone="light" spacing="sm" id="where">
          <Container>
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-ink-grey">Where it runs</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">Six jobs a default servicing floor can hand over today.</Heading>
            </Reveal>
            <Reveal stagger={0.08} className="mt-10">
              {JOBS.map((j, i) => {
                const last = i === JOBS.length - 1;
                return (
                  <RevealItem key={j.h}>
                    <div className="group flex gap-5 sm:gap-7">
                      <div className="flex flex-col items-center">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-dark bg-white font-mono text-[12px] text-ink-grey transition-colors duration-300 group-hover:border-accent/50 group-hover:text-ink-dark">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {!last && (
                          <span aria-hidden className={`mt-1.5 w-px flex-1 ${i === 0 ? 'bg-gradient-to-b from-accent/40 to-line-dark' : 'bg-line-dark'}`} />
                        )}
                      </div>
                      <div className={`grid flex-1 gap-x-10 gap-y-2 ${last ? 'pb-0' : 'pb-11'} md:grid-cols-[minmax(0,330px)_minmax(0,1fr)] md:items-start`}>
                        <div>
                          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">{j.tag}</div>
                          <h3 className="mt-2 font-display text-[22px] leading-tight tracking-[-0.02em] text-ink-dark">{j.h}</h3>
                        </div>
                        <p className="max-w-[52ch] text-[15px] leading-relaxed text-ink-grey md:pt-0.5">{j.p}</p>
                      </div>
                    </div>
                  </RevealItem>
                );
              })}
            </Reveal>
          </Container>
        </Section>

        {/* ── PLATFORM (product showcase, 6 distinct surfaces) ── */}
        <Section tone="light" spacing="sm" id="platform">
          <Container>
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-ink-grey">Platform</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">It is not only the voice agent.</Heading>
              <p className="mt-4 text-lg leading-relaxed text-ink-grey">The parts of DROS a default servicing team runs day to day.</p>
            </Reveal>

            <div className="mt-10 grid gap-6 lg:grid-cols-[290px_1fr] lg:gap-10">
              <div role="tablist" aria-label="DROS capabilities" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-l lg:border-line-dark lg:pb-0">
                {TABS.map((t, i) => {
                  const on = tab === i;
                  return (
                    <button
                      key={t.num}
                      role="tab"
                      aria-selected={on}
                      aria-controls={`mv2-panel-${i}`}
                      id={`mv2-tab-${i}`}
                      onClick={() => setTab(i)}
                      className={`group relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors lg:-ml-px lg:shrink lg:rounded-none lg:border-l-2 lg:px-5 lg:py-4 ${
                        on
                          ? 'bg-ink-dark text-white lg:border-ink-dark lg:bg-transparent lg:text-ink-dark'
                          : 'text-ink-grey hover:text-ink-dark lg:border-transparent'
                      }`}
                    >
                      <span className={`font-mono text-[11px] tracking-[0.1em] ${on ? 'text-accent' : 'text-ink-grey/60'}`}>{t.num}</span>
                      <span className="whitespace-nowrap text-[15px] font-medium lg:whitespace-normal">{t.title}</span>
                    </button>
                  );
                })}
              </div>

              <div role="tabpanel" id={`mv2-panel-${tab}`} aria-labelledby={`mv2-tab-${tab}`} className="overflow-hidden rounded-card border border-line-dark bg-white">
                <div className="border-b border-line-dark px-6 py-4 sm:px-8">
                  <h3 className="text-[21px] font-semibold text-ink-dark">{TABS[tab].title}</h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-grey">{TABS[tab].body}</p>
                </div>
                <div className="bg-base px-6 py-7 text-ink sm:px-8 sm:py-8">
                  <MortgageFigure tab={tab} />
                </div>
              </div>
            </div>

            <Reveal className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[16px] text-ink-dark">Walk the platform with someone who knows default servicing.</p>
              <Button variant="onLight" size="lg" to="/book-meeting" onClick={() => trackCta('mortgagev2_platform_book')} className="shrink-0">
                Book a 20-minute call <ArrowRight className="h-4 w-4" />
              </Button>
            </Reveal>
          </Container>
        </Section>

        {/* ── THE FIRST 120 DAYS (dual-track: obligations vs DROS alongside) ── */}
        <Section tone="light" spacing="sm" id="first-120-days" className="scroll-mt-28">
          <Container wide>
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-ink-grey">The first 120 days</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">Your obligations run on one track. DROS runs alongside them.</Heading>
              <p className="mt-4 text-lg leading-relaxed text-ink-grey">
                The top row is yours. The bottom row is the work DROS takes off your floor so the borrower is actually reachable when the top row needs them.
              </p>
            </Reveal>

            {/* DESKTOP: editorial operational timeline. A hairline rail with four
                cyan milestone markers connects the phases; beneath each marker,
                the servicer's obligation (light surface) sits above the matching
                DROS work (restrained navy panel with a cyan edge). Row grids keep
                the two responsibility bands aligned across all four stages. */}
            <div className="mt-12 hidden lg:block">
              {/* rail: cyan milestone markers centered over each phase column,
                  joined by a hairline that passes through all four centers.
                  The line insets by half a column width: (100% - 3*gap) / 8. */}
              <Reveal className="relative grid grid-cols-4 gap-6">
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-[5px] h-px bg-line-dark"
                  style={{ left: 'calc((100% - 72px) / 8)', right: 'calc((100% - 72px) / 8)' }}
                />
                {PHASES.map((ph) => (
                  <div key={ph.days} className="relative flex flex-col items-center text-center">
                    <span aria-hidden className="relative z-10 h-2.5 w-2.5 rounded-full bg-accent" />
                    <div className="mt-5">
                      <div className="font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-dark">{ph.days}</div>
                      <div className="mt-1 text-[13px] leading-snug text-ink-grey">{ph.label}</div>
                    </div>
                  </div>
                ))}
              </Reveal>

              {/* each phase is one split card: the servicer's obligation (light,
                  top half) sits directly on the matching DROS work (navy, bottom
                  half) with no gap, so the two read as one operational stage.
                  Row grids keep both bands aligned across all four phases. */}
              <Reveal delay={0.05} className="mt-7">
                <div className="grid grid-cols-4 items-stretch gap-6">
                  {PHASES.map((ph) => (
                    <div key={ph.days} className="rounded-t-xl border border-b-0 border-line-dark bg-white px-6 pb-5 pt-6">
                      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-grey">Your obligations</div>
                      <p className="mt-3 text-[14px] leading-[22px] text-ink-dark">{ph.obligation}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-4 items-stretch gap-6">
                  {PHASES.map((ph) => (
                    <div key={ph.days} className="relative overflow-hidden rounded-b-xl bg-ink-dark px-6 pb-6 pl-7 pt-5">
                      <span aria-hidden className="absolute inset-y-5 left-0 w-[3px] rounded-full bg-accent" />
                      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">What DROS does</div>
                      <p className="mt-3 text-[14px] leading-[22px] text-white/85">{ph.dros}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* MOBILE: the same timeline as a vertical progression. A rail with
                cyan nodes links the phases; each phase is one split card
                (obligation over DROS). No horizontal scroll. */}
            <Reveal delay={0.1} className="mt-10 lg:hidden">
              {PHASES.map((ph, i) => {
                const last = i === PHASES.length - 1;
                return (
                  <div key={ph.days} className="flex gap-4">
                    <div className="flex flex-col items-center pt-1">
                      <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
                      {!last && <span aria-hidden className="mt-2 w-px flex-1 bg-line-dark" />}
                    </div>
                    <div className={`flex-1 ${last ? 'pb-0' : 'pb-8'}`}>
                      <div className="font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-dark">{ph.days}</div>
                      <div className="mt-1 text-[13px] text-ink-grey">{ph.label}</div>
                      <div className="mt-3.5 overflow-hidden rounded-xl border border-line-dark">
                        <div className="bg-white px-4 pb-3.5 pt-4">
                          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-grey">Your obligations</div>
                          <p className="mt-2 text-[14px] leading-[21px] text-ink-dark">{ph.obligation}</p>
                        </div>
                        <div className="relative bg-ink-dark px-4 pb-4 pl-5 pt-3.5">
                          <span aria-hidden className="absolute inset-y-3.5 left-0 w-[3px] rounded-full bg-accent" />
                          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">What DROS does</div>
                          <p className="mt-2 text-[14px] leading-[21px] text-white/85">{ph.dros}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Reveal>

            {/* footnote: an intentional editorial clarification beneath the timeline */}
            <Reveal className="mt-12 border-t border-line-dark pt-6">
              <div className="max-w-3xl">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-grey">Important distinction</div>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-grey">{FIRST120_FOOT}</p>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ── COMPLIANCE · The Compliance Gate: Check → Decide → Prove ── */}
        <Section tone="light" spacing="sm" id="compliance">
          <Container wide>
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-ink-grey">Compliance</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">No attempt goes out until it clears your rules.</Heading>
              <p className="mt-4 text-lg leading-relaxed text-ink-grey">Configured per portfolio and per investor. Applied before the contact, not sampled afterwards in QA.</p>
            </Reveal>

            <Reveal delay={0.1} className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_52px_minmax(0,1.16fr)_52px_minmax(0,1fr)] lg:items-start lg:gap-0">
              {/* 01 · CHECK */}
              <div className="lg:pr-10">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[12px] tabular-nums text-ink-grey/50">01</span>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-dark">Check</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-grey/50">&middot; Before every attempt</span>
                </div>
                <ul className="mt-6 divide-y divide-line-dark border-t border-line-dark">
                  {CHECKS.map(([c, tag]) => (
                    <li key={c} className="flex items-center justify-between gap-5 py-3">
                      <span className="flex items-center gap-3 text-[14px] leading-snug text-ink-dark">
                        <CheckIcon className="h-3.5 w-3.5 shrink-0 text-accent" />
                        {c}
                      </span>
                      <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-grey/55">{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div aria-hidden className="flex items-center justify-center lg:self-center lg:pt-10">
                <span className="h-6 w-px bg-line-dark lg:hidden" />
                <span className="hidden w-full items-center gap-1.5 lg:flex">
                  <span className="h-px flex-1 bg-line-dark" />
                  <svg viewBox="0 0 6 10" className="h-2.5 w-1.5 shrink-0 text-ink-grey/45" fill="none"><path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </div>

              {/* 02 · DECIDE (focal, elevated) */}
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[12px] tabular-nums text-accent">02</span>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-dark">Decide</span>
                </div>
                <div className="mt-6 rounded-card border border-line-dark bg-white p-6 shadow-[0_1px_2px_rgba(12,30,69,0.04),0_16px_36px_-20px_rgba(12,30,69,0.16)] sm:p-7">
                  <div className="relative overflow-hidden rounded-xl bg-accent/[0.07] p-5 pl-6">
                    <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-accent" />
                    <div className="text-[16.5px] font-semibold tracking-[-0.01em] text-ink-dark">Attempt goes out</div>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-grey">Recorded, transcribed and attached to the loan.</p>
                  </div>
                  <div className="relative mt-4 overflow-hidden rounded-xl bg-paper p-5 pl-6">
                    <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-ink-grey/25" />
                    <div className="text-[16.5px] font-semibold tracking-[-0.01em] text-ink-dark">Loan held</div>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-grey">Suppressed, or routed to your team instead.</p>
                  </div>
                </div>
              </div>

              <div aria-hidden className="flex items-center justify-center lg:self-center lg:pt-10">
                <span className="h-6 w-px bg-line-dark lg:hidden" />
                <span className="hidden w-full items-center gap-1.5 lg:flex">
                  <span className="h-px flex-1 bg-line-dark" />
                  <svg viewBox="0 0 6 10" className="h-2.5 w-1.5 shrink-0 text-ink-grey/45" fill="none"><path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </div>

              {/* 03 · PROVE (quiet editorial evidence) */}
              <div className="lg:pl-10">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[12px] tabular-nums text-ink-grey/50">03</span>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-dark">Prove</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-grey/50">&middot; Evidence and ownership</span>
                </div>
                <div className="mt-6 divide-y divide-line-dark border-t border-line-dark">
                  {COMPLIANCE_NOTES.map((n) => (
                    <div key={n.h} className="py-5 first:pt-5">
                      <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-ink-dark">{n.h}</h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-grey">{n.p}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal className="mt-10 flex flex-col gap-2 border-t border-line-dark pt-7 sm:flex-row sm:items-start sm:justify-between">
              <p className="max-w-2xl text-[12.5px] leading-relaxed text-ink-grey">{COMPLIANCE_DISCLAIMER}</p>
              <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.09em] text-ink-grey">SOC 2 Type II</span>
                <span aria-hidden className="text-ink-grey/40">/</span>
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.09em] text-ink-grey">US data hosting</span>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ── WHERE THE LINE FALLS (does / does not) ── */}
        <Section tone="light" spacing="sm" id="where-the-line-falls">
          <Container>
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-ink-grey">Where the line falls</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">What DROS does, and what it does not.</Heading>
              <p className="mt-4 text-lg leading-relaxed text-ink-grey">{LINE_INTRO}</p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-0">
              {/* DROS does */}
              <div className="lg:pr-12">
                <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">DROS does</div>
                <h3 className="mt-2 font-display text-[22px] leading-tight tracking-[-0.02em] text-ink-dark">Contact and follow-up</h3>
                <ul className="mt-6 divide-y divide-line-dark border-t border-line-dark">
                  {DOES_ITEMS.map((it) => (
                    <li key={it} className="flex items-start gap-3 py-3 text-[14.5px] leading-snug text-ink-dark">
                      <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                      {it}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-grey">{DOES_NOTE}</p>
              </div>
              {/* DROS does not */}
              <div className="lg:border-l lg:border-line-dark lg:pl-12">
                <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-grey">DROS does not</div>
                <h3 className="mt-2 font-display text-[22px] leading-tight tracking-[-0.02em] text-ink-dark">Anything the rules put on you</h3>
                <ul className="mt-6 divide-y divide-line-dark border-t border-line-dark">
                  {DOESNOT_ITEMS.map((it) => (
                    <li key={it} className="flex items-start gap-3 py-3 text-[14.5px] leading-snug text-ink-grey">
                      <svg viewBox="0 0 16 16" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-grey/50" fill="none" aria-hidden><path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                      {it}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-grey">{DOESNOT_NOTE}</p>
              </div>
            </Reveal>

            <Reveal className="mt-10 flex flex-col items-start gap-3 border-t border-line-dark pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[16px] text-ink-dark">Send this section to your compliance lead before you book anything.</p>
              <Button variant="onLight" size="lg" to="/book-meeting" onClick={() => trackCta('mortgagev2_line_book')} className="shrink-0">
                Book a 20-minute call <ArrowRight className="h-4 w-4" />
              </Button>
            </Reveal>
          </Container>
        </Section>

        {/* ── HOW IT FITS (system architecture figure) ── */}
        <Section tone="base" spacing="sm" id="how-it-fits">
          <Container wide>
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-ink/45">How it fits</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">Your servicing platform stays the system of record.</Heading>
              <p className="mt-4 text-lg leading-relaxed text-ink/55">
                DROS is an execution layer. It takes the loan file, works the borrower contact, and writes
                every outcome back where your team already looks.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <div
                role="img"
                aria-label="A loop: the servicing platform sends the loan file to DROS, DROS works the borrower contact across voice, text and email, and the outcomes are written back to the servicing platform."
                className="relative rounded-card border border-hair bg-surface/40 p-6 sm:p-9"
              >
                <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
                  <div className="rounded-xl border border-hair bg-surface-2/60 p-6">
                    <Kicker className="text-ink/40">System of record</Kicker>
                    <h3 className="mt-2 font-display text-[19px] text-ink">Your servicing platform</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/55">MSP &middot; LoanSphere &middot; Sagent or an in-house core</p>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent">Loan file</span>
                    <ArrowRight className="h-5 w-5 rotate-90 text-ink/35 lg:rotate-0" />
                  </div>
                  <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-6">
                    <Kicker className="text-accent">Works the contact</Kicker>
                    <h3 className="mt-2 font-display text-[19px] text-ink">DROS</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/60">Voice &middot; Text &middot; Email</p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink/55">Your rules applied per attempt</p>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent">Outcome</span>
                    <ArrowRight className="h-5 w-5 rotate-90 text-ink/35 lg:rotate-0" />
                  </div>
                  <div className="rounded-xl border border-hair bg-surface-2/60 p-6">
                    <Kicker className="text-ink/40">And the record of it</Kicker>
                    <h3 className="mt-2 font-display text-[19px] text-ink">What happened</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/55">Reached, booked, documents chased, paid, or no contact</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div aria-hidden className="relative hidden h-8 lg:block">
                    <svg viewBox="0 0 1000 32" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-accent/50" fill="none">
                      <path d="M 920 0 L 920 16 Q 920 26 910 26 L 90 26 Q 80 26 80 16 L 80 0" stroke="currentColor" strokeWidth="1.25" strokeDasharray="4 4" />
                      <path d="M 80 0 l -5 9 l 10 0 z" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-hair bg-surface-2/40 px-5 py-4 lg:mt-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent">Written back, same day</span>
                    <span aria-hidden className="hidden text-ink/25 sm:inline">&rarr;</span>
                    {['Attempt logged', 'Borrower reached', 'Call booked', 'Documents in', 'Recording'].map((chip) => (
                      <span key={chip} className="rounded-full border border-hair bg-base px-3 py-1 text-[12.5px] text-ink/65">{chip}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <p className="mt-6 max-w-3xl text-[14px] leading-relaxed text-ink/55">
              Connects by secure file exchange, API or webhook. No rip-and-replace, and no second
              system of record for your team to reconcile.
            </p>
          </Container>
        </Section>

        {/* ── WHO IT IS FOR (interactive audience selector) ── */}
        <Section tone="base" spacing="sm" id="who">
          <Container>
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-ink/45">Who it is for</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">Three books, three different pressures.</Heading>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
              <div
                role="tablist"
                aria-label="Audience types"
                className="-mx-6 flex gap-1 overflow-x-auto border-b border-hair px-6 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0 lg:border-b-0 lg:border-l lg:border-hair lg:px-0 [&::-webkit-scrollbar]:hidden"
              >
                {AUDIENCES.map((a, i) => {
                  const on = who === i;
                  return (
                    <button
                      key={a.h}
                      role="tab"
                      aria-selected={on}
                      aria-controls="mv2-who-panel"
                      id={`mv2-who-tab-${i}`}
                      onClick={() => setWho(i)}
                      className={`group flex shrink-0 items-baseline gap-3 whitespace-nowrap border-b-2 px-2 py-3.5 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 lg:-ml-px lg:shrink lg:whitespace-normal lg:border-b-0 lg:border-l-2 lg:px-5 lg:py-4 ${on ? 'border-accent' : 'border-transparent'}`}
                    >
                      <span className={`font-mono text-[12px] tabular-nums transition-colors ${on ? 'text-accent' : 'text-ink/30 group-hover:text-ink/55'}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={`font-display text-[16px] leading-tight tracking-[-0.01em] transition-colors lg:text-[18px] ${on ? 'text-ink' : 'text-ink/55 group-hover:text-ink/85'}`}>{a.h}</span>
                    </button>
                  );
                })}
              </div>

              <div role="tabpanel" id="mv2-who-panel" aria-labelledby={`mv2-who-tab-${who}`} key={who} className="animate-[fadeSlideUp_0.32s_ease] motion-reduce:animate-none">
                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent/70">{String(who + 1).padStart(2, '0')}</div>
                <h3 className="mt-3 font-display text-[26px] leading-tight tracking-[-0.02em] text-ink sm:text-[30px]">{AUDIENCES[who].h}</h3>
                <ul className="mt-7 divide-y divide-hair border-t border-hair">
                  {AUDIENCES[who].items.map((it, i) => (
                    <li key={it} className="flex gap-5 py-4">
                      <span className="shrink-0 pt-1 font-mono text-[12px] tabular-nums text-accent/70">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[16px] leading-relaxed text-ink/75">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal className="mt-10 flex flex-col items-start gap-3 border-t border-hair pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[16px] text-ink/70">Tell us which book you run. We will show you the cadence for it.</p>
              <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('mortgagev2_who_book')} className="shrink-0">
                Book a 20-minute call <ArrowRight className="h-4 w-4" />
              </Button>
            </Reveal>
          </Container>
        </Section>

        {/* ── FIELD REPORT (editorial report feature) ── */}
        <Section tone="light" spacing="sm" id="field-report">
          <Container>
            <Reveal className="border-y border-line-dark py-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3">
                    <Eyebrow className="text-ink-grey" bullet="none">Field report</Eyebrow>
                    <span className="font-mono text-[11px] text-ink-grey/60">&mdash; 2026</span>
                  </div>
                  <Heading as="h2" size="display" className="mt-4 text-ink-dark">The State of AI in Collections 2026.</Heading>
                  <p className="mt-4 text-lg leading-relaxed text-ink-grey">
                    Where adoption actually sits, and the gap between what teams bought and what they put into
                    production.
                  </p>
                </div>
                <Link
                  href="/adoption-gap-report-state-of-collections-2026"
                  onClick={() => trackCta('mortgagev2_field_report')}
                  className="group inline-flex shrink-0 items-center gap-2 text-[16px] font-medium text-ink-dark underline-offset-4 hover:underline"
                >
                  Read the Adoption Gap report
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ── FAQ (clean accordion) ── */}
        <Section tone="base" spacing="sm" id="faq">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
              <Reveal>
                <Eyebrow className="text-ink/45">Common questions</Eyebrow>
                <Heading as="h2" size="display" className="mt-4">DROS for mortgage servicers.</Heading>
              </Reveal>
              <Reveal stagger={0.05} className="border-t border-hair">
                {FAQ.map((faq, i) => (
                  <RevealItem key={faq.q}>
                    <div className="border-b border-hair">
                      <button
                        type="button"
                        aria-expanded={openFaq === i}
                        aria-controls={`mv2-faq-panel-${i}`}
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex w-full items-start justify-between gap-4 py-5 text-left"
                      >
                        <span className={`text-[16px] font-medium leading-snug transition-colors ${openFaq === i ? 'text-ink' : 'text-ink/85'}`}>{faq.q}</span>
                        <ChevronDown className={`mt-1 h-4 w-4 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-accent' : 'text-ink/40'}`} />
                      </button>
                      {openFaq === i && (
                        <p id={`mv2-faq-panel-${i}`} className="max-w-3xl pb-5 text-[14.5px] leading-relaxed text-ink/60">{faq.a}</p>
                      )}
                    </div>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ── NEXT STEP + CONTACT (focused conversion band) ── */}
        <Section tone="base" spacing="sm" id="book">
          <Container>
            <div className="overflow-hidden rounded-card border border-hair bg-surface/50">
              <div className="grid lg:grid-cols-[1.05fr_1fr]">
                <Reveal className="p-8 sm:p-10">
                  <Eyebrow className="text-ink/45">Next step</Eyebrow>
                  <Heading as="h2" size="display" className="mt-4 text-balance">See DROS on your delinquent book.</Heading>
                  <p className="mt-5 text-lg leading-relaxed text-ink/55">Bring your servicing platform, your investor mix and your current day-36 process.</p>
                  <ul className="mt-7 flex flex-col gap-3">
                    {NEXT_PERKS.map((it) => (
                      <li key={it} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink/70">
                        <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-accent" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('mortgagev2_nextstep_book')}>
                      Book a 20-minute call <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Reveal>

                <div id="contact" className="scroll-mt-28 border-t border-hair bg-surface-2/40 p-8 sm:p-10 lg:border-l lg:border-t-0">
                  <Reveal>
                    <h3 className="font-display text-[24px] leading-tight tracking-[-0.02em] text-ink">Or just write to us.</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink/55">Ask a question. A person will answer it.</p>

                    {sent ? (
                      <div className="mt-7 rounded-card border border-accent/30 bg-accent/[0.06] px-6 py-6 text-[15px] leading-relaxed text-ink/80">
                        Thanks &mdash; that is with us. Someone from the DROS team will
                        come back to you within one business day.
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3" noValidate>
                        <label className="flex flex-col gap-1.5">
                          <span className="text-[13px] text-ink/55">Name</span>
                          <input type="text" name="name" required className="h-[52px] rounded-btn border border-hair bg-base px-4 text-ink placeholder:text-ink/40 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30" />
                        </label>
                        <label className="flex flex-col gap-1.5">
                          <span className="text-[13px] text-ink/55">Work email</span>
                          <input type="email" name="email" required className="h-[52px] rounded-btn border border-hair bg-base px-4 text-ink placeholder:text-ink/40 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30" />
                        </label>
                        <label className="flex flex-col gap-1.5">
                          <span className="text-[13px] text-ink/55">Message</span>
                          <textarea name="message" required rows={4} className="rounded-btn border border-hair bg-base px-4 py-3 text-ink placeholder:text-ink/40 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30" />
                        </label>
                        <button type="submit" className="mt-1 inline-flex h-[52px] items-center justify-center gap-2 self-start rounded-full bg-white px-6 text-sm font-medium text-[#0C1E45] transition-opacity hover:opacity-90">
                          Send message <ArrowRight className="h-4 w-4" />
                        </button>
                        <p className="mt-1 text-[13px] text-ink/40">We reply from a person, usually within one business day.</p>
                      </form>
                    )}
                  </Reveal>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </PageFade>
  );
}
