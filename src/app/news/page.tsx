import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Newspaper, Rss } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/ui/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  getPublishedArticles,
  getArticlesByCategory,
  NEWS_CATEGORIES,
  type NewsCategory,
} from "@/lib/news-db";

export const metadata: Metadata = {
  title: `Market News & Updates | ${SITE_NAME}`,
  description:
    "The latest UK development finance news, rate updates, lender product launches, market commentary, and regulatory changes. Stay informed with Construction Capital.",
  alternates: {
    canonical: `${SITE_URL}/news`,
  },
  openGraph: {
    title: `Market News & Updates | ${SITE_NAME}`,
    description:
      "The latest UK development finance news, rate updates, lender launches, and market commentary.",
    url: `${SITE_URL}/news`,
    type: "website",
  },
};

const CATEGORY_COLOURS: Record<NewsCategory, string> = {
  "rate-update": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "lender-news": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "market-commentary": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "deal-announcement": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  regulatory: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

function categoryLabel(cat: NewsCategory): string {
  return NEWS_CATEGORIES.find((c) => c.slug === cat)?.label ?? cat;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function NewsPage({ searchParams }: PageProps) {
  const { category } = await searchParams;

  const articles =
    category && NEWS_CATEGORIES.some((c) => c.slug === category)
      ? getArticlesByCategory(category)
      : getPublishedArticles();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "News",
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero Section */}
      <section className="hero-gradient noise-overlay relative overflow-hidden py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <svg
            className="h-full w-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="news-hero-grid"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 80 0 L 0 0 0 80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#news-hero-grid)" />
          </svg>
        </div>

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "800px",
            height: "600px",
            background:
              "radial-gradient(ellipse, oklch(0.75 0.12 85 / 0.08) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="mb-8 h-[2px] w-20"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />

          <p
            className="mb-5 text-xs font-bold uppercase tracking-[0.35em] sm:text-sm"
            style={{ color: "var(--gold)" }}
          >
            Market Intelligence
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Market News &{" "}
            <span className="gold-gradient-text italic">Updates</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            Rate changes, lender launches, market analysis, and regulatory
            updates from the UK development finance market.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <p className="text-sm text-white/40">
              {articles.length} article{articles.length !== 1 ? "s" : ""}
              {category ? ` in ${categoryLabel(category as NewsCategory)}` : ""}
            </p>
            <Link
              href="/news/feed.xml"
              className="flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
            >
              <Rss className="h-3.5 w-3.5" />
              RSS Feed
            </Link>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--gold) 20%, var(--gold) 80%, transparent 100%)",
            opacity: 0.35,
          }}
        />
      </section>

      {/* Category Filters + Articles */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category pills */}
          <div className="mb-12 flex flex-wrap gap-2">
            <Link
              href="/news"
              className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                !category
                  ? "border-gold/40 bg-gold/10 text-gold-dark"
                  : "border-border bg-card text-muted-foreground hover:border-gold/30 hover:text-foreground"
              }`}
            >
              All
            </Link>
            {NEWS_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/news?category=${cat.slug}`}
                className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  category === cat.slug
                    ? "border-gold/40 bg-gold/10 text-gold-dark"
                    : "border-border bg-card text-muted-foreground hover:border-gold/30 hover:text-foreground"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Articles grid */}
          {articles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/news/${article.slug}`}
                  className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-gold/30 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        CATEGORY_COLOURS[article.category]
                      }`}
                    >
                      {categoryLabel(article.category)}
                    </span>
                    <time className="text-xs text-muted-foreground">
                      {formatDate(article.published_at)}
                    </time>
                  </div>

                  <h2 className="mb-3 text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-gold-dark">
                    {article.title}
                  </h2>

                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>

                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold-dark">
                    Read more
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Newspaper
                className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30"
              />
              <h2 className="mb-2 text-xl font-bold text-foreground">
                No articles yet
              </h2>
              <p className="text-muted-foreground">
                Market news and updates will appear here. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section
        className="noise-overlay relative overflow-hidden py-16 sm:py-20"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.08) 0%, oklch(0.75 0.12 85 / 0.04) 100%)",
        }}
      >
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Newspaper
            className="mx-auto mb-4 h-10 w-10"
            style={{ color: "var(--gold)" }}
          />
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Need Finance for Your Next Project?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Stay informed with our market updates, then let us put that
            knowledge to work. Tell us about your deal and we&apos;ll source the
            best terms from 100+ lenders.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="cta-shimmer h-14 bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark"
            >
              <Link href="/deal-room">
                Start Your Deal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
