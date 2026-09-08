import type { Metadata } from 'next';
import BlogPostContextView from '../../../src/views/BlogPostContextView';

const title = 'Why Debt Collection Needs Fewer Systems (Context Orchestration)';
const description =
  'Too many tools slow collections teams down. Learn how context orchestration reduces system sprawl, improves visibility, and simplifies recovery workflows.';
const path = '/blogs/why-context-not-more-tools-is-the-future-of-debt-collection';

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
    // The source Helmet block never set twitter:title/description/url, so on the Vite
    // site these bled through unchanged from index.html's static site-wide defaults.
    // Reproduced verbatim here rather than treated as a gap, since the rendered output
    // (and this route's baseline) genuinely carries the root site's values, not nothing.
    title: 'AI Agents for Collections | DROS AI',
    description:
      'AI-native engagement OS for collections. Automate outreach, improve recovery rates, and manage first- and third-party collections with intelligent AI agents.',
  },
  other: {
    // Same bleed-through as above: index.html's static <meta name="title"> and
    // twitter:url were never overridden by this post's Helmet, so they remained the
    // root site's values.
    title: 'AI Agents for Collections | DROS AI',
    'twitter:url': 'https://dros.ai/',
  },
};

export default function Page() {
  return <BlogPostContextView />;
}
