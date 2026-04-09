import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.resolve(__dirname, "../data/sqlite");
const DB_PATH = path.join(DB_DIR, "news.db");

function getDb(): Database.Database {
  fs.mkdirSync(DB_DIR, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      body TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('rate-update','lender-news','market-commentary','deal-announcement','regulatory')),
      author TEXT NOT NULL DEFAULT 'Matt Lenzie',
      published_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      is_published INTEGER NOT NULL DEFAULT 1
    )
  `);

  return db;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Seed command ─────────────────────────────────────────────────────────────

function seed() {
  const db = getDb();

  const articles = [
    {
      title: "Base Rate Holds at 4.25% — What It Means for Development Finance",
      excerpt:
        "The Bank of England held rates steady in March 2026. We break down the impact on development finance pricing and what borrowers should expect through Q2.",
      body: `The Bank of England's Monetary Policy Committee voted 7-2 to hold the base rate at 4.25% at its March 2026 meeting, in line with market expectations. For property developers, this means the current lending environment remains broadly stable — but there are nuances worth understanding.

Development finance rates have compressed significantly since mid-2025, with top-tier lenders now offering from 6.5% on senior debt for strong sponsors. The hold gives lenders confidence to maintain — and in some cases improve — their current pricing.

However, swap rates have edged upward on the five-year tenor, suggesting the market is pricing in rates staying higher for longer than initially anticipated. This is particularly relevant for development exit finance and longer-term facilities.

For borrowers currently in the market, the message is clear: rates are competitive but unlikely to fall dramatically in the near term. Locking in terms now, particularly on larger schemes where rate movements have material impact on viability, makes sense.

We are seeing increased competition among specialist lenders for good-quality residential schemes in the South East, with several willing to stretch to 70% LTGDV without mezzanine. If you are looking to take advantage of current conditions, speak to our team about live lender appetite.`,
      category: "rate-update" as const,
      published_at: "2026-03-21",
      tags: ["base-rate", "boe", "development-finance", "rates"],
    },
    {
      title: "Octopus Real Estate Launches 80% LTGDV Product for Permitted Development",
      excerpt:
        "Octopus Real Estate has launched a new high-leverage product offering up to 80% LTGDV for permitted development conversions, targeting the growing office-to-resi market.",
      body: `Octopus Real Estate has announced a new development finance product specifically targeting permitted development rights (PDR) conversions, offering leverage up to 80% of gross development value — a significant step up from their standard 65% LTGDV product.

The product is designed for office-to-residential conversions under Class MA, which has seen a surge in activity since the relaxation of size limits in 2024. Octopus is pricing the facility from 7.25% with a 1.5% arrangement fee, available on schemes from £500k to £15m.

Key features include staged drawdowns aligned to conversion milestones, no minimum pre-sales requirement on schemes under 20 units, and a 24-month maximum term. The product is available through approved broker intermediaries.

This launch reflects growing lender appetite for PDR schemes, which typically offer faster planning certainty and shorter build programmes than ground-up development. However, borrowers should note that the higher leverage comes with stricter monitoring requirements and more conservative GDV assumptions.

Our team has already placed several enquiries with Octopus on this product. If you have a PDR scheme in the pipeline, get in touch for an initial assessment.`,
      category: "lender-news" as const,
      published_at: "2026-03-14",
      tags: ["octopus", "pdr", "high-leverage", "office-to-resi"],
    },
    {
      title: "Q1 2026 Market Commentary: Regional Development Hotspots Emerge",
      excerpt:
        "Our quarterly review of the UK development finance market reveals shifting dynamics, with regional cities outperforming London on both margins and lender appetite.",
      body: `The first quarter of 2026 has confirmed a trend we have been tracking for the past 18 months: regional development markets are now attracting premium lender appetite and delivering stronger risk-adjusted returns than prime London.

