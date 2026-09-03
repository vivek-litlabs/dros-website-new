import type { Metadata } from 'next';
import Aca from '../../src/views/Aca';

const title = 'AI Agents for Collections | DROS AI';
const description =
  'DROS is an AI-native engagement OS for collections that helps teams recover more with context-aware AI, compliant workflows, and less manual follow-up.';
const path = '/aca';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: path,
    type: 'website',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
    // Source Helmet never set twitter:title/description, so these bled through
    // unchanged from index.html's static site-wide defaults. Reproduced verbatim.
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
  return <Aca />;
}
