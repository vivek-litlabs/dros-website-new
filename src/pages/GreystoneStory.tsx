export const route = '/customer-stories/greystone-associates';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, MapPin, Layers, Briefcase, Cpu } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { trackCta } from '../lib/analytics';
import Navbar from './Navbar';

/* ─── Sticky info card ─── */

function InfoCard() {
  const fields = [
    { icon: Building2, label: 'Industry', value: 'Debt Collection' },
    { icon: MapPin, label: 'Region', value: 'United States' },
    { icon: Layers, label: 'Collection Model', value: 'Third-Party Collections' },
    { icon: Briefcase, label: 'Focus', value: 'Daily Collections Operations' },
    { icon: Cpu, label: 'Solutions Used', value: 'DROS, Vodex' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-28">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">About this story</p>
          <ul className="space-y-5">
            {fields.map(({ icon: Icon, label, value }) => (
              <li key={label}>
                <div className="flex items-center gap-2 mb-0.5">
                  <Icon className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
                </div>
                <p className="text-sm font-medium text-slate-800 pl-5">{value}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-5 border-t border-slate-100">
            <a
              href="https://dros.ai/book-meeting"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCta('sidebar_book_demo')}
              className="block w-full text-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105" style={{ background: '#03D2FC', color: '#010C20' }}
            >
              Book a demo
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─── Mobile info card (non-sticky) ─── */

function MobileInfoCard() {
  const fields = [
    { label: 'Industry', value: 'Debt Collection' },
    { label: 'Region', value: 'United States' },
    { label: 'Collection Model', value: 'Third-Party Collections' },
    { label: 'Focus', value: 'Daily Collections Operations' },
    { label: 'Solutions Used', value: 'DROS, Vodex' },
  ];

  return (
    <div className="lg:hidden bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-10">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">About this story</p>
      <div className="grid grid-cols-2 gap-4">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
            <p className="text-sm font-medium text-slate-800">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Body text helpers ─── */

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-700 leading-relaxed text-base sm:text-lg mb-6">{children}</p>;
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mt-14 mb-5 leading-snug scroll-mt-28">
      {children}
    </h2>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="relative my-10 bg-gradient-to-br from-cyan-50 to-slate-50 border border-cyan-200 rounded-2xl px-8 py-7">
      <div className="absolute top-4 left-5 text-cyan-300 text-5xl font-saans leading-none select-none">"</div>
      <p className="text-slate-800 text-lg sm:text-xl font-medium leading-relaxed italic pl-6 pt-2">{children}</p>
    </blockquote>
  );
}

/* ─── Main page ─── */

export default function GreystoneStory() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Helmet>
        <title>Greystone &amp; Associates Case Study | DROS</title>
        <meta name="description" content="How Greystone &amp; Associates simplified daily collections with faster onboarding, real-time visibility, and streamlined workflows using DROS." />
        <meta property="og:title" content="Greystone &amp; Associates Case Study | DROS" />
        <meta property="og:description" content="How Greystone &amp; Associates simplified daily collections with faster onboarding, real-time visibility, and streamlined workflows using DROS." />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/customer-stories/greystone-associates" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
      </Helmet>
      <Navbar />

      {/* Dark Hero */}
      <div className="relative bg-slate-950 text-white pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-slate-950 to-blue-950/30" />
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <Link
            to="/customer-stories"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium mb-8 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Back to Customer Stories
          </Link>
          <div className="mb-5">
            <span className="inline-block px-3 py-1 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full uppercase tracking-wider">
              Customer Story
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-white">
            How Greystone & Associates Simplified Daily Collections and Reduced Operational Friction with DROS
          </h1>
          <p className="text-xl text-slate-300 font-light leading-relaxed">
            A customer story on faster account onboarding, real-time visibility, and simpler day-to-day collections workflows.
          </p>
        </div>
      </div>

      {/* White body */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-14">
          {/* Mobile info card  - above content */}
          <MobileInfoCard />

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
            {/* Article */}
            <article className="min-w-0 flex-1">

              <H2 id="overview">Overview</H2>
              <P>
                Greystone & Associates is a third-party debt collection agency operating in the United States. Like many agencies its size, the team had built their workflow around a combination of legacy tools and manual processes  - and over time, those workarounds had started to show.
              </P>
              <P>
                When they connected with DROS, the operational friction was already visible: uploading new accounts was slow, portfolio visibility was limited, and the team was relying on outside IT resources for tasks that should have been routine. This is the story of what changed.
              </P>

              <H2 id="challenge">The Operational Challenge</H2>
              <P>
                Before DROS, getting a new batch of accounts into the system was a project in itself. The process required outside IT involvement  - someone the team had to coordinate with, schedule, and wait on  - just to get accounts loaded and ready to work. What should have been a quick operational step had become a bottleneck that added friction to the start of every new portfolio.
              </P>
              <P>
                On top of that, the team had limited real-time visibility into what was happening across their active portfolios. Tracking account status, monitoring collector activity, and understanding where things stood required more manual effort than it should have. The tools they were using weren't built around the day-to-day reality of running collections.
              </P>

              <H2 id="why-different">Why the Team Looked for Something Different</H2>
              <P>
                The decision to evaluate new software wasn't driven by a single breaking point  - it was the accumulation of small frictions that added up. Dependence on outside IT for basic operations. Limited visibility across portfolios. A workflow that required more coordination overhead than the work itself warranted.
              </P>
              <P>
                The team was looking for a platform that understood how collections actually works: fast account ingestion, clear visibility, and a system that didn't require technical specialists to keep running. They wanted control over their own operations without the overhead.
              </P>

              <H2 id="what-changed">What Changed After DROS</H2>
              <P>
                The most immediate shift was in account onboarding. What had previously required external IT support  - scheduling, coordination, waiting  - was replaced by a process the team could run themselves. Uploading accounts went from a multi-step external dependency to something completed in minutes.
              </P>

              <Quote>
                We used to have to hire outside IT guys just to upload the accounts. We're able to upload the accounts in 5 to 10 minutes tops.
              </Quote>

              <P>
                Alongside faster onboarding, the team gained real-time visibility into their portfolios. Account status, collector activity, and workflow progress became immediately accessible  - no manual tracking, no chasing down status updates. The operations team could see what was happening across their book of business without waiting for a report.
              </P>
              <P>
                The broader impact was a reduction in operational dependency. Tasks that had previously required outside help became self-contained. The team operated with more autonomy and less overhead  - and that freed up time and attention for the actual work of collections.
              </P>

              <H2 id="voice-agents">Extending Into Voice Agents</H2>
              <P>
                As Greystone grew more comfortable with DROS, they began extending into AI voice agent capabilities through Vodex  - one of DROS's integrated solutions. The shift to voice automation added another layer of efficiency to outreach workflows, allowing the team to scale contact attempts without proportionally increasing headcount.
              </P>
              <P>
                For an agency focused on daily collections operations, voice agents provided a way to keep portfolios active and moving even when human collectors were focused elsewhere. The integration between DROS and Vodex kept everything connected  - no separate systems to manage, no data gaps between platforms.
              </P>

              <H2 id="reflection">A Broader Reflection on Collections Software</H2>
              <P>
                What the Greystone experience reflects is something broader than one agency's workflow. Collections software has a history of being built for compliance and reporting  - important, but not the full picture of what a collections team needs to run effectively day to day.
              </P>
              <P>
                The things that slow teams down are often not dramatic failures  - they're the quiet friction of processes that require more steps than they should, tools that don't talk to each other, and dependencies on external resources for tasks that should be self-service. DROS was designed around reducing exactly that kind of friction.
              </P>

              <H2 id="why-it-matters">Why This Matters for Other Agencies</H2>
              <P>
                For agencies evaluating new platforms, the Greystone story points to a few practical questions worth asking: How long does it take to onboard a new batch of accounts? How much do you depend on outside resources for tasks your team should own? And how clearly can you see what's happening across your portfolios right now?
              </P>
              <P>
                If those answers involve more friction than they should, the gap between where your operations are today and where they could be is likely larger than it appears. Reducing that friction doesn't require a complex implementation  - it requires the right foundation.
              </P>

              <H2 id="customer-perspective">Customer Perspective</H2>
              <P>
                From the Greystone team's perspective, the value of DROS was less about any single feature and more about operational independence. The ability to move faster, see more clearly, and rely less on external dependencies translated directly into a smoother day-to-day experience for the team.
              </P>
              <P>
                That kind of shift  - from a reactive, high-overhead workflow to a more self-contained, visible operation  - is what modern collections infrastructure should enable. Greystone is an example of an agency that made that transition and felt the difference immediately.
              </P>

              {/* Highlight strip */}
              <div className="mt-14 mb-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    headline: 'Account uploads in minutes',
                    body: 'Reduced from a multi-day external IT dependency to a self-service process the team runs in 5–10 minutes.',
                  },
                  {
                    headline: 'Real-time portfolio visibility',
                    body: 'Live account status and collector activity across portfolios  - no manual tracking or delayed reporting.',
                  },
                  {
                    headline: 'Less IT dependency',
                    body: 'Operations the team now owns internally that previously required outside technical resources.',
                  },
                ].map(({ headline, body }) => (
                  <div
                    key={headline}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-6"
                  >
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mb-4" />
                    <p className="font-bold text-slate-900 text-base mb-2">{headline}</p>
                    <p className="text-slate-500 text-sm leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-14 pt-8 border-t border-slate-200">
                <Link
                  to="/customer-stories"
                  className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-500 transition-colors font-medium"
                >
                  ← Back to Customer Stories
                </Link>
              </div>
            </article>

            {/* Desktop sticky info card */}
            <InfoCard />
          </div>
        </div>
      </div>

      {/* Dark CTA */}
      <div className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-slate-950 to-blue-950/20" />
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            See How DROS Fits Your{' '}
            <span style={{ background: 'linear-gradient(135deg, #DD39F9, #03D2FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Collections Workflow
            </span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Learn how agencies like Greystone are simplifying daily operations, reducing overhead, and gaining real-time visibility with DROS.
          </p>
          <a
            href="https://dros.ai/book-meeting"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCta('cta_book_demo')}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105" style={{ background: '#03D2FC', color: '#010C20' }}
          >
            Book a Demo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img loading="lazy" decoding="async" src="/untitled_logo_1_basic-file.png" alt="DROS Logo" className="w-8 h-8" />
                <span className="text-xl font-bold">DROS</span>
              </div>
              <p className="text-slate-400 text-sm">The operating system for modern debt collection agencies.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/#features" className="hover:text-white transition-colors">Features</a></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="/#security" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/blogs" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Resources</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/customer-stories" className="hover:text-white transition-colors">Customer Stories</Link></li>
                <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
                <li><Link to="/resources/videos" className="hover:text-white transition-colors">Videos</Link></li>
                <li><a href="https://app.dros.ai/api-docs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">API Docs</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 DROS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
