export const route = '/resources/videos';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import Reveal, { RevealItem } from '../components/Reveal';
import ResourceHero from '../components/ResourceHero';
import { BlogCtaBand } from './BlogShared';

const PAGE_SIZE = 6;

type VideoCategory = 'tutorial' | 'customer-story' | 'conversation' | 'feature' | 'demo';

interface Video {
  id: string;
  title: string;
  description: string;
  category: VideoCategory;
  tags: string[];
  addedAt: string;
}

type FilterTab = 'all' | VideoCategory;

const CATEGORY_LABELS: Record<VideoCategory, string> = {
  tutorial: 'Product Tutorial',
  'customer-story': 'Customer Story',
  conversation: 'Conversation',
  feature: 'Feature',
  demo: 'Demo',
};

const videos: Video[] = [
  {
    id: 'koTG9QUzC7g',
    title: 'Automate 24/7 Debt Collection: Build an AI Inbound Agent with DROS',
    description: 'Anshul, founder and CEO of Vodex, demonstrates how to build a highly contextual AI inbound agent designed specifically for debt collection - so you never miss a critical collection opportunity after office hours.',
    category: 'demo',
    tags: ['AI Inbound Agent', 'Demo', '24/7 Collections'],
    addedAt: '2026-06-29',
  },
  {
    id: 'NhYhzuXgG7s',
    title: 'How to Create an AI Voice Agent for Debt Collection in Minutes',
    description: 'Anshul, CEO of Vodex.ai, demonstrates how easy it is to build and deploy a voice AI agent specifically designed for collection agencies and teams.',
    category: 'demo',
    tags: ['AI Voice Agent', 'Demo', 'Collections'],
    addedAt: '2026-06-29',
  },
  {
    id: 'bmh8myQHhGo',
    title: 'Why Debt Collection Teams Need Better Workflow Orchestration',
    description: 'Explore why workflow orchestration is the missing layer in most debt collection operations - and how DROS brings it all together.',
    category: 'feature',
    tags: ['Collections', 'Workflow', 'Orchestration'],
    addedAt: '2026-06-03',
  },
  {
    id: 'mNe-zfIOx1A',
    title: 'AI Agents with Context - DROS Feature Overview',
    description: 'See how DROS AI agents understand each account\'s full history before making contact - right tone, right channel, right time.',
    category: 'feature',
    tags: ['AI Agents', 'Context', 'Collections'],
    addedAt: '2026-05-21',
  },
  {
    id: 'URv0f7bH5Ic',
    title: 'How Greystone & Associates Streamlined Daily Collections with DROS',
    description: 'See how Greystone & Associates transformed their daily collections workflow using DROS, cutting manual effort, improving recovery rates, and scaling operations with AI-powered automation.',
    category: 'customer-story',
    tags: ['Customer Story', 'Collections', 'Automation'],
    addedAt: '2026-04-16',
  },
  {
    id: 'vrX1bM7XHb8',
    title: 'Getting Started with DROS | Account Creation and Setup',
    description: 'Learn how to create your DROS account and get started with the platform',
    category: 'tutorial',
    tags: ['Product Demo', 'Automation', 'Collections'],
    addedAt: '2025-03-01',
  },
  {
    id: 'OLFiRuaVGRk',
    title: 'DROS Platform Overview',
    description: 'A comprehensive overview of the DROS platform features and capabilities',
    category: 'tutorial',
    tags: ['Product Demo', 'AI Voice Agent', 'Debt Recovery'],
    addedAt: '2025-02-15',
  },
  {
    id: 'RTzOMKGl-fE',
    title: 'Advanced Features Tutorial',
    description: 'Explore advanced features and workflows in DROS',
    category: 'tutorial',
    tags: ['Automation', 'Compliance', 'Collections'],
    addedAt: '2025-01-20',
  },
  {
    id: '15c13oHQTeI',
    title: 'AI Context Orchestration for Collections | Anshul Shrivastava, Vodex.ai | Ep. 280',
    description: 'Anshul Shrivastava from Vodex.ai joins Receivables Info to discuss how AI context orchestration is transforming the collections industry, enabling smarter, more personalized outreach at scale.',
    category: 'conversation',
    tags: ['Receivables Info', 'AI Orchestration', 'Collections'],
    addedAt: '2025-04-10',
  },
];

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'demo', label: 'Demos' },
  { id: 'feature', label: 'Features' },
  { id: 'tutorial', label: 'Product Tutorials' },
  { id: 'customer-story', label: 'Customer Stories' },
  { id: 'conversation', label: 'Conversations' },
];

