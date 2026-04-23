export interface GuideSection {
  heading: string;
  content: string[];
}

export interface GuideFAQ {
  question: string;
  answer: string;
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
  | "market"
  | "comparison";

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
  /** Optional FAQ section for the guide */
  faqs?: GuideFAQ[];
  /** Optional explainer-video URL (self-hosted MP4 or YouTube). Wired into the page above the body and emitted as VideoObject JSON-LD. */
  videoUrl?: string;
  /** Video duration in seconds — used to emit ISO-8601 duration in VideoObject schema. */
  videoDurationSeconds?: number;
  /** Optional thumbnail URL for the video; falls back to the guide hero image. */
  videoThumbnailUrl?: string;
}
