export const route = '/pricing';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Check as CheckIcon, Minus, ChevronDown, ShieldCheck, Lock, FileCheck, Activity, Quote, Users, Sparkles, Headset } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Section, Container, Eyebrow, Heading, Button } from '../components/ui';
import Reveal, { RevealItem } from '../components/Reveal';
import { springStd, springSnappy } from '../lib/motion';
import { trackCta } from '../lib/analytics';
import { PLANS, type Plan } from '../data/plans';

/*
 * Pricing page. Content (plans, prices, features, testimonials, FAQ, CTA
 * copy) is sourced from the live dros.ai/pricing page - four real tiers, not
 * illustrative ones. Tier data lives in src/data/plans.ts and is shared with
 * the homepage pricing section. Structure (card anatomy, comparison table,
 * two-column FAQ) follows the Customer.io-inspired layout already built for
 * this page. Visuals stay on the site's current single-accent (teal) design
 * system - no separate purple/teal gradient - using the same tokens and
 * shared primitives (Section/Container/Heading/Button) as every other page.
 * The hero uses a static background image and the same white / white-55
 * two-tone heading treatment as the homepage hero (src/components/home/Hero.tsx).
 */

function PricingHeroBg() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div aria-hidden="true" className="absolute inset-0 z-0">
      <img
        src="/pricing-hero-bg.jpg"
        alt=""
        fetchPriority="high"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 [background:linear-gradient(180deg,rgba(4,7,15,0.08)_0%,rgba(4,7,15,0.68)_100%)]" />
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
}

const YES = <CheckIcon className="mx-auto h-4 w-4 text-accent" strokeWidth={2.5} />;
const NO = <Minus className="mx-auto h-3.5 w-3.5 text-ink-grey/25" strokeWidth={2.5} />;

type Row = { cat: string } | { f: string; d: (string | React.ReactNode)[] };

