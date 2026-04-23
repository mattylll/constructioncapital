import Link from "next/link";
import type { ReactNode } from "react";

import { SITE_NAME } from "@/lib/constants";

export const metadata = {
  title: "Admin · Construction Capital",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--paper)" }}>
      <header
        className="border-b"
        style={{ borderColor: "var(--stone-dark)" }}
      >
        <div className="mx-auto flex max-w-[1360px] items-center justify-between px-6 py-5 sm:px-10">
          <Link
            href="/admin/news"
            className="font-heading text-lg font-medium tracking-tight"
            style={{ color: "var(--navy-dark)" }}
          >
            {SITE_NAME} <span style={{ color: "var(--gold-dark)" }}>admin</span>
          </Link>
          <nav className="flex items-center gap-6 text-[13px]">
            <Link
              href="/admin/news"
              className="editorial-link"
              style={{ color: "var(--navy-dark)" }}
            >
              News
            </Link>
            <Link
              href="/admin/analytics"
              className="editorial-link"
              style={{ color: "oklch(0.40 0.03 255)" }}
            >
              Analytics
            </Link>
            <Link
              href="/"
              className="editorial-link"
              style={{ color: "oklch(0.40 0.03 255)" }}
            >
              View site
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
