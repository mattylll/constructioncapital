import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the Profit Share & JV Calculator Works",
    paragraphs: [
      "Joint venture and profit share structures divide the financial returns of a development project between two or more parties — typically an experienced developer and a capital partner who provides equity or land. This calculator models how that split plays out in pounds and pence once the project completes and all costs are settled.",
      "Enter your GDV, total costs, and the agreed profit split ratio (for example 60:40 in the developer's favour), and the calculator shows each party's absolute profit share. Toggle between a straight split — where profit is divided at a fixed ratio from the first pound — and a waterfall structure, where the capital partner receives a preferred return first before the developer participates in upside.",
      "The waterfall model is more representative of institutional JV terms. The capital partner typically earns a preferred return of 8–12% per annum on their invested equity, returning principal plus that return first. Any profit above that threshold is then split between the parties according to the agreed promote ratio, which rewards the developer for outperformance.",
      "Use this calculator alongside the mezzanine finance calculator to compare structures. A JV with a 50:50 profit split is effectively 'free' in one sense — there are no rolled interest costs — but it is often more expensive in practice if the scheme performs well, because the investor participates fully in the upside. Mezzanine debt is capped at its contractual return regardless of how profitable the project becomes.",
    ],
  },
  guide: {
    title: "JV and Profit Share Structures in Property Development",
    sections: [
      {
        heading: "Common JV Models: Splits, Promotes, and Structures",
        paragraphs: [
          "Property JV structures range from simple agreements to sophisticated fund-style arrangements. The most common models for residential and mixed-use development fall into three categories: straight profit splits, preferred return with promote, and developer-funded models where the developer contributes the land and the investor contributes cash.",
          "A straight 50:50 split is frequently used between two developers of roughly equal standing, or between a developer and a high-net-worth investor who is comfortable with development risk. Both parties share all costs and profits proportionally from day one. It is simple to document, easy to audit, and avoids disputes about how the waterfall should operate — but it offers the developer no promote for managing the project.",
          "A 60:40 structure with no preferred return tips more of the upside to the developer, recognising that the developer is providing skill, time, and management capacity in addition to some capital. A 70:30 split is common where the developer is contributing a consented site with significant planning gain already embedded, giving them a larger natural starting position.",
        ],
        bullets: [
          "50:50 straight split: equal risk, equal reward, common between two active developers",
          "60:40 developer-favoured: common where developer provides site or management expertise",
          "70:30 developer-favoured: used where developer contributes consented land with existing value",
          "Preferred return structures: investor receives 8–12% pa before the promote kicks in",
          "Promote: developer receives a larger slice of profits above the preferred return hurdle",
        ],
      },
      {
        heading: "Legal Structures: SPVs, JV Agreements, and Key Terms",
        paragraphs: [
          "Most property JVs are housed in a special purpose vehicle (SPV) — typically a private limited company incorporated solely to hold the development site and deliver the project. The SPV structure isolates the liabilities of one project from the developers' other activities and from each other, and it provides a clean legal entity for lenders to take security over.",
          "The JV agreement is the constitutional document that governs the parties' relationship within the SPV. It should cover share ownership proportions, voting rights and reserved matters, how decisions are made when the parties disagree, funding obligations (how much each party must contribute and when), what happens if one party cannot meet a cash call, profit distribution mechanics, and exit provisions.",
          "Reserved matters — decisions that require unanimous consent rather than simple majority — are one of the most negotiated points in JV documentation. Investors will want reserved matter status for taking on additional debt, changing the development scheme, replacing the main contractor, and any transaction that distributes capital. Developers should resist overly broad reserved matter lists that would give the investor a veto over day-to-day project management decisions.",
          "Exit provisions matter as much as entry terms. What happens if the developer wants to sell but the investor does not? Tag-along rights allow a minority party to sell their shares alongside a majority seller on the same terms. Drag-along rights allow the majority to compel the minority to sell to a third party. Both should be addressed from the outset to avoid disputes when the project completes.",
        ],
      },
      {
        heading: "JV vs Mezzanine: Comparing the Cost",
        paragraphs: [
          "The choice between a JV equity partner and mezzanine debt is fundamentally a decision about how you share risk and reward. Mezzanine debt is straightforward to model: you know the rate, the term, the fees, and the total cost from day one. The lender gets their contracted return regardless of whether the project makes £200,000 or £2m in profit. Your upside is fully retained beyond the debt repayment.",
          "A JV equity partner has no fixed cost — they share in both the profit and the loss. On a poorly performing scheme, this is attractive: your investor absorbs their proportionate share of any shortfall. On a scheme that dramatically outperforms — say, because GDV rises 15% above appraisal — the investor takes a significant slice of value you created through your work and market timing.",
          "As a rough benchmark: mezzanine at 12% per annum for 18 months costs approximately 18–20% of the drawn balance in cash terms (interest plus fees). A 40% JV profit share on a scheme returning 25% on cost would cost the developer 40% of the £250,000 profit on a £1m cost scheme — that is, £100,000. On the same scheme, mezz on a £200,000 facility at 12% for 18 months costs around £40,000. The mezzanine is cheaper — but only because the scheme performed exactly as planned. If profit doubles due to an unexpected GDV uplift, the JV investor captures 40% of that uplift while the mezz lender receives nothing extra.",
        ],
        bullets: [
          "Mezzanine is cheaper when the scheme performs well — fixed cost, no upside sharing",
          "JV equity is better on underperforming schemes — investor absorbs proportionate losses",
          "JV investors often bring more than money: networks, planning experience, agent relationships",
          "Mezzanine is faster to execute — typically 4–6 weeks vs 8–12 weeks for a JV",
          "JV structures are harder to unwind if relationships deteriorate mid-project",
        ],
      },
      {
        heading: "What Institutional JV Partners Expect",
        paragraphs: [
          "Family offices, private equity funds, and institutional property investors are increasingly active as JV equity partners in UK residential development. They bring larger cheque sizes — typically £2m upwards — and a more formal approach to due diligence, governance, and reporting. Understanding what they require helps developers prepare more effectively.",
          "Track record is paramount. Institutional partners want to see a minimum of five completed schemes, audited accounts for the development company, evidence of strong contractor relationships, and references from senior lenders who have worked with the developer. First-time developers rarely access institutional equity without a guarantor or co-developer who provides the required credentials.",
          "Governance expectations include monthly management accounts, quarterly investor reports, pre-approved budgets with contingencies, a monitoring surveyor appointed at the investor's discretion, and board-level involvement in all material decisions. Developers accustomed to running lean operations will need to invest in finance and reporting infrastructure before approaching this type of partner.",
          "Return expectations vary by investor type. Yield-focused family offices often seek an 8–10% preferred return with a 25–35% promote to the developer above that threshold. Private equity funds targeting higher returns may set preferred return hurdles of 12–15% and take a smaller share of the promote. In all cases, understanding the investor's target IRR — and structuring the deal around it — is more effective than negotiating the headline split in isolation.",
        ],
      },
    ],
  },
};
