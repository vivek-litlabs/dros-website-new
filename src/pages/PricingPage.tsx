export const route = '/pricing';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Check as CheckIcon, Minus, ChevronDown, ShieldCheck, Lock, FileCheck, Activity, Quote } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Section, Container, Eyebrow, Heading, Button } from '../components/ui';
import Reveal, { RevealItem } from '../components/Reveal';
import { springStd, springSnappy } from '../lib/motion';
import { trackCta } from '../lib/analytics';

/*
 * Pricing page. Content (plans, prices, features, testimonials, FAQ, CTA
 * copy) is sourced from the live dros.ai/pricing page - six real tiers, not
 * illustrative ones. Structure (card anatomy, comparison table,
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

/* ── Plan data (matches the live dros.ai/pricing page) ── */
interface Plan {
  key: string;
  name: string;
  tagline: string;
  monthly: number | null;
  badge?: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaKey: string;
  external: boolean;
  /** Solid white pill (matches Button variant="primary" used site-wide) vs outline. */
  emphasized: boolean;
}

const PLANS: Plan[] = [
  {
    key: 'free',
    name: 'Free',
    tagline: 'Perfect for getting started',
    monthly: 0,
    description: 'Run your first AI calls and explore the platform before spending a dollar.',
    ctaLabel: 'Start Free Trial',
    ctaHref: 'https://app.dros.ai',
    ctaKey: 'pricing_free_cta',
    external: true,
    emphasized: false,
  },
  {
    key: 'starter',
    name: 'Starter',
    tagline: 'For growing teams',
    monthly: 20,
    badge: 'Most Popular',
    description: 'Automate first-touch outreach and right-party contact. Stop chasing accounts manually.',
    ctaLabel: 'Start Free Trial',
    ctaHref: 'https://app.dros.ai',
    ctaKey: 'pricing_starter_cta',
    external: true,
    emphasized: true,
  },
  {
    key: 'professional',
    name: 'Professional',
    tagline: 'For established teams',
    monthly: 199,
    description: 'Full compliance tooling and real portfolio capacity for serious first- or third-party operations.',
    ctaLabel: 'Start Free Trial',
    ctaHref: 'https://app.dros.ai',
    ctaKey: 'pricing_professional_cta',
    external: true,
    emphasized: false,
  },
  {
    key: 'business',
    name: 'Business',
    tagline: 'For high-volume operations',
    monthly: 499,
    description: 'API access, dedicated AM, and analytics to run multiple portfolios without manual follow-up.',
    ctaLabel: 'Start Free Trial',
    ctaHref: 'https://app.dros.ai',
    ctaKey: 'pricing_business_cta',
    external: true,
    emphasized: false,
  },
  {
    key: 'business-plus',
    name: 'Business Plus',
    tagline: 'For scaling enterprises',
    monthly: 1999,
    badge: 'New Plan',
    description: 'Unlimited accounts and custom integrations, no volume ceilings.',
    ctaLabel: 'Start Free Trial',
    ctaHref: 'https://app.dros.ai',
    ctaKey: 'pricing_bizplus_cta',
    external: true,
    emphasized: true,
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    tagline: 'For organizations with unique needs',
    monthly: null,
    description: 'White-label deployment, SLA guarantee, and a solution built around your exact requirements.',
    ctaLabel: 'Contact Sales',
    ctaHref: '/book-meeting',
    ctaKey: 'pricing_enterprise_cta',
    external: false,
    emphasized: true,
  },
];

const YES = <CheckIcon className="mx-auto h-4 w-4 text-accent" strokeWidth={2.5} />;
const NO = <Minus className="mx-auto h-3.5 w-3.5 text-ink-grey/25" strokeWidth={2.5} />;

type Row = { cat: string } | { f: string; d: (string | React.ReactNode)[] };

