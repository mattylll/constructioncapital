import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { listDraftSlugs, loadGuideDraft } from "@/lib/guides/load-draft";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Guide Drafts — Internal Preview",
  robots: { index: false, follow: false },
};

export default async function GuideDraftsIndex() {
  const slugs = listDraftSlugs();
  const rows = slugs.map((slug) => {
    const g = loadGuideDraft(slug);
    if (!g) return { slug, title: slug, wc: 0, sections: 0, faqs: 0, category: "—", metaTitleLen: 0 };
    const wc = g.sections
      .flatMap((s) => s.content)
      .join(" ")
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
    
return {
      slug: g.slug,
      title: g.title,
      wc,
      sections: g.sections.length,
      faqs: g.faqs?.length ?? 0,
      category: g.category,
      metaTitleLen: g.metaTitle.length,
    };
  });

  return (
    <>
      <div className="sticky top-0 z-50 w-full border-b border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-semibold">DRAFT INDEX</span>
          <span className="text-amber-800/80">— internal preview, not indexed.</span>
        </div>
      </div>

      <section className="bg-background py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Guide Drafts ({rows.length})</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Rendered from <code className="rounded bg-muted px-1.5 py-0.5 text-xs">data/generated/guide-drafts/</code>.
            Promote approved drafts with{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">npx tsx scripts/promote-guide-drafts.ts --write</code>.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="py-3 pr-4">Slug</th>
                  <th className="py-3 pr-4">Title</th>
                  <th className="py-3 pr-4">Category</th>
                  <th className="py-3 pr-4 text-right">Words</th>
                  <th className="py-3 pr-4 text-right">Sections</th>
                  <th className="py-3 pr-4 text-right">FAQs</th>
                  <th className="py-3 pr-4 text-right">Meta len</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.slug} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 pr-4 font-mono text-xs">
                      <Link href={`/guides/draft/${r.slug}`} className="text-gold-dark hover:underline">
                        {r.slug}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">{r.title}</td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums">{r.wc.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-right tabular-nums">{r.sections}</td>
                    <td className="py-3 pr-4 text-right tabular-nums">{r.faqs}</td>
                    <td className={`py-3 pr-4 text-right tabular-nums ${r.metaTitleLen > 60 ? "text-red-600" : ""}`}>
                      {r.metaTitleLen}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
