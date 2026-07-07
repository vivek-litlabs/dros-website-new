import type { ReactNode } from 'react';
import { Container } from './ui';
import Reveal from './Reveal';

/*
 * Shared hero for resources-hub pages (Newsroom, Contact, Customer Stories,
 * Events, Webinars, Videos) so every entry point off the Resources nav
 * shares the same image-background, two-tone heading treatment as the
 * homepage hero and the who-we-serve pages.
 */

export default function ResourceHero({
  image,
  badge,
  headingLines,
  subtext,
  cta,
}: {
  image: string;
  badge: string;
  headingLines: [string, string];
  subtext: string;
  cta?: ReactNode;
}) {
  return (
    <header
      data-nav-theme="dark"
      className="relative flex h-screen min-h-[560px] w-full items-center justify-center overflow-hidden bg-base text-white"
    >
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <img loading="lazy" decoding="async" src={image} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 [background:linear-gradient(180deg,rgba(4,7,15,0.35)_0%,rgba(4,7,15,0.82)_100%)]" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <Container wide className="relative z-40">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs text-white/85 backdrop-blur-md">
              {badge}
            </span>
          </Reveal>

          <Reveal large>
            <h1 className="font-saans text-[36px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[48px] xl:text-[56px]">
              <span className="block text-white">{headingLines[0]}</span>
              <span className="block text-white/55">{headingLines[1]}</span>
            </h1>
          </Reveal>

          <Reveal>
            <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
              {subtext}
            </p>
          </Reveal>

          {cta && (
            <Reveal delay={0.1} className="flex flex-wrap justify-center gap-3">
              {cta}
            </Reveal>
          )}
        </div>
      </Container>
    </header>
  );
}
