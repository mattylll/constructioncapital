export interface CalculatorMeta {
  slug: string;
  name: string;
  shortDesc: string;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  faqs: { question: string; answer: string }[];
}

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "development-finance",
    name: "Development Finance Calculator",
    shortDesc:
      "Calculate senior debt, equity, interest costs and profit for your development project.",
    icon: "Building2",
    metaTitle:
      "Development Finance Calculator | Estimate Costs & Profit | Construction Capital",
    metaDescription:
      "Free development finance calculator. Enter land cost, build costs and GDV to estimate senior debt, equity required, interest and developer profit. Optional mezzanine toggle.",
    h1: "Development Finance Calculator",
    heroSubtitle:
      "Model your development appraisal in seconds. Enter your costs and GDV to see senior debt, equity, interest and profit — with an optional mezzanine layer.",
    faqs: [
      {
        question: "How much can I borrow with development finance?",
        answer:
          "Most lenders offer up to 65–70% of the Gross Development Value (LTGDV) as senior debt. With mezzanine finance layered on top, you can stretch total borrowing to 85–90% LTGDV, reducing the equity you need to contribute.",
      },
      {
        question: "What interest rate should I expect?",
        answer:
          "Senior development finance rates typically start from 6.5% per annum. Rates vary based on the project, location, developer experience and loan-to-GDV ratio. Mezzanine finance, which carries higher risk, typically starts from 12% per annum.",
      },
      {
        question: "How is development finance interest calculated?",
        answer:
          "Interest is usually charged on a rolled-up basis, meaning it accrues during the build period and is repaid along with the principal when units are sold. This calculator uses a simple annual interest estimate on the total facility for the full term.",
      },
      {
        question: "What costs does the calculator include?",
        answer:
          "The calculator covers land cost, build costs, professional fees and a contingency percentage. It does not include stamp duty, agent fees or legal costs on the sale of units — factor these into your own appraisal.",
      },
      {
        question: "Is this calculator accurate for my project?",
        answer:
          "This is an indicative tool for initial appraisals. Every lender structures deals differently, and actual terms depend on your track record, the site and market conditions. Contact us for a bespoke quote tailored to your project.",
      },
    ],
  },
  {
    slug: "bridging-loans",
    name: "Bridging Loan Calculator",
    shortDesc:
      "Estimate monthly interest, total cost and LTV for your bridging loan.",
    icon: "Clock",
    metaTitle:
      "Bridging Loan Calculator | Monthly Interest & Total Cost | Construction Capital",
    metaDescription:
      "Free bridging loan calculator. Enter property value, loan amount, term and rate to calculate monthly interest, total borrowing cost, LTV and arrangement fees.",
    h1: "Bridging Loan Calculator",
    heroSubtitle:
      "Work out the true cost of a bridging loan. Enter your property value and loan details to see monthly interest, fees and total borrowing cost.",
    faqs: [
      {
        question: "How is bridging loan interest calculated?",
        answer:
          "Bridging loan interest is typically quoted as a monthly rate (e.g. 0.55% per month). Interest can be retained (deducted upfront from the loan), rolled up (added to the loan and paid at redemption), or serviced (paid monthly). This calculator assumes rolled-up interest.",
      },
      {
        question: "What fees are charged on a bridging loan?",
        answer:
          "Most bridging lenders charge an arrangement fee of 1–2% of the loan amount. There may also be valuation fees, legal fees and an exit fee (though many lenders have dropped exit fees). This calculator includes a standard 2% arrangement fee.",
      },
      {
        question: "What LTV can I get on a bridging loan?",
        answer:
          "Most bridging lenders offer up to 75% LTV on the open market value. Some specialist lenders go to 80% or even 100% with additional security. Lower LTVs typically attract better rates.",
      },
      {
        question: "How long can I have a bridging loan for?",
        answer:
          "Bridging loans typically run from 1 to 18 months. Most lenders prefer a clear exit strategy — either a sale or refinance — within 12 months. Extensions are possible but may incur additional fees.",
      },
      {
        question: "Is this calculator accurate?",
        answer:
          "This provides indicative figures for planning purposes. Actual terms depend on the property, your circumstances, the lender and the exit strategy. Contact us for a precise quote from our panel of 100+ lenders.",
      },
    ],
  },
  {
    slug: "mezzanine-finance",
    name: "Mezzanine Finance Calculator",
    shortDesc:
      "Calculate mezzanine funding, blended cost and remaining equity for your project.",
    icon: "Layers",
    metaTitle:
      "Mezzanine Finance Calculator | Blended Cost & Equity | Construction Capital",
    metaDescription:
      "Free mezzanine finance calculator. Enter project cost, senior debt and GDV to calculate mezzanine amount, blended interest cost, equity required and developer profit.",
    h1: "Mezzanine Finance Calculator",
    heroSubtitle:
      "See how mezzanine finance reduces your equity requirement. Enter your deal numbers to calculate the mezzanine layer, blended cost and profit.",
    faqs: [
      {
        question: "What is mezzanine finance?",
        answer:
          "Mezzanine finance sits between senior debt and equity in the capital stack. It fills the gap between what a senior lender will provide (typically 60–70% LTGDV) and the total project cost, reducing the equity a developer needs to inject.",
      },
      {
        question: "How much does mezzanine finance cost?",
        answer:
          "Mezzanine rates typically start from 12% per annum, reflecting the higher risk position behind senior debt. Some lenders charge up to 18–20% depending on the deal. Interest is usually rolled up and repaid at project completion.",
      },
      {
        question: "How is blended cost calculated?",
        answer:
          "Blended cost is the weighted average interest rate across your senior debt and mezzanine facility. For example, if you borrow £700k at 7% senior and £200k at 15% mezzanine, the blended rate is ((700×7)+(200×15)) ÷ 900 = 8.78%.",
      },
      {
        question:
          "What is the difference between mezzanine finance and equity?",
        answer:
          "Mezzanine is debt — it charges interest and must be repaid, but the lender has no ownership stake. Equity investors take a share of the profit (typically 40–60%) in exchange for their capital. Mezzanine is cheaper when the project performs well.",
      },
      {
        question: "Can I use mezzanine and senior debt together?",
        answer:
          "Yes, that is the standard structure. Senior debt covers 60–70% LTGDV, mezzanine stretches to 85–90%, and the developer contributes the remaining equity. Both lenders need to agree to an inter-creditor arrangement.",
      },
    ],
  },
];

export function getCalculatorBySlug(slug: string): CalculatorMeta | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}
