import type { Metadata } from 'next';
import DebtBuyerCollectionsPage from '../../../src/views/DebtBuyerCollectionsPage';

const title = 'AI Agents for Debt Buyer Collections | DROS';
const description =
  'DROS helps debt buyers who self-collect run AI agents and human collectors on purchased portfolios - with per-acquisition workspaces, Reg F guardrails, and full engagement history in one platform. Built for charged-off portfolio recovery teams.';
const path = '/collections/debt-buyer';

export const metadata: Metadata = {
  title,
  description,
  keywords:
    'debt buyer collections software, AI agents for debt collection, charged off portfolio collections, purchased portfolio collections platform, debt buyer collections platform, AI debt collection software, self-collect debt buyer, collections software charged off accounts, Reg F debt buyer, debt recovery AI agents',
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'DROS helps debt buyers who self-collect run AI agents and human collectors on purchased portfolios - with per-acquisition workspaces, Reg F guardrails, and full engagement history in one platform.',
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
  return <DebtBuyerCollectionsPage />;
}
