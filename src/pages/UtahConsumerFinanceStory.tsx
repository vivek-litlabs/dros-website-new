export const route = '/customer-stories/utah-consumer-finance';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, MapPin, Layers, Cpu } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { trackCta } from '../lib/analytics';
import Navbar from './Navbar';
import Footer from './Footer';

const INFO_FIELDS = [
  { icon: Building2, label: 'Industry', value: 'Financial Services / Consumer Lending' },
  { icon: MapPin, label: 'Region', value: 'Utah - Salt Lake City, Orem, St. George' },
  { icon: Layers, label: 'Collection Model', value: '1st Party Collections' },
  { icon: Cpu, label: 'Solutions Used', value: 'DROS Voice AI, Campaign Automation, SMS Automation' },
];

function InfoCard() {
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-28">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">About this story</p>
        <ul className="space-y-5">
          {INFO_FIELDS.map(({ icon: Icon, label, value }) => (
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
            onClick={() => trackCta('sidebar_book_demo_utah')}
            className="block w-full text-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
            style={{ background: '#03D2FC', color: '#010C20' }}
          >
            Book a demo
          </a>
        </div>
      </div>
    </aside>
  );
}

function MobileInfoCard() {
  return (
    <div className="lg:hidden bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-10">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">About this story</p>
      <div className="space-y-3">
        {INFO_FIELDS.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-3 items-start">
            <Icon className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-sm font-medium text-slate-800 leading-snug">{value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-slate-200">
        <a
          href="https://dros.ai/book-meeting"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCta('mobile_info_book_demo_utah')}
          className="block w-full text-center px-4 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95"
          style={{ background: '#03D2FC', color: '#010C20' }}
        >
          Book a demo
        </a>
      </div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-700 leading-relaxed text-base mb-5">{children}</p>;
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-4 leading-snug scroll-mt-28">
      {children}
    </h2>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="relative my-8 bg-gradient-to-br from-cyan-50 to-slate-50 border border-cyan-200 rounded-2xl px-6 py-6">
      <div className="absolute top-3 left-4 text-cyan-300 text-4xl font-saans leading-none select-none">"</div>
      <p className="text-slate-800 text-base sm:text-lg font-medium leading-relaxed italic pl-5 pt-2">{children}</p>
    </blockquote>
  );
}

function ChallengeCard({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
      <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-cyan-600 mb-2">{num}</div>
      <p className="font-bold text-slate-900 text-sm mb-1.5 leading-snug">{title}</p>
      <p className="text-slate-500 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function SolutionItem({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="flex gap-4 py-5 border-b border-slate-100 last:border-b-0">
      <div
        className="text-2xl font-bold leading-none flex-shrink-0 mt-0.5 opacity-25 w-8 text-right"
        style={{ background: 'linear-gradient(135deg,#DD39F9,#03D2FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
      >
        {num}
      </div>
      <div className="min-w-0">
        <p className="font-bold text-slate-900 text-sm mb-1.5 leading-snug">{title}</p>
        <p className="text-slate-500 text-sm leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function StatCard({ stat, label, sub }: { stat: string; label: string; sub: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
      <div
        className="text-2xl sm:text-3xl font-bold mb-1.5 leading-none"
        style={{ background: 'linear-gradient(135deg,#03D2FC,#0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
      >
        {stat}
      </div>
      <p className="font-semibold text-slate-900 text-xs sm:text-sm mb-1">{label}</p>
      <p className="text-slate-400 text-xs leading-relaxed">{sub}</p>
    </div>
  );
}

const TABLE_ROWS = [
  { metric: 'Campaign initiation', before: 'Manual, agent-dependent', after: 'Fully scheduled & automated' },
  { metric: 'Missed contact retry lag', before: '24-48 hours', after: 'Under 15 minutes' },
  { metric: 'Retry attempts per contact', before: '1 (manual, inconsistent)', after: 'Up to 3 (automatic)' },
  { metric: 'Dead-air call rate', before: '~20-25% of connected calls', after: 'Under 8%' },
  { metric: 'Prequalification via AI', before: '0%', after: '80%+' },
  { metric: 'Agent role', before: 'Driving volume manually', after: 'Handling escalations & live contacts' },
  { metric: 'Gateway campaign disruptions', before: 'Multiple per week', after: 'Zero post-deployment' },
  { metric: 'Campaign launch time', before: '2-3 hours manual setup', after: 'Under 10 minutes' },
];

function BeforeAfterTable() {
  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="sm:hidden mt-8 mb-4 space-y-3">
        {TABLE_ROWS.map((row) => (
          <div key={row.metric} className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-700">{row.metric}</p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-100">
              <div className="px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400 mb-1">Before</p>
                <p className="text-xs text-slate-500 leading-relaxed">{row.before}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-600 mb-1">After</p>
                <p className="text-xs text-teal-700 font-medium leading-relaxed">{row.after}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block mt-10 mb-2 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 w-1/3">Metric</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-red-400 w-1/3">Before DROS</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-cyan-600 w-1/3">After DROS</th>
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map((row, i) => (
              <tr key={row.metric} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                <td className="px-5 py-3.5 font-medium text-slate-800 border-b border-slate-100">{row.metric}</td>
                <td className="px-5 py-3.5 text-slate-500 border-b border-slate-100">{row.before}</td>
                <td className="px-5 py-3.5 text-teal-700 font-medium border-b border-slate-100">{row.after}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function UtahConsumerFinanceStory() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Helmet>
        <title>How a Utah-Based Consumer Finance Company Replaced Manual Outbound With a Self-Running AI Operation | DROS</title>
        <meta name="description" content="See how a Utah consumer finance company automated 15,000 daily outbound calls across loan prequalification, 1st party collections, and payment reminders using DROS - without adding headcount." />
        <link rel="canonical" href="https://dros.ai/customer-stories/utah-consumer-finance" />
        <meta property="og:title" content="How a Utah-Based Consumer Finance Company Replaced Manual Outbound With a Self-Running AI Operation | DROS" />
        <meta property="og:description" content="See how a Utah consumer finance company automated 15,000 daily outbound calls across loan prequalification, 1st party collections, and payment reminders using DROS - without adding headcount." />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/customer-stories/utah-consumer-finance" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
      </Helmet>
      <Navbar />

      {/* Hero */}
      <div className="relative bg-slate-950 text-white pt-28 pb-14 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-slate-950 to-blue-950/30" />
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <Link
            to="/customer-stories"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium mb-7 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Back to Customer Stories
          </Link>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full uppercase tracking-wider">
              Customer Story
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5 text-white">
            How a Utah-Based Consumer Finance Company Replaced Manual Outbound With a Self-Running AI Operation with DROS
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            A story about automating 15,000 daily outbound calls across loan prequalification, 1st party collections, and payment reminders - without adding headcount.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
          <MobileInfoCard />

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
            <article className="min-w-0 flex-1">

              <H2 id="overview">Overview</H2>
              <P>
                A consumer finance company operating across three locations in Utah came to DROS running one of the most call-intensive outbound lending operations in their segment - roughly 15,000 outbound calls per day spanning loan prequalification, 1st party collections follow-ups, payment reminders, and appointment coordination.
              </P>
              <P>
                As a lender managing their own collections portfolio, the stakes were direct. Every missed contact, every delayed retry, every wasted call was a recoverable asset left on the table. The infrastructure they were running wasn't broken - it was just never built for this volume or this level of automation complexity.
              </P>
              <P>
                This is the story of what changed when it was.
              </P>

              <H2 id="challenge">The Operational Challenge</H2>
              <P>
                Before DROS, every campaign required agents to initiate it, manage it, and manually retry contacts that didn't answer. Gateway instability was a recurring issue. Dead-air calls - customers picking up to silence - were consuming a significant share of daily capacity with zero outcome. Disposition reporting was unreliable enough that optimising campaigns was effectively guesswork.
              </P>
              <P>
                In 1st party collections, these weren't just operational inefficiencies. They were direct drags on recovery - every hour a missed contact went unretried was an hour that reachability dropped and recovery potential shrank.
              </P>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 mb-2">
                <ChallengeCard num="01" title="Human Dependency at Scale" body="Every workflow required agents at every step. No automation layer existed to absorb volume independently of staff on shift." />
                <ChallengeCard num="02" title="Gateway Instability" body="Repeated gateway migrations introduced new failures each time - portal hangs, voicemail detection failures, mid-campaign call continuity drops." />
                <ChallengeCard num="03" title="Dead-Air Call Waste" body="No live-user detection logic. An estimated 20-25% of connected calls produced zero outcome - wasted capacity at 15,000 calls a day." />
                <ChallengeCard num="04" title="No Retry Automation" body="Missed contacts sat unretried for 24-48 hours until manually re-queued - a structural drag on 1st party collections efficiency." />
                <ChallengeCard num="05" title="Unreliable Disposition Reporting" body="Live calls, voicemail outcomes, and failed connections were indistinguishable in reporting. Campaign optimisation was guesswork." />
                <ChallengeCard num="06" title="Collections Cycle Exposure" body="Inconsistent contact cycles meant high-intent contacts were missed at peak reachability windows - recoverable assets going unworked." />
              </div>

              <H2 id="what-changed">What Changed After DROS</H2>
              <P>
                DROS deployed six AI voice agents across all four workflow types - each built from scratch around the client's actual campaign logic, routing behaviour, and escalation thresholds. A collections call operates differently from a prequalification call, and every agent was configured to reflect that.
              </P>

              <div className="mt-2 mb-2">
                <SolutionItem num="01" title="15-Second Live User Verification" body="Every outbound call now runs a live-user check in the first 15 seconds. Confirmed live contact - the call continues. No response - one prompt. Still no reply - clean disconnect. This single change eliminated dead-air calls at the root, recovering thousands of productive call attempts daily that were previously wasted on silent connections." />
                <SolutionItem num="02" title="Automated Redial & Campaign Scheduling" body="Unanswered contacts are automatically queued for up to three follow-up attempts, with retry lag cut from 24-48 hours to under 15 minutes. Time-based campaign scheduling replaced manual triggers entirely. The operation runs continuously - agents handle escalations, not queue management." />
                <SolutionItem num="03" title="Parallel Voice + SMS Automation" body="Outbound SMS reminder sequences run alongside voice campaigns, keeping borrowers engaged across both channels on schedule - zero additional headcount required to manage either." />
                <SolutionItem num="04" title="Gateway Stabilisation & Routing Engineering" body="DROS engineered custom workarounds for recurring gateway issues - portal hangs, voicemail detection failures, routing edge cases. Voicemail failure outcomes were tracked and reconciled for billing transparency. Zero campaign stoppages from gateway issues post-deployment." />
                <SolutionItem num="05" title="6 Purpose-Built AI Voice Agents Across 4 Workflows" body="Individual agents configured for loan prequalification, 1st party collections, payment reminders, and appointment coordination - each with its own conversation logic, escalation thresholds, and transfer routing. Built for the use case, not adapted from a template." />
              </div>

              <Quote>
                Before this, every campaign needed someone to run it. Now the system runs - we just manage the outcomes.
              </Quote>

              <H2 id="results">The Results</H2>
              <P>
                Across all four workflow types, the shift from manual to autonomous outbound produced measurable improvements in efficiency, contact consistency, and operational cost.
              </P>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 mb-8">
                <StatCard stat="~80%" label="Reduction in manual campaign handling" sub="Campaigns now run and recover automatically end-to-end" />
                <StatCard stat="<15 min" label="Retry lag on missed contacts" sub="Down from 24-48 hours of manual re-queue time" />
                <StatCard stat="~60%" label="Reduction in dead-air call rate" sub="Live-user verification eliminated wasted connections at scale" />
                <StatCard stat="3x" label="Retry attempts per unanswered contact" sub="Up from one inconsistent manual attempt to three automatic follow-ups" />
                <StatCard stat="80%+" label="Prequalification handled by AI" sub="Human agents reserved for conversions and escalations only" />
                <StatCard stat="~40%" label="Reduction in cost per contact attempt" sub="As AI absorbed the majority of outbound volume" />
              </div>

              <BeforeAfterTable />

              <H2 id="why-it-matters">Why This Matters for Other Lenders</H2>
              <P>
                For consumer finance companies running their own collections, this story points to a few practical questions worth asking: How much of your daily outbound still requires an agent to initiate it? How long does a missed contact go unretried? And how much of your connected call capacity is producing zero outcome?
              </P>
              <P>
                If those answers involve more manual overhead than they should, the gap between where your operation is today and where it could be is likely larger than it appears. At 15,000 calls a day, small efficiency gains compound fast.
              </P>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {[
                  { stat: '~180,000', label: 'Additional productive call attempts recovered monthly', body: 'From dead-air waste - calls that previously connected to silence and produced nothing.' },
                  { stat: '~480 hrs', label: 'Agent hours freed monthly', body: 'From queue management and redeployed to live contact handling and escalations.' },
                  { stat: '10,000+', label: 'Missed contacts retried within 15 minutes monthly', body: 'Instead of sitting in a manual queue for 24-48 hours.' },
                ].map(({ stat, label, body }) => (
                  <div key={stat} className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <div className="text-xl sm:text-2xl font-bold mb-2 leading-none" style={{ background: 'linear-gradient(135deg,#03D2FC,#0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      {stat}
                    </div>
                    <p className="font-semibold text-slate-900 text-sm mb-1.5">{label}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-slate-50 border border-cyan-200 rounded-2xl px-6 py-5 my-8">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mb-3" />
                <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                  In 1st party collections, faster retry cycles aren't just an efficiency metric - they're a recovery metric. Every hour a missed contact goes unretried is an hour that reachability drops and recovery potential shrinks. Cutting retry lag from 48 hours to 15 minutes changes which contacts get reached - and when.
                </p>
              </div>

              <H2 id="customer-perspective">Customer Perspective</H2>
              <P>
                From this team's perspective, the value of DROS was less about any single feature and more about operational independence. The ability to run campaigns without constant oversight, retry contacts automatically, and scale outbound without scaling headcount translated directly into a more efficient day-to-day operation.
              </P>
              <P>
                That kind of shift - from a manually-driven, agent-dependent workflow to a self-running AI operation - is what modern consumer lending infrastructure should enable.
              </P>

              <Quote>
                The ability to automate reminders and redialling without constant manual oversight was exactly what we needed at this scale.
              </Quote>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                {[
                  { headline: 'Campaigns run without agents', body: 'Outbound campaigns now initiate, manage retries, and handle voicemail outcomes automatically - no manual trigger required.' },
                  { headline: 'Contacts worked at peak reachability', body: "Sub-15-minute retry cycles mean borrowers are reached while they're still most likely to respond - not 48 hours later." },
                  { headline: 'Agents on work that matters', body: 'Human agents moved from managing queues and restarting campaigns to handling live escalations and conversion conversations.' },
                ].map(({ headline, body }) => (
                  <div key={headline} className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mb-3" />
                    <p className="font-bold text-white text-sm mb-2 leading-snug">{headline}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-200">
                <Link to="/customer-stories" className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-500 transition-colors font-medium text-sm">
                  ← Back to Customer Stories
                </Link>
              </div>
            </article>

            <InfoCard />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-slate-950 to-blue-950/20" />
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Built for Lenders Running Their Own Collections.{' '}
            <span style={{ background: 'linear-gradient(135deg, #DD39F9, #03D2FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              See DROS in Action.
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            See how consumer finance companies at high outbound volume are replacing manual campaign operations with self-running AI infrastructure - without adding headcount.
          </p>
          <a
            href="https://dros.ai/book-meeting"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCta('cta_book_demo_utah')}
            className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-base transition-all hover:scale-105 active:scale-95"
            style={{ background: '#03D2FC', color: '#010C20' }}
          >
            Book a Demo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
