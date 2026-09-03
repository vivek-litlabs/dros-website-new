import type { Metadata } from 'next';
import PricingPage from '../../src/views/PricingPage';

const title = 'Pricing - DROS';
const description = 'Four plans built to scale with your portfolio. Simple, transparent pricing for AI-powered debt collection.';
const path = '/pricing';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    title: 'AI Agents for Collections | DROS AI',
    'og:url': 'https://dros.ai/pricing',
    'og:image': 'https://dros.ai/untitled_logo_1_basic-file.png',
    'twitter:url': 'https://dros.ai/',
    'twitter:title': 'AI Agents for Collections | DROS AI',
    'twitter:description':
      'AI-native engagement OS for collections. Automate outreach, improve recovery rates, and manage first- and third-party collections with intelligent AI agents.',
    'twitter:image': 'https://dros.ai/untitled_logo_1_basic-file.png',
  },
};

export default function Page() {
  return <PricingPage />;
}
