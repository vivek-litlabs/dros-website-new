import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Section, Container, Heading, Button } from '../ui';
import { springStd } from '../../lib/motion';
import { trackCta } from '../../lib/analytics';

const MotionLink = motion(Link);

/*
 * Post-CTA section, styled after Vapi's "Start Building" block: a full-bleed
 * dark section with a background photo, a dark overlay, a huge centered
 * heading, and two pill buttons, sitting directly above the footer. DROS
 * copy, links, and colors are our own; only the layout and the spinning
 * gradient-border button are ported from the reference.
 *
 * Fades in on mount rather than on scroll-into-view (unlike the other
 * whileInView-based homepage sections): this is the last section before the
 * footer, so gating it behind an IntersectionObserver threshold adds a
 * failure mode (it can get stuck hidden if the observer's trigger is missed,
 * e.g. across an HMR update) for no visual benefit - matches Vapi's own
 * markup, which has no scroll-reveal on this section either.
 */

export const SPIN_GRADIENT =
  'conic-gradient(from 90deg, rgba(3,210,252,0) 0deg, rgba(3,210,252,0) 230deg, rgba(3,210,252,0.45) 275deg, #03D2FC 300deg, #ffffff 315deg, #03D2FC 330deg, rgba(3,210,252,0.45) 352deg, rgba(3,210,252,0) 360deg)';

export function SpinButton({
  to,
  children,
  onClick,
}: {
  to: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <MotionLink
      to={to}
      onClick={onClick}
      className="group relative isolate inline-flex overflow-hidden rounded-full p-px"
      whileHover={reduce ? undefined : { scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
    >
      <span
        aria-hidden="true"
        className="absolute -inset-[140%] -z-10 animate-spin [animation-duration:3s] motion-reduce:animate-none group-hover:scale-110"
        style={{ background: SPIN_GRADIENT, transition: 'transform 0.5s' }}
      />
      <span className="flex h-full items-center justify-center rounded-full bg-base px-6 py-3 text-sm font-medium text-ink">
        {children}
      </span>
    </MotionLink>
  );
}

export default function PostCTA() {
  return (
    <Section tone="base" className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img
          src="/airfoil/post-cta.jpg"
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <Container wide className="relative">
        <motion.div
          className="flex flex-col items-center gap-8 text-center md:gap-10"
          initial={{ opacity: 0.001, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springStd}
        >
          <Heading as="h2" size="display-lg" className="mx-auto max-w-[18ch]">
            Ready to put collections on autopilot?
          </Heading>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              to="/book-meeting"
              onClick={() => trackCta('Book a Meeting - post-cta')}
            >
              Book a Meeting
            </Button>
            <SpinButton to="/contact" onClick={() => trackCta('Talk to Sales - post-cta')}>
              Talk to Sales
            </SpinButton>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
