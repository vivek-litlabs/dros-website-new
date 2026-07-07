export const route = '/customer-stories';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Building2 } from 'lucide-react';
import Footer from './Footer';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import Reveal, { RevealItem } from '../components/Reveal';
import { BlogCtaBand } from './BlogShared';

interface CustomerStory {
  title: string;
  description: string;
  segment: string;
  region: string;
  slug: string;
}

const stories: CustomerStory[] = [
  {
    title: 'How a Utah-Based Consumer Finance Company Replaced Manual Outbound With a Self-Running AI Operation with DROS',
    description: 'A story about automating 15,000 daily outbound calls across loan prequalification, 1st party collections, and payment reminders - without adding headcount.',
    segment: '1st Party Collections',
    region: 'Utah, United States',
    slug: '/customer-stories/utah-consumer-finance',
  },
  {
    title: 'How Greystone & Associates Simplified Daily Collections and Reduced Operational Friction with DROS',
    description: 'A customer story on faster account onboarding, real-time visibility, and simpler day-to-day collections workflows.',
    segment: 'Third-Party Collections',
    region: 'United States',
    slug: '/customer-stories/greystone-associates',
  },
];

export default function CustomerStoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Customer Stories | DROS in Collections Operations</title>
        <meta name="description" content="See how collection teams use DROS to simplify operations, improve visibility, and modernize recovery workflows." />
        <meta property="og:title" content="Customer Stories | DROS in Collections Operations" />
        <meta property="og:description" content="See how collection teams use DROS to simplify operations, improve visibility, and modernize recovery workflows." />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/customer-stories" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
      </Helmet>
      <Navbar />

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-32 sm:px-10 md:pt-36 lg:px-[60px]">

        {/* Section header */}
        <div className="mb-12 flex flex-col gap-1">
          <h1 className="font-saans text-[32px] font-light leading-[1.15] tracking-[-0.04em] text-black">
            Customer Stories
          </h1>
          <p className="text-[17px] text-[#393939]">
            See how collection teams use DROS to simplify operations, improve visibility, and modernize recovery workflows.
          </p>
        </div>

        <Reveal stagger={0.06} className="grid grid-cols-1 gap-x-[60px] gap-y-[50px] md:grid-cols-2">
          {stories.map((story) => (
            <RevealItem key={story.slug}>
              <Link to={story.slug} className="group flex h-full flex-col gap-4 border-t border-[#EDEDED] pt-6">
                <h2 className="line-clamp-3 font-saans text-xl font-light leading-[1.15] tracking-[-0.03em] text-black md:text-[22px]">
                  {story.title}
                </h2>
                <p className="flex-1 text-[15px] leading-relaxed text-black/60">
                  {story.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-black/40">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {story.segment}
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {story.region}
                  </span>
                </div>
                <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-black">
                  Read story
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </Reveal>
      </div>

      <BlogCtaBand />

      <Footer />
    </div>
  );
}
