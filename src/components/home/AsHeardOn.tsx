import { useState } from 'react';
import { Play } from 'lucide-react';
import { Section, Container } from '../ui';
import Reveal from '../Reveal';
import VideoModal from '../../views/VideoModal';
import { trackCta } from '../../lib/analytics';

/*
 * "As heard on" strip directly under the hero: one podcast appearance as a
 * card that opens the episode in a video dialog, plus the events line.
 */

const EPISODE = {
  videoId: '15c13oHQTeI',
  show: 'The Receivables Podcast with Adam Parks',
  title: 'AI Without Context Fails',
  description:
    'Anshul Shrivastava of Vodex.ai on why AI in collections fails without cross-channel context, and how DROS unifies voice, SMS, email, and chat into one compliant, context-aware operating model.',
  thumbnail: '/home/receivables-podcast-ep280.jpg',
};

const EVENTS = 'RMAI, ACA, Money 20/20, Fintech Meetup, Finovate';

export default function AsHeardOn() {
  const [open, setOpen] = useState(false);

  return (
    <Section id="as-heard-on" tone="light" spacing="sm">
      <Container>
        <Reveal className="mx-auto flex max-w-[1000px] flex-col items-center">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-ink-grey">As heard on</p>

          <div className="group relative mt-10 flex w-full flex-col gap-6 rounded-card border border-line-dark bg-white p-5 shadow-[0_2px_10px_rgba(12,30,69,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-16px_rgba(12,30,69,0.22)] sm:p-8 md:flex-row md:items-center md:gap-9">
            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-line-dark md:w-[300px]">
              <img
                src={EPISODE.thumbnail}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
              />
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink-dark shadow-[0_8px_24px_rgba(12,30,69,0.25)] transition-transform duration-300 group-hover:scale-110"
              >
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </span>
            </div>

            <div className="flex min-w-0 flex-col gap-3">
              <p className="text-[0.8rem] font-medium uppercase tracking-[0.1em] text-ink-grey">
                {EPISODE.show}
              </p>
              <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-ink-dark">
                {/* The ::after stretches this button over the whole card. */}
                <button
                  type="button"
                  onClick={() => {
                    trackCta('home_podcast_play');
                    setOpen(true);
                  }}
                  aria-haspopup="dialog"
                  className="rounded-sm text-left after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ink-dark focus-visible:after:ring-offset-2"
                >
                  <span className="sr-only">Play episode: </span>
                  {EPISODE.title}
                </button>
              </h2>
              <p className="text-base leading-relaxed text-ink-grey sm:text-lg">{EPISODE.description}</p>
            </div>
          </div>

          <p className="mt-10 text-center text-base text-ink-grey sm:text-lg">
            Find us at <span className="text-ink-dark">{EVENTS}</span>, and more.
          </p>
        </Reveal>
      </Container>

      <VideoModal
        videoId={EPISODE.videoId}
        isOpen={open}
        onClose={() => setOpen(false)}
        title={`${EPISODE.title} - ${EPISODE.show}`}
      />
    </Section>
  );
}
