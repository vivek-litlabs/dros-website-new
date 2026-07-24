import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../ui';
import { RevealItem } from '../Reveal';
import { staggerContainer } from '../../lib/motion';
import { trackCta } from '../../lib/analytics';
import { composePhone, demoCallErrorMessage, isAllowedPhone, triggerDemoCall } from '../../lib/api';
import { COUNTRIES, defaultCountryIso } from '../../lib/countries';
import CountryCodeSelect from '../CountryCodeSelect';
import Recaptcha, { type RecaptchaHandle } from '../Recaptcha';
import { SPIN_GRADIENT } from './PostCTA';
import VoiceCallModal from './VoiceCallModal';

/*
 * Vapi-inspired hero. A full-bleed abstract background video sits inside a
 * decorative desktop frame (animated canvas grid + traveling gradient beams),
 * with a left-aligned headline and an interactive "Initiate Call" widget.
 * DROS content is preserved; only the visual design follows Vapi.
 */

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ── Background video ── */
function HeroVideo() {
  const [reduced] = useState(prefersReducedMotion);

  return (
    <div aria-hidden="true" className="absolute inset-0 z-0">
      {/* Poster fallback (always present; the only visual under reduced motion) */}
      <img
        src="/airfoil/hero/vodex-hero-poster.jpg"
        alt=""
        fetchPriority="high"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />
      {!reduced && (
        <video
          muted
          playsInline
          autoPlay
          loop
          tabIndex={-1}
          poster="/airfoil/hero/vodex-hero-poster.jpg"
          className="pointer-events-none absolute inset-0 block h-full w-full object-cover object-center"
        >
          <source src="/airfoil/hero/vodex-hero.webm" type="video/webm" />
          <source src="/airfoil/hero/vodex-hero.mp4" type="video/mp4" />
        </video>
      )}
      {/* Darkening overlays for text legibility */}
      <div className="absolute inset-0 [background:linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.45)_100%)]" />
      <div className="absolute inset-0 [background:linear-gradient(90deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.15)_45%,rgba(0,0,0,0)_75%)]" />
    </div>
  );
}

/* ── Idle "Initiate Call" widget (Vapi frosted pill, adapted to name + phone inputs) ── */
function CallWidget({ onStart }: { onStart: (phone: string) => void }) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState(defaultCountryIso);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const recaptchaRef = useRef<RecaptchaHandle>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !token || loading) return;
    trackCta('hero_initiate_call');
    setError(null);
    setLoading(true);
    const dial = COUNTRIES.find((c) => c.iso === country)?.dial ?? '1';
    const fullPhone = composePhone(dial, phone);
    if (!isAllowedPhone(fullPhone)) {
      setError(
        'We can only place demo calls to US (+1) and India (+91) numbers right now. Please check your number.',
      );
      setLoading(false);
      return;
    }
    const result = await triggerDemoCall(name.trim(), fullPhone, token);
    setLoading(false);
    // reCAPTCHA tokens are single-use and expire in ~2 min - reset after every
    // submit so the next attempt starts from a fresh tick, and re-gate the
    // button (token null). This widget stays mounted under the call modal, so
    // resetting on success matters too.
    recaptchaRef.current?.reset();
    setToken(null);
    if (result.ok) {
      // Only show the live-call panel once the call was actually accepted.
      onStart(fullPhone);
    } else {
      setError(demoCallErrorMessage(result));
    }
  }

  return (
    <div className="w-full max-w-[760px]">
      <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-col items-stretch gap-3 rounded-2xl border border-white/10 bg-black/30 p-2.5 backdrop-blur-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:flex-row sm:items-center">
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex h-[50px] items-center gap-2.5 rounded-xl bg-white/[0.05] pl-4 pr-3 ring-1 ring-white/10 transition-colors focus-within:ring-accent/50">
                <User className="h-4 w-4 shrink-0 text-white/50" />
                <input
                  type="text"
                  id="hero-call-name"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  aria-label="Your name"
                  className="autofill-transparent h-full min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
              </div>
              <div className="flex h-[50px] items-center gap-2.5 rounded-xl bg-white/[0.05] pl-3 pr-3 ring-1 ring-white/10 transition-colors focus-within:ring-accent/50">
                <CountryCodeSelect
                  id="hero-call-country"
                  tone="dark"
                  value={country}
                  onChange={setCountry}
                />
                <input
                  type="tel"
                  inputMode="tel"
                  id="hero-call-phone"
                  name="phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="555 000 0000"
                  aria-label="Your phone number"
                  className="autofill-transparent h-full min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !token}
              className="group relative isolate inline-flex h-[50px] shrink-0 overflow-hidden rounded-full p-px transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:h-9"
            >
              <span
                aria-hidden="true"
                className="absolute -inset-[140%] -z-10 animate-spin opacity-0 [animation-duration:3s] transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
                style={{ background: SPIN_GRADIENT }}
              />
              <span className="flex h-full items-center justify-center gap-2 rounded-full bg-[#0C1E45] px-4 text-sm font-medium text-white">
                {loading ? 'Initiating...' : 'Initiate Call'}
                {!loading && <Play className="h-3.5 w-3.5 fill-current" />}
              </span>
            </button>
          </form>
        </div>
        <Link
          to="/book-meeting"
          onClick={() => trackCta('hero_book_a_demo')}
          className="group relative isolate inline-flex h-[50px] shrink-0 overflow-hidden rounded-full p-px transition-transform active:scale-95"
        >
          <span
            aria-hidden="true"
            className="absolute -inset-[140%] -z-10 animate-spin opacity-0 [animation-duration:3s] transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
            style={{ background: SPIN_GRADIENT }}
          />
          <span className="flex h-full items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-[#0C1E45]">
            Book a Demo
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
      {/* Sits below the pill (a 302px widget would break the horizontal row).
          The token lives in React state, so it needn't be inside the <form>. */}
      <Recaptcha ref={recaptchaRef} theme="dark" onVerify={setToken} className="mt-3" />
      {error ? (
        <p className="mt-2.5 text-xs text-red-400">{error}</p>
      ) : (
        <p className="mt-2.5 text-xs text-white/50">We won't spam you. This is a one-time demo call.</p>
      )}
    </div>
  );
}

