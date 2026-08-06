import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, User } from 'lucide-react';
import { Section, Container, Heading, Eyebrow } from '../ui';
import { fadeUp } from '../../lib/motion';
import { trackCta } from '../../lib/analytics';
import { composePhone, demoCallErrorMessage, isAllowedPhone, triggerDemoCall } from '../../lib/api';
import { COUNTRIES, defaultCountryIso } from '../../lib/countries';
import CountryCodeSelect from '../CountryCodeSelect';
import Recaptcha, { type RecaptchaHandle } from '../Recaptcha';
import VoiceCallModal from './VoiceCallModal';

interface DemoWidgetProps {
  subtext?: string;
}

export default function DemoWidget({
  subtext = "Enter your number and we will call you in 30 seconds - from an agent that already knows your company name.",
}: DemoWidgetProps = {}) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState(defaultCountryIso);
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callPhone, setCallPhone] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const recaptchaRef = useRef<RecaptchaHandle>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !token || loading) return;
    trackCta('demo_widget_call_me_now');
    setError(null);
    setLoading(true);
    const dial = COUNTRIES.find((c) => c.iso === country)?.dial ?? '1';
    const fullPhone = composePhone(dial, phone);
    if (!isAllowedPhone(fullPhone)) {
      setError(
        'We can only place demo calls to US (+1) and India (+91) numbers right now. Please check your number.',
      );
      setLoading(false);
      return;
    }
    const result = await triggerDemoCall(name.trim(), fullPhone, token);
    setLoading(false);
    // reCAPTCHA tokens are single-use and expire in ~2 min - reset after every
    // submit so the next attempt starts from a fresh tick, and re-gate the
    // button (token null). Runs while the widget is still mounted.
    recaptchaRef.current?.reset();
    setToken(null);
    if (result.ok) {
      // Only show the success state once the call was actually accepted.
      setSubmitted(true);
      setCallPhone(fullPhone);
    } else {
      setError(demoCallErrorMessage(result));
    }
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
          <p className="mt-5 text-lg text-ink-grey">{subtext}</p>

          {submitted ? (
            <div className="mx-auto mt-9 flex max-w-md items-center justify-center gap-3 rounded-card border border-accent/30 bg-accent/5 px-6 py-5 text-ink-dark">
              <CheckCircle2 className="h-5 w-5 text-ink-dark" />
              <span>Thanks - your AI agent is dialing now. Keep your phone close.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-9 flex max-w-2xl flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-grey/60" />
                  <input
                    type="text"
                    id="demo-widget-name"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    aria-label="Your name"
                    className="h-[52px] w-full rounded-btn border border-line-dark bg-white pl-11 pr-4 text-ink-dark placeholder:text-ink-grey/50 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div className="flex h-[52px] items-center gap-2.5 rounded-btn border border-line-dark bg-white pl-3 pr-4 focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/30">
                  <CountryCodeSelect
                    id="demo-widget-country"
                    tone="light"
                    value={country}
                    onChange={setCountry}
                  />
                  <input
                    type="tel"
                    inputMode="tel"
                    id="demo-widget-phone"
                    name="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="555 000 0000"
                    aria-label="Your phone number"
                    className="h-full min-w-0 flex-1 bg-transparent text-ink-dark placeholder:text-ink-grey/50 focus:outline-none"
                  />
                </div>
              </div>
              <Recaptcha ref={recaptchaRef} theme="light" onVerify={setToken} className="flex justify-center" />
              <button
                type="submit"
                disabled={loading || !token}
                className="inline-flex h-[52px] items-center justify-center gap-2 self-center rounded-btn bg-[#0C1E45] px-6 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Calling...' : (
                  <>
                    Call me now <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {error && <p className="mt-4 text-xs text-red-600">{error}</p>}
          <p className="mt-4 text-xs text-ink-grey/60">We won't spam you. This is a one-time demo call.</p>
        </motion.div>
      </Container>

      {callPhone && <VoiceCallModal phone={callPhone} onEnd={() => setCallPhone(null)} />}
    </Section>
  );
}
