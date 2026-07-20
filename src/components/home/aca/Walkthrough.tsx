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

        <div className="relative mx-auto flex max-w-[1300px] flex-col items-center px-6 py-20 text-center md:py-24">
          <div className="mb-6 font-inter text-[0.8rem] italic tracking-wide text-white/55">
            LIVE PLATFORM
          </div>
          <h2 className="font-grotesk text-[clamp(2.4rem,5.4vw,5.15rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white">
            Want the full walkthrough?
          </h2>
          <p className="mt-5 max-w-[520px] font-inter text-[1.02rem] leading-[1.6] text-white/80">
            Ask our team at booth#403. Anshul will open the live DROS platform and walk you through
            your specific use case in real time.
          </p>
          <a
            href="https://app.dros.ai"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCta('walkthrough_open_app')}
            className="mt-9 inline-flex items-center gap-2.5 rounded bg-white px-6 py-3.5 font-inter text-[0.95rem] font-semibold text-[#0C1E45] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Open App.dros.ai
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
