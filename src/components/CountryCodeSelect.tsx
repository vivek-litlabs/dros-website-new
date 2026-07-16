import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { COUNTRIES } from '../lib/countries';

/*
 * Custom country-code picker for the demo-call phone inputs. A native
 * <select>'s popup can't be styled (it renders as a bare white system list
 * that clashes with the dark hero), and flag emoji don't render on Windows,
 * so this uses a fully custom, searchable dropdown themed to each form.
 */
export default function CountryCodeSelect({
  value,
  onChange,
  tone,
  id,
}: {
  value: string; // ISO code, e.g. "IN"
  onChange: (iso: string) => void;
  tone: 'dark' | 'light';
  id: string;
}) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(true);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = COUNTRIES.find((c) => c.iso === value) ?? COUNTRIES[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.startsWith(q.replace(/^\+/, '')),
    );
  }, [query]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Focus the search box when the panel opens; clear the last query.
  useEffect(() => {
    if (open) {
      setQuery('');
      searchRef.current?.focus();
    }
  }, [open]);

  const dark = tone === 'dark';

  return (
    <div ref={rootRef} className="relative flex h-full shrink-0 items-center">
      <button
        type="button"
        id={id}
        onClick={() => {
          // Open toward whichever side has room; the panel is ~340px tall.
          const rect = rootRef.current?.getBoundingClientRect();
          if (rect) setOpenUp(window.innerHeight - rect.bottom < 360);
          setOpen((o) => !o);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code: ${selected.name} +${selected.dial}`}
        className={`flex h-full items-center gap-1 border-r pr-2.5 text-sm transition-colors focus:outline-none ${
          dark
            ? 'border-white/10 text-white/80 hover:text-white'
            : 'border-line-dark text-ink-dark hover:text-ink-dark/80'
        }`}
      >
        <span className="font-medium">+{selected.dial}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''} ${
            dark ? 'text-white/50' : 'text-ink-grey/60'
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select country"
          className={`absolute left-0 z-50 w-72 max-w-[calc(100vw-3rem)] overflow-hidden rounded-xl border shadow-[0_16px_48px_rgba(0,0,0,0.35)] ${
            openUp ? 'bottom-[calc(100%+10px)]' : 'top-[calc(100%+10px)]'
          } ${
            dark
              ? 'border-white/10 bg-[#0d1220]/95 backdrop-blur-2xl'
              : 'border-line-dark bg-white'
          }`}
        >
          {/* Search */}
          <div className={`flex items-center gap-2 border-b px-3.5 py-2.5 ${dark ? 'border-white/10' : 'border-line-dark'}`}>
            <Search className={`h-3.5 w-3.5 shrink-0 ${dark ? 'text-white/40' : 'text-ink-grey/50'}`} />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code"
              aria-label="Search country"
              className={`w-full bg-transparent text-sm focus:outline-none ${
                dark ? 'text-white placeholder:text-white/35' : 'text-ink-dark placeholder:text-ink-grey/50'
              }`}
            />
          </div>

          {/* Options */}
          <ul className="max-h-60 overflow-y-auto overscroll-contain py-1.5">
            {filtered.length === 0 && (
              <li className={`px-3.5 py-2.5 text-sm ${dark ? 'text-white/40' : 'text-ink-grey/60'}`}>
                No matches
              </li>
            )}
            {filtered.map((c) => {
              const isSelected = c.iso === selected.iso;
              return (
                <li key={c.iso}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(c.iso);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-sm transition-colors ${
                      dark
                        ? isSelected
                          ? 'bg-white/10 text-white'
                          : 'text-white/75 hover:bg-white/[0.06] hover:text-white'
                        : isSelected
                          ? 'bg-ink-dark/5 text-ink-dark'
                          : 'text-ink-dark/80 hover:bg-ink-dark/[0.04] hover:text-ink-dark'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    <span className={`shrink-0 tabular-nums ${dark ? 'text-white/45' : 'text-ink-grey/70'}`}>
                      +{c.dial}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
