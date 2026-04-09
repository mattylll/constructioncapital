import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How Property ROI Is Calculated",
    paragraphs: [
      "Return on investment (ROI) measures the total financial gain from a property relative to the capital you have deployed into it. Unlike rental yield, which looks only at income as a proportion of property value, ROI captures the full picture — income received, capital growth achieved, and crucially the amplifying effect of leverage.",
      "The basic ROI formula divides your total net profit by your total invested capital and expresses the result as a percentage. Total net profit includes all rental income received (after costs) plus any increase in property value, less purchasing costs such as Stamp Duty Land Tax, legal fees, and survey costs, and any selling costs if you have disposed of the asset.",
      "Where property ROI becomes significantly more interesting than most other asset classes is in the leverage calculation. Because most property purchases are financed with a mortgage, your actual capital at risk is only your deposit and acquisition costs — not the full property value. A property that grows 10% in value produces a 10% return if purchased with cash, but can produce a 25% to 40% return on the capital actually deployed if purchased with a 70% or 75% LTV mortgage. This amplification effect is the primary reason sophisticated investors use debt strategically.",
      "This calculator models your ROI both on an all-cash basis and on a leveraged basis, so you can see clearly what your mortgage is doing to your returns. It also separates income return from capital return, helping you understand which component is driving your overall performance.",
    ],
  },
  guide: {
    title: "Property ROI: A Complete Guide to Measuring Leveraged Returns",
    sections: [
      {
        heading: "How Leverage Amplifies Your Returns",
        paragraphs: [
          "Leverage is the defining feature of property investment as an asset class. When you purchase a £300,000 property with a £75,000 deposit (25% LTV), your exposure to price movements is against the full £300,000 — but your capital at risk is only £75,000, plus acquisition costs of perhaps £12,000 to £15,000, giving a total outlay of around £87,000 to £90,000.",
          "If that property increases in value by 15% over three years to £345,000, the gross capital gain is £45,000. Against an all-cash investment of £300,000 that represents a 15% capital return. Against your actual deployed capital of £87,000 to £90,000, the same £45,000 gain represents a capital ROI of roughly 50%. Add the net rental income received over the same period and your total leveraged ROI could comfortably exceed 60% to 70% on the capital invested.",
          "This arithmetic works in both directions. If property values fall 10%, a cash buyer loses 10% of their investment. A buyer with a 75% LTV mortgage loses 40% of their equity — though provided rents continue to service the mortgage and the loan is not called in, the paper loss can be recovered over time. Understanding this asymmetry is fundamental to managing leverage responsibly.",
        ],
        bullets: [
          "Leverage magnifies both gains and losses proportionally to your LTV ratio",
          "At 75% LTV, a 10% rise in property value creates a 40% return on equity (before costs)",
          "At 80% LTV, the same 10% rise creates a 50% return on equity",
          "Leverage ROI is most powerful over shorter hold periods where income is supplemented by refinancing gains",
          "Negative leverage occurs when your mortgage cost exceeds your net yield — a common scenario in low-yield markets post-Section 24",
        ],
      },
      {
        heading: "Understanding Total Return: Income Plus Growth",
        paragraphs: [
          "A complete ROI analysis must account for both income return and capital return, as weighting too heavily on either component alone can lead to poor investment decisions. An investor who focuses only on yield may overlook assets in fundamentally improving locations where capital growth will substantially outperform. An investor who focuses only on growth projections may underestimate how much current cash flow matters for servicing debt and funding ongoing costs.",
          "Income return is the cumulative net rental income received over the hold period divided by your initial invested capital. If you receive £6,000 net per year for five years on a £90,000 deployed capital figure, your income return component is 33% over the period, or roughly 6% per year annualised.",
          "Capital return is the gain (or loss) in property value over the same period, net of buying and selling costs. In practice, buying costs — SDLT, legal fees, surveys — are front-loaded, which is one reason property investment rewards longer hold periods. A property purchased for £250,000 with £12,000 in buying costs and sold for £290,000 with £6,000 in selling costs shows a net capital gain of £22,000. Annualised over a three-year hold, that represents approximately 8.3% capital growth on the original value, but against deployed equity of £75,000 the return is considerably higher.",
        ],
      },
      {
        heading: "Risk-Adjusted Returns and Comparing Scenarios",
        paragraphs: [
          "Headline ROI figures must always be viewed in the context of the risk taken to achieve them. Two investments might show identical five-year ROI projections, but one may involve a fully tenanted, freehold terrace in a major city while the other involves a complex HMO in a declining market with high management overhead. Risk-adjusted return analysis asks how certain those projected figures are and what the downside looks like if assumptions prove overly optimistic.",
          "Key risks to model include: rental void periods exceeding your assumption, interest rate rises increasing your mortgage cost (particularly on tracker or short-term fixed products), unexpected capital expenditure such as roof or boiler replacement, regulatory changes affecting landlord costs, and planning or structural issues affecting resale value. Stress-testing your ROI model against a scenario where voids run at twice your baseline, rates increase by 1%, and the property achieves only 80% of your assumed sale price gives a realistic floor for expected performance.",
          "For portfolio investors comparing multiple deals, calculating the internal rate of return (IRR) — which accounts for the timing of cash flows — provides a more precise comparison than simple ROI, particularly where deals have different hold periods. IRR is more complex to calculate manually, which is why modelling tools become increasingly valuable as portfolio size grows.",
        ],
      },
      {
        heading: "Holding Period and Exit Timing",
        paragraphs: [
          "The holding period chosen for a property investment has a significant bearing on ROI, primarily because of the fixed costs incurred at acquisition. Stamp Duty Land Tax, legal fees, mortgage arrangement fees, and survey costs are paid once but drag on annualised returns for as long as you hold the asset. A 5% total acquisition cost represents a 5% hurdle your investment must clear before any real return is generated.",
          "Short hold periods (one to three years) are typically only viable in refurbishment or development strategies where forced appreciation — adding value through works — quickly covers the entry cost. Standard investment properties generally require a minimum five to seven year hold to allow capital growth to comfortably exceed acquisition costs and generate meaningful net ROI.",
          "Capital Gains Tax (CGT) is a further consideration for properties held in personal names. Gains above the annual exemption (£3,000 for the 2024/25 tax year following successive reductions) are taxed at 18% for basic rate taxpayers and 24% for higher and additional rate taxpayers on residential property, following changes announced in the Autumn 2024 Budget. Timing a disposal to fall in a tax year where other income is lower, or to coincide with losses elsewhere in your portfolio, can meaningfully improve net-of-tax ROI. Investors should seek specialist tax advice before disposing of investment properties.",
        ],
      },
    ],
  },
};