Birmingham, Manchester, and Leeds have emerged as the standout markets, with development finance applications up 34% year-on-year across our brokerage. Lenders are responding with improved terms — we have seen senior debt pricing as low as 6.75% for well-located residential schemes in these cities, compared to 7.0-7.5% for equivalent London schemes.

The drivers are clear. Build costs in regional markets are 15-25% lower than London, while sales values have shown stronger growth. The result is healthier margins that give lenders greater comfort on downside scenarios.

That said, not all regional markets are equal. Secondary towns with limited transport links and weaker employment bases continue to see conservative lender appetite. The sweet spot remains well-connected regional cities with strong rental demand as a fallback.

On the mezzanine side, we are seeing increased institutional capital entering the market, with several new funds targeting the 70-85% LTGDV space. This is driving down mezzanine pricing, with blended rates on senior-plus-mezz stacks now achievable from 8.5% on a weighted basis.

Looking ahead to Q2, we expect continued rate compression on senior debt, particularly for lenders looking to deploy capital ahead of half-year targets. Borrowers with shovel-ready schemes should be approaching the market now.`,
      category: "market-commentary" as const,
      published_at: "2026-04-01",
      tags: ["market-review", "regional", "q1-2026", "development-finance"],
    },
    {
      title: "Construction Capital Arranges £8.2m for 42-Unit Scheme in Croydon",
      excerpt:
        "We have completed a £8.2 million development finance facility for a 42-unit residential scheme in Croydon, South London, achieving 68% LTGDV with a specialist lender.",
      body: `Construction Capital has arranged an £8.2 million senior development finance facility for a 42-unit residential scheme in Croydon, South London. The facility was provided by a specialist development lender at 68% LTGDV, with pricing at 7.0% plus a 1.25% arrangement fee.

The scheme involves the demolition of a 1960s office building and construction of a six-storey residential block with a mix of one, two, and three-bedroom apartments. The gross development value is estimated at £12.1 million, with construction costs of £6.8 million.

The borrower, an experienced developer with a strong track record in South London, had initially approached their incumbent lender but found them reluctant to offer competitive terms due to the demolition element. Our team identified a specialist lender with strong appetite for this type of scheme and negotiated improved terms including a 12-month interest roll-up period.

Key to securing the facility was presenting a well-structured information package including a detailed construction programme, independent cost report, and evidence of the developer's track record on comparable schemes. The facility completed within six weeks of initial enquiry.

This deal is a good example of how specialist broker knowledge can unlock better terms. The developer saved approximately £180,000 in interest costs over the facility term compared to the initial offer from their existing lender.`,
      category: "deal-announcement" as const,
      published_at: "2026-02-28",
      tags: ["croydon", "residential", "case-study", "south-london"],
    },
    {
      title: "FCA Confirms New Disclosure Rules for Development Finance Brokers",
      excerpt:
        "The FCA has published final rules on fee disclosure for unregulated lending intermediaries, effective from September 2026. Here is what developers need to know.",
      body: `The Financial Conduct Authority has published its final rules on fee disclosure requirements for intermediaries operating in the unregulated lending space, which includes development finance brokerage. The rules take effect from 1 September 2026.

The key changes require brokers to provide borrowers with a standardised disclosure document before any fees are charged, setting out the full cost of intermediation including arrangement fees, exit fees, and any commissions received from lenders. This brings unregulated lending intermediation closer to the disclosure standards already in place for regulated mortgage advice.

For developers, this is broadly positive news. Greater transparency in fee structures will make it easier to compare brokerage propositions and ensure you understand the full cost of your finance package. At Construction Capital, we have always operated with full fee transparency, so these changes simply formalise our existing approach.

The rules also introduce a 14-day cooling-off period for brokerage agreements, giving borrowers time to review terms before committing. This does not apply to the underlying loan facility, only the broker engagement.

Brokers who fail to comply face enforcement action and potential removal from the FCA register. We expect this to accelerate consolidation in the market, with smaller operators who have relied on opaque fee structures finding it harder to compete.

