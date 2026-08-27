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
