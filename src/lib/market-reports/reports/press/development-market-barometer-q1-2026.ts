import type { MarketReport } from "../../types";

const report: MarketReport = {
  slug: "development-market-barometer-q1-2026",
  title: "Development Finance Market Barometer Q1 2026",
  metaTitle: "Development Finance Market Barometer Q1 2026 | National Overview",
  metaDescription: "Comprehensive national overview of the UK development market in Q1 2026. Regional breakdowns, transaction volumes, price trends, and planning pipeline analysis.",
  excerpt: "451,709 transactions, £275,000 national median, -1.1% average YoY.",
  category: "thematic",
  datePublished: "2026-04-12",
  dateModified: "2026-04-12",
  readingTime: "6 min read",
  sections: [
    {
      heading: "National Market Snapshot",
      content: [
        "The UK development market in Q1 2026 is characterised by <strong>451,709</strong> residential transactions in the past 12 months across 48 counties. The national median price stands at <strong>£275,000</strong>, with an average year-on-year change of <strong>-1.1%</strong>.",
        "Of towns with meaningful transaction volumes, <strong>124</strong> are recording price growth and <strong>207</strong> are seeing declines. New build activity accounts for 10,043 of 451,709 total transactions (2.2%).",
      ],
    },
    {
      heading: "Regional Performance",
      content: [
        "<table><thead><tr><th>Region</th><th>Transactions</th><th>Median Price</th><th>Avg YoY</th><th>New Builds</th><th>Counties</th></tr></thead><tbody><tr><td>London & South East</td><td>115,825</td><td>£396,000</td><td>-0.5%</td><td>2,391</td><td>10</td></tr><tr><td>South West</td><td>60,559</td><td>£304,623</td><td>-1.9%</td><td>845</td><td>7</td></tr><tr><td>North West</td><td>58,026</td><td>£163,750</td><td>-1.5%</td><td>1,172</td><td>5</td></tr><tr><td>Wales</td><td>44,018</td><td>£225,000</td><td>+3.4%</td><td>951</td><td>5</td></tr><tr><td>West Midlands</td><td>43,707</td><td>£265,000</td><td>-1.0%</td><td>912</td><td>5</td></tr><tr><td>East of England</td><td>43,335</td><td>£274,000</td><td>-2.9%</td><td>1,607</td><td>6</td></tr><tr><td>Yorkshire & Humber</td><td>40,916</td><td>£192,625</td><td>-1.8%</td><td>864</td><td>4</td></tr><tr><td>East Midlands</td><td>22,777</td><td>£215,000</td><td>-3.9%</td><td>780</td><td>3</td></tr><tr><td>North East</td><td>22,546</td><td>£149,438</td><td>-1.3%</td><td>521</td><td>3</td></tr></tbody></table>",
        "<strong>London & South East</strong> leads by transaction volume with 115,825 sales across 10 counties, at a median price of £396,000 and -0.5% average year-on-year change.",
      ],
    },
    {
      heading: "Planning Pipeline Overview",
      content: [
        "Across 7 counties with planning data (<a href=\"/market-reports/east-sussex-property-market\">East Sussex</a>, <a href=\"/market-reports/essex-property-market\">Essex</a>, <a href=\"/market-reports/greater-london-property-market\">Greater London</a>, <a href=\"/market-reports/hertfordshire-property-market\">Hertfordshire</a>, <a href=\"/market-reports/norfolk-property-market\">Norfolk</a>, <a href=\"/market-reports/nottinghamshire-property-market\">Nottinghamshire</a>, <a href=\"/market-reports/surrey-property-market\">Surrey</a>), the development pipeline contains <strong>6,557</strong> relevant applications with an estimated total GDV of <strong>£5.5bn</strong> and <strong>14,867</strong> residential units.",
        "This pipeline signals continued developer confidence and sustained demand for <a href=\"/services/development-finance\">development finance</a> across the South East and East of England in particular.",
      ],
    },
    {
      heading: "Lender Appetite and Market Conditions",
      content: [
        "Development finance lenders are broadly active in Q1 2026, with appetite strongest in regions showing stable or growing prices. Senior debt is typically available at 60–70% LTV (of GDV) for experienced developers, with rates from 7–10% per annum depending on scheme risk.",
        "For first-time developers or higher-risk schemes, <a href=\"/services/mezzanine-finance\">mezzanine finance</a> can bridge the gap between senior debt and equity, enabling projects to proceed with less personal capital. <a href=\"/services/bridging-loans\">Bridging loans</a> remain the go-to product for site acquisition ahead of planning or development finance drawdown.",
      ],
    },
    {
      heading: "Submit Your Scheme",
      content: [
        "The data in this barometer is drawn from Land Registry transaction records and local authority planning portals. For developers looking to capitalise on current market conditions, Construction Capital provides access to 100+ development finance lenders.",
        "Submit your scheme via our <a href=\"/deal-room\">deal room</a> for a no-obligation quote, or explore our <a href=\"/services/development-finance\">development finance</a> page to understand the options available.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the current average house price in England and Wales?",
      answer: "Based on Land Registry data across 48 counties and 360 towns, the national median price is £275,000 as of Q1 2026.",
    },
    {
      question: "Are house prices rising or falling in 2026?",
      answer: "It varies by location. Of towns with meaningful transaction volumes, 124 are seeing year-on-year growth and 207 are experiencing declines. The national average year-on-year change is -1.1%.",
    },
    {
      question: "How much new build activity is there in the UK?",
      answer: "New build transactions account for 10,043 of 451,709 total sales (2.2%), based on Land Registry data across 48 counties.",
    },
  ],
  relatedReportSlugs: ["greater-london-property-market","surrey-property-market","cornwall-property-market","devon-property-market","greater-manchester-property-market"],
  relatedTownSlugs: [],
  relatedServiceSlugs: ["development-finance", "bridging-loans", "mezzanine-finance"],
  charts: {
    townYoyChange: [{"name":"London & South East","value":-0.5},{"name":"South West","value":-1.9},{"name":"North West","value":-1.5},{"name":"Wales","value":3.4},{"name":"West Midlands","value":-1},{"name":"East of England","value":-2.9},{"name":"Yorkshire & Humber","value":-1.8},{"name":"East Midlands","value":-3.9},{"name":"North East","value":-1.3}],
  },
};

export default report;
