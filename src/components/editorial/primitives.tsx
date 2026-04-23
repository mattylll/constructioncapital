import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Editorial primitives for the Construction Capital site. Used across
 * services, locations, case studies, guides, market reports and
 * calculators to enforce a consistent Mayfair-boutique design language.
 *
 * Conventions:
 *  - Paper / stone / navy tonal rhythm via the CSS tokens in globals.css
 *  - Playfair Display for headings (medium weight, not black)
 *  - Gold as hairline/rule, never as glow
 *  - One primary CTA per block
 *  - No typewriter, no shimmer, no pulse-glow
 */

export type Tone = "paper" | "stone" | "navy" | "navy-dark";

const toneBackground: Record<Tone, string> = {
  paper: "var(--paper)",
  stone: "var(--stone)",
  navy: "var(--navy-dark)",
  "navy-dark": "oklch(0.12 0.045 255)",
};

const toneInk = {
  light: {
    eyebrow: "var(--navy)",
    heading: "var(--navy-dark)",
    accent: "var(--navy)",
    body: "oklch(0.35 0.04 255)",
    muted: "oklch(0.50 0.02 255)",
    rule: "var(--stone-dark)",
  },
  dark: {
    eyebrow: "var(--gold)",
    heading: "oklch(1 0 0 / 0.95)",
    accent: "var(--gold-light)",
    body: "oklch(1 0 0 / 0.72)",
    muted: "oklch(1 0 0 / 0.5)",
    rule: "oklch(1 0 0 / 0.14)",
  },
} as const;

function inkFor(tone: Tone) {
  return tone === "navy" || tone === "navy-dark" ? toneInk.dark : toneInk.light;
}

// ── EYEBROW ──────────────────────────────────────────────────────────
export function Eyebrow({
  tone = "paper",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  const ink = inkFor(tone);
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span
        aria-hidden
        className="block h-px w-10"
        style={{ background: "var(--gold)" }}
      />
      <p
        className="text-[11px] font-medium uppercase tracking-[0.32em]"
        style={{ color: ink.eyebrow }}
      >
        {children}
      </p>
    </div>
  );
}

