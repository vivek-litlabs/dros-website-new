/**
 * TEMPORARY validation route for CMS-rendered blog posts.
 *
 * Renders each post from Airtable at a parallel path so its pixels can be diffed
 * against the existing React-rendered post before anything is swapped over. Delete
 * this directory once /blogs/[slug] is served from the CMS.
 */
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '../../../src/lib/blog-cms';
import CmsBlogPost from '../../../src/views/CmsBlogPost';

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  // The stored slug is a full path ("/blogs/x", and one "/blog/y"), so flatten it to a
  // single segment for this preview route.
  return posts.map((p) => ({ slug: p.slug.split('/').filter(Boolean).slice(-1)[0] }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug.split('/').filter(Boolean).slice(-1)[0] === slug);
  if (!post) notFound();
  return <CmsBlogPost post={post} />;
}
