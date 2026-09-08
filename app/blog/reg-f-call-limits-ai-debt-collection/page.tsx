import type { Metadata } from 'next';
import BlogPostRegFCallLimits from '../../../src/views/BlogPostRegFCallLimits';

const title = 'How Reg F Call Limits and Call Hours Work in AI Debt Collection';
const description =
  'Understand FDCPA call-hour rules, Reg F\'s 7-in-7 limit, and how AI collections software can apply them consistently with built-in settings.';
const path = '/blog/reg-f-call-limits-ai-debt-collection';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'Understand FDCPA call-hour rules, Reg F\'s 7-in-7 limit, and how AI collections software can apply them consistently with built-in settings.',
    url: path,
    type: 'website',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
    // The source Helmet block never set twitter:title/description/url, so on the Vite
    // site these bled through unchanged from index.html's static site-wide defaults.
    // Reproduced verbatim here rather than treated as a gap.
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
  return <BlogPostRegFCallLimits />;
}
