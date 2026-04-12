import type { MarketReport } from "../../types";

const report: MarketReport = {
  slug: "wales-market-overview",
  title: "Wales Property Market: Regional Analysis & County Comparison (2026)",
  metaTitle: "Wales Property Market 2026 - County Prices, Trends & Development Hotspots",
  metaDescription: "Wales property market overview: 5 counties, 44,018 sales, median £225,000. County comparisons, development hotspots & finance options.",
  excerpt: "5 counties, 44,018 transactions, median £225,000.",
  category: "regional",
  region: "Wales",
  
  
  datePublished: "2026-04-08",
  dateModified: "2026-04-08",
  readingTime: "5 min read",
  sections: [
    {
      heading: `Wales Property Market Overview`,
      content: [
        `The Wales region encompasses <strong>5 counties</strong>, recording a combined <strong>44,018</strong> residential transactions over the past 12 months. The regional median property price stands at <strong>£225,000</strong>, with prices rising at <strong>+3.4%</strong> year-on-year.`,
        `New-build activity across the region totalled <strong>951 completions</strong>, demonstrating an active development pipeline.`,
      ],
    },
    {
      heading: `County-by-County Comparison`,
      content: [
        `The table below compares all 5 counties in the Wales region, ranked by median property price. Click any county name for the full market report.`,
        `<table><thead><tr><th>County</th><th>Median Price</th><th>Sales (12m)</th><th>YoY Change</th><th>New Builds</th></tr></thead><tbody><tr><td><a href="/market-reports/cardiff-property-market">Cardiff</a></td><td>£265,000</td><td>20,970</td><td>+1.1%</td><td>552</td></tr><tr><td><a href="/market-reports/powys-property-market">Powys</a></td><td>£241,875</td><td>1,795</td><td>+2.3%</td><td>39</td></tr><tr><td><a href="/market-reports/newport-property-market">Newport</a></td><td>£225,000</td><td>5,792</td><td>+0.1%</td><td>147</td></tr><tr><td><a href="/market-reports/gwynedd-property-market">Gwynedd</a></td><td>£197,488</td><td>1,950</td><td>+9.5%</td><td>2</td></tr><tr><td><a href="/market-reports/swansea-property-market">Swansea</a></td><td>£197,000</td><td>13,511</td><td>+4.2%</td><td>211</td></tr></tbody></table>`,
      ],
    },
    {
      heading: `Price Geography`,
      content: [
        `Property prices across Wales vary significantly. <a href="/market-reports/cardiff-property-market">Cardiff</a> commands the highest median price at <strong>£265,000</strong>, while <a href="/market-reports/swansea-property-market">Swansea</a> offers the most affordable entry at <strong>£197,000</strong> - a spread of <strong>£68k</strong>.`,
        `This price differential creates opportunities across the risk-return spectrum. Premium locations offer higher GDVs but require larger capital commitments, while more affordable areas can deliver stronger percentage returns on lower absolute investment.`,
      ],
    },
    {
      heading: `Development Hotspots`,
      content: [
        `The most active development markets in Wales, measured by new-build completions, are <a href="/market-reports/cardiff-property-market">Cardiff</a> (552 new builds), <a href="/market-reports/swansea-property-market">Swansea</a> (211 new builds), <a href="/market-reports/newport-property-market">Newport</a> (147 new builds).`,
        `By total transaction volume - an indicator of market liquidity and exit confidence - <a href="/market-reports/cardiff-property-market">Cardiff</a> (20,970 sales), <a href="/market-reports/swansea-property-market">Swansea</a> (13,511 sales), <a href="/market-reports/newport-property-market">Newport</a> (5,792 sales) lead the region.`,
        `Developers entering the Wales market should weigh these two metrics together: new-build activity shows where planning consent is achievable, while transaction volume confirms buyer demand.`,
      ],
    },
    {
      heading: `Finance Landscape`,
      content: [
        `Development finance across Wales varies by location and scheme size. In premium areas like Cardiff, typical scheme GDVs support larger facilities, while more affordable counties may suit developers using <a href="/services/bridging-loans">bridging finance</a> for refurbishment-led strategies.`,
        `<a href="/services/development-finance">Senior development finance</a> is available from 6.5% p.a. at up to 65-70% LTGDV, with <a href="/services/mezzanine-finance">mezzanine finance</a> stretching total borrowing to 85-90% of costs. For developers building across multiple sites in the region, portfolio-level facilities can offer better terms.`,
        `Construction Capital sources terms from 100+ lenders across the Wales region. Submit your scheme through our <a href="/deal-room">deal room</a> for indicative terms within 24 hours.`,
      ],
    },
    {
      heading: `Key Takeaways`,
      content: [
        `<ul>
<li><strong>Market size:</strong> 44,018 transactions across 5 counties - one of the UK's most active regions.</li>
<li><strong>Price range:</strong> £197,000 to £265,000 median prices, offering opportunities across the capital spectrum.</li>
<li><strong>Market direction:</strong> 5 of 5 counties showing year-on-year price growth.</li>
<li><strong>New build activity:</strong> 951 completions across the region, indicating a healthy development pipeline.</li>
<li><strong>Finance availability:</strong> Full range of development finance, mezzanine, bridging, and exit products available across all Wales counties.</li>
</ul>`,
      ],
    },
  ],
  faqs: [
    {
      question: `What is the average house price in Wales?`,
      answer: `The median house price across Wales is £225,000, based on 44,018 transactions over the past 12 months. Prices range from £197,000 in Swansea to £265,000 in Cardiff.`,
    },
    {
      question: `Which county in Wales is best for property development?`,
      answer: `This depends on your strategy. Cardiff offers the highest transaction volumes (20,970 sales) for exit confidence. Cardiff has the most new-build activity (552 completions). See the individual county reports for detailed analysis.`,
    },
    {
      question: `How are property prices trending in Wales?`,
      answer: `Prices across Wales are rising at +3.4% year-on-year. 5 of 5 counties are seeing price growth.`,
    },
  ],
  relatedReportSlugs: ["swansea-property-market", "gwynedd-property-market", "newport-property-market", "powys-property-market", "cardiff-property-market"],
  relatedTownSlugs: [],
  relatedServiceSlugs: ["development-finance", "bridging-loans", "mezzanine-finance"],
};

export default report;
