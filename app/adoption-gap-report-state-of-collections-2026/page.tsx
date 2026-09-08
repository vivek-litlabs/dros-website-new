import type { Metadata } from 'next';
import AdoptionGapReport2026 from '../../src/views/AdoptionGapReport2026';

const title = 'The Adoption Gap: The State of AI in Collections 2026 | DROS';
const description =
  'A field report on why debt collection teams are ready for AI voice and what is actually standing between them and deployment. Eight findings from 25+ conversations with operators, and a read on where the market actually sits.';
const path = '/adoption-gap-report-state-of-collections-2026';

export const metadata: Metadata = {
  title,
  description,
  keywords:
    'state of AI in debt collections, AI adoption collections report, AI voice agents collections, debt collection AI research, ARM industry AI report 2026',
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: path,
    type: 'article',
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
    title: 'AI Agents for Collections | DROS AI',
    'twitter:url': 'https://dros.ai/',
  },
};

export default function Page() {
  return <AdoptionGapReport2026 />;
}
