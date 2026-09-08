import type { Metadata } from 'next';
import VoiceAgentsPage from '../../../src/views/features/context-aware-voice-ai-agents-for-debt-collection';

const title = 'AI Voice Agents for Debt Collection & Recovery — DROS';
const description =
  'Context-aware AI voice agents for debt collection. Every call starts with full account history, FDCPA compliance guardrails, and automatic human handoff. Inbound and outbound.';
const path = '/features/context-aware-voice-ai-agents-for-debt-collection';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'Every call starts with account history, compliance guardrails, and human handoff logic built in. Inbound and outbound AI voice agents for collections.',
    url: path,
    type: 'website',
    // Source Helmet block never set og:image; this bled through unchanged from
    // index.html's static site-wide default. Reproduced verbatim.
    images: ['https://dros.ai/untitled_logo_1_basic-file.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://dros.ai/untitled_logo_1_basic-file.png'],
    // Source Helmet block never set twitter:title/description/url; these bled through
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
  return <VoiceAgentsPage />;
}
