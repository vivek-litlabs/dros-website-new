import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Lock, X } from 'lucide-react';
import { Button } from '../ui';
import Option from './Option';
import CountUp from './CountUp';
import { scrollToSection, topOffset } from './scroll';
import { trackEvent } from '../../lib/analytics';
import {
  DIAG,
  FIX,
  bookingMailto,
  calc,
  deliverLead,
  fmtD,
  fmtN,
  parseNum,
  summary,
} from './assessmentLogic';
import type { AssessmentState, LeakCause } from './assessmentLogic';

/*
 * Full-screen Coverage Gap Assessment: 7 questions, an email gate, then the
 * results. Answers live in the parent so they survive closing and reopening.
 *
 * Lead delivery is a PLACEHOLDER (see deliverLead in assessmentLogic.ts): the
 * gate validates and unlocks the results, but nothing is sent anywhere yet.
 */

const TOTAL = 7;
const GATE_STEP = 8;
const RESULTS_STEP = 9;

const PAPER = [
  'Healthcare / patient balances',
  'Utilities / telecom',
  'Auto deficiency',
  'Consumer loans / fintech / BNPL',
  'Credit card / purchased debt',
  'Membership / travel / subscriptions',
  'Government / student / municipal',
  'Mixed / other',
];

const LEAKS: { cause: LeakCause; text: string }[] = [
  { cause: 'contactability', text: '“We dial and dial - nobody picks up unknown numbers anymore”' },
  { cause: 'timing', text: '“The accounts that would pay only answer after 6 pm or on weekends”' },
  { cause: 'coverage', text: '“Half the file never gets touched - collectors live in the accounts that answer”' },
  { cause: 'treatment', text: '“We reach them once, then lose the thread - no consistent follow-up”' },
  { cause: 'compliance', text: '“We hold back on attempts because compliance risk scares us”' },
  { cause: 'people', text: '“We can’t hire or keep enough collectors to work the volume”' },
];

const ROLES = [
  'Owner / President / CEO',
  'COO / VP Operations',
  'Compliance Officer',
  'Collections Manager',
  'IT / Systems',
  'Other',
];

const PLATFORMS = [
  'Latitude',
  'Quantrax / RMEx',
  'CUBS',
  'Beam',
  'SimplicityCollect',
  'Other / in-house',
];

const EASE = [0.22, 1, 0.36, 1] as const;

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 28 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -28 }),
};

/* ── helpers ─────────────────────────────────────────────────────────────── */

