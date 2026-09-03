export const route = '/adoption-gap-report-state-of-collections-2026';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Section, Container, Eyebrow, Heading, Button } from '../components/ui';
import Reveal, { RevealItem } from '../components/Reveal';
import PageFade from '../components/PageFade';
import HeroBg from '../components/HeroBg';
import { trackCta } from '../lib/analytics';
import { hubspotCookie, submitUrl } from '../lib/hubspot';

const CANONICAL = 'https://dros.ai/adoption-gap-report-state-of-collections-2026';
const HS_FORM_ID = '301af54f-19a4-4237-be7f-1110f4fe9c3d';
const FALLBACK_EMAIL = 'contact@dros.ai';

const DESCRIPTION =
  'A field report on why debt collection teams are ready for AI voice and what is actually standing between them and deployment. Eight findings from 25+ conversations with operators, and a read on where the market actually sits.';

const reportSchema = {
  '@context': 'https://schema.org',
  '@type': 'Report',
  name: 'The Adoption Gap: The State of AI in Collections 2026',
  description: DESCRIPTION,
  datePublished: '2026-08',
  inLanguage: 'en-US',
  url: CANONICAL,
  about: 'AI voice adoption in the US accounts receivable management industry',
  publisher: {
    '@type': 'Organization',
    name: 'DROS',
    url: 'https://dros.ai',
    logo: 'https://dros.ai/dros-logo-horizontal.svg',
  },
};

const FACTS: [string, string][] = [
  ['25+', 'Operator conversations'],
  ['8', 'Findings'],
  ['4', 'Stage maturity model'],
  ['Aug 2026', 'Published'],
];

const AUDIENCE = [
  'Leaders deciding whether this cycle is the one to move on',
  'VPs of Collections and Operations who have taken demos and cannot get the evaluation to close',
  'Compliance officers who have been handed the AI question and want to know what to require',
  'Anyone who looked at conversational voice two or three years ago and has not looked since',
];

const FINDINGS = [
  'The market is evaluating a product that no longer exists',
  'Compliance is the stated objection. Workforce is the operative one.',
  'Compliance is the strongest argument for AI, not against it',
  '"Does it sound human?" is a risk signal, not an aesthetic preference',
  'The industry is underwriting the wrong business case',
  'Inbound is the correct entry point, and it is badly underused',
  'Platform vendors are embedding AI, and distribution is about to change',
  'There is no federal moment of clarity coming',
];

