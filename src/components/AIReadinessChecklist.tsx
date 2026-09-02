import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Lock, RotateCcw, ArrowRight, Download } from 'lucide-react';
import { springStd } from '../lib/motion';
import { trackCta, trackEvent } from '../lib/analytics';

/**
 * Interactive, client-side voice AI readiness assessment used by the
 * /blogs/ai-readiness-checklist-collection-agencies post.
 *
 * Answers themselves are never sent anywhere; only three anonymous, no-PII
 * GA4 events fire (checklist started / results downloaded / CTA clicked),
 * each carrying just the aggregate score and band label. See the privacy
 * note copy below, which reflects this.
 *
 * Four questions are rewritten per segment (third-party agency, first-party
 * creditor, debt buyer) because the client-contract blocker is a placement
 * agreement question, an internal approval question, and a forward-flow
 * question respectively.
 */

type Seg = 'tp' | 'fp' | 'db';
type GroupKey = 'org' | 'comm' | 'sys' | 'cli';
type CriticalKey = 'collectors' | 'writeback' | 'clients';

type SegText = string | Record<Seg, string>;

/**
 * Near-critically damped springs for the interactive bits. The shared
 * springSnappy is overdamped (ratio ~4.2) and crawls toward its target, which
 * is wrong for a pill that has to keep up with a click.
 */
const pillSpring = { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 } as const;
const nudgeSpring = { type: 'spring', stiffness: 500, damping: 32, mass: 0.5 } as const;

const pick = (v: SegText | undefined, seg: Seg) => (typeof v === 'string' ? v : v?.[seg] ?? '');

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

interface Item {
  q: SegText;
  hint: SegText;
  critical?: CriticalKey;
}

interface Group {
  key: GroupKey;
  title: SegText;
  note: SegText;
  barName: SegText;
  items: Item[];
}

const SEGMENTS: { key: Seg; label: string }[] = [
  { key: 'tp', label: 'Third-party agency' },
  { key: 'fp', label: 'First-party / creditor' },
  { key: 'db', label: 'Debt buyer' },
];

const GROUPS: Group[] = [
  {
    key: 'org',
    title: 'The internal position',
    barName: 'Internal position',
    note: 'No vendor can close a gap here, which is why gaps here come back later dressed up as compliance objections.',
    items: [
      {
        critical: 'collectors',
        q: {
          tp: 'At go-live, no collector loses commissionable accounts or bonus-eligible volume.',
          fp: 'At go-live, no collector or service rep loses incentive-eligible volume or accounts they own.',
          db: 'At go-live, no internal collector or placement partner loses volume they are paid on.',
        },
        hint: 'Pushback shows up as slow cooperation, not as an objection you can answer.',
      },
      {
        q: 'We know what we will tell the floor, and it still holds once scope expands.',
        hint: 'Most internal messaging is written for launch week and collapses at the first expansion.',
      },
      {
        q: 'There is a named budget and a date by which we intend to decide.',
        hint: 'An evaluation without a date is a research project.',
      },
    ],
  },
  {
    key: 'comm',
    title: 'The business case',
    barName: 'Business case',
    note: 'The binding constraint is usually contact coverage, not collector productivity.',
    items: [
      {
        q: {
          tp: 'We know what share of our placed inventory gets a full contact effort today.',
          fp: 'We know what share of our delinquent portfolio gets a full contact effort today.',
          db: 'We know what share of our owned inventory gets a full contact effort today.',
        },
        hint: 'This one number sizes the whole opportunity, and the answer usually surprises the floor.',
      },
      {
        q: 'The case is written as liquidation we are not capturing, not seats we could cut.',
        hint: 'No term in that math is a labor cost, which is why it does not fight the floor.',
      },
      {
        q: 'We have recorded a baseline before anything changes.',
        hint: 'Abandon rate, after-hours volume, voicemail share. Reconstructed later, it is just an argument.',
      },
    ],
  },
  {
    key: 'sys',
    title: 'Systems and operations',
    barName: 'Systems and operations',
    note: 'The channel does not just place calls. It produces dispositions your operation has to absorb.',
    items: [
      {
        critical: 'writeback',
        q: 'Our collection platform takes dispositions back through an API, not a nightly file.',
        hint: 'Hand reconciliation is invisible at pilot volume and unworkable in production.',
      },
      {
        q: 'Consent, cease requests, and Reg F call frequency are enforceable at dial time.',
        hint: 'Two-party consent states matter here too. Having it in the file is not the same as enforcing it.',
      },
      {
        q: 'Someone owns QA for a channel that transcribes every call rather than a sample.',
        hint: 'Your sampling methodology does not transfer. It is an upgrade, but it goes unowned.',
      },
    ],
  },
  {
    key: 'cli',
    title: { tp: 'Clients and diligence', fp: 'Approvals and diligence', db: 'Sellers and diligence' },
    barName: { tp: 'Clients and diligence', fp: 'Approvals and diligence', db: 'Sellers and diligence' },
    note: {
      tp: "You are changing how someone else's accounts get worked, and your next client audit will cover this channel.",
      fp: 'You are contacting your own customers under your own brand, which puts other people in the approval chain.',
      db: 'You own the paper, but seller agreements and your placement partners still shape how it gets worked.',
    },
    items: [
      {
        critical: 'clients',
        q: {
          tp: 'Our placement agreements allow voice AI contact, or we know which clients to notify first.',
          fp: 'Legal, compliance, and brand have signed off on voice AI contacting our own customers.',
          db: 'Our purchase and forward-flow agreements do not restrict contact methods, and our agencies are aligned.',
        },
        hint: {
          tp: 'The most expensive thing to find out after you have picked a vendor.',
          fp: 'Brand sign-off is the one people skip, and the one that stops a launch.',
          db: 'Seller restrictions and agency contracts both count here.',
        },
      },
      {
        q: 'We have seen the four core controls demonstrated live rather than described.',
        hint: 'Right party verification, Mini Miranda placement, authorization limits, cease and desist handling.',
      },
      {
        q: 'Our read on voice quality comes from output we have heard in the last six months.',
        hint: 'A lot of the negative opinion in this industry is two technology generations old.',
      },
    ],
  },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0);

