import type { Metadata } from 'next';
import TrustCenter from '../../src/views/TrustCenter';

const title = 'Trust Center | Security, Compliance & Privacy at DROS AI';
const description =
  'DROS AI is ISO 27001, SOC 2 Type II, ISO 42001 and HIPAA certified. Review our security practices, subprocessors and compliance documentation, or request a certificate under NDA.';
const ogDescription =
  'ISO 27001, SOC 2 Type II, ISO 42001 and HIPAA. Security practices, subprocessors and compliance documentation.';
const path = '/trust-center';

export const metadata: Metadata = {
  title,
  description,
  keywords:
    'DROS trust center, ISO 27001 certified collections software, SOC 2 Type II debt collection, ISO 42001 AI management system, HIPAA compliant collections platform, subprocessors, data encryption, AI governance, security practices, request SOC 2 report',
  alternates: { canonical: path },
  openGraph: {
    title,
    description: ogDescription,
    url: path,
    type: 'website',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
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
  return <TrustCenter />;
}
