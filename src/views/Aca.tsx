'use client';
import Navbar from './Navbar';
import Footer from './Footer';
import HeroAca from '../components/home/aca/HeroAca';
import ExclusiveOffer from '../components/home/aca/ExclusiveOffer';
import PickUseCase from '../components/home/aca/PickUseCase';
import StatsRow from '../components/home/aca/StatsRow';
import Testimonials from '../components/home/aca/Testimonials';
import TrustBar from '../components/home/aca/TrustBar';
import Walkthrough from '../components/home/aca/Walkthrough';
import InfoCards from '../components/home/aca/InfoCards';

export default function Aca() {
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
        <HeroAca />
        <ExclusiveOffer />
        <PickUseCase />
        <StatsRow />
        <Testimonials />
        <TrustBar />
        <Walkthrough />
        <InfoCards />
      </main>

      <Footer />
    </div>
  );
}
