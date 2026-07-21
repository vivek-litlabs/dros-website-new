export const route = '/about';
import { ArrowRight, Linkedin } from 'lucide-react';
import Footer from './Footer';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Helmet>
        <title>About DROS | AI-Native Engagement OS for Collections</title>
        <meta name="description" content="Learn how DROS is building an AI-native engagement operating system for collections teams, debt buyers, and first-party recovery operations." />
        <meta property="og:title" content="About DROS | AI-Native Engagement OS for Collections" />
        <meta property="og:description" content="Learn how DROS is building an AI-native engagement operating system for collections teams, debt buyers, and first-party recovery operations." />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/about" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-slate-950 to-blue-950/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-5 py-2 mb-10 text-sm font-semibold text-cyan-400 tracking-wide uppercase">
            About DROS
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Built for how collections
            <br />
            <span style={{ background: 'linear-gradient(135deg, #DD39F9, #03D2FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              actually works now
            </span>
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl text-slate-400 mb-12 leading-relaxed max-w-3xl mx-auto">
            DROS.ai is an AI-native operating layer built for modern collections, helping teams manage engagement, context, prioritization, and execution without adding more fragmentation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://dros.ai/book-meeting" target="_blank" rel="noopener noreferrer" className="group px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2" style={{ background: '#03D2FC', color: '#010C20' }}>
              Book a Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="https://app.dros.ai" target="_blank" rel="noopener noreferrer" className="border border-slate-700 hover:border-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:bg-slate-900">
              Explore Product
            </a>
          </div>
        </div>
      </section>

      {/* Why We Built DROS */}
      <section className="py-16 md:py-32 bg-white text-slate-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-slate-900">Why We Built DROS</h2>
          <div
            className="rounded-2xl p-7 md:p-12 space-y-6"
            style={{
              background: '#F3F8FC',
              border: '1px solid rgba(10,26,47,0.10)',
              boxShadow: '0 8px 40px 0 rgba(10,26,47,0.11), 0 3px 12px 0 rgba(10,26,47,0.07), inset 0 1px 0 0 rgba(255,255,255,0.65)',
            }}
          >
            <p className="text-lg md:text-2xl text-slate-600 leading-relaxed">
              Collections changed faster than the systems around it. Teams now manage more channels, more accounts, more pressure, and more operational decisions than older collections systems were ever built for. Yet the core tools have not evolved to match.
            </p>
            <p className="text-lg md:text-2xl text-slate-600 leading-relaxed">
              DROS was built to close that gap without replacing your core systems. It sits on top of what you already use: your CRM, dialers, payment platforms, and compliance tools, and connects them into one operating layer where context flows freely and decisions become intentional.
            </p>
          </div>
        </div>
      </section>

      {/* What Led to DROS - Timeline */}
      <section className="py-16 md:py-32 overflow-hidden bg-white text-slate-900">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">What Led to DROS</h2>
            <p className="text-2xl text-slate-500">The evolution from problem to solution</p>
          </div>

          <div className="relative">
            {/* Center spine */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/60 via-cyan-400/30 to-transparent transform -translate-x-1/2 hidden md:block"></div>

            <div className="space-y-16">
              {[
                {
                  step: 'Step 01',
                  title: 'Voice revealed the first layer',
                  body: <>While building <a href="https://vodex.ai" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline underline-offset-2">Vodex.ai</a> for collections, voice AI began solving real communication problems inside collections. Teams were reaching more people, closing more calls, and handling more accounts at scale.</>,
                  side: 'left'
                },
                {
                  step: 'Step 02',
                  title: 'Operations exposed the bigger gap',
                  body: 'Teams were still switching systems, losing context, and making decisions without enough continuity. Voice solved one part of execution, but the workflow around it remained broken.',
                  side: 'right'
                },
                {
                  step: 'Step 03',
                  title: 'DROS became the operating layer',
                  body: 'A system built to connect engagement, workflow, prioritization, and execution. Not just communication. Not just automation. A complete operating layer for modern collections.',
                  side: 'left'
                }
              ].map((item, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-8 items-center">
                  {item.side === 'left' ? (
                    <>
                      <div
                        className="rounded-2xl p-6 md:p-8 transition-all"
                        style={{
                          background: '#F3F8FC',
                          border: '1px solid rgba(10,26,47,0.10)',
                          boxShadow: '0 8px 40px 0 rgba(10,26,47,0.11), 0 3px 12px 0 rgba(10,26,47,0.07), inset 0 1px 0 0 rgba(255,255,255,0.65)',
                        }}
                      >
                        <div className="text-cyan-600 text-sm font-bold tracking-widest uppercase mb-3">{item.step}</div>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900">{item.title}</h3>
                        <p className="text-slate-500 leading-relaxed text-base md:text-xl">{item.body}</p>
                      </div>
                      <div className="flex justify-center md:justify-start">
                        <div className="relative flex items-center justify-center w-16 h-16">
                          <div className="absolute inset-0 bg-cyan-400/15 rounded-full blur-xl"></div>
                          <div className="relative w-6 h-6 bg-cyan-500 rounded-full border-4 border-white shadow-lg shadow-cyan-500/30"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center md:justify-end">
                        <div className="relative flex items-center justify-center w-16 h-16">
                          <div className="absolute inset-0 bg-cyan-400/15 rounded-full blur-xl"></div>
                          <div className="relative w-6 h-6 bg-cyan-500 rounded-full border-4 border-white shadow-lg shadow-cyan-500/30"></div>
                        </div>
                      </div>
                      <div
                        className="rounded-2xl p-6 md:p-8 transition-all"
                        style={{
                          background: '#F3F8FC',
                          border: '1px solid rgba(10,26,47,0.10)',
                          boxShadow: '0 8px 40px 0 rgba(10,26,47,0.11), 0 3px 12px 0 rgba(10,26,47,0.07), inset 0 1px 0 0 rgba(255,255,255,0.65)',
                        }}
                      >
                        <div className="text-cyan-600 text-sm font-bold tracking-widest uppercase mb-3">{item.step}</div>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900">{item.title}</h3>
                        <p className="text-slate-500 leading-relaxed text-base md:text-xl">{item.body}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Changes When DROS Is in Place */}
      <section className="py-16 md:py-32 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Changes When DROS Is in Place</h2>
            <p className="text-2xl text-slate-400">Four shifts that define a different operating standard</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                number: '01',
                title: 'Context stays connected',
                body: 'History, intent, and timing carry forward across every interaction: from voice to SMS, from SMS to email, across every agent and every touchpoint.'
              },
              {
                number: '02',
                title: 'Channels work together',
                body: 'Voice, SMS, email, and digital outreach function as one coordinated flow instead of disconnected, isolated actions.'
              },
              {
                number: '03',
                title: 'Prioritization becomes smarter',
                body: 'Know who to focus on, when to act, and which channel is most likely to create a real response, driven by signals, not guesswork.'
              },
              {
                number: '04',
                title: 'Compliance sits inside execution',
                body: 'Guardrails, timing, and controls guide the workflow in real time. No separate compliance layer. No checking after the fact.'
              }
            ].map((card) => (
              <div key={card.number} className="group relative overflow-hidden rounded-2xl bg-slate-800/60 border border-slate-700/60 p-10 md:p-12 hover:border-cyan-500/50 transition-all hover:-translate-y-1">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/60 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>
                <div className="text-5xl md:text-7xl font-bold text-slate-700 mb-6 leading-none">{card.number}</div>
                <h3 className="text-2xl md:text-3xl font-bold mb-5 text-white">{card.title}</h3>
                <p className="text-slate-300 leading-relaxed text-base md:text-xl lg:text-2xl">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Believe */}
      <section className="py-16 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-slate-900">What We Believe</h2>
          <div className="space-y-4">
            {[
              'Context should not disappear between channels',
              'Intelligence should sit inside execution',
              'Compliance should guide action in real time'
            ].map((belief, index) => (
              <div
                key={index}
                className="flex items-start gap-6 rounded-2xl p-8 md:p-10 transition-all"
                style={{
                  background: '#F3F8FC',
                  border: '1px solid rgba(10,26,47,0.10)',
                  boxShadow: '0 8px 40px 0 rgba(10,26,47,0.11), 0 3px 12px 0 rgba(10,26,47,0.07), inset 0 1px 0 0 rgba(255,255,255,0.65)',
                }}
              >
                <div className="w-1 min-h-[1.5rem] bg-gradient-to-b from-cyan-500 to-cyan-400 rounded-full flex-shrink-0 mt-1" style={{ alignSelf: 'stretch' }}></div>
                <p className="text-base md:text-xl lg:text-2xl text-slate-700 leading-relaxed font-medium">{belief}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What DROS Is Built To Do */}
      <section className="py-16 md:py-32 bg-white text-slate-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">What DROS Is Built To Do</h2>
          <p className="text-base md:text-2xl text-slate-600 leading-relaxed">
            DROS helps collection agencies, debt buyers, lenders, and in-house receivables teams connect voice, SMS, email, workflows, and account decisions into one operating layer. It bridges the gap between communication and operations so your entire team works from the same playbook, with the same context, the same priorities, and the same compliance guardrails.
          </p>
        </div>
      </section>

      {/* Built From Real Collections Work */}
      <section className="py-16 md:py-32 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Built From Real Collections Work</h2>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-10 md:p-12">
            <p className="text-base md:text-2xl text-slate-300 leading-relaxed mb-6">
              DROS emerged from what became clear while building Vodex.ai for collections. As voice AI began handling real conversations across agencies and recovery teams, the same operational gaps kept surfacing behind the calls: fragmented systems, disconnected follow-up, repeated context loss, and too many decisions happening without enough visibility.
            </p>
            <p className="text-base md:text-2xl text-slate-300 leading-relaxed mb-6">
              Voice solved one part of execution, but the broader workflow around it still remained broken. That is what led to DROS: a system built not just for communication, but for how collections work actually moves, keeping context flowing, keeping decisions visible, and keeping compliance baked into every action.
            </p>
            <p className="text-base md:text-2xl text-slate-300 leading-relaxed">
              Every feature in DROS comes from a real problem we saw in the field. Nothing is theoretical. Everything exists because collections teams needed it.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 md:py-32 bg-white text-slate-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-slate-900">Leadership</h2>
          <div
            className="rounded-2xl p-7 md:p-12"
            style={{
              background: '#F3F8FC',
              border: '1px solid rgba(10,26,47,0.10)',
              boxShadow: '0 8px 40px 0 rgba(10,26,47,0.11), 0 3px 12px 0 rgba(10,26,47,0.07), inset 0 1px 0 0 rgba(255,255,255,0.65)',
            }}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <div className="w-56 h-56 rounded-full overflow-hidden border-2 border-cyan-400/30 shadow-lg shadow-cyan-500/10">
                  <img loading="lazy" decoding="async" src="/Untitled_design_(15).png" alt="Anshul Shrivastava" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-2 text-slate-900">Anshul Shrivastava</h3>
                <p className="text-cyan-600 font-semibold text-lg mb-4">Co-founder & CEO</p>
                <a
                  href="https://www.linkedin.com/in/anshul-shrivastava"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-600 transition-colors mb-6"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="text-base font-medium">Connect on LinkedIn</span>
                </a>
                <p className="text-slate-600 leading-relaxed text-xl">
                  Anshul has worked closely with collections operations through the evolution of AI-led engagement systems, helping shape products built around both communication and operational workflow challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where We Operate */}
      <section className="py-16 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-slate-900">Our Locations</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div
              className="rounded-2xl p-10 text-center transition-all"
              style={{
                background: '#F3F8FC',
                border: '1px solid rgba(10,26,47,0.10)',
                boxShadow: '0 8px 40px 0 rgba(10,26,47,0.11), 0 3px 12px 0 rgba(10,26,47,0.07), inset 0 1px 0 0 rgba(255,255,255,0.65)',
              }}
            >
              <p className="text-slate-400 text-base uppercase tracking-widest mb-3">US Offices</p>
              <h3 className="text-3xl font-bold mb-3 text-slate-900">United States</h3>
              <p className="text-cyan-600 font-semibold text-lg">1592 Union St #473</p>
              <p className="text-cyan-600 font-semibold text-lg">San Francisco, CA 94123</p>
              <p className="text-slate-500 mt-2">Delaware</p>
            </div>
            <div
              className="rounded-2xl p-10 text-center transition-all"
              style={{
                background: '#F3F8FC',
                border: '1px solid rgba(10,26,47,0.10)',
                boxShadow: '0 8px 40px 0 rgba(10,26,47,0.11), 0 3px 12px 0 rgba(10,26,47,0.07), inset 0 1px 0 0 rgba(255,255,255,0.65)',
              }}
            >
              <p className="text-slate-400 text-base uppercase tracking-widest mb-3">Dev Center</p>
              <h3 className="text-3xl font-bold mb-3 text-slate-900">India</h3>
              <p className="text-cyan-600 font-semibold text-lg">Bengaluru</p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-16 md:py-32 bg-slate-950 border-t border-cyan-500/20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The next standard in collections is
            <br />
            <span className="text-cyan-400">better execution</span>
          </h2>
          <p className="text-2xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Context flowing freely. Decisions visible. Compliance automatic. Teams working from one source of truth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://dros.ai/book-meeting" target="_blank" rel="noopener noreferrer" className="group px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2" style={{ background: '#03D2FC', color: '#010C20' }}>
              Talk to Us
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="https://app.dros.ai" target="_blank" rel="noopener noreferrer" className="border border-slate-600 hover:border-slate-400 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:bg-slate-900">
              Explore the Platform
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
