import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getPublishedArticles } from "@/lib/news-db";

export async function GET() {
  const articles = getPublishedArticles();

  const escapeXml = (str: string): string =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const items = articles
    .map(
      (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}/news/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/news/${article.slug}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
      <category>${escapeXml(article.category)}</category>
      <author>${escapeXml(article.author)}</author>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} - Market News &amp; Updates</title>
    <link>${SITE_URL}/news</link>
    <description>The latest UK development finance news, rate updates, lender product launches, market commentary, and regulatory changes.</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/news/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
