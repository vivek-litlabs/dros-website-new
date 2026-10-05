'use client';
import { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Mail } from 'lucide-react';
import { Section, Container, Heading, Eyebrow, Button } from './ui';
import Reveal from './Reveal';
import { trackEvent } from '../lib/analytics';
import { submitLeaveMessage } from '../lib/hubspot';

type FieldName = 'firstname' | 'lastname' | 'email' | 'company' | 'message';
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;

const EMPTY: Values = { firstname: '', lastname: '', email: '', company: '', message: '' };
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 2000;

// Letters (any script) with the spaces, hyphens, apostrophes and periods real
// names use - rejects digits, emails and URLs typed into a name field.
const NAME_RE = /^\p{L}[\p{L}\p{M}' .-]*$/u;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const URL_RE = /(https?:\/\/|www\.)/gi;

// Common misspellings of big mail domains - caught so a lead isn't recorded
// against an address that can never be reached.
const DOMAIN_TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com', 'gnail.com': 'gmail.com', 'hotmial.com': 'hotmail.com', 'hotmail.co': 'hotmail.com',
  'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'outlok.com': 'outlook.com', 'outlook.co': 'outlook.com',
};

const clean = (s: string) => s.trim().replace(/\s+/g, ' ');

function validateField(name: FieldName, raw: string): string | undefined {
  const v = name === 'message' ? raw.trim() : clean(raw);
  switch (name) {
    case 'firstname':
    case 'lastname': {
      const label = name === 'firstname' ? 'first' : 'last';
      if (!v) return `Please enter your ${label} name.`;
      if (v.length > 50) return 'Please keep this under 50 characters.';
      if (!NAME_RE.test(v)) return 'Please use letters only.';
      return;
    }
    case 'email': {
      if (!v) return 'Please enter your email.';
      if (v.length > 254 || !EMAIL_RE.test(v) || v.includes('..')) return 'Please enter a valid email address.';
      const fix = DOMAIN_TYPOS[v.split('@')[1].toLowerCase()];
      if (fix) return `Did you mean ${v.split('@')[0]}@${fix}?`;
      return;
    }
    case 'company':
      if (v.length > 100) return 'Please keep this under 100 characters.';
      return;
    case 'message': {
      if (!v) return 'Please enter a message.';
      if (v.length < MESSAGE_MIN) return `Please add a little more detail (at least ${MESSAGE_MIN} characters).`;
      if (v.length > MESSAGE_MAX) return `Please keep your message under ${MESSAGE_MAX} characters.`;
      if (!/\p{L}/u.test(v)) return 'Please enter a message.';
      if ((v.match(URL_RE) ?? []).length > 3) return 'Please include no more than 3 links.';
      return;
    }
  }
}

function validateAll(values: Values): Errors {
  const errors: Errors = {};
  (Object.keys(values) as FieldName[]).forEach((k) => {
    const e = validateField(k, values[k]);
    if (e) errors[k] = e;
  });
  return errors;
}

const FIELD_ORDER: FieldName[] = ['firstname', 'lastname', 'email', 'company', 'message'];

