/*
 * Pure logic for the Coverage Gap Assessment. Ported verbatim from the
 * original landing page so the numbers match what was signed off there.
 */

export type LeakCause =
  | 'contactability'
  | 'timing'
  | 'coverage'
  | 'treatment'
  | 'compliance'
  | 'people';

export interface AssessmentState {
  warm: string | null;
  paper: string | null;
  acc: number;
  att: number;
  ans: number;
  bal: number;
  leak: string | null;
  cause: LeakCause | null;
  tgt: number;
}

export const INITIAL_STATE: AssessmentState = {
  warm: null,
  paper: null,
  acc: 50000,
  att: 1.5,
  ans: 6,
  bal: 450,
  leak: null,
  cause: null,
  tgt: 80,
};

export interface CalcResult {
  pNoMonth: number;
  covWeek: number;
  untouched: number;
  dollars: number;
}

export const fmtN = (n: number) => Math.round(n).toLocaleString('en-US');

export const fmtD = (n: number) =>
  n >= 1e6
    ? '$' + (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + 'M'
    : n >= 1e3
      ? '$' + fmtN(n / 1000) + 'k'
      : '$' + fmtN(n);

/** Strips everything but digits and the decimal point, e.g. "$1,250" -> 1250. */
export const parseNum = (s: string) => parseFloat(String(s).replace(/[^0-9.]/g, ''));

export function calc(s: AssessmentState): CalcResult {
  const a = s.ans / 100;
  // P(zero right-party contact in ~30 days)
  const pNoMonth = Math.pow(1 - a, s.att * 4.3);
  // P(any right-party contact in a week) - "coverage today"
  const covWeek = 1 - Math.pow(1 - a, s.att);
  const untouched = Math.round(s.acc * pNoMonth);
  return { pNoMonth, covWeek, untouched, dollars: untouched * s.bal };
}

export const DIAG: Record<LeakCause, [string, string]> = {
  contactability: [
    'Contactability: your attempts aren’t landing.',
    'Falling answer rates mean each dial buys less. The fix is not more dials from the same numbers at the same hours - it’s consistent, compliant multichannel attempts (voice + SMS) with proper caller-ID attestation, spread across the window.',
  ],
  timing: [
    'Timing: you’re reaching people when they can’t answer.',
    'The accounts that pay often answer after 6 pm or on weekends - exactly when your floor is empty. Coverage inside state call windows, every day, closes this without overtime.',
  ],
  coverage: [
    'Coverage: half your file never gets worked at all.',
    'Collectors gravitate to the accounts that answer. The rest of the file gets no compliant attempt inside the window and quietly ages out. This is the purest form of the coverage gap.',
  ],
  treatment: [
    'Treatment: you reach them once, then lose the thread.',
    'Without memory across channels and consistent follow-up, a good first contact goes nowhere. Every attempt should know what happened on the last one.',
  ],
  compliance: [
    'Compliance fear: you leave attempts on the table.',
    'Holding back below the Reg F cap because manual attempts feel risky costs recovery every week. When rules are enforced in the engine, you can use the full window safely - with evidence on every call.',
  ],
  people: [
    'Capacity: you can’t hire your way to full coverage.',
    'Collector cost and attrition put full coverage out of reach with people alone. Let an AI engine work the attempts; let your collectors take the live conversations.',
  ],
};

export const FIX =
  'Put DROS on the low-balance tier: every in-statute account gets a compliant attempt every day across voice and SMS, inside your rules, with a warm transfer to your collectors when someone wants to talk - and evidence on every call. Most agencies see the gap close within the first 30-day portfolio.';

/** Plain-text summary of the answers and result, used for the mailto body. */
export function summary(s: AssessmentState, c: CalcResult): string {
  return [
    `Paper: ${s.paper || 'n/a'}`,
    `Active accounts: ${fmtN(s.acc)}`,
    `Attempts/account/week: ${s.att}`,
    `Answer rate: ${s.ans}%`,
    `Avg balance: $${fmtN(s.bal)}`,
    `Leak: ${s.leak || 'n/a'} (${s.cause || 'n/a'})`,
    `Target weekly coverage: ${s.tgt}%`,
    '-- RESULT --',
    `Coverage gap (zero RPC in 30d): ${Math.round(c.pNoMonth * 100)}%`,
    `Untouched accounts: ${fmtN(c.untouched)}`,
    `Untouched balances: ${fmtD(c.dollars)}`,
    `Weekly coverage today: ${Math.round(c.covWeek * 100)}%`,
    `Warm-up answer: ${s.warm || 'n/a'}`,
  ].join('\n');
}

export function bookingMailto(s: AssessmentState, c: CalcResult): string {
  const gap = Math.round(c.pNoMonth * 100);
  return (
    'mailto:sales@vodex.ai?subject=' +
    encodeURIComponent('DROS 30-day proof - coverage gap ' + gap + '%') +
    '&body=' +
    encodeURIComponent(summary(s, c))
  );
}

/**
 * PLACEHOLDER. Lead delivery is intentionally not wired yet. When the
 * destination is decided (HubSpot Forms API via src/lib/hubspot.ts, following
 * AdoptionGapReport2026.tsx, or another endpoint), post `data` here. The
 * caller never awaits this, so results always unlock immediately.
 */
export async function deliverLead(data: Record<string, string>): Promise<void> {
  // TODO: wire lead delivery. Keep this non-throwing so the unlock never blocks.
  void data;
}
