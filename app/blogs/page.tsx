import type { Metadata } from 'next';
import BlogsPage from '../../src/views/BlogsPage';
import { getCmsOnlyPosts } from '../../src/lib/blog-cms';
import type { BlogPost } from '../../src/views/BlogsPage';

const title = 'DROS Blog | AI, Collections, and Context Orchestration';
const description =
  'Insights on modern debt collection, AI voice agents, compliance, and context orchestration for collections teams.';
const path = '/blogs';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: path,
    type: 'website',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
    // The source Helmet block never set twitter:title/description/url, so these bled
    // through unchanged from index.html's static site-wide defaults. Reproduced
    // verbatim here per the pilot recipe.
    title: 'AI Agents for Collections | DROS AI',
    description:
      'AI-native engagement OS for collections. Automate outreach, improve recovery rates, and manage first- and third-party collections with intelligent AI agents.',
  },
  other: {
    title: 'AI Agents for Collections | DROS AI',
    'twitter:url': 'https://dros.ai/',
  },
};

/** "2026-09-08" -> "Sep 8, 2026", matching how the static registry writes dates. */
function humanDate(iso: string): string {
  if (!iso) return '';
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function Page() {
  // New Airtable-authored posts, shaped like the static registry entries so the listing
  // renders them through exactly the same card component.
  const cms = await getCmsOnlyPosts();
  const cmsPosts: BlogPost[] = cms.map((p) => ({
    title: p.title,
    category: (p.category || 'Collections Strategy & Performance') as BlogPost['category'],
    tags: p.tags,
    summary: p.summary,
    slug: p.slug,
    readTime: p.readTime,
    image: p.heroImage,
    date: humanDate(p.publishDate),
  }));

  return <BlogsPage cmsPosts={cmsPosts} />;
}
