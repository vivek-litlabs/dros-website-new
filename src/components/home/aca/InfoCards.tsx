import { Monitor, User } from 'lucide-react';
import { motion } from 'framer-motion';
import AcaContainer from './AcaContainer';

const CARDS = [
  {
    icon: Monitor,
    title: 'WHAT IS DROS',
    body:
      'An AI execution layer that sits on top of your existing dialer and CRM. Not a replacement - the intelligence approach that actually runs collections outreach, end to end.',
    ring: 'ring-[#8b5cf6]/60',
    iconRing: 'border-[#8b5cf6]/70 text-[#a970ff]',
    glow: 'shadow-[0_30px_80px_-40px_rgba(139,92,246,0.6)]',
  },
  {
    icon: User,
    title: 'ANSHUL SHRIVASTAVA',
    body:
      'Co-Founder & CEO of Vodex AI Inc. Building AI-native collections infrastructure for US-based agencies and enterprise teams. At Booth #403 all three days for in-person walkthroughs.',
    ring: 'ring-[#03D2FC]/50',
    iconRing: 'border-[#03D2FC]/60 text-[#03D2FC]',
    glow: 'shadow-[0_30px_80px_-40px_rgba(3,210,252,0.5)]',
  },
];

export default function InfoCards() {
  return (
    <section className="bg-base pb-24 pt-4 md:pb-28">
      <AcaContainer>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                className={`bg-[#0B0B0D] p-6 ring-1 ring-inset sm:p-8 ${c.ring} ${c.glow}`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${c.iconRing}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-grotesk text-[1.2rem] font-bold tracking-[-0.01em] text-white sm:mt-6 sm:text-[1.4rem]">
                  {c.title}
                </h3>
                <p className="mt-3.5 max-w-[42ch] font-inter text-[0.96rem] leading-[1.6] text-white/60 sm:mt-4 sm:text-[1.02rem]">
                  {c.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </AcaContainer>
    </section>
  );
}
