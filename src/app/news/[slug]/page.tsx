import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  CTAButton,
  EditorialSection,
  PageHero,
  ProseSection,
  RelatedGrid,
  SectionHeader,
} from "@/components/editorial/primitives";
import { JsonLd } from "@/components/ui/json-ld";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  getPublishedArticles,
  getArticleBySlug,
  getRelatedArticles,
  NEWS_CATEGORIES,
  type NewsCategory,
} from "@/lib/news-db";

export const dynamicParams = true;
export const revalidate = 86400;

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

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getPublishedArticles().map((a) => ({ slug: a.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | ${SITE_NAME}`,
    description: article.excerpt,
    alternates: { canonical: `${SITE_URL}/news/${slug}` },
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

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(slug, 3);

  const paragraphs = article.body
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

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
      worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
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
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "News",
        item: `${SITE_URL}/news`,
      },
      { "@type": "ListItem", position: 3, name: article.title },
    ],
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <PageHero
        tone="paper"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          {
            label:
              article.title.length > 60
                ? article.title.slice(0, 60) + "…"
                : article.title,
          },
        ]}
        eyebrow={
          <>
            {categoryLabel(article.category)} &middot;{" "}
            {formatDate(article.published_at)} &middot; {readingTime(article.body)}
          </>
        }
        title={article.title}
        deck={article.excerpt}
      />

      {/* Body */}
      <EditorialSection tone="paper">
        <ProseSection title="">
          <p
            className="text-[11px] font-medium uppercase tracking-[0.26em]"
            style={{ color: "oklch(0.50 0.02 255)" }}
          >
            By {article.author} &middot; Founder, {SITE_NAME}
          </p>
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </ProseSection>

        {article.tags.length > 0 && (
          <div
            className="mx-auto mt-16 max-w-[1080px] border-t pt-6"
            style={{ borderColor: "var(--stone-dark)" }}
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span
                className="text-[10px] font-medium uppercase tracking-[0.28em]"
                style={{ color: "oklch(0.50 0.02 255)" }}
              >
                Tagged
              </span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[13px]"
                  style={{ color: "oklch(0.35 0.04 255)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </EditorialSection>

      {/* Author note */}
      <EditorialSection tone="stone">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p
              className="text-[10px] font-medium uppercase tracking-[0.3em]"
              style={{ color: "oklch(0.50 0.02 255)" }}
            >
              About the author
            </p>
            <p
              className="font-heading mt-4 text-3xl font-medium tracking-tight"
              style={{ color: "var(--navy-dark)" }}
            >
              Matt Lenzie.
            </p>
            <p
              className="mt-2 text-[13px] font-medium uppercase tracking-[0.22em]"
              style={{ color: "var(--gold-dark)" }}
            >
              Founder &amp; principal broker
            </p>
          </div>
          <div
            className="lg:col-span-7 lg:col-start-6 text-[16px] leading-[1.7]"
            style={{ color: "oklch(0.35 0.04 255)" }}
          >
            <p>
              Matt has arranged over £500M of UK property development
              finance across 25+ years. He writes the daily brief using
              the same data and lender contacts he uses to structure live
              deals &mdash; so the commentary reflects what the market is
              actually doing, not what it should be.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
              <Link
                href="/about"
                className="editorial-link"
                style={{ color: "var(--navy-dark)" }}
              >
                Read the full bio
              </Link>
              <span style={{ color: "oklch(0.70 0.02 255)" }}>&middot;</span>
              <a
                href={`mailto:${CONTACT.email}`}
                className="editorial-link"
                style={{ color: "var(--navy-dark)" }}
              >
                Email Matt directly
              </a>
            </div>
          </div>
        </div>
      </EditorialSection>

      {/* Related */}
      {related.length > 0 && (
        <EditorialSection tone="paper">
          <SectionHeader
            tone="paper"
            eyebrow="Related reading"
            title="More on this topic."
          />
          <div className="mt-12">
            <RelatedGrid
              tone="paper"
              items={related.map((rel) => ({
                href: `/news/${rel.slug}`,
                eyebrow: `${categoryLabel(rel.category)} · ${formatDate(rel.published_at)}`,
                title: rel.title,
                body: rel.excerpt,
                meta: readingTime(rel.body),
              }))}
            />
          </div>
        </EditorialSection>
      )}

      {/* CTA */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="From commentary to deal"
          title={
            <>
              Reading the market
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                is half the job.
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
