import type { Metadata } from 'next';
import MortgageV2Page from '../../../src/views/MortgageV2Page';

/*
 * Mortgage Servicers industry page, live at /industry/mortgage.
 *
 * Rendered from the client mock (mortgage.html) in the DROS design system, under
 * the public /industry/* information architecture (alongside /industry/auto-finance).
 */

const title = 'DROS for Mortgage Servicers';
const description =
  'AI agents for mortgage default servicing. Early-stage reminders, document follow-up and specialist scheduling, on voice, text and email. DROS makes the contact. Your team makes every decision.';
const path = '/industry/mortgage';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: path,
    type: 'website',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
    title,
    description,
  },
};

export default function Page() {
  return <MortgageV2Page />;
}
