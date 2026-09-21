import type { Metadata } from 'next';
import FirstPartyCollectionsPage from '../../../src/views/FirstPartyCollectionsPage';

const title = 'AI-Powered First-Party Collections Platform | DROS';
const description =
  'DROS is the AI-powered engagement OS for first-party and in-house collections teams. Orchestrate AI voice agents, human agents, and omnichannel workflows — with Reg F compliance, brand rules, and CX guardrails enforced at the platform layer.';
const path = '/collections/first-party';

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
  return <FirstPartyCollectionsPage />;
}
