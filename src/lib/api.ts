// DROS demo-call API. The browser posts to the DROS-owned Supabase edge
// function, which calls the voice provider (Vapi) server-to-server - so no
// browser-origin allowlist applies and the flow works from any domain
// (production, staging, Vercel previews, localhost). CORS is open on the
// function (Access-Control-Allow-Origin: *), verified 2026-07-20.
const DEMO_CALL_API =
  'https://dwqixblwturswkwolktu.supabase.co/functions/v1/trigger-demo-call';

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

export interface DemoCallResult {
  ok: boolean;
  // HTTP status when the server answered (e.g. 400 invalid phone). Absent
  // when the request never reached the server (network error, or blocked by
  // an ad/privacy extension -> ERR_BLOCKED_BY_CLIENT, which throws a
  // TypeError).
  status?: number;
  error?: string;
}

// Triggers an outbound demo call for the given lead. `phone` must already be
// a full E.164 number (see composePhone). Never throws - it always resolves
// to a DemoCallResult so the caller can decide what to show.
export async function triggerDemoCall(name: string, phone: string): Promise<DemoCallResult> {
  const payload = { name, phone };

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
