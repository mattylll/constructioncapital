import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getAllArticles, NEWS_CATEGORIES } from "@/lib/news-db";
import { togglePublishAction } from "./actions";

export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function categoryLabel(slug: string): string {
  return NEWS_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export default async function AdminNewsListPage() {
  const articles = getAllArticles();
  const published = articles.filter((a) => a.is_published === 1).length;
  const drafts = articles.length - published;
  const automated = articles.filter(
    (a) => a.generation_source === "automated"
  ).length;

  return (
    <main className="mx-auto max-w-[1360px] px-6 py-12 sm:px-10 sm:py-16">
      <header className="mb-12">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.32em]"
          style={{ color: "var(--navy)" }}
        >
          News desk
        </p>
        <h1
          className="font-heading mt-4 text-4xl font-medium leading-tight tracking-tight sm:text-5xl"
          style={{ color: "var(--navy-dark)" }}
        >
          Daily brief — admin.
        </h1>
        <p
          className="mt-4 max-w-[46ch] text-[16px] leading-[1.6]"
          style={{ color: "oklch(0.40 0.03 255)" }}
        >
          Every article the site has ever held. Published articles are live
          on <code className="text-[13px]">/news</code>; drafts sit here
          until you flip them. Automated articles come from the daily
          pipeline.
        </p>

        <dl
          className="mt-10 grid grid-cols-3 gap-6 border-y py-6"
          style={{ borderColor: "var(--stone-dark)", maxWidth: "640px" }}
        >
          {[
            { label: "Published", value: published },
            { label: "Drafts", value: drafts },
            { label: "Automated", value: automated },
          ].map((stat) => (
            <div key={stat.label}>
              <dt
                className="text-[10px] font-medium uppercase tracking-[0.24em]"
                style={{ color: "oklch(0.50 0.02 255)" }}
              >
                {stat.label}
              </dt>
              <dd
                className="numeral-tabular font-heading mt-2 text-2xl font-medium tracking-tight"
                style={{ color: "var(--navy-dark)" }}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <section>
        <div
          className="flex items-baseline justify-between gap-4 border-b pb-3"
          style={{ borderColor: "var(--stone-dark)" }}
        >
          <p
            className="text-[10px] font-medium uppercase tracking-[0.26em]"
            style={{ color: "oklch(0.50 0.02 255)" }}
          >
            All articles &middot; newest first
          </p>
          <p
            className="numeral-tabular text-[11px]"
            style={{ color: "oklch(0.50 0.02 255)" }}
          >
            {articles.length} total
          </p>
        </div>

        <ul>
          {articles.map((article) => (
            <li
              key={article.id}
              className="border-b"
              style={{ borderColor: "var(--stone-dark)" }}
            >
              <div className="grid grid-cols-12 items-baseline gap-4 py-5 sm:gap-6">
                <div className="col-span-12 flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:col-span-2">
                  <time
                    className="numeral-tabular text-[12px] font-medium uppercase tracking-[0.22em]"
                    style={{ color: "oklch(0.50 0.02 255)" }}
                  >
                    {formatDate(article.published_at)}
                  </time>
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <p
                    className="text-[10px] font-medium uppercase tracking-[0.24em]"
                    style={{ color: "var(--navy)" }}
                  >
                    {categoryLabel(article.category)}
                    {article.tier && article.tier !== "legacy" && (
                      <>
                        <span className="mx-2">&middot;</span>
                        {article.tier}
                      </>
                    )}
                    {article.generation_source === "automated" && (
                      <>
                        <span className="mx-2">&middot;</span>
                        <span style={{ color: "var(--gold-dark)" }}>
                          Automated
                        </span>
                      </>
                    )}
                  </p>
                  <Link
                    href={`/admin/news/${article.id}`}
                    className="font-heading mt-1 block text-[17px] font-medium leading-snug tracking-tight hover:underline"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {article.title}
                  </Link>
                </div>
                <div className="col-span-12 flex flex-wrap items-center gap-2 sm:col-span-4 sm:justify-end">
                  <form
                    action={async () => {
                      "use server";
                      await togglePublishAction(
                        article.id,
                        article.is_published === 0
                      );
                    }}
                  >
                    <button
                      type="submit"
                      className="inline-flex h-8 items-center px-3 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors"
                      style={{
                        border: "1px solid var(--stone-dark)",
                        color:
                          article.is_published === 1
                            ? "var(--navy-dark)"
                            : "var(--gold-dark)",
                        background:
                          article.is_published === 1
                            ? "var(--paper)"
                            : "oklch(0.75 0.12 85 / 0.08)",
                      }}
                    >
                      {article.is_published === 1 ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <Link
                    href={`/admin/news/${article.id}`}
                    className="group inline-flex h-8 items-center gap-1.5 px-3 text-[11px] font-medium uppercase tracking-[0.2em]"
                    style={{
                      border: "1px solid var(--stone-dark)",
                      color: "var(--navy-dark)",
                    }}
                  >
                    Edit
                    <ArrowUpRight
                      className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      style={{ color: "var(--gold-dark)" }}
                    />
                  </Link>
                  {article.is_published === 1 && (
                    <Link
                      href={`/news/${article.slug}`}
                      target="_blank"
                      rel="noopener"
                      className="group inline-flex h-8 items-center gap-1.5 px-3 text-[11px] font-medium uppercase tracking-[0.2em]"
                      style={{
                        color: "oklch(0.40 0.03 255)",
                      }}
                    >
                      View
                      <ArrowUpRight
                        className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
