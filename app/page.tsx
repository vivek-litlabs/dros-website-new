import type { Metadata } from 'next';
import App from '../src/views/App';

export const metadata: Metadata = {
  alternates: { canonical: 'https://dros.ai' },
  openGraph: {
    title: 'AI Agents for Collections | DROS AI',
    description:
      'DROS is an AI-native engagement OS for collections that helps teams recover more with context-aware AI, compliant workflows, and less manual follow-up.',
    type: 'website',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
  },
  other: {
    title: 'AI Agents for Collections | DROS AI',
    'og:url': 'https://dros.ai/',
    'twitter:url': 'https://dros.ai/',
    'twitter:title': 'AI Agents for Collections | DROS AI',
    'twitter:description':
      'AI-native engagement OS for collections. Automate outreach, improve recovery rates, and manage first- and third-party collections with intelligent AI agents.',
  },
};

export default function Page() {
  return <App />;
}
