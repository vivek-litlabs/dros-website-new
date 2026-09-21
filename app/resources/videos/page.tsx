import type { Metadata } from 'next';
import VideosPage from '../../../src/views/VideosPage';

const title = 'Video Resources | DROS Collections Insights';
const description = 'Tutorials, customer stories, and conversations to help you get the most out of DROS.';
const path = '/resources/videos';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  // Source Helmet never set any og/twitter tags for this route, so every og:*/
  // twitter:* value bled through unchanged from index.html's static site-wide
  // defaults (including og:url pointing at the root, not this path). Reproduced
  // verbatim rather than treated as a gap.
  openGraph: {
    title: 'AI Agents for Collections | DROS AI',
    description:
      'AI-native engagement OS for collections. Automate outreach, improve recovery rates, and manage first- and third-party collections with intelligent AI agents.',
    type: 'website',
    images: ['https://dros.ai/untitled_logo_1_basic-file.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://dros.ai/untitled_logo_1_basic-file.png'],
    title: 'AI Agents for Collections | DROS AI',
    description:
      'AI-native engagement OS for collections. Automate outreach, improve recovery rates, and manage first- and third-party collections with intelligent AI agents.',
  },
  other: {
    title: 'AI Agents for Collections | DROS AI',
    // Next's URL resolver strips the trailing slash from a root absolute URL
    // passed via openGraph.url, so it's set here instead to reproduce the
    // baseline's literal "https://dros.ai/" byte-for-byte.
    'og:url': 'https://dros.ai/',
    'twitter:url': 'https://dros.ai/',
  },
};

export default function Page() {
  return <VideosPage />;
}
