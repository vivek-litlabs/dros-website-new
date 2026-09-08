import type { Metadata } from 'next';
import CollectionsAIWorkshop from '../../src/views/CollectionsAIWorkshop';

const title = 'The Collections AI Workshop - Improve RPC, PTP and Recovery | DROS';
const description =
  "A free 2-hour live workshop for collection agency owners and ops leaders. Map your agency's AI gaps and leave with a 90-day plan - June 4, 2026.";
const path = '/collections-ai-workshop';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    // Source Helmet's og:description intentionally differs from the page description
    // (shorter, no date) — reproduced verbatim, not normalised.
    title,
    description:
      'A free 2-hour live workshop for collection agency owners and ops leaders. Map your AI gaps and leave with a 90-day plan.',
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
  return <CollectionsAIWorkshop />;
}
