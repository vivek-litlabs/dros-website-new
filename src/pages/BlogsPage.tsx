export const route = '/blogs';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from './Footer';
import { ArrowRight, ExternalLink, Search, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import Reveal, { RevealItem } from '../components/Reveal';
import { BlogCtaBand, BlogPostCard } from './BlogShared';

export type Category = 'All' | 'Collections Strategy & Performance' | 'Context & Omnichannel' | 'Compliance & Operations' | 'Technology & Integrations' | 'Field Insights';

export interface BlogPost {
  title: string;
  category: Category;
  categories?: Category[];
  tags?: string[];
  summary: string;
  slug?: string;
  externalUrl?: string;
  readTime: string;
  badge?: 'Featured' | 'External' | 'New';
  externalSource?: string;
  image: string;
  date: string;
}

export const blogPosts: BlogPost[] = [
  {
    title: 'AI Readiness Checklist for Collection Agencies: 12 Questions to Answer Before You Evaluate Vendors',
    category: 'Collections Strategy & Performance',
    tags: ['Collections Strategy & Performance', 'Compliance & Operations', 'Technology & Integrations'],
    summary: 'An interactive, scored checklist covering the twelve conditions that decide whether an AI evaluation reaches procurement, including the three blockers that stop a deployment on their own.',
    slug: '/blogs/ai-readiness-checklist-collection-agencies',
    readTime: '9 min read',
    badge: 'New',
    image: '/blog/ai-readiness-checklist.avif',
    date: 'Aug 24, 2026',
  },
  {
    title: 'What We Learned at ACA International Convention 2026',
    category: 'Field Insights',
    tags: ['Field Insights', 'Compliance & Operations', 'Collections Strategy & Performance', 'Events'],
    summary: 'Field notes from three days at Booth #403: inbound demand, compliance as the first question, and why consumers may prefer talking to AI about debt.',
    slug: '/blogs/what-we-learned-aca-2026',
    readTime: '7 min read',
    badge: 'New',
    image: '/blog/aca-2026-conference-session.jpg',
    date: 'Aug 7, 2026',
  },
  {
    title: 'How to Deploy AI Agents Across the Debt Collection Lifecycle',
    category: 'Collections Strategy & Performance',
    tags: ['Collections Strategy & Performance', 'AI Voice Agents', 'Compliance & Operations', 'First-Party', 'Third-Party'],
    summary: 'A practical playbook for deploying AI agents across voice, SMS, and self-service channels while staying compliant with Reg F, FDCPA, and client mandates.',
    slug: '/blogs/ai-agents-debt-collection-deployment',
    readTime: '18 min read',
    badge: 'Featured',
    image: '/features/dashboard.jpg',
    date: 'Jun 8, 2026',
  },
  {
    title: 'Choosing an AI Collections Operating Layer: What to Look For (and Why It Matters More Than Any Bot)',
    category: 'Technology & Integrations',
    tags: ['Technology & Integrations', 'Collections Strategy & Performance', 'Compliance & Operations'],
    summary: 'Learn how to evaluate an AI collections operating layer that orchestrates voice bots, agents, channels, and compliance rules across your entire portfolio.',
    slug: '/blogs/ai-collections-operating-layer',
    readTime: '14 min read',
    badge: 'New',
    image: '/blog/code-pattern.avif',
    date: 'Jun 12, 2026',
  },
  {
    title: 'Human-in-the-Loop Debt Collection: When AI Should Hand Off to Agents',
    category: 'Collections Strategy & Performance',
    tags: ['Collections Strategy & Performance', 'AI Voice Agents', 'Compliance & Operations'],
    summary: 'Learn when AI agents should escalate to human collectors, how to design clean handoffs, and how DROS keeps AI and human workflows coordinated in debt collection.',
    slug: '/blogs/human-in-the-loop-collections',
    readTime: '14 min read',
    badge: 'New',
    image: '/blog/venn-overlap.avif',
    date: 'Jun 12, 2026',
  },
  {
    title: 'What Thousands of Debt Collection Calls Taught Us About Right Party Contact',
    category: 'Field Insights',
    tags: ['Field Insights', 'Right Party Contact', 'Collections Strategy & Performance'],
    summary: 'Real learnings from the field on why RPC is stuck at 26% and how to fix it',
    slug: '/blogs/right-party-contact-rpc-learnings-from-the-field',
    readTime: '15 min read',
    image: '/features/call-analytics.jpg',
    date: 'Oct 1, 2025',
  },
  {
    title: 'Omnichannel AI in Debt Collection: Orchestrating Voice, SMS, Email, and Self-Service',
    category: 'Context & Omnichannel',
    categories: ['Context & Omnichannel', 'Collections Strategy & Performance', 'Compliance & Operations'],
    tags: ['Context & Omnichannel', 'Collections Strategy & Performance', 'AI Voice Agents', 'Compliance & Operations'],
    summary: 'How to design and orchestrate omnichannel AI in debt collection across voice, SMS, email, and self-service portals - with compliance and DROS built in.',
    slug: '/blogs/omnichannel-ai-debt-collection',
    readTime: '14 min read',
    image: '/features/omnichannel.jpg',
    date: 'Jun 10, 2026',
  },
  {
    title: 'How AI Voice Agents Handle Debt Disputes Without Creating Compliance Risk',
    category: 'Compliance & Operations',
    tags: ['Compliance & Operations', 'AI Voice Agents', 'FDCPA', 'Disputes'],
    summary: 'Learn how AI voice agents should handle debt disputes, when to escalate to a human, and how DROS supports compliant dispute workflows end to end.',
    slug: '/blogs/ai-voice-agents-debt-disputes-compliance',
    readTime: '12 min read',
    image: '/blog/blocked-icon.avif',
    date: 'May 19, 2026',
  },
  {
    title: 'How AI Voice Agents Handle "Don\'t Call Me Again": DNC, Disputes, and Compliance in 2026',
    category: 'Compliance & Operations',
    tags: ['Compliance & Operations', 'AI Voice Agents', 'DNC', 'Technology & Integrations'],
    summary: 'What actually happens in your systems when a consumer says "don\'t call me again," disputes the debt, or starts talking about lawyers  - and how DROS wires those rules into every AI call.',
    slug: '/blogs/ai-voice-agents-dnc-disputes-compliance-2026',
    readTime: '12 min read',
    image: '/blog/grid-perspective.avif',
    date: 'Jan 15, 2026',
  },
  {
    title: 'How Reg F Call Limits and Call Hours Work in AI Debt Collection',
    category: 'Compliance & Operations',
    tags: ['Compliance & Operations', 'Reg F', 'AI Voice Agents', 'FDCPA'],
    summary: 'Understand FDCPA call-hour rules, Reg F\'s 7-in-7 limit, and how AI collections software can apply them consistently with built-in settings.',
    slug: '/blog/reg-f-call-limits-ai-debt-collection',
    readTime: '10 min read',
    image: '/blog/podium-steps.avif',
    date: 'May 14, 2026',
  },
  {
    title: 'Why Collections Integrations Break Down With Legacy Systems - and What to Fix First',
    category: 'Technology & Integrations',
    tags: ['Technology & Integrations', 'Legacy Systems', 'Collections Strategy & Performance'],
    summary: 'Why collections integrations break with legacy systems, how tool sprawl hurts RPC and compliance, and what to fix in your stack before adding AI agents.',
    slug: '/blogs/collections-integrations-legacy-systems',
    readTime: '14 min read',
    image: '/features/workflows.jpg',
    date: 'Jan 1, 2026',
  },
  {
    title: 'How to Integrate AI Agents Into Collections Without Blowing Up Compliance',
    category: 'Collections Strategy & Performance',
    categories: ['Collections Strategy & Performance', 'Compliance & Operations', 'Technology & Integrations'],
    tags: ['Collections Strategy & Performance', 'Compliance & Operations', 'Technology & Integrations', 'AI Agents'],
    summary: 'A practical guide for agencies with 5–200 collectors on deploying AI agents safely, covering workflow design, compliance guardrails, and how to measure success without increasing regulatory exposure.',
    slug: '/blogs/integrate-ai-agents-collections-compliance',
    readTime: '18 min read',
    image: '/features/ask-ai.jpg',
    date: 'Dec 1, 2025',
  },
  {
    title: 'Context-Aware AI Operating Models for Collections',
    category: 'Context & Omnichannel',
    tags: ['Context & Omnichannel', 'AI Agents', 'Collections Strategy & Performance'],
    summary: 'How modern collections platforms can orchestrate human and AI agents with shared context',
    externalUrl: 'https://receivablesinfo.com/2026/03/19/context-aware-ai-operating-models-collections/',
    readTime: '10 min read',
    badge: 'External',
    externalSource: 'Receivables Info',
    image: '/blog/build-toggle.avif',
    date: 'Mar 19, 2026',
  },
  {
    title: 'Why Debt Collection Needs Fewer Systems, Not More',
    category: 'Context & Omnichannel',
    tags: ['Context & Omnichannel', 'Collections Strategy & Performance', 'Technology & Integrations'],
    summary: 'The case for context orchestration across fragmented collection workflows',
    slug: '/blogs/why-context-not-more-tools-is-the-future-of-debt-collection',
    readTime: '8 min read',
    image: '/blog/pastel-orb.avif',
    date: 'Nov 1, 2025',
  },
  {
    title: 'Digital-First Collections for Small Agencies: What\'s Actually Changing in 2026',
    category: 'Collections Strategy & Performance',
    tags: ['Collections Strategy & Performance', 'Digital-First', 'AI Agents', 'Field Insights'],
    summary: 'A practical guide to adopting AI and automation for small agencies using low-risk compliant pilots',
    slug: '/blogs/digital-first-collections-small-agencies-2026',
    readTime: '12 min read',
    image: '/features/payments.jpg',
    date: 'Feb 1, 2026',
  }
];

const categories: Category[] = [
  'All',
  'Collections Strategy & Performance',
  'Context & Omnichannel',
  'Compliance & Operations',
  'Technology & Integrations',
  'Field Insights'
];

export default function BlogsPage() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const param = searchParams.get('category');
    if (!param) { setSelectedCategory('All'); return; }
    const match = categories.find(c => c.toLowerCase() === param.toLowerCase());
    setSelectedCategory((match as Category) ?? 'All');
  }, [searchParams]);

  const matchesSearch = (post: BlogPost, query: string) => {
    const q = query.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.summary.toLowerCase().includes(q) ||
      (post.tags ?? []).some(t => t.toLowerCase().includes(q)) ||
      post.category.toLowerCase().includes(q)
    );
  };

  const suggestions = searchQuery.trim().length > 1
    ? blogPosts.filter(p => matchesSearch(p, searchQuery.trim())).slice(0, 6)
    : [];

  const categoryFilteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post =>
        post.category === selectedCategory ||
        (post.categories && post.categories.includes(selectedCategory))
      );

  const filteredPosts = isSearchActive && searchQuery.trim()
    ? blogPosts.filter(p => matchesSearch(p, searchQuery.trim()))
    : categoryFilteredPosts;

  const featuredPost = blogPosts.find(post => post.badge === 'Featured');
  const shouldShowFeatured = !isSearchActive && selectedCategory === 'All' && !!featuredPost;
  const gridPosts = shouldShowFeatured
    ? filteredPosts.filter(post => post !== featuredPost)
    : filteredPosts;

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setIsSearchActive(false);
    setSearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchActive(true);
    setSelectedCategory('All');
    setShowSuggestions(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
    if (!e.target.value.trim()) {
      setIsSearchActive(false);
    }
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setIsSearchActive(false);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>DROS Blog | AI, Collections, and Context Orchestration</title>
        <meta name="description" content="Insights on modern debt collection, AI voice agents, compliance, and context orchestration for collections teams." />
        <meta property="og:title" content="DROS Blog | AI, Collections, and Context Orchestration" />
        <meta property="og:description" content="Insights on modern debt collection, AI voice agents, compliance, and context orchestration for collections teams." />
        <meta property="og:image" content="https://dros.ai/dros-logo-horizontal.svg" />
        <meta property="og:url" content="https://dros.ai/blogs" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://dros.ai/dros-logo-horizontal.svg" />
      </Helmet>
      <Navbar />

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-32 sm:px-10 md:pt-36 lg:px-[60px]">

        {/* Featured post */}
        {shouldShowFeatured && featuredPost && (
          <Reveal className="mb-16 md:mb-20">
            {featuredPost.externalUrl ? (
              <a
                href={featuredPost.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-6 md:flex-row md:gap-10"
              >
                <FeaturedMedia post={featuredPost} />
                <FeaturedBody post={featuredPost} external />
              </a>
            ) : (
              <Link to={featuredPost.slug!} className="group flex flex-col gap-6 md:flex-row md:gap-10">
                <FeaturedMedia post={featuredPost} />
                <FeaturedBody post={featuredPost} />
              </Link>
            )}
          </Reveal>
        )}

        {/* Section header + search */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="font-saans text-[32px] font-light leading-[1.15] tracking-[-0.04em] text-black">
              All Posts
            </h2>
            <p className="text-[17px] text-[#393939]">
              Insights on modern debt collection, AI, and context orchestration.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <form onSubmit={handleSearchSubmit} autoComplete="off">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="Search articles..."
                  className="w-full rounded-full border border-[#E6E3E3] bg-white py-2.5 pl-10 pr-9 text-sm text-black placeholder-[#999] transition-colors focus:border-black/30 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleSearchClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] transition-colors hover:text-black"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-[#E6E3E3] bg-white shadow-[0_20px_60px_0_rgba(10,18,37,0.15)] text-left">
                {suggestions.map((post, i) => {
                  const inner = (
                    <div className="flex items-start gap-3 border-b border-[#F0F0F0] px-4 py-3 last:border-0 hover:bg-[#FAFAFA]">
                      <Search className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#999]" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-black">{post.title}</p>
                        <p className="mt-0.5 text-xs text-[#777]">{post.category}</p>
                      </div>
                    </div>
                  );
                  return post.slug ? (
                    <Link key={i} to={post.slug}>{inner}</Link>
                  ) : (
                    <a key={i} href={post.externalUrl!} target="_blank" rel="noopener noreferrer">{inner}</a>
                  );
                })}
                <button
                  onMouseDown={handleSearchSubmit as unknown as React.MouseEventHandler}
                  className="flex w-full items-center gap-2 border-t border-[#F0F0F0] px-4 py-3 text-left text-sm font-medium text-black hover:bg-[#FAFAFA]"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  See all results for &quot;{searchQuery}&quot;
                </button>
              </div>
            )}
          </div>
        </div>

        {isSearchActive && (
          <div className="mb-6 flex items-center gap-2 text-sm text-[#777]">
            <span>Showing results for</span>
            <span className="font-medium text-black">&quot;{searchQuery}&quot;</span>
            <button onClick={handleSearchClear} className="ml-1 font-medium text-black underline underline-offset-2 hover:no-underline">
              Clear
            </button>
          </div>
        )}

        {/* Category pills */}
        <div className={`mb-12 flex flex-wrap items-center gap-2.5 transition-opacity duration-200 ${isSearchActive ? 'pointer-events-none opacity-40' : 'opacity-100'}`}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors duration-150 ${
                selectedCategory === category
                  ? 'bg-[#F5F5F5] text-black'
                  : 'bg-transparent text-[#777777] hover:text-black'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* No results */}
        {gridPosts.length === 0 && (
          <div className="py-24 text-center">
            <Search className="mx-auto mb-4 h-10 w-10 text-[#DDD]" />
            <p className="mb-2 text-lg font-medium text-black">No results found</p>
            <p className="mb-6 text-[#777]">Try a different keyword or browse by category above.</p>
            <button onClick={handleSearchClear} className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85">
              Clear search
            </button>
          </div>
        )}

        {/* Grid */}
        {gridPosts.length > 0 && (
          <Reveal
            key={isSearchActive ? `search:${searchQuery.trim()}` : `category:${selectedCategory}`}
            stagger={0.06}
            className="grid grid-cols-1 gap-x-[30px] gap-y-[50px] sm:grid-cols-2 lg:grid-cols-3"
          >
            {gridPosts.map((post, index) => (
              <RevealItem key={post.slug || post.externalUrl || index}>
                <BlogPostCard post={post} />
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

function FeaturedMedia({ post }: { post: BlogPost }) {
  return (
    <div className="w-full shrink-0 md:w-[58%]">
      <img
        src={post.image}
        alt=""
        loading="eager"
        className="aspect-[823/500] w-full rounded-lg object-cover"
      />
    </div>
  );
}

function FeaturedBody({ post, external = false }: { post: BlogPost; external?: boolean }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-4">
      <span className="text-sm text-[#696969]">{post.date}</span>
      <h3 className="font-saans text-[28px] font-light leading-[1.15] tracking-[-0.04em] text-black transition-colors group-hover:text-black/70 md:text-[32px]">
        {post.title}
      </h3>
      <p className="text-[17px] leading-relaxed text-black/80">{post.summary}</p>
      <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-black">
        {external ? 'Read article' : 'Read more'}
        {external ? <ExternalLink className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />}
      </span>
    </div>
  );
}
