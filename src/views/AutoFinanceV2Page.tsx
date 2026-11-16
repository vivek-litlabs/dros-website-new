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
 * Auto Finance (v2) - standalone, independent route /auto-finance-v2.
 *
 * CONTENT: sourced verbatim from the client mock (root indexxx.html). No visible
 *   wording is added, removed or paraphrased. HTML entities render as unicode (— – · • &).
 * DESIGN: art-directed on the DROS design system. Each section has its own
 *   composition (editorial hero, financial chart, editorial columns, a large
 *   product-surface tab showcase, an operational ledger, a differentiated audience
 *   index, a rule-engine panel, a system-architecture figure, a report feature,
 *   a clean accordion, a focused conversion band). Borders give way to whitespace
 *   and hairline dividers; the single DROS teal is the only accent.
 * ARCHITECTURE: NOT in the Who We Serve nav/dropdown. Independent of /auto-finance.
 *
 * INTEGRATION NOTES:
 *   - Booking CTAs ("Book a 20-minute call") route to the existing /book-meeting
 *     route; the HubSpot scheduler referenced in the brief is NOT configured here.
 *   - The contact form replicates the source's client-side behaviour only: it shows
 *     a success state and does NOT transmit submissions anywhere.
 */

const TRUST = ['SOC 2 Type II', 'TCPA', 'UDAAP', 'SCRA flags', 'FDCPA & Reg F for third-party', 'US data hosting'];

const LADDER = [
  { cap: 'Pre-due', small: 'Before due date', h: 12, o: 0.22, decide: 'Reminder policy', cover: 'Reminders' },
  { cap: '1\u201329', small: 'Days past due', h: 22, o: 0.34, decide: 'Fee waivers, promise dating', cover: 'First contact, promise captured' },
  { cap: '30\u201359', small: 'Days past due', h: 38, o: 0.5, decide: 'Extensions and deferrals', cover: 'Affordability, routed to a collector' },
  { cap: '60\u201389', small: 'Days past due', h: 58, o: 0.68, decide: 'Repossession review', cover: 'Documented contact before review' },
  { cap: '90+', small: 'To charge-off', h: 82, o: 0.86, decide: 'Assignment, notices, charge-off', cover: 'Attempts and recordings on file' },
  { cap: 'Post', small: 'Charge-off', h: 100, o: 1, decide: 'Keep, place or sell', cover: 'Coverage across placements' },
];

const CHANGES = [
  { h: 'Coverage, not triage', p: 'Every account worked on the day it should be \u2014 including the early ones that normally wait their turn.' },
  { h: 'The account, before the call', p: 'Balance, bucket, prior promises, prior contacts and consent are loaded before the attempt starts.' },
  { h: 'Rules applied, not audited', p: 'Caps, quiet hours, consent and approved scripts enforced before each attempt, not caught in a QA sample after.' },
];

const TABS = [
  { num: '01', title: 'Context-aware AI agents', body: 'The agent opens the account, not a script. Right party confirmed before any detail is discussed.' },
  { num: '02', title: 'One cadence, three channels', body: 'Voice, text and email run as one sequence. Whichever the borrower answers on, the account stays a single record.' },
  { num: '03', title: 'Promise-to-pay engine', body: 'A promise is worth what the follow-up is worth. Captured, confirmed, reminded \u2014 and picked back up the same day it breaks.' },
  { num: '04', title: 'Payments and pay links', body: 'The shortest path to money is the message the borrower is already holding.' },
  { num: '05', title: 'Hand-off with the whole file', body: 'DROS does not approve extensions, deferrals or hardship. It gets the request to the person who decides, with the transcript attached.' },
  { num: '06', title: 'Per-account audit trail', body: 'Promises due, promises broken, accounts reached and not reached \u2014 and the record behind every one of them.' },
];

const ACCOUNT_ROWS = [
  ['Balance', '$14,208.40'],
  ['Next due', '12 Oct'],
  ['Bucket', '38 days past due'],
  ['Prior promises', '2 kept \u00b7 1 broken'],
  ['Prior contacts', '6 attempts \u00b7 1 right party'],
  ['Flags', 'SCRA no \u00b7 Bankruptcy no'],
];

