import { motion } from 'framer-motion';
import AcaContainer from './AcaContainer';

const STATS = [
  { value: '15K+', label: 'Outbound calls | One deployment | One Day', gradient: true },
  { value: '7X', label: 'Right party contact rate lift vs prior Dialer-Only approach' },
  { value: '1st', label: 'Contact window - More Debtors Reached before rivals can retry' },
];

export default function StatsRow() {
  return (
    <section className="bg-base pb-4 pt-4 md:pb-8">
      <AcaContainer>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              className={`relative flex min-h-[220px] flex-col justify-between overflow-hidden p-6 sm:min-h-[280px] sm:p-7 ${
                s.gradient ? '' : 'border border-white/10 bg-[#111214]'
              }`}
            >
              {s.gradient && (
                <>
                  <img
                    src="/aca/hero-bg.png"
                    alt=""
                    loading="lazy"
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </>
              )}
              <div
                className={`relative font-grotesk text-[clamp(3rem,11vw,6.5rem)] font-bold leading-none tracking-[-0.02em] sm:text-[clamp(3.8rem,7vw,6.5rem)] ${
                  s.gradient ? 'text-white' : 'text-white'
                }`}
              >
                {s.value}
              </div>
              <div className="relative mt-5 max-w-[24ch] font-inter text-[0.9rem] leading-[1.4] text-white/85 sm:mt-6 sm:text-[0.95rem]">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </AcaContainer>
    </section>
  );
}