const TABLE_ROWS: Row[] = [
  { cat: 'Accounts & Capacity' },
  { f: 'Active accounts', d: ['100', '500', '5,000', '20,000', 'Unlimited', 'Unlimited'] },
  { f: 'AI calling minutes / mo', d: ['50', '100', '1,000', '4,000', '20,000', 'Unlimited'] },
  { f: 'Workspaces', d: ['2', '5', '25', 'Unlimited', 'Unlimited', 'Unlimited'] },
  { f: 'Team members', d: ['Up to 3', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited'] },
  { cat: 'Features' },
  { f: 'Standard access to platform', d: [YES, YES, YES, YES, YES, YES] },
  { f: 'Workflow automation', d: [NO, YES, YES, YES, YES, YES] },
  { f: 'Multi-channel engagement', d: [NO, YES, YES, YES, YES, YES] },
  { f: 'All compliance tools', d: [NO, NO, YES, YES, YES, YES] },
  { f: 'Advanced analytics', d: [NO, NO, NO, YES, YES, YES] },
  { f: 'Dedicated account manager', d: [NO, NO, NO, YES, YES, YES] },
  { f: '24/7 phone support', d: [NO, NO, NO, YES, YES, YES] },
  { f: 'API access', d: [NO, NO, NO, YES, YES, YES] },
  { f: 'Custom integrations', d: [NO, NO, NO, NO, YES, YES] },
  { f: 'White-label options', d: [NO, NO, NO, NO, NO, YES] },
  { f: 'SLA guarantee', d: [NO, NO, NO, NO, NO, YES] },
  { cat: 'Support' },
  { f: 'Priority support', d: [NO, NO, YES, YES, YES, YES] },
];

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
    a: 'Both. You configure the rules once at the campaign level, things like call frequency caps, time-of-day windows, and opt-out handling, and DROS enforces them automatically from there. Available from Professional tier upward; Starter gives you the workflow foundation to build on.',
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
    return <div className="text-[30px] font-semibold leading-none text-ink">Custom Pricing</div>;
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
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01, transition: springStd }}
      className={`relative flex h-full flex-col rounded-card border bg-surface-2/60 p-6 pt-8 transition-colors ${
        plan.badge ? 'border-accent/30' : 'border-hair hover:border-line'
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3 py-1 text-[11px] font-medium text-[#04070F] shadow-sm">
          {plan.badge}
        </span>
      )}

      <div className="text-base font-semibold text-ink">{plan.name}</div>
      <div className="mt-1 text-xs text-ink/45">{plan.tagline}</div>

      <div className="mt-5">
        <PriceBlock monthly={plan.monthly} annual={annual} />
      </div>

      <p className="mt-4 flex-1 text-[13px] leading-relaxed text-ink/55">{plan.description}</p>

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
            {plan.ctaLabel}
          </Button>
        ) : (
          <Button
            variant={plan.emphasized ? 'primary' : 'secondary'}
            size="lg"
            to={plan.ctaHref}
            onClick={() => trackCta(plan.ctaKey)}
            className="w-full"
          >
            {plan.ctaLabel}
          </Button>
        )}
      </div>
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
          content="Six plans from free to enterprise. Simple, transparent pricing for AI-powered debt collection that scales with your portfolio."
        />
        <link rel="canonical" href="https://dros.ai/pricing" />
        <meta property="og:title" content="Pricing - DROS" />
        <meta
          property="og:description"
          content="Six plans from free to enterprise. Simple, transparent pricing for AI-powered debt collection that scales with your portfolio."
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
                  Six plans from free to enterprise. Scale up as your portfolio grows.
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

            <Reveal stagger={0.08} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PLANS.map((plan) => (
                <RevealItem key={plan.key}>
                  <PlanCard plan={plan} annual={annual} />
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── COMPARE TABLE ── */}
        <Section tone="light" spacing="lg" id="compare">
          <Container>
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
                  {TABLE_ROWS.map((row, idx) =>
                    'cat' in row ? (
                      <tr key={idx}>
                        <td
                          colSpan={7}
                          className="border-y border-accent/15 bg-accent/5 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-accent"
                        >
                          {row.cat}
                        </td>
                      </tr>
                    ) : (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFF]'}>
                        <td className="border-b border-line-dark/60 px-4 py-3 text-ink-dark">{row.f}</td>
                        {row.d.map((cell, ci) => (
                          <td key={ci} className="border-b border-line-dark/60 px-3 py-3 text-center">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </Reveal>
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
                      {openFaq === i && (
                        <p className="mt-3 text-sm font-light leading-relaxed text-ink/55">{faq.aNode ?? faq.a}</p>
                      )}
                    </div>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ── END CTA ── */}
        <Section tone="light" spacing="lg" id="cta">
          <Container>
            <Reveal className="relative overflow-hidden rounded-card border border-accent/20 bg-base px-8 py-16 text-center sm:px-12 md:py-20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-1/2 h-[280px] w-[500px] -translate-x-1/2 rounded-full"
                style={{ background: 'radial-gradient(ellipse, rgba(3,210,252,0.12) 0%, transparent 70%)' }}
              />
              <div className="relative">
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
              </div>
            </Reveal>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
