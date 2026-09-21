import type { Metadata } from 'next';
import BlogPostAICompliance from '../../../src/views/BlogPostAICompliance';

const title = 'Integrating AI Agents in Debt Collection Without Compliance Risk';
const description =
  'A practical guide to integrating AI agents into debt collection while maintaining compliance, control, and operational clarity.';
const path = '/blogs/integrate-ai-agents-collections-compliance';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'A practical guide to integrating AI agents into debt collection while maintaining compliance, control, and operational clarity.',
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
  return <BlogPostAICompliance />;
}
