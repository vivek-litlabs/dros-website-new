import type { Metadata } from 'next';
import PaymentReminders from '../../../src/views/PaymentReminders';

const title = 'AI Voice Agent for Payment Reminders | DROS';
const description =
  'DROS AI voice agents automate payment reminder calls at scale - pre-due nudges, past-due outreach, PTP follow-ups. Compliant with FDCPA, TCPA & Reg F. Used by first-party collections, BNPL, healthcare, auto finance & utilities teams.';
const path = '/use-cases/ai-voice-agent-payment-reminders';

export const metadata: Metadata = {
  title,
  description,
  robots: 'index, follow',
  alternates: { canonical: path },
  openGraph: {
    title,
    description: 'Automate payment reminder calls at scale - pre-due nudges, past-due outreach, and PTP follow-ups. Compliant, consistent, 24/7.',
    url: path,
    type: 'website',
    siteName: 'DROS',
    // Source Helmet block never set og:image; this bled through unchanged from
    // index.html's static site-wide default. Reproduced verbatim.
    images: ['https://dros.ai/untitled_logo_1_basic-file.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: 'Automate payment reminder calls at scale - pre-due nudges, past-due outreach, and PTP follow-ups. FDCPA, TCPA & Reg F compliant.',
    // Source Helmet block never set twitter:image; this bled through unchanged from
    // index.html's static site-wide default. Reproduced verbatim.
    images: ['https://dros.ai/untitled_logo_1_basic-file.png'],
  },
  other: {
    // meta[name="title"] was never set by the source Helmet block either; it bled
    // through unchanged from index.html's static site-wide default. Reproduced verbatim.
    title: 'AI Agents for Collections | DROS AI',
    'twitter:url': 'https://dros.ai/',
  },
};

export default function Page() {
  return <PaymentReminders />;
}
