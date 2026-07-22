import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import type Lenis from 'lenis';

/*
 * ACA Orlando landing hero. The full-bleed rainbow/aurora background
 * (hero-bg.png) starts at the very top of the page, edge to edge with square
 * corners (per Figma's guide-line frame - no inset, no rounding). The fixed
 * Navbar (rendered by the page shell, not here) overlays it transparently -
 * showing the gradient through - until the user scrolls, at which point its
 * own scroll-state logic switches it to a solid blurred bar. Content gets
 * generous top padding so it clears the floating transparent nav.
 */

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const navHeight = 80;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -navHeight });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/* 7x7 dot-matrix glyph shown to the right of the first headline line. */
function DotGrid() {
  const dots = [];
  const cols = 7;
  const rows = 7;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(<circle key={`${r}-${c}`} cx={4 + c * 10} cy={4 + r * 10} r={2.4} fill="currentColor" />);
    }
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 68 68"
      className="ml-4 hidden h-[0.62em] w-[0.62em] shrink-0 text-white/85 sm:inline-block"
    >
      {dots}
    </svg>
  );
}

export default function HeroAca() {
  return (
    <header data-nav-theme="dark" className="relative bg-base">
      <div className="relative w-full overflow-hidden">
        {/* Background */}
        <img
          src="/aca/hero-bg.png"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/10" />

        {/* Content */}
        <div className="relative mx-auto flex min-h-[100svh] max-w-[1420px] flex-col items-center px-5 pb-10 pt-28 text-center sm:px-6 sm:pt-32 lg:pt-36">
          <motion.div
            className="flex w-full flex-1 flex-col items-center justify-center gap-7"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 text-center font-inter text-[0.76rem] text-white/90 backdrop-blur-md sm:text-[0.82rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              The talent problem isn't hiring.
            </span>

            <h1 className="font-grotesk text-[clamp(1.85rem,7vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-[clamp(2.6rem,5.4vw,5.15rem)] md:leading-[1.04]">
              <span className="inline-flex items-center justify-center lg:whitespace-nowrap">
                Every agent you have is still
                <DotGrid />
              </span>
              <br />
              only one conversation at a time.
            </h1>

            <p className="max-w-[640px] font-inter text-base font-medium leading-[1.55] text-white/85 sm:text-[1.05rem]">
              DROS runs the calls that don't need a human - so the ones that do get your best people.
              Pick a use case below and hear it live in 60 seconds.
            </p>

            <div className="mt-1 flex w-full max-w-[340px] flex-col items-center gap-3.5 sm:max-w-none sm:flex-row sm:justify-center">
              <button
                onClick={() => scrollToId('use-cases')}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded bg-white px-6 py-3.5 font-inter text-[0.95rem] font-semibold text-[#0C1E45] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto"
              >
                <Phone className="h-4 w-4" />
                Get a live call
              </button>
              <button
                onClick={() => scrollToId('use-cases')}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded border border-white/35 bg-white/[0.08] px-6 py-3.5 font-inter text-[0.95rem] font-medium text-white backdrop-blur-md transition-colors hover:bg-white/[0.14] sm:w-auto"
              >
                Average response: 47 seconds
              </button>
            </div>
          </motion.div>

          <p className="mt-10 font-serif-accent text-[0.9rem] italic tracking-wide text-white/90 sm:text-[1.05rem]">
            <span className="mr-2 inline-block h-2.5 w-2.5 translate-y-[1px] bg-white/90 align-middle" />
            BOOTH #403 ORLANDO - JULY 22-24, 2026
          </p>
        </div>
      </div>
    </header>
  );
}
