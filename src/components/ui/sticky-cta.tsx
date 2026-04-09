"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { CONTACT } from "@/lib/constants";

const VISIBLE_PREFIXES = [
  "/services/",
  "/locations/",
  "/calculators/",
  "/guides/",
  "/market-reports/",
];

export function StickyCTA() {
  const pathname = usePathname();

  const shouldShow = VISIBLE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!shouldShow) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm md:hidden">
      <div className="flex items-center gap-3">
        <Link
          href="/deal-room"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-bold text-navy-dark shadow-sm transition-colors hover:bg-gold-dark"
        >
          Get Terms
          <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href={`tel:${CONTACT.phoneRaw}`}
          className="flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
          aria-label="Call us"
        >
          <Phone className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
