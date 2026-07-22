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
    <section className="bg-base py-16 md:py-28">
      <AcaContainer>
        <div className="flex flex-col gap-16 md:gap-28">
          {QUOTES.map((q) => (
            <motion.figure
              key={q.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* On md+ the quote marks flank the paragraph at the section's outer
                  edges (matches Figma). On narrow screens the text column fills the
                  full width, so absolute marks would sit on top of the words -
                  there they stack above/below the quote instead. */}
              <QuoteMark className="mx-auto block h-8 w-10 text-[#c026d3] md:absolute md:left-0 md:top-0 md:mx-0 md:h-12 md:w-14" />

              <div className="mx-auto mt-5 max-w-[820px] text-center md:mt-0">
                <blockquote className="font-grotesk text-[clamp(1.35rem,5.2vw,2.6rem)] font-bold leading-[1.32] tracking-[-0.01em] text-white">
                  {q.text}
                </blockquote>

                <figcaption className="mt-8 md:mt-10">
                  <div className="font-inter text-[1rem] font-semibold text-white sm:text-[1.05rem]">{q.name}</div>
                  <div className="mt-1.5 font-inter text-[0.85rem] text-white/50 sm:text-[0.9rem]">{q.detail}</div>
                  <span className="mt-4 inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 font-inter text-[0.78rem] text-white/70">
                    {q.tag}
                  </span>
                </figcaption>
              </div>

              <QuoteMark className="mx-auto mt-6 block h-8 w-10 rotate-180 text-[#c026d3] md:absolute md:right-0 md:top-1/2 md:mx-0 md:mt-0 md:h-12 md:w-14 md:-translate-y-1/2" />
            </motion.figure>
          ))}
        </div>
      </AcaContainer>
    </section>
  );
}
