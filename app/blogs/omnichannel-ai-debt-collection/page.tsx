import type { Metadata } from 'next';
import BlogPostOmnichannel from '../../../src/views/BlogPostOmnichannel';

const title = 'Omnichannel AI in Debt Collection: Voice, SMS, Email, and Self-Service';
const description =
  'Learn how to design and orchestrate omnichannel AI in debt collection across voice, SMS, email, and self-service - with compliance and DROS built in.';
const path = '/blogs/omnichannel-ai-debt-collection';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'Learn how to design and orchestrate omnichannel AI in debt collection across voice, SMS, email, and self-service - with compliance and DROS built in.',
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
  return <BlogPostOmnichannel />;
}