const BLOCKERS: Record<CriticalKey, { title: SegText; detail: SegText }> = {
  collectors: {
    title: 'Go-live is not yet additive for the floor',
    detail:
      'The most common cause of failure after signature rather than before it. Pushback arrives as slow cooperation, not as an objection you can answer.',
  },
  writeback: {
    title: 'Your collection platform cannot take dispositions back through an API',
    detail:
      'The channel will produce activity your operation cannot act on. Hand reconciliation is invisible at pilot volume and unworkable in production. Settle this before scoping anything else.',
  },
  clients: {
    title: {
      tp: 'Client permission is unconfirmed',
      fp: 'Internal approvals are unconfirmed',
      db: 'Seller and partner permission is unconfirmed',
    },
    detail: {
      tp: 'You are changing how someone else’s accounts get worked. Confirm the placement agreements allow it, or identify which clients need notifying, before you shortlist rather than after.',
      fp: 'Legal, compliance, and brand all sit in this chain, and brand is the one that gets skipped. Confirm sign-off before you shortlist rather than after.',
      db: 'Purchase and forward-flow agreements can restrict contact methods, and your placement agencies have their own constraints. Confirm both before you shortlist rather than after.',
    },
  },
};

function band(n: number, blocked: number) {
  if (blocked > 0)
    return {
      title: blocked > 1 ? `Blocked in ${blocked} places` : 'One blocker outstanding',
      verdict:
        'Whatever else is in place, the items below stop a deployment on their own. Each is cheapest to settle now and most expensive to find after you have picked a vendor.',
    };
  if (n >= 10)
    return {
      title: 'Ready to evaluate',
      verdict:
        'No blockers and the groundwork is in place. Run the evaluation, and start with inbound overflow so the first result measures against a baseline you already hold.',
    };
  if (n >= 6)
    return {
      title: 'Close the gaps first',
      verdict:
        'No blockers, which is the harder half. The remaining gaps will not stop a deployment, but they will surface later as delays and as arguments about whether the pilot worked.',
    };
  return {
    title: 'Groundwork before shortlist',
    verdict:
      'No blockers, but not enough is settled to run an evaluation productively. More demos will not move this. The work is internal.',
  };
}

