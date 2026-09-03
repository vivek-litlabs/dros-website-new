export const route = '/events';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import Footer from './Footer';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import Reveal, { RevealItem } from '../components/Reveal';
import ResourceHero from '../components/ResourceHero';
import { BlogCtaBand } from './BlogShared';

interface Event {
  title: string;
  location: string;
  date: string;
  slug: string;
  description: string;
}

const upcomingEvents: Event[] = [
  {
    title: 'ACA Annual Convention 2026',
    location: 'Orlando, FL',
    date: 'Jul 22 - 24, 2026',
    slug: '/events/2026/aca-orlando',
    description: 'Join us at the ACA Annual Convention in Orlando to explore how DROS and Vodex are revolutionizing debt collection with cutting-edge AI technology and compliant voice automation.'
  }
];

const pastEvents: Event[] = [
  {
    title: 'ARMTech Dallas 2026',
    location: 'Dallas, TX',
    date: 'Jan 21 - 23, 2026',
    slug: '/events/2026/armtech-dallas',
    description: 'Join us at ARMTech Dallas to discover how DROS and Vodex are transforming debt collection with AI-powered workflows and voice automation.'
  },
  {
    title: 'RMAI Las Vegas 2026',
    location: 'Las Vegas, NV',
    date: 'Feb 9 - 12, 2026',
    slug: '/events/2026/rmai-las-vegas',
    description: 'Meet the DROS team at RMAI Las Vegas. Learn about our AI-native collections CRM and compliant Voice AI solutions for modern agencies.'
  }
];

export default function EventsListingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Events | Meet DROS at Collections Conferences</title>
        <meta name="description" content="Meet us at industry conferences and discover how DROS is transforming debt collection." />
      </Helmet>
      <Navbar transparent />

      <ResourceHero
        image="/resources/events-hero.jpg"
        badge="Events"
        headingLines={["Meet us at the industry's", 'biggest events']}
        subtext="Meet us at industry conferences and discover how DROS is transforming debt collection."
      />

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-16 sm:px-10 lg:px-[60px]">

        <div className="mb-16">
          <h2 className="mb-6 font-saans text-xl font-light tracking-[-0.03em] text-black">Upcoming Events</h2>
          <Reveal stagger={0.06} className="flex flex-col divide-y divide-[#EDEDED]">
            {upcomingEvents.map((event) => (
              <RevealItem key={event.slug}>
                <EventRow event={event} />
              </RevealItem>
            ))}
          </Reveal>
        </div>

        <div>
          <h2 className="mb-6 font-saans text-xl font-light tracking-[-0.03em] text-black">Past Events</h2>
          <Reveal stagger={0.06} className="flex flex-col divide-y divide-[#EDEDED]">
            {pastEvents.map((event) => (
              <RevealItem key={event.slug}>
                <EventRow event={event} muted />
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>

      <BlogCtaBand />

      <Footer />
    </div>
  );
}

function EventRow({ event, muted = false }: { event: Event; muted?: boolean }) {
  return (
    <Link to={event.slug} className="group flex flex-col gap-3 py-8">
      <h3 className={`font-saans text-xl font-light leading-[1.15] tracking-[-0.03em] transition-colors md:text-[22px] ${muted ? 'text-black/70 group-hover:text-black' : 'text-black'}`}>
        {event.title}
      </h3>
      <div className="flex flex-wrap items-center gap-4 text-sm text-black/40">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {event.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {event.date}
        </span>
      </div>
      <p className="max-w-2xl text-[15px] leading-relaxed text-black/60">
        {event.description}
      </p>
      <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-black">
        {muted ? 'View details' : 'Learn more'}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
