/** Injected as a stylesheet: settles all motion so screenshots are deterministic. */
export const FREEZE_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    scroll-behavior: auto !important;
  }
  html { scroll-behavior: auto !important; }
  video { visibility: hidden !important; }
`;

/**
 * Runs before any page script. Forces framer-motion into its reduced-motion
 * branch so components render in their settled (final) state rather than
 * their `initial` state, and neutralises the smooth-scroll path.
 */
export const FREEZE_INIT = `
  (() => {
    const mq = window.matchMedia;
    window.matchMedia = (q) => {
      if (typeof q === 'string' && q.includes('prefers-reduced-motion')) {
        return { matches: true, media: q, onchange: null,
          addListener(){}, removeListener(){},
          addEventListener(){}, removeEventListener(){},
          dispatchEvent(){ return false; } };
      }
      return mq.call(window, q);
    };
    Object.defineProperty(window, '__lenis', { value: undefined, writable: false });
  })();
`;
