import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2 } from 'lucide-react';
import { trackCta } from '../lib/analytics';

const HS_PORTAL_ID = '22244787';
const HS_FORM_ID = '87c5019b-ad1d-41f2-a413-a1080dfc2262';
const SUBMIT_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${HS_PORTAL_ID}/${HS_FORM_ID}`;
const FALLBACK_EMAIL = 'contact@dros.ai';

function hubspotCookie(): string | undefined {
  return document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]*)/)?.[1];
}

export interface RequestAccessDoc {
  id: string;
  docLabel: string;
}

interface RequestAccessModalProps {
  /** null closes the dialog. Non-null renders it for that document. */
  request: RequestAccessDoc | null;
  onClose: () => void;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const inputClass =
  'w-full rounded-xl border border-line-dark bg-white px-3.5 py-2.5 text-sm text-ink-dark placeholder:text-ink-grey/45 transition-colors focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20';
const labelClass = 'mb-1.5 block text-xs font-medium text-ink-grey';
const submitClass =
  'inline-flex min-w-[168px] items-center justify-center gap-2 rounded-full bg-[#0C1E45] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2';

/**
 * NDA-gated document request dialog, opened from the Trust Center's
 * certification cards. A custom light-themed form posts directly to the
 * HubSpot Forms API - the official embed script renders its own internal
 * styling that page CSS can't reach, which read as mismatched inside this
 * modal, so the form itself is built and styled the same way as the rest of
 * the site instead of relying on HubSpot's own UI.
 *
 * Follows the VoiceCallModal shell pattern (portal, escape, scroll lock)
 * plus a hand-rolled focus trap, since the project has no dialog/focus-trap
 * dependency.
 */
export default function RequestAccessModal({ request, onClose }: RequestAccessModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const open = request !== null;

  // Keeps the last non-null request so the dialog's title/label don't blank
  // out while the closing opacity transition runs.
  const [current, setCurrent] = useState<RequestAccessDoc | null>(null);
  useEffect(() => {
    if (request) setCurrent(request);
  }, [request]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  // Fresh form every time the dialog opens, including a second request after
  // an earlier success.
  useEffect(() => {
    if (!open) return;
    setFirstName('');
    setLastName('');
    setEmail('');
    setHoneypot('');
    setStatus('idle');
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot || status === 'submitting') return;
    setStatus('submitting');
    try {
      const res = await fetch(SUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: [
            { name: 'firstname', value: firstName.trim() },
            { name: 'lastname', value: lastName.trim() },
            { name: 'email', value: email.trim() },
          ],
          context: {
            pageUri: window.location.href,
            pageName: `Trust Center - ${current?.docLabel ?? ''}`,
            hutk: hubspotCookie(),
          },
        }),
      });
      if (!res.ok) throw new Error(`HubSpot submission failed: ${res.status}`);
      setStatus('success');
      trackCta(`trust_request_submitted_${current?.id ?? ''}`);
    } catch {
      setStatus('error');
    }
  }

  // Escape key, focus trap, scroll lock (restoring the prior overflow value
  // rather than clearing it, so this composes with other scroll-locking UI).
  useEffect(() => {
    if (!open) return;

    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cardRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = cardRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [open, onClose]);

  return createPortal(
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-opacity duration-200 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal={open}
        aria-labelledby="rq-title"
        aria-describedby="rq-desc"
        tabIndex={-1}
        className="relative w-full max-w-[440px] rounded-2xl border border-line-dark bg-white p-6 outline-none transition-transform duration-200 sm:p-7"
        style={{
          boxShadow: '0 24px 64px rgba(15,23,42,0.18), 0 2px 8px rgba(15,23,42,0.08)',
          transform: open ? 'none' : 'translateY(10px) scale(0.97)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          tabIndex={open ? 0 : -1}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 text-ink-grey transition-colors hover:bg-black/10 hover:text-ink-dark"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="eyebrow text-accent">Requesting access</span>
        <h2 id="rq-title" className="mt-1.5 font-display text-xl text-ink-dark">
          {current?.docLabel ?? ''}
        </h2>
        <p id="rq-desc" className="mt-2 text-sm leading-relaxed text-ink-grey">
          Access requires a signed NDA. Share your details and our team will send the document
          within one business day.
        </p>

        {status === 'success' ? (
          <div className="mt-5 rounded-xl border border-accent/25 bg-accent/5 px-5 py-6 text-center">
            <CheckCircle2 className="mx-auto h-7 w-7 text-accent" strokeWidth={1.75} />
            <p className="mt-3 text-sm font-medium text-ink-dark">Request received</p>
            <p className="mt-1 text-sm text-ink-grey">
              We will follow up at {email || 'your email'} within one business day.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
            <input
              type="text"
              name="company"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="rq-first" className={labelClass}>
                  First name
                </label>
                <input
                  id="rq-first"
                  required
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="rq-last" className={labelClass}>
                  Last name
                </label>
                <input
                  id="rq-last"
                  required
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="rq-email" className={labelClass}>
                Work email
              </label>
              <input
                id="rq-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-600">
                Something went wrong sending that. Please email us instead.
              </p>
            )}

            <div className="mt-1.5 flex justify-center">
              <button type="submit" disabled={status === 'submitting'} className={submitClass}>
                {status === 'submitting' ? 'Sending...' : 'Send request'}
              </button>
            </div>
          </form>
        )}

        <p className="mt-4 text-center text-xs text-ink-grey">
          Prefer email?{' '}
          <a href={`mailto:${FALLBACK_EMAIL}`} className="text-accent hover:opacity-80">
            {FALLBACK_EMAIL}
          </a>
        </p>
      </div>
    </div>,
    document.body,
  );
}
