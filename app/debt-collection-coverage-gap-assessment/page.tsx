import type { Metadata } from 'next';
import DebtCollectionCoverageGapAssessment from '../../src/views/DebtCollectionCoverageGapAssessment';

const title = 'The Coverage Gap Assessment for Collection Teams | DROS';
const description =
  "Take the 2-minute Coverage Gap Assessment: find out how much of your paper never gets a compliant right-party contact, what it's costing you, and the one fix that closes it.";
const path = '/debt-collection-coverage-gap-assessment';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    // og:title/og:description are deliberately punchier than the page title and
    // description — carried over verbatim from the page's original Helmet block.
    title: 'How much of your paper never hears from you? - DROS Coverage Gap Assessment',
    description:
      '7 quick questions. See the accounts your collectors never reach, the dollars sitting in them, and where the leak is.',
    url: path,
    type: 'website',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
  },
};

export default function Page() {
  return <DebtCollectionCoverageGapAssessment />;
}
