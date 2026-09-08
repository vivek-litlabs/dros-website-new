'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Replaces the ScrollToTop component from src/main.tsx. Renders nothing. */
export default function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // Safari fix
  }, [pathname]);

  return null;
}
