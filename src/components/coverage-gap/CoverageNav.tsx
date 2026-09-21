import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui';
import { springStd } from '../../lib/motion';
import { NAV_HEIGHT, scrollToSection, topOffset } from './scroll';
import AnnouncementBanner, { BANNER_HEIGHT_CLASS } from '../../pages/AnnouncementBanner';

/*
 * Page-specific nav for the Coverage Gap Assessment landing page, taken from
 * the original landing HTML. Intentionally NOT the shared Navbar: this campaign
 * page carries its own anchor nav and a single "Take the assessment" CTA.
 *
 * The announcement banner above it IS the shared component, so its copy and its
 * dismissal stay in sync with the rest of the site. Because that banner is
 * fixed, the nav is fixed beneath it (same arrangement as Navbar.tsx) and each
 * one gets a spacer to hold its height in normal flow.
 */

const LINKS = [
  { label: 'How it works', id: 'how' },
  { label: 'Compliance', id: 'compliance' },
  { label: '30-day proof', id: 'proof' },
  { label: 'FAQ', id: 'faq' },
];

export default function CoverageNav({
  onStart,
  bannerDismissed,
  onDismissBanner,
}: {
  onStart: () => void;
  bannerDismissed: boolean;
  onDismissBanner: () => void;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function go(id: string) {
    setOpen(false);
    scrollToSection(id, reduce, topOffset(!bannerDismissed));
  }

  function start() {
    setOpen(false);
    onStart();
  }

  return (
    <>
      {!bannerDismissed && (
        <>
          <AnnouncementBanner onClose={onDismissBanner} />
          {/* Holds the fixed banner's height in normal flow. */}
          <div aria-hidden className={BANNER_HEIGHT_CLASS} />
        </>
      )}

      <motion.nav
        initial={reduce ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...springStd, delay: 0.05 }}
        className={`fixed z-50 w-full border-b text-ink backdrop-blur-xl transition-colors duration-300 ${
          bannerDismissed ? 'top-0' : 'top-[64px] sm:top-11'
        } ${scrolled ? 'border-white/10 bg-base/85' : 'border-white/[0.06] bg-base/70'}`}
      >
        <div
          style={{ height: NAV_HEIGHT }}
          className="mx-auto flex w-full max-w-container items-center justify-between gap-4 px-6 sm:px-10 lg:px-14"
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
            }}
            aria-label="DROS home"
            className="group flex items-center gap-2.5"
          >
            <img
              src="/DROS_horizontal_dark_bg_1.svg"
              alt="DROS"
              className="h-7 w-auto transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="text-[11px] font-medium text-ink/55 transition-colors group-hover:text-ink/80">
              by Vodex
            </span>
          </a>

          <div className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setHovered(null)}>
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.id);
                }}
                onMouseEnter={() => setHovered(l.id)}
                onFocus={() => setHovered(l.id)}
                className="relative rounded-full px-3.5 py-2 text-sm text-ink/75 transition-colors duration-200 hover:text-ink"
              >
                {hovered === l.id && (
                  <motion.span
                    layoutId="cg-nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 300, damping: 30, mass: 0.7 }
                    }
                  />
                )}
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden text-sm text-ink/70 transition-colors hover:text-ink lg:inline"
            >
              dros.ai
            </Link>
            <Button variant="primary" size="md" onClick={start} className="hidden lg:inline-flex">
              Take the assessment
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="cg-mobile-menu"
              className="flex h-11 w-11 items-center justify-center rounded-xl text-ink transition-colors hover:bg-white/[0.06] lg:hidden"
            >
              <span className="relative block h-4 w-[22px]">
                <motion.span
                  className="absolute left-0 h-[2px] w-full rounded bg-current"
                  animate={open ? { top: 7, rotate: 45 } : { top: 0, rotate: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute left-0 top-[7px] h-[2px] w-full rounded bg-current"
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.15 }}
                />
                <motion.span
                  className="absolute left-0 h-[2px] w-full rounded bg-current"
                  animate={open ? { top: 7, rotate: -45 } : { top: 14, rotate: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="cg-mobile-menu"
              key="menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-white/[0.08] bg-base lg:hidden"
            >
              <div className="px-6 pb-5 pt-1 sm:px-10">
                {LINKS.map((l, i) => (
                  <motion.a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(l.id);
                    }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.25 }}
                    className="block border-b border-white/[0.06] py-3.5 text-[17px] text-ink transition-colors hover:text-accent"
                  >
                    {l.label}
                  </motion.a>
                ))}
                <Button variant="primary" size="lg" onClick={start} className="mt-5 w-full">
                  Take the assessment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Holds the fixed nav's height, so the hero still starts below it. */}
      <div aria-hidden style={{ height: NAV_HEIGHT }} />
    </>
  );
}
