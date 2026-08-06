import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Variants, TargetAndTransition } from 'framer-motion';
import type Lenis from 'lenis';
import { springSnappy, springStd } from '../lib/motion';

interface NavbarProps {
  transparent?: boolean;
}

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

interface ResourceItem {
  label: string;
  href: string;
  description: string;
  external?: boolean;
}

const WHO_WE_SERVE_ITEMS: ResourceItem[] = [
  { label: 'First-Party Collections', href: '/collections/first-party', description: 'AI-orchestrated engagement for in-house collections teams' },
  { label: 'Third-Party Collections', href: '/collections/third-party', description: 'AI-powered engagement for agencies running client portfolios' },
  { label: 'Debt Buyer Collections', href: '/collections/debt-buyer', description: 'The engagement OS for debt buyers who self-collect' },
  { label: 'Credit Unions', href: '/collections/credit-unions', description: 'Compliant, on-brand member outreach from first notice to resolution' },
  { label: 'Consumer Lending', href: '/collections/consumer-lending', description: 'Cure accounts in the first bucket before they ever roll' },
];

const WHO_WE_SERVE_COLUMNS: ResourceItem[][] = [
  WHO_WE_SERVE_ITEMS.slice(0, 3),
  WHO_WE_SERVE_ITEMS.slice(3),
];

const RESOURCE_COLUMNS: ResourceItem[][] = [
  [
    { label: 'Blogs', href: '/blogs', description: 'Insights on debt recovery and AI voice' },
    { label: 'Newsroom', href: '/newsroom', description: 'Company news and press coverage' },
    { label: 'Customer Stories', href: '/customer-stories', description: 'How agencies win more with DROS' },
    { label: 'Events', href: '/events', description: 'Meet us at upcoming industry events' },
    { label: 'Webinars', href: '/webinars', description: 'Live sessions on collections automation' },
  ],
  [
    { label: 'ACA', href: '/aca', description: 'ACA Annual Convention 2026 - Orlando' },
    { label: 'Videos', href: '/resources/videos', description: 'Product walkthroughs and demos' },
    { label: 'API Docs', href: 'https://app.dros.ai/api-docs', description: 'Integrate DROS into your stack', external: true },
    { label: 'Release Notes', href: '/release-notes', description: 'What is new in every DROS release' },
    { label: 'Contact Us', href: '/contact', description: 'Talk to our team directly' },
  ],
];

/* Shared surface for the dropdown panels and the mobile sheet: a top-lighter
   gradient for depth, opaque enough that nothing behind it ghosts through.

   Deliberately no backdrop-filter. These panels render inside the header bar,
   which always sets one of its own (blur(0px) when transparent is still a
   backdrop-filter, not `none`). That makes the header a backdrop root, so a
   descendant's backdrop-filter samples only what paints inside the header and
   blurs nothing. Any translucency here therefore shows the page through
   perfectly sharp -- and the homepage hero puts white display type directly
   under this panel, which at even 14% reads as ghosting behind the links. */
const panelSurface: CSSProperties = {
  backgroundImage: 'linear-gradient(to bottom, rgba(23,31,49,0.98), rgba(5,8,17,0.99))',
};

/* Card depth for the desktop panels: a wide ambient shadow, a 1px top
   highlight, and a whisper-thin ring standing in for the old hard border. */
const panelShadow =
  '0 32px 80px -28px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.05)';

/* Staggered reveal for the dropdown panel's links. */
const dropdownPanel: Variants = {
  hidden: { opacity: 0, y: 6, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...springSnappy, staggerChildren: 0.025, delayChildren: 0.04 },
  },
  exit: { opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.14, ease: [0.44, 0, 0.11, 1] } },
};

