export const route = '/events/armtech-rmai-2026';
import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  BarChart3,
  Users,
  Phone,
  Clock,
  Activity,
  FileText,
  Play,
  Code,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';

function EventsPage() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Helmet>
        <title>Events | DROS</title>
        <meta name="description" content="Explore upcoming and past events where DROS showcases modern collections workflows and AI-driven engagement." />
      </Helmet>
      <Navbar />

      {/* Event Badge */}
      <div className="pt-20 bg-gradient-to-r from-blue-900 to-blue-800 border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center">
          <div className="inline-flex items-center gap-3 bg-blue-950 text-cyan-400 px-6 py-3 rounded-full border border-cyan-500/30">
            <span className="text-sm font-bold">📍 Let's meet at ARMTech Dallas & RMAI Las Vegas 2026</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-slate-950 to-blue-950/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Modern Collections Infrastructure
            <br />
            <span style={{ background: 'linear-gradient(135deg, #DD39F9, #03D2FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              for Agencies & Debt Buyers
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-4xl mx-auto leading-relaxed">
            DROS centralizes your recovery workflows. Vodex powers compliant Voice AI conversations at scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://dros.ai/book-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2" style={{ background: '#03D2FC', color: '#010C20' }}
            >
              Book a Meeting
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              onClick={() => setShowVideo(true)}
              className="border border-slate-700 hover:border-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:bg-slate-900 flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/"
              className="bg-slate-950 border border-slate-800 rounded-2xl p-8 hover:border-cyan-500 transition-all group"
            >
              <BarChart3 className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Explore DROS Platform</h3>
              <p className="text-slate-400">AI-native collections CRM for agencies</p>
            </Link>
            <a
              href="https://vodex.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-950 border border-slate-800 rounded-2xl p-8 hover:border-cyan-500 transition-all group"
            >
              <Phone className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Voice AI for Collections</h3>
              <p className="text-slate-400">Compliant Voice AI powered by Vodex</p>
            </a>
            <a
              href="https://dros.ai/book-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-950 border border-slate-800 rounded-2xl p-8 hover:border-cyan-500 transition-all group"
            >
              <Users className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Meet the Team</h3>
              <p className="text-slate-400">Connect with us at the events</p>
            </a>
          </div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Complete <span className="text-cyan-400">Collections Stack</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Two products, one mission: Transform debt collection with AI-powered workflows and voice automation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cyan-900/20 to-slate-900/20 border border-cyan-500/30 rounded-2xl p-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-full mb-6">
                <img loading="lazy" decoding="async" src="/dros_logo_square.png" alt="DROS" className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold mb-4">DROS</h3>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                AI-native collections CRM for account management, debtor workflows, and operational control.
              </p>
              <ul className="space-y-3">
                {[
                  'Centralized account management',
                  'AI-powered prioritization',
                  'Real-time compliance monitoring',
                  'Performance analytics dashboard',
                  'Team collaboration tools'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-slate-900/20 border border-blue-500/30 rounded-2xl p-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-6">
                <img loading="lazy" decoding="async" src="/base_icon_transparent_background.png" alt="Vodex" className="w-10 h-10 object-contain" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Vodex</h3>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                API-first Voice AI agents that automate compliant debtor conversations: reminders, PTP capture, disputes, and more.
              </p>
              <ul className="space-y-3">
                {[
                  'Human-like voice conversations',
                  'FDCPA/TCPA compliant by design',
                  'Real-time debtor engagement',
                  'Automated PTP capture',
                  'Seamless CRM integration'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Built DROS */}
      <section className="py-32 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why We Built <span className="text-cyan-400">DROS</span>
          </h2>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12">
            <p className="text-xl text-slate-300 leading-relaxed mb-6">
              Debt collection platforms today are fragmented and manual. DROS was built to give agencies and debt buyers a single, AI-native system for managing accounts, automating workflows, and scaling outreach.
            </p>
            <p className="text-xl text-slate-300 leading-relaxed">
              And when you're ready to add Voice AI, Vodex integrates directly, so your platform can engage customers, not just track them.
            </p>
          </div>
        </div>
      </section>

      {/* Core Workflows */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Core Collections <span className="text-cyan-400">Workflows Powered</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Real-world use cases enabled by DROS + Vodex working together
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Payment Reminders',
                description: 'Automated due-date + overdue calling'
              },
              {
                icon: <CheckCircle2 className="w-8 h-8" />,
                title: 'Promise-to-Pay Capture',
                description: 'Confirms commitment and logs it automatically'
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Payment Negotiation',
                description: 'Offers plans, settlements, extensions'
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: 'Dispute Handling',
                description: 'Routes and records borrower disputes'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Right-Party Contact',
                description: 'Compliant identity verification'
              },
              {
                icon: <Activity className="w-8 h-8" />,
                title: 'Real-Time Syncing',
                description: 'All interactions logged and synced instantly'
              }
            ].map((workflow, index) => (
              <div
                key={index}
                className="bg-slate-950 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
              >
                <div className="text-cyan-400 mb-4">
                  {workflow.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{workflow.title}</h3>
                <p className="text-slate-400">{workflow.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className="py-32 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Integration & <span className="text-cyan-400">Compatibility</span>
              </h2>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                Vodex fits seamlessly into your existing technology stack
              </p>
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Code className="w-6 h-6 text-cyan-400" />
                    Works with your stack
                  </h3>
                  <p className="text-slate-300">
                    Dialers • SIP trunks • CRMs • Collection platforms
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-cyan-400" />
                    What it enables
                  </h3>
                  <p className="text-slate-300">
                    Outbound automation • Inbound resolution • Real-time syncing
                  </p>
                </div>
              </div>
              <a
                href="https://vodex.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                View API Documentation
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8">
              <div className="space-y-4">
                {[
                  'RESTful API',
                  'WebSocket support',
                  'Webhook notifications',
                  'OAuth 2.0 authentication',
                  'Real-time event streaming',
                  'Comprehensive SDKs'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-slate-900 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                    <span className="text-slate-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Founders */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About the <span className="text-cyan-400">Founders</span>
          </h2>
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-12 border border-cyan-500/30">
            <h3 className="text-2xl font-bold mb-4">Anshul Shrivastava</h3>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              Founders of Vodex.ai and creators of DROS, building compliant Voice AI and collections infrastructure for modern debt collection agencies and debt buyers.
            </p>
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <div className="text-base">
                <a href="mailto:anshul@vodex.ai" className="text-cyan-400 hover:text-cyan-300 transition-colors">anshul@vodex.ai</a>
                {' / '}
                <a href="mailto:anshul@dros.ai" className="text-cyan-400 hover:text-cyan-300 transition-colors">anshul@dros.ai</a>
              </div>
              <div className="text-base">
                <a href="tel:+13026272108" className="text-cyan-400 hover:text-cyan-300 transition-colors">+1 (302) 627-2108</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proven Impact */}
      <section className="py-32 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Proven <span className="text-cyan-400">Impact</span>
            </h2>
            <p className="text-xl text-slate-400">
              Real results from agencies using DROS + Vodex
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                value: '76%',
                label: 'Debt recovery in 30 days',
                icon: <BarChart3 className="w-8 h-8" />
              },
              {
                value: '70%+',
                label: 'Cost reduction',
                icon: <Activity className="w-8 h-8" />
              },
              {
                value: '0',
                label: 'Compliance violations reported',
                icon: <Shield className="w-8 h-8" />
              },
              {
                value: '100K+',
                label: 'Calls/day enabled',
                icon: <Phone className="w-8 h-8" />
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center hover:border-cyan-500/50 transition-all"
              >
                <div className="text-cyan-400 flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-12 border border-cyan-500/30 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to See How This <span className="text-cyan-400">Fits Your Platform?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Let's connect at ARMTech Dallas or RMAI Las Vegas 2026
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://dros.ai/book-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2" style={{ background: '#03D2FC', color: '#010C20' }}
              >
                Book a Meeting
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://dros.ai/book-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-700 hover:border-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:bg-slate-900"
              >
                Connect at RMAI 2026
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img loading="lazy" decoding="async" src="/untitled_logo_1_basic-file.png" alt="DROS Logo" className="w-8 h-8" />
                <span className="text-xl font-bold">DROS</span>
              </div>
              <p className="text-slate-400 text-sm">
                The operating system for modern debt collection agencies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">DROS Platform</Link></li>
                <li><a href="https://vodex.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Vodex Voice AI</a></li>
                <li><a href="https://dros.ai/book-meeting" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Book Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/blogs" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2024 DROS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors"
              aria-label="Close video"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://www.youtube.com/embed/vrX1bM7XHb8"
                title="Getting Started with DROS | Account Creation and Setup | DROS.ai"
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventsPage;
