export const route = '/trust-center';
import { useState } from 'react';
import type { ComponentType } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  BadgeCheck,
  Brain,
  HeartPulse,
  Lock,
  KeyRound,
  ScanSearch,
  RefreshCw,
  Users,
  AlertTriangle,
  Scale,
  ChevronDown,
  Mail,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import PageFade from '../components/PageFade';
import HeroBg from '../components/HeroBg';
import { Container, Section, Button } from '../components/ui';
import Reveal, { RevealItem } from '../components/Reveal';
import RequestAccessModal from '../components/RequestAccessModal';
import type { RequestAccessDoc } from '../components/RequestAccessModal';
import { trackCta } from '../lib/analytics';

const LAST_REVIEWED = 'August 5, 2026';
const LAST_REVIEWED_ISO = '2026-08-05';
const SECURITY_EMAIL = 'contact@dros.ai';

interface TabDef {
  id: string;
  label: string;
  intro: string;
}

const TABS: TabDef[] = [
  {
    id: 'overview',
    label: 'Overview',
    intro: 'Independently audited and certified controls, refreshed on an ongoing basis.',
  },
  {
    id: 'security-practices',
    label: 'Security practices',
    intro: 'How we protect the systems and data behind DROS AI.',
  },
  {
    id: 'subprocessors',
    label: 'Subprocessors',
    intro: 'Third-party services we use to deliver our product.',
  },
  {
    id: 'faq',
    label: 'FAQ',
    intro: 'Common questions from security and procurement teams.',
  },
];

interface Certification {
  id: string;
  Icon: LucideIcon;
  short: string;
  name: string;
  status: string;
  blurb: string;
  issuer: string;
  validUntil: string;
  docLabel: string;
}

const CERTIFICATIONS: Certification[] = [
  {
    id: 'iso27001',
    Icon: ShieldCheck,
    short: 'ISO 27001',
    name: 'ISO/IEC 27001:2022',
    status: 'Certified',
    blurb:
      'Certified information security management system (ISMS) covering our production environment, corporate infrastructure and personnel.',
    issuer: 'KVQA',
    validUntil: 'May 31, 2027',
    docLabel: 'ISO/IEC 27001:2022 - Certificate',
  },
  {
    id: 'soc2',
    Icon: BadgeCheck,
    short: 'SOC 2',
    name: 'SOC 2 Type II',
    status: 'Certified',
    blurb:
      'Independent audit of our controls for security, availability and confidentiality over a 12-month observation period.',
    issuer: 'Independent CPA firm',
    validUntil: 'December 31, 2026',
    docLabel: 'SOC 2 Type II - Report',
  },
  {
    id: 'iso42001',
    Icon: Brain,
    short: 'ISO 42001',
    name: 'ISO/IEC 42001:2023',
    status: 'Certified',
    blurb:
      'Certified Artificial Intelligence Management System (AIMS) ensuring robust AI governance practices and maintaining the highest standards of compliance.',
    issuer: 'UKAF',
    validUntil: 'July 27, 2029',
    docLabel: 'ISO/IEC 42001:2023 - Certificate',
  },
  {
    id: 'hipaa',
    Icon: HeartPulse,
    short: 'HIPAA',
    name: 'HIPAA',
    status: 'Certified',
    blurb:
      'Implemented a comprehensive set of security, privacy, and data protection controls aligned with the applicable requirements and best practices of the Health Insurance Portability and Accountability Act (HIPAA).',
    issuer: 'UKASCERT',
    validUntil: 'March 28, 2028',
    docLabel: 'HIPAA - Certificate',
  },
];

interface Practice {
  Icon: LucideIcon;
  title: string;
  body: string;
  featured?: boolean;
}

