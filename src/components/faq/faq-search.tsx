"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { EditorialSection } from "@/components/editorial/primitives";

interface FAQEntry {
  question: string;
  answer: string;
  source: string;
  sourceUrl: string;
}

interface FAQCategory {
  name: string;
  slug: string;
  description: string;
  faqs: FAQEntry[];
}

interface FAQSearchProps {
  categories: FAQCategory[];
}

export function FAQSearch({ categories }: FAQSearchProps) {
  const [query, setQuery] = useState("");
  const lowerQuery = query.toLowerCase().trim();

  const filteredCategories = lowerQuery
    ? categories
        .map((cat) => ({
          ...cat,
          faqs: cat.faqs.filter(
            (faq) =>
              faq.question.toLowerCase().includes(lowerQuery) ||
              faq.answer.toLowerCase().includes(lowerQuery),
          ),
        }))
        .filter((cat) => cat.faqs.length > 0)
    : categories;

  const totalResults = filteredCategories.reduce(
    (sum, cat) => sum + cat.faqs.length,
    0,
  );

  return (
    <>
      {/* Search bar */}
      <div
        className="border-y py-8"
        style={{ borderColor: "var(--stone-dark)", background: "var(--stone)" }}
      >
        <div className="mx-auto max-w-[1360px] px-6 sm:px-10">
          <div className="relative max-w-lg">
            <Search
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "var(--gold-dark)" }}
            />
            <Input
              type="search"
              placeholder="Search FAQs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 border-0 bg-[color:var(--paper)] pl-12 text-[15px]"
              style={{ borderColor: "var(--stone-dark)" }}
            />
          </div>
          {lowerQuery ? (
            <p
              className="mt-5 text-[11px] font-medium uppercase tracking-[0.24em]"
              style={{ color: "var(--gold-dark)" }}
            >
              {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <a
                  key={cat.slug}
                  href={`#${cat.slug}`}
                  className="inline-flex items-center gap-2 border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors"
                  style={{
                    borderColor: "var(--stone-dark)",
                    color: "var(--navy-dark)",
                    background: "var(--paper)",
                  }}
                >
                  {cat.name}
                  <span className="numeral-tabular" style={{ color: "oklch(0.50 0.02 255)" }}>
                    {String(cat.faqs.length).padStart(2, "0")}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAQ sections */}
      <EditorialSection tone="paper">
        <div className="mx-auto max-w-4xl">
          {filteredCategories.length === 0 && (
            <p
              className="text-center text-[17px] leading-[1.6]"
              style={{ color: "oklch(0.35 0.04 255)" }}
            >
              No FAQs match your search. Try a different term or{" "}
              <Link href="/contact" className="editorial-link" style={{ color: "var(--navy-dark)" }}>
                contact us directly
              </Link>
              .
            </p>
          )}
          {filteredCategories.map((cat, idx) => (
            <div
              key={cat.slug}
              id={cat.slug}
              className={`scroll-mt-24 ${idx > 0 ? "mt-20" : ""}`}
            >
              <p
                className="mb-3 text-[11px] font-medium uppercase tracking-[0.26em]"
                style={{ color: "var(--gold-dark)" }}
              >
                {String(idx + 1).padStart(2, "0")}
              </p>
              <h2
                className="font-heading text-[2rem] font-medium leading-[1.1] tracking-[-0.015em] sm:text-[2.25rem]"
                style={{ color: "var(--navy-dark)" }}
              >
                {cat.name}
              </h2>
              <p
                className="mt-4 max-w-2xl text-[16px] leading-[1.6]"
                style={{ color: "oklch(0.35 0.04 255)" }}
              >
                {cat.description}
              </p>

              <div className="mt-10 space-y-3">
                {cat.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group border-b"
                    style={{ borderColor: "var(--stone-dark)" }}
                  >
                    <summary
                      className="flex cursor-pointer items-center justify-between gap-4 py-5 font-heading text-[18px] font-medium leading-snug tracking-tight [&::-webkit-details-marker]:hidden"
                      style={{ color: "var(--navy-dark)" }}
                    >
                      <span>{faq.question}</span>
                      <svg
                        className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
                        style={{ color: "var(--gold-dark)" }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </summary>
                    <div className="pb-6">
                      <p
                        className="text-[16px] leading-[1.65]"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        {faq.answer}
                      </p>
                      <Link
                        href={faq.sourceUrl}
                        className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em]"
                        style={{ color: "var(--gold-dark)" }}
                      >
                        Read more in: {faq.source}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </EditorialSection>
    </>
  );
}
