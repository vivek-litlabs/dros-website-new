export const route = '/collections/credit-unions';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Section, Container, Eyebrow, Heading, Button } from '../components/ui';
import Reveal, { RevealItem } from '../components/Reveal';
import PageFade from '../components/PageFade';
import HeroBg from '../components/HeroBg';
import DemoWidget from '../components/home/DemoWidget';
import { trackCta } from '../lib/analytics';

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'Does DROS integrate with our core?',
    a: 'Yes. DROS syncs delinquent accounts via CSV or API - balances, contact info, and payment history. There is no core migration and nothing changes in your system of record. Most credit unions are live within days.',
  },
  {
    q: 'Will members know they are talking to AI?',
    a: 'DROS agents identify themselves per your disclosure requirements. Conversations are natural, patient, and scripted to your standards - members can always request a person, and those conversations route to your team instantly with full context.',
  },
  {
    q: 'How does this hold up in an NCUA exam?',
    a: 'Every interaction is recorded, transcribed, and logged with timestamps, consent status, and disclosures. Your audit trail is a report you export, not a file you assemble.',
  },
  {
    q: 'What happens to our existing collections team?',
    a: 'They stop dialing and start resolving. DROS handles the volume - first contacts, reminders, promise follow-ups - while your people take the hardship cases, disputes, and conversations that need judgment.',
  },
  {
    q: 'What does DROS cost for a credit union?',
    a: 'Plans start at a flat monthly rate with included call minutes - no per-seat pricing, no long implementation fees. See pricing, or talk to us about your portfolio size.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const TIMELINE_DAYS = ['Day 1', 'Day 7', 'Day 15', 'Day 30'];

const TIMELINE_ROWS = [
  {
    label: 'Today',
    tone: 'muted' as const,
    cells: ['Silence', 'First call - no answer', 'Voicemail #3', 'Repo queue'],
  },
  {
    label: 'On DROS',
    tone: 'accent' as const,
    cells: ['Text + call, promise booked', 'Reminder before due date', 'Promise kept, account cured', 'Member intact'],
  },
];

export default function CreditUnionCollectionsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <PageFade className="min-h-screen bg-base text-ink">
      <Helmet>
        <title>AI Collections Software for Credit Unions | DROS</title>
        <meta name="description" content="DROS works your delinquent member accounts from day 1 - every call, text, and email compliant, logged, and audit-ready for your next NCUA exam." />
        <meta name="keywords" content="credit union collections software, member collections, NCUA exam ready, Reg F credit union, share overdraft recovery, credit union delinquency management, AI voice agents credit union" />
        <link rel="canonical" href="https://dros.ai/collections/credit-unions" />
        <meta property="og:title" content="AI Collections Software for Credit Unions | DROS" />
        <meta property="og:description" content="DROS works your delinquent member accounts from day 1 - every call, text, and email compliant, logged, and audit-ready for your next NCUA exam." />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/collections/credit-unions" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Navbar transparent />

      <main>
        {/* ── HERO ── */}
        <header
          data-nav-theme="dark"
          className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden bg-base text-white"
        >
          <HeroBg image="/industries/vodex/who-is-it-for-4.jpg" />

          <Container wide className="relative z-40">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs text-white/85 backdrop-blur-md">
                  For credit unions
                </span>
              </Reveal>

              <Reveal large>
                <h1 className="font-saans text-[36px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[48px] xl:text-[56px]">
                  <span className="block text-white">Recover balances.</span>
                  <span className="block text-white/55">Keep members.</span>
                </h1>
              </Reveal>

              <Reveal>
                <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
                  DROS works your delinquent accounts from day 1 - every call, text, and email compliant, logged, and handled the way a credit union would want a member treated.
                </p>
              </Reveal>

              <Reveal delay={0.1} className="flex flex-wrap justify-center gap-3">
                <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('Book a member-outreach walkthrough')}>
                  Book a member-outreach walkthrough <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="lg" to="/resources/videos">
                  See AI agents in action
                </Button>
              </Reveal>
            </div>
          </Container>
        </header>

        {/* ── TRUST BAR ── */}
        <Section tone="base" spacing="sm" id="trust-bar">
          <Container>
            <Reveal className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {[
                'Reg F & FDCPA aligned',
                'SOC 2 ready',
                'Live in days, not quarters',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-ink/60">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </div>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── DELINQUENCY TIMELINE ── */}
        <Section tone="light" spacing="sm" id="timeline">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">The difference</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                The first 30 days decide the account.
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-grey">
                Here's what happens to one past-due auto loan - with a small team, and with DROS.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-9 overflow-x-auto rounded-card border border-line-dark bg-white">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-[150px_repeat(4,1fr)] border-b border-line-dark">
                  <div />
                  {TIMELINE_DAYS.map((d) => (
                    <div key={d} className="px-5 py-4 font-display text-xs font-medium uppercase tracking-[0.14em] text-ink-grey">
                      {d}
                    </div>
                  ))}
                </div>
                {TIMELINE_ROWS.map((row, ri) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-[150px_repeat(4,1fr)] ${ri > 0 ? 'border-t border-line-dark' : ''} ${row.tone === 'accent' ? 'bg-base' : ''}`}
                  >
                    <div className={`flex items-center px-5 py-7 font-display text-sm font-medium ${row.tone === 'accent' ? 'text-accent' : 'text-ink-grey'}`}>
                      {row.label}
                    </div>
                    {row.cells.map((cell, ci) => (
                      <div
                        key={ci}
                        className={`flex items-center gap-2.5 border-l px-5 py-7 text-sm leading-snug ${
                          row.tone === 'accent'
                            ? 'border-hair text-ink/80'
                            : 'border-line-dark text-ink-grey'
                        }`}
                      >
                        <span className={`shrink-0 text-xs ${row.tone === 'accent' ? 'text-accent' : 'text-red-400'}`}>
                          {row.tone === 'accent' ? '✓' : '✕'}
                        </span>
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ── HOW IT WORKS ── */}
        <Section tone="base" spacing="sm" id="how-it-works">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">How it works</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                One engagement layer. Every member, every day.
              </Heading>
            </Reveal>

            <Reveal stagger={0.08} className="mt-9 flex flex-col">
              {[
                { num: '01', h: 'Connect your core', d: 'Sync delinquent accounts via CSV or API. No migration project - live in days.' },
                { num: '02', h: 'Reach members from day 1', d: "AI agents call, text, and email with full account context - on the member's channel." },
                { num: '03', h: 'Book and chase promises', d: 'The Promise-to-Pay Engine negotiates within your rules and follows up when promises slip.' },
                { num: '04', h: 'Escalate only what needs a person', d: 'Hardship and disputes route to your team with the full conversation history attached.' },
              ].map((row, i, arr) => (
                <RevealItem key={row.num}>
                  <div className={`grid grid-cols-[56px_1fr] gap-6 py-9 sm:grid-cols-[56px_1fr_1fr] sm:gap-9 ${i > 0 ? 'border-t border-hair' : ''} ${i === arr.length - 1 ? 'border-b border-hair' : ''}`}>
                    <div className="font-display text-sm text-accent">{row.num}</div>
                    <h3 className="text-xl font-semibold leading-tight text-white">{row.h}</h3>
                    <p className="col-span-2 max-w-md text-[15px] leading-relaxed text-ink/60 sm:col-span-1">{row.d}</p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── MEMBER EXPERIENCE ── */}
        <Section tone="light" spacing="sm" id="member-experience">
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <Reveal>
                <Eyebrow className="text-ink-grey">Member experience</Eyebrow>
                <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                  It's your credit union talking. Not a collection agency.
                </Heading>
                <p className="mt-4 max-w-md text-[16.5px] leading-relaxed text-ink-grey">
                  Early outreach is a retention moment, not just a recovery one. Members who get treated well stay members.
                </p>
                <ul className="mt-7 flex flex-col gap-1">
                  {[
                    'Your scripts, your tone, your disclosures',
                    'Patient conversations, 24/7, in the member\'s language',
                    'A person is always one ask away - routed with full history',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 border-t border-line-dark py-3 text-[15.5px] leading-snug text-ink-dark first:border-t-0">
                      <span className="mt-0.5 shrink-0 font-bold text-accent">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mx-auto max-w-[380px] overflow-hidden rounded-card border border-line-dark bg-base p-5 shadow-[0_24px_64px_rgba(11,15,31,.18)]">
                  <div className="mb-4 flex items-center gap-3 border-b border-hair pb-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 font-display text-[13px] font-semibold text-accent">
                      CU
                    </div>
                    <div>
                      <div className="text-[13.5px] font-semibold text-white">Your Credit Union</div>
                      <div className="text-[11.5px] text-white/50">Automated by DROS</div>
                    </div>
                  </div>
                  <div className="mb-2.5 text-center text-[10.5px] tracking-[0.04em] text-white/40">DAY 3 PAST DUE · 10:02 AM</div>
                  <div className="mb-2.5 max-w-[88%] rounded-2xl rounded-bl-sm bg-white/[0.08] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white/90">
                    Hi Sarah, this is a reminder from your credit union - your auto loan payment of $312 was due Jun 1. Reply here or tap to pay: [secure link]
                  </div>
                  <div className="mb-2.5 ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-accent px-3.5 py-2.5 text-[13.5px] leading-relaxed text-base">
                    Hey, money's tight this month. Can I pay half now and half on the 15th?
                  </div>
                  <div className="mb-3 max-w-[88%] rounded-2xl rounded-bl-sm bg-white/[0.08] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white/90">
                    Absolutely. I've set up $156 today and $156 on Jun 15. You'll get a confirmation for each. Thanks, Sarah.
                  </div>
                  <div className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-center text-[12.5px] text-accent">
                    ✓ Promise to Pay booked · Logged &amp; compliant
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ── COMPLIANCE ── */}
        <Section tone="base" spacing="sm" id="compliance">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">Compliance</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                Built for your examiner, not just your dialer.
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                Every interaction is scripted, logged, and audited automatically. When NCUA asks, you pull the record - not the excuse.
              </p>
            </Reveal>

            <Reveal stagger={0.08} className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { title: 'Reg F & FDCPA aligned', body: 'Contact frequency, timing, and disclosure rules enforced at the system level - not left to agent memory.' },
                { title: 'TCPA consent handling', body: 'Consent tracked and enforced across every channel, with revocation honored in real time.' },
                { title: 'UDAAP-safe scripting', body: 'Every AI conversation follows approved scripts and stays inside guardrails you set and can show.' },
                { title: '100% logged & audit-ready', body: 'Every touchpoint recorded, transcribed, and traceable. Exam prep becomes an export, not a project.' },
              ].map((c) => (
                <RevealItem key={c.title}>
                  <div className="h-full rounded-card border border-hair bg-surface-2/60 p-7">
                    <h3 className="mb-2.5 text-[17px] font-semibold leading-tight text-ink">{c.title}</h3>
                    <p className="text-[15px] leading-[1.7] text-ink/55">{c.body}</p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── PORTFOLIO COVERAGE ── */}
        <Section tone="light" spacing="sm" id="portfolio-coverage">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink-grey">Where credit unions use DROS</Eyebrow>
              <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                Every product in your portfolio.
              </Heading>
            </Reveal>

            <Reveal stagger={0.08} className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Auto Loans', body: 'Early-stage outreach before repossession is ever on the table.' },
                { title: 'Credit Cards', body: 'High-volume, low-balance accounts worked daily without adding headcount.' },
                { title: 'Personal & Signature Loans', body: 'Consistent follow-up on every open promise.' },
                { title: 'Share Overdrafts', body: 'Fast, friendly recovery on negative balances before charge-off.' },
              ].map((c) => (
                <RevealItem key={c.title}>
                  <div className="h-full rounded-card border border-line-dark bg-white p-6 shadow-sm transition-colors hover:border-accent/40">
                    <h3 className="mb-2 text-[16.5px] font-semibold text-ink-dark">{c.title}</h3>
                    <p className="text-sm leading-relaxed text-ink-grey">{c.body}</p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── PROOF ── */}
        <Section tone="base" spacing="sm" id="proof">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="justify-center text-ink/45">Proof</Eyebrow>
              <Heading as="h2" size="display" className="mt-4">
                Results from teams running DROS.
              </Heading>
            </Reveal>

            <Reveal stagger={0.08} className="mt-9 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-hair bg-hair sm:grid-cols-3">
              {[
                { n: '7×', t: 'Right-party contact improvement' },
                { n: '+18%', t: 'Recovery lift in the first 90 days' },
                { n: '1.8M+', t: 'Accounts worked on the platform' },
              ].map((s) => (
                <RevealItem key={s.t}>
                  <div className="h-full bg-base p-9">
                    <div className="mb-2 font-display text-[40px] leading-none text-accent">{s.n}</div>
                    <div className="text-[13.5px] text-ink/60">{s.t}</div>
                  </div>
                </RevealItem>
              ))}
            </Reveal>

            <Reveal delay={0.15} className="mt-10 border-l-2 border-accent pl-7">
              <p className="max-w-[62ch] font-display text-[21px] leading-[1.5] text-ink">
                "DROS does the outreach we never had the staff for, and every call comes back fully logged and compliant. It pays for itself."
              </p>
              <cite className="mt-4 block text-sm not-italic text-ink/55">
                Darryl Brown - Principal,{' '}
                <Link to="/customer-stories" className="text-accent underline underline-offset-2 hover:opacity-80">
                  Greystone &amp; Associates
                </Link>
              </cite>
            </Reveal>
          </Container>
        </Section>

        {/* ── FAQ ── */}
        <Section tone="light" spacing="sm" id="faq">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
              <Reveal>
                <Eyebrow className="text-ink-grey">Common questions</Eyebrow>
                <Heading as="h2" size="display" className="mt-4 text-ink-dark">
                  What credit unions ask us first
                </Heading>
                <p className="mt-4 text-sm leading-relaxed text-ink-grey">
                  Can't find your answer?{' '}
                  <Link to="/contact" className="text-accent underline underline-offset-2 hover:opacity-80">
                    Reach out to our team
                  </Link>
                  .
                </p>
              </Reveal>

              <Reveal stagger={0.05} className="grid grid-cols-1 gap-2.5">
                {FAQS.map((faq, i) => (
                  <RevealItem key={faq.q}>
                    <div className={`rounded-xl border bg-white shadow-sm transition-colors duration-200 ${openFaq === i ? 'border-accent/40' : 'border-line-dark'}`}>
                      <button
                        type="button"
                        aria-expanded={openFaq === i}
                        aria-controls={`cu-faq-panel-${i}`}
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
                      >
                        <span className="text-sm font-medium leading-snug text-ink-dark">{faq.q}</span>
                        <ChevronDown
                          className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 ${
                            openFaq === i ? 'rotate-180 text-accent' : 'text-ink-grey/50'
                          }`}
                        />
                      </button>
                      {openFaq === i && (
                        <p id={`cu-faq-panel-${i}`} className="px-5 pb-4 text-sm leading-relaxed text-ink-grey">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </Container>
        </Section>

        <DemoWidget />

        {/* ── PRICING TEASER ── */}
        <Section tone="light" spacing="sm" id="pricing-teaser">
          <Container>
            <Reveal className="relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-card border border-accent/20 bg-base px-8 py-10 md:flex-row md:items-center md:px-14 md:py-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 h-72 w-72 -translate-y-16 translate-x-16 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(3,210,252,0.1), transparent 70%)' }}
              />
              <div className="relative flex-1">
                <div className="mb-2 text-[26px] font-semibold leading-tight text-white">Simple pricing. No surprises.</div>
                <div className="max-w-md text-[15px] leading-relaxed text-ink/50">Built for credit unions of all sizes - from a single branch to enterprise-scale operations.</div>
              </div>
              <div className="relative shrink-0 text-center">
                <Button variant="primary" size="lg" to="/pricing">
                  See pricing →
                </Button>
                <div className="mt-3 text-[13px] text-ink/40">No commitment required</div>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ── FINAL CTA ── */}
        <Section tone="light" spacing="sm" id="cta">
          <Container>
            <Reveal className="relative overflow-hidden rounded-card border border-accent/20 bg-base px-8 py-16 text-center sm:px-12 md:py-20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-1/2 h-[280px] w-[500px] -translate-x-1/2 rounded-full"
                style={{ background: 'radial-gradient(ellipse, rgba(3,210,252,0.12) 0%, transparent 70%)' }}
              />
              <div className="relative">
                <Eyebrow className="justify-center text-ink-grey">Hear it yourself</Eyebrow>
                <Heading as="h2" size="display-lg" className="mx-auto mt-4 max-w-lg">
                  See DROS on your member collections flows
                </Heading>
                <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink/55">
                  Bring your delinquent accounts and existing core. We'll show you exactly how it fits.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button variant="primary" size="lg" to="/book-meeting" onClick={() => trackCta('Book a member-outreach walkthrough - final CTA')}>
                    Book a member-outreach walkthrough <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="lg" to="/contact">
                    Talk to us about AI agents
                  </Button>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {['No commitment required', 'Stack review included', 'Brand + compliance rules modeled live', 'Works with your existing core'].map((perk) => (
                    <span key={perk} className="rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5 text-xs text-accent/90">
                      {perk}
                    </span>
                  ))}
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