const CADENCE: { ch: string; cells: boolean[] }[] = [
  { ch: 'Voice', cells: [true, false, true, false] },
  { ch: 'Text', cells: [false, true, false, true] },
  { ch: 'Email', cells: [true, false, false, false] },
];

const AUDIT = [
  ['04 Nov 09:12', 'Voice \u00b7 right party confirmed'],
  ['04 Nov 09:14', 'Promise captured \u00b7 $412.80 on 12 Nov'],
  ['07 Nov 10:30', 'SMS \u00b7 written confirmation sent'],
  ['11 Nov 16:02', 'Voice \u00b7 reminder, no answer'],
  ['12 Nov 11:48', 'Payment taken \u00b7 $412.80'],
];

const BORROWER = [
  { k: 'Tone', v: 'Your scripts, your disclosures, your approved offers.' },
  { k: 'Timing', v: '24/7, on the channel the borrower actually uses.' },
  { k: 'Memory', v: 'Nobody is asked to explain themselves twice.' },
  { k: 'Escape', v: 'A person is always one ask away, with the full history.' },
];

const JOBS = [
  { tag: 'PRE-DUE & 1\u201329 DPD', h: 'Reminders and first contact', p: 'Remove the obstacle before avoidance sets in. The promise comes back with a date and an amount.' },
  { tag: 'FIRST-PAYMENT DEFAULT', h: 'Accounts that never made payment one', p: 'A booking problem, not a collections problem. Verify the contact details off the deal and get the file to the right team early.' },
  { tag: '30\u201359 DPD', h: 'Affordability, captured accurately', p: 'The borrower explains once. Extension and hardship requests reach your collector with the account state attached.' },
  { tag: '60\u201389 DPD', h: 'Documented coverage before review', p: 'Every account heading into repossession review arrives with a complete, dated contact history.' },
];

const AUDIENCES = [
  { h: 'Captives and prime lenders', items: ['Early coverage without headcount', 'Brand-safe tone and disclosures', 'Retention, not just recovery'] },
  { h: 'Credit unions, indirect auto', items: ['Member-appropriate on every contact', 'A book bigger than the floor', 'Hardship routed to a person, fast'] },
  { h: 'Subprime and buy-here-pay-here', items: ['Payday-aligned, weekly cadences', 'Repeat attempts to find the right party', 'Bad numbers flagged, not redialled'] },
  { h: 'Agencies working auto paper', items: ['FDCPA and Reg F before each attempt', 'Call records when a client asks', 'Consistent coverage per placement'] },
];

const CHECKS = [
  ['Consent, per channel and per number', 'TCPA'],
  ['Quiet hours and contact caps', 'TCPA'],
  ['State rule set for that account', 'State law'],
  ['Servicemember flag', 'SCRA'],
  ['Bankruptcy or deceased flag', 'Suppression'],
  ['Approved script library', 'UDAAP'],
  ['Right party confirmed on the call', 'Before any detail'],
];

const COMPLIANCE_NOTES = [
  { h: 'Third-party placements', p: 'Collecting on behalf of another holder? FDCPA and Reg F apply in full, on top of everything in the panel.' },
  { h: 'Evidence on demand', p: 'Disclosures given, consent events and the recording sit on the account, for an examiner or a client.' },
  { h: 'Repossession stays yours', p: 'Right-to-cure notices and the UCC Article 9 notice of disposition stay with your team and your counsel. DROS works the window before that decision.' },
];

