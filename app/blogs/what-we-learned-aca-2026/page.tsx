import type { Metadata } from 'next';
import BlogPostACA2026 from '../../../src/views/BlogPostACA2026';

const title = 'What We Learned at ACA International Convention 2026';
const description =
  'DROS spent three days at Booth #403 at ACA International Convention 2026 in Orlando. Here is what collections leaders told us about inbound demand, compliance, and the digital shift in debt collection.';
const path = '/blogs/what-we-learned-aca-2026';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'Field notes from three days at Booth #403: inbound demand, compliance as the first question, and why consumers may prefer talking to AI about debt.',
    url: path,
    type: 'website',
    images: ['https://dros.ai/blog/aca-2026-conference-session.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://dros.ai/blog/aca-2026-conference-session.jpg'],
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
  return <BlogPostACA2026 />;
}
