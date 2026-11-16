import type { Metadata } from 'next';
import AutoFinanceV2Page from '../../src/views/AutoFinanceV2Page';

/*
 * Second, independent Auto Finance page (/auto-finance-v2).
 *
 * Built from the client mock in indexxx.html and rendered in the DROS design
 * system. It is fully independent of /auto-finance (which is untouched) and is
 * NOT part of the Who We Serve information architecture or the Navbar dropdown.
 *
 * `robots: noindex` keeps it out of search while it lives outside the public IA.
 */

const title = 'DROS for Auto Finance';
const description =
  'AI agents for auto loan collections. Voice, text and email across your whole delinquent book - inside your rules, on top of your servicing platform.';
const path = '/auto-finance-v2';

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
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
