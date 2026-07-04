import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, PhoneOff, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../ui';
import { RevealItem } from '../Reveal';
import { staggerContainer } from '../../lib/motion';
import { trackCta } from '../../lib/analytics';

/*
 * Vapi-inspired hero. A full-bleed abstract background video sits inside a
 * decorative desktop frame (animated canvas grid + traveling gradient beams),
 * with a left-aligned headline and an interactive "Initiate Call" widget.
 * DROS content is preserved; only the visual design follows Vapi.
 */

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ── Background video: two layers that slowly crossfade ── */
function HeroVideo() {
  const [reduced] = useState(prefersReducedMotion);
  const [showB, setShowB] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setShowB((v) => !v), 7000);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div aria-hidden="true" className="absolute inset-0 z-0">
      {/* Poster fallback (always present; the only visual under reduced motion) */}
      <img
        src="/airfoil/hero/hero-a-poster.jpg"
        alt=""
        fetchPriority="high"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full -scale-x-100 object-cover object-[center_0%]"
      />
      {!reduced && (
        <>
          <video
            muted
            playsInline
            autoPlay
            loop
            tabIndex={-1}
            poster="/airfoil/hero/hero-a-poster.jpg"
            className="pointer-events-none absolute inset-0 block h-full w-full -scale-x-100 object-cover object-[center_0%] transition-opacity duration-[420ms] ease-out"
            style={{ opacity: showB ? 0 : 1 }}
          >
            <source src="/airfoil/hero/hero-a.webm" type="video/webm" />
          </video>
          <video
            muted
            playsInline
            autoPlay
            loop
            tabIndex={-1}
            poster="/airfoil/hero/hero-a-poster.jpg"
            className="pointer-events-none absolute inset-0 block h-full w-full -scale-x-100 object-cover object-[center_0%] transition-opacity duration-[420ms] ease-out"
            style={{ opacity: showB ? 1 : 0 }}
          >
            <source src="/airfoil/hero/hero-b.webm" type="video/webm" />
          </video>
        </>
      )}
      {/* Darkening overlays for text legibility */}
      <div className="absolute inset-0 [background:linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.45)_100%)]" />
      <div className="absolute inset-0 [background:linear-gradient(90deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.15)_45%,rgba(0,0,0,0)_75%)]" />
    </div>
  );
}

/* ── Live-call panel shown after "Initiate Call" ── */
function CallPanel({ phone, onEnd }: { phone: string; onEnd: () => void }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="w-full max-w-[440px] rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-[40px]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-white/60">DROS Agent</span>
        <span className="flex items-center gap-2 text-xs text-white/70">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Live · {mm}:{ss}
        </span>
      </div>

      <p className="mt-3 text-sm text-white/70">
        Connecting to <span className="text-white">{phone}</span>
      </p>

      {/* Waveform */}
      <div className="mt-4 flex h-12 items-center gap-1">
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="h-full flex-1 origin-center rounded-full bg-gradient-to-t from-accent/40 to-accent motion-reduce:animate-none"
            style={{
              animation: 'fhero-wave 1s ease-in-out infinite',
              animationDelay: `${(i % 7) * 0.09}s`,
            }}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onEnd}
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#e5484d] text-white transition-transform active:scale-95"
          aria-label="End call"
        >
          <span
            className="absolute inset-0 rounded-full bg-[#e5484d] motion-reduce:hidden"
            style={{ animation: 'fhero-phone-pulse 2.4s cubic-bezier(.22,.61,.36,1) infinite' }}
          />
          <PhoneOff className="relative h-4 w-4" />
        </button>
        <span className="text-sm text-white/60">Tap to end the demo call</span>
      </div>
    </div>
  );
}

/* ── Idle "Initiate Call" widget (Vapi frosted pill, adapted to a phone input) ── */
function CallWidget({ onStart }: { onStart: (phone: string) => void }) {
  const [phone, setPhone] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    trackCta('hero_initiate_call');
    onStart(phone.trim());
  }

  return (
    <div className="w-full max-w-[560px]">
      <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
        <form
          onSubmit={handleSubmit}
          className="flex h-[50px] flex-1 items-center gap-2 rounded-xl bg-black/30 p-1.5 pl-4 backdrop-blur-[40px] ring-1 ring-white/10"
        >
          <Phone className="h-4 w-4 shrink-0 text-white/50" />
          <input
            type="tel"
            inputMode="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            aria-label="Your phone number"
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-full items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-[#0C1E45] transition-transform active:scale-95"
          >
            Initiate Call
            <Play className="h-3.5 w-3.5 fill-current" />
          </button>
        </form>
        <Link
          to="/book-meeting"
          onClick={() => trackCta('hero_book_a_demo')}
          className="inline-flex h-[50px] shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-[#0C1E45] transition-transform active:scale-95"
        >
          Book a Demo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <p className="mt-2.5 text-xs text-white/50">We won't spam you. This is a one-time demo call.</p>
    </div>
  );
}

export default function Hero() {
  const [call, setCall] = useState<string | null>(null);

  return (
    <header
      data-nav-theme="dark"
      className="relative grid h-screen min-h-[710px] w-full grid-cols-1 grid-rows-[auto] overflow-hidden bg-black text-white"
    >
      <HeroVideo />

      {/* Content column */}
      <div className="relative z-40 [grid-column:1] [grid-row:1] h-full">
        <Container
          wide
          className="flex h-full max-w-[1296px] items-end justify-start pb-16 pt-28 sm:pb-20 xl:px-[104px] xl:pb-24"
        >
          <motion.div
            className="flex w-full max-w-[560px] flex-col items-start gap-6"
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

            {/* Interactive call widget / live-call panel */}
            <RevealItem>
              {call ? (
                <CallPanel phone={call} onEnd={() => setCall(null)} />
              ) : (
                <CallWidget onStart={(phone) => setCall(phone)} />
              )}
            </RevealItem>
          </motion.div>
        </Container>
      </div>
    </header>
  );
}
