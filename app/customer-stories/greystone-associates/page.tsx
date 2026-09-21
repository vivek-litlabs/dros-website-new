import type { Metadata } from 'next';
import GreystoneStory from '../../../src/views/GreystoneStory';

const title = 'Greystone & Associates Case Study | DROS';
const description =
  'How Greystone & Associates simplified daily collections with faster onboarding, real-time visibility, and streamlined workflows using DROS.';
const path = '/customer-stories/greystone-associates';

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
  return <GreystoneStory />;
}
