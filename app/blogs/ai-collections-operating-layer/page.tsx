import type { Metadata } from 'next';
import BlogPostAICollectionsOperatingLayer from '../../../src/views/BlogPostAICollectionsOperatingLayer';

const title = 'Choosing an AI Collections Operating Layer: What to Look For';
const description =
  'Learn how to evaluate an AI collections operating layer that orchestrates voice bots, agents, channels, and compliance rules across your entire portfolio.';
const path = '/blogs/ai-collections-operating-layer';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'Learn how to evaluate an AI collections operating layer that orchestrates voice bots, agents, channels, and compliance rules across your entire portfolio.',
    url: path,
    type: 'website',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
    // The source Helmet block never set twitter:title/description/url, so on the Vite
    // site these bled through unchanged from index.html's static site-wide defaults.
    // Reproduced verbatim here rather than treated as a gap.
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
  return <BlogPostAICollectionsOperatingLayer />;
}
