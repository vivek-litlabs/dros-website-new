export const route = '/';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import type Lenis from 'lenis';
import Navbar from './Navbar';
import Footer from './Footer';
import Hero from '../components/home/Hero';
import MeetYourAgent from '../components/home/MeetYourAgent';
import WhoIsItFor from '../components/home/WhoIsItFor';
import HowItWorks from '../components/home/HowItWorks';
import Features from '../components/home/Features';
import Compliance from '../components/home/Compliance';
import SocialProof from '../components/home/SocialProof';
import Pricing from '../components/home/Pricing';
import DemoWidget from '../components/home/DemoWidget';
import PostCTA from '../components/home/PostCTA';

export default function App() {
  const location = useLocation();

  // Cross-page navigation can arrive with a section to scroll to.
  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!scrollTo) return;
    const navHeight = 80;
    const attempt = (retries: number) => {
      const el = document.getElementById(scrollTo);
      if (el) {
        const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
        if (lenis) {
          lenis.scrollTo(el, { offset: -navHeight });
        } else {
          const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } else if (retries > 0) {
        setTimeout(() => attempt(retries - 1), 100);
      }
    };
    setTimeout(() => attempt(5), 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-base text-ink">
      <Helmet>
        <title>AI Agents for Collections | DROS AI</title>
        <meta name="description" content="DROS is an AI-native engagement OS for collections that helps teams recover more with context-aware AI, compliant workflows, and less manual follow-up." />
        <meta property="og:title" content="AI Agents for Collections | DROS AI" />
        <meta property="og:description" content="DROS is an AI-native engagement OS for collections that helps teams recover more with context-aware AI, compliant workflows, and less manual follow-up." />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://dros.ai",
              "name": "Dros AI",
              "url": "https://dros.ai",
              "logo": "https://dros.ai/dros_logo_square.png",
              "sameAs": [
                "https://www.linkedin.com/company/dros",
                "https://www.youtube.com/@drosdotai"
              ]
            },
            {
              "@type": "SoftwareApplication",
              "name": "Dros AI Engagement OS",
              "operatingSystem": "Web",
              "applicationCategory": "BusinessApplication",
              "description": "AI-native engagement OS for debt collections. Automate outreach, improve recovery rates, and manage compliance with intelligent AI agents.",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
              "author": { "@id": "https://dros.ai" }
            }
          ]
        })}</script>
      </Helmet>

      <Navbar transparent />

      <main>
        <Hero />
        <WhoIsItFor />
        <MeetYourAgent />
        <HowItWorks />
        <Features />
        <Compliance />
        <SocialProof />
        <Pricing />
        <DemoWidget />
        <PostCTA />
      </main>

      <Footer />
    </div>
  );
}
