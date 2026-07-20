/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Saans (Customer.io face) is now the site-wide typeface for body + display.
        sans: ['Saans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Saans', 'Inter', 'system-ui', 'sans-serif'],
        saans: ['Saans', 'Inter', 'system-ui', 'sans-serif'],
        // ACA landing typefaces (opt-in via font-grotesk / font-inter / font-serif-accent)
        grotesk: ['"Space Grotesk"', 'Saans', 'Inter', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'Saans', 'system-ui', 'sans-serif'],
        'serif-accent': ['"Instrument Serif"', 'Georgia', 'Cambria', 'serif'],
        // Eyebrows, labels, code
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // ── Premium enterprise palette (the redesign system) ──
        base: '#04070F',        // near-black navy page background
        surface: '#0B1120',     // raised panels
        'surface-2': '#111A2E', // cards / inputs
        ink: '#F5F7FA',         // primary text on dark
        // Light sections (Lateral alternates light/dark)
        paper: '#F9F9F9',       // off-white light-section background
        'ink-dark': '#0C1E45',  // primary text on light (dark navy blue)
        'ink-grey': '#636363',  // muted text on light
        'line-dark': '#E6E3E3', // hairline borders on light
        accent: {
          DEFAULT: '#03D2FC',   // single disciplined accent (DROS teal)
          soft: 'rgba(3,210,252,0.12)',
          ring: 'rgba(3,210,252,0.35)',
        },
        // ── Legacy keys kept for un-redesigned pages ──
        midnight: '#010C20',
        navy: '#1A237E',
        'bright-purple': '#DD39F9',
        teal: '#03D2FC',
        purple: '#412F69',
      },
      // Translucent borders (subtle 1px lines, not shadows)
      borderColor: {
        hair: 'rgba(255,255,255,0.08)',
        line: 'rgba(255,255,255,0.12)',
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter: '-0.03em',
        eyebrow: '0.08em',
      },
      fontSize: {
        // Display scale (Saans) - matches Lateral: 62px desktop / 48px small, -0.05em
        'display-lg': ['clamp(2.625rem, 5vw, 3.875rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'heading': ['clamp(1.625rem, 3vw, 2.25rem)', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
        'metric': ['clamp(3.5rem, 7vw, 5.5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'eyebrow': ['0.75rem', { lineHeight: '1', letterSpacing: '0.08em' }],
      },
      maxWidth: {
        container: '1200px',
        wide: '1440px',
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px -20px rgba(3,210,252,0.18)',
        lift: '0 24px 70px -30px rgba(0,0,0,0.8)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.44, 0, 0.11, 1)',
      },
    },
  },
  plugins: [],
};
