export const HS_PORTAL_ID = '22244787';

export function submitUrl(formId: string): string {
  return `https://api.hsforms.com/submissions/v3/integration/submit/${HS_PORTAL_ID}/${formId}`;
}

/**
 * The HubSpot tracking cookie, passed as `hutk` on Forms API submissions so a
 * submission carries the same marketing attribution a native embed would.
 * Undefined when the tracking script hasn't set it (cookie consent declined,
 * first-touch before the script loads) - HubSpot accepts the payload either way.
 */
export function hubspotCookie(): string | undefined {
  return document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]*)/)?.[1];
}

const DEMO_CALL_FORM_ID = 'a13991ad-fe0d-4819-859f-cbacc494dbf8';

/**
 * Records a "Call me now" demo request as a lead in HubSpot. Best-effort: a
 * failed submission is swallowed so it never blocks or fails the demo call.
 */
export async function submitDemoCallLead(
  lead: { name: string; email: string; phone: string },
  pageName: string,
): Promise<void> {
  try {
    await fetch(submitUrl(DEMO_CALL_FORM_ID), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: [
          { name: 'firstname', value: lead.name },
          { name: 'email', value: lead.email },
          { name: 'phone', value: lead.phone },
        ],
        context: {
          pageUri: window.location.href,
          pageName,
          hutk: hubspotCookie(),
        },
      }),
    });
  } catch {
    // Network failure - the demo call still proceeds.
  }
}