const dropdownItem: Variants = {
  hidden: { opacity: 0, x: -6 },
  show: { opacity: 1, x: 0, transition: springSnappy },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export default function Navbar({ transparent = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);
  const [isMobileWhoWeServeOpen, setIsMobileWhoWeServeOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const reduce = useReducedMotion();
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!transparent) {
      setScrolled(true);
      return;
    }
    const onScroll = () => {
      const threshold = window.innerHeight - 80;
      setScrolled((prev) => (prev ? window.scrollY > threshold - 60 : window.scrollY > threshold));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparent]);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    if (isMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMenuOpen]);

  // Clear any pending dropdown-close timer on unmount.
  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  function handleDropdownEnter(key: string) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setHovered(key);
    setActiveDropdown(key);
  }

  function handleDropdownLeave() {
    closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 150);
  }

  function handleAnchorClick(id: string) {
    setIsMenuOpen(false);
    if (location.pathname === '/') {
      scrollToId(id);
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  }

  const solid = !transparent || scrolled;
  const isActive = (path: string) => location.pathname === path;

  const primaryLinks: { label: string; anchor: string }[] = [
    { label: 'How It Works', anchor: 'how-it-works' },
    { label: 'Use Cases', anchor: 'use-cases' },
  ];

  const routeLinks: { label: string; to: string }[] = [
    { label: 'Pricing', to: '/pricing' },
    { label: 'Compliance', to: '/trust-center' },
  ];

  /* Shared styling for a desktop nav item: holds the sliding hover pill. */
  const itemClass =
    'relative flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors duration-200';

  /* The sliding highlight that follows the cursor between items. */
  const HoverPill = ({ id }: { id: string }) =>
    hovered === id ? (
      <motion.span
        layoutId="nav-hover-pill"
        className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]"
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30, mass: 0.7 }}
      />
    ) : null;

  return (
    <motion.nav
      initial={reduce ? false : { y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...springStd, delay: 0.05 }}
      className="fixed top-0 z-50 w-full"
    >
      <motion.div
        // WebkitBackdropFilter is kept for older Safari, which only honours the
        // prefixed property. It is not in framer-motion's target type, hence the cast.
        animate={{
          backgroundColor: solid ? 'rgba(4,7,15,0.72)' : 'rgba(4,7,15,0)',
          borderColor: solid ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0)',
          backdropFilter: solid ? 'blur(20px)' : 'blur(0px)',
          WebkitBackdropFilter: solid ? 'blur(20px)' : 'blur(0px)',
        } as TargetAndTransition}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="border-b"
      >
        <div className="mx-auto max-w-wide px-6 lg:px-10">
          <motion.div
            animate={{ height: solid ? 64 : 76 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between"
          >
            <Link to="/" className="group flex items-center" aria-label="DROS home">
              <motion.img
                src="/DROS_horizontal_dark_bg_1.svg"
                alt="DROS"
                className="h-8 w-auto"
                whileHover={reduce ? undefined : { scale: 1.03 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={springSnappy}
              />
            </Link>

            {/* Desktop primary nav */}
            <div
              className="hidden items-center lg:flex"
              onMouseLeave={() => setHovered(null)}
            >
              {/* Who We Serve dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('who-we-serve')}
                onMouseLeave={handleDropdownLeave}
              >
                <button className={`${itemClass} text-ink/65 hover:text-ink`}>
                  <HoverPill id="who-we-serve" />
                  Who We Serve
                  <motion.span
                    animate={{ rotate: activeDropdown === 'who-we-serve' ? 180 : 0 }}
                    transition={springSnappy}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {activeDropdown === 'who-we-serve' && (
                    <div
                      className="absolute left-0 top-full pt-3"
                      onMouseEnter={() => handleDropdownEnter('who-we-serve')}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <motion.div
                        variants={dropdownPanel}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        style={{ transformOrigin: 'top left', ...panelSurface, boxShadow: panelShadow }}
                        className="w-[420px] rounded-3xl p-4"
                      >
                        <div className="flex gap-4">
                          {WHO_WE_SERVE_COLUMNS.map((column, columnIndex) => (
                            <div key={columnIndex} className="contents">
                              {columnIndex === 1 && <div className="w-px shrink-0 self-stretch bg-hair" />}
                              <div className="flex w-[190px] flex-col gap-3">
                                {column.map(({ label, href, description }) => (
                                  <motion.div key={label} variants={dropdownItem}>
                                    <Link
                                      to={href}
                                      className="group flex flex-col gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.05]"
                                    >
                                      <span className="flex items-center text-[15px] font-medium leading-[1.2] text-ink/90 transition-colors group-hover:text-ink">
                                        {label}
                                      </span>
                                      <span className="text-[11px] leading-[1.3] text-ink/55 transition-colors group-hover:text-ink/70">
                                        {description}
                                      </span>
                                    </Link>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {primaryLinks.map(({ label, anchor }) => (
                <button
                  key={anchor}
                  onClick={() => handleAnchorClick(anchor)}
                  onMouseEnter={() => setHovered(anchor)}
                  className={`${itemClass} text-ink/65 hover:text-ink`}
                >
                  <HoverPill id={anchor} />
                  {label}
                </button>
              ))}

              {routeLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  onMouseEnter={() => setHovered(to)}
                  className={`${itemClass} ${isActive(to) ? 'text-ink' : 'text-ink/65 hover:text-ink'}`}
                >
                  <HoverPill id={to} />
                  {label}
                </Link>
              ))}

              {/* Resources dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('resources')}
                onMouseLeave={handleDropdownLeave}
              >
                <button className={`${itemClass} text-ink/65 hover:text-ink`}>
                  <HoverPill id="resources" />
                  Resources
                  <motion.span
                    animate={{ rotate: activeDropdown === 'resources' ? 180 : 0 }}
                    transition={springSnappy}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {activeDropdown === 'resources' && (
                    <div
                      className="absolute right-0 top-full pt-3"
                      onMouseEnter={() => handleDropdownEnter('resources')}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <motion.div
                        variants={dropdownPanel}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        style={{ transformOrigin: 'top right', ...panelSurface, boxShadow: panelShadow }}
                        className="w-[480px] rounded-3xl p-4"
                      >
                        <div className="flex gap-4">
                          {RESOURCE_COLUMNS.map((column, columnIndex) => (
                            <div key={columnIndex} className="contents">
                              {columnIndex === 1 && <div className="w-px shrink-0 self-stretch bg-hair" />}
                              <div className="flex w-[200px] flex-col gap-3">
                                {column.map(({ label, href, description, external }) => (
                                  <motion.div key={label} variants={dropdownItem}>
                                    {external ? (
                                      <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex flex-col gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.05]"
                                      >
                                        <span className="flex items-center text-[15px] font-medium leading-[1.2] text-ink/90 transition-colors group-hover:text-ink">
                                          {label}
                                          <ArrowUpRight className="ml-0.5 h-3 w-3 text-ink/50 transition-colors group-hover:text-ink/80" />
                                        </span>
                                        <span className="text-[11px] leading-[1.3] text-ink/55 transition-colors group-hover:text-ink/70">
                                          {description}
                                        </span>
                                      </a>
                                    ) : (
                                      <Link
                                        to={href}
                                        className="group flex flex-col gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.05]"
                                      >
                                        <span className="flex items-center text-[15px] font-medium leading-[1.2] text-ink/90 transition-colors group-hover:text-ink">
                                          {label}
                                        </span>
                                        <span className="text-[11px] leading-[1.3] text-ink/55 transition-colors group-hover:text-ink/70">
                                          {description}
                                        </span>
                                      </Link>
                                    )}
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Desktop CTAs */}
            <div className="hidden items-center gap-2 lg:flex">
              <a
                href="https://app.dros.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-3.5 py-2 text-sm text-ink/65 transition-colors hover:text-ink"
              >
                Login
              </a>
              <motion.button
                onClick={() => handleAnchorClick('demo')}
                whileHover={reduce ? undefined : { scale: 1.03 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={springSnappy}
                className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#0C1E45]"
              >
                {/* Sheen sweep on hover */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                Talk to Our AI Agent
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </motion.button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="relative h-10 w-10 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <span className="absolute left-1/2 top-1/2 flex w-6 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[5px]">
                <motion.span
                  animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  transition={springSnappy}
                  className="block h-[1.5px] w-6 rounded-full bg-ink"
                />
                <motion.span
                  animate={isMenuOpen ? { opacity: 0, x: -6 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block h-[1.5px] w-6 rounded-full bg-ink"
                />
                <motion.span
                  animate={isMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  transition={springSnappy}
                  className="block h-[1.5px] w-6 rounded-full bg-ink"
                />
              </span>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.44, 0, 0.11, 1] }}
            style={panelSurface}
            className="overflow-hidden border-b border-hair lg:hidden"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
              className="max-h-[calc(100dvh-4rem)] space-y-1 overflow-y-auto overscroll-contain px-6 py-5"
            >
              {primaryLinks.map(({ label, anchor }) => (
                <motion.button
                  key={anchor}
                  variants={dropdownItem}
                  onClick={() => handleAnchorClick(anchor)}
                  className="block w-full py-2.5 text-left text-ink/75 transition-colors hover:text-ink"
                >
                  {label}
                </motion.button>
              ))}

              {routeLinks.map(({ label, to }) => (
                <motion.div key={to} variants={dropdownItem}>
                  <Link
                    to={to}
                    className="block py-2.5 text-ink/75 transition-colors hover:text-ink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={dropdownItem}>
                <button
                  onClick={() => setIsMobileWhoWeServeOpen((v) => !v)}
                  className="flex w-full items-center justify-between py-2.5 text-ink/75 transition-colors hover:text-ink"
                >
                  Who We Serve
                  <motion.span animate={{ rotate: isMobileWhoWeServeOpen ? 180 : 0 }} transition={springSnappy}>
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {isMobileWhoWeServeOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.44, 0, 0.11, 1] }}
                      className="ml-3 overflow-hidden border-l border-hair pl-3"
                    >
                      {WHO_WE_SERVE_ITEMS.map(({ label, href, description }) => (
                        <Link
                          key={label}
                          to={href}
                          className="block py-2 transition-colors hover:text-ink"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="flex items-center text-sm text-ink/70">{label}</span>
                          <span className="block text-xs text-ink/40">{description}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={dropdownItem}>
                <button
                  onClick={() => setIsMobileResourcesOpen((v) => !v)}
                  className="flex w-full items-center justify-between py-2.5 text-ink/75 transition-colors hover:text-ink"
                >
                  Resources
                  <motion.span animate={{ rotate: isMobileResourcesOpen ? 180 : 0 }} transition={springSnappy}>
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {isMobileResourcesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.44, 0, 0.11, 1] }}
                      className="ml-3 overflow-hidden border-l border-hair pl-3"
                    >
                      {RESOURCE_COLUMNS.flat().map(({ label, href, description, external }) =>
                        external ? (
                          <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block py-2 transition-colors hover:text-ink"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="flex items-center text-sm text-ink/70">
                              {label}
                              <ArrowUpRight className="ml-0.5 h-3 w-3 text-ink/40" />
                            </span>
                            <span className="block text-xs text-ink/40">{description}</span>
                          </a>
                        ) : (
                          <Link
                            key={label}
                            to={href}
                            className="block py-2 transition-colors hover:text-ink"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="flex items-center text-sm text-ink/70">{label}</span>
                            <span className="block text-xs text-ink/40">{description}</span>
                          </Link>
                        ),
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={dropdownItem} className="space-y-3 pt-4">
                <a
                  href="https://app.dros.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full border border-line px-6 py-2.5 text-center text-ink/80"
                >
                  Login
                </a>
                <button
                  onClick={() => handleAnchorClick('demo')}
                  className="flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-6 py-3 text-center font-medium text-[#0C1E45]"
                >
                  Talk to Our AI Agent
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