function StepHead({ qk, title, sub }: { qk: string; title: ReactNode; sub?: string }) {
  return (
    <>
      <div className="mb-3.5 flex items-center justify-center gap-2.5 font-mono text-[11.5px] uppercase tracking-[0.08em] text-accent">
        <span className="h-px w-[22px] bg-accent" />
        {qk}
      </div>
      <h2 className="mb-2 text-center font-display text-[clamp(1.6rem,4vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white">
        {title}
      </h2>
      {sub && (
        <p className="mx-auto mb-6 max-w-[34rem] text-center text-[15px] leading-relaxed text-ink/60">
          {sub}
        </p>
      )}
    </>
  );
}

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-card border border-hair bg-surface p-5 sm:p-7 ${className}`}>
      {children}
    </div>
  );
}

function BigNum({ children }: { children: ReactNode }) {
  return (
    <div className="text-center font-display text-[clamp(2.6rem,8vw,4.2rem)] font-medium leading-none tracking-[-0.04em] tabular-nums text-accent [text-shadow:0_0_30px_rgba(3,210,252,0.35)]">
      {children}
    </div>
  );
}

function Unit({ children }: { children: ReactNode }) {
  return (
    <small className="ml-1 text-[0.45em] font-medium tracking-normal text-ink/60">{children}</small>
  );
}

function Range({
  value,
  min,
  max,
  step,
  label,
  left,
  right,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string;
  left: string;
  right: string;
  onChange: (v: number) => void;
}) {
  const clamped = Math.min(Math.max(value, min), max);
  const p = ((clamped - min) / (max - min)) * 100;
  return (
    <>
      <div className="mb-1.5 mt-6">
        <input
          type="range"
          className="cg-range"
          min={min}
          max={max}
          step={step}
          value={clamped}
          aria-label={label}
          style={{ '--p': `${p}%` } as CSSProperties}
          onChange={(e) => onChange(+e.target.value)}
        />
      </div>
      <div className="flex justify-between font-mono text-[11.5px] text-ink/45">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </>
  );
}

/** Free-typing companion to a slider: formats when idle, parses while typing. */
function ExactInput({
  value,
  format,
  label,
  onCommit,
}: {
  value: number;
  format: (n: number) => string;
  label: string;
  onCommit: (n: number) => void;
}) {
  const [text, setText] = useState<string | null>(null);
  return (
    <div className="mt-5 flex flex-col items-center gap-1.5">
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={text ?? format(value)}
        onFocus={() => setText(format(value))}
        onBlur={() => setText(null)}
        onChange={(e) => {
          setText(e.target.value);
          const v = parseNum(e.target.value);
          if (!isNaN(v) && v > 0) onCommit(v);
        }}
        className="min-h-[46px] w-[min(220px,100%)] rounded-xl border border-hair bg-surface-2 px-3.5 py-2.5 text-center text-base text-ink transition-[border-color,box-shadow] duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <small className="font-mono text-[11px] text-ink/45">or type an exact number</small>
    </div>
  );
}

function StepNav({
  count,
  onBack,
  next,
}: {
  count: string;
  onBack: () => void;
  next?: { label: string; onClick: () => void; reveal?: boolean };
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
      <Button variant="secondary" size="lg" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Back
      </Button>
      <span className="font-mono text-xs text-ink/45">{count}</span>
      {next ? (
        <Button variant="primary" size="lg" onClick={next.onClick} className="max-sm:order-3 max-sm:w-full">
          {next.label}
          {next.reveal ? (
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          )}
        </Button>
      ) : (
        <span />
      )}
    </div>
  );
}

/* ── gate form ───────────────────────────────────────────────────────────── */

const fieldClass = (invalid: boolean) =>
  `autofill-transparent min-h-[46px] w-full rounded-xl border bg-surface-2 px-3.5 py-2.5 text-base text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-ink/35 focus:outline-none focus:ring-2 ${
    invalid
      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/25'
      : 'border-hair focus:border-accent focus:ring-accent/30'
  }`;

const selectClass = (invalid: boolean) =>
  `${fieldClass(invalid)} cursor-pointer appearance-none bg-[url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8'><path d='M1 1l5 5 5-5' fill='none' stroke='%239A9A9A' stroke-width='1.6'/></svg>")] bg-[length:12px_8px] bg-[right_0.9rem_center] bg-no-repeat pr-9 [&>option]:text-ink-dark`;

function Label({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 mt-3.5 block text-[13px] font-semibold text-ink/85">
      {children}
      {required && <span className="text-red-400"> *</span>}
    </label>
  );
}

function GateForm({ state, onUnlock }: { state: AssessmentState; onUnlock: () => void }) {
  const [f, setF] = useState({ name: '', agency: '', email: '', phone: '', role: '', platform: '' });
  const [honey, setHoney] = useState(false);
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    if (invalid[k]) setInvalid((p) => ({ ...p, [k]: false }));
  };

  function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    const bad: Record<string, boolean> = {
      name: !f.name.trim(),
      agency: !f.agency.trim(),
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email),
      role: !f.role,
    };
    const first = (['name', 'agency', 'email', 'role'] as const).find((k) => bad[k]);
    setInvalid(bad);
    if (first) {
      setError('Please complete name, agency, work email and role.');
      document.getElementById(`cg-${first}`)?.focus();
      return;
    }
    if (honey) return;
    setError('');
    setBusy(true);
    const c = calc(state);
    // PLACEHOLDER: not awaited, so the result never waits on the network.
    void deliverLead({ ...f, replyto: f.email, assessment: summary(state, c) });
    trackEvent('dros_assessment_lead');
    onUnlock();
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="relative z-[2] mx-auto -mt-4 max-w-[460px] rounded-card border border-hair bg-surface p-5 shadow-[0_24px_60px_rgba(4,7,15,0.45)] sm:p-8"
    >
      <motion.div
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(3,210,252,0.35)',
            '0 0 0 12px rgba(3,210,252,0)',
            '0 0 0 0 rgba(3,210,252,0)',
          ],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
        className="mx-auto mb-4 grid h-[46px] w-[46px] place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent"
      >
        <Lock className="h-[18px] w-[18px]" />
      </motion.div>
      <h2 className="text-center font-display text-[clamp(1.4rem,3vw,1.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white">
        Your full breakdown
        <br />
        is <span className="text-accent">one step away.</span>
      </h2>
      <p className="mb-4 mt-2.5 text-center text-sm leading-relaxed text-ink/60">
        We&rsquo;ve scored your coverage gap, the dollars sitting in it and where the leak is. Enter
        your details to unlock the report - we&rsquo;ll send you a copy and the 30-day proof plan.
      </p>

      <input
        type="checkbox"
        name="botcheck"
        checked={honey}
        onChange={(e) => setHoney(e.target.checked)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-x-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="cg-name" required>Full name</Label>
          <input id="cg-name" autoComplete="name" placeholder="Jordan Avery" value={f.name} onChange={set('name')} className={fieldClass(!!invalid.name)} />
        </div>
        <div>
          <Label htmlFor="cg-agency" required>Agency / company</Label>
          <input id="cg-agency" autoComplete="organization" placeholder="Acme Recovery" value={f.agency} onChange={set('agency')} className={fieldClass(!!invalid.agency)} />
        </div>
      </div>
      <Label htmlFor="cg-email" required>Work email</Label>
      <input id="cg-email" type="email" autoComplete="email" inputMode="email" placeholder="you@agency.com" value={f.email} onChange={set('email')} className={fieldClass(!!invalid.email)} />
      <div className="grid gap-x-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="cg-phone">Phone</Label>
          <input id="cg-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="(555) 010-2048" value={f.phone} onChange={set('phone')} className={fieldClass(false)} />
        </div>
        <div>
          <Label htmlFor="cg-role" required>Your role</Label>
          <select id="cg-role" value={f.role} onChange={set('role')} className={selectClass(!!invalid.role)}>
            <option value="">Select...</option>
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>
      <Label htmlFor="cg-platform">System of record</Label>
      <select id="cg-platform" value={f.platform} onChange={set('platform')} className={selectClass(false)}>
        <option value="">Select...</option>
        {PLATFORMS.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>

      <AnimatePresence initial={false}>
        {error && (
          <motion.div
            key="err"
            role="status"
            aria-live="polite"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3.5 rounded-xl border border-red-400/35 bg-red-500/15 px-3.5 py-2.5 text-sm text-red-200">
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button variant="primary" size="lg" type="submit" disabled={busy} className="mt-5 w-full">
        {busy ? 'Unlocking...' : 'Unlock my results'}
        {!busy && (
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        )}
      </Button>
      <small className="mt-3 block text-center text-xs text-ink/45">
        Private. No spam. Used only to send your assessment and follow up once.
      </small>
    </form>
  );
}

/* ── results ─────────────────────────────────────────────────────────────── */

function Results({ state, onClose }: { state: AssessmentState; onClose: () => void }) {
  const c = calc(state);
  const gap = Math.round(c.pNoMonth * 100);
  const cov = Math.round(c.covWeek * 100);
  const [dTitle, dText] = DIAG[state.cause ?? 'coverage'];
  const sub = `On ${state.paper ? state.paper.toLowerCase() : 'your'} paper at ${state.att} attempts a week and a ${state.ans}% answer rate, roughly ${gap}% of your ${fmtN(state.acc)} accounts get no right-party contact in a month.`;

  const stats = [
    { node: <CountUp to={c.untouched} format={fmtN} delay={150} />, label: 'accounts with zero right-party contact in 30 days' },
    { node: <CountUp to={c.dollars} format={fmtD} delay={300} />, label: 'in balances sitting untouched - aging toward out-of-statute' },
    { node: <CountUp to={cov} format={(n) => Math.round(n) + '%'} delay={450} />, label: 'of your file gets any contact in a week today' },
  ];

  return (
    <>
      <div className="mb-3.5 flex items-center justify-center gap-2.5 font-mono text-[11.5px] uppercase tracking-[0.08em] text-accent">
        <span className="h-px w-[22px] bg-accent" />
        Your Coverage Gap report
      </div>
      <h2 className="mb-2 text-center font-display text-[clamp(1.6rem,4vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white">
        Your coverage gap is{' '}
        <span className="text-accent">
          <CountUp to={gap} format={(n) => Math.round(n) + '%'} />
        </span>
      </h2>
      <p className="mx-auto mb-6 max-w-[34rem] text-center text-[15px] leading-relaxed text-ink/60">{sub}</p>

      <Panel>
        <div className="grid gap-3.5 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: EASE }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-hair bg-surface-2 p-5 transition-colors duration-200 hover:border-accent/35"
            >
              <div className="font-display text-[clamp(1.8rem,4vw,2.4rem)] font-medium leading-none tracking-[-0.03em] tabular-nums text-accent">
                {s.node}
              </div>
              <div className="mt-2 text-[13px] leading-snug text-ink/65">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mb-2 mt-6">
          <div className="mb-1.5 flex justify-between gap-3 text-[13px] text-ink/60">
            <span>
              Weekly coverage today: <b className="text-ink">{cov}%</b>
            </span>
            <span>
              Your target: <b className="text-ink">{state.tgt}%</b>
            </span>
          </div>
          <div className="relative h-3.5 overflow-hidden rounded-lg bg-white/10">
            <motion.i
              className="absolute inset-y-0 left-0 rounded-lg bg-accent/90"
              initial={{ width: 0 }}
              animate={{ width: `${state.tgt}%` }}
              transition={{ delay: 0.5, duration: 1, ease: EASE }}
            />
            <motion.i
              className="absolute inset-y-0 left-0 rounded-lg bg-ink/35"
              initial={{ width: 0 }}
              animate={{ width: `${cov}%` }}
              transition={{ delay: 0.3, duration: 1, ease: EASE }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5, ease: EASE }}
          className="my-6 border-l-[3px] border-accent py-1 pl-4"
        >
          <div className="mb-1 font-mono text-[11.5px] uppercase tracking-[0.08em] text-accent">Where your leak is</div>
          <h3 className="mb-1.5 font-display text-lg font-medium text-white">{dTitle}</h3>
          <p className="text-[15px] leading-relaxed text-ink/75">{dText}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.5, ease: EASE }}
          className="my-6 border-l-[3px] border-white/20 py-1 pl-4"
        >
          <div className="mb-1 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink/60">The one fix</div>
          <h3 className="mb-1.5 font-display text-lg font-medium text-white">
            Compliance-native coverage on every account, every day.
          </h3>
          <p className="text-[15px] leading-relaxed text-ink/75">{FIX}</p>
        </motion.div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="primary" size="lg" href={bookingMailto(state, c)} className="max-sm:w-full">
            Book my 30-day proof
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
          <Button variant="secondary" size="lg" onClick={onClose} className="max-sm:w-full">
            See how DROS works ↓
          </Button>
        </div>
        <p className="mb-0 mt-4 text-xs leading-relaxed text-ink/45">
          Estimates are directional: P(no RPC) = (1 − answer rate)<sup>attempts × 4.3</sup> applied
          to your accounts and average balance. We&rsquo;ll run the real numbers from your dialer and
          platform reports on the first call.
        </p>
      </Panel>
    </>
  );
}

