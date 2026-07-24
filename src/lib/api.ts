// DROS demo-call API. The browser posts to the DROS-owned Supabase edge
// function, which calls the voice provider (Vapi) server-to-server - so no
// browser-origin allowlist applies and the flow works from any domain
// (production, staging, Vercel previews, localhost). CORS is open on the
// function (Access-Control-Allow-Origin: *), verified 2026-07-20.
const DEMO_CALL_API = 'https://api.dros.ai/functions/v1/trigger-demo-call';

// Builds the E.164 number the API requires (e.g. +14155551234) from the
// country-code picker's dial code plus whatever the visitor typed:
// - visitor typed a leading "+" -> their explicit code wins over the picker
// - otherwise -> +<dial><national digits>, with formatting (spaces, parens,
//   dashes) and any leading trunk "0" stripped (e.g. UK 07911... -> 7911...)
// Invalid numbers are sent best-effort; the backend rejects them and the
// caller shows the retry message.
export function composePhone(dial: string, raw: string): string {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (trimmed.startsWith('+')) return `+${digits}`;
  return `+${dial}${digits.replace(/^0+/, '')}`;
}

// Demo calls are limited to US (+1) and India (+91) today. A visitor can force
// any country by typing a leading "+", so composePhone output is validated
// against these dial codes before we hit the API.
export const ALLOWED_DIAL_CODES = ['1', '91'];

export function isAllowedPhone(phone: string): boolean {
  return ALLOWED_DIAL_CODES.some((d) => phone.startsWith(`+${d}`));
}

export interface DemoCallResult {
  ok: boolean;
  // HTTP status when the server answered (e.g. 400 invalid phone). Absent
  // when the request never reached the server (network error, or blocked by
  // an ad/privacy extension -> ERR_BLOCKED_BY_CLIENT, which throws a
  // TypeError).
  status?: number;
  error?: string;
}

// Maps a failed DemoCallResult to a friendly, actionable message. The hardened
// endpoint can answer 403 (captcha_failed) or 400 (invalid_request); both should
// leave the visitor a clear next step rather than a raw status code.
export function demoCallErrorMessage(result: DemoCallResult): string {
  // 403 captcha_failed: the token was missing, stale, or rejected by Google.
  if (result.status === 403) return "Please complete the 'I'm not a robot' check and try again.";
  // 400 invalid_request: malformed payload (e.g. an unusable number).
  if (result.status === 400) return 'Please check your details and try again.';
  // Server answered with some other status.
  if (result.status) return `Couldn't start the call (error ${result.status}). Please try again.`;
  // Never reached the server (offline, or blocked by an ad/privacy extension).
  return "Couldn't reach the call service (request blocked or network error). Disable ad/privacy blockers and try again.";
}

// Triggers an outbound demo call for the given lead. `phone` must already be
// a full E.164 number (see composePhone). `token` is the reCAPTCHA v2 response
// the visitor produced by ticking the checkbox. Never throws - it always
// resolves to a DemoCallResult so the caller can decide what to show.
export async function triggerDemoCall(
  name: string,
  phone: string,
  token: string,
): Promise<DemoCallResult> {
  // The token is sent under two keys during the backend transition:
  // `captchaToken` (what the hardened endpoint now expects) and the legacy
  // `g-recaptcha-response` (what the current live function reads). Extra fields
  // are ignored server-side, so sending both is safe and non-breaking.
  const payload = { name, phone, captchaToken: token, 'g-recaptcha-response': token };

  try {
    const response = await fetch(DEMO_CALL_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // The API answers with JSON carrying a `success` boolean; a failure can
    // arrive with a 200 status, so check both. Guard the parse - an error
    // body may not be JSON at all.
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      const message =
        result?.error?.message || result?.error || response.statusText || 'Request failed';
      console.log('Demo call failed:', response.status, message);
      return { ok: false, status: response.status, error: String(message) };
    }

    console.log('Demo call response:', response.status);
    return { ok: true, status: response.status };
  } catch (error) {
    // Thrown before any HTTP status exists: offline, DNS/CORS failure, or the
    // request was blocked by a browser extension (ERR_BLOCKED_BY_CLIENT).
    const message = error instanceof Error ? error.message : String(error);
    console.log('Demo call error:', message);
    return { ok: false, error: message };
  }
}