export default function LeaveMessage({
  tone = 'panel',
  source,
}: {
  tone?: 'panel' | 'light';
  /** Analytics label for where the form sits, e.g. "home" or "contact". */
  source: string;
}) {
  const light = tone === 'light';
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Height of the form when it was sent, so the thank-you state keeps the
  // card the same size instead of collapsing the section under the reader.
  const [sentHeight, setSentHeight] = useState<number>();
  const [formError, setFormError] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const id = (name: FieldName) => `leave-message-${source}-${name}`;

  function onChange(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Once a field has been left, re-check as the user corrects it.
    if (touched[name]) setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }

  function onBlur(name: FieldName) {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, values[name]) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setFormError(null);
    const next = validateAll(values);
    setErrors(next);
    setTouched({ firstname: true, lastname: true, email: true, company: true, message: true });
    const firstInvalid = FIELD_ORDER.find((k) => next[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#${id(firstInvalid)}`)?.focus();
      return;
    }
    // Bots fill every field, including the hidden one; show success, send nothing.
    if (honeypot.current?.value) {
      setSentHeight(formRef.current?.offsetHeight);
      setSubmitted(true);
      return;
    }

    setLoading(true);
    const result = await submitLeaveMessage(
      {
        firstname: clean(values.firstname),
        lastname: clean(values.lastname),
        email: clean(values.email).toLowerCase(),
        company: clean(values.company),
        message: values.message.trim(),
      },
      `Leave us a message - ${source}`,
    );
    setLoading(false);
    if (result.ok) {
      trackEvent('leave_message_submit', { source });
      setSentHeight(formRef.current?.offsetHeight);
      setSubmitted(true);
    } else if (result.emailRejected) {
      setErrors((prev) => ({ ...prev, email: 'Please use a different email address.' }));
      formRef.current?.querySelector<HTMLElement>(`#${id('email')}`)?.focus();
    } else {
      setFormError("Something went wrong sending your message. Please try again, or email us at contact@dros.ai.");
    }
  }

  // The form card is white on every page; only the copy beside it follows the
  // section tone.
  const labelCls = 'text-ink-dark';
  const errorCls = 'text-red-600';
  const inputCls = (name: FieldName) =>
    [
      'w-full rounded-btn border px-3.5 text-[15px] transition-colors focus:outline-none focus:ring-2',
      'bg-white text-ink-dark placeholder:text-ink-grey/50',
      errors[name]
        ? 'border-red-500/70 focus:ring-red-500/25'
        : 'border-line-dark focus:border-accent/60 focus:ring-accent/30',
    ].join(' ');

  function field(name: FieldName, label: string, opts: { type?: string; autoComplete?: string; optional?: boolean; className?: string } = {}) {
    const err = touched[name] ? errors[name] : undefined;
    return (
      <div className={opts.className}>
        <label htmlFor={id(name)} className={`mb-1.5 block text-[13px] font-medium ${labelCls}`}>
          {label}
          {opts.optional && <span className="ml-1 font-normal text-ink-grey">(optional)</span>}
        </label>
        <input
          id={id(name)}
          name={name}
          type={opts.type ?? 'text'}
          autoComplete={opts.autoComplete}
          value={values[name]}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur(name)}
          aria-invalid={!!err}
          aria-describedby={err ? `${id(name)}-error` : undefined}
          className={`h-11 ${inputCls(name)}`}
        />
        {err && <p id={`${id(name)}-error`} className={`mt-1.5 text-xs ${errorCls}`}>{err}</p>}
      </div>
    );
  }

  const messageErr = touched.message ? errors.message : undefined;
  const messageLen = values.message.trim().length;

  return (
    // On light pages this follows another light section, so drop the top
    // padding rather than stacking two sections' worth of gap.
    <Section id="leave-message" tone={tone} className={light ? 'pt-0 md:pt-0 lg:pt-0' : undefined}>
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow className={light ? 'text-ink-grey' : undefined}>Not ready for a demo?</Eyebrow>
            <Heading as="h2" size="display" className={light ? 'mt-4 text-ink-dark' : 'mt-4'}>
              Have a question? Leave us a message.
            </Heading>
            <p className={light ? 'mt-5 text-lg text-ink-grey' : 'mt-5 text-lg text-ink/60'}>
              Tell us what you're working on and we'll get back to you shortly.
            </p>
            <ul className={light ? 'mt-8 space-y-3 text-[15px] text-ink-dark/80' : 'mt-8 space-y-3 text-[15px] text-ink/70'}>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:contact@dros.ai" className="transition-colors hover:text-accent">
                  contact@dros.ai
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-accent" />
                Typically within 1 business day
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div
              className={
                light
                  ? 'rounded-card border border-line-dark bg-white p-6 sm:p-7'
                  : 'rounded-card bg-white p-6 shadow-glow sm:p-7'
              }
            >
              {submitted ? (
                <div
                  role="status"
                  className="flex flex-col items-center justify-center py-10 text-center"
                  style={{ minHeight: sentHeight }}
                >
                  <CheckCircle2 className="h-10 w-10 text-accent" />
                  <p className={`mt-4 text-lg font-semibold text-ink-dark`}>
                    Thanks, {clean(values.firstname)}. Your message is in.
                  </p>
                  <p className={`mt-2 text-[15px] text-ink-grey`}>
                    We'll get back to you at {clean(values.email).toLowerCase()} within 1 business day.
                  </p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {field('firstname', 'First name', { autoComplete: 'given-name' })}
                  {field('lastname', 'Last name', { autoComplete: 'family-name' })}
                  {field('email', 'Work email', { type: 'email', autoComplete: 'email' })}
                  {field('company', 'Company', { autoComplete: 'organization', optional: true })}

                  <div className="sm:col-span-2">
                    <label htmlFor={id('message')} className={`mb-1.5 block text-[13px] font-medium ${labelCls}`}>
                      Message
                    </label>
                    <textarea
                      id={id('message')}
                      name="message"
                      rows={4}
                      maxLength={MESSAGE_MAX}
                      value={values.message}
                      onChange={(e) => onChange('message', e.target.value)}
                      onBlur={() => onBlur('message')}
                      placeholder="What are you working on, or what would you like to know?"
                      aria-invalid={!!messageErr}
                      aria-describedby={messageErr ? `${id('message')}-error` : undefined}
                      className={`resize-none py-2.5 ${inputCls('message')}`}
                    />
                    <div className="mt-1.5 flex items-start justify-between gap-4">
                      {messageErr ? (
                        <p id={`${id('message')}-error`} className={`text-xs ${errorCls}`}>{messageErr}</p>
                      ) : <span />}
                      <span className={`shrink-0 text-xs tabular-nums text-ink-grey/70`}>
                        {messageLen}/{MESSAGE_MAX}
                      </span>
                    </div>
                  </div>

                  {/* Honeypot: hidden from people and screen readers, filled by bots. */}
                  <input
                    ref={honeypot}
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-px w-px opacity-0"
                  />

                  <div className="flex flex-col-reverse items-start gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className={`text-xs text-ink-grey/70`}>
                      We'll only use your details to reply to your message.
                    </p>
                    <Button
                      type="submit"
                      variant="onLight"
                      disabled={loading}
                      className="w-full focus-visible:!ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {loading ? 'Sending...' : (
                        <>
                          Send message <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>

                  {formError && (
                    <p role="alert" className={`sm:col-span-2 text-sm ${errorCls}`}>{formError}</p>
                  )}
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
