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

const LEAVE_MESSAGE_FORM_ID = '041b6ae3-2eb8-4849-85f6-4bf65fa1501e';

export type LeaveMessageResult =
  | { ok: true }
  | { ok: false; emailRejected: boolean };

/**
 * Submits the "Leave us a message" form. HubSpot does no server-side
 * validation of this form (it accepts a malformed email), so callers must
 * validate before submitting - see LeaveMessage.
 */
export async function submitLeaveMessage(
  message: { firstname: string; lastname: string; email: string; company: string; message: string },
  pageName: string,
): Promise<LeaveMessageResult> {
  const field = (name: string, value: string) => ({ objectTypeId: '0-1', name, value });
  try {
    const res = await fetch(submitUrl(LEAVE_MESSAGE_FORM_ID), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: [
          field('firstname', message.firstname),
          field('lastname', message.lastname),
          field('email', message.email),
          ...(message.company ? [field('company', message.company)] : []),
          field('enter_your_message', message.message),
        ],
        context: {
          pageUri: window.location.href,
          pageName,
          hutk: hubspotCookie(),
        },
      }),
    });
    if (res.ok) return { ok: true };
    const body = (await res.json().catch(() => null)) as { errors?: { errorType?: string }[] } | null;
    const emailRejected = !!body?.errors?.some((e) => /EMAIL/.test(e.errorType ?? ''));
    return { ok: false, emailRejected };
  } catch {
    return { ok: false, emailRejected: false };
  }
}

const DEMO_CALL_FORM_ID ='a13991ad-fe0d-4819-859f-cbacc494dbf8';

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
