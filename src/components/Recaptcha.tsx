import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

// Google reCAPTCHA v2 ("I'm not a robot" checkbox), used to gate the demo-call
// forms so a visitor has to pass the challenge before the call button unlocks.
//
// The site key is public by design - it ships in the bundle and is scoped to
// the domains registered in the reCAPTCHA admin console. The matching secret
// key is never used here: it belongs to whatever verifies the token
// server-side, before the call is placed.
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, params: Record<string, unknown>) => number;
      reset: (widgetId?: number) => void;
    };
    __onRecaptchaLoad?: () => void;
  }
}

// Google's script is fetched the first time a form using this component mounts
// - not from index.html - so the pages without a call form never pay for it.
// The promise is module-level so concurrent mounts share one <script> tag; the
// homepage renders two widgets (hero + demo section).
let scriptPromise: Promise<void> | null = null;

function loadRecaptchaScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    if (window.grecaptcha?.render) {
      resolve();
      return;
    }

    // `render=explicit` stops Google from auto-scanning the DOM for
    // .g-recaptcha nodes. That scan runs once when the script loads, which a
    // router-driven page can easily miss - our forms mount and unmount as the
    // visitor navigates - so we call grecaptcha.render() ourselves instead.
    window.__onRecaptchaLoad = () => resolve();

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit&onload=__onRecaptchaLoad';
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error('reCAPTCHA script failed to load'));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export interface RecaptchaHandle {
  // Clears a spent or stale tick. reCAPTCHA tokens are single-use, so a failed
  // call attempt has to reset the widget or the visitor's retry is rejected.
  reset: () => void;
}

interface RecaptchaProps {
  // Called with the token once the visitor passes, and with null when that
  // token expires (~2 minutes) or the widget errors. Callers gate their submit
  // button on the current value.
  onVerify: (token: string | null) => void;
  theme?: 'light' | 'dark';
  className?: string;
}

const Recaptcha = forwardRef<RecaptchaHandle, RecaptchaProps>(function Recaptcha(
  { onVerify, theme = 'light', className },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  // Held in a ref so the render effect below can keep empty deps - re-running
  // it would draw a second widget into the same container.
  const onVerifyRef = useRef(onVerify);
  onVerifyRef.current = onVerify;

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        if (widgetId.current !== null) window.grecaptcha?.reset(widgetId.current);
      },
    }),
    [],
  );

  useEffect(() => {
    if (!SITE_KEY) {
      console.warn(
        'VITE_RECAPTCHA_SITE_KEY is not set - the reCAPTCHA checkbox will not render and the call button stays disabled.',
      );
      return;
    }

    let cancelled = false;

    loadRecaptchaScript()
      .then(() => {
        // StrictMode double-invokes effects in development; without the
        // widgetId guard the second pass renders a duplicate checkbox.
        if (cancelled || !containerRef.current || widgetId.current !== null) return;

        widgetId.current = window.grecaptcha!.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme,
          callback: (token: string) => onVerifyRef.current(token),
          'expired-callback': () => onVerifyRef.current(null),
          'error-callback': () => onVerifyRef.current(null),
        });
      })
      .catch((error) => {
        console.warn('reCAPTCHA unavailable:', error);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!SITE_KEY) return null;

  return (
    <div className={className}>
      {/* The widget renders at a fixed 302px. Scaled down on the narrowest
          phones so it can't push the page into horizontal scroll. */}
      <div ref={containerRef} className="origin-left max-[350px]:scale-90" />
    </div>
  );
});

export default Recaptcha;
