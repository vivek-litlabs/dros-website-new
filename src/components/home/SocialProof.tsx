import { Quote } from 'lucide-react';
import { Section, Container, Heading, Eyebrow, Button } from '../ui';
import Counter from '../Counter';
import Reveal, { RevealItem } from '../Reveal';

const CASE_STUDIES = [
  {
    key: 'greystone',
    image: '/industries/first-party.jpg',
    heading: 'Always-on AI outreach for Greystone.',
    body: 'Replaced manual dialing with always-on AI outreach and lifted right-party contact across the portfolio.',
    cta: 'Read the story',
    href: '/customer-stories/greystone-associates',
  },
];

const STATS = [
  { value: 4.2, suffix: 'M+', decimals: 1, label: 'Accounts processed' },
  { value: 71, suffix: '%', label: 'Average contact rate' },
  { value: 100, suffix: '%', label: 'Compliance score' },
];

function ProofCard({
  image,
  heading,
  body,
  cta,
  href,
}: {
  image?: string;
  heading: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="group relative flex h-full flex-col justify-end overflow-hidden rounded-card">
      {image ? (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(3,210,252,0.25),transparent_65%),linear-gradient(160deg,#0C1E45_0%,#04070F_100%)] transition-transform duration-500 ease-premium group-hover:scale-105"
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(20,20,20,0) 0%, rgba(20,20,20,0.1) 40%, rgba(20,20,20,0.92) 75%)',
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-6 px-8 pb-10 text-center sm:px-12 sm:pb-12">
        <div className="flex flex-col items-center gap-3">
          <h3 className="max-w-[24ch] font-display text-[1.75rem] font-medium leading-[1.15] tracking-tighter text-white sm:text-3xl">
            {heading}
          </h3>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-white/70">{body}</p>
        </div>
        <Button variant="primary" size="md" to={href}>
          {cta}
        </Button>
      </div>
    </div>
  );
}

export default function SocialProof() {
  return (
    <Section id="case-studies" tone="light" spacing="sm">
      <Container>
        {/* 1. Centered heading */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center text-ink-grey">Proof</Eyebrow>
          <Heading as="h2" size="display" className="mt-4 text-ink-dark">
            Results that speak for themselves
          </Heading>
        </Reveal>

        {/* 2. Feature cards */}
        <Reveal
          stagger={0.12}
          className="mt-14 flex flex-col gap-5 md:h-[560px] md:flex-row lg:h-[620px]"
        >
          {CASE_STUDIES.map(({ key, ...study }) => (
            <RevealItem key={key} className="h-[460px] md:h-auto md:flex-1">
              <ProofCard {...study} />
            </RevealItem>
          ))}
        </Reveal>

        {/* 3. Statistics */}
        <Reveal stagger={0.1} className="mt-6 grid gap-4 sm:grid-cols-3">
          {STATS.map((m) => (
            <RevealItem key={m.label}>
              <div className="group h-full rounded-card border border-line-dark bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow">
                <div className="font-display text-4xl text-ink-dark md:text-5xl">
                  <Counter to={m.value} suffix={m.suffix} decimals={m.decimals ?? 0} />
                </div>
                <div className="mt-2 text-sm text-ink-grey transition-colors group-hover:text-ink-dark">
                  {m.label}
                </div>
              </div>
            </RevealItem>
          ))}
        </Reveal>

        {/* 4. Quote card */}
        <Reveal className="mt-6">
          <div className="relative overflow-hidden rounded-card">
            <img
              src="/airfoil/post-cta.jpg"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative z-10 flex flex-col items-center gap-6 px-8 py-16 text-center sm:px-16 md:py-20">
              <Quote className="h-8 w-8 text-white/30" />
              <blockquote className="max-w-3xl font-display text-2xl leading-snug text-white md:text-[1.75rem]">
                DROS does the outreach we never had the staff for - and every call comes back
                fully logged and compliant. It pays for itself.
              </blockquote>
              <div className="text-sm text-white/70">VP of Collections, leading US agency</div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
