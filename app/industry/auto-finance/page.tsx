import type { Metadata } from 'next';
import AutoFinanceV2Page from '../../../src/views/AutoFinanceV2Page';

/*
 * Auto Finance industry page, live at /industry/auto-finance.
 *
 * Rendered from the client mock (indexxx.html) in the DROS design system. It is
 * independent of the legacy /auto-finance page and lives under the public
 * /industry/* information architecture.
 */

const title = 'DROS for Auto Finance';
const description =
  'AI agents for auto loan collections. Voice, text and email across your whole delinquent book - inside your rules, on top of your servicing platform.';
const path = '/industry/auto-finance';

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
  return <AutoFinanceV2Page />;
}
