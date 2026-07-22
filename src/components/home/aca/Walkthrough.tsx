import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackCta } from '../../../lib/analytics';

/*
 * Full-bleed, square-cornered band (per Figma's guide-line frame - the blue
 * gradient runs edge to edge, not an inset rounded card). Vertical black gaps
 * come from the section's own padding, not a Container wrapper.
 */
export default function Walkthrough() {
  return (
    <section className="bg-base py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full overflow-hidden"
      >
        <img
          src="/aca/walkthrough-bg.png"
          alt=""
          loading="lazy"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative mx-auto flex max-w-[1300px] flex-col items-center px-5 py-16 text-center sm:px-6 sm:py-20 md:py-24">
          <div className="mb-5 font-inter text-[0.8rem] italic tracking-wide text-white/55 sm:mb-6">
            LIVE PLATFORM
          </div>
          <h2 className="font-grotesk text-[clamp(1.95rem,7.5vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-[clamp(2.6rem,5.4vw,5.15rem)] md:leading-[1.05]">
            Want the full walkthrough?
          </h2>
          <p className="mt-5 max-w-[520px] font-inter text-[0.98rem] leading-[1.6] text-white/80 sm:text-[1.02rem]">
            Ask our team at booth#403. Anshul will open the live DROS platform and walk you through
            your specific use case in real time.
          </p>
          <a
            href="https://app.dros.ai"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCta('walkthrough_open_app')}
            className="mt-8 inline-flex items-center justify-center gap-2.5 rounded bg-white px-6 py-3.5 sm:mt-9 font-inter text-[0.95rem] font-semibold text-[#0C1E45] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Open App.dros.ai
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
