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
import { getCmsOnlyPosts } from '../../../src/lib/blog-cms';
import CmsBlogPost from '../../../src/views/CmsBlogPost';

export const dynamicParams = false;

/** Airtable stores a full path ("/blogs/my-post"); the route needs the last segment. */
const leafOf = (slug: string) => slug.split('/').filter(Boolean).slice(-1)[0];

export async function generateStaticParams() {
  const posts = await getCmsOnlyPosts();
  return posts.map((p) => ({ slug: leafOf(p.slug) }));
}

async function findPost(slug: string) {
  return (await getCmsOnlyPosts()).find((p) => leafOf(p.slug) === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPost(slug);
  if (!post) return {};

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
  if (!post) notFound();
  return <CmsBlogPost post={post} />;
}
