export const route = '/collections-ai-workshop';
import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { trackCta } from '../lib/analytics';
import Navbar from './Navbar';
import Footer from './Footer';

const gradStyle = {
  background: 'linear-gradient(90deg, #DD39F9, #03D2FC)',
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent' as const,
  backgroundClip: 'text' as const,
};

const gradBg = { background: 'linear-gradient(90deg, #DD39F9, #03D2FC)' };

export default function CollectionsAIWorkshop() {
  const formSectionRef = useRef<HTMLDivElement>(null);

  function scrollToForm() {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    trackCta('workshop_watch_on_demand');
  }


  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Helmet>
        <title>The Collections AI Workshop - Improve RPC, PTP and Recovery | DROS</title>
        <meta name="description" content="A free 2-hour live workshop for collection agency owners and ops leaders. Map your agency's AI gaps and leave with a 90-day plan - June 4, 2026." />
        <link rel="canonical" href="https://dros.ai/collections-ai-workshop" />
        <meta property="og:title" content="The Collections AI Workshop - Improve RPC, PTP and Recovery | DROS" />
        <meta property="og:description" content="A free 2-hour live workshop for collection agency owners and ops leaders. Map your AI gaps and leave with a 90-day plan." />
        <meta property="og:url" content="https://dros.ai/collections-ai-workshop" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: '#010C20', paddingTop: '140px', paddingBottom: '90px' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03, backgroundImage: 'linear-gradient(rgba(3,210,252,1) 1px, transparent 1px), linear-gradient(90deg, rgba(3,210,252,1) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
        <div className="absolute pointer-events-none" style={{ width: 650, height: 650, borderRadius: '50%', background: 'radial-gradient(circle, rgba(221,57,249,0.12) 0%, transparent 65%)', top: -200, left: -150 }} />
        <div className="absolute pointer-events-none" style={{ width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(3,210,252,0.08) 0%, transparent 65%)', bottom: -100, right: -100 }} />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-6" style={{ background: 'linear-gradient(90deg, rgba(221,57,249,0.1), rgba(3,210,252,0.1))', border: '1px solid rgba(221,57,249,0.3)', borderRadius: 100, padding: '6px 16px' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#DD39F9', boxShadow: '0 0 6px #DD39F9' }} />
                <span className="text-xs font-medium text-white tracking-widest uppercase">Workshop Webinar - Free - June 4, 2026</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-5">
                The Collections AI Workshop:<br />
                Improve <span style={gradStyle}>RPC, PTP and Recovery</span><br />
                Without Adding Headcount
              </h1>

              <p className="text-base text-slate-300 leading-relaxed mb-8 max-w-xl">
                A 2-hour hands-on session where you'll map exactly where your agency leaks revenue - and see how AI closes every one of those gaps.
              </p>

              <button
                    onClick={scrollToForm}
                    className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-semibold text-white text-base transition-transform hover:-translate-y-0.5"
                    style={{ ...gradBg, boxShadow: '0 0 36px rgba(221,57,249,0.22)' }}
                  >
                    Watch the Recording &darr;
                  </button>
                  <p className="text-xs text-slate-500 mt-3">Full recording available below</p>
                  <p className="text-xs text-slate-500 mt-3">Free access</p>
            </div>

            {/* Host card */}
            <div className="flex-shrink-0 w-72">
              <div className="flex flex-col items-center rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#03D2FC' }}>Hosted by</p>
                <div className="relative mb-5" style={{ width: 140, height: 140 }}>
                  <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(221,57,249,0.18) 0%, transparent 70%)', margin: -22 }} />
                  <div className="absolute inset-0 rounded-full p-0.5" style={gradBg}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-950">
                      <img loading="lazy" decoding="async"
                        src="/Untitled_design_(15) copy.png"
                        alt="Anshul Shrivastava"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-lg font-semibold text-white mb-1">Anshul Shrivastava</p>
                <p className="text-sm text-slate-400 mb-6">CEO, Vodex.ai</p>
                <div className="flex gap-1.5 w-full">
                  {[{ lbl: 'EST', val: '12 PM' }, { lbl: 'CST', val: '11 AM' }, { lbl: 'PST', val: '9 AM' }, { lbl: 'GMT', val: '5 PM' }].map(({ lbl, val }) => (
                    <div key={lbl} className="flex-1 flex flex-col items-center py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                      <span className="text-xs font-semibold text-white uppercase tracking-wide mb-1">{lbl}</span>
                      <span className="text-sm font-semibold text-white">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECORDING ── */}
      <section
        ref={formSectionRef}
        style={{ background: '#010C20', borderTop: '1px solid rgba(255,255,255,0.06)' }}
        className="py-20"
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-center" style={{ color: '#03D2FC' }}>Full Workshop Recording</p>
          <h2 className="text-3xl font-bold text-white text-center mb-8">Watch the Recording</h2>
          <div className="rounded-2xl overflow-hidden shadow-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <iframe
              width="100%"
              style={{ aspectRatio: '16/9', display: 'block' }}
              src="https://www.youtube.com/embed/v3CeeU_IECo"
              title="The Collections AI Workshop"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ── VIDEO (teaser) ── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-xl" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/mVAePoy8Nrw?si=u16IInErMGn-shA8"
              title="Collections AI Workshop"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ── WHAT YOU'LL LEARN ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#1A237E' }}>What this session covers</p>
            <h2 className="text-3xl font-bold text-slate-900 leading-tight mb-4">Educational, practical, and focused on real collection workflows.</h2>
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">This isn't a vendor pitch or an AI theory lecture. Every topic maps directly to how a 10-50 person agency operates - the gaps your collectors face every day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: 'Right Party Contact',
                title: 'How AI improves RPC rates',
                desc: 'Learn how agencies use AI to identify the best time and channel to reach each debtor - reducing wasted attempts and increasing live conversations.',
              },
              {
                label: 'Promise-to-Pay Follow-Up',
                title: 'Eliminating missed PTPs',
                desc: 'See how automated follow-up across SMS, email, and calls ensures every promise is tracked and followed through - without relying on your collectors to remember.',
              },
              {
                label: 'Account Prioritization',
                title: 'Working the right accounts first',
                desc: 'Understand how AI scoring helps your team focus on accounts most likely to pay - so your best collectors spend time where it actually moves the needle.',
              },
              {
                label: 'Debtor Engagement',
                title: 'Automating repetitive outreach',
                desc: 'Discover how AI handles first-touch calls, SMS reminders, and email sequences across Calls, SMS, and email - freeing your collectors for conversations that require a human.',
              },
            ].map(({ label, title, desc }) => (
              <div key={label} className="rounded-2xl p-7 shadow-sm" style={{ background: '#F4F6FB', border: '0.5px solid rgba(0,0,0,0.07)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#1A237E' }}>{label}</p>
                <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REALITY CHECK ── */}
      <section className="py-20" style={{ background: '#010C20' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#03D2FC' }}>The real problem</p>
            <h2 className="text-3xl font-bold text-white leading-tight">Your team is working hard.<br />The system is working against them.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { tag: 'Right-Party Contact', title: 'Calling at the wrong time, every time', desc: "Without predictive timing, you're burning attempts on voicemails instead of live conversations." },
              { tag: 'Promise-to-Pay', title: 'Promises made. Promises forgotten.', desc: 'No automated follow-up means broken PTPs die in call notes nobody reads in time. Revenue walks.' },
              { tag: 'Recovery Rate', title: 'Every account gets the same treatment', desc: 'Without prioritization, your best collectors waste hours on low-value accounts while high-likelihood ones go cold.' },
            ].map(({ tag, title, desc }) => (
              <div key={tag} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                <p className="text-xs font-semibold mb-2.5 flex items-center gap-1.5" style={{ color: '#DD39F9' }}>&#9888; {tag}</p>
                <h3 className="text-sm font-semibold text-white mb-2 leading-snug">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUTCOMES ── */}
      <section className="py-20" style={{ background: '#F4F6FB' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#1A237E' }}>What you'll walk away with</p>
            <h2 className="text-3xl font-bold text-slate-900 leading-tight">This is a working session. Not a lecture.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { num: 'Takeaway 01', title: "Clarity on where your agency leaks revenue", desc: "Walk through the most common collection workflow gaps - RPC, PTP, prioritization, manual follow-up - and identify which ones apply to your agency." },
              { num: 'Takeaway 02', title: 'Concrete AI use cases ranked by impact', desc: 'Not a list of everything AI can do. The specific applications most likely to move the needle for a small to mid-size agency - and in what order to tackle them.' },
              { num: 'Takeaway 03', title: 'A live demo built around real workflows', desc: "See how DROS handles outbound calls, PTP follow-ups, SMS reminders, and account prioritization - narrated as a real scenario, not a feature tour." },
              { num: 'Takeaway 04', title: 'A realistic starting point you can actually act on', desc: 'What to do first and in what order - designed for agencies without a dedicated IT team or a large implementation budget.' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="bg-white rounded-2xl p-7 shadow-sm" style={{ border: '0.5px solid rgba(0,0,0,0.07)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#1A237E' }}>{num}</p>
                <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="py-20" style={{ background: '#F4F6FB' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#1A237E' }}>Who this is for</p>
            <h2 className="text-3xl font-bold text-slate-900 leading-tight mb-3">Built for collection agency operators.</h2>
            <p className="text-sm text-slate-500 max-w-xl">Every example, every use case, every demo is built around running a 10-50 person collection agency - not a generic AI overview.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {[
              { title: 'Agency owners who want to scale without adding headcount', desc: "You're at capacity. You need the same team to handle more accounts - consistently and without burning them out." },
              { title: 'Operations managers losing revenue to manual gaps', desc: 'Broken PTPs, missed callbacks, collectors working from memory. You know the leaks exist. This session helps you close them.' },
              { title: 'Leaders frustrated by inconsistent collector performance', desc: 'Your best and worst collectors produce completely different results. You want the floor raised - AI follow-up and prioritization does that.' },
              { title: 'Anyone AI-curious but unsure where to start', desc: "You've heard about AI for collections but implementation still feels out of reach. This session is designed to close that gap." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-3.5 bg-white rounded-2xl p-5 shadow-sm" style={{ border: '0.5px solid rgba(0,0,0,0.07)' }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs" style={{ background: 'linear-gradient(135deg, rgba(221,57,249,0.1), rgba(3,210,252,0.1))', border: '0.5px solid rgba(3,210,252,0.2)' }}>&#10003;</div>
                <div>
                  <strong className="block text-sm font-semibold text-slate-900 mb-1">{title}</strong>
                  <span className="text-sm text-slate-500 leading-relaxed">{desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 flex items-start gap-3.5 shadow-sm" style={{ border: '0.5px solid rgba(0,0,0,0.07)' }}>
            <span className="text-base mt-0.5 flex-shrink-0">&#8505;&#65039;</span>
            <p className="text-sm text-slate-500 leading-relaxed"><strong className="text-slate-900">Not for you if</strong> you're looking for a passive keynote or a surface-level overview of what AI is. This is a practical working session - you'll be participating and leaving with something concrete.</p>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-24 text-center relative overflow-hidden" style={{ background: '#010C20' }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(221,57,249,0.1) 0%, transparent 65%)' }} />
        </div>
        <div className="relative max-w-2xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#03D2FC' }}>June 4, 2026 - Free - 2 Hours</p>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">Stop losing revenue<br />to gaps you can close.</h2>
          <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>Educational, practical, and focused on real collection workflows - not just AI theory.</p>
          <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 px-11 py-5 rounded-full font-semibold text-white text-base transition-transform hover:-translate-y-0.5"
                style={{ ...gradBg, boxShadow: '0 0 50px rgba(221,57,249,0.28)' }}
              >
                Watch the Recording &darr;
              </button>
              <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.25)' }}>Free access - Full workshop recording</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