function diagnose(c: Record<GroupKey, number>, blocked: number) {
  const g = { org: 3 - c.org, comm: 3 - c.comm, sys: 3 - c.sys, cli: 3 - c.cli };
  if (blocked > 0)
    return 'The section scores below still matter, but they are secondary until the blockers are cleared. A high score with a blocker outstanding is worse than a low score without one, because it feels like progress.';
  if (g.org >= 2)
    return 'Your constraint is the internal position. Until the collector question and the decision date are settled, the evaluation will keep stalling and the reason given will keep being compliance. Neither is a vendor conversation.';
  if (g.sys >= 2)
    return 'Your constraint is systems and operations. The commercial thinking is ahead of the plumbing, which shows up as a pilot that works and a rollout that does not. Get whoever owns your collection platform involved now rather than at implementation.';
  if (g.comm >= 2)
    return 'Your constraint is the business case. You cannot currently size the opportunity or prove a pilot worked, so any result will be arguable. Start by calculating what share of your inventory gets a full contact effort today.';
  if (g.cli >= 2)
    return 'Your internal position is stronger than your outside diligence. That is the better problem to have, because it closes fastest. Take the four controls into your next vendor conversation and ask to see each one demonstrated.';
  if (g.org === 1)
    return 'One item outstanding in the internal position. This category causes trouble after signature rather than before it, so close it while it is cheap.';
  if (g.sys === 1)
    return 'One systems item outstanding. Worth settling before scoping, since it determines what a deployment can absorb.';
  if (g.comm === 1)
    return 'One business case item outstanding. Most likely the baseline, which is worth capturing before a pilot starts rather than reconstructing afterward.';
  if (g.cli === 1)
    return 'One diligence item outstanding, and it is the kind that closes in a single vendor conversation.';
  return 'No gaps in any of the four areas and no blockers outstanding. You are further along than most of this industry. The next decision is scope rather than readiness, and inbound is the cleanest place to start.';
}

/** Count-up number that animates whenever the value changes. */
function Ticker({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (reduce) {
      setShown(value);
      prev.current = value;
      return;
    }
    const from = prev.current;
    prev.current = value;
    if (from === value) return;
    const steps = Math.abs(value - from);
    const dir = value > from ? 1 : -1;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(from + dir * i);
      if (i >= steps) window.clearInterval(id);
    }, Math.max(28, 90 / Math.max(steps, 1)));
    return () => window.clearInterval(id);
  }, [value, reduce]);

  return <span className={className}>{shown}</span>;
}

