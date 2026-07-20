import type { ReactNode } from 'react';

/*
 * Homepage-specific container. The Figma frame insets content ~5% of the
 * viewport on each side (measured directly off the source file) - noticeably
 * shallower than the site-wide `Container` primitive's 1200px cap, which
 * over-indents every ACA landing section. Padding tracks viewport width via
 * clamp() so the ratio holds from laptop through wide desktop, matching the
 * same formula used on the shared Navbar.
 */
export default function AcaContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1800px] px-6 sm:px-10 lg:px-[clamp(3rem,5.2vw,6.5rem)]${
        className ? ` ${className}` : ''
      }`}
    >
      {children}
    </div>
  );
}
