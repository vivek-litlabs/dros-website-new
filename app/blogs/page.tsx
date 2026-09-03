import type { Metadata } from 'next';
import { Suspense } from 'react';
import BlogsPage from '../../src/views/BlogsPage';

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

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-base" />}>
      <BlogsPage />
    </Suspense>
  );
}
