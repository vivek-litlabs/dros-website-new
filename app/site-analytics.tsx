'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-TT8WJVR53D');

export default function SiteAnalytics() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    const qs = search.toString();
    ReactGA.send({ hitType: 'pageview', page: pathname + (qs ? `?${qs}` : '') });
  }, [pathname, search]);

  return null;
}
