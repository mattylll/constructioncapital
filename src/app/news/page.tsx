import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Rss } from "lucide-react";

import {
  CTAButton,
  EditorialSection,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
import { JsonLd } from "@/components/ui/json-ld";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";
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

function readingTime(body: string): string {
  const words = body.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
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

  const allPublished = getPublishedArticles();
  const thisYear = allPublished.filter(
    (a) => new Date(a.published_at).getFullYear() === new Date().getFullYear()
  ).length;
  const latest = allPublished[0];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "News" },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <PageHero
        tone="paper"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News" }]}
        eyebrow="News & commentary"
        title={
          <>
            From the desk.
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              Daily.
            </span>
          </>
        }
        deck={
          <>
            A daily read of the UK property-finance market &mdash; rate
            moves, lender news, planning activity, transactions. Written
            against the same data we use to price live deals, so every
            number cites its source.
          </>
        }
        stats={[
          { label: "This year", value: thisYear },
          { label: "Categories", value: NEWS_CATEGORIES.length },
          { label: "Author", value: "Matt Lenzie" },
        ]}
        actions={
          <Link
            href="/news/feed.xml"
            className="group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.22em]"
            style={{ color: "var(--navy-dark)" }}
          >
            <Rss className="h-3.5 w-3.5" style={{ color: "var(--gold-dark)" }} />
            <span className="editorial-link">Subscribe via RSS</span>
          </Link>
        }
      />

      {/* ━━━ Category filter rail + list ━━━ */}
      <EditorialSection tone="paper">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-3">
            <p
              className="mb-6 text-[10px] font-medium uppercase tracking-[0.28em]"
              style={{ color: "oklch(0.50 0.02 255)" }}
            >
              Filter by topic
            </p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/news"
                  className={`group flex items-baseline justify-between gap-3 border-l-2 pl-4 text-[15px] transition-colors ${
                    !category ? "font-medium" : ""
                  }`}
                  style={{
                    borderColor: !category ? "var(--gold)" : "transparent",
                    color: !category
                      ? "var(--navy-dark)"
                      : "oklch(0.40 0.03 255)",
                  }}
                >
                  <span>All articles</span>
                  <span
                    className="numeral-tabular text-[11px]"
                    style={{ color: "oklch(0.50 0.02 255)" }}
                  >
                    {allPublished.length}
                  </span>
                </Link>
              </li>
              {NEWS_CATEGORIES.map((cat) => {
                const count = getArticlesByCategory(cat.slug).length;
                const active = category === cat.slug;
                return (
                  <li key={cat.slug}>
                    <Link
                      href={`/news?category=${cat.slug}`}
                      className={`group flex items-baseline justify-between gap-3 border-l-2 pl-4 text-[15px] transition-colors ${active ? "font-medium" : ""}`}
                      style={{
                        borderColor: active ? "var(--gold)" : "transparent",
                        color: active
                          ? "var(--navy-dark)"
                          : "oklch(0.40 0.03 255)",
                      }}
                    >
                      <span>{cat.label}</span>
                      <span
                        className="numeral-tabular text-[11px]"
                        style={{ color: "oklch(0.50 0.02 255)" }}
                      >
                        {count}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="lg:col-span-9">
            {articles.length > 0 ? (
              <ul
                className="border-t"
                style={{ borderColor: "var(--stone-dark)" }}
              >
                {articles.map((article, idx) => (
                  <li
                    key={article.slug}
                    className="border-b"
                    style={{ borderColor: "var(--stone-dark)" }}
                  >
                    <Link
                      href={`/news/${article.slug}`}
                      className="group grid grid-cols-12 items-baseline gap-4 py-7 transition-colors hover:bg-[oklch(0.75_0.12_85/0.04)] sm:gap-8 sm:py-9"
                    >
                      <div className="col-span-12 flex items-baseline gap-4 sm:col-span-3 sm:flex-col sm:items-start sm:gap-2">
                        <time
                          className="numeral-tabular text-[11px] font-medium uppercase tracking-[0.24em]"
                          style={{ color: "oklch(0.50 0.02 255)" }}
                        >
                          {formatDate(article.published_at)}
                        </time>
                        {idx === 0 && !category && (
                          <span
                            className="text-[10px] font-medium uppercase tracking-[0.28em]"
                            style={{ color: "var(--gold-dark)" }}
                          >
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="col-span-12 sm:col-span-7">
                        <p
                          className="text-[11px] font-medium uppercase tracking-[0.24em]"
                          style={{ color: "var(--navy)" }}
                        >
                          {categoryLabel(article.category)}
                        </p>
                        <h2
                          className="font-heading mt-2 text-2xl font-medium leading-tight tracking-tight"
                          style={{ color: "var(--navy-dark)" }}
                        >
                          {article.title}
                        </h2>
                        <p
                          className="mt-3 line-clamp-2 text-[15px] leading-[1.55]"
                          style={{ color: "oklch(0.40 0.03 255)" }}
                        >
                          {article.excerpt}
                        </p>
                      </div>
                      <div className="col-span-12 flex items-baseline justify-between gap-4 sm:col-span-2 sm:justify-end sm:text-right">
                        <span
                          className="text-[11px] font-medium uppercase tracking-[0.24em]"
                          style={{ color: "oklch(0.50 0.02 255)" }}
                        >
                          {readingTime(article.body)}
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          style={{ color: "var(--gold-dark)" }}
                        />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                className="flex flex-col items-start gap-4 border-y py-14"
                style={{ borderColor: "var(--stone-dark)" }}
              >
                <p
                  className="text-[11px] font-medium uppercase tracking-[0.28em]"
                  style={{ color: "oklch(0.50 0.02 255)" }}
                >
                  Nothing here yet
                </p>
                <p
                  className="font-heading text-2xl font-medium tracking-tight"
                  style={{ color: "var(--navy-dark)" }}
                >
                  New articles publish most mornings.
                </p>
                <p
                  className="text-[15px] leading-[1.6]"
                  style={{ color: "oklch(0.42 0.03 255)" }}
                >
                  Check back tomorrow or{" "}
                  <Link href="/news" className="editorial-link">
                    clear the category filter
                  </Link>{" "}
                  to see everything.
                </p>
              </div>
            )}
          </div>
        </div>

        {latest && !category && (
          <div
            className="mt-16 border-t pt-8"
            style={{ borderColor: "var(--stone-dark)" }}
          >
            <p
              className="text-[11px] font-medium uppercase tracking-[0.24em]"
              style={{ color: "oklch(0.50 0.02 255)" }}
            >
              Data sources feeding the daily brief
            </p>
            <p
              className="mt-3 max-w-[70ch] text-[14px] leading-[1.65]"
              style={{ color: "oklch(0.42 0.03 255)" }}
            >
              HM Land Registry transaction data, local planning authorities
              via Idox, Bank of England MPC releases, ONS House Price Index,
              HMRC SDLT receipts, and curated UK property-finance press
              feeds. Every numeric claim on a given article cites its
              source.
            </p>
          </div>
        )}
      </EditorialSection>

      {/* ━━━ CTA ━━━ */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="From the news to your deal"
          title={
            <>
              Reading the market
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                is the easy half.
              </span>
            </>
          }
          body="Structuring a facility against what the market is doing is the other half. Send us the outline and we come back with indicative pricing inside a working day."
        />
        <div className="mt-12 flex flex-wrap items-center gap-5">
          <CTAButton href="/deal-room" variant="gold" size="lg">
            Start a deal
          </CTAButton>
          <a
            href={`tel:${CONTACT.phoneRaw}`}
            className="numeral-tabular editorial-link inline-flex h-14 items-center text-lg font-medium tracking-tight"
            style={{ color: "oklch(1 0 0 / 0.95)" }}
          >
            Or call {CONTACT.phone}
          </a>
        </div>
      </EditorialSection>
    </>
  );
}
