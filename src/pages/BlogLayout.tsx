import { useState, useCallback, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { trackCta } from '../lib/analytics';
import Navbar from './Navbar';
import Footer from './Footer';
import RelatedArticles from './RelatedArticles';
import { BlogCtaBand } from './BlogShared';

export interface TocSection {
  id: string;
  label: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

interface BlogLayoutProps {
  title: ReactNode;
  subtitle?: ReactNode;
  readTime: string;
  tags?: string[];
  children: ReactNode;
  cta?: ReactNode;
  /** Hero image shown below the title/byline, matching the post's listing thumbnail. */
  image?: string;
  /** Byline author name. Defaults to the DROS team. */
  author?: string;
  /** Unused now that the layout follows the single-column reference design; kept for backward compatibility. */
  tocSections?: TocSection[];
  /** Canonical URL path for this post, e.g. "/blogs/my-post-slug" */
  canonicalPath?: string;
  /** ISO 8601 publish date, e.g. "2025-10-01" */
  datePublished?: string;
  /** Primary category/tag for schema, e.g. "Collections Strategy" */
  category?: string;
  /** When provided, injects FAQPage JSON-LD schema in addition to article schema */
  faq?: FaqItem[];
}

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BlogLayout({ title, subtitle, tags, children, cta, image, author = 'DROS Team', canonicalPath, datePublished, category, faq }: BlogLayoutProps) {
  const siteUrl = 'https://dros.ai';
  const postUrl = canonicalPath ? `${siteUrl}${canonicalPath}` : siteUrl;
  const displayDate = formatDate(datePublished);

  const allKeywords = [
    ...(category ? [category] : []),
    ...(tags ?? []),
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': typeof title === 'string' ? title : undefined,
    'url': postUrl,
    'datePublished': datePublished,
    'author': { '@id': siteUrl },
    'publisher': { '@id': siteUrl },
    ...(category ? { 'articleSection': category } : {}),
    ...(datePublished ? { 'dateModified': datePublished } : {}),
    ...(allKeywords.length > 0 ? { 'keywords': allKeywords.join(', ') } : {}),
  };

  const categorySlug = category
    ? category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : null;
  const categoryUrl = categorySlug ? `${siteUrl}/blogs?category=${encodeURIComponent(category!)}` : null;

  const breadcrumbItems: { '@type': string; position: number; name: string; item: string }[] = [
    { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': siteUrl },
    { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${siteUrl}/blogs` },
  ];
  if (category && categoryUrl) {
    breadcrumbItems.push({ '@type': 'ListItem', 'position': 3, 'name': category, 'item': categoryUrl });
  }
  if (canonicalPath) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      'position': breadcrumbItems.length + 1,
      'name': typeof title === 'string' ? title : 'Article',
      'item': postUrl,
    });
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems,
  };

  const faqSchema = faq && faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faq.map(({ q, a }) => ({
      '@type': 'Question',
      'name': q,
      'acceptedAnswer': { '@type': 'Answer', 'text': a },
    })),
  } : null;

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        {canonicalPath && <link rel="canonical" href={postUrl} />}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>
      <Navbar />

      <div className="mx-auto w-full max-w-[1440px] px-6 pt-32 sm:px-10 md:pt-36 lg:px-[60px]">
        <header className="mx-auto max-w-[700px] text-center">
          <p className="text-sm text-[#696969]">
            {author}
            {displayDate && <> <span className="mx-1.5">|</span> {displayDate}</>}
          </p>
          <h1 className="mt-4 font-saans text-[32px] font-light leading-[1.15] tracking-[-0.04em] text-black md:text-[40px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-[560px] text-lg text-[#393939]">{subtitle}</p>
          )}
        </header>

        {image && (
          <img
            src={image}
            alt=""
            className="mx-auto mt-12 aspect-[696/421] w-full max-w-[1200px] rounded-lg object-cover md:mt-16"
          />
        )}

        <article className="mx-auto max-w-[700px] py-14 md:py-16" style={{ fontFamily: "'Saans', 'Inter', sans-serif" }}>
          {children}
          {cta && <div className="mt-16">{cta}</div>}
          <div className="mt-14 pt-8 border-t border-[#E6E3E3]">
            <Link to="/blogs" className="inline-flex items-center gap-2 font-medium text-black transition-opacity hover:opacity-70">
              ← Back to all blogs
            </Link>
          </div>
        </article>
      </div>

      {tags && tags.length > 0 && canonicalPath && (
        <RelatedArticles tags={tags} currentRoute={canonicalPath} />
      )}

      <BlogCtaBand />

      <Footer />
    </div>
  );
}

/* ─── Shared light-card sub-components used across blog posts ─── */

export function DarkCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-[#FAFAFA] border border-[#E6E3E3] rounded-2xl p-5 sm:p-7 my-8 ${className}`}>
      {children}
    </div>
  );
}

export function StepCard({ step, title, children }: { step: string | number; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 sm:gap-5 bg-[#FAFAFA] border border-[#E6E3E3] rounded-2xl p-5 sm:p-6 my-4">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-black font-bold flex-shrink-0 text-sm">
        {step}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-black mb-1">{title}</p>
        <div className="text-[#393939] leading-relaxed text-sm">{children}</div>
      </div>
    </div>
  );
}

export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-2 border-black pl-5 sm:pl-6 py-3 my-10">
      <p className="text-base sm:text-lg text-black/80 italic font-light leading-relaxed">{children}</p>
    </blockquote>
  );
}

export function CalloutPill({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#F7FAFF] border border-[#E6E3E3] rounded-2xl p-6 sm:p-8 my-10 text-center">
      {children}
    </div>
  );
}

export function BlogCTA({ heading, body, primaryLabel, primaryHref, secondaryLabel, secondaryHref }: {
  heading: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}) {
  return (
    <div className="bg-[#FAFAFA] border border-[#E6E3E3] rounded-2xl p-6 sm:p-10">
      <h3 className="text-xl sm:text-2xl font-light tracking-[-0.02em] text-black mb-3">{heading}</h3>
      <p className="text-[#393939] text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">{body}</p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <a
          href={primaryHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCta(primaryLabel)}
          className="group px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base transition-opacity hover:opacity-85 flex items-center justify-center gap-2 bg-black text-white"
        >
          {primaryLabel}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
        <a
          href={secondaryHref}
          rel="noopener noreferrer"
          className="border border-[#E6E3E3] hover:border-black/40 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base transition-colors text-center"
        >
          {secondaryLabel}
        </a>
      </div>
    </div>
  );
}

/* ─── Body text helpers ─── */

export function P({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-black/80 leading-relaxed text-base sm:text-lg mb-6 ${className}`}>{children}</p>;
}

export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="font-saans text-xl sm:text-2xl md:text-3xl font-light tracking-[-0.03em] text-black mt-14 mb-5 leading-snug scroll-mt-28 break-words"
    >
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-lg sm:text-xl font-semibold text-black mt-10 mb-4">{children}</h3>;
}

export function Ul({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3 my-6">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-black/80 text-base sm:text-lg leading-relaxed">
          <span className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0 mt-2.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Screenshot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="bg-[#FAFAFA] border border-[#E6E3E3] rounded-2xl p-3 sm:p-4 my-8 sm:my-10 overflow-hidden">
      <img src={src} alt={alt} className="w-full rounded-xl block" />
    </div>
  );
}

export function BlogFAQ({ items }: { items: { q: string; a: ReactNode }[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const toggle = useCallback((i: number) => setOpenIdx(prev => (prev === i ? null : i)), []);
  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-6">
      {items.map(({ q, a }, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 sm:p-7 bg-white border border-[#E6E3E3] cursor-pointer select-none transition-shadow hover:shadow-sm"
          onClick={() => toggle(i)}
        >
          <div className="flex justify-between items-start gap-3 sm:gap-4">
            <span className="text-sm sm:text-base font-semibold leading-snug text-black">{q}</span>
            <div
              className="flex-shrink-0 mt-0.5 transition-transform duration-200"
              style={{ transform: openIdx === i ? 'rotate(180deg)' : 'none' }}
            >
              <ChevronDown className="w-5 h-5 text-black/30" />
            </div>
          </div>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: openIdx === i ? '600px' : '0', paddingTop: openIdx === i ? '12px' : '0' }}
          >
            <p className="text-sm leading-relaxed text-[#393939]">{a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