const PRACTICES: Practice[] = [
  {
    Icon: Lock,
    title: 'Data Encryption',
    body: 'All data is encrypted in transit using TLS 1.2+ and at rest using AES-256. Encryption keys are managed through a hardened key management service with strict access controls and rotation policies.',
  },
  {
    Icon: KeyRound,
    title: 'Access Control',
    body: 'Access to production systems follows the principle of least privilege, enforced through role-based access control, mandatory SSO with multi-factor authentication, and quarterly access reviews.',
  },
  {
    Icon: ScanSearch,
    title: 'Vulnerability Management',
    body: 'We run continuous automated vulnerability scanning, annual third-party penetration tests, and maintain a coordinated disclosure program. Critical findings are remediated within defined SLAs.',
  },
  {
    Icon: RefreshCw,
    title: 'Business Continuity & Disaster Recovery',
    body: 'Backups are taken continuously and tested regularly. Our disaster recovery plan is exercised at least annually, with defined RTO and RPO targets for all critical systems.',
  },
  {
    Icon: Users,
    title: 'Employee Security',
    body: 'All employees complete security awareness training at onboarding and annually thereafter. Background checks are performed where legally permitted, and endpoints are centrally managed with disk encryption enforced.',
  },
  {
    Icon: AlertTriangle,
    title: 'Incident Response',
    body: 'A documented incident response plan defines roles, severity levels and communication procedures. Affected customers are notified without undue delay in accordance with contractual and legal obligations.',
  },
  {
    Icon: Scale,
    title: 'AI Governance',
    body: 'Our AI security and governance framework is aligned with the principles and best practices of ISO/IEC 42001, with controls implemented to support the confidentiality, integrity, availability, security, reliability, accountability, and responsible use of AI systems.',
    featured: true,
  },
];

/* Brand logomarks (Simple Icons, CC0) - used only to identify which vendors
   we run on, not as any claim of affiliation or endorsement. */
function LogoAWS({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z" />
    </svg>
  );
}
function LogoGoogle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}
function LogoStripe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
    </svg>
  );
}

interface Subprocessor {
  Logo: ComponentType<{ className?: string }>;
  name: string;
  purpose: string;
  region: string;
}

const SUBPROCESSORS: Subprocessor[] = [
  { Logo: LogoAWS, name: 'Amazon Web Services', purpose: 'Cloud infrastructure & hosting', region: 'EU / US' },
  { Logo: LogoGoogle, name: 'Google Workspace', purpose: 'Email & internal collaboration', region: 'EU / US' },
  { Logo: LogoStripe, name: 'Stripe', purpose: 'Payment processing', region: 'US' },
];

interface Faq {
  q: string;
  a: string;
}

const FAQS: Faq[] = [
  {
    q: 'How do I get a copy of your SOC 2 report or ISO certificate?',
    a: 'Use the request buttons in the Overview tab above or email us. SOC 2 reports are shared under NDA; ISO certificates can be shared directly.',
  },
  {
    q: 'Where is my data stored?',
    a: 'Customer data is stored in our primary cloud region. Regional hosting options are available on enterprise plans - contact us for details.',
  },
  {
    q: 'Do you sign Data Processing Agreements (DPAs)?',
    a: 'Yes. Our standard DPA incorporates the EU Standard Contractual Clauses and is available to all customers on request.',
  },
  {
    q: 'How do I report a security vulnerability?',
    a: 'Email our security team at the address below. We acknowledge reports within 2 business days and keep you informed through remediation.',
  },
];

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://dros.ai/trust-center#webpage',
      name: 'Trust Center | Security, Compliance & Privacy at DROS AI',
      description:
        'DROS AI is ISO 27001, SOC 2 Type II, ISO 42001 and HIPAA certified. Review our security practices, subprocessors and compliance documentation.',
      url: 'https://dros.ai/trust-center',
      dateModified: LAST_REVIEWED_ISO,
      about: { '@id': 'https://dros.ai/#organization' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://dros.ai/#organization',
      name: 'DROS AI',
      url: 'https://dros.ai',
      logo: 'https://dros.ai/dros-logo-horizontal.svg',
      email: SECURITY_EMAIL,
      hasCertification: CERTIFICATIONS.map((c) => ({
        '@type': 'Certification',
        name: c.name,
        issuedBy: { '@type': 'Organization', name: c.issuer },
        certificationStatus: 'CertificationActive',
      })),
    },
    FAQ_SCHEMA,
  ],
};

