import type { Metadata } from 'next';
import ConsumerLendingCollectionsPage from '../../../src/views/ConsumerLendingCollectionsPage';

const title = 'AI Collections Software for Consumer Lenders | DROS';
const description =
  'DROS works your entire delinquent loan book from day 1 past due - every account, every channel, every day. Accounts cured in the first bucket never roll, never age, never charge off.';
const path = '/collections/consumer-lending';

export const metadata: Metadata = {
  title,
  description,
  keywords:
    'consumer lending collections software, roll rate reduction, early-stage delinquency, DPD bucket strategy, first-party loan servicing, auto finance collections, personal loan collections software',
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'DROS works your entire delinquent loan book from day 1 past due - every account, every channel, every day. Accounts cured in the first bucket never charge off.',
    url: path,
    type: 'website',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
    // Source Helmet block never set twitter:title/description/url; these bled through
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
  return <ConsumerLendingCollectionsPage />;
}
