import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail } from 'lucide-react';

// Official HubSpot forms embed. Loaded lazily on first modal open so pages
// that never open this modal never pay for the script.
const HS_SCRIPT_SRC = 'https://js-na2.hsforms.net/forms/embed/22244787.js';
const HS_PORTAL_ID = '22244787';
const HS_FORM_ID = '87c5019b-ad1d-41f2-a413-a1080dfc2262';
const HS_REGION = 'na2';

// Module-level singleton so concurrent/repeat modal opens share one <script>
// tag - mirrors the reCAPTCHA loader in Recaptcha.tsx. The v2 embed scans the
// DOM for .hs-form-frame nodes once, when it loads, so the host div below is
// mounted once and kept alive (hidden, not unmounted) rather than recreated
// on every open - a div that appears after the initial scan is never picked up.
let hsScriptPromise: Promise<void> | null = null;

function loadHubSpotEmbed(): Promise<void> {
  if (hsScriptPromise) return hsScriptPromise;

  hsScriptPromise = new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${HS_SCRIPT_SRC}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = HS_SCRIPT_SRC;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      hsScriptPromise = null;
      reject(new Error('HubSpot embed script failed to load'));
    };
    document.body.appendChild(script);
  });

  return hsScriptPromise;
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

/**
 * NDA-gated document request dialog, opened from the Trust Center's
 * certification cards. Follows the VoiceCallModal shell pattern (portal,
 * escape, scroll lock) plus a hand-rolled focus trap, since the project has
 * no dialog/focus-trap dependency.
 */
export default function RequestAccessModal({ request, onClose }: RequestAccessModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const scriptRequestedRef = useRef(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  // Keeps the last non-null request so the dialog's title/label don't blank
  // out while the closing opacity transition runs.
  const [current, setCurrent] = useState<RequestAccessDoc | null>(null);
  const open = request !== null;

  useEffect(() => {
    if (request) setCurrent(request);
  }, [request]);

  // Load the HubSpot embed once, the first time the dialog opens. The host
  // div below is always mounted (see the always-rendered JSX further down),
  // so once loaded the embed scans and finds it, and later opens/closes -
  // which only toggle visibility, never unmount the div - never need a rescan.
  useEffect(() => {
    if (!open || scriptRequestedRef.current) return;
    scriptRequestedRef.current = true;
    loadHubSpotEmbed().catch(() => setEmbedFailed(true));
  }, [open]);

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
        className="relative max-h-[88vh] w-full max-w-[520px] overflow-y-auto rounded-2xl border border-white/10 p-6 outline-none transition-transform duration-200 sm:p-7"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0) 42%), rgba(11,17,32,0.92)',
          backdropFilter: 'blur(40px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.2)',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
          transform: open ? 'none' : 'translateY(10px) scale(0.97)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          tabIndex={open ? 0 : -1}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-ink/60 transition-colors hover:bg-white/[0.1] hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="eyebrow text-accent">Requesting access</span>
        <h2 id="rq-title" className="mt-2 font-display text-xl text-ink">
          {current?.docLabel ?? ''}
        </h2>
        <p id="rq-desc" className="mt-2 text-sm leading-relaxed text-ink/55">
          Access requires a signed NDA. Share your details and our team will send the document
          within one business day.
        </p>

        {/* The HubSpot host div is always present (never conditionally
            mounted) so the embed's one-time DOM scan finds it whether the
            script finishes loading before or after this dialog first opens,
            and so it stays put across every subsequent open/close. */}
        <div className="mt-6">
          <div
            className="hs-form-frame"
            data-region={HS_REGION}
            data-form-id={HS_FORM_ID}
            data-portal-id={HS_PORTAL_ID}
          />
          {embedFailed && (
            <div className="rounded-xl border border-hair bg-white/[0.04] px-5 py-6 text-center">
              <p className="text-sm text-ink/60">
                We could not load the request form. Please email us instead.
              </p>
              <a
                href="mailto:contact@dros.ai"
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent hover:opacity-80"
              >
                <Mail className="h-3.5 w-3.5" /> contact@dros.ai
              </a>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-ink/40">
          Prefer email? <a href="mailto:contact@dros.ai" className="text-accent hover:opacity-80">contact@dros.ai</a>
        </p>
      </div>
    </div>,
    document.body,
  );
}