const HIGHLIGHT_VIDEO_ID = 'URv0f7bH5Ic';

function VideosPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [page, setPage] = useState(1);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const location = useLocation();
  const tabsRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.hash === '#customer-stories') {
      setActiveTab('customer-story');
      setPage(1);
      setHighlightedId(HIGHLIGHT_VIDEO_ID);
      setTimeout(() => {
        if (tabsRef.current) {
          tabsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTimeout(() => {
          if (highlightRef.current) {
            highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 400);
        setTimeout(() => setHighlightedId(null), 2800);
      }, 100);
    }
  }, [location.hash]);

  const sorted = [...videos].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  const filtered = activeTab === 'all' ? sorted : sorted.filter(v => v.category === activeTab);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleTabChange(tab: FilterTab) {
    setActiveTab(tab);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Video Resources | DROS Collections Insights</title>
        <meta name="description" content="Tutorials, customer stories, and conversations to help you get the most out of DROS." />
      </Helmet>
      <Navbar transparent />

      <ResourceHero
        image="/resources/videos-hero.jpg"
        badge="Video resources"
        headingLines={['Watch DROS', 'in action']}
        subtext="Tutorials, customer stories, and conversations to help you get the most out of DROS."
      />

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-16 sm:px-10 lg:px-[60px]">

        {/* Category pills */}
        <div id="customer-stories" ref={tabsRef} className="mb-12 flex flex-wrap items-center justify-center gap-2.5 scroll-mt-32">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors duration-150 ${
                activeTab === tab.id
                  ? 'bg-[#F5F5F5] text-black'
                  : 'bg-transparent text-[#777777] hover:text-black'
              }`}
            >
              {tab.label}
              <span className={activeTab === tab.id ? 'ml-1.5 text-black/40' : 'ml-1.5 text-[#AAA]'}>
                ({tab.id === 'all' ? videos.length : videos.filter(v => v.category === tab.id).length})
              </span>
            </button>
          ))}
        </div>

        {/* Video grid */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <Play className="mx-auto mb-4 h-10 w-10 text-[#DDD]" />
            <p className="mb-2 text-lg font-medium text-black">No videos in this category yet.</p>
            <p className="text-[#777]">Check back soon.</p>
          </div>
        ) : (
          <>
            <Reveal key={`${activeTab}-${page}`} stagger={0.06} className="grid grid-cols-1 gap-x-[30px] gap-y-[50px] sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map(video => (
                <RevealItem key={video.id}>
                  <div
                    ref={video.id === HIGHLIGHT_VIDEO_ID && highlightedId === video.id ? highlightRef : null}
                    className={`flex h-full flex-col transition-all duration-300 ${highlightedId === video.id ? 'rounded-lg ring-2 ring-black/20' : ''}`}
                  >
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={video.title}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 pl-2 pt-5">
                      <span className="text-sm text-black/40">{CATEGORY_LABELS[video.category]}</span>
                      <h3 className="line-clamp-2 font-saans text-xl font-light leading-[1.15] tracking-[-0.03em] text-black md:text-[22px]">
                        {video.title}
                      </h3>
                      <p className="line-clamp-2 flex-1 text-[15px] leading-relaxed text-black/60">
                        {video.description}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {video.tags.map(tag => (
                          <span key={tag} className="rounded-full border border-[#EDEDED] px-2.5 py-1 text-xs text-black/50">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </Reveal>

            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-[#777] transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                        page === p ? 'bg-[#F5F5F5] text-black' : 'text-[#777] hover:text-black'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-[#777] transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <BlogCtaBand />

      <Footer />
    </div>
  );
}

export default VideosPage;
