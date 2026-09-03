import type { Metadata } from 'next';
import BlogPostHumanInTheLoop from '../../../src/views/BlogPostHumanInTheLoop';

const title = 'Human-in-the-Loop Debt Collection: When AI Should Hand Off to Agents';
const description =
  'Learn when AI agents should escalate to human collectors, how to design clean handoffs, and how DROS keeps AI and human workflows coordinated in debt collection.';
const path = '/blogs/human-in-the-loop-collections';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'Learn when AI agents should escalate to human collectors, how to design clean handoffs, and how DROS keeps AI and human workflows coordinated in debt collection.',
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
  return <BlogPostHumanInTheLoop />;
}