/* ── dialog ──────────────────────────────────────────────────────────────── */

function AssessmentDialog({
  state,
  update,
  onClose,
  bannerVisible,
}: {
  state: AssessmentState;
  update: (patch: Partial<AssessmentState>) => void;
  onClose: () => void;
  bannerVisible: boolean;
}) {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const dialogRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(step);
  stepRef.current = step;
  // The parent's onClose changes identity on every render; read it through a
  // ref so the focus/keyboard effect below runs once per open, not per keystroke.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const go = useCallback((n: number) => {
    setDir(n >= stepRef.current ? 1 : -1);
    setStep(n);
    dialogRef.current?.scrollTo({ top: 0 });
  }, []);

  const back = () => (step === 1 ? onClose() : go(step - 1));
  const next = () => go(step + 1);

  // Lock page scroll, move focus in, restore it on close, trap Tab, Esc closes.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stepRef.current < RESULTS_STEP) {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const nodes = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select, a[href], [tabindex="0"]',
        ),
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, []);

  const pct = step >= GATE_STEP ? 100 : Math.round(((step - 1) / TOTAL) * 100);
  const c = calc(state);

  function choose(patch: Partial<AssessmentState>) {
    update(patch);
    window.setTimeout(() => go(stepRef.current + 1), 260);
  }

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <>
            <StepHead qk="Question 02 - Benchmark" title="What kind of paper do you mostly work?" sub="We'll frame your result against what we see in your part of the industry." />
            <Panel>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {PAPER.map((p) => (
                  <Option key={p} selected={state.paper === p} onClick={() => choose({ paper: p })}>
                    {p}
                  </Option>
                ))}
              </div>
            </Panel>
            <StepNav count="1 of 7" onBack={back} />
          </>
        );
      case 2:
        return (
          <>
            <StepHead qk="Question 03 - Volume" title="How many active, in-statute accounts are you working?" sub="Placements currently workable, across all clients." />
            <Panel>
              <BigNum><motion.span key={state.acc} initial={{ opacity: 0.5, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className="inline-block">{fmtN(state.acc)}</motion.span></BigNum>
              <Range value={state.acc} min={2000} max={250000} step={1000} label="Active accounts" left="2,000" right="250,000+" onChange={(v) => update({ acc: v })} />
              <ExactInput value={state.acc} format={fmtN} label="Exact number of accounts" onCommit={(v) => update({ acc: v })} />
            </Panel>
            <StepNav count="2 of 7" onBack={back} next={{ label: 'Continue', onClick: next }} />
          </>
        );
      case 3:
        return (
          <>
            <StepHead qk="Question 04 - Effort" title="How many attempts does each account actually get per week?" sub="Total dials ÷ accounts ÷ weeks, from your dialer report. Reg F allows up to 7 - most floors land well under 2." />
            <Panel>
              <BigNum><motion.span key={state.att} initial={{ opacity: 0.5, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className="inline-block">{state.att}</motion.span><Unit>/ account / week</Unit></BigNum>
              <Range value={state.att} min={0.25} max={7} step={0.25} label="Attempts per account per week" left="0.25" right="7 (Reg F cap)" onChange={(v) => update({ att: v })} />
            </Panel>
            <StepNav count="3 of 7" onBack={back} next={{ label: 'Continue', onClick: next }} />
          </>
        );
      case 4:
        return (
          <>
            <StepHead qk="Question 05 - The number" title="What's your outbound answer rate today?" sub="Be honest - this is the whole point. Drag to set it." />
            <Panel>
              <BigNum><motion.span key={state.ans} initial={{ opacity: 0.5, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className="inline-block">{state.ans}</motion.span><Unit>%</Unit></BigNum>
              <Range value={state.ans} min={1} max={25} step={0.5} label="Outbound answer rate" left="1%" right="25%" onChange={(v) => update({ ans: v })} />
            </Panel>
            <StepNav count="4 of 7" onBack={back} next={{ label: 'Continue', onClick: next }} />
          </>
        );
      case 5:
        return (
          <>
            <StepHead qk="Question 06 - Economics" title="What's the average balance on that paper?" sub="Per account, on average." />
            <Panel>
              <BigNum><motion.span key={state.bal} initial={{ opacity: 0.5, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className="inline-block">${fmtN(state.bal)}</motion.span></BigNum>
              <Range value={state.bal} min={50} max={5000} step={25} label="Average balance" left="$50" right="$5,000+" onChange={(v) => update({ bal: v })} />
              <ExactInput value={state.bal} format={(n) => '$' + fmtN(n)} label="Exact average balance" onCommit={(v) => update({ bal: v })} />
            </Panel>
            <StepNav count="5 of 7" onBack={back} next={{ label: 'Continue', onClick: next }} />
          </>
        );
      case 6:
        return (
          <>
            <StepHead qk="Question 07 - The leak" title="When accounts go quiet, what does it usually look like?" sub="Pick the one that stings the most." />
            <Panel>
              <div className="grid gap-2.5">
                {LEAKS.map((l, i) => (
                  <Option key={l.cause} k={String(i + 1)} selected={state.cause === l.cause} onClick={() => choose({ leak: l.text, cause: l.cause })}>
                    {l.text}
                  </Option>
                ))}
              </div>
            </Panel>
            <StepNav count="6 of 7" onBack={back} />
          </>
        );
      case 7:
        return (
          <>
            <StepHead qk="Question 08 - The target" title="What share of your file would you love to reach every week?" sub="Your number. We'll show you the gap - and how to close it." />
            <Panel>
              <BigNum><motion.span key={state.tgt} initial={{ opacity: 0.5, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className="inline-block">{state.tgt}</motion.span><Unit>% of accounts</Unit></BigNum>
              <Range value={state.tgt} min={30} max={100} step={5} label="Target weekly coverage" left="30%" right="100%" onChange={(v) => update({ tgt: v })} />
            </Panel>
            <StepNav count="7 of 7" onBack={back} next={{ label: 'Reveal my coverage gap', onClick: () => go(GATE_STEP), reveal: true }} />
          </>
        );
      case GATE_STEP:
        return (
          <div className="relative">
            <div className="pointer-events-none select-none opacity-35 blur-[14px]" aria-hidden="true">
              <div className="mb-3.5 flex items-center justify-center gap-2.5 font-mono text-[11.5px] uppercase tracking-[0.08em] text-accent">
                <span className="h-px w-[22px] bg-accent" />
                Your result
              </div>
              <h2 className="mb-2 text-center font-display text-[clamp(1.6rem,4vw,2.4rem)] font-medium leading-[1.1] text-white">
                Your coverage gap is {Math.round(c.pNoMonth * 100)}%
              </h2>
              <div className="my-5 grid gap-3.5 sm:grid-cols-3">
                {['accounts never contacted', 'in untouched balances', 'root cause'].map((l) => (
                  <div key={l} className="rounded-2xl border border-hair bg-surface-2 p-5">
                    <div className="font-display text-3xl text-accent">-</div>
                    <div className="mt-2 text-[13px] text-ink/65">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <GateForm state={state} onUnlock={() => go(RESULTS_STEP)} />
            <div className="mt-4 text-center">
              <Button variant="secondary" size="md" onClick={() => go(GATE_STEP - 1)}>
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                Back to questions
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <Results
            state={state}
            onClose={() => {
              onClose();
              window.setTimeout(() => scrollToSection('how', false, topOffset(bannerVisible)), 120);
            }}
          />
        );
    }
  }

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Coverage Gap Assessment"
      tabIndex={-1}
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-base text-ink outline-none [-webkit-overflow-scrolling:touch]"
    >
      <div aria-hidden="true" className="bg-spotlight pointer-events-none fixed inset-0" />

      <div className="sticky top-0 z-10 px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-[900px] items-center gap-4 rounded-full border border-hair bg-surface/85 py-2.5 pl-5 pr-2.5 backdrop-blur-xl">
          <span className="truncate text-[13px] text-ink/70">
            <b className="font-semibold text-ink">DROS</b> · Coverage Gap Assessment
          </span>
          <div className="h-1 min-w-[60px] flex-1 overflow-hidden rounded bg-white/10">
            <motion.i
              className="block h-full rounded bg-gradient-to-r from-accent to-[#5ee4ff]"
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.45, ease: EASE }}
            />
          </div>
          <span className="min-w-[3ch] shrink-0 whitespace-nowrap text-right font-mono text-xs text-ink/60">{pct}%</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assessment"
            className="grid h-8 w-8 place-items-center rounded-full text-ink/60 transition-colors hover:bg-white/[0.08] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      <div className="relative z-[1] mx-auto max-w-[720px] px-4 pb-16 pt-4 sm:px-6 sm:pt-8">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={step}
            custom={dir}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: EASE }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Assessment({
  open,
  state,
  onChange,
  onClose,
  bannerVisible,
}: {
  open: boolean;
  state: AssessmentState;
  onChange: (patch: Partial<AssessmentState>) => void;
  onClose: () => void;
  bannerVisible: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <AssessmentDialog
          key="assessment"
          state={state}
          update={onChange}
          onClose={onClose}
          bannerVisible={bannerVisible}
        />
      )}
    </AnimatePresence>
  );
}
