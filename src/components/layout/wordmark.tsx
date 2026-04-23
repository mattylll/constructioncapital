import Link from "next/link";

import { SITE_NAME } from "@/lib/constants";

type Tone = "light" | "dark";

interface WordmarkProps {
  /** Background tone the wordmark sits on. `light` = paper/stone. `dark` = navy. */
  tone?: Tone;
  /** Include the word "Construction Capital" next to the seal. Default true. */
  showName?: boolean;
  /** Link destination; defaults to the homepage. */
  href?: string;
  /** Used to add extra margin / layout classes from the caller. */
  className?: string;
  /** Relative scale. `sm` = header, `md` = footer masthead. */
  size?: "sm" | "md";
}

/**
 * The Construction Capital mark is a compact seal: italic lowercase "cc"
 * set in Playfair inside a navy square edged with a gold hairline.
 * Sits next to the Playfair wordmark. No clip-art icons.
 */
export function Wordmark({
  tone = "light",
  showName = true,
  href = "/",
  className = "",
  size = "sm",
}: WordmarkProps) {
  const sealSize = size === "md" ? "h-9 w-9 text-[1.05rem]" : "h-7 w-7 text-[0.85rem]";
  const wordSize = size === "md" ? "text-[1.35rem]" : "text-[1.1rem]";

  const sealBg = tone === "dark" ? "oklch(1 0 0 / 0.06)" : "var(--navy-dark)";
  const sealText = tone === "dark" ? "var(--gold-light)" : "var(--gold)";
  const sealBorder =
    tone === "dark"
      ? "oklch(0.75 0.12 85 / 0.4)"
      : "oklch(0.75 0.12 85 / 0.55)";

  const wordColor = tone === "dark" ? "oklch(1 0 0 / 0.95)" : "var(--navy-dark)";

  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 ${className}`}
      aria-label={SITE_NAME}
    >
      <span
        aria-hidden
        className={`relative flex items-center justify-center ${sealSize}`}
        style={{
          background: sealBg,
          border: `1px solid ${sealBorder}`,
        }}
      >
        <span
          className="font-heading italic"
          style={{
            color: sealText,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            marginTop: "-0.06em",
          }}
        >
          cc
        </span>
        {/* Gold underline accent — visible only on the dark tone seal to give it punctuation */}
        {tone === "dark" && (
          <span
            aria-hidden
            className="absolute -bottom-[1px] left-0 h-[2px] w-3"
            style={{ background: "var(--gold)" }}
          />
        )}
      </span>

      {showName && (
        <span
          className={`font-heading font-medium tracking-[-0.01em] ${wordSize}`}
          style={{ color: wordColor }}
        >
          {SITE_NAME}
        </span>
      )}
    </Link>
  );
}
