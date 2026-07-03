import { Link } from 'react-router-dom';
import { Youtube, Linkedin, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';

const COMPLIANCE = ['SOC 2 Type II', 'FDCPA', 'TCPA', 'Reg F'];

const COLUMNS: { title: string; links: [string, string, boolean?][] }[] = [
  {
    title: 'Platform',
    links: [
      ['AI Voice Agents', '/features/context-aware-voice-ai-agents-for-debt-collection'],
      ['How It Works', '/#how-it-works'],
      ['Pricing', '/pricing'],
      ['Compliance', '/#compliance'],
    ],
  },
  {
    title: 'Who We Serve',
    links: [
      ['First-Party Collections', '/collections/first-party'],
      ['Third-Party Collections', '/collections/third-party'],
      ['Debt Buyers', '/collections/debt-buyer'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About', '/about'],
      ['Blog', '/blogs'],
      ['Newsroom', '/newsroom'],
      ['Customer Stories', '/customer-stories'],
      ['Contact', '/contact'],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-hair bg-base pt-16 pb-10">
      <div className="mx-auto max-w-wide px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.8fr_1fr_1fr_1fr] md:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex">
              <img loading="lazy" decoding="async" src="/DROS_horizontal_dark_bg_1.svg" alt="DROS" className="h-8 w-auto" />
            </Link>
            <p className="mt-5 max-w-[280px] text-sm leading-relaxed text-ink/55">
              DROS AI - the AI-native engagement OS for debt collections.
            </p>
            <ul className="mt-6 space-y-3">
              <li>
                <a href="mailto:contact@dros.ai" className="flex items-center gap-2.5 text-sm text-ink/55 transition-colors hover:text-ink">
                  <Mail className="h-3.5 w-3.5 shrink-0" /> contact@dros.ai
                </a>
              </li>
              <li>
                <a href="tel:+13026272108" className="flex items-center gap-2.5 text-sm text-ink/55 transition-colors hover:text-ink">
                  <Phone className="h-3.5 w-3.5 shrink-0" /> +1 (302) 627-2108
                </a>
              </li>
              <li>
                <Link to="/book-meeting" className="flex items-center gap-2.5 text-sm text-ink/55 transition-colors hover:text-ink">
                  <Calendar className="h-3.5 w-3.5 shrink-0" /> Book a Meeting
                </Link>
              </li>
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="eyebrow mb-5 text-ink/40">{col.title}</div>
              <ul className="space-y-3">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="text-sm text-ink/55 transition-colors hover:text-ink">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Compliance badge strip */}
        <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-hair pt-8">
          <span className="eyebrow mr-2 text-ink/40">Compliance</span>
          {COMPLIANCE.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 rounded-full border border-hair bg-white/[0.03] px-3 py-1.5 text-xs text-ink/70"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-accent" /> {c}
            </span>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-hair pt-6 sm:flex-row">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <p className="text-sm text-ink/45">&copy; 2026 DROS. Registered in the United States.</p>
            <div className="flex items-center gap-2 text-sm text-ink/45">
              <span>Built by</span>
              <a href="https://vodex.ai" target="_blank" rel="noopener noreferrer" aria-label="Vodex">
                <img loading="lazy" decoding="async" src="/base_logo_transparent_background.png" alt="Vodex" className="h-10 opacity-80 transition-opacity hover:opacity-100" />
              </a>
              <span className="hidden text-ink/35 sm:inline">- powering AI voice at scale since 2019.</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-4 text-sm text-ink/45">
              <Link to="/contact" className="transition-colors hover:text-ink">Privacy</Link>
              <Link to="/contact" className="transition-colors hover:text-ink">Terms</Link>
            </div>
            <a href="https://www.youtube.com/@drosdotai" target="_blank" rel="noopener noreferrer" className="text-ink/50 transition-colors hover:text-ink" aria-label="YouTube">
              <Youtube className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com/company/dros" target="_blank" rel="noopener noreferrer" className="text-ink/50 transition-colors hover:text-ink" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