const FAQ: { q: string; a: string }[] = [
  { q: 'Do FDCPA and Reg F apply to us if we own the paper?', a: 'Generally not \u2014 both govern collecting a debt owed to another. But TCPA, UDAAP, SCRA, bankruptcy protections and state statutes still apply, and several states extend FDCPA-style rules to original creditors. DROS is configured for the programme you actually run. Confirm your position with counsel.' },
  { q: 'Does the agent tell borrowers it is automated?', a: 'Where your disclosure policy says it should, in wording you approve. Disclosure language sits in the script library and is recorded against the attempt.' },
  { q: 'Does DROS approve extensions or deferrals?', a: 'No. An extension moves the maturity, a deferral moves the schedule \u2014 both are lender decisions with policy and reporting consequences. DROS captures the request and routes it to your collector with the account state attached.' },
  { q: 'Does it touch the repossession process?', a: 'No. Assignment, right-to-cure notices and the UCC Article 9 notice of disposition stay with your team. DROS works the window before that decision.' },
  { q: 'Does it replace our servicing platform or dialer?', a: 'No. DROS sits on top. Your servicing platform stays the system of record; DROS works the accounts and writes outcomes back by file exchange, API or webhook.' },
  { q: 'What happens to our collections team?', a: 'They stop spending the day on attempts that do not connect. DROS covers volume; your collectors take the conversations that need judgement \u2014 negotiation, hardship, disputes and late-stage files.' },
  { q: 'What does it cost?', a: 'It depends on portfolio size, channel mix and volume. Bring your book profile to a 20-minute call and we will model it against your current cost to collect.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

// A quiet mono label used inside product surfaces.
function Kicker({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`font-mono text-[10.5px] uppercase tracking-[0.11em] ${className}`}>{children}</div>;
}

// ── Platform tab diagrams: each a distinct, larger product surface ───────────
function PlatformFigure({ tab }: { tab: number }) {
  // 01 — Context-aware account surface
  if (tab === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between border-b border-hair pb-3">
          <Kicker className="text-ink/40">Example account, loaded before the attempt</Kicker>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> loaded
          </span>
        </div>
        <dl className="mt-2 grid grid-cols-1 sm:grid-cols-2">
          {ACCOUNT_ROWS.map(([k, v], i) => (
            <div key={k} className={`flex items-baseline justify-between gap-4 py-3 ${i < ACCOUNT_ROWS.length - (ACCOUNT_ROWS.length % 2 === 0 ? 2 : 1) ? 'border-b border-hair' : ''} sm:[&:nth-child(odd)]:pr-8 sm:[&:nth-child(even)]:pl-8 sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:border-hair`}>
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
          One account record underneath
        </div>
      </div>
    );
  }
  // 03 — Promise-to-pay timeline with a fork
  if (tab === 2) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between border-b border-hair pb-3">
          <Kicker className="text-ink/40">Promise to pay</Kicker>
          <span className="font-mono text-[11px] text-accent">$412.80 &middot; due 12 Nov</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[['Captured', 'date + amount'], ['Confirmed', 'in writing'], ['Reminded', 'day before']].map(([k, v], i) => (
            <div key={k} className="relative">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 font-mono text-[11px] text-accent">{i + 1}</span>
                {i < 2 && <span className="h-px flex-1 bg-hair" />}
              </div>
              <div className="mt-2.5 text-[13.5px] font-semibold text-ink">{k}</div>
              <div className="text-[12px] text-ink/45">{v}</div>
            </div>
          ))}
        </div>
        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-hair" />
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink/40">Due date &middot; 12 Nov</span>
          <span className="h-px flex-1 bg-hair" />
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <div className="rounded-lg bg-accent/[0.07] p-4">
            <div className="text-[14px] font-semibold text-ink">Kept</div>
            <div className="mt-1 text-[12.5px] text-ink/55">booked, account updated</div>
          </div>
          <div className="rounded-lg bg-surface-2/70 p-4">
            <div className="text-[14px] font-semibold text-ink">Broken</div>
            <div className="mt-1 text-[12.5px] text-ink/55">followed up the same day, back into the cadence</div>
          </div>
        </div>
      </div>
    );
  }
  // 04 — Pay-link flow
  if (tab === 3) {
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
            <div className="mt-1 font-display text-[22px] text-ink">$412.80</div>
          </div>
        </div>
        <div className="mt-4 space-y-1 border-t border-hair pt-4 text-[13px] text-ink/55">
          <p>Booked against the account, same day.</p>
          <p>Card details stay with your payment provider.</p>
        </div>
      </div>
    );
  }
  // 05 — Hand-off routing
  if (tab === 4) {
    return (
      <div className="grid gap-6 md:grid-cols-[1fr_auto_210px] md:items-center">
        <div>
          <Kicker className="text-ink/40">Hands off when the borrower</Kicker>
          <ul className="mt-3 divide-y divide-hair border-y border-hair">
            {['asks for an extension or deferral', 'raises a hardship or disputes the balance', 'asks to speak to a person', 'mentions bankruptcy, service or a death'].map((it) => (
              <li key={it} className="flex items-center gap-3 py-2.5 text-[14px] text-ink/80">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {it}
              </li>
            ))}
          </ul>
        </div>
        <ArrowRight className="mx-auto h-5 w-5 rotate-90 text-ink/35 md:rotate-0" />
        <div className="rounded-xl bg-surface-2/80 p-5 text-center">
          <div className="text-[15px] font-semibold text-ink">Your collector</div>
          <div className="mt-4 border-t border-hair pt-3">
            <Kicker className="text-ink/40">Meanwhile</Kicker>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink/55">DROS keeps working every other account in the book.</p>
          </div>
        </div>
      </div>
    );
  }
  // 06 — Audit log timeline
  return (
    <div className="w-full">
      <Kicker className="border-b border-hair pb-3 text-ink/40">One account, in order</Kicker>
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

export default function AutoFinanceV2Page() {
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
            <div className="max-w-[16ch] pt-28 sm:max-w-3xl md:max-w-4xl md:pt-36">
              <Reveal>
                <Eyebrow className="text-white/55">Auto finance</Eyebrow>
              </Reveal>
              <Reveal large>
                <h1 className="mt-6 font-saans text-[40px] font-medium leading-[1.0] tracking-[-0.035em] sm:text-[56px] lg:text-[68px]">
                  AI agents for auto loan collections.
                </h1>
              </Reveal>
            </div>
            <div className="mt-8 max-w-xl pb-16">
              <Reveal>
                <p className="text-lg leading-relaxed text-white/70">
                  Voice, text and email across your whole delinquent book &mdash; inside your rules,
                  on top of your servicing platform.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('afv2_hero_book')}>
                    Book a 20-minute call <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="lg" href="#contact" onClick={() => trackCta('afv2_hero_talk')}>
                    Talk to us
                  </Button>
                </div>
              </Reveal>
            </div>
          </Container>
          {/* trust strip, integrated into the hero base */}
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

        {/* ── DELINQUENCY LADDER (financial data visualization) ── */}
        <Section tone="light" spacing="sm" id="ladder">
          <Container>
            {/* two-column header: title left, legend key right - keeps the chart
                high in the viewport instead of a full screen of heading. */}
            <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <Eyebrow className="text-ink-grey">The delinquency ladder</Eyebrow>
                <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                  An account cures out of a bucket, or it rolls into the next.
                </Heading>
                <p className="mt-4 text-lg leading-relaxed text-ink-grey">
                  Every bucket it rolls into costs more to resolve. DROS works all six, every day.
                </p>
              </div>
              {/* legend/key: swatches tie the two marks to their meaning;
                  left-aligned in a fixed measure so nothing orphans. */}
              <div className="shrink-0 space-y-2.5 lg:w-[300px]">
                <div className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink-grey">
                  <span aria-hidden className="mt-[3px] h-3.5 w-2.5 shrink-0 rounded-[1px] bg-accent" />
                  <span><b className="font-semibold text-ink-dark">Bars</b> &mdash; relative cost to resolve. Illustrative.</span>
                </div>
                <div className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink-grey">
                  <span aria-hidden className="mt-[3px] h-3.5 w-2.5 shrink-0 rounded-[1px] bg-ink-dark" />
                  <span><b className="font-semibold text-ink-dark">Row 1</b> &mdash; what you decide. <b className="font-semibold text-ink-dark">Row 2</b> &mdash; where DROS runs.</span>
                </div>
              </div>
            </Reveal>

            {/* chart figure - one shared 64px gutter + 6-col plot so bars, axis
                and both lanes line up as a single data visualization. */}
            <Reveal delay={0.1} className="mt-9 overflow-x-auto pb-1">
              <figure className="min-w-[860px]">
                {/* bars */}
                <div className="grid grid-cols-[92px_1fr]">
                  <div className="flex flex-col justify-between py-1 pr-4 text-right">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-grey">cost</span>
                    <span className="font-mono text-[10px] text-ink-grey/50">low</span>
                  </div>
                  <div className="relative">
                    <div aria-hidden className="absolute inset-0 flex flex-col justify-between">
                      {[0, 1, 2, 3, 4].map((i) => <span key={i} className="h-px w-full bg-line-dark/60" />)}
                    </div>
                    <div className="relative grid grid-cols-6 items-end gap-4" style={{ height: 196 }}>
                      {LADDER.map((l) => (
                        <div key={l.cap} className="flex h-full flex-col justify-end">
                          <div className="mx-auto w-[72%] rounded-t-[4px] bg-accent" style={{ height: `${l.h}%`, opacity: l.o }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* x-axis baseline + bucket names */}
                <div className="grid grid-cols-[92px_1fr] border-t-2 border-ink-dark">
                  <div />
                  <div className="grid grid-cols-6 gap-4">
                    {LADDER.map((l) => (
                      <div key={l.cap} className="pt-3 text-center">
                        <div className="font-display text-[15px] font-semibold leading-tight tracking-[-0.015em] text-ink-dark">{l.cap}</div>
                        <div className="text-[11.5px] text-ink-grey">{l.small}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* two explanatory rows presented as one bordered table with
                    row headers, aligned to the same 92px gutter as the bars. */}
                <div className="mt-6 overflow-hidden rounded-[8px] border border-line-dark">
                  <div className="grid grid-cols-[92px_1fr]">
                    <div className="flex items-center border-r border-line-dark bg-paper px-3 py-3 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-grey">You decide</div>
                    <div className="grid grid-cols-6 bg-white">
                      {LADDER.map((l, i) => (
                        <div key={l.cap} className={`px-3 py-3 text-[12.5px] leading-[17px] text-ink-grey ${i > 0 ? 'border-l border-line-dark' : ''}`}>{l.decide}</div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-[92px_1fr] border-t border-line-dark bg-ink-dark">
                    <div className="flex items-center border-r border-white/10 px-3 py-3 font-mono text-[10px] uppercase tracking-[0.08em] text-accent">DROS runs</div>
                    <div className="grid grid-cols-6">
                      {LADDER.map((l, i) => (
                        <div key={l.cap} className={`px-3 py-3 text-[12px] font-medium leading-[17px] text-white ${i > 0 ? 'border-l border-white/10' : ''}`}>
                          <span className="text-accent">&bull;</span> {l.cover}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </figure>
            </Reveal>

            {/* compact footer: FFIEC note + the single inline CTA on one line */}
            <Reveal className="mt-7 border-t border-line-dark pt-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <p className="max-w-xl text-[13px] leading-relaxed text-ink-grey">
                  <b className="font-semibold text-ink-dark">Charge-off</b> follows your own written policy. FFIEC guidance cites 120 cumulative
                  days past due for closed-end retail loans at covered institutions.
                </p>
                <div className="flex flex-col items-start gap-3 md:items-end">
                  <p className="text-[16px] text-ink-dark">See where DROS would sit on your own bucket structure.</p>
                  <Button variant="onLight" size="lg" to="/book-meeting" onClick={() => trackCta('afv2_ladder_book')} className="shrink-0">
                    Book a 20-minute call <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ── WHAT CHANGES (editorial three-column) ── */}
        <Section tone="base" spacing="sm" id="changes">
          <Container>
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-ink/45">What changes</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">Three differences, from week one.</Heading>
            </Reveal>
            <Reveal stagger={0.1} className="mt-10 grid gap-y-8 md:grid-cols-3 md:gap-x-0">
              {CHANGES.map((c, i) => (
                <RevealItem key={c.h} className={`md:px-8 md:first:pl-0 md:last:pr-0 ${i > 0 ? 'md:border-l md:border-hair' : ''}`}>
                  <div className="font-mono text-[12px] tracking-[0.1em] text-accent">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="mt-4 font-display text-[22px] leading-tight tracking-[-0.02em] text-ink">{c.h}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/55">{c.p}</p>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── PLATFORM (product showcase, 6 distinct surfaces) ── */}
        <Section tone="light" spacing="sm" id="platform">
          <Container>
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-ink-grey">Platform</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">It is not only the voice agent.</Heading>
              <p className="mt-4 text-lg leading-relaxed text-ink-grey">The parts of DROS an auto collections team runs day to day.</p>
            </Reveal>

            <div className="mt-10 grid gap-6 lg:grid-cols-[290px_1fr] lg:gap-10">
              {/* numbered rail */}
              <div role="tablist" aria-label="DROS capabilities" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-l lg:border-line-dark lg:pb-0">
                {TABS.map((t, i) => {
                  const on = tab === i;
                  return (
                    <button
                      key={t.num}
                      role="tab"
                      aria-selected={on}
                      aria-controls={`afv2-panel-${i}`}
                      id={`afv2-tab-${i}`}
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

              {/* product surface */}
              <div
                role="tabpanel"
                id={`afv2-panel-${tab}`}
                aria-labelledby={`afv2-tab-${tab}`}
                className="overflow-hidden rounded-card border border-line-dark bg-white"
              >
                <div className="border-b border-line-dark px-6 py-4 sm:px-8">
                  <h3 className="text-[21px] font-semibold text-ink-dark">{TABS[tab].title}</h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-grey">{TABS[tab].body}</p>
                </div>
                {/* dark product surface to echo the DROS app chrome */}
                <div className="bg-base px-6 py-7 text-ink sm:px-8 sm:py-8">
                  <PlatformFigure tab={tab} />
                </div>
              </div>
            </div>

            <Reveal className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[16px] text-ink-dark">Walk the platform with someone who knows auto collections.</p>
              <Button variant="onLight" size="lg" to="/book-meeting" onClick={() => trackCta('afv2_platform_book')} className="shrink-0">
                Book a 20-minute call <ArrowRight className="h-4 w-4" />
              </Button>
            </Reveal>
          </Container>
        </Section>

        {/* ── BORROWER EXPERIENCE (human-centered editorial) ── */}
        <Section tone="base" spacing="sm" id="borrower">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)] lg:gap-16">
              <Reveal>
                <Eyebrow className="text-ink/45">Borrower experience</Eyebrow>
                <Heading as="h2" size="display" className="mt-4 text-balance">It is your brand on the call.</Heading>
                <p className="mt-5 text-lg leading-relaxed text-ink/55">
                  An early conversation about a missed payment is a retention moment, not just a recovery one.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('afv2_borrower_book')}>
                    Book a 20-minute call <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="lg" href="#contact">Talk to us</Button>
                </div>
              </Reveal>
              <Reveal delay={0.1} className="lg:pt-2">
                <dl className="divide-y divide-hair border-t border-hair">
                  {BORROWER.map((b) => (
                    <div key={b.k} className="grid grid-cols-[120px_1fr] gap-5 py-5">
                      <dt className="font-display text-[18px] leading-none tracking-[-0.01em] text-ink">{b.k}</dt>
                      <dd className="text-[15.5px] leading-relaxed text-ink/60">{b.v}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ── WHERE IT RUNS (connected four-stage progression) ── */}
        <Section tone="light" spacing="sm" id="where">
          <Container>
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-ink-grey">Where it runs</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">Four jobs an auto team hands to DROS.</Heading>
            </Reveal>

            {/* A single vertical rail connects four stages. Restrained numbered
                nodes sit on the rail; the heading leads, the DPD label is a mono
                eyebrow, the description is a quieter aligned column alongside. */}
            <Reveal stagger={0.1} className="mt-10">
              {JOBS.map((j, i) => {
                const last = i === JOBS.length - 1;
                return (
                  <RevealItem key={j.h}>
                    <div className="group flex gap-5 sm:gap-7">
                      {/* progression rail: node + connector */}
                      <div className="flex flex-col items-center">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-dark bg-white font-mono text-[12px] text-ink-grey transition-colors duration-300 group-hover:border-accent/50 group-hover:text-ink-dark">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {!last && (
                          <span aria-hidden className={`mt-1.5 w-px flex-1 ${i === 0 ? 'bg-gradient-to-b from-accent/40 to-line-dark' : 'bg-line-dark'}`} />
                        )}
                      </div>
                      {/* stage content: heading block + aligned description */}
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

        {/* ── WHO IT IS FOR (interactive audience selector) ── */}
        <Section tone="base" spacing="sm" id="who">
          <Container>
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-ink/45">Who it is for</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">Four auto books. Four different problems.</Heading>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
              {/* left: audience navigation. Horizontally scrollable, underline
                  tabs on mobile; a vertical accent-rail list on desktop. */}
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
                      aria-controls="afv2-who-panel"
                      id={`afv2-who-tab-${i}`}
                      onClick={() => setWho(i)}
                      className={`group flex shrink-0 items-baseline gap-3 whitespace-nowrap border-b-2 px-2 py-3.5 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 lg:-ml-px lg:shrink lg:whitespace-normal lg:border-b-0 lg:border-l-2 lg:px-5 lg:py-4 ${on ? 'border-accent' : 'border-transparent'}`}
                    >
                      <span className={`font-mono text-[12px] tabular-nums transition-colors ${on ? 'text-accent' : 'text-ink/30 group-hover:text-ink/55'}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={`font-display text-[16px] leading-tight tracking-[-0.01em] transition-colors lg:text-[18px] ${on ? 'text-ink' : 'text-ink/55 group-hover:text-ink/85'}`}>{a.h}</span>
                    </button>
                  );
                })}
              </div>

              {/* right: featured audience - re-keys to fade in on each selection. */}
              <div
                role="tabpanel"
                id="afv2-who-panel"
                aria-labelledby={`afv2-who-tab-${who}`}
                key={who}
                className="animate-[fadeSlideUp_0.32s_ease] motion-reduce:animate-none"
              >
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
              <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('afv2_who_book')} className="shrink-0">
                Book a 20-minute call <ArrowRight className="h-4 w-4" />
              </Button>
            </Reveal>
          </Container>
        </Section>

        {/* ── COMPLIANCE · The Compliance Gate: Check → Decide → Prove ── */}
        <Section tone="light" spacing="sm" id="compliance">
          <Container wide>
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-ink-grey">Compliance</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">No attempt goes out until it clears your rules.</Heading>
              <p className="mt-4 text-lg leading-relaxed text-ink-grey">Configured per portfolio. Applied before the contact, not sampled afterwards in QA.</p>
            </Reveal>

            {/* The gate: flat CHECK inputs → elevated DECIDE focal → quiet PROVE.
                Thin connecting lines (not buttons) carry the directional flow; only
                DECIDE is raised, so it reads as the focal point, not three boxes. */}
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
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-accent" fill="none" aria-hidden><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        {c}
                      </span>
                      <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-grey/55">{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* connector 1: thin line + arrowhead (desktop), short rule (mobile) */}
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
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-grey">Recorded, transcribed and attached to the account.</p>
                  </div>
                  <div className="relative mt-4 overflow-hidden rounded-xl bg-paper p-5 pl-6">
                    <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-ink-grey/25" />
                    <div className="text-[16.5px] font-semibold tracking-[-0.01em] text-ink-dark">Account held</div>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-grey">Suppressed, or routed to your team instead.</p>
                  </div>
                </div>
              </div>

              {/* connector 2 */}
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

            {/* compact compliance footer + disclaimer, then the CTA */}
            <Reveal className="mt-10 flex flex-col gap-2 border-t border-line-dark pt-7 sm:flex-row sm:items-start sm:justify-between">
              <p className="max-w-2xl text-[12.5px] leading-relaxed text-ink-grey">
                Nothing on this page is legal advice. DROS enforces the rules you configure; your
                programme should be confirmed with your own counsel.
              </p>
              <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.09em] text-ink-grey">SOC 2 Type II</span>
                <span aria-hidden className="text-ink-grey/40">/</span>
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.09em] text-ink-grey">US data hosting</span>
              </div>
            </Reveal>
            <Reveal className="mt-7 flex flex-col items-start gap-4 border-t border-line-dark pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[16px] text-ink-dark">Bring your compliance lead. The rule set is configured in front of you.</p>
              <Button variant="onLight" size="lg" to="/book-meeting" onClick={() => trackCta('afv2_compliance_book')} className="shrink-0">
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
                DROS is an execution layer. It takes the account file, works the accounts, and writes
                every outcome back where your team already looks.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <div
                role="img"
                aria-label="A loop: the servicing platform sends the account file to DROS, DROS works the account across voice, text and email, and the outcomes are written back to the servicing platform."
                className="relative rounded-card border border-hair bg-surface/40 p-6 sm:p-9"
              >
                {/* forward flow: three nodes + labelled connectors */}
                <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
                  <div className="rounded-xl border border-hair bg-surface-2/60 p-6">
                    <Kicker className="text-ink/40">System of record</Kicker>
                    <h3 className="mt-2 font-display text-[19px] text-ink">Your servicing platform</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/55">Shaw &middot; Nortridge &middot; defi or an in-house core</p>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent">Account file</span>
                    <ArrowRight className="h-5 w-5 rotate-90 text-ink/35 lg:rotate-0" />
                  </div>
                  <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-6">
                    <Kicker className="text-accent">Works the account</Kicker>
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
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/55">Promise, payment, dispute, hardship, or no contact</p>
                  </div>
                </div>

                {/* written-back return path */}
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
                    {['Contact attempted', 'Right party', 'Promise to pay', 'Payment taken', 'Recording'].map((chip) => (
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
                  onClick={() => trackCta('afv2_field_report')}
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
                <Heading as="h2" size="display" className="mt-4">DROS for auto lenders.</Heading>
              </Reveal>
              <Reveal stagger={0.05} className="border-t border-hair">
                {FAQ.map((faq, i) => (
                  <RevealItem key={faq.q}>
                    <div className="border-b border-hair">
                      <button
                        type="button"
                        aria-expanded={openFaq === i}
                        aria-controls={`afv2-faq-panel-${i}`}
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex w-full items-start justify-between gap-4 py-5 text-left"
                      >
                        <span className={`text-[16px] font-medium leading-snug transition-colors ${openFaq === i ? 'text-ink' : 'text-ink/85'}`}>{faq.q}</span>
                        <ChevronDown className={`mt-1 h-4 w-4 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-accent' : 'text-ink/40'}`} />
                      </button>
                      {openFaq === i && (
                        <p id={`afv2-faq-panel-${i}`} className="max-w-3xl pb-5 text-[14.5px] leading-relaxed text-ink/60">{faq.a}</p>
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
                {/* next step */}
                <Reveal className="p-8 sm:p-10">
                  <Eyebrow className="text-ink/45">Next step</Eyebrow>
                  <Heading as="h2" size="display" className="mt-4 text-balance">See DROS on your delinquent auto book.</Heading>
                  <p className="mt-5 text-lg leading-relaxed text-ink/55">Bring your servicing platform, your buckets and your cure policy.</p>
                  <ul className="mt-7 flex flex-col gap-3">
                    {['20 minutes, no commitment', 'Your stack reviewed, including what we do not integrate with', 'Cadence modelled against your own bucket structure'].map((it) => (
                      <li key={it} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink/70">
                        <svg viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-accent" fill="none" aria-hidden><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        {it}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('afv2_nextstep_book')}>
                      Book a 20-minute call <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Reveal>

                {/* contact form */}
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
