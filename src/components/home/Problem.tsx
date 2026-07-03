import { Clock, ShieldAlert, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Section, Container } from '../ui';
import Reveal, { RevealItem } from '../Reveal';

/*
 * Problem section, restyled after Customer.io's "We unify..." block:
 * a large centered heading + lighter subheading, then a 3-column feature
 * grid separated by hairline dividers. Each column has a compact line icon,
 * a bold dark lead-in, and a muted continuation. DROS copy is preserved.
 */

// Customer.io renders these icons in a dark olive-gold (mustard-700 ≈ #8a6b1f).
const ICON_COLOR = 'text-[#8a6b1f]';

const PAIN_POINTS: { Icon: LucideIcon; lead: string; body: string }[] = [
  {
    Icon: Clock,
    lead: 'Time, wasted.',
    body: 'Collectors spend 80% of their day dialing numbers that never pick up.',
  },
  {
    Icon: ShieldAlert,
    lead: 'Risk, compounding.',
    body: 'Every human judgment call is one more compliance exposure waiting to happen.',
  },
  {
    Icon: TrendingDown,
    lead: 'Revenue, left behind.',
    body: 'Recovery stalls the moment outreach outgrows your headcount.',
  },
];

export default function Problem() {
  return (
    <Section id="problem" tone="light" className="relative overflow-x-clip">
      <Container className="relative">
        {/* Heading + subheading */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <RevealItem>
            <h2 className="font-saans mx-auto max-w-[24ch] text-[1.875rem] font-[475] leading-[1.125] tracking-[0.0125em] text-ink-dark sm:text-[2.25rem] lg:text-[2.5rem]">
              Sound familiar?
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-grey">
              Three ways manual collections quietly bleed time, risk and revenue - every single day.
            </p>
          </RevealItem>
        </Reveal>

        {/* 3-column feature grid with hairline dividers */}
        <Reveal
          stagger={0.12}
          as="ul"
          className="mt-14 grid grid-cols-1 gap-4 border-t border-line-dark sm:mt-16 sm:grid-cols-2 md:grid-cols-3 lg:gap-8"
        >
          {PAIN_POINTS.map((point) => (
            <RevealItem
              as="li"
              key={point.lead}
              className="flex flex-col items-start gap-8 border-l border-line-dark px-5 py-6 md:px-6 lg:px-8"
            >
              <point.Icon className={`h-5 w-5 ${ICON_COLOR}`} strokeWidth={1.5} aria-hidden />
              <p className="text-lg leading-relaxed text-ink-grey">
                <strong className="font-semibold text-ink-dark">{point.lead}</strong>{' '}
                {point.body}
              </p>
            </RevealItem>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
