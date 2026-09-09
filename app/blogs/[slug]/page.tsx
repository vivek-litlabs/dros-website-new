/**
 * New blog posts, authored in Airtable.
 *
 * This is the fallback segment: Next matches a static route before a dynamic one, so
 * every hand-written post under app/blogs/<slug>/ still serves its own React view and
 * is untouched by this file. Only slugs that have no directory of their own reach here.
 *
 * dynamicParams is false, so a slug that is neither a React route nor an Airtable
 * record 404s at the edge instead of being rendered on demand.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRoutableCmsPosts, isPublished } from '../../../src/lib/blog-cms';
import CmsBlogPost from '../../../src/views/CmsBlogPost';

export const dynamicParams = false;

/**
 * Re-render hourly so a scheduled post publishes itself.
 *
 * Every scheduled post is prerendered ahead of time and answers 404 until its date.
 * Without this the site only changed when something rebuilt it, so dates passed and
 * nothing appeared - which is exactly what happened after the first deploy. An hourly
 * revalidation means a post goes live within the hour of its date with no build, no
 * deploy hook, and nothing to remember.
 */
export const revalidate = 3600;

/** Airtable stores a full path ("/blogs/my-post"); the route needs the last segment. */
const leafOf = (slug: string) => slug.split('/').filter(Boolean).slice(-1)[0];

export async function generateStaticParams() {
  // Routable, not published: scheduled posts need a page to exist before their date,
  // or there would be nothing for the revalidation to reveal.
  const posts = await getRoutableCmsPosts();
  return posts.map((p) => ({ slug: leafOf(p.slug) }));
}

async function findPost(slug: string) {
  return (await getRoutableCmsPosts()).find((p) => leafOf(p.slug) === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPost(slug);
  // Not yet published: emit nothing rather than metadata for a page that 404s.
  if (!post || !isPublished(post)) return {};

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: post.slug },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: post.slug,
      type: 'article',
      publishedTime: post.publishDate || undefined,
      images: post.heroImage ? [`https://dros.ai${post.heroImage}`] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: post.heroImage ? [`https://dros.ai${post.heroImage}`] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await findPost(slug);
  // The date gate lives here, at render time, so the hourly revalidation can flip a
  // scheduled post from 404 to live without anything rebuilding the site.
  if (!post || !isPublished(post)) notFound();
  return <CmsBlogPost post={post} />;
}
