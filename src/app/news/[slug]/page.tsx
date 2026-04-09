import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft, Calendar, User, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/ui/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  getPublishedArticles,
  getArticleBySlug,
  getRelatedArticles,
  NEWS_CATEGORIES,
  type NewsCategory,
} from "@/lib/news-db";

export const dynamicParams = true;
export const revalidate = 86400;

// ── Category colours ─────────────────────────────────────────────────────────

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

// ── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getPublishedArticles().map((a) => ({ slug: a.slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: `${article.title} | ${SITE_NAME}`,
    description: article.excerpt,
    alternates: {
      canonical: `${SITE_URL}/news/${slug}`,
    },
    openGraph: {
      title: `${article.title} | ${SITE_NAME}`,
      description: article.excerpt,
      url: `${SITE_URL}/news/${slug}`,
      type: "article",
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(slug, 3);

  // Split body into paragraphs
  const paragraphs = article.body
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  // JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    url: `${SITE_URL}/news/${slug}`,
    author: {
      "@type": "Person",
      name: article.author,
      jobTitle: "Founder",
      worksFor: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/news/${slug}`,
    },
    keywords: article.tags.join(", "),
  };

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
        item: `${SITE_URL}/news`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero Section */}
      <section className="hero-gradient noise-overlay relative overflow-hidden py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <svg
            className="h-full w-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="news-article-grid"
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
            <rect
              width="100%"
              height="100%"
              fill="url(#news-article-grid)"
            />
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
          {/* Breadcrumbs */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-white/40">
              <li>
                <Link href="/" className="hover:text-white/70">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/news" className="hover:text-white/70">
                  News
                </Link>
              </li>
              <li>/</li>
              <li className="line-clamp-1 text-white/60">
                {article.title.length > 50
                  ? article.title.slice(0, 50) + "..."
                  : article.title}
              </li>
            </ol>
          </nav>

          <div
            className="mb-8 h-[2px] w-20"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />

          <div className="mb-5 flex items-center gap-3">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                CATEGORY_COLOURS[article.category]
              }`}
            >
              {categoryLabel(article.category)}
            </span>
            <span className="text-xs text-white/30">
              {formatDate(article.published_at)}
            </span>
          </div>

          <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {article.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            {article.excerpt}
          </p>
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

      {/* Article Body */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 flex items-center gap-4 border-b border-border pb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                <User className="h-5 w-5 text-gold-dark" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {article.author}
                </p>
                <p className="text-xs text-muted-foreground">
                  Founder, {SITE_NAME}
                </p>
              </div>
            </div>

            <div className="prose-content">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="mb-5 text-base leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-10 border-t border-border pt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {article.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Author Card */}
      <section className="bg-muted/30 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <User className="h-7 w-7 text-gold-dark" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">
                    Matt Lenzie
                  </p>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Founder, {SITE_NAME}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Matt has over 25 years of experience in UK property
                    development finance. He founded {SITE_NAME} to give
                    developers transparent access to the best funding structures
                    from a panel of 100+ lenders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="bg-background py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div
                className="mb-5 h-[2px] w-14"
                style={{
                  background:
                    "linear-gradient(90deg, var(--gold), var(--gold-light))",
                }}
              />
              <h3 className="mb-6 text-xl font-bold tracking-tight sm:text-2xl">
                Related Articles
              </h3>

              <div className="space-y-4">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/news/${rel.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-gold/30"
                  >
                    <div>
                      <div className="mb-1.5 flex items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            CATEGORY_COLOURS[rel.category]
                          }`}
                        >
                          {categoryLabel(rel.category)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(rel.published_at)}
                        </span>
                      </div>
                      <h4 className="font-bold text-foreground">
                        {rel.title}
                      </h4>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="noise-overlay relative overflow-hidden py-16 sm:py-20"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.16 0.05 255) 0%, oklch(0.20 0.06 255) 50%, oklch(0.16 0.05 255) 100%)",
        }}
      >
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Ready to Fund Your Next Project?
          </h2>
          <p className="mt-3 text-white/50">
            Tell us about your development and we&apos;ll source the best terms
            from our panel of 100+ lenders. Indicative terms within 24 hours.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 border-white/20 px-8 text-base text-white hover:bg-white/10"
            >
              <Link href="/news">
                <ArrowLeft className="mr-2 h-5 w-5" />
                All News
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
