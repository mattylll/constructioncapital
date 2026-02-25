import type { GuideSection } from "./types";

export function calculateReadingTime(sections: GuideSection[]): string {
  const totalWords = sections.reduce((sum, section) => {
    const headingWords = section.heading.split(/\s+/).length;
    const contentWords = section.content.reduce(
      (cSum, para) => cSum + para.split(/\s+/).length,
      0,
    );
    return sum + headingWords + contentWords;
  }, 0);
  const minutes = Math.max(1, Math.round(totalWords / 200));
  return `${minutes} min read`;
}
