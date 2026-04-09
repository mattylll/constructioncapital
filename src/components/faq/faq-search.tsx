"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle, Search } from "lucide-react";

import { Input } from "@/components/ui/input";

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
              faq.answer.toLowerCase().includes(lowerQuery)
          ),
        }))
        .filter((cat) => cat.faqs.length > 0)
    : categories;

  const totalResults = filteredCategories.reduce(
    (sum, cat) => sum + cat.faqs.length,
    0
  );

  return (
    <>
      {/* Search bar */}
      <div className="border-b border-border bg-muted/30 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative mb-4 max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search FAQs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 pl-10"
            />
          </div>
          {lowerQuery ? (
            <p className="text-sm text-muted-foreground">
              {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <a
                  key={cat.slug}
                  href={`#${cat.slug}`}
                  className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-gold/30 hover:text-gold-dark"
                >
                  {cat.name}{" "}
                  <span className="text-muted-foreground">
                    ({cat.faqs.length})
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAQ Sections */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {filteredCategories.length === 0 && (
            <p className="text-center text-muted-foreground">
              No FAQs match your search. Try a different term or{" "}
              <Link href="/contact" className="text-gold-dark hover:underline">
                contact us directly
              </Link>
              .
            </p>
          )}
          {filteredCategories.map((cat) => (
            <div key={cat.slug} id={cat.slug} className="mb-16 last:mb-0">
              <div className="mb-8">
                <div
                  className="mb-4 h-[2px] w-14"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--gold), var(--gold-light))",
                  }}
                />
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {cat.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {cat.description}
                </p>
              </div>

              <div className="space-y-4">
                {cat.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-border bg-card transition-colors open:border-gold/20"
                  >
                    <summary className="flex cursor-pointer items-start gap-3 p-5 text-left font-bold text-foreground [&::-webkit-details-marker]:hidden">
                      <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="flex-1">{faq.question}</span>
                      <span className="ml-2 mt-1 text-xs text-muted-foreground transition-transform group-open:rotate-180">
                        ▼
                      </span>
                    </summary>
                    <div className="border-t border-border px-5 pb-5 pt-4">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                      <Link
                        href={faq.sourceUrl}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gold-dark hover:underline"
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
      </section>
    </>
  );
}
