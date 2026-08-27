import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { ReactNode, ElementType } from 'react';
import Counter from '../Counter';

/* ──────────────────────────────────────────────────────────
   Premium UI primitive kit. Dark, restrained, border-led.
   Shared across the redesigned homepage and future pages.
   ────────────────────────────────────────────────────────── */

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}

// Hoisted so the motion-wrapped Link isn't recreated on every render.
const MotionLink = motion(Link);

/* ── Container ── */
export function Container({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cx(
        'mx-auto w-full px-6 sm:px-10 lg:px-14',
        wide ? 'max-w-wide' : 'max-w-container',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ── Section ── */
export function Section({
  children,
  id,
  className,
  tone = 'base',
  spacing = 'lg',
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  tone?: 'base' | 'surface' | 'panel' | 'light' | 'transparent';
  spacing?: 'sm' | 'lg';
}) {
  const tones: Record<string, string> = {
    base: 'bg-base',
    surface: 'bg-surface',
    panel: 'bg-[#070C18]',
    light: 'bg-paper text-ink-dark',
    transparent: '',
  };
  return (
    <section
      id={id}
      className={cx(
        'relative',
        spacing === 'lg' ? 'py-20 md:py-28 lg:py-32' : 'py-14 md:py-20',
        tones[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}

/* ── Eyebrow / kicker ── */
export function Eyebrow({
  children,
  className,
  bullet = 'square',
}: {
  children: ReactNode;
  className?: string;
  bullet?: 'square' | 'dot' | 'none';
}) {
  return (
    <span className={cx('eyebrow inline-flex items-center gap-2.5 text-accent', className)}>
      {bullet !== 'none' && (
        <span className={cx('h-1.5 w-1.5 bg-current', bullet === 'dot' && 'rounded-full')} />
      )}
      {children}
    </span>
  );
}

/* ── Heading (Saans display) ── */
export function Heading({
  children,
  as: Tag = 'h2',
  size = 'heading',
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  size?: 'display-lg' | 'display' | 'heading';
  className?: string;
}) {
  const sizes: Record<string, string> = {
    'display-lg': 'text-display-lg',
    display: 'text-display',
    heading: 'text-heading',
  };
  return (
    <Tag className={cx('font-display text-ink', sizes[size], className)}>
      {children}
    </Tag>
  );
}

/* ── Pill / Badge ── */
export function Pill({
  children,
  className,
  dot = false,
}: {
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-ink/80 backdrop-blur',
        className,
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
      )}
      {children}
    </span>
  );
}

/* ── Button ── */
type ButtonVariant = 'primary' | 'onLight' | 'secondary' | 'ghost';
type ButtonSize = 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  to?: string;
  href?: string;
  target?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  ariaLabel?: string;
  /** Button-only. Ignored when rendering as a link (`to`/`href`). */
  disabled?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // White pill on dark - Lateral's primary CTA
  primary: 'bg-white text-[#0C1E45] font-medium',
  // Black pill on light sections
  onLight: 'bg-[#0C1E45] text-white font-medium',
  secondary: 'border border-line bg-white/[0.04] text-ink hover:bg-white/[0.08]',
  ghost: 'text-ink/70 hover:text-ink',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  to,
  href,
  target,
  onClick,
  type = 'button',
  ariaLabel,
  disabled = false,
}: ButtonProps) {
  const classes = cx(
    'group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-base',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );
  // Hover dims opacity, matching Lateral's button feel. A disabled button gets
  // neither, so it doesn't read as pressable.
  const motionProps = {
    whileHover: disabled
      ? undefined
      : { opacity: variant === 'secondary' || variant === 'ghost' ? 0.78 : 0.85 },
    whileTap: disabled ? undefined : { scale: 0.98 },
    transition: { type: 'spring' as const, duration: 0.4, bounce: 0.2 },
  };

  if (to) {
    return (
      <MotionLink to={to} className={classes} onClick={onClick} aria-label={ariaLabel} {...motionProps}>
        {children}
      </MotionLink>
    );
  }
  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}

/* ── Card ── */
export function Card({
  children,
  className,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cx(
        'rounded-card border border-hair bg-surface/70 backdrop-blur-sm',
        hover &&
          'transition-all duration-300 hover:border-line hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ── MetricCard ── */
export function MetricCard({
  value,
  prefix,
  suffix,
  decimals,
  label,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  className?: string;
}) {
  return (
    <div className={cx('rounded-card border border-hair bg-surface/60 p-7', className)}>
      <div className="font-display text-4xl text-ink md:text-5xl">
        <Counter to={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      <div className="mt-3 text-sm text-ink/55">{label}</div>
    </div>
  );
}
