import { Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container, Eyebrow } from '../ui';
import Reveal from '../Reveal';

/*
 * "Who is it for" card row, styled after Customer.io's "Everything you
 * need to engage customers" capability grid: a row of cards that each
 * grow via flex-grow on hover, revealing title + copy over a photo.
 * Pure Tailwind (transition-[flex-grow] + group-hover), no motion library,
 * matching the reference implementation.
 */

const AUDIENCES = [
  {
    title: 'First-Party Collections',
    body: 'Recover your own debt earlier in the cycle while protecting the customer relationship.',
    image: '/industries/vodex/who-is-it-for-1.jpg',
    href: '/collections/first-party',
  },
  {
    title: 'Third-Party Agencies',
    body: 'Scale outreach across portfolios without adding headcount or compliance risk.',
    image: '/industries/vodex/who-is-it-for-2.jpg',
    href: '/collections/third-party',
  },
  {
    title: 'Debt Buyers',
    body: 'Work purchased portfolios with a complete, auditable record for every account.',
    image: '/industries/vodex/who-is-it-for-3.jpg',
    href: '/collections/debt-buyer',
  },
  {
    title: 'Credit Unions',
    body: 'Keep member outreach compliant and on-brand from first notice to resolution.',
    image: '/industries/vodex/who-is-it-for-4.jpg',
    href: '/collections/credit-unions',
  },
  {
    title: 'Consumer Lending',
    body: 'Automated reminders and follow-ups that get balances paid without the awkward calls.',
    image: '/industries/vodex/who-is-it-for-5.jpg',
    href: '/collections/consumer-lending',
  },
];

export default function WhoIsItFor() {
  return (
    <section id="who-is-it-for" className="relative bg-paper pt-14 text-ink-dark md:pt-20">
      <Container wide>
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow className="text-ink-grey">Who it is for</Eyebrow>
            <h2 className="mt-6 font-display text-display text-ink-dark">
              Built for every collection scenario
            </h2>
          </div>
          <Link
            to="/book-meeting"
            className="group inline-flex shrink-0 items-center gap-2 pb-0.5 text-base font-semibold text-ink-dark"
          >
            Talk to Our AI Agent
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </Link>
        </Reveal>
      </Container>

      {/* Full-bleed card row: breaks out of the container to span the full viewport width. */}
      <div className="relative left-1/2 mt-12 w-screen -translate-x-1/2 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex h-[480px] min-w-[1000px] flex-row sm:h-[560px] md:h-[620px] md:min-w-0">
          {AUDIENCES.map((audience) => (
            <Link
              key={audience.title}
              to={audience.href}
              className="group relative isolate flex min-w-[200px] flex-1 flex-col items-start justify-between overflow-hidden p-5 transition-[flex-grow] duration-[600ms] ease-premium will-change-[flex-grow] sm:p-6 md:hover:flex-[1.6]"
            >
              <img
                src={audience.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 z-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 z-[1] bg-black/60 transition-opacity duration-[600ms] ease-premium group-hover:opacity-0 group-active:opacity-0" />

              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-dark transition-colors duration-300 group-hover:bg-ink-dark group-hover:text-accent">
                <Plus className="h-5 w-5" strokeWidth={1.5} />
              </div>

              <div className="relative z-10 flex flex-col gap-2 overflow-hidden">
                <h3 className="translate-y-0 text-lg font-semibold text-white transition-transform duration-[600ms] ease-premium md:translate-y-12 md:group-hover:translate-y-0">
                  {audience.title}
                </h3>
                <p className="max-w-[26ch] translate-y-0 text-sm leading-relaxed text-white/85 opacity-100 transition-all duration-[600ms] ease-premium md:translate-y-12 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-active:opacity-100">
                  {audience.body}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
