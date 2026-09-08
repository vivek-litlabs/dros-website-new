import { Sparkles, ArrowRight, X } from 'lucide-react';

/* Kept in sync with the spacer height in Navbar.tsx and the nav's fixed
   `top` offset — all three must share this exact height so the banner,
   the space it reserves in flow, and the header sitting below it never
   drift out of sync. */
export const BANNER_HEIGHT_CLASS = 'min-h-[64px] sm:min-h-11';

/* Versioned so a future, different announcement isn't hidden by a stale
   dismissal of this one. */
export const BANNER_STORAGE_KEY = 'dros-banner-dismissed:adoption-gap-report-2026';

interface AnnouncementBannerProps {
  onClose: () => void;
}

export default function AnnouncementBanner({ onClose }: AnnouncementBannerProps) {
  return (
    <div
      className={`fixed top-0 z-[60] flex w-full items-center justify-center bg-[#03D2FC] px-10 py-2 text-center sm:px-12 ${BANNER_HEIGHT_CLASS}`}
    >
      <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-xs font-medium leading-snug text-[#0C1E45] sm:text-sm">
        <Sparkles className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        <span>The State of AI in Collections 2026 is here.</span>
        <a
          href="https://www.dros.ai/blogs/ai-readiness-checklist-collection-agencies"
          className="group inline-flex items-center gap-0.5 underline underline-offset-2"
        >
          Explore the Adoption Gap Report
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </p>
      <button
        onClick={onClose}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[#0C1E45]/70 transition-colors hover:bg-[#0C1E45]/10 hover:text-[#0C1E45] sm:right-4"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
