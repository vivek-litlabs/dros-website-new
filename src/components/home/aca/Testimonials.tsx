import { motion } from 'framer-motion';
import AcaContainer from './AcaContainer';

interface Quote {
  text: string;
  name: string;
  detail: string;
  tag: string;
}

const QUOTES: Quote[] = [
  {
    text:
      "After going live with DROS, our right-party contact rate lifted 7x compared to our previous dialer-only approach. We're reaching more customers in the first contact window than we ever could manually.",
    name: 'VP of Collections',
    detail: 'Utah-based consumer finance company ~15,000 outbound calls/day',
    tag: 'Consumer Finance',
  },
  {
    text:
      'DROS has been a game changer for collections engagement - the promise-to-pay follow-up alone recovered accounts we would have written off.',
    name: 'Darryl Brown',
    detail: 'Principal, Greystone & Associates',
    tag: 'Collection Agency',
  },
];

/* Decorative quotation-mark glyph in the brand purple. */
function QuoteMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 32" aria-hidden="true" className={className} fill="currentColor">
      <path d="M0 32V17.6C0 12.3 1.3 8 3.9 4.8 6.5 1.6 10.4 0 15.6 0v6.4c-2.7 0-4.6.8-5.9 2.4-1.3 1.6-1.9 3.7-1.9 6.4H15V32H0Zm24.4 0V17.6c0-5.3 1.3-9.6 3.9-12.8C30.9 1.6 34.8 0 40 0v6.4c-2.7 0-4.6.8-5.9 2.4-1.3 1.6-1.9 3.7-1.9 6.4H40V32H24.4Z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-base py-20 md:py-28">
      <AcaContainer>
        <div className="flex flex-col gap-20 md:gap-28">
          {QUOTES.map((q) => (
            <motion.figure
              key={q.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Quote marks flank the paragraph at the section's outer edges,
                  not the narrower centered text column (matches Figma). */}
              <QuoteMark className="absolute left-0 top-0 h-9 w-11 text-[#c026d3] sm:h-12 sm:w-14" />
              <QuoteMark className="absolute right-0 top-1/2 h-9 w-11 -translate-y-1/2 rotate-180 text-[#c026d3] sm:h-12 sm:w-14" />

              <div className="mx-auto max-w-[820px] text-center">
                <blockquote className="font-grotesk text-[clamp(1.6rem,3.2vw,2.6rem)] font-bold leading-[1.3] tracking-[-0.01em] text-white">
                  {q.text}
                </blockquote>

                <figcaption className="mt-10">
                  <div className="font-inter text-[1.05rem] font-semibold text-white">{q.name}</div>
                  <div className="mt-1.5 font-inter text-[0.9rem] text-white/50">{q.detail}</div>
                  <span className="mt-4 inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 font-inter text-[0.78rem] text-white/70">
                    {q.tag}
                  </span>
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </div>
      </AcaContainer>
    </section>
  );
}
