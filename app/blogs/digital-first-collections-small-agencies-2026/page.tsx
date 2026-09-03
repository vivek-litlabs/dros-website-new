import type { Metadata } from 'next';
import BlogPostDigitalFirst from '../../../src/views/BlogPostDigitalFirst';

const title = 'Digital-First Debt Collection for Small Agencies in 2026';
const description =
  'Digital-first collections are reshaping small agencies. See what\'s changing in 2026 and how to adapt without adding complexity.';
const path = '/blogs/digital-first-collections-small-agencies-2026';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'Digital-first collections are reshaping small agencies. See what\'s changing in 2026 and how to adapt without adding complexity.',
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
  return <BlogPostDigitalFirst />;
}