/* Shared-element sliding pill behind the active tab label - mirrors the
   Solutions section's lifecycle tab switcher (layoutId morph, not manual
   position math). */
function TabSwitcher({
  activeId,
  onChange,
}: {
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Trust Center sections"
      className="flex gap-1 overflow-x-auto rounded-full border border-line-dark bg-black/[0.03] p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {TABS.map((t) => {
        const isActive = t.id === activeId;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`trust-tab-${t.id}`}
            aria-selected={isActive}
            aria-controls={`trust-panel-${t.id}`}
            onClick={() => onChange(t.id)}
            className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
              isActive ? 'text-white' : 'text-ink-grey hover:text-ink-dark'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="trustTabPill"
                className="absolute inset-0 rounded-full bg-[#0C1E45]"
                transition={{ type: 'spring', damping: 30, stiffness: 220 }}
              />
            )}
            <span className="relative">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const panelVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.44, 0, 0.11, 1] as const } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.16 } },
};

const cardsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function TrustCenter() {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [requested, setRequested] = useState<RequestAccessDoc | null>(null);
  const reduceMotion = useReducedMotion();
  const activeTab = TABS.find((t) => t.id === activeId)!;

  function handleTabChange(id: string) {
    setActiveId(id);
    trackCta(`trust_tab_${id}`);
  }

  function handleRequest(cert: Certification) {
    setRequested({ id: cert.id, docLabel: cert.docLabel });
    trackCta(`trust_request_${cert.id}`);
  }

  return (
    <PageFade className="min-h-screen bg-base text-ink">
      <Helmet>
        <title>Trust Center | Security, Compliance &amp; Privacy at DROS AI</title>
        <meta
          name="description"
          content="DROS AI is ISO 27001, SOC 2 Type II, ISO 42001 and HIPAA certified. Review our security practices, subprocessors and compliance documentation, or request a certificate under NDA."
        />
        <meta
          name="keywords"
          content="DROS trust center, ISO 27001 certified collections software, SOC 2 Type II debt collection, ISO 42001 AI management system, HIPAA compliant collections platform, subprocessors, data encryption, AI governance, security practices, request SOC 2 report"
        />
        <link rel="canonical" href="https://dros.ai/trust-center" />
        <meta property="og:title" content="Trust Center | Security, Compliance & Privacy at DROS AI" />
        <meta
          property="og:description"
          content="ISO 27001, SOC 2 Type II, ISO 42001 and HIPAA. Security practices, subprocessors and compliance documentation."
        />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/trust-center" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
      </Helmet>

      <Navbar transparent />

      <main>
        {/* ── HERO ── */}
        <header
          data-nav-theme="dark"
          className="relative flex h-screen min-h-[560px] w-full items-center justify-center overflow-hidden bg-base text-white"
        >
          <HeroBg image="/trust-center-hero.jpg" />

          <Container wide className="relative z-40">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs text-white/85 backdrop-blur-md">
                  Trust Center
                </span>
              </Reveal>

              <Reveal large>
                <h1 className="font-saans text-[36px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[48px] xl:text-[56px]">
                  <span className="block text-white">Security, compliance and</span>
                  <span className="block text-white/55">privacy at DROS AI</span>
                </h1>
              </Reveal>

              <Reveal>
                <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
                  We are committed to protecting your data and being transparent about how we do
                  it.
                </p>
              </Reveal>

              <Reveal stagger={0.06} className="mt-2 flex flex-wrap justify-center gap-2.5">
                {CERTIFICATIONS.map((c) => (
                  <RevealItem key={c.id}>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs text-white/85 backdrop-blur-md">
                      <c.Icon className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
                      {c.short}
                    </span>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </Container>
        </header>

        {/* ── TAB SWITCHER ──
             Same bg-paper as the Section below and no border, so the bar
             reads as part of one continuous light section, not a separate
             band - only the hero (bg-base) to here is a real tone change,
             and that happens once, on scroll, never on tab click. */}
        <div className="sticky top-16 z-30 bg-paper backdrop-blur-xl">
          <Container>
            <div className="flex justify-center py-3">
              <TabSwitcher activeId={activeId} onChange={handleTabChange} />
            </div>
          </Container>
        </div>

        {/* ── ACTIVE PANEL ──
             Always tone="light" - the background never changes when a tab
             is clicked, only the card styling inside differs per panel. */}
        <Section tone="light" spacing="lg" className="!pt-10 md:!pt-12 lg:!pt-14">
          <Container>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeId}
                id={`trust-panel-${activeId}`}
                role="tabpanel"
                aria-labelledby={`trust-tab-${activeId}`}
                variants={reduceMotion ? undefined : panelVariants}
                initial={reduceMotion ? undefined : 'hidden'}
                animate={reduceMotion ? undefined : 'show'}
                exit={reduceMotion ? undefined : 'exit'}
              >
                <div className="mx-auto max-w-2xl text-center">
                  <p className="text-[15px] leading-relaxed text-ink-grey">{activeTab.intro}</p>
                </div>

                {/* Overview - certification cards */}
                {activeId === 'overview' && (
                  <motion.div
                    variants={reduceMotion ? undefined : cardsContainer}
                    initial={reduceMotion ? undefined : 'hidden'}
                    animate={reduceMotion ? undefined : 'show'}
                    className="mt-12 grid gap-4 md:grid-cols-2"
                  >
                    {CERTIFICATIONS.map((c) => (
                      <RevealItem key={c.id} as="article">
                        <div className="flex h-full flex-col rounded-card border border-line-dark bg-white p-8">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                              <c.Icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[.08em] text-accent">
                              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                              {c.status}
                            </span>
                          </div>
                          <h3 className="mt-5 text-[19px] font-semibold leading-tight text-ink-dark">
                            {c.name}
                          </h3>
                          <p className="mt-2.5 text-[15px] leading-relaxed text-ink-grey">{c.blurb}</p>

                          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line-dark pt-5 text-[13px]">
                            <div>
                              <dt className="text-ink-grey">Issued by</dt>
                              <dd className="mt-1 font-medium text-ink-dark">{c.issuer}</dd>
                            </div>
                            <div>
                              <dt className="text-ink-grey">Valid until</dt>
                              <dd className="mt-1 font-medium text-ink-dark">{c.validUntil}</dd>
                            </div>
                          </dl>

                          <div className="mt-6">
                            <Button
                              variant="onLight"
                              size="md"
                              className="w-full sm:w-auto"
                              onClick={() => handleRequest(c)}
                            >
                              Request Certificate <Lock className="h-3.5 w-3.5" />
                            </Button>
                            <p className="mt-2 text-xs text-ink-grey">NDA required</p>
                          </div>
                        </div>
                      </RevealItem>
                    ))}
                  </motion.div>
                )}

                {/* Security practices - 6 in a grid + AI Governance featured full-width */}
                {activeId === 'security-practices' && (
                  <motion.div
                    variants={reduceMotion ? undefined : cardsContainer}
                    initial={reduceMotion ? undefined : 'hidden'}
                    animate={reduceMotion ? undefined : 'show'}
                    className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {PRACTICES.map((p) => (
                      <RevealItem
                        key={p.title}
                        className={p.featured ? 'lg:col-span-3' : undefined}
                      >
                        <div
                          className={`h-full rounded-card border p-7 transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,.08)] ${
                            p.featured ? 'border-accent/30 bg-accent/[0.04]' : 'border-line-dark bg-white'
                          }`}
                        >
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                            <p.Icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
                          </div>
                          <h3 className="mt-5 text-[17px] font-semibold text-ink-dark">{p.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-ink-grey">{p.body}</p>
                        </div>
                      </RevealItem>
                    ))}
                  </motion.div>
                )}

                {/* Subprocessors - tabular rows */}
                {activeId === 'subprocessors' && (
                  <div className="mt-12">
                    <div className="overflow-hidden rounded-card border border-line-dark bg-white">
                      <div
                        aria-hidden
                        className="hidden grid-cols-[1.4fr_1.6fr_0.7fr] gap-6 border-b border-line-dark bg-[#FAFBFF] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[.08em] text-ink-grey md:grid"
                      >
                        <span>Subprocessor</span>
                        <span>Purpose</span>
                        <span>Region</span>
                      </div>
                      {SUBPROCESSORS.map((s) => (
                        <div
                          key={s.name}
                          className="grid grid-cols-1 gap-2 border-b border-line-dark/60 px-6 py-5 last:border-b-0 md:grid-cols-[1.4fr_1.6fr_0.7fr] md:items-center md:gap-6"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                              <s.Logo className="h-5 w-5" />
                            </span>
                            <span className="font-medium text-ink-dark">{s.name}</span>
                          </div>
                          <div className="text-[15px] text-ink-grey">{s.purpose}</div>
                          <div>
                            <span className="inline-flex rounded-full border border-line-dark bg-[#FAFBFF] px-3 py-1 text-xs text-ink-dark">
                              {s.region}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-center text-sm text-ink-grey">
                      We update this list before onboarding any new subprocessor. To be notified of
                      changes, email{' '}
                      <a href={`mailto:${SECURITY_EMAIL}`} className="text-accent hover:opacity-80">
                        {SECURITY_EMAIL}
                      </a>
                      .
                    </p>
                  </div>
                )}

                {/* FAQ - accordion */}
                {activeId === 'faq' && (
                  <div className="mx-auto mt-12 max-w-3xl">
                    <motion.div
                      variants={reduceMotion ? undefined : cardsContainer}
                      initial={reduceMotion ? undefined : 'hidden'}
                      animate={reduceMotion ? undefined : 'show'}
                      className="flex flex-col gap-2.5"
                    >
                      {FAQS.map((faq, i) => {
                        const isOpen = openFaq === i;
                        return (
                          <RevealItem key={faq.q}>
                            <div
                              className={`rounded-xl border bg-white transition-colors ${
                                isOpen ? 'border-accent/35' : 'border-line-dark'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => setOpenFaq(isOpen ? null : i)}
                                aria-expanded={isOpen}
                                aria-controls={`faq-panel-${i}`}
                                id={`faq-trigger-${i}`}
                                className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                              >
                                <span className="text-sm font-medium leading-snug text-ink-dark">{faq.q}</span>
                                <ChevronDown
                                  className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 ${
                                    isOpen ? 'rotate-180 text-accent' : 'text-ink-grey/50'
                                  }`}
                                />
                              </button>
                              <AnimatePresence initial={false}>
                                {isOpen && (
                                  <motion.div
                                    id={`faq-panel-${i}`}
                                    role="region"
                                    aria-labelledby={`faq-trigger-${i}`}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.24, ease: [0.44, 0, 0.11, 1] }}
                                    className="overflow-hidden"
                                  >
                                    <p className="px-5 pb-4 text-sm font-light leading-relaxed text-ink-grey">
                                      {faq.a}
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </RevealItem>
                        );
                      })}
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Container>
        </Section>

        {/* ── FOOTER NOTE ── */}
        <Section tone="panel" spacing="sm" className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, rgba(3,210,252,0.06) 0px, rgba(3,210,252,0.06) 1px, transparent 1px, transparent 16px)',
            }}
          />
          <Container className="relative">
            <Reveal className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="text-sm text-ink/50">
                Information last reviewed{' '}
                <time dateTime={LAST_REVIEWED_ISO} className="text-ink/75">
                  {LAST_REVIEWED}
                </time>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="text-sm text-ink/50">Security questions?</span>
                <Button
                  variant="secondary"
                  size="md"
                  href={`mailto:${SECURITY_EMAIL}`}
                  onClick={() => trackCta('trust_security_email')}
                >
                  <Mail className="h-3.5 w-3.5" /> {SECURITY_EMAIL}
                </Button>
              </div>
            </Reveal>
          </Container>
        </Section>
      </main>

      <Footer />

      <RequestAccessModal request={requested} onClose={() => setRequested(null)} />
    </PageFade>
  );
}
