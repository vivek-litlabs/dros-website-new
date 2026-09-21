import type { Metadata } from 'next';
import BlogPostLegacyIntegrations from '../../../src/views/BlogPostLegacyIntegrations';

const title = 'Why Collections Integrations Fail in Legacy Systems';
const description =
  'Legacy systems break collections workflows. Learn why integrations fail, how tool sprawl impacts recovery, and what to fix before introducing AI.';
const path = '/blogs/collections-integrations-legacy-systems';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'Legacy systems break collections workflows. Learn why integrations fail, how tool sprawl impacts recovery, and what to fix before introducing AI.',
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
  return <BlogPostLegacyIntegrations />;
}
