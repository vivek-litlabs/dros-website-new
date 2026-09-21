import type { Metadata } from 'next';
import BlogPostRPC from '../../../src/views/BlogPostRPC';

const title = 'Right Party Contact in Debt Collection: What Calls Reveal';
const description =
  'Why right party contact is stuck at 26% and what real collection calls reveal about improving contact rates and recovery outcomes.';
const path = '/blogs/right-party-contact-rpc-learnings-from-the-field';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'Why right party contact is stuck at 26% and what real collection calls reveal about improving contact rates and recovery outcomes.',
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
  return <BlogPostRPC />;
}
