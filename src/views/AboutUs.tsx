'use client';
import { ArrowRight, Linkedin, MapPin } from 'lucide-react';
import Footer from './Footer';
import Navbar from './Navbar';
import ResourceHero from '../components/ResourceHero';
import { BlogCtaBand } from './BlogShared';
import { Section, Container, Heading, Button, Card } from '../components/ui';
import Reveal, { RevealItem } from '../components/Reveal';
import PageFade from '../components/PageFade';
import { trackCta } from '../lib/analytics';

/*
 * About page. Ported from the original bespoke slate-950/cyan-gradient
 * design onto the site's shared design system - same primitives, tokens,
 * and Reveal scroll animation as FirstPartyCollectionsPage, NewsroomPage,
 * ContactUs, etc. Every section and its copy is preserved verbatim from
 * the previous version; only the visual layer (hero, cards, typography,
 * color tokens) changed. The closing CTA is the one exception: it now
 * reuses the shared <BlogCtaBand /> that every other resource-hub page
 * ends on, rather than a bespoke gradient block.
 */

interface LeadershipMember {
  name: string;
  title: string;
  image: string;
  /** Omitted (not just empty) hides the "Connect on LinkedIn" link. */
  linkedin?: string;
  bio: string;
}

const LEADERSHIP: LeadershipMember[] = [
  {
    name: 'Anshul Shrivastava',
    title: 'Co-founder & CEO',
    image: '/Untitled_design_(15).png',
    linkedin: 'https://www.linkedin.com/in/anshul-shrivastava',
    bio: 'Anshul has worked closely with collections operations through the evolution of AI-led engagement systems, helping shape products built around both communication and operational workflow challenges.',
  },
  {
    name: 'Virat Joshi',
    title: 'Co-Founder & COO',
    image: '/team/virat.jpg',
    linkedin: 'https://www.linkedin.com/in/virat-joshi-02a7b096',
    bio: 'Virat leads operations and global GTM at DROS, focusing on execution and scale for how the platform is built, marketed, and delivered to debt collections teams. His deep understanding of debt collections, both pre- and post-delinquency, helps him deliver outcomes for customers.',
  },
];

const TIMELINE = [
  {
    step: 'Step 01',
    title: 'Voice revealed the first layer',
    body: (
      <>
        While building{' '}
        <a
          href="https://vodex.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:text-accent/80"
        >
          Vodex.ai
        </a>{' '}
        for collections, voice AI began solving real communication problems inside collections. Teams were reaching more people, closing more calls, and handling more accounts at scale.
      </>
    ),
  },
  {
    step: 'Step 02',
    title: 'Operations exposed the bigger gap',
    body: 'Teams were still switching systems, losing context, and making decisions without enough continuity. Voice solved one part of execution, but the workflow around it remained broken.',
  },
  {
    step: 'Step 03',
    title: 'DROS became the operating layer',
    body: 'A system built to connect engagement, workflow, prioritization, and execution. Not just communication. Not just automation. A complete operating layer for modern collections.',
  },
];

const CHANGES = [
  {
    number: '01',
    title: 'Context stays connected',
    body: 'History, intent, and timing carry forward across every interaction: from voice to SMS, from SMS to email, across every agent and every touchpoint.',
  },
  {
    number: '02',
    title: 'Channels work together',
    body: 'Voice, SMS, email, and digital outreach function as one coordinated flow instead of disconnected, isolated actions.',
  },
  {
    number: '03',
    title: 'Prioritization becomes smarter',
    body: 'Know who to focus on, when to act, and which channel is most likely to create a real response, driven by signals, not guesswork.',
  },
  {
    number: '04',
    title: 'Compliance sits inside execution',
    body: 'Guardrails, timing, and controls guide the workflow in real time. No separate compliance layer. No checking after the fact.',
  },
];

const BELIEFS = [
  'Context should not disappear between channels',
  'Intelligence should sit inside execution',
  'Compliance should guide action in real time',
];

const LOCATIONS = [
  {
    kicker: 'US Offices',
    name: 'United States',
    lines: ['1592 Union St #473', 'San Francisco, CA 94123'],
    footnote: 'Delaware',
  },
  {
    kicker: 'Dev Center',
    name: 'India',
    lines: ['Bengaluru'],
  },
];

