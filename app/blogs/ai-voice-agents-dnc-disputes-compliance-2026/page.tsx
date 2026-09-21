import type { Metadata } from 'next';
import BlogPostDNCVoiceAgents from '../../../src/views/BlogPostDNCVoiceAgents';

const title = 'AI Voice Agents & DNC Compliance in Debt Collection';
const description =
  'How AI voice agents handle do-not-call requests, disputes, and compliance scenarios in modern debt collection workflows.';
const path = '/blogs/ai-voice-agents-dnc-disputes-compliance-2026';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'How AI voice agents handle do-not-call requests, disputes, and compliance scenarios in modern debt collection workflows.',
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
  return <BlogPostDNCVoiceAgents />;
}
