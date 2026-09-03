import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
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

/**
 * index.html declared `initial-scale=1.0`; Next's implicit default emits `initial-scale=1`.
 * The two are semantically identical to every browser and have zero visual effect, but the
 * parity harness compares metadata as exact strings, so the difference would fail all 41
 * routes. Declaring it explicitly keeps the gate meaningful rather than teaching it to
 * ignore a field.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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

        {/*
          Google tag (gtag.js). NOTE: react-ga4 in app/site-analytics.tsx also
          initializes measurement ID G-TT8WJVR53D. This duplicates index.html's
          pre-existing behavior (both gtag.js here and react-ga4 fire for the
          same ID, likely double-counting pageviews). That duplication is
          reproduced deliberately as part of this port, not introduced by it —
          resolving it is a product/analytics decision, not a migration side effect.
        */}
        <Script
          id="ga-gtag-src"
          src="https://www.googletagmanager.com/gtag/js?id=G-TT8WJVR53D"
          strategy="afterInteractive"
        />
        <Script
          id="ga-gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-TT8WJVR53D');`,
          }}
        />

        {/* Microsoft Clarity */}
        <Script
          id="clarity-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      (function (c, l, a, r, i, t, y) {
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", "uqmzb4i25n");`,
          }}
        />

        {/* reb2b */}
        <Script
          id="reb2b-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function (key) {
        if (window.reb2b && window.reb2b.loaded) return;
        window.reb2b = { loaded: true };
        var s = document.createElement("script");
        s.async = true;
        s.src = "https://b2bjsstore.s3.us-west-2.amazonaws.com/b/" + key + "/" + key + ".js.gz";
        document.getElementsByTagName("script")[0].parentNode.insertBefore(s, document.getElementsByTagName("script")[0]);
      })("G4N210H0DK6Z");`,
          }}
        />

        {/* Crisp chat widget */}
        <Script
          id="crisp-loader"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `window.$crisp = window.$crisp || [];
      window.CRISP_WEBSITE_ID = "09fd1c51-2e69-4224-876c-5913f498b5da";
      var d = document, s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js"; s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);`,
          }}
        />
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