export default function Hero() {
  const [call, setCall] = useState<string | null>(null);

  return (
    <header
      data-nav-theme="dark"
      className="relative grid min-h-[max(100vh,710px)] w-full grid-cols-1 grid-rows-[1fr] overflow-hidden bg-black text-white"
    >
      <HeroVideo />

      {/* Content column */}
      <div className="relative z-40 [grid-column:1] [grid-row:1] h-full">
        <Container
          wide
          className="flex h-full max-w-[1296px] items-end justify-start pb-16 pt-28 sm:pb-20 xl:px-[104px] xl:pb-24"
        >
          <motion.div
            className="flex w-full max-w-[760px] flex-col items-start gap-6"
            initial="hidden"
            animate="show"
            variants={staggerContainer(0.12)}
          >
            {/* Announcement pill */}
            <RevealItem>
              <a
                href="/customer-stories"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[0.8rem] text-white/85 backdrop-blur-md transition-colors hover:bg-white/[0.1]"
              >
                AI-Native Collections Platform
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </RevealItem>

            {/* Headline - Saans, two-tone, Vapi sizing */}
            <RevealItem large>
              <h1 className="font-saans max-w-[676px] font-semibold leading-[0.92] tracking-[-0.03em] text-[40px] sm:text-[56px] xl:text-[72px] 2xl:text-[80px]">
                Stop chasing debtors.
                <br />
                <span className="text-white/55">Start recovering revenue.</span>
              </h1>
            </RevealItem>

            {/* Subheadline */}
            <RevealItem>
              <p className="font-saans max-w-[508px] text-base leading-[1.4] text-white/80 sm:text-lg">
                DROS is the only AI engagement OS built exclusively for US debt collections.
                FDCPA-compliant. SOC2 ready. Proven across first-party and third-party collections.
              </p>
            </RevealItem>

            {/* Interactive call widget */}
            <RevealItem>
              <CallWidget onStart={(phone) => setCall(phone)} />
            </RevealItem>
          </motion.div>
        </Container>
      </div>

      {call && <VoiceCallModal phone={call} onEnd={() => setCall(null)} />}
    </header>
  );
}