Our view is that this regulation is overdue and will raise standards across the industry. Developers should welcome the move and use the standardised disclosure documents to make more informed decisions about their finance partners.`,
      category: "regulatory" as const,
      published_at: "2026-01-15",
      tags: ["fca", "regulation", "disclosure", "broker-fees"],
    },
    {
      title: "Bridging Rates Drop Below 0.5% as Competition Intensifies",
      excerpt:
        "Several bridging lenders have cut rates below 0.5% per month for the first time since 2022, signalling fierce competition for quality deal flow.",
      body: `The bridging finance market has entered a new phase of competition, with at least four lenders now offering headline rates below 0.5% per month for low-LTV, high-quality transactions. This represents the most competitive bridging market since pre-pandemic levels.

The rate compression is being driven by a combination of factors: increased institutional capital flowing into the short-term lending space, lower cost of funding as base rate expectations stabilise, and a relative shortage of quality deal flow as property transaction volumes remain below historical averages.

For borrowers, rates from 0.45% per month are achievable on bridging facilities up to 60% LTV with strong security and a clear exit strategy. At higher leverage points (65-75% LTV), rates remain in the 0.55-0.75% range depending on the complexity of the transaction.

However, borrowers should be cautious about focusing solely on headline rates. The total cost of a bridging facility includes arrangement fees (typically 1-2%), exit fees (0-1%), valuation costs, and legal fees. A facility at 0.45% with a 2% arrangement fee can work out more expensive than 0.55% with a 1% fee on shorter-term transactions.

Our advice is to look at the total cost of finance over the expected term, not just the monthly rate. Our team models this for every enquiry, presenting borrowers with a clear comparison of total costs across multiple lender options.`,
      category: "rate-update" as const,
      published_at: "2026-02-10",
      tags: ["bridging", "rates", "competition", "short-term-lending"],
    },
    {
      title: "Shawbrook Expands Development Finance Team, Signals Growth Ambitions",
      excerpt:
        "Shawbrook Bank has hired five senior development finance professionals and increased its maximum facility size to £30m, positioning for growth in the mid-market.",
      body: `Shawbrook Bank has made a significant investment in its development finance division, hiring five senior professionals from competitors and increasing its maximum facility size from £20 million to £30 million. The moves signal clear growth ambitions in the mid-market development finance space.

The new hires include two senior underwriters from OakNorth and three relationship managers from Maslow Capital, bringing deep expertise in the £5-30 million facility range. Shawbrook has also opened a new regional office in Manchester to service the growing pipeline of Northern England and Midlands opportunities.

For borrowers, the expansion means more competition in the mid-market space, which has traditionally been underserved. Facilities between £10-30 million have often fallen into a gap — too large for specialist lenders but too small for institutional players. Shawbrook is explicitly targeting this gap.

The bank is offering development finance from 6.75% with leverage up to 65% LTGDV, with the ability to go to 70% on a case-by-case basis for experienced developers. They are particularly keen on residential schemes of 20-80 units in strong regional locations.

