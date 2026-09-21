import type { Metadata } from 'next';
import BlogPostAIReadinessChecklist from '../../../src/views/BlogPostAIReadinessChecklist';

const title = 'Voice AI Readiness Checklist for Debt Collection Teams';
const description =
  'Twelve questions that decide whether your voice AI evaluation reaches procurement, and the three that are non-negotiable. Interactive, scored, no email required.';
const path = '/blogs/ai-readiness-checklist-collection-agencies';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'Twelve questions that decide whether your voice AI evaluation reaches procurement, and the three that are non-negotiable. Interactive, scored, no email required.',
    url: path,
    type: 'article',
    images: ['https://dros.ai/blog/ai-readiness-checklist.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://dros.ai/blog/ai-readiness-checklist.jpg'],
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
  return <BlogPostAIReadinessChecklist />;
}
