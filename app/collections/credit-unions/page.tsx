import type { Metadata } from 'next';
import CreditUnionCollectionsPage from '../../../src/views/CreditUnionCollectionsPage';

const title = 'AI Collections Software for Credit Unions | DROS';
const description =
  'DROS works your delinquent member accounts from day 1 - every call, text, and email compliant, logged, and audit-ready for your next NCUA exam.';
const path = '/collections/credit-unions';

export const metadata: Metadata = {
  title,
  description,
  keywords:
    'credit union collections software, member collections, NCUA exam ready, Reg F credit union, share overdraft recovery, credit union delinquency management, AI voice agents credit union',
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
  return <CreditUnionCollectionsPage />;
}
