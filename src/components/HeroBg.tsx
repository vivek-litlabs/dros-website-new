import { useEffect, useRef, useState } from 'react';

/*
 * Shared full-bleed hero background image + darkening gradient, used by
 * every image-backed hero (Pricing, who-we-serve pages, resources hub).
 * Loads eager + high priority since it's always the LCP element, and
 * cross-fades in on load instead of popping in after the hero text and
 * causing a jarring double-render.
 *
 * `onLoad` alone misses the case where the browser serves the image from
 * cache synchronously (byte-cache-hit): the native `load` event can fire
 * before React finishes attaching the listener, so `loaded` never flips
 * and the image stays permanently at opacity-0. The effect below checks
 * `img.complete` once after mount to catch that case without changing the
 * fade-in behaviour for a genuinely uncached load.
 */
export default function HeroBg({ image }: { image: string }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 z-0">
      <img
        ref={imgRef}
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
