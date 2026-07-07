export const route = '/newsroom';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import Footer from './Footer';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import Reveal, { RevealItem } from '../components/Reveal';
import { BlogCtaBand } from './BlogShared';

type Category = 'All' | 'Press Releases' | 'Featured In';

interface NewsItem {
  id: string;
  category: 'Press Releases' | 'Featured In';
  title: string;
  excerpt: string;
  source: string;
  date: string;
  url: string;
  featured?: boolean;
}

const newsItems: NewsItem[] = [
  {
    id: 'introducing-dros-ai-press-release',
    category: 'Press Releases',
    title: 'Introducing DROS.ai: Reinventing Debt Recovery Through Intelligent Engagement',
    excerpt: 'DROS.ai launches as an AI-powered engagement platform for collection agencies and debt recovery teams, unifying debtor outreach, account management, and workflow automation across voice, SMS, email, and chat to improve contact rates and payment conversions.',
    source: 'PR Newswire',
    date: 'April 27, 2026',
    url: 'https://www.prnewswire.com/news-releases/introducing-drosai-reinventing-debt-recovery-through-intelligent-engagement-302753263.html',
    featured: true,
  },
  {
    id: 'dealroom-dros-ai-launch',
    category: 'Featured In',
    title: 'DROS.ai Launches AI-Powered Debt Recovery Platform to Unify Collection Workflows',
    excerpt: 'Dealroom.co covers the launch of DROS.ai, highlighting its AI-powered platform designed to unify and streamline debt collection workflows for agencies and recovery teams.',
    source: 'Dealroom',
    date: 'April 2026',
    url: 'https://app.dealroom.co/news/feed/dros-ai-launches-ai-powered-debt-recovery-platform-to-unify-collection-workflows',
  },
  {
    id: 'ainvest-dros-ai-inflection-point',
    category: 'Featured In',
    title: 'DROS.ai Faces Inflection Point to Overcome Legacy Inertia and Capture AI Debt Collection Curve',
    excerpt: 'AInvest examines the pivotal challenge facing DROS.ai as it works to displace entrenched legacy systems and position itself at the forefront of the AI-driven debt collection market.',
    source: 'AInvest',
    date: 'April 2026',
    url: 'https://www.ainvest.com/news/dros-ai-faces-inflection-point-overcome-legacy-inertia-capture-ai-debt-collection-curve-2604/',
  },
  {
    id: 'briefglance-ai-overhauls-debt-collection',
    category: 'Featured In',
    title: 'AI Overhauls Debt Collection - Turning Days of Work into Minutes',
    excerpt: 'BriefGlance covers how AI is transforming debt collection operations, highlighting how platforms like DROS are compressing days of manual work into minutes through intelligent automation.',
    source: 'BriefGlance',
    date: 'May 2026',
    url: 'https://briefglance.com/articles/ai-overhauls-debt-collection-turning-days-of-work-into-minutes',
  },
];

const categories: Category[] = ['All', 'Press Releases', 'Featured In'];

export default function NewsroomPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const sortedItems = [...newsItems].sort((a, b) => {
    const indexA = newsItems.indexOf(a);
    const indexB = newsItems.indexOf(b);
    return indexB - indexA;
  });

  const filtered = sortedItems.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Newsroom | DROS Press Releases and Coverage</title>
        <meta name="description" content="Press releases, external coverage, and official announcements around DROS." />
        <meta property="og:title" content="Newsroom | DROS Press Releases and Coverage" />
        <meta property="og:description" content="Press releases, external coverage, and official announcements around DROS." />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/newsroom" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
      </Helmet>
      <Navbar />

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-32 sm:px-10 md:pt-36 lg:px-[60px]">

        {/* Section header */}
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="font-saans text-[32px] font-light leading-[1.15] tracking-[-0.04em] text-black">
            Newsroom
          </h1>
          <p className="text-[17px] text-[#393939]">
            Press releases, external coverage, and official announcements around DROS.
          </p>
        </div>

        {/* Category pills */}
        <div className="mb-12 flex flex-wrap items-center gap-2.5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors duration-150 ${
                activeCategory === category
                  ? 'bg-[#F5F5F5] text-black'
                  : 'bg-transparent text-[#777777] hover:text-black'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg text-[#777]">No items in this category yet.</p>
          </div>
        ) : (
          <Reveal stagger={0.06} className="grid grid-cols-1 gap-x-[30px] gap-y-[50px] sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <RevealItem key={item.id}>
                <NewsCard item={item} />
              </RevealItem>
            ))}
          </Reveal>
        )}
      </div>

      <BlogCtaBand />

      <Footer />
    </div>
  );
}

const SOURCE_LOGOS: Record<string, string> = {
  'PR Newswire': '/LIGHT_PRNewswire_By-Cision_Stacked.svg',
  'Dealroom': '/images.png',
  'AInvest': '/images_(1).png',
  'BriefGlance': '/briefglance_logo.png',
};

function NewsCard({ item }: { item: NewsItem }) {
  const logoSrc = SOURCE_LOGOS[item.source];

  const content = (
    <div className="group flex h-full flex-col">
      <div className="flex h-28 items-center justify-center rounded-lg border border-[#EDEDED] bg-[#FAFAFA] px-6">
        {logoSrc ? (
          <img loading="lazy" decoding="async" src={logoSrc} alt={item.source} className="max-h-14 max-w-full object-contain mix-blend-multiply" />
        ) : (
          <span className="text-sm font-medium text-[#777]">{item.source}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 pl-2 pt-5">
        <span className="text-sm text-black/40">{item.category} · {item.date}</span>
        <h3 className="line-clamp-2 font-saans text-xl font-light leading-[1.15] tracking-[-0.03em] text-black md:text-[22px]">
          {item.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-[15px] leading-relaxed text-black/60">
          {item.excerpt}
        </p>
        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-black">
          {item.source}
          <ExternalLink className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );

  if (item.url.startsWith('http')) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    );
  }
  return (
    <Link to={item.url} className="block h-full">
      {content}
    </Link>
  );
}
