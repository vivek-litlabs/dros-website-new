'use client';
import { useEffect } from 'react';
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
  // Cross-page navigation can arrive with a section to scroll to, written by
  // Navbar into sessionStorage before it navigates here.
  useEffect(() => {
    let scrollTo: string | null = null;
    try {
      scrollTo = sessionStorage.getItem('pending-scroll-id');
      if (scrollTo) sessionStorage.removeItem('pending-scroll-id');
    } catch { /* sessionStorage unavailable (private mode); no pending scroll to honour */ }
    if (!scrollTo) return;
    const navHeight = 80;
    const attempt = (retries: number) => {
      const el = document.getElementById(scrollTo as string);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      } else if (retries > 0) {
        setTimeout(() => attempt(retries - 1), 100);
      }
    };
    setTimeout(() => attempt(5), 50);
  }, []);

  return (
    <div className="min-h-screen bg-base text-ink">
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
