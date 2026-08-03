/*
 * Single source of truth for pricing tiers. Consumed by the /pricing page
 * (src/pages/PricingPage.tsx) and the homepage pricing section
 * (src/components/home/Pricing.tsx) so the two surfaces can never drift apart.
 * Presentation stays per-page: /pricing owns the billing toggle and comparison
 * table, the homepage owns its dark card treatment. Only tier facts live here.
 */

export interface Plan {
  key: string;
  name: string;
  tagline: string;
  /** null = custom pricing. */
  monthly: number | null;
  /** Present on at most one paid tier; drives the highlight treatment on both pages. */
  badge?: string;
  description: string;
  ctaHref: string;
  /** Analytics key for the /pricing card CTA. The homepage uses its own keys. */
  ctaKey: string;
  /** true -> app.dros.ai in a new tab; false -> in-app router link. */
  external: boolean;
  /** Solid white pill (matches Button variant="primary" used site-wide) vs outline. */
  emphasized: boolean;
  features: { intro: string; items: string[] };
}

export const PLANS: Plan[] = [
  {
    key: 'professional',
    name: 'Professional',
    tagline: 'For established teams',
    monthly: 199,
    description: 'Full compliance tooling and real portfolio capacity for serious first- or third-party operations.',
    ctaHref: 'https://app.dros.ai',
    ctaKey: 'pricing_professional_cta',
    external: true,
    emphasized: false,
    features: {
      intro: 'Features you get:',
      items: [
        'Standard platform access',
        'Workflow automation',
        'Multi-channel engagement',
        'All compliance tools',
        '5,000 accounts, 1,000 min/mo',
        '25 workspaces',
      ],
    },
  },
  {
    key: 'business',
    name: 'Business',
    tagline: 'For high-volume operations',
    monthly: 499,
    badge: 'Most Popular',
    description: 'API access, dedicated AM, and analytics to run multiple portfolios without manual follow-up.',
    ctaHref: 'https://app.dros.ai',
    ctaKey: 'pricing_business_cta',
    external: true,
    emphasized: true,
    features: {
      intro: 'Everything in Professional, plus:',
      items: ['Advanced analytics', 'Dedicated account manager', '24/7 phone support', 'API access'],
    },
  },
  {
    key: 'business-plus',
    name: 'Business Plus',
    tagline: 'For scaling enterprises',
    monthly: 1999,
    description: 'Unlimited accounts and custom integrations, no volume ceilings.',
    ctaHref: 'https://app.dros.ai',
    ctaKey: 'pricing_bizplus_cta',
    external: true,
    emphasized: false,
    features: {
      intro: 'Everything in Business, plus:',
      items: ['Custom integrations', 'Unlimited accounts', 'Unlimited workspaces'],
    },
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    tagline: 'For organizations with unique needs',
    monthly: null,
    description: 'White-label deployment, SLA guarantee, and a solution built around your exact requirements.',
    ctaHref: '/book-meeting',
    ctaKey: 'pricing_enterprise_cta',
    external: false,
    emphasized: true,
    features: {
      intro: 'Everything in Business Plus, plus:',
      items: ['Unlimited AI calling minutes', 'White-label options', 'SLA guarantee'],
    },
  },
];