/* Each `d` maps positionally onto PLANS - one cell per tier, same order. */
const TABLE_ROWS: Row[] = [
  { cat: 'Accounts & Capacity' },
  { f: 'Active accounts', d: ['5,000', '20,000', 'Unlimited', 'Unlimited'] },
  { f: 'AI calling minutes / mo', d: ['1,000', '4,000', '20,000', 'Unlimited'] },
  { f: 'Workspaces', d: ['25', 'Unlimited', 'Unlimited', 'Unlimited'] },
  { f: 'Team members', d: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited'] },
  { cat: 'Features' },
  { f: 'Standard access to platform', d: [YES, YES, YES, YES] },
  { f: 'Workflow automation', d: [YES, YES, YES, YES] },
  { f: 'Multi-channel engagement', d: [YES, YES, YES, YES] },
  { f: 'All compliance tools', d: [YES, YES, YES, YES] },
  { f: 'Advanced analytics', d: [NO, YES, YES, YES] },
  { f: 'Dedicated account manager', d: [NO, YES, YES, YES] },
  { f: '24/7 phone support', d: [NO, YES, YES, YES] },
  { f: 'API access', d: [NO, YES, YES, YES] },
  { f: 'Custom integrations', d: [NO, NO, YES, YES] },
  { f: 'White-label options', d: [NO, NO, NO, YES] },
  { f: 'SLA guarantee', d: [NO, NO, NO, YES] },
  { cat: 'Support' },
  { f: 'Priority support', d: [NO, YES, YES, YES] },
];

const TRUST_LOGOS: { src: string; alt: string; href: string }[] = [
  { src: '/RMAi-Logo-500.png', alt: 'RMAi - Receivables Management Association International', href: 'https://rmaintl.org/' },
  { src: '/aca-international.svg', alt: 'ACA International', href: 'https://www.acainternational.org/' },
  { src: 'https://www.debtlink.com/images/Debtlink-Logo-Favicon-3.png', alt: 'DebtLink', href: 'https://www.debtlink.com/united-states/dover/collection-software/dros-ai?from=badge' },
];

const CATEGORY_ICONS: Record<string, typeof ShieldCheck> = {
  'Accounts & Capacity': Users,
  Features: Sparkles,
  Support: Headset,
};

const TESTIMONIALS = [
  {
    initials: 'DB',
    quote:
      'A lot of software in this industry feels outdated. With DROS, things that used to take an entire day can now be done much faster, and the visibility across portfolios has been vital for our operations.',
    name: 'Darryl Brown',
    role: 'Principal, Greystone and Associates',
  },
  {
    initials: 'VP',
    quote:
      'The ability to automate reminders and redialling without constant manual oversight was exactly what we needed at this scale.',
    name: 'VP of Collections',
    role: 'Consumer Finance Company, Utah',
  },
];

const BADGES: { label: string; Icon: typeof ShieldCheck }[] = [
  { label: 'FDCPA Compliant', Icon: ShieldCheck },
  { label: 'Reg F Ready', Icon: ShieldCheck },
  { label: 'SOC 2 Type II', Icon: Lock },
  { label: 'ISO 27001', Icon: Lock },
  { label: 'HIPAA Compliant', Icon: FileCheck },
  { label: 'TCPA Controls Built-in', Icon: FileCheck },
  { label: '99.9% Uptime SLA', Icon: Activity },
];

interface Faq {
  q: string;
  a: string;
  aNode?: React.ReactNode;
}

const FAQS: Faq[] = [
  {
    q: 'Can I switch plans at any time?',
    a: "Yes. Upgrades apply immediately and you're billed the prorated difference right away. Downgrades take effect at the start of your next billing cycle, so you keep your current limits until then.",
  },
  {
    q: "What exactly counts as an 'account'?",
    a: "An account is one active debtor record in DROS. Archived accounts don't count toward your limit, so you only pay for what you're actively working. Your dashboard shows your live count at all times.",
  },
  {
    q: 'What happens when I hit my AI calling minutes limit?',
    a: "You get an in-app alert at 80% usage, and calls already in progress won't be cut off. Once you hit the limit, outbound AI campaigns pause until you add minutes or upgrade, so there's no surprise overage.",
  },
  {
    q: 'Is Reg F compliance actually built in, or do I configure it?',
    a: 'Both. You configure the rules once at the campaign level, things like call frequency caps, time-of-day windows, and opt-out handling, and DROS enforces them automatically from there. Full rule enforcement is included from Professional upward, which is where every plan starts.',
  },
  {
    q: 'How long does onboarding actually take?',
    a: 'Most teams run their first AI campaign within 48 hours of signing up. DROS provides pre-built call flows, a guided setup checklist, and live support. Enterprise clients get a dedicated onboarding engineer who works through your tech stack and compliance configuration directly.',
  },
  {
    q: 'Do you integrate with our existing CRM or dialer?',
    a: 'API access is included from Business tier upward, enabling custom integrations with your existing stack. We have pre-built connectors for common collections CRMs. On lower tiers, you can import and export data via CSV.',
  },
  {
    q: "We're a third-party agency, does DROS support that?",
    a: 'Yes. DROS handles both first-party collections and third-party agency workflows. Run multiple client portfolios in separate workspaces, each with its own call flows, compliance settings, and reporting. Unlimited workspaces from Business tier upward.',
    aNode: (
      <>
        Yes. DROS handles both{' '}
        <Link to="/collections/first-party" className="text-accent underline underline-offset-2 transition-opacity hover:opacity-80">
          first-party collections
        </Link>{' '}
        and{' '}
        <Link to="/collections/third-party" className="text-accent underline underline-offset-2 transition-opacity hover:opacity-80">
          third-party agency
        </Link>{' '}
        workflows. Run multiple client portfolios in separate workspaces, each with its own call flows, compliance settings, and
        reporting. Unlimited workspaces from Business tier upward.
      </>
    ),
  },
  {
    q: "What does 'white-label' mean on Enterprise?",
    a: 'Enterprise clients deploy DROS under their own brand, with a custom domain, logo, and UI skin. Used by agencies offering AI collections as a managed service, or large servicers who want DROS embedded inside their own platform.',
  },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

function PriceBlock({ monthly, annual }: { monthly: number | null; annual: boolean }) {
  if (monthly === null) {
    // Matched to the h-[44px] of the numeric block below so every card's CTA lines up.
    return <div className="flex h-[44px] items-center text-[30px] font-semibold leading-none text-ink">Custom</div>;
  }
  if (monthly === 0) {
    return (
      <div className="flex items-baseline gap-1.5">
        <span className="text-[38px] font-semibold leading-none text-ink">$0</span>
        <span className="text-xs text-ink/40">/month</span>
      </div>
    );
  }
  const display = annual ? Math.round(monthly * 0.8) : monthly;
  return (
    <div className="flex items-baseline gap-1.5">
      <div className="flex items-start">
        <span className="mr-0.5 mt-1.5 text-base font-medium text-ink">$</span>
        <div className="h-[44px] overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={display}
              initial={{ y: annual ? 44 : -44, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: annual ? -44 : 44, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.44, 0, 0.11, 1] }}
              className="block text-[38px] font-semibold leading-[44px] text-ink [font-variant-numeric:tabular-nums]"
            >
              {display.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span className="text-xs text-ink/40">/month</span>
    </div>
  );
}

function PlanCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  const { features } = plan;
  const ctaLabel = plan.external ? 'Start Free Trial' : 'Contact Sales';
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01, transition: springStd }}
      className={`relative flex h-full flex-col rounded-card border bg-surface-2/60 transition-colors ${
        plan.badge ? 'border-accent/30' : 'border-hair hover:border-line'
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3 py-1 text-[11px] font-medium text-[#04070F] shadow-sm">
          {plan.badge}
        </span>
      )}

      <div className={`rounded-t-card border-b border-hair p-6 pt-8 ${plan.badge ? 'bg-accent/[0.07]' : 'bg-accent/[0.03]'}`}>
        <div className="text-base font-semibold text-ink">{plan.name}</div>
        <div className="mt-1 text-xs text-ink/45">{plan.tagline}</div>

        <div className="mt-5">
          <PriceBlock monthly={plan.monthly} annual={annual} />
        </div>

        {/* min-h reserves three lines so the CTA row stays level across the tier grid. */}
        <p className="mt-4 min-h-[63px] text-[13px] leading-relaxed text-ink/55">{plan.description}</p>

        <div className="mt-6">
          {plan.external ? (
            <Button
              variant={plan.emphasized ? 'primary' : 'secondary'}
              size="lg"
              href={plan.ctaHref}
              target="_blank"
              onClick={() => trackCta(plan.ctaKey)}
              className="w-full"
            >
              {ctaLabel}
            </Button>
          ) : (
            <Button
              variant={plan.emphasized ? 'primary' : 'secondary'}
              size="lg"
              to={plan.ctaHref}
              onClick={() => trackCta(plan.ctaKey)}
              className="w-full"
            >
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>

      {features && (
        <div className="flex-1 p-6">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink/40">{features.intro}</p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {features.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13px] leading-snug text-ink/60">
                <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-base text-ink">
      <Helmet>
        <title>Pricing - DROS</title>
        <meta
          name="description"
          content="Four plans built to scale with your portfolio. Simple, transparent pricing for AI-powered debt collection."
        />
        <link rel="canonical" href="https://dros.ai/pricing" />
        <meta property="og:title" content="Pricing - DROS" />
        <meta
          property="og:description"
          content="Four plans built to scale with your portfolio. Simple, transparent pricing for AI-powered debt collection."
        />
        <meta property="og:url" content="https://dros.ai/pricing" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navbar transparent />

      <main>
        {/* ── HERO ── */}
        <header
          data-nav-theme="dark"
          className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden bg-base text-white"
        >
          <PricingHeroBg />

          <Container wide className="relative z-40">
            <motion.div
              className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            >
              <RevealItem>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs text-white/85 backdrop-blur-md">
                  No credit card required to start
                </span>
              </RevealItem>

              <RevealItem large>
                <h1 className="font-saans text-[40px] font-medium leading-[1.08] tracking-[-0.02em] sm:text-[52px] xl:text-[60px]">
                  <span className="block text-white">Simple, Transparent</span>
                  <span className="block text-white/55">Pricing</span>
                </h1>
              </RevealItem>

              <RevealItem>
                <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
                  Four plans built for collections teams. Scale up as your portfolio grows.
                </p>
              </RevealItem>
            </motion.div>
          </Container>
        </header>

        {/* ── PLAN CARDS ── */}
        <Section tone="base" spacing="lg" id="plans" className="pt-0">
          <Container>
            <Reveal className="flex items-center justify-center gap-3 pb-10">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={`text-sm transition-colors ${!annual ? 'font-medium text-ink' : 'text-ink/40'}`}
              >
                Monthly
              </button>
              <button
                type="button"
                role="switch"
                aria-checked={annual}
                aria-label="Toggle billing period"
                onClick={() => setAnnual((v) => !v)}
                className="relative h-7 w-[52px] shrink-0 rounded-full bg-accent"
              >
                <motion.span
                  layout
                  transition={springSnappy}
                  className="absolute top-[3px] h-5 w-5 rounded-full bg-white"
                  style={{ left: annual ? 28 : 3 }}
                />
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={`text-sm transition-colors ${annual ? 'font-medium text-ink' : 'text-ink/40'}`}
              >
                Annual
              </button>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-[#04070F]">Save 20%</span>
            </Reveal>

            <Reveal stagger={0.08} className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {PLANS.map((plan) => (
                <RevealItem key={plan.key}>
                  <PlanCard plan={plan} annual={annual} />
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── TRUST STRIP ── */}
        <Section tone="base" spacing="sm" id="trust-strip">
          <Container>
            <Reveal className="flex flex-col items-center gap-6">
              <Eyebrow className="justify-center text-ink/40">Member of</Eyebrow>
              <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                {TRUST_LOGOS.map(({ src, alt, href }) => (
                  <a
                    key={alt}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                  >
                    <img src={src} alt={alt} className="h-9 w-auto object-contain sm:h-10" />
                  </a>
                ))}
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ── COMPARE TABLE ── */}
        <Section tone="light" spacing="lg" id="compare">
          <Container>
            <div className="relative">
              <Reveal className="mx-auto max-w-2xl text-center">
                <Eyebrow className="justify-center text-ink-grey">Full breakdown</Eyebrow>
                <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                  Compare all plans
                </Heading>
                <p className="mt-3 text-sm text-ink-grey">Everything side by side.</p>
              </Reveal>

              <Reveal className="mt-12 overflow-x-auto rounded-card border border-line-dark bg-white shadow-sm">
                <table className="w-full min-w-[880px] border-separate border-spacing-0 text-sm">
                  <thead>
                    <tr>
                      <th className="w-[20%] border-b border-line-dark bg-white px-4 py-4 text-left text-[11px] font-medium uppercase tracking-wider text-ink-grey" />
                      {PLANS.map((plan) => (
                        <th key={plan.key} className="border-b border-line-dark bg-white px-3 py-4 text-center">
                          <div
                            className={`text-[11px] font-medium uppercase tracking-wider ${
                              plan.badge ? 'text-accent' : 'text-ink-grey'
                            }`}
                          >
                            {plan.name}
                          </div>
                          <div className="mt-1 text-base font-semibold text-ink-dark">
                            {plan.monthly === null
                              ? 'Custom'
                              : plan.monthly === 0
                                ? '$0'
                                : `$${(annual ? Math.round(plan.monthly * 0.8) : plan.monthly).toLocaleString()}`}
                          </div>
                          {plan.monthly !== null && plan.monthly !== 0 && <div className="text-[11px] font-light text-ink-grey">/mo</div>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TABLE_ROWS.map((row, idx) => {
                      if ('cat' in row) {
                        const CategoryIcon = CATEGORY_ICONS[row.cat];
                        return (
                          <tr key={idx}>
                            <td
                              colSpan={PLANS.length + 1}
                              className="border-y border-accent/15 bg-accent/5 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-accent"
                            >
                              <span className="inline-flex items-center gap-1.5">
                                {CategoryIcon && <CategoryIcon className="h-3.5 w-3.5" strokeWidth={2} />}
                                {row.cat}
                              </span>
                            </td>
                          </tr>
                        );
                      }
                      return (
                        <tr key={idx} className={`transition-colors hover:bg-accent/[0.05] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFF]'}`}>
                          <td className="border-b border-line-dark/60 px-4 py-3 text-ink-dark">{row.f}</td>
                          {row.d.map((cell, ci) => (
                            <td key={ci} className="border-b border-line-dark/60 px-3 py-3 text-center">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ── TESTIMONIALS ── */}
        <Section tone="base" spacing="lg" id="testimonials">
          <Container>
            <Reveal>
              <Heading as="h2" size="display" className="mb-11">
                What our customers say
              </Heading>
            </Reveal>
            <Reveal stagger={0.12} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {TESTIMONIALS.map(({ initials, quote, name, role }) => (
                <RevealItem key={name}>
                  <div className="relative h-full overflow-hidden rounded-card border border-hair bg-surface-2/60 p-7">
                    <Quote className="absolute -top-2 left-5 h-16 w-16 text-accent/[0.07]" aria-hidden />
                    <p className="relative mb-6 text-sm font-light leading-[1.75] text-ink/80">{quote}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-xs font-medium text-accent">
                        {initials}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-ink">{name}</div>
                        <div className="mt-0.5 text-xs text-ink/40">{role}</div>
                      </div>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── TRUST BADGES ── */}
        <Section tone="light" spacing="sm" id="trust">
          <Container className="text-center">
            <Reveal className="mx-auto max-w-2xl">
              <Eyebrow className="justify-center text-ink-grey">Built for the industry</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                Security & compliance, covered
              </Heading>
              <p className="mt-3 text-sm text-ink-grey">Every plan runs on infrastructure built for the regulatory demands of debt collections.</p>
            </Reveal>
            <Reveal stagger={0.05} className="mt-9 flex flex-wrap justify-center gap-2.5">
              {BADGES.map(({ label, Icon }) => (
                <RevealItem key={label}>
                  <div className="flex items-center gap-2 rounded-xl border border-line-dark bg-white px-4 py-2.5 text-xs text-ink-dark shadow-sm">
                    <Icon className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
                    {label}
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── FAQ ── */}
        <Section tone="base" spacing="lg" id="faq">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
              <Reveal>
                <Eyebrow>Common questions</Eyebrow>
                <Heading as="h2" size="display" className="mt-4">
                  If it's not here, talk to us.
                </Heading>
                <p className="mt-4 text-sm leading-relaxed text-ink/50">
                  Can't find your answer?{' '}
                  <Link to="/contact" className="text-accent underline underline-offset-2 hover:opacity-80">
                    Reach out to our team
                  </Link>
                  .
                </p>
              </Reveal>

              <Reveal stagger={0.05} className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {FAQS.map((faq, i) => (
                  <RevealItem key={faq.q}>
                    <div
                      className={`cursor-pointer rounded-xl border bg-white/[0.04] px-5 py-4 transition-colors duration-200 ${
                        openFaq === i ? 'border-accent/35' : 'border-hair'
                      }`}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-sm font-medium leading-snug text-ink">{faq.q}</span>
                        <ChevronDown
                          className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 ${
                            openFaq === i ? 'rotate-180 text-accent' : 'text-ink/30'
                          }`}
                        />
                      </div>
                      <AnimatePresence initial={false}>
                        {openFaq === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.24, ease: [0.44, 0, 0.11, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="mb-0.5 mt-3 text-sm font-light leading-relaxed text-ink/55">{faq.aNode ?? faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ── END CTA ── */}
        <Section tone="panel" spacing="lg" id="cta" className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, rgba(3,210,252,0.06) 0px, rgba(3,210,252,0.06) 1px, transparent 1px, transparent 16px)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/2 h-[280px] w-[500px] -translate-x-1/2 rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(3,210,252,0.14) 0%, transparent 70%)' }}
          />
          <Container>
            <Reveal className="relative mx-auto max-w-md text-center">
              <Heading as="h2" size="display" className="mx-auto max-w-md">
                Not sure which plan fits?
              </Heading>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink/55">
                Talk to a DROS expert. We'll map your portfolio size, tech stack, and compliance requirements to the right
                plan, or build one around you.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['Free 30-min assessment', 'No commitment required', 'Implementation roadmap included'].map((perk) => (
                  <span key={perk} className="rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5 text-xs text-accent/90">
                    {perk}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('pricing_endcta_expert')}>
                  Talk to an Expert
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  href="https://app.dros.ai"
                  target="_blank"
                  onClick={() => trackCta('pricing_endcta_trial')}
                >
                  Start Free Trial
                </Button>
              </div>
            </Reveal>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
