import { ShieldCheck, PhoneCall, BadgeCheck, Scale, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Section, Container, Eyebrow, Button } from '../ui';
import Reveal, { RevealItem } from '../Reveal';

const STANDARDS: { Icon: LucideIcon; name: string; body: string }[] = [
  {
    Icon: ShieldCheck,
    name: 'FDCPA',
    body: 'Every call is scripted and logged to Fair Debt Collection Practices Act standards.',
  },
  {
    Icon: PhoneCall,
    name: 'TCPA',
    body: 'Consent is tracked and enforced automatically across every call and text.',
  },
  {
    Icon: BadgeCheck,
    name: 'SOC 2 Type II',
    body: 'Bank-level security controls with continuous, independently audited monitoring.',
  },
  {
    Icon: Scale,
    name: 'CFPB Reg F',
    body: 'Call cadence and time-of-day limits are enforced automatically, every time.',
  },
  {
    Icon: MapPin,
    name: 'State mini-FDCPA',
    body: 'State-level collection laws are monitored and applied without manual review.',
  },
];

export default function Compliance() {
  return (
    <Section id="compliance" tone="light" spacing="sm">
      <Container>
        <div className="flex flex-col gap-12 xl:flex-row xl:items-start xl:gap-16">
          {/* Header column */}
          <Reveal className="flex flex-col items-center gap-4 text-center md:items-start md:text-left xl:w-[420px] xl:shrink-0">
            <Eyebrow className="text-ink-grey">Compliance</Eyebrow>
            <h2 className="font-display text-display text-ink-dark">
              Compliant by design.
              <br />
              Not by exception.
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-ink-grey">
              Every interaction is scripted, logged, and audited automatically - so compliance
              never depends on a judgment call.
            </p>
            <div className="mt-2">
              <Button variant="onLight" to="/book-meeting">Talk to Our AI Agent</Button>
            </div>
          </Reveal>

          {/* Feature grid */}
          <Reveal
            stagger={0.08}
            className="flex flex-1 flex-wrap content-start gap-x-12 gap-y-10 border-t border-line-dark pt-10 xl:border-t-0 xl:pt-0"
          >
            {STANDARDS.map(({ Icon, name, body }) => (
              <RevealItem key={name} className="w-full md:w-[calc(50%-1.5rem)]">
                <div className="flex items-start gap-4">
                  <Icon className="mt-0.5 h-6 w-6 shrink-0 text-ink-dark" strokeWidth={1.5} aria-hidden />
                  <div>
                    <div className="font-semibold text-ink-dark">{name}</div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-grey">{body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
