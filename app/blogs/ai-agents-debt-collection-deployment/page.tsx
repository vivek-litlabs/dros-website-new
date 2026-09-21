import type { Metadata } from 'next';
import BlogPostAIAgentsDeployment from '../../../src/views/BlogPostAIAgentsDeployment';

const title = 'How to Deploy AI Agents Across the Debt Collection Lifecycle';
const description =
  'Learn how to deploy AI agents across the debt collection lifecycle - voice, SMS, and self-service - while staying compliant with Reg F, FDCPA, and client mandates.';
const path = '/blogs/ai-agents-debt-collection-deployment';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'Learn how to deploy AI agents across the debt collection lifecycle - voice, SMS, and self-service - while staying compliant with Reg F, FDCPA, and client mandates.',
    url: path,
    type: 'article',
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
  return <BlogPostAIAgentsDeployment />;
}
