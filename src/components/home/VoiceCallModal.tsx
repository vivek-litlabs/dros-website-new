import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PhoneOff } from 'lucide-react';

interface VoiceCallModalProps {
  phone: string;
  onEnd: () => void;
}

/* Minimal liquid-gradient orb: a single flowing teal marble with soft outer
   glow and expanding "listening" rings, no scattered particles. */
function VoiceOrb() {
  return (
    <div className="relative mx-auto flex h-[190px] w-[190px] items-center justify-center">
      <div
        className="absolute -inset-[18%] rounded-full opacity-90 blur-[16px]"
        style={{
          background:
            'radial-gradient(closest-side, rgba(3,210,252,0.34), rgba(3,210,252,0.06) 62%, transparent 74%)',
          animation: 'forb-bloom 3.6s ease-in-out infinite',
        }}
      />
      <span
        className="absolute h-[176px] w-[176px] rounded-full border border-accent/50 opacity-0 motion-reduce:hidden"
        style={{ animation: 'forb-pulse 2.2s ease-out infinite' }}
      />
      <span
        className="absolute h-[176px] w-[176px] rounded-full border border-accent/50 opacity-0 motion-reduce:hidden"
        style={{ animation: 'forb-pulse 2.2s ease-out infinite', animationDelay: '1.1s' }}
      />
      <div
        className="relative h-[176px] w-[176px] overflow-hidden rounded-full"
        style={{
          background: '#050d18',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.65), 0 14px 44px rgba(0,0,0,0.5)',
        }}
      >
        <span
          className="absolute left-[6px] top-[-2px] h-[150px] w-[150px] rounded-full blur-[22px]"
          style={{
            background: 'radial-gradient(closest-side, rgba(3,210,252,0.9), rgba(3,210,252,0) 72%)',
            animation: 'forb-flow1 7s ease-in-out infinite',
          }}
        />
        <span
          className="absolute bottom-[-4px] right-[-6px] h-[140px] w-[140px] rounded-full blur-[22px]"
          style={{
            background: 'radial-gradient(closest-side, rgba(20,90,220,0.85), rgba(20,90,220,0) 72%)',
            animation: 'forb-flow2 9s ease-in-out infinite',
          }}
        />
        <span
          className="absolute bottom-[6px] left-[28px] h-[120px] w-[120px] rounded-full blur-[22px]"
          style={{
            background: 'radial-gradient(closest-side, rgba(120,225,255,0.8), rgba(120,225,255,0) 72%)',
            animation: 'forb-flow3 6s ease-in-out infinite',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(42% 34% at 34% 26%, rgba(255,255,255,0.35), rgba(255,255,255,0) 58%), radial-gradient(120% 120% at 50% 50%, transparent 52%, rgba(3,8,16,0.55) 82%, rgba(3,8,16,0.9) 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 26px rgba(3,210,252,0.14)' }}
        />
      </div>
    </div>
  );
}

/* Centered voice-assistant overlay shown while a demo call is live.
   Purely presentational - the call itself is placed server-side; ending it
   here only resets UI state. */
export default function VoiceCallModal({ phone, onEnd }: VoiceCallModalProps) {
  const [seconds, setSeconds] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  function handleEnd() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onEnd, 300);
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleEnd();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, '0');

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
      style={{ animation: 'forb-overlay-in 0.25s ease both' }}
      onClick={handleEnd}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Live demo call"
        className="relative w-full max-w-[400px] overflow-hidden rounded-2xl border border-white/10 p-6"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0) 42%), rgba(11,17,32,0.55)',
          backdropFilter: 'blur(40px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.2)',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
          animation: closing
            ? 'forb-card-out 0.3s cubic-bezier(0.4,0,0.2,1) forwards'
            : 'forb-card-in 0.4s cubic-bezier(0.22,0.61,0.36,1) both',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/60">DROS Agent</span>
          <span className="flex items-center gap-2 text-[13px] tabular-nums text-white/70">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Live · {mm}:{ss}
          </span>
        </div>

        <div className="my-7">
          <VoiceOrb />
        </div>

        <p className="text-center text-[15px] text-white/70">
          Connecting to <span className="font-semibold text-white">{phone}</span>
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleEnd}
            className="relative inline-flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#e5484d] text-white shadow-[0_8px_24px_rgba(229,72,77,0.35)] transition-transform active:scale-95"
            aria-label="End call"
          >
            <span
              className="absolute inset-0 rounded-full bg-[#e5484d] motion-reduce:hidden"
              style={{ animation: 'fhero-phone-pulse 2.4s cubic-bezier(.22,.61,.36,1) infinite' }}
            />
            <PhoneOff className="relative h-5 w-5" />
          </button>
          <span className="text-sm text-white/60">Tap to end the demo call</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
