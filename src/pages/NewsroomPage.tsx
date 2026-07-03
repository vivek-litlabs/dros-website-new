export const route = '/newsroom';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import Footer from './Footer';
import { Helmet } from 'react-helmet-async';
import { trackCta } from '../lib/analytics';
import Navbar from './Navbar';

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
    <div className="min-h-screen bg-slate-950 text-white">
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

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-slate-950 to-blue-950/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Newsroom
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
            Press releases, external coverage, and official announcements around DROS.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="bg-[#F3F8FC] border-b border-[#DAEAF5] sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex gap-1.5 py-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-white text-slate-600 border border-[#DAEAF5] hover:bg-[#EAF4FB] hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="bg-[#F3F8FC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#4F647A] text-lg">No items in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>

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
    <div
      className="group h-full flex flex-col rounded-3xl transition-all duration-200"
      style={{
        padding: '1px',
        background: 'linear-gradient(135deg, rgba(103,210,234,0.38) 0%, rgba(147,197,220,0.18) 40%, rgba(103,210,234,0.28) 100%)',
        boxShadow: '0 8px 36px 0 rgba(14,42,71,0.11), 0 2px 8px 0 rgba(14,42,71,0.07)',
      }}
    >
      <div className="h-full flex flex-col rounded-3xl overflow-hidden" style={{ background: '#F3F8FC' }}>
        {/* Source logo area */}
        <div
          className="flex items-center justify-center h-28 border-b px-6"
          style={{
            background: 'rgba(255,255,255,0.75)',
            borderColor: 'rgba(186,222,243,0.5)',
          }}
        >
          {logoSrc ? (
            <img loading="lazy" decoding="async" src={logoSrc} alt={item.source} className="max-h-14 max-w-full object-contain mix-blend-multiply" />
          ) : (
            <span className="text-[#4F647A] text-base font-semibold text-center leading-snug">
              {item.source}
            </span>
          )}
        </div>
        <div className="flex-1 flex flex-col p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-cyan-50 text-cyan-600 border border-cyan-200">
              {item.category}
            </span>
            <span className="text-[#7A95AB] text-xs">{item.date}</span>
          </div>
          <h3 className="text-[#0A1A2F] font-bold text-lg leading-snug mb-3 group-hover:text-cyan-700 transition-colors duration-200">
            {item.title}
          </h3>
          <p className="text-[#4F647A] text-sm leading-relaxed flex-1 mb-6">
            {item.excerpt}
          </p>
          <div className="flex items-center gap-1.5 text-cyan-600 text-sm font-semibold mt-auto">
            <span>{item.source}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>
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
