import { useState } from 'react';

/*
 * Shared full-bleed hero background image + darkening gradient, used by
 * every image-backed hero (Pricing, who-we-serve pages, resources hub).
 * Loads eager + high priority since it's always the LCP element, and
 * cross-fades in on load instead of popping in after the hero text and
 * causing a jarring double-render.
 */
export default function HeroBg({ image }: { image: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div aria-hidden="true" className="absolute inset-0 z-0">
      <img
        src={image}
        alt=""
        fetchPriority="high"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 [background:linear-gradient(180deg,rgba(4,7,15,0.35)_0%,rgba(4,7,15,0.82)_100%)]" />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