We have already seen improved responsiveness and appetite from Shawbrook's team. If you have a mid-market scheme, they should be on your shortlist. Contact our team for an introduction.`,
      category: "lender-news" as const,
      published_at: "2025-12-05",
      tags: ["shawbrook", "lender-expansion", "mid-market"],
    },
    {
      title: "Build Cost Inflation Eases to 2.8% — Development Margins Improving",
      excerpt:
        "BCIS data shows construction cost inflation has fallen to 2.8% annually, the lowest since 2021. This is improving development appraisals and lender confidence.",
      body: `The latest data from the Building Cost Information Service (BCIS) shows that construction cost inflation has eased to 2.8% on an annual basis, down from a peak of 12.4% in 2022. This is welcome news for developers and is already feeding through into improved development appraisals and stronger lender appetite.

The deceleration is broad-based, with both labour and materials costs showing moderation. Timber prices have stabilised after the volatility of 2022-23, steel prices have fallen 8% from their peak, and concrete costs are flat year-on-year. Labour cost growth remains the stickiest component at 3.5%, reflecting ongoing skills shortages in the construction sector.

For development finance, lower build cost inflation means more schemes are passing lender viability tests. We are seeing appraisals that were marginal six months ago now showing comfortable margins, particularly for schemes in areas with strong house price growth.

Lenders are responding by relaxing some of the build cost contingency requirements they introduced during the high-inflation period. Where many were insisting on 7.5-10% contingency allowances in 2023-24, we are now seeing requirements return to the historical 5% norm for straightforward residential schemes.

However, developers should remain cautious. While headline inflation is easing, specific trades — particularly M&E (mechanical and electrical) and specialist fit-out — continue to see above-average cost increases. Detailed cost plans remain essential for securing competitive finance terms.`,
      category: "market-commentary" as const,
      published_at: "2026-03-05",
      tags: ["build-costs", "bcis", "inflation", "margins"],
    },
    {
      title: "Construction Capital Closes £14.5m Mezzanine for Manchester BTR Scheme",
      excerpt:
        "Our team has arranged a £14.5 million mezzanine facility for a 120-unit build-to-rent scheme in Manchester, achieving 87% LTGDV on a blended basis.",
      body: `Construction Capital has completed a £14.5 million mezzanine finance facility for a 120-unit build-to-rent (BTR) scheme in Manchester's Northern Quarter. Combined with the £28 million senior facility already in place, the total debt stack provides 87% of gross development value — allowing the developer to proceed with minimal equity.

The mezzanine facility was provided by a specialist real estate credit fund at a coupon of 14% with a 2% arrangement fee, representing competitive pricing for this level of leverage. The facility is fully subordinated to the senior debt and includes an intercreditor agreement that was negotiated over a four-week period.

Build-to-rent has emerged as one of the strongest sectors for mezzanine finance, as the institutional exit route (sale to a BTR fund or REIT) gives mezzanine lenders greater confidence in their downside scenarios. Several mezzanine providers have launched dedicated BTR products in the past 12 months.

The key to this transaction was structuring the capital stack to satisfy both the senior lender's covenants and the mezzanine provider's return requirements, while leaving the developer with a meaningful profit share. Our team modelled multiple scenarios before arriving at the optimal structure.

For developers considering BTR, the current mezzanine market offers an attractive route to high-leverage funding. However, the intercreditor process remains complex and time-consuming — budget at least eight weeks for the legal workstream.`,
      category: "deal-announcement" as const,
      published_at: "2025-11-18",
      tags: ["mezzanine", "btr", "manchester", "high-leverage"],
    },
    {
      title: "Building Safety Act: Impact on Development Finance in 2026",
      excerpt:
        "As the Building Safety Act's transitional provisions end, we examine how the new regime is affecting development finance applications and lender requirements.",
      body: `The Building Safety Act 2022 has now been fully in force for over two years, and its impact on development finance is becoming clearer. For developers working on residential schemes above 18 metres (roughly seven storeys), the regulatory landscape has fundamentally changed — and lenders have adjusted their requirements accordingly.

The most significant impact is on the due diligence process. Lenders financing higher-risk buildings now routinely require evidence of Building Control Approver registration, gateway stage documentation, and a clear golden thread of building information. This adds time and cost to the application process, but it is non-negotiable.

For schemes below the 18-metre threshold, the impact has been more subtle but still meaningful. Several lenders have introduced enhanced fire safety requirements for all residential schemes, regardless of height. This typically includes a fire engineer's report at planning stage, which can cost £5,000-15,000 depending on the complexity of the scheme.

The insurance market has also responded. Professional indemnity cover for designers working on higher-risk buildings has increased significantly, and this cost is flowing through to development appraisals. Lenders are now scrutinising insurance adequacy as part of their standard due diligence.

Our advice to developers is to budget for the additional compliance costs early in the appraisal process. Presenting a well-prepared compliance strategy to lenders can actually differentiate your application and improve terms, as it demonstrates a professional approach to risk management.

We have published a detailed checklist for Building Safety Act compliance in our guides section. If you are planning a scheme that falls within the higher-risk building regime, contact our team for guidance on structuring your finance application.`,
      category: "regulatory" as const,
      published_at: "2026-01-30",
      tags: ["building-safety-act", "regulation", "fire-safety", "compliance"],
    },
  ];

  const insert = db.prepare(`
    INSERT OR IGNORE INTO articles (slug, title, excerpt, body, category, author, published_at, updated_at, tags, is_published)
    VALUES (@slug, @title, @excerpt, @body, @category, @author, @published_at, @updated_at, @tags, 1)
  `);

  const insertMany = db.transaction((items: typeof articles) => {
    for (const article of items) {
      insert.run({
        slug: slugify(article.title),
        title: article.title,
        excerpt: article.excerpt,
        body: article.body,
        category: article.category,
        author: "Matt Lenzie",
        published_at: article.published_at,
        updated_at: article.published_at,
        tags: JSON.stringify(article.tags),
      });
    }
  });

  insertMany(articles);
  console.log(`Seeded ${articles.length} articles into ${DB_PATH}`);
  db.close();
}

