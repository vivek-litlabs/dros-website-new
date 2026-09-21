import type { Metadata } from 'next';
import ThirdPartyCollectionsPage from '../../../src/views/ThirdPartyCollectionsPage';

const title = 'AI-Powered Third-Party Collections Software for Agencies | DROS';
const description =
  'DROS coordinates AI voice agents, human agents, and your existing dialers across every client portfolio - with FDCPA, Reg F, and TCPA compliance enforced before the first dial.';
const path = '/collections/third-party';

export const metadata: Metadata = {
  title,
  description,
  keywords:
    'third-party collections software, debt collection agency software, collections agency platform, AI voice agents debt collection, FDCPA compliant collections software, Reg F 7-in-7 compliance, TCPA consent management, multi-portfolio collections management, collections dialer compliance, third party debt collection technology, collections engagement platform',
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'DROS coordinates AI voice agents, human agents, and your existing dialers across every client portfolio. FDCPA, Reg F, and TCPA compliance enforced before the first dial.',
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
  return <ThirdPartyCollectionsPage />;
}
