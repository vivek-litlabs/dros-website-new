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

// Fires an outbound demo call for the given lead. Fire-and-forget: callers do
// not await this, and it never throws - a network/CORS failure must not block
// the form's visual transition.
export async function triggerDemoCall(name: string, phone: string): Promise<void> {
  const payload = {
    email: '', // neither form has an email box; API confirmed to accept empty
    phone: normalizePhone(phone),
    firstName: name,
    lastName: '(DROS Home Demo Bot)', // marker the Vodex backend expects
  };

  try {
    // Note: no manual "Referer" header - it's a forbidden header that browsers
    // refuse to set via fetch; the browser sends the real page origin itself.
    const response = await fetch(DEMO_CALL_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log('Demo call response:', response);
  } catch (error) {
    console.log('Demo call error:', error);
  }
}
