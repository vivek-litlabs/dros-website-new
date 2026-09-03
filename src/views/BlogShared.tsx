import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Section, Container, Heading, Button } from '../components/ui';
import { SpinButton } from '../components/home/PostCTA';
import { springStd } from '../lib/motion';
import { trackCta } from '../lib/analytics';

/** Same full-bleed photo + dark overlay + two-pill layout as the homepage PostCTA section. */
export function BlogCtaBand() {
  return (
    <Section tone="base" className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img
          src="/airfoil/post-cta.jpg"
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <Container wide className="relative">
        <motion.div
          className="flex flex-col items-center gap-8 text-center md:gap-10"
          initial={{ opacity: 0.001, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springStd}
        >
          <Heading as="h2" size="display-lg" className="mx-auto max-w-[18ch]">
            Ready to put collections on autopilot?
          </Heading>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              to="/book-meeting"
              onClick={() => trackCta('Book a Meeting - blog-cta')}
            >
              Book a Meeting
            </Button>
            <SpinButton to="/contact" onClick={() => trackCta('Talk to Sales - blog-cta')}>
              Talk to Sales
            </SpinButton>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

export interface BlogCardData {
  title: string;
  slug?: string;
  externalUrl?: string;
  image: string;
  date: string;
  badge?: 'Featured' | 'External' | 'New';
}

export function BlogPostCard({ post }: { post: BlogCardData }) {
  const inner = (
    <>
      <div className="relative">
        <img
          src={post.image}
          alt=""
          loading="lazy"
          className="aspect-[409/271] w-full rounded-lg object-cover"
        />
        {post.badge && (
          <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {post.badge}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 pl-2 pt-5">
        <h4 className="line-clamp-2 font-saans text-xl font-light leading-[1.15] tracking-[-0.03em] text-black md:text-[22px]">
          {post.title}
        </h4>
        <span className="text-sm text-black/40">{post.date}</span>
      </div>
    </>
  );

  if (post.externalUrl) {
    return (
      <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" className="group flex flex-col">
        {inner}
      </a>
    );
  }
  return (
    <Link to={post.slug!} className="group flex flex-col">
      {inner}
    </Link>
  );
}
