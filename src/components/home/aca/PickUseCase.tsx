import { useState } from 'react';
import { Phone } from 'lucide-react';
import AcaContainer from './AcaContainer';
import { composePhone, triggerDemoCall } from '../../../lib/api';
import { COUNTRIES, defaultCountryIso } from '../../../lib/countries';
import { trackCta } from '../../../lib/analytics';
import CountryCodeSelect from '../../CountryCodeSelect';
import VoiceCallModal from '../VoiceCallModal';

export default function PickUseCase() {
  const [name, setName] = useState('');
  const [country, setCountry] = useState(defaultCountryIso);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callPhone, setCallPhone] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || loading) return;
    trackCta('pick_use_case_call_me_now');
    setError(null);
    setLoading(true);
    const dial = COUNTRIES.find((c) => c.iso === country)?.dial ?? '1';
    const fullPhone = composePhone(dial, phone);
    const result = await triggerDemoCall(name.trim(), fullPhone);
    setLoading(false);
    if (result.ok) {
      setCallPhone(fullPhone);
    } else {
      setError(
        result.status
          ? `Couldn't start the call (error ${result.status}). Please try again.`
          : `Couldn't reach the call service (request blocked or network error). Disable ad/privacy blockers and try again.`,
      );
    }
  }

  const fieldWrap = 'flex flex-col gap-2';
  const labelCls = 'font-inter text-[0.9rem] font-medium text-white';
  const inputCls =
    'autofill-transparent w-full border-0 border-b border-white/15 bg-transparent pb-2 font-inter text-[0.95rem] text-white placeholder:text-white/35 focus:border-white/50 focus:outline-none';

  return (
    <section id="use-cases" className="bg-base py-20 md:py-28">
      <AcaContainer>
        <div className="mb-8 font-inter text-[0.8rem] italic tracking-wide text-white/40">LIVE DEMO</div>

        <h2 className="max-w-[26ch] font-grotesk text-[clamp(2.2rem,5.4vw,5.15rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
          Hear it for yourself.{' '}
          <span className="font-serif-accent font-normal italic text-white/95">
            We'll call you in 60 seconds.
          </span>
        </h2>

        <div className="mt-12 flex justify-center">
          {/* Call card */}
          <div className="w-full max-w-[460px] rounded border border-white/10 bg-[#0E0E10]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <span className="font-serif-accent text-[1.05rem] italic text-white/80">
                Get a call in 60 seconds
              </span>
              <span className="rounded bg-white/10 px-2.5 py-1 font-inter text-[0.72rem] font-medium text-white/80">
                avg 47s
              </span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-6 py-7">
              <div className={fieldWrap}>
                <label htmlFor="uc-name" className={labelCls}>
                  Name*
                </label>
                <input
                  id="uc-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={inputCls}
                />
              </div>

              <div className={fieldWrap}>
                <label htmlFor="uc-phone" className={labelCls}>
                  Phone Number*
                </label>
                <div className="flex items-center gap-2 border-b border-white/15 pb-2 focus-within:border-white/50">
                  <CountryCodeSelect id="uc-country" tone="dark" value={country} onChange={setCountry} />
                  <input
                    id="uc-phone"
                    type="tel"
                    inputMode="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-3435"
                    className="autofill-transparent min-w-0 flex-1 bg-transparent font-inter text-[0.95rem] text-white placeholder:text-white/35 focus:outline-none"
                  />
                </div>
              </div>

              <div className={fieldWrap}>
                <label htmlFor="uc-email" className={labelCls}>
                  Work e-mail*
                </label>
                <input
                  id="uc-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Yourcompany@.com"
                  className={inputCls}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex w-full items-center justify-center gap-2.5 rounded bg-white px-6 py-3.5 font-inter text-[0.95rem] font-semibold text-[#0C1E45] transition-transform hover:-translate-y-0.5 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Phone className="h-4 w-4" />
                {loading ? 'Calling...' : 'Call me now'}
              </button>

              {error ? (
                <p className="font-inter text-[0.8rem] text-red-400">{error}</p>
              ) : (
                <p className="font-serif-accent text-center text-[0.95rem] italic text-white/45">
                  One demo call. No sales cadence. Opt out anytime.
                </p>
              )}
            </form>
          </div>
        </div>
      </AcaContainer>

      {callPhone && <VoiceCallModal phone={callPhone} onEnd={() => setCallPhone(null)} />}
    </section>
  );
}