export default function AboutUs() {
  return (
    <PageFade className="min-h-screen bg-base text-ink">
      <Navbar transparent />

      <main>
        {/* ── HERO ── */}
        <ResourceHero
          image="/resources/about-hero.jpg"
          badge="About DROS"
          headingLines={['Built for how collections', 'actually works now']}
          subtext="DROS.ai is an AI-native operating layer built for modern collections, helping teams manage engagement, context, prioritization, and execution without adding more fragmentation."
          cta={
            <>
              <Button
                variant="primary"
                size="lg"
                to="/book-meeting"
                onClick={() => trackCta('about_hero_book_demo')}
              >
                Book a demo <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href="https://app.dros.ai"
                target="_blank"
                onClick={() => trackCta('about_hero_explore_product')}
              >
                Explore Product
              </Button>
            </>
          }
        />

        {/* ── WHY WE BUILT DROS ── */}
        <Section tone="light" spacing="lg" id="why-we-built-dros">
          <Container>
            <Reveal className="mx-auto max-w-3xl text-center">
              <Heading as="h2" size="display" className="text-ink-dark">
                Why We Built DROS
              </Heading>
            </Reveal>
            <Reveal
              delay={0.08}
              className="mx-auto mt-10 max-w-3xl space-y-5 rounded-card border border-line-dark bg-white p-7 shadow-sm md:p-12"
            >
              <p className="text-[15px] leading-relaxed text-ink-grey md:text-lg">
                Collections changed faster than the systems around it. Teams now manage more channels, more accounts, more pressure, and more operational decisions than older collections systems were ever built for. Yet the core tools have not evolved to match.
              </p>
              <p className="text-[15px] leading-relaxed text-ink-grey md:text-lg">
                DROS was built to close that gap without replacing your core systems. It sits on top of what you already use: your CRM, dialers, payment platforms, and compliance tools, and connects them into one operating layer where context flows freely and decisions become intentional.
              </p>
            </Reveal>
          </Container>
        </Section>

        {/* ── WHAT LED TO DROS - TIMELINE ── */}
        <Section tone="light" spacing="lg" id="what-led-to-dros">
          <Container>
            <Reveal className="mx-auto mb-16 max-w-2xl text-center">
              <Heading as="h2" size="display" className="text-ink-dark">
                What Led to DROS
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-grey">The evolution from problem to solution</p>
            </Reveal>

            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-accent/50 via-accent/20 to-transparent md:block" />

              <Reveal stagger={0.12} className="space-y-10 md:space-y-14">
                {TIMELINE.map((item, index) => (
                  <RevealItem key={item.step} className="grid items-center gap-6 md:grid-cols-2 md:gap-8">
                    {index % 2 === 0 ? (
                      <>
                        <div className="rounded-card border border-line-dark bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,.08)] md:p-8">
                          <div className="mb-3 text-xs font-bold uppercase tracking-[.12em] text-accent">{item.step}</div>
                          <h3 className="mb-3 text-xl font-semibold text-ink-dark md:text-2xl">{item.title}</h3>
                          <p className="text-[15px] leading-relaxed text-ink-grey">{item.body}</p>
                        </div>
                        <div className="hidden justify-start md:flex">
                          <TimelineDot />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="hidden justify-end md:flex">
                          <TimelineDot />
                        </div>
                        <div className="rounded-card border border-line-dark bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,.08)] md:p-8">
                          <div className="mb-3 text-xs font-bold uppercase tracking-[.12em] text-accent">{item.step}</div>
                          <h3 className="mb-3 text-xl font-semibold text-ink-dark md:text-2xl">{item.title}</h3>
                          <p className="text-[15px] leading-relaxed text-ink-grey">{item.body}</p>
                        </div>
                      </>
                    )}
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* ── WHAT CHANGES WHEN DROS IS IN PLACE ── */}
        <Section tone="base" spacing="lg" id="what-changes">
          <Container>
            <Reveal className="mx-auto mb-14 max-w-2xl text-center">
              <Heading as="h2" size="display">
                What Changes When DROS Is in Place
              </Heading>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">Four shifts that define a different operating standard</p>
            </Reveal>

            <Reveal stagger={0.1} className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {CHANGES.map((card) => (
                <RevealItem key={card.number}>
                  <Card hover className="h-full p-8 md:p-10">
                    <div className="mb-5 font-display text-5xl text-ink/15 md:text-6xl">{card.number}</div>
                    <h3 className="mb-3 text-xl font-semibold text-ink md:text-2xl">{card.title}</h3>
                    {/* md:text-[1rem], not md:text-base - this config's custom "base" color
                        token collides with Tailwind's built-in fontSize.base key, and the
                        generated color rule wins the cascade, silently killing text-ink/65. */}
                    <p className="text-[15px] leading-relaxed text-ink/65 md:text-[1rem]">{card.body}</p>
                  </Card>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── WHAT WE BELIEVE ── */}
        <Section tone="light" spacing="lg" id="what-we-believe">
          <Container>
            <Reveal className="mx-auto mb-14 max-w-2xl text-center">
              <Heading as="h2" size="display" className="text-ink-dark">
                What We Believe
              </Heading>
            </Reveal>
            <Reveal stagger={0.08} className="mx-auto max-w-3xl space-y-4">
              {BELIEFS.map((belief) => (
                <RevealItem key={belief}>
                  <div className="flex items-start gap-5 rounded-card border border-line-dark bg-white p-7 shadow-sm md:p-9">
                    <span className="mt-1 h-full min-h-[1.5rem] w-1 shrink-0 self-stretch rounded-full bg-accent" />
                    <p className="text-[1rem] font-medium leading-relaxed text-ink-dark md:text-xl">{belief}</p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── WHAT DROS IS BUILT TO DO ── */}
        <Section tone="light" spacing="lg" id="what-dros-does">
          <Container>
            <Reveal className="mx-auto max-w-3xl text-center">
              <Heading as="h2" size="display" className="text-ink-dark">
                What DROS Is Built To Do
              </Heading>
              <p className="mt-6 text-[15px] leading-relaxed text-ink-grey md:text-lg">
                DROS helps collection agencies, debt buyers, lenders, and in-house receivables teams connect voice, SMS, email, workflows, and account decisions into one operating layer. It bridges the gap between communication and operations so your entire team works from the same playbook, with the same context, the same priorities, and the same compliance guardrails.
              </p>
            </Reveal>
          </Container>
        </Section>

        {/* ── BUILT FROM REAL COLLECTIONS WORK ── */}
        <Section tone="base" spacing="lg" id="built-from-real-work">
          <Container>
            <Reveal className="mx-auto mb-12 max-w-2xl text-center">
              <Heading as="h2" size="display">
                Built From Real Collections Work
              </Heading>
            </Reveal>
            <Reveal delay={0.08} className="mx-auto max-w-3xl">
              <Card className="space-y-5 p-7 md:p-12">
                <p className="text-[15px] leading-relaxed text-ink/70 md:text-lg">
                  DROS emerged from what became clear while building Vodex.ai for collections. As voice AI began handling real conversations across agencies and recovery teams, the same operational gaps kept surfacing behind the calls: fragmented systems, disconnected follow-up, repeated context loss, and too many decisions happening without enough visibility.
                </p>
                <p className="text-[15px] leading-relaxed text-ink/70 md:text-lg">
                  Voice solved one part of execution, but the broader workflow around it still remained broken. That is what led to DROS: a system built not just for communication, but for how collections work actually moves, keeping context flowing, keeping decisions visible, and keeping compliance baked into every action.
                </p>
                <p className="text-[15px] leading-relaxed text-ink/70 md:text-lg">
                  Every feature in DROS comes from a real problem we saw in the field. Nothing is theoretical. Everything exists because collections teams needed it.
                </p>
              </Card>
            </Reveal>
          </Container>
        </Section>

        {/* ── LEADERSHIP ── */}
        <Section tone="light" spacing="lg" id="leadership">
          <Container>
            <Reveal className="mx-auto mb-14 max-w-2xl text-center">
              <Heading as="h2" size="display" className="text-ink-dark">
                Leadership
              </Heading>
            </Reveal>
            <Reveal stagger={0.1} className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
              {LEADERSHIP.map((member) => (
                <RevealItem key={member.name}>
                  <div className="flex h-full flex-col items-center rounded-card border border-line-dark bg-white p-8 text-center shadow-sm md:p-10">
                    <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-accent/25 shadow-[0_8px_24px_rgba(3,210,252,0.15)] md:h-40 md:w-40">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={member.image}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-ink-dark md:text-2xl">{member.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-accent md:text-[1rem]">{member.title}</p>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-ink-grey transition-colors hover:text-accent"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span className="text-sm font-medium">Connect on LinkedIn</span>
                      </a>
                    )}
                    <p className="mt-5 text-[15px] leading-relaxed text-ink-grey">{member.bio}</p>
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ── OUR LOCATIONS ── */}
        <Section tone="light" spacing="lg" id="locations">
          <Container>
            <Reveal className="mx-auto mb-14 max-w-2xl text-center">
              <Heading as="h2" size="display" className="text-ink-dark">
                Our Locations
              </Heading>
            </Reveal>
            <Reveal stagger={0.1} className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
              {LOCATIONS.map((loc) => (
                <RevealItem key={loc.name}>
                  <div className="flex h-full flex-col items-center rounded-card border border-line-dark bg-white p-10 text-center shadow-sm">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <p className="text-xs uppercase tracking-[.12em] text-ink-grey">{loc.kicker}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-ink-dark">{loc.name}</h3>
                    {loc.lines.map((line) => (
                      <p key={line} className="mt-1 text-[1rem] font-semibold text-accent">{line}</p>
                    ))}
                    {loc.footnote && <p className="mt-2 text-sm text-ink-grey">{loc.footnote}</p>}
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>
      </main>

      <BlogCtaBand />

      <Footer />
    </PageFade>
  );
}

function TimelineDot() {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-accent/15 blur-xl" />
      <div className="relative h-6 w-6 rounded-full border-4 border-white bg-accent shadow-[0_0_0_1px_rgba(3,210,252,0.3)]" />
    </div>
  );
}
