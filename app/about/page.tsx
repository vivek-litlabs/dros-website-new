import type { Metadata } from 'next';
import AboutUs from '../../src/views/AboutUs';

const title = 'About DROS | AI-Native Engagement OS for Collections';
const description =
  'Learn how DROS is building an AI-native engagement operating system for collections teams, debt buyers, and first-party recovery operations.';
const path = '/about';

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
    // Same bleed-through: index.html's static <meta name="title"> and twitter:url
    // were never overridden by this page's Helmet, so they remained the root's values.
    title: 'AI Agents for Collections | DROS AI',
    'twitter:url': 'https://dros.ai/',
  },
};

export default function Page() {
  return <AboutUs />;
}