const STAGES: { title: string; body: string }[] = [
  {
    title: 'Aware',
    body: 'Holds a view on AI. No hands-on evaluation in the current technology generation.',
  },
  {
    title: 'Evaluating',
    body: 'Demos taken, decision stalled on internal alignment rather than product capability.',
  },
  {
    title: 'Deployed narrow',
    body: 'One contained use case live in production, with measured outcomes.',
  },
  {
    title: 'Operating',
    body: 'A standing channel in the contact strategy, governed like the human floor.',
  },
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Work-email gate for the report PDF, rendered once in the hero (over the
 * photo) and once in the closing CTA card. Both instances post to the same
 * HubSpot form; each holds its own state so submitting one leaves the other
 * untouched.
 *
 * Posts straight to the Forms API rather than mounting HubSpot's embed - the
 * embed renders inside its own iframe with styling the page CSS can't reach,
 * which would read as a foreign control on either surface. Same approach as
 * RequestAccessModal.
 */
function ReportEmailForm({ variant }: { variant: 'hero' | 'cta' }) {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const id = `agr-${variant}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot || status === 'submitting') return;
    setStatus('submitting');
    try {
      const res = await fetch(submitUrl(HS_FORM_ID), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: [{ name: 'email', value: email.trim() }],
          context: {
            pageUri: window.location.href,
            pageName: `The Adoption Gap Report - ${variant === 'hero' ? 'Hero' : 'Closing CTA'}`,
            hutk: hubspotCookie(),
          },
        }),
      });
      if (!res.ok) throw new Error(`HubSpot submission failed: ${res.status}`);
      setStatus('success');
      trackCta(`adoption_gap_report_submitted_${variant}`);
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="mx-auto w-full max-w-[460px] rounded-card border border-accent/25 bg-accent/[0.07] px-5 py-5 text-left backdrop-blur-md">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} />
          <div>
            <p className="font-display text-[15px] font-medium text-white">On its way</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
              Check your inbox in the next minute or two. If it does not arrive, look in spam or
              write to{' '}
              <a href={`mailto:${FALLBACK_EMAIL}`} className="text-accent hover:opacity-80">
                {FALLBACK_EMAIL}
              </a>{' '}
              and we will send it directly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[460px] text-left">
      <input
        type="text"
        name="company"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor={id} className="sr-only">
          Work email
        </label>
        <input
          id={id}
          type="email"
          required
          autoComplete="email"
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full flex-1 rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm text-white backdrop-blur-md transition-colors placeholder:text-white/40 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <Button
          variant="primary"
          size="lg"
          type="submit"
          className="shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending...' : 'Get the report'}
          {status !== 'submitting' && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>

      {status === 'error' ? (
        <p className="mt-3 text-sm leading-relaxed text-red-400">
          That did not go through. Try again, or email{' '}
          <a href={`mailto:${FALLBACK_EMAIL}`} className="underline underline-offset-2">
            {FALLBACK_EMAIL}
          </a>{' '}
          directly.
        </p>
      ) : (
        <p className="mt-3 text-[13px] leading-relaxed text-ink/45">
          We will email you the PDF. We may follow up once. That is it.
        </p>
      )}
    </form>
  );
}

export default function AdoptionGapReport2026() {
  return (
    <PageFade className="min-h-screen bg-base text-ink">
      <Helmet>
        <title>The Adoption Gap: The State of AI in Collections 2026 | DROS</title>
        <meta name="description" content={DESCRIPTION} />
        <meta
          name="keywords"
          content="state of AI in debt collections, AI adoption collections report, AI voice agents collections, debt collection AI research, ARM industry AI report 2026"
        />
        <link rel="canonical" href={CANONICAL} />
        <meta
          property="og:title"
          content="The Adoption Gap: The State of AI in Collections 2026 | DROS"
        />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <script type="application/ld+json">{JSON.stringify(reportSchema)}</script>
      </Helmet>

      <Navbar transparent />

      <main>
        {/* ── HERO ── */}
        <header
          data-nav-theme="dark"
          className="relative flex min-h-[640px] w-full items-center justify-center overflow-hidden bg-base py-32 text-white lg:h-screen lg:py-0"
        >
          <HeroBg image="/adoption-gap-report-hero.jpg" />

          <Container wide className="relative z-40">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs text-white/85 backdrop-blur-md">
                  Field report
                </span>
              </Reveal>

              <Reveal large>
                <h1 className="font-saans text-[36px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[48px] xl:text-[56px]">
                  <span className="block text-white">The Adoption Gap.</span>
                  <span className="block text-white/55">The state of AI in collections 2026.</span>
                </h1>
              </Reveal>

              <Reveal>
                <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                  Why debt collection teams are ready for AI voice, and what is actually standing
                  between them and deployment. Eight findings from 25+ conversations with operators,
                  and a read on where the market actually sits.
                </p>
              </Reveal>

              <Reveal delay={0.1} className="w-full">
                <ReportEmailForm variant="hero" />
              </Reveal>
            </div>
          </Container>
        </header>

        {/* ── FACTS STRIP ── */}
        <Section tone="base" spacing="sm" id="at-a-glance">
          <Container>
            <Reveal className="flex flex-wrap items-start justify-center gap-x-14 gap-y-8 sm:gap-x-20">
              {FACTS.map(([value, label]) => (
                <div key={label} className="text-center">
                  <div className="font-display text-3xl font-medium tracking-[-0.02em] text-ink md:text-4xl">
                    {value}
                  </div>
                  <div className="mt-2 text-sm text-ink/50">{label}</div>
                </div>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── WHO THIS IS FOR ── */}
        <Section tone="light" spacing="sm" id="who-this-is-for">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[360px_1fr] lg:gap-16">
              <Reveal>
                <Eyebrow className="text-ink-grey">Who this is for</Eyebrow>
                <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                  If you are in one of these seats, this will read as familiar.
                </Heading>
                <p className="mt-4 text-sm leading-relaxed text-ink-grey">
                  Rather than novel. That is the point.
                </p>
              </Reveal>

              <Reveal stagger={0.06} className="flex flex-col justify-center gap-4">
                {AUDIENCE.map((item) => (
                  <RevealItem key={item}>
                    <div className="flex items-start gap-3.5">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <p className="text-[15px] leading-relaxed text-ink-grey">{item}</p>
                    </div>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ── THE EIGHT FINDINGS ── */}
        <Section tone="base" spacing="sm" id="findings">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">The eight findings</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                What operators actually told us.
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                The report takes each of these apart: what we heard, why it holds, and what to do
                about it.
              </p>
            </Reveal>

            <Reveal stagger={0.05} className="mx-auto mt-10 max-w-3xl">
              {FINDINGS.map((finding, i) => (
                <RevealItem key={finding}>
                  <div className="flex items-start gap-5 border-t border-hair py-5 last:border-b">
                    <span className="shrink-0 pt-[3px] font-display text-sm font-medium tracking-[0.04em] text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[17px] leading-snug text-ink">{finding}</p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── MATURITY MODEL ── */}
        <Section tone="light" spacing="sm" id="maturity-model">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">A four-stage maturity model</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                Where does your operation actually sit?
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-grey">
                The report places the industry against these four stages. How the market splits
                across them is the uncomfortable part.
              </p>
            </Reveal>

            <Reveal stagger={0.08} className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {STAGES.map((stage, i) => (
                <RevealItem key={stage.title}>
                  <div className="h-full rounded-card border border-line-dark bg-white p-6 shadow-sm transition-colors duration-200 hover:border-accent/40">
                    <span className="font-display text-sm font-medium tracking-[0.04em] text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-medium text-ink-dark">
                      {stage.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-grey">{stage.body}</p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── METHODOLOGY ── */}
        <Section tone="base" spacing="sm" id="methodology">
          <Container>
            <div className="mx-auto max-w-3xl">
              <Reveal>
                <Eyebrow className="text-ink/45">Methodology, stated plainly</Eyebrow>
                <Heading as="h2" size="display" className="mt-4">
                  Qualitative work, not a survey.
                </Heading>
              </Reveal>

              <Reveal delay={0.05} className="mt-6 flex flex-col gap-5">
                <p className="text-[16px] leading-relaxed text-ink/60">
                  This report is based on 25+ conversations with agency owners, in-house collections
                  leaders, operations leaders, and compliance officers, held over three days at the
                  ACA International Annual Convention and Expo in Orlando in July 2026. The findings
                  are ours, drawn from what operators told us on the floor.
                </p>
                <p className="text-[16px] leading-relaxed text-ink/60">
                  It is qualitative work, not a survey. Participants were self-selecting, in the
                  sense that they were people willing to walk up and talk about AI at a trade show,
                  which is not a neutral sample. Treat the findings as directional rather than
                  representative, and weigh them against what you see in your own operation.
                </p>
                <p className="border-t border-hair pt-5 text-sm leading-relaxed text-ink/40">
                  This report is independent DROS field research. It is not affiliated with,
                  sponsored by, or endorsed by ACA International.
                </p>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ── FINAL CTA ── */}
        <Section tone="light" spacing="sm" id="get-the-report">
          <Container>
            <Reveal className="relative overflow-hidden rounded-card border border-accent/20 bg-base px-8 py-16 text-center sm:px-12 md:py-20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-1/2 h-[280px] w-[500px] -translate-x-1/2 rounded-full"
                style={{
                  background: 'radial-gradient(ellipse, rgba(3,210,252,0.12) 0%, transparent 70%)',
                }}
              />
              <div className="relative">
                <Eyebrow className="justify-center text-ink/45">Get the full report</Eyebrow>
                <Heading as="h2" size="display-lg" className="mx-auto mt-4 max-w-xl">
                  The eight findings in full
                </Heading>
                <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink/55">
                  Plus the maturity model, in a format built to take straight into your next
                  internal conversation.
                </p>
                <div className="mt-8">
                  <ReportEmailForm variant="cta" />
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>
      </main>

      <Footer />
    </PageFade>
  );
}
