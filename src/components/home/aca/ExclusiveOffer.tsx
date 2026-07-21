import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AcaContainer from './AcaContainer';

const BULLETS = ['No setup fees', 'Live on your accounts in under a week', 'Cancel anytime'];

export default function ExclusiveOffer() {
  return (
    <section id="offer" className="bg-base py-20 md:py-28">
      <AcaContainer>
        <div className="mb-10 font-inter text-[0.8rem] italic tracking-wide text-white/40">
          \ ACA EXCLUSIVE OFFER
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="max-w-[15ch] font-grotesk text-[clamp(2.1rem,5vw,4.8rem)] font-bold leading-[1.06] tracking-[-0.02em] text-white">
              Claim 2,000 free AI calling minutes.
            </h2>
            <p className="mt-6 max-w-[420px] font-inter text-[1.02rem] leading-[1.6] text-white/55">
              No setup fees. Live on your own accounts in under a week. One redemption per company,
              ACA attendees only.
            </p>
            <Link
              to="/book-meeting"
              className="mt-8 inline-flex items-center gap-1.5 font-inter text-[0.95rem] font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
            >
              Terms &amp; conditions apply
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Right - offer card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="relative overflow-hidden rounded-3xl p-8 shadow-[0_30px_80px_-30px_rgba(120,60,220,0.5)] sm:p-10"
          >
            <img
              src="/aca/offer-bg.png"
              alt=""
              loading="lazy"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/15" />
            <div className="relative">
              <div className="font-grotesk text-[clamp(2.8rem,5.5vw,4.2rem)] font-bold leading-none text-white">
                2,000
              </div>
              <div className="mt-2 font-grotesk text-[1.35rem] font-medium text-white/95">
                free AI calling minutes.
              </div>

              <ul className="mt-7 space-y-3">
                {BULLETS.map((b) => (
                  <li key={b} className="flex items-center gap-3 font-inter text-[1.02rem] text-white/95">
                    <Check className="h-4.5 w-4.5 shrink-0 text-white" strokeWidth={2.5} />
                    {b}
                  </li>
                ))}
              </ul>

              <a
                href="https://dros-leads.bolt.host/submit-lead?event=6d4aedc3-ad73-474a-96ef-0ceb214b3652"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-inter text-[0.98rem] font-semibold text-[#3a1d6e] transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                Claim my 2,000 minutes
                <ArrowRight className="h-4 w-4" />
              </a>

              <p className="mt-4 font-inter text-[0.85rem] text-white/70">
                Takes about 60 seconds . We'll follow up to get you live.
              </p>
            </div>
          </motion.div>
        </div>
      </AcaContainer>
    </section>
  );
}
