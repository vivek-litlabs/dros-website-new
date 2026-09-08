import type { Metadata } from 'next';
import WebinarsPage from '../../src/views/WebinarsPage';

const title = 'Webinars | DROS';
const description = "Live sessions on AI technology, collections strategy, and what's actually working in the field.";
const path = '/webinars';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: path,
    type: 'website',
    // Source Helmet never set og:image, so it bled through unchanged from
    // index.html's static site-wide default.
    images: ['https://dros.ai/untitled_logo_1_basic-file.png'],
  },
  twitter: {
    // Source Helmet never set any twitter:* tags, so all of these bled through
    // unchanged from index.html's static site-wide defaults.
    card: 'summary_large_image',
    images: ['https://dros.ai/untitled_logo_1_basic-file.png'],
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
  return <WebinarsPage />;
}