// ── SECTION HEADER (12-col asymmetric) ───────────────────────────────
export function SectionHeader({
  eyebrow,
  title,
  body,
  tone = "paper",
  align = "asymmetric",
  className = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  tone?: Tone;
  align?: "asymmetric" | "stacked";
  className?: string;
}) {
  const ink = inkFor(tone);

  if (align === "stacked") {
    return (
      <header className={`max-w-3xl ${className}`}>
        {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
        <h2
          className="font-heading mt-6 text-4xl font-medium leading-[1.05] tracking-[-0.015em] sm:text-[2.75rem]"
          style={{ color: ink.heading }}
        >
          {title}
        </h2>
        {body && (
          <p
            className="mt-6 max-w-[46ch] text-[17px] leading-[1.65]"
            style={{ color: ink.body }}
          >
            {body}
          </p>
        )}
      </header>
    );
  }

  return (
    <header
      className={`grid gap-10 lg:grid-cols-12 lg:gap-16 ${className}`}
    >
      <div className="lg:col-span-5">
        {eyebrow && <Eyebrow tone={tone} className="mb-6">{eyebrow}</Eyebrow>}
        <h2
          className="font-heading text-4xl font-medium leading-[1.05] tracking-[-0.015em] sm:text-[2.75rem]"
          style={{ color: ink.heading }}
        >
          {title}
        </h2>
      </div>
      {body && (
        <p
          className="max-w-[44ch] text-[17px] leading-[1.65] lg:col-span-6 lg:col-start-7"
          style={{ color: ink.body }}
        >
          {body}
        </p>
      )}
    </header>
  );
}

// ── PAGE HERO (for all non-home pages) ───────────────────────────────
export function PageHero({
  eyebrow,
  title,
  deck,
  stats,
  tone = "paper",
  breadcrumbs,
  actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  deck?: ReactNode;
  stats?: { label: string; value: ReactNode }[];
  tone?: Tone;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
}) {
  const ink = inkFor(tone);

  return (
    <section
      className="relative"
      style={{ background: toneBackground[tone] }}
    >
      <div className="mx-auto max-w-[1360px] px-6 pb-16 pt-24 sm:px-10 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-32">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <ol
            className="mb-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: ink.muted }}
          >
            {breadcrumbs.map((crumb, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-[color:var(--gold-dark)]"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && (
                  <span aria-hidden style={{ color: ink.rule }}>
                    /
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            {eyebrow && <Eyebrow tone={tone} className="mb-8">{eyebrow}</Eyebrow>}
            <h1
              className="font-heading text-[clamp(2.5rem,6vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.02em]"
              style={{ color: ink.heading }}
            >
              {title}
            </h1>
            {deck && (
              <p
                className="mt-8 max-w-[46rem] text-[17px] leading-[1.65] sm:text-[18px]"
                style={{ color: ink.body }}
              >
                {deck}
              </p>
            )}
            {actions && <div className="mt-10">{actions}</div>}
          </div>
        </div>

        {stats && stats.length > 0 && (
          <dl
            className="mt-14 grid grid-cols-1 border-t sm:grid-cols-3 sm:border-y"
            style={{ borderColor: ink.rule }}
          >
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`flex flex-col gap-3 border-b py-8 sm:border-b-0 ${
                  idx > 0 ? "sm:border-l" : ""
                } ${idx === 0 ? "sm:pr-8" : "sm:px-8"}`}
                style={{ borderColor: ink.rule }}
              >
                <dt
                  className="text-[10px] font-medium uppercase tracking-[0.28em]"
                  style={{ color: ink.muted }}
                >
                  {stat.label}
                </dt>
                <dd
                  className="numeral-tabular font-heading text-3xl font-medium tracking-tight sm:text-4xl"
                  style={{ color: ink.heading }}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

// ── STAT STRIP (horizontal metrics row) ──────────────────────────────
export function StatStrip({
  items,
  tone = "paper",
}: {
  items: { label: string; value: ReactNode }[];
  tone?: Tone;
}) {
  const ink = inkFor(tone);

  return (
    <dl
      className="grid grid-cols-1 border-y sm:grid-cols-3"
      style={{ borderColor: ink.rule }}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`flex flex-col gap-4 py-10 sm:py-12 ${
            idx > 0 ? "sm:border-l" : ""
          } ${idx === 0 ? "sm:pr-8" : "sm:px-8"}`}
          style={{ borderColor: ink.rule }}
        >
          <dt
            className="text-[10px] font-medium uppercase tracking-[0.26em]"
            style={{ color: ink.muted }}
          >
            {item.label}
          </dt>
          <dd
            className="numeral-tabular font-heading text-4xl font-medium leading-none tracking-tight sm:text-[3rem]"
            style={{ color: ink.heading }}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// ── CTA BUTTON ───────────────────────────────────────────────────────
export function CTAButton({
  href,
  children,
  variant = "navy",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "navy" | "gold" | "outline-light" | "outline-dark";
  size?: "md" | "lg";
  className?: string;
}) {
  const height = size === "lg" ? "h-14" : "h-12";
  const px = size === "lg" ? "px-8" : "px-7";

  const variantStyles: Record<typeof variant, string> = {
    navy: "text-background",
    gold: "text-navy-dark",
    "outline-light": "border",
    "outline-dark": "border",
  };

  const background =
    variant === "navy"
      ? "var(--navy-dark)"
      : variant === "gold"
      ? "var(--gold)"
      : "transparent";

  const border =
    variant === "outline-light"
      ? "1px solid oklch(0.82 0.01 250)"
      : variant === "outline-dark"
      ? "1px solid oklch(1 0 0 / 0.22)"
      : undefined;

  const color =
    variant === "outline-light"
      ? "var(--navy-dark)"
      : variant === "outline-dark"
      ? "oklch(1 0 0 / 0.95)"
      : undefined;

  return (
    <Link
      href={href}
      className={`group inline-flex ${height} ${px} items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.22em] transition-colors ${variantStyles[variant]} ${className}`}
      style={{ background, border, color }}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

// ── RELATED CARD GRID ────────────────────────────────────────────────
export interface RelatedItem {
  href: string;
  eyebrow?: string;
  title: string;
  body?: string;
  meta?: string;
}

export function RelatedGrid({
  items,
  tone = "paper",
  columns = 3,
}: {
  items: RelatedItem[];
  tone?: Tone;
  columns?: 2 | 3 | 4;
}) {
  if (items.length === 0) return null;
  const ink = inkFor(tone);

  const colsClass =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : "sm:grid-cols-2";

  return (
    <ul
      className={`grid grid-cols-1 gap-px border-y ${colsClass}`}
      style={{
        borderColor: ink.rule,
        backgroundColor: ink.rule,
      }}
    >
      {items.map((item) => (
        <li
          key={item.href}
          className="flex flex-col p-7"
          style={{ background: toneBackground[tone] }}
        >
          <Link href={item.href} className="group flex h-full flex-col gap-3">
            {item.eyebrow && (
              <p
                className="text-[10px] font-medium uppercase tracking-[0.26em]"
                style={{ color: ink.muted }}
              >
                {item.eyebrow}
              </p>
            )}
            <h3
              className="font-heading text-xl font-medium leading-[1.15] tracking-tight"
              style={{ color: ink.heading }}
            >
              {item.title}
            </h3>
            {item.body && (
              <p
                className="text-[14px] leading-[1.55]"
                style={{ color: ink.body }}
              >
                {item.body}
              </p>
            )}
            <div
              className="mt-auto flex items-center gap-2 pt-4 text-[11px] font-medium uppercase tracking-[0.22em]"
              style={{ color: ink.heading }}
            >
              {item.meta && <span style={{ color: ink.muted }}>{item.meta}</span>}
              <span className="ml-auto flex items-center gap-1.5">
                <span className="editorial-link">Read</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: "var(--gold-dark)" }}
                />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ── PROSE SECTION (rich body content) ───────────────────────────────
export function ProseSection({
  title,
  children,
  tone = "paper",
}: {
  title?: ReactNode;
  children: ReactNode;
  tone?: Tone;
}) {
  const ink = inkFor(tone);
  return (
    <section className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
      {title && (
        <div className="lg:col-span-4">
          <h2
            className="font-heading text-[1.75rem] font-medium leading-[1.15] tracking-tight sm:text-[2rem]"
            style={{ color: ink.heading }}
          >
            {title}
          </h2>
        </div>
      )}
      <div
        className={`${title ? "lg:col-span-7 lg:col-start-6" : "lg:col-span-10"} space-y-5 text-[17px] leading-[1.7]`}
        style={{ color: ink.body }}
      >
        {children}
      </div>
    </section>
  );
}

// ── PULL QUOTE ───────────────────────────────────────────────────────
export function PullQuote({
  children,
  attribution,
  tone = "paper",
}: {
  children: ReactNode;
  attribution?: ReactNode;
  tone?: Tone;
}) {
  const ink = inkFor(tone);
  return (
    <blockquote
      className="border-l pl-6"
      style={{ borderColor: "var(--gold)" }}
    >
      <p
        className="font-heading text-xl font-normal leading-[1.45] italic sm:text-2xl"
        style={{ color: ink.heading }}
      >
        {children}
      </p>
      {attribution && (
        <footer
          className="mt-4 text-[11px] font-medium uppercase tracking-[0.24em]"
          style={{ color: ink.muted }}
        >
          {attribution}
        </footer>
      )}
    </blockquote>
  );
}

// ── SECTION WRAPPER (consistent padding) ─────────────────────────────
export function EditorialSection({
  tone = "paper",
  children,
  className = "",
  id,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative py-24 sm:py-32 ${className}`}
      style={{ background: toneBackground[tone] }}
    >
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10">{children}</div>
    </section>
  );
}
