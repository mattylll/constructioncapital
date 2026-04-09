export interface CalculatorContent {
  howItWorks: {
    title: string;
    paragraphs: string[];
  };
  guide: {
    title: string;
    sections: {
      heading: string;
      paragraphs: string[];
      bullets?: string[];
    }[];
  };
}