export default function AIReadinessChecklist() {
  const reduce = useReducedMotion();
  const [seg, setSeg] = useState<Seg>('tp');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [railVisible, setRailVisible] = useState(false);
  const assessRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const hasTrackedStart = useRef(false);

  const toggle = useCallback((id: string) => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      trackEvent('voice_ai_checklist_started');
    }
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const reset = useCallback(() => {
    setChecked({});
    assessRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }, [reduce]);

  // The floating progress rail only exists while the reader is inside the
  // assessment, between the first question and the bottom of the result card.
  useEffect(() => {
    const onScroll = () => {
      const top = assessRef.current?.getBoundingClientRect().top ?? 0;
      const end = resultRef.current?.getBoundingClientRect().bottom ?? 0;
      setRailVisible(top < 140 && end > 120);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { counts, open, total } = useMemo(() => {
    const c: Record<GroupKey, number> = { org: 0, comm: 0, sys: 0, cli: 0 };
    const blockers: CriticalKey[] = [];
    GROUPS.forEach(g =>
      g.items.forEach((item, i) => {
        const id = `${g.key}-${i}`;
        if (checked[id]) c[g.key] += 1;
        else if (item.critical) blockers.push(item.critical);
      })
    );
    return { counts: c, open: blockers, total: c.org + c.comm + c.sys + c.cli };
  }, [checked]);

  const result = band(total, open.length);
  const ctaLabel = open.length
    ? 'Get help closing these'
    : total >= 10
      ? 'Book a technical walkthrough'
      : 'Talk through your result';

  const handleDownload = useCallback(() => {
    trackEvent('voice_ai_checklist_download', { score: total, band: result.title });

    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const diagText = diagnose(counts, open.length);

    const blockersHtml = open.length
      ? `<div class="section">
          <div class="label label-amber">Outstanding blockers</div>
          ${open
            .map(
              key => `<div class="blocker">
                <b>${escapeHtml(pick(BLOCKERS[key].title, seg))}</b>
                <div>${escapeHtml(pick(BLOCKERS[key].detail, seg))}</div>
              </div>`
            )
            .join('')}
        </div>`
      : '';

    const barsHtml = GROUPS.map(g => {
      const done = counts[g.key];
      const pct = Math.round((done / g.items.length) * 100);
      const full = done === g.items.length;
      return `<div class="bar-row">
        <span class="bar-name">${escapeHtml(pick(g.barName, seg))}</span>
        <span class="bar-track"><span class="bar-fill${full ? ' full' : ''}" style="width:${pct}%"></span></span>
        <span class="bar-val">${done}/${g.items.length}</span>
      </div>`;
    }).join('');

    const doc = `<!doctype html>
<html><head><meta charset="utf-8">
<title>Voice AI Readiness Checklist: Your Result</title>
<style>
  @font-face {
    font-family: 'Saans';
    src: url('/fonts/saans/saans-variable.woff2') format('woff2');
    font-weight: 100 800;
    font-style: normal;
  }
  :root { color-scheme: light; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { margin: 0.55in 0.65in; }
  body {
    font-family: 'Saans', 'Inter', system-ui, sans-serif;
    color: #393939; margin: 0; background: #fff;
  }
  .topbar { display: flex; align-items: center; justify-content: space-between; padding-bottom: 14pt; border-bottom: 1px solid #E6E3E3; margin-bottom: 22pt; }
  .brand { display: flex; align-items: center; gap: 7pt; }
  .brand svg { display: block; }
  .brand span { font-family: 'Saans', 'Inter', sans-serif; font-weight: 600; font-size: 12.5pt; letter-spacing: -0.01em; color: #000; }
  .meta { font-size: 9pt; color: #696969; }
  .kicker { font-size: 9pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #000; margin-bottom: 6pt; }
  h1 { font-family: 'Saans', 'Inter', sans-serif; font-weight: 400; font-size: 23pt; letter-spacing: -0.03em; color: #000; margin: 0 0 20pt; }
  .scorewrap { display: flex; align-items: baseline; gap: 10pt; margin-bottom: 4pt; }
  .score { font-family: 'Saans', 'Inter', sans-serif; font-weight: 600; font-size: 40pt; letter-spacing: -0.03em; color: #000; line-height: 1; }
  .score em { font-style: normal; font-weight: 400; font-size: 15pt; color: #A3A3A3; }
  .band { font-family: 'Saans', 'Inter', sans-serif; font-weight: 500; font-size: 15pt; color: #000; }
  .verdict { font-size: 11pt; line-height: 1.6; max-width: 62ch; margin: 8pt 0 0; color: #393939; }
  .section { margin-top: 22pt; }
  .label { font-size: 9pt; text-transform: uppercase; letter-spacing: 0.12em; color: #696969; margin-bottom: 9pt; font-weight: 600; }
  .label-amber { color: #92400E; }
  .blocker { border-left: 2.5pt solid #F0B429; padding: 2pt 0 2pt 11pt; margin-bottom: 11pt; font-size: 11pt; line-height: 1.5; }
  .blocker:last-child { margin-bottom: 0; }
  .blocker b { display: block; margin-bottom: 2pt; color: #000; font-weight: 600; }
  .blocker div { color: #696969; }
  .diag { font-size: 11pt; line-height: 1.6; max-width: 62ch; margin: 0; color: #393939; }
  .bar-row { display: flex; align-items: center; gap: 10pt; padding: 4pt 0; }
  .bar-name { flex: 0 0 128pt; font-size: 9.5pt; color: #696969; }
  .bar-track { flex: 1; height: 5pt; background: #EEF0F4; border-radius: 3pt; overflow: hidden; }
  .bar-fill { display: block; height: 100%; background: #000; }
  .bar-fill.full { background: #03D2FC; }
  .bar-val { flex: 0 0 26pt; text-align: right; font-size: 9.5pt; color: #696969; }
  .foot { margin-top: 30pt; padding-top: 12pt; border-top: 1px solid #E6E3E3; font-size: 8.5pt; line-height: 1.6; color: #A3A3A3; }
</style>
</head>
<body>
  <div class="topbar">
    <div class="brand">
      <svg width="18" height="18" viewBox="0 0 373.93 378.56" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pg1" x1="349.44" y1="29.17" x2="-3.93" y2="233.09" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#00aee3"/><stop offset=".13" stop-color="#09a6df"/><stop offset=".34" stop-color="#2391d7"/>
            <stop offset=".61" stop-color="#4e6eca"/><stop offset=".92" stop-color="#883fb8"/><stop offset="1" stop-color="#9932b3"/>
          </linearGradient>
          <linearGradient id="pg3" x1="302.87" y1="83.47" x2="66.99" y2="429.21" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#00d5fc"/><stop offset=".38" stop-color="#5f91fa"/><stop offset=".68" stop-color="#a361f9"/>
            <stop offset=".89" stop-color="#cd44f9"/><stop offset="1" stop-color="#dd39f9"/>
          </linearGradient>
        </defs>
        <path fill="url(#pg1)" d="M373.9,89.49v123.08c0,16.99-15.15,29.98-31.94,27.39L23.48,190.77C9.97,188.68,0,177.05,0,163.38V40.95C0,15.85,22.38-3.34,47.19.49l288.62,44.58c21.91,3.38,38.08,22.24,38.08,44.42Z"/>
        <path fill="url(#pg3)" d="M336.87,133.87l-44.61,6.91L30.76,181.18c-17.7,2.73-30.76,17.97-30.76,35.88v114.94c0,28.55,25.45,50.37,53.66,46.01l277.56-42.88c24.55-3.79,42.67-24.93,42.67-49.77V92.04c-.37,9.67-4.93,17.96-4.93,17.96-10.84,21.49-32.1,23.88-32.1,23.88ZM373.9,89.49v2.55c.03-.84.04-1.7,0-2.55Z"/>
      </svg>
      <span>DROS</span>
    </div>
    <div class="meta">Generated ${date}</div>
  </div>

  <div class="kicker">Voice AI Readiness Checklist</div>
  <h1>Your Result</h1>

  <div class="scorewrap">
    <div class="score">${total}<em> / ${TOTAL}</em></div>
  </div>
  <div class="band">${escapeHtml(result.title)}</div>
  <p class="verdict">${escapeHtml(result.verdict)}</p>

  ${blockersHtml}

  <div class="section">
    <div class="label">Where the gap sits</div>
    <p class="diag">${escapeHtml(diagText)}</p>
  </div>

  <div class="section">
    <div class="label">Section breakdown</div>
    ${barsHtml}
  </div>

  <div class="foot">
    Generated from dros.ai. Your specific answers were never sent anywhere.<br>
    Talk it through: dros.ai/book-meeting
  </div>
</body></html>`;

    const win = window.open('', '_blank', 'width=850,height=1100');
    if (!win) return;
    win.document.open();
    win.document.write(doc);
    win.document.close();
    win.focus();

    // Wait for the self-hosted Saans font to finish loading before printing,
    // capped at 600ms so a slow/cold font fetch never blocks the dialog —
    // the print stylesheet's fallback stack still reads cleanly either way.
    let printed = false;
    const doPrint = () => {
      if (printed) return;
      printed = true;
      win.print();
    };
    win.document.fonts?.ready?.then(doPrint).catch(doPrint);
    window.setTimeout(doPrint, 600);
  }, [total, result, counts, open, seg]);

  return (
    <div className="my-10">
      {/* Floating progress rail */}
      <AnimatePresence>
        {railVisible && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={springStd}
            className="fixed inset-x-0 top-16 z-40 border-b border-[#E6E3E3] bg-white/95 backdrop-blur-md"
          >
            <div className="mx-auto flex max-w-[700px] items-center gap-4 px-6 py-3">
              <span className="whitespace-nowrap text-sm font-medium text-black">
                <Ticker value={total} className="tabular-nums" /> of {TOTAL}
              </span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#EEF0F4]">
                <motion.div
                  className="h-full rounded-full bg-black"
                  animate={{ width: `${(total / TOTAL) * 100}%` }}
                  transition={springStd}
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  resultRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
                }
                className="hidden whitespace-nowrap text-sm font-medium text-black transition-opacity hover:opacity-60 sm:block"
              >
                See your result
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Segment switch */}
      <div className="mb-6">
        <span className="mb-3 block text-sm text-[#696969]">
          Four of these questions change depending on how you collect. Which are you?
        </span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Collection type">
          {SEGMENTS.map(s => (
            <motion.button
              key={s.key}
              type="button"
              aria-pressed={seg === s.key}
              onClick={() => setSeg(s.key)}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={reduce ? { duration: 0 } : nudgeSpring}
              animate={{ borderColor: seg === s.key ? '#000000' : '#E6E3E3' }}
              className="relative rounded-full border px-4 py-2 text-sm font-medium"
            >
              {seg === s.key && (
                <motion.span
                  layoutId="seg-pill"
                  className="absolute inset-0 rounded-full bg-black"
                  transition={reduce ? { duration: 0 } : pillSpring}
                />
              )}
              <motion.span
                className="relative"
                animate={{ color: seg === s.key ? '#FFFFFF' : 'rgba(0,0,0,0.7)' }}
                transition={{ duration: reduce ? 0 : 0.12, delay: reduce || seg !== s.key ? 0 : 0.06 }}
              >
                {s.label}
              </motion.span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Privacy note */}
      <div className="mb-10 flex items-start gap-3 rounded-2xl border border-[#E6E3E3] bg-[#FAFAFA] p-4">
        <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-black/50" />
        <p className="text-sm leading-relaxed text-[#393939]">
          <b className="font-semibold text-black">Your answers stay in your browser.</b> No form, no email required.
          We log an anonymous, no-name signal when someone finishes, never your specific answers or who you are.
        </p>
      </div>

      {/* The checklist */}
      <div ref={assessRef} className="space-y-10">
        {GROUPS.map(group => {
          const done = counts[group.key];
          const full = done === group.items.length;
          return (
            <fieldset key={group.key} className="border-0 p-0">
              <legend className="block w-full">
                <div className="flex items-baseline gap-3 border-b border-[#E6E3E3] pb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black">
                    {pick(group.title, seg)}
                  </span>
                  <motion.span
                    animate={{ color: full ? '#000000' : '#9A9A9A' }}
                    transition={{ duration: 0.2 }}
                    className="ml-auto whitespace-nowrap text-sm font-medium tabular-nums"
                  >
                    <Ticker value={done} /> of {group.items.length}
                  </motion.span>
                </div>
              </legend>
              <p className="mb-4 mt-3 text-sm leading-relaxed text-[#696969]">{pick(group.note, seg)}</p>

              <div className="space-y-2">
                {group.items.map((item, i) => {
                  const id = `${group.key}-${i}`;
                  const isOn = !!checked[id];
                  return (
                    <motion.label
                      key={id}
                      htmlFor={id}
                      whileHover={reduce ? undefined : { x: 3 }}
                      whileTap={reduce ? undefined : { scale: 0.995 }}
                      transition={nudgeSpring}
                      animate={{ backgroundColor: isOn ? '#FAFAFA' : '#FFFFFF' }}
                      className={`flex cursor-pointer items-start gap-4 rounded-2xl border border-[#E6E3E3] p-5 transition-colors hover:border-black/30 ${
                        item.critical ? 'border-l-[3px] border-l-[#F0B429]' : ''
                      }`}
                    >
                      <input
                        id={id}
                        type="checkbox"
                        checked={isOn}
                        onChange={() => toggle(id)}
                        className="peer sr-only"
                      />
                      <motion.span
                        aria-hidden="true"
                        animate={{
                          backgroundColor: isOn ? '#000000' : '#FFFFFF',
                          borderColor: isOn ? '#000000' : '#C3C8D6',
                        }}
                        transition={{ duration: 0.18 }}
                        className="mt-0.5 flex h-[19px] w-[19px] flex-shrink-0 items-center justify-center rounded-md border-[1.5px] peer-focus-visible:ring-2 peer-focus-visible:ring-black/30 peer-focus-visible:ring-offset-2"
                      >
                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                          <motion.path
                            d="M2.5 6.2 4.9 8.6 9.6 3.8"
                            stroke="#fff"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={false}
                            animate={{ pathLength: isOn ? 1 : 0, opacity: isOn ? 1 : 0 }}
                            transition={{ duration: reduce ? 0 : 0.22, ease: 'easeOut' }}
                          />
                        </svg>
                      </motion.span>
                      <span className="min-w-0">
                        <motion.span
                          animate={{ opacity: isOn ? 0.5 : 1 }}
                          transition={{ duration: 0.2 }}
                          className="block text-base font-medium leading-snug text-black"
                        >
                          {pick(item.q, seg)}
                          {item.critical && (
                            <span className="ml-2 inline-block rounded bg-[#FEF3C7] px-1.5 py-0.5 align-[2px] text-[10px] font-semibold uppercase tracking-[0.11em] text-[#92400E]">
                              Blocker
                            </span>
                          )}
                        </motion.span>
                        <span className="mt-1.5 block text-sm leading-relaxed text-[#696969]">
                          {pick(item.hint, seg)}
                        </span>
                      </span>
                    </motion.label>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      {/* Result */}
      <motion.div
        ref={resultRef}
        layout
        transition={springStd}
        className="mt-10 overflow-hidden rounded-2xl bg-[#04070F] text-white"
      >
        <AnimatePresence mode="wait" initial={false}>
          {total === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-7"
            >
              <p className="text-lg font-light text-white">Your result appears here</p>
              <p className="mt-2 max-w-[50ch] text-[15px] leading-relaxed text-white/50">
                Check what you could defend today. The score updates live and names the area holding you back.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={springStd}
            >
              <div className="border-b border-white/10 p-7">
                <div className="flex items-end gap-1 font-light tracking-[-0.03em] text-accent">
                  <Ticker value={total} className="text-[50px] leading-none tabular-nums" />
                  <span className="pb-1 text-xl text-white/40">/ {TOTAL}</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={result.title}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                  >
                    <p className="mb-2 mt-3 text-xl font-light text-white">{result.title}</p>
                    <p className="max-w-[54ch] text-[15px] leading-relaxed text-white/60">{result.verdict}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <AnimatePresence initial={false}>
                {open.length > 0 && (
                  <motion.div
                    key="blockers"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={springStd}
                    className="overflow-hidden border-b border-white/10 bg-white/[0.03]"
                  >
                    <div className="p-7">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F0B429]">
                        Outstanding blockers
                      </p>
                      {open.map((key, i) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ ...springStd, delay: i * 0.06 }}
                          className={`py-3 ${i > 0 ? 'border-t border-white/10' : 'pt-0'}`}
                        >
                          <p className="mb-1 font-medium text-white">{pick(BLOCKERS[key].title, seg)}</p>
                          <p className="text-[15px] leading-relaxed text-white/55">{pick(BLOCKERS[key].detail, seg)}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="px-7 pb-6 pt-6">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                  Where the gap sits
                </p>
                <p className="max-w-[54ch] text-[15px] leading-relaxed text-white/75">{diagnose(counts, open.length)}</p>

                <div className="mt-6 space-y-1">
                  {GROUPS.map(g => {
                    const done = counts[g.key];
                    const full = done === g.items.length;
                    return (
                      <div key={g.key} className="flex items-center gap-3 py-1.5">
                        <span className="w-[124px] flex-shrink-0 text-sm text-white/45 sm:w-[168px]">
                          {pick(g.barName, seg)}
                        </span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                          <motion.span
                            className="block h-full rounded-full"
                            animate={{
                              width: `${(done / g.items.length) * 100}%`,
                              backgroundColor: full ? '#03D2FC' : '#5B6478',
                            }}
                            transition={springStd}
                          />
                        </span>
                        <span className="w-8 flex-shrink-0 text-right text-sm tabular-nums text-white/60">
                          {done}/{g.items.length}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="px-7 pb-4 text-[15px] leading-relaxed text-white/55">
                Download your results and bring them to the call. We'll spend it on your blockers, not a generic
                pitch.
              </p>

              <div className="flex flex-wrap items-center gap-3 px-7 pb-5">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[15px] font-medium text-white transition-colors hover:border-accent hover:text-accent"
                >
                  <Download className="h-4 w-4" />
                  Download results
                </button>
                <a
                  href="https://dros.ai/book-meeting"
                  onClick={() => {
                    trackCta(`AI readiness checklist - ${ctaLabel}`);
                    trackEvent('voice_ai_checklist_cta_click', { score: total, band: result.title });
                  }}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-medium text-[#04070F] transition-opacity hover:opacity-85"
                >
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <button
                  type="button"
                  onClick={reset}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[15px] font-medium text-white/60 transition-colors hover:border-white/50 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-90" />
                  Start over
                </button>
              </div>
              <p className="px-7 pb-7 text-sm text-white/35">
                Your specific answers were never sent anywhere. Download the PDF to keep them.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
