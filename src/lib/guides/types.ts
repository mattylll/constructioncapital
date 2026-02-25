export interface GuideSection {
  heading: string;
  content: string[];
}

export type GuideCategory =
  | "development-finance"
  | "bridging"
  | "mezzanine"
  | "equity"
  | "refurbishment"
  | "commercial"
  | "general"
  | "hidden-fees"
  | "defaults"
  | "valuations"
  | "legal"
  | "application"
  | "structuring"
  | "market";

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: GuideCategory;
  readingTime: string;
  datePublished: string;
  dateModified: string;
  sections: GuideSection[];
  relatedSlugs: string[];
  /** Service slugs this guide links to */
  relatedServices: string[];
  /** County slugs for internal linking */
  relatedLocations: string[];
}
