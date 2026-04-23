import Link from "next/link";
import { notFound } from "next/navigation";

import { getArticleById, NEWS_CATEGORIES } from "@/lib/news-db";
import {
  deleteArticleAction,
  saveArticleAction,
} from "../actions";

export const dynamic = "force-dynamic";

const TIERS = [
  { value: "daily-brief", label: "Daily brief" },
  { value: "deal-note", label: "Deal note" },
  { value: "editor-pick", label: "Editor pick" },
  { value: "legacy", label: "Legacy (seed)" },
];

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminNewsEditPage({ params }: PageProps) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) notFound();

  const article = getArticleById(id);
  if (!article) notFound();

  const saveBound = saveArticleAction.bind(null, id);
  const deleteBound = deleteArticleAction.bind(null, id);

  return (
    <main className="mx-auto max-w-[1360px] px-6 py-12 sm:px-10 sm:py-16">
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <Link
          href="/admin/news"
          className="editorial-link text-[12px] font-medium uppercase tracking-[0.22em]"
          style={{ color: "var(--navy-dark)" }}
        >
          ← All articles
        </Link>
        {article.is_published === 1 && (
          <Link
            href={`/news/${article.slug}`}
            target="_blank"
            rel="noopener"
            className="editorial-link text-[12px] font-medium uppercase tracking-[0.22em]"
            style={{ color: "oklch(0.40 0.03 255)" }}
          >
            View live →
          </Link>
        )}
      </div>

      <header className="mb-10">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.28em]"
          style={{ color: "oklch(0.50 0.02 255)" }}
        >
          Editing &middot; {article.generation_source === "automated" ? "Automated" : "Manual"}
          {article.source_run_id && (
            <>
              <span className="mx-2">&middot;</span>
              <span style={{ color: "var(--gold-dark)" }}>
                Run {article.source_run_id}
              </span>
            </>
          )}
        </p>
        <h1
          className="font-heading mt-3 text-3xl font-medium leading-tight tracking-tight sm:text-4xl"
          style={{ color: "var(--navy-dark)" }}
        >
          {article.title}
        </h1>
        <p
          className="mt-2 text-[13px]"
          style={{ color: "oklch(0.50 0.02 255)" }}
        >
          Slug: <code>{article.slug}</code> &middot; Published{" "}
          {formatDateTime(article.published_at)} &middot; Last updated{" "}
          {formatDateTime(article.updated_at)}
        </p>
      </header>

      <form
        action={saveBound}
        className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16"
      >
        <div className="lg:col-span-8 space-y-8">
          <Field label="Title">
            <input
              type="text"
              name="title"
              defaultValue={article.title}
              required
              className="w-full border bg-transparent px-4 py-3 text-[16px]"
              style={{
                borderColor: "var(--stone-dark)",
                color: "var(--navy-dark)",
              }}
            />
          </Field>

          <Field label="Excerpt">
            <textarea
              name="excerpt"
              defaultValue={article.excerpt}
              rows={3}
              required
              className="w-full border bg-transparent px-4 py-3 text-[15px] leading-[1.5]"
              style={{
                borderColor: "var(--stone-dark)",
                color: "var(--navy-dark)",
              }}
            />
          </Field>

          <Field label="Body (markdown — paragraphs separated by blank lines)">
            <textarea
              name="body"
              defaultValue={article.body}
              rows={24}
              required
              className="w-full border bg-transparent px-4 py-3 font-mono text-[14px] leading-[1.55]"
              style={{
                borderColor: "var(--stone-dark)",
                color: "var(--navy-dark)",
              }}
            />
          </Field>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <Field label="Category">
            <select
              name="category"
              defaultValue={article.category}
              className="w-full border bg-transparent px-4 py-3 text-[15px]"
              style={{
                borderColor: "var(--stone-dark)",
                color: "var(--navy-dark)",
              }}
            >
              {NEWS_CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tier">
            <select
              name="tier"
              defaultValue={article.tier}
              className="w-full border bg-transparent px-4 py-3 text-[15px]"
              style={{
                borderColor: "var(--stone-dark)",
                color: "var(--navy-dark)",
              }}
            >
              {TIERS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tags (comma separated)">
            <input
              type="text"
              name="tags"
              defaultValue={article.tags.join(", ")}
              className="w-full border bg-transparent px-4 py-3 text-[15px]"
              style={{
                borderColor: "var(--stone-dark)",
                color: "var(--navy-dark)",
              }}
            />
          </Field>

          <label className="flex items-center gap-3 text-[14px]">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={article.is_published === 1}
              className="h-4 w-4"
            />
            <span style={{ color: "var(--navy-dark)" }}>Published</span>
          </label>

          {article.data_sources.length > 0 && (
            <div
              className="border-t pt-6"
              style={{ borderColor: "var(--stone-dark)" }}
            >
              <p
                className="mb-3 text-[10px] font-medium uppercase tracking-[0.26em]"
                style={{ color: "oklch(0.50 0.02 255)" }}
              >
                Citations
              </p>
              <ul className="space-y-2 text-[13px]">
                {article.data_sources.map((source, idx) => (
                  <li key={idx}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-link"
                      style={{ color: "var(--navy-dark)" }}
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div
            className="border-t pt-6"
            style={{ borderColor: "var(--stone-dark)" }}
          >
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center px-6 text-[12px] font-semibold uppercase tracking-[0.22em] transition-colors"
              style={{
                background: "var(--navy-dark)",
                color: "var(--background)",
              }}
            >
              Save changes
            </button>
          </div>
        </aside>
      </form>

      <form
        action={deleteBound}
        className="mt-16 border-t pt-8"
        style={{ borderColor: "var(--stone-dark)" }}
      >
        <p
          className="mb-4 text-[11px] font-medium uppercase tracking-[0.26em]"
          style={{ color: "oklch(0.55 0.22 25)" }}
        >
          Danger zone
        </p>
        <p
          className="mb-4 max-w-[54ch] text-[14px]"
          style={{ color: "oklch(0.40 0.03 255)" }}
        >
          Deleting is permanent. If you want to hide an article without
          losing it, unpublish instead.
        </p>
        <button
          type="submit"
          className="inline-flex h-10 items-center px-5 text-[11px] font-medium uppercase tracking-[0.22em]"
          style={{
            border: "1px solid oklch(0.55 0.22 25)",
            color: "oklch(0.55 0.22 25)",
          }}
        >
          Delete article
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="mb-2 block text-[10px] font-medium uppercase tracking-[0.26em]"
        style={{ color: "oklch(0.50 0.02 255)" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
