import type { Metadata } from 'next';
import EventsListingPage from '../../src/views/EventsListingPage';

const title = 'Events | Meet DROS at Collections Conferences';
const description = 'Meet us at industry conferences and discover how DROS is transforming debt collection.';
const path = '/events';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    // The source Helmet block never set og:* tags, so on the Vite site these bled
    // through unchanged from index.html's static site-wide defaults. Reproduced
    // verbatim here rather than treated as a gap.
    title: 'AI Agents for Collections | DROS AI',
    description:
      'AI-native engagement OS for collections. Automate outreach, improve recovery rates, and manage first- and third-party collections with intelligent AI agents.',
    type: 'website',
    images: ['https://dros.ai/untitled_logo_1_basic-file.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://dros.ai/untitled_logo_1_basic-file.png'],
    // Same bleed-through as above: index.html's static twitter:title/description
    // were never overridden by this route's Helmet.
    title: 'AI Agents for Collections | DROS AI',
    description:
      'AI-native engagement OS for collections. Automate outreach, improve recovery rates, and manage first- and third-party collections with intelligent AI agents.',
  },
  other: {
    // Same bleed-through: index.html's static <meta name="title"> and twitter:url
    // were never overridden by this route's Helmet, so they remained the root's values.
    title: 'AI Agents for Collections | DROS AI',
    'og:url': 'https://dros.ai/',
    'twitter:url': 'https://dros.ai/',
  },
};

export default function Page() {
  return <EventsListingPage />;
}