// ── Add command ──────────────────────────────────────────────────────────────

function add() {
  const args = process.argv.slice(3);
  const get = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : undefined;
  };

  const title = get("--title");
  const category = get("--category");
  const excerpt = get("--excerpt");
  const body = get("--body");

  if (!title || !category || !excerpt || !body) {
    console.error(
      "Usage: npx tsx scripts/generate-news.ts add --title \"...\" --category \"...\" --excerpt \"...\" --body \"...\""
    );
    process.exit(1);
  }

  const db = getDb();
  const now = new Date().toISOString().split("T")[0];

  db.prepare(
    `INSERT INTO articles (slug, title, excerpt, body, category, author, published_at, updated_at, tags, is_published)
     VALUES (@slug, @title, @excerpt, @body, @category, 'Matt Lenzie', @now, @now, '[]', 1)`
  ).run({
    slug: slugify(title),
    title,
    excerpt,
    body,
    category,
    now,
  });

  console.log(`Added article: "${title}"`);
  db.close();
}

// ── List command ─────────────────────────────────────────────────────────────

function list() {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT id, slug, title, category, published_at, is_published FROM articles ORDER BY published_at DESC"
    )
    .all() as { id: number; slug: string; title: string; category: string; published_at: string; is_published: number }[];

  if (rows.length === 0) {
    console.log("No articles found. Run `npx tsx scripts/generate-news.ts seed` to add sample data.");
    db.close();
    return;
  }

  console.log(`\n${"ID".padEnd(5)} ${"Published".padEnd(12)} ${"Category".padEnd(20)} Title`);
  console.log("-".repeat(90));
  for (const row of rows) {
    const status = row.is_published ? "" : " [DRAFT]";
    console.log(
      `${String(row.id).padEnd(5)} ${row.published_at.padEnd(12)} ${row.category.padEnd(20)} ${row.title}${status}`
    );
  }
  console.log(`\n${rows.length} articles total.\n`);
  db.close();
}

// ── Main ─────────────────────────────────────────────────────────────────────

const command = process.argv[2];

switch (command) {
  case "seed":
    seed();
    break;
  case "add":
    add();
    break;
  case "list":
    list();
    break;
  default:
    console.log("Usage: npx tsx scripts/generate-news.ts <command>");
    console.log("");
    console.log("Commands:");
    console.log("  seed    Insert 10 sample articles");
    console.log("  add     Add a single article (--title, --category, --excerpt, --body)");
    console.log("  list    List all articles");
    process.exit(1);
}
