export const route = '/webinars';
import { ArrowRight, Calendar, Clock, Monitor } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { trackCta } from '../lib/analytics';
import Navbar from './Navbar';
import Footer from './Footer';
import Reveal, { RevealItem } from '../components/Reveal';
import ResourceHero from '../components/ResourceHero';
import { BlogCtaBand } from './BlogShared';

const PAST_WEBINARS = [
  {
    title: 'The Collections AI Workshop: Improve RPC, PTP and Recovery Without Adding Headcount',
    presenter: 'Anshul Shrivastava',
    presenterTitle: 'CEO, Vodex.ai',
    date: 'Thursday, June 4, 2026',
    time: '12 PM EST / 11 AM CST / 9 AM PST',
    duration: '2 Hours',
    detailsHref: '/collections-ai-workshop',
    badge: 'Workshop Webinar',
  },
];

function WebinarCard({ w }: { w: typeof PAST_WEBINARS[0] }) {
  return (
    <div className="group flex h-full flex-col gap-4 pl-2 pt-5">
      <span className="w-fit rounded-full border border-[#EDEDED] px-3 py-1 text-xs font-medium text-[#777]">
        {w.badge}
      </span>
      <h3 className="line-clamp-2 font-saans text-xl font-light leading-[1.15] tracking-[-0.03em] text-black md:text-[22px]">
        {w.title}
      </h3>
      <div className="flex flex-col gap-1.5 text-sm text-black/50">
        <span className="inline-flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5" />
          {w.date}
        </span>
        <span className="inline-flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" />
          {w.time}
        </span>
        <span className="inline-flex items-center gap-2">
          <Monitor className="h-3.5 w-3.5" />
          {w.duration}
        </span>
      </div>
      <div className="flex items-center gap-3 border-t border-[#EDEDED] pt-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5] text-xs font-semibold text-black">
          {w.presenter.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="text-sm font-medium text-black">{w.presenter}</p>
          <p className="text-xs text-black/40">{w.presenterTitle}</p>
        </div>
      </div>
      <Link
        to={w.detailsHref}
        onClick={() => trackCta('webinars_view_details')}
        className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-black"
      >
        View Details
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

export default function WebinarsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Webinars | DROS</title>
        <meta name="description" content="Live sessions on AI technology, collections strategy, and what's actually working in the field." />
        <link rel="canonical" href="https://dros.ai/webinars" />
        <meta property="og:title" content="Webinars | DROS" />
        <meta property="og:description" content="Live sessions on AI technology, collections strategy, and what's actually working in the field." />
        <meta property="og:url" content="https://dros.ai/webinars" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Navbar transparent />

      <ResourceHero
        image="/resources/webinars-hero.jpg"
        badge="Webinars"
        headingLines={['Live sessions on', 'collections and AI']}
        subtext="Live sessions on AI technology, collections strategy, and what's actually working in the field."
      />

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-16 sm:px-10 lg:px-[60px]">

        <div className="mb-16">
          <h2 className="mb-6 font-saans text-xl font-light tracking-[-0.03em] text-black">Upcoming Webinars</h2>
          <p className="text-[15px] text-black/50">No upcoming webinars scheduled. Check back soon.</p>
        </div>

        <div>
          <h2 className="mb-6 font-saans text-xl font-light tracking-[-0.03em] text-black">Past Webinars</h2>
          <Reveal stagger={0.06} className="grid grid-cols-1 gap-x-[30px] gap-y-[50px] sm:grid-cols-2 lg:grid-cols-3">
            {PAST_WEBINARS.map((w) => (
              <RevealItem key={w.title}>
                <WebinarCard w={w} />
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
