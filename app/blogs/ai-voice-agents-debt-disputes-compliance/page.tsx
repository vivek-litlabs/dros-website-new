import type { Metadata } from 'next';
import BlogPostAIVoiceAgents from '../../../src/views/BlogPostAIVoiceAgents';

const title = 'How AI Voice Agents Handle Debt Disputes Without Creating Compliance Risk';
const description =
  'Learn how AI voice agents should handle debt disputes, when to escalate to a human, and how DROS supports compliant dispute workflows end to end.';
const path = '/blogs/ai-voice-agents-debt-disputes-compliance';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'Learn how AI voice agents should handle debt disputes, when to escalate to a human, and how DROS supports compliant dispute workflows end to end.',
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
  return <BlogPostAIVoiceAgents />;
}
