import type { Metadata } from 'next';
import { Suspense } from 'react';
import '../src/index.css';
import ScrollRestoration from './scroll-restoration';
import SiteAnalytics from './site-analytics';

export const metadata: Metadata = {
  metadataBase: new URL('https://dros.ai'),
  title: 'AI Agents for Collections | DROS AI',
  description:
    'AI-native engagement OS for collections. Automate outreach, improve recovery rates, and manage first- and third-party collections with intelligent AI agents.',
  icons: { icon: '/DROS_symbol_1_(1).svg' },
  verification: { google: 'fW9HheaqVWqVxl5hb4v_W-QhSPVt1BYPUQJQ33qHQTw' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Saans is self-hosted via @font-face in src/index.css. Preload the LCP weight,
            exactly as index.html does. Do NOT replace this with next/font — the
            @font-face carries a load-bearing ascent-override: 90%. */}
        <link
          rel="preload"
          href="/fonts/saans/saans-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
          media="print"
          // eslint-disable-next-line react/no-unknown-property
          onLoad={undefined}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@1&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
          media="print"
          onLoad={undefined}
        />
        {/* The media="print" -> "all" swap must run without React, matching index.html. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.querySelectorAll('link[media="print"]').forEach(function(l){l.onload=function(){this.media='all'};});`,
          }}
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@1&family=Space+Grotesk:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </noscript>
      </head>
      <body>
        <ScrollRestoration />
        <Suspense fallback={null}>
          <SiteAnalytics />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
