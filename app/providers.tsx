'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-TT8WJVR53D');

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  // Replaces ScrollToTop + Analytics from src/main.tsx.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // Safari fix
    const qs = search.toString();
    ReactGA.send({ hitType: 'pageview', page: pathname + (qs ? `?${qs}` : '') });
  }, [pathname, search]);

  return <>{children}</>;
}
