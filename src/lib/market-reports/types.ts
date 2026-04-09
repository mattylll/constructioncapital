export interface ReportSection {
  heading: string;
  /** HTML paragraphs — rendered with dangerouslySetInnerHTML */
  content: string[];
}

export interface ReportFaq {
  question: string;
  answer: string;
}

export type ReportCategory = "county" | "regional" | "thematic" | "town";

export interface ChartDataPoint {
  name: string;
  value: number;
  /** Optional second value for comparison charts */
  value2?: number;
  fill?: string;
}

export interface ReportCharts {
  /** Price by property type — bar chart */
  priceByType?: ChartDataPoint[];
  /** Town price comparison — horizontal bar chart */
  townPrices?: ChartDataPoint[];
  /** YoY change by town — bar chart with pos/neg colors */
  townYoyChange?: ChartDataPoint[];
}

export interface MarketReport {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Short summary for hub page cards */
  excerpt: string;
  category: ReportCategory;
  /** Region name for filtering (e.g. "London & South East") */
  region?: string;
  /** County slug — links back to /locations/{county} */
  countySlug?: string;
  /** Town slug — for town-level reports, links back to /locations/{county}/{town} */
  townSlug?: string;
  datePublished: string;
  dateModified: string;
  readingTime: string;
  sections: ReportSection[];
  faqs: ReportFaq[];
  relatedReportSlugs: string[];
  /** Town slugs in county/town format for internal links */
  relatedTownSlugs: string[];
  relatedServiceSlugs: string[];
  charts?: ReportCharts;
}
