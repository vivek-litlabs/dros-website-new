'use client';
import Link from 'next/link';

/*
 * Page-specific footer for the Coverage Gap Assessment landing page, taken
 * from the original landing HTML (not the shared Footer).
 */
export default function CoverageFooter() {
  const linkClass =
    'text-ink/80 underline-offset-4 transition-colors hover:text-accent hover:underline';

  return (
    <footer className="border-t border-white/[0.06] bg-base py-8 text-[13px] text-ink/55">
      <div className="mx-auto flex w-full max-w-container flex-wrap items-center justify-between gap-4 px-6 sm:px-10 lg:px-14">
        <div>
          © {new Date().getFullYear()} Vodex AI Inc. · DROS AI - the AI-native engagement OS for
          debt collections. ·{' '}
          <a href="mailto:sales@vodex.ai" className={linkClass}>
            sales@vodex.ai
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-x-2">
          <Link href="/" className={linkClass}>
            dros.ai
          </Link>
          <span aria-hidden="true">·</span>
          <a href="https://vodex.ai" rel="noopener" className={linkClass}>
            vodex.ai
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={linkClass}
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
