// Vodex demo-call API. No env convention exists in this app (the GA ID is
// hardcoded inline in main.tsx), so the endpoint is a hardcoded constant to
// match that precedent. Change only if there's a DROS-specific URL.
const DEMO_CALL_API = 'https://prod.api.vodex.ai/api/v1/trigger-demo-call';

// Strip formatting (spaces, parens, dashes) so the API gets clean digits.
// Preserves a leading "+" so an existing country code survives; does NOT
// invent a country code when the user omits one.
function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  return hasPlus ? `+${digits}` : digits;
}

export interface DemoCallResult {
  ok: boolean;
  // HTTP status when the server answered (e.g. 403 unauthorized). Absent when
  // the request never reached the server (network error, or blocked by an
  // ad/privacy extension -> ERR_BLOCKED_BY_CLIENT, which throws a TypeError).
  status?: number;
  error?: string;
}

// Triggers an outbound demo call for the given lead. Never throws - it always
// resolves to a DemoCallResult so the caller can decide what to show.
export async function triggerDemoCall(name: string, phone: string): Promise<DemoCallResult> {
  const payload = {
    email: '', // neither form has an email box; confirm the API accepts empty
    phone: normalizePhone(phone),
    firstName: name,
    lastName: '(DROS Home Demo Bot)', // marker the Vodex backend expects
  };

  try {
    // No manual "Referer" header - it's a forbidden header browsers refuse to
    // set via fetch; the browser sends the real page origin itself. Vodex
    // authorizes by that origin, so the serving domain must be allowlisted in
    // the Vodex workspace or the server answers 403 "unauthorized".
    const response = await fetch(DEMO_CALL_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.log('Demo call failed:', response.status, body);
      return { ok: false, status: response.status, error: body || response.statusText };
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
