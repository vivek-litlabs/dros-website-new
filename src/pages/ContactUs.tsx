export const route = '/contact';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Footer from './Footer';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import ResourceHero from '../components/ResourceHero';
import { Section, Container, Button } from '../components/ui';
import Reveal, { RevealItem } from '../components/Reveal';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Helmet>
        <title>Contact DROS | Get in Touch</title>
        <meta name="description" content="Have questions about DROS? Contact our team to learn more about AI-native collections workflows, product fit, and next steps." />
        <meta property="og:title" content="Contact DROS | Get in Touch" />
        <meta property="og:description" content="Have questions about DROS? Contact our team to learn more about AI-native collections workflows, product fit, and next steps." />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/contact" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
      </Helmet>
      <Navbar transparent />

      <ResourceHero
        image="/resources/contact-hero.jpg"
        badge="Get in touch"
        headingLines={["Let's talk about", 'your collections stack']}
        subtext="Have questions about DROS? We're here to help. Reach out to our team and we'll get back to you as soon as possible."
        cta={
          <Button variant="primary" size="lg" to="/book-meeting">
            Book a demo
          </Button>
        }
      />

      {/* Contact cards */}
      <Section tone="light" spacing="lg">
        <Container>
          <Reveal stagger={0.08} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <RevealItem>
              <div className="h-full rounded-card border border-line-dark bg-white p-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-2 text-[17px] font-semibold text-ink-dark">Email Us</h3>
                <p className="mb-4 text-[15px] leading-relaxed text-ink-grey">
                  Send us an email and we'll respond within 24 hours.
                </p>
                <a
                  href="mailto:contact@dros.ai"
                  className="text-sm font-semibold text-ink-dark transition-colors hover:text-accent"
                >
                  contact@dros.ai
                </a>
              </div>
            </RevealItem>

            <RevealItem>
              <div className="h-full rounded-card border border-line-dark bg-white p-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-2 text-[17px] font-semibold text-ink-dark">Call Us</h3>
                <p className="mb-4 text-[15px] leading-relaxed text-ink-grey">
                  Speak directly with our team during business hours.
                </p>
                <a
                  href="tel:+13026272108"
                  className="text-sm font-semibold text-ink-dark transition-colors hover:text-accent"
                >
                  +1 (302) 627-2108
                </a>
              </div>
            </RevealItem>

            <RevealItem>
              <div className="h-full rounded-card border border-line-dark bg-white p-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-2 text-[17px] font-semibold text-ink-dark">Business Hours</h3>
                <div className="space-y-1.5">
                  <p className="text-[15px] text-ink-dark/80">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  <p className="text-sm text-ink-grey">We typically respond within 1 business day</p>
                </div>
              </div>
            </RevealItem>

            <RevealItem>
              <div className="h-full rounded-card border border-line-dark bg-white p-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-2 text-[17px] font-semibold text-ink-dark">Location</h3>
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-accent">US Offices</p>
                    <p className="text-[15px] text-ink-dark/80">1592 Union St #473</p>
                    <p className="text-[15px] text-ink-dark/80">San Francisco, CA 94123</p>
                  </div>
                  <p className="text-[15px] text-ink-dark/80">Delaware</p>
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-accent">Dev Center</p>
                    <p className="text-[15px] text-ink-dark/80">Bengaluru, India</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-ink-grey">Serving agencies nationwide</p>
              </div>
            </RevealItem>
          </Reveal>

          <div className="mt-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Ready to See DROS in Action?</h2>
            <p className="mb-6 text-xl leading-relaxed text-slate-600">
              Schedule a personalized demo to see how DROS can transform your debt collection operations.
            </p>
            <a
              href="https://dros.ai/book-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all hover:scale-105"
              style={{ background: '#03D2FC', color: '#010C20' }}
            >
              Schedule a Demo
            </a>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
