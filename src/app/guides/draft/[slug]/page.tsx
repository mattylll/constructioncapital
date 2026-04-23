import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft, AlertTriangle } from "lucide-react";

import { SITE_IMAGES, unsplashUrl } from "@/lib/location-images";
import { loadGuideDraft, listDraftSlugs } from "@/lib/guides/load-draft";

// Dev-preview route for guide drafts in data/generated/guide-drafts/.
// Not indexed; no SEO metadata. Intended for internal review before promotion.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
return {
    title: `DRAFT: ${slug}`,
    robots: { index: false, follow: false },
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuideDraftPage({ params }: PageProps) {
  const { slug } = await params;
  const guide = loadGuideDraft(slug);
  if (!guide) notFound();

  const allSlugs = listDraftSlugs();
  const prevNext = (() => {
    const i = allSlugs.indexOf(slug);
    
return {
      prev: i > 0 ? allSlugs[i - 1] : null,
      next: i >= 0 && i < allSlugs.length - 1 ? allSlugs[i + 1] : null,
    };
  })();

  const wordCount = guide.sections
    .flatMap((s) => s.content)
    .join(" ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <>
      {/* Banner — make it impossible to confuse with a live page */}
      <div className="sticky top-0 z-50 w-full border-b border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-semibold">DRAFT PREVIEW</span>
            <span className="text-amber-800/80">— unpublished, noindex. Review before promoting.</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Link href="/guides/draft" className="rounded border border-amber-300 px-2 py-1 hover:bg-amber-100">
              All drafts ({allSlugs.length})
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--navy,#1a2744)] py-16 text-white">
        <Image
          src={unsplashUrl((SITE_IMAGES[`guide-${guide.category}`] ?? SITE_IMAGES["guides-hero"]).id, 1920, 75)}
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-white/60">
              <Clock className="h-3.5 w-3.5" />
              {guide.readingTime}
            </span>
            <span className="text-white/40">{wordCount.toLocaleString()} words</span>
            <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/60">
              {guide.category}
            </span>
          </div>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70">{guide.excerpt}</p>

          <div className="mt-8 grid grid-cols-1 gap-2 text-xs text-white/50 sm:grid-cols-2 lg:grid-cols-3">
            <Meta label="slug" value={guide.slug} mono />
            <Meta label="metaTitle" value={`${guide.metaTitle} (${guide.metaTitle.length} chars)`} />
            <Meta label="metaDescription" value={`${guide.metaDescription.length} chars`} />
            <Meta label="relatedServices" value={guide.relatedServices.join(", ") || "—"} />
            <Meta label="relatedSlugs" value={guide.relatedSlugs.length ? guide.relatedSlugs.join(", ") : "—"} />
            <Meta label="FAQs" value={String(guide.faqs?.length ?? 0)} />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Table of contents */}
          <nav className="mb-12 rounded-xl border border-border bg-muted/30 p-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">In this guide</p>
            <ol className="space-y-2">
              {guide.sections.map((section, i) => (
                <li key={i}>
                  <a href={`#section-${i}`} className="text-sm font-medium hover:text-gold-dark">
                    {i + 1}. {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Sections — render exactly as the live page does */}
          {guide.sections.map((section, i) => (
            <div key={i} id={`section-${i}`} className="mb-12">
              <h2 className="mb-5 text-2xl font-bold tracking-tight sm:text-3xl">{section.heading}</h2>
              <div className="guide-content max-w-none text-base leading-relaxed text-muted-foreground">
                {section.content.map((paragraph, j) => {
                  const isBlock =
                    paragraph.trimStart().startsWith("<table") || paragraph.trimStart().startsWith("<div");
                  
return isBlock ? (
                    <div key={j} className="my-8" dangerouslySetInnerHTML={{ __html: paragraph }} />
                  ) : (
                    <p key={j} className="mb-5" dangerouslySetInnerHTML={{ __html: paragraph }} />
                  );
                })}
              </div>
            </div>
          ))}

          {/* FAQs */}
          {guide.faqs && guide.faqs.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {guide.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group rounded-lg border border-border bg-muted/20 p-5 open:bg-muted/40"
                  >
                    <summary className="cursor-pointer text-base font-semibold">{faq.question}</summary>
                    <p
                      className="mt-3 text-sm leading-relaxed text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Prev/next nav */}
      <nav className="border-t border-border bg-muted/20 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 text-sm">
          {prevNext.prev ? (
            <Link
              href={`/guides/draft/${prevNext.prev}`}
              className="flex items-center gap-2 hover:text-gold-dark"
            >
              <ArrowLeft className="h-4 w-4" />
              {prevNext.prev}
            </Link>
          ) : (
            <span />
          )}
          <Link href="/guides/draft" className="text-muted-foreground hover:text-foreground">
            Index
          </Link>
          {prevNext.next ? (
            <Link
              href={`/guides/draft/${prevNext.next}`}
              className="flex items-center gap-2 hover:text-gold-dark"
            >
              {prevNext.next}
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </nav>
    </>
  );
}

function Meta({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="uppercase tracking-widest text-white/40">{label}</span>
      <span className={mono ? "font-mono" : ""}>{value}</span>
    </div>
  );
}
