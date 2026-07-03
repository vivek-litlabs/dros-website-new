import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Section, Container, Heading, Eyebrow } from '../ui';
import { fadeUp } from '../../lib/motion';
import { trackCta } from '../../lib/analytics';

export default function DemoWidget() {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    trackCta('demo_widget_call_me_now');
    // NOTE: front-end stub only. Backend lead routing (RB2B -> Instantly ->
    // outbound AI call) is wired up separately and is out of scope here.
    setSubmitted(true);
  }

  return (
    <Section id="demo" tone="light">
      <Container className="relative">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <Eyebrow className="text-ink-grey justify-center">Hear it for yourself</Eyebrow>
          <Heading as="h2" size="display" className="mt-4 text-ink-dark">
            Want to hear what your AI collections agent sounds like?
          </Heading>
          <p className="mt-5 text-lg text-ink-grey">
            Enter your number and we will call you in 30 seconds - from an agent that already knows
            your company name.
          </p>

          {submitted ? (
            <div className="mx-auto mt-9 flex max-w-md items-center justify-center gap-3 rounded-card border border-accent/30 bg-accent/5 px-6 py-5 text-ink-dark">
              <CheckCircle2 className="h-5 w-5 text-ink-dark" />
              <span>Thanks - your AI agent is dialing now. Keep your phone close.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-grey/60" />
                <input
                  type="tel"
                  inputMode="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="h-[52px] w-full rounded-btn border border-line-dark bg-white pl-11 pr-4 text-ink-dark placeholder:text-ink-grey/50 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-btn bg-[#0C1E45] px-6 font-semibold text-white transition-opacity hover:opacity-90"
              >
                Call me now <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-ink-grey/60">We won't spam you. This is a one-time demo call.</p>
        </motion.div>
      </Container>
    </Section>
  );
}
