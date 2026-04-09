export interface GlossaryTerm {
  slug: string;
  term: string;
  definition: string;
  relatedTerms: string[];
  relatedGuides: string[];
  relatedServices: string[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: "arrangement-fee",
    term: "Arrangement Fee",
    definition:
      "A fee charged by the lender for setting up a loan facility, typically expressed as a percentage of the gross loan amount. Arrangement fees on development finance usually range from 1% to 2% and may be deducted from the initial advance or added to the loan. Also referred to as a facility fee or commitment fee.",
    relatedTerms: ["exit-fee", "facility-agreement", "drawdown"],
    relatedGuides: ["hidden-fees", "application", "development-finance"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "article-4-direction",
    term: "Article 4 Direction",
    definition:
      "A direction made by a local planning authority that withdraws specific permitted development rights in a defined area. Article 4 directions are commonly used to prevent the conversion of HMOs back to single dwellings, or to restrict office-to-residential conversions under Class MA. Developers must check for Article 4 directions before relying on permitted development rights for their scheme.",
    relatedTerms: ["permitted-development-rights", "use-class", "planning-permission", "hmo"],
    relatedGuides: ["legal", "development-finance"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "bridging-loan",
    term: "Bridging Loan",
    definition:
      "A short-term secured loan used to bridge a gap between a purchase and a longer-term funding solution or sale. Bridging loans are typically available for 1 to 18 months with interest rates quoted monthly rather than annually. They are commonly used for auction purchases, chain breaks, and pre-planning site acquisitions where speed of completion is critical.",
    relatedTerms: ["day-one-advance", "rolled-up-interest", "exit-fee", "ltv"],
    relatedGuides: ["bridging", "comparison", "hidden-fees"],
    relatedServices: ["bridging-loans"],
  },
  {
    slug: "build-cost",
    term: "Build Cost",
    definition:
      "The total cost of construction works on a development project, typically including materials, labour, preliminaries, and contractor margins. Build costs are a key input to any development appraisal and are usually verified by a quantity surveyor. Lenders will assess build costs carefully as they determine the total facility size and drawdown schedule.",
    relatedTerms: ["contingency", "quantity-surveyor", "gross-development-value", "professional-fees"],
    relatedGuides: ["development-finance", "valuations", "application"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "building-regulations",
    term: "Building Regulations",
    definition:
      "The statutory standards that all building work in England and Wales must comply with, covering structural integrity, fire safety, energy efficiency, drainage, and accessibility. Building regulations approval is separate from planning permission and is required for most construction and conversion projects. Lenders require evidence of building regulations compliance before releasing the final drawdown and at practical completion.",
    relatedTerms: ["practical-completion", "planning-permission", "monitoring-surveyor"],
    relatedGuides: ["legal", "development-finance"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "capital-stack",
    term: "Capital Stack",
    definition:
      "The total structure of funding used to finance a development project, arranged by seniority from senior debt at the bottom through mezzanine finance to developer equity at the top. The capital stack determines the order in which each tranche of funding is repaid upon exit, with senior debt having first priority. Understanding the capital stack is essential for structuring the optimal mix of debt and equity on any deal.",
    relatedTerms: ["senior-debt", "mezzanine-finance", "equity", "intercreditor-deed"],
    relatedGuides: ["structuring", "mezzanine", "equity", "development-finance"],
    relatedServices: ["development-finance", "mezzanine-finance", "equity-jv"],
  },
  {
    slug: "certificate-of-lawfulness",
    term: "Certificate of Lawfulness",
    definition:
      "A certificate issued by the local planning authority confirming that an existing use or proposed development is lawful and does not require planning permission. A Certificate of Lawful Existing Use or Development (CLEUD) confirms that a current use has become immune from enforcement, while a Certificate of Lawful Proposed Use or Development (CLOPUD) confirms a proposed use is permitted. Developers often obtain these to satisfy lenders that a PDR scheme is beyond challenge.",
    relatedTerms: ["permitted-development-rights", "planning-permission", "prior-approval"],
    relatedGuides: ["legal", "development-finance"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "cgt",
    term: "CGT (Capital Gains Tax)",
    definition:
      "A tax on the profit made when you sell or dispose of an asset that has increased in value, including property. In the UK, CGT rates for residential property are higher than for other assets, currently at 18% for basic rate taxpayers and 24% for higher rate taxpayers. CGT is a significant consideration for developers and investors when planning exit strategies and structuring ownership of development sites.",
    relatedTerms: ["sdlt", "gross-development-value", "net-development-value"],
    relatedGuides: ["structuring", "hidden-fees", "market"],
    relatedServices: ["development-finance", "commercial-mortgages"],
  },
  {
    slug: "cil",
    term: "CIL (Community Infrastructure Levy)",
    definition:
      "A charge levied by local authorities on new development to help fund infrastructure such as schools, roads, and healthcare facilities. CIL rates vary by area and use class, and are set out in each authority's charging schedule. CIL must be factored into development appraisals alongside S106 obligations, as it represents a direct cost that reduces project profitability.",
    relatedTerms: ["s106", "planning-permission", "gross-development-value"],
    relatedGuides: ["hidden-fees", "development-finance", "structuring"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "contingency",
    term: "Contingency",
    definition:
      "A budget allowance set aside for unforeseen costs during a development project, typically expressed as a percentage of build costs. Lenders usually require a contingency of 5% to 10% of total build costs to be included in the appraisal. Without adequate contingency, cost overruns can exhaust the facility and leave a developer unable to complete the project.",
    relatedTerms: ["build-cost", "quantity-surveyor", "professional-fees"],
    relatedGuides: ["development-finance", "application", "structuring"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "day-one-advance",
    term: "Day One Advance",
    definition:
      "The initial tranche of a development or bridging loan released on the first day of the facility, typically used to fund the site acquisition. Day one advance is usually expressed as a percentage of the purchase price or open market value, whichever is lower. On a development finance deal, the day one advance might cover 60-70% of the land cost, with subsequent drawdowns released against construction milestones.",
    relatedTerms: ["drawdown", "ltv", "retention", "facility-agreement"],
    relatedGuides: ["development-finance", "bridging", "application"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "development-exit-finance",
    term: "Development Exit Finance",
    definition:
      "A short-term loan that replaces a development finance facility once construction is substantially complete, providing time to sell units at optimal prices. Development exit finance carries lower rates than development loans because the construction risk has been removed. It allows developers to repay their senior lender and avoid pressure sales while marketing completed units.",
    relatedTerms: ["senior-debt", "practical-completion", "bridging-loan"],
    relatedGuides: ["development-finance", "comparison", "structuring"],
    relatedServices: ["development-exit-finance"],
  },
  {
    slug: "development-finance",
    term: "Development Finance",
    definition:
      "Specialist lending designed to fund ground-up construction or major refurbishment projects, structured with staged drawdowns released against verified build milestones. Development finance is typically provided as senior debt secured by a first legal charge over the site, with facilities sized as a percentage of GDV (loan to gross development value). Terms usually run for 12 to 24 months and interest is commonly rolled up into the facility.",
    relatedTerms: ["senior-debt", "drawdown", "ltgdv", "monitoring-surveyor", "gross-development-value"],
    relatedGuides: ["development-finance", "application", "structuring", "valuations"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "drawdown",
    term: "Drawdown",
    definition:
      "The staged release of loan funds during a development project, triggered by the completion of pre-agreed construction milestones. Each drawdown is typically verified by the lender's monitoring surveyor before funds are released. The drawdown mechanism ensures the lender's exposure increases proportionally with the value being created on site.",
    relatedTerms: ["monitoring-surveyor", "retention", "facility-agreement", "day-one-advance"],
    relatedGuides: ["development-finance", "application", "hidden-fees"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "dscr",
    term: "DSCR (Debt Service Coverage Ratio)",
    definition:
      "A financial metric that measures the ability of a property's net operating income to cover its annual debt service obligations, calculated as net operating income divided by total debt service. Lenders typically require a minimum DSCR of 1.20x to 1.50x for commercial mortgages and investment properties. A DSCR below 1.0x means the property does not generate enough income to service the debt.",
    relatedTerms: ["icr", "net-yield", "gross-yield", "commercial-mortgage"],
    relatedGuides: ["commercial", "valuations", "application"],
    relatedServices: ["commercial-mortgages"],
  },
  {
    slug: "equity",
    term: "Equity",
    definition:
      "The developer's own capital contribution to a project, sitting at the top of the capital stack and bearing the highest risk but also receiving the residual profit. Equity typically represents 10% to 35% of total project costs depending on the debt structure. It can come from the developer's own funds, private investors, family offices, or institutional equity partners.",
    relatedTerms: ["capital-stack", "joint-venture", "mezzanine-finance", "senior-debt"],
    relatedGuides: ["equity", "structuring", "development-finance"],
    relatedServices: ["equity-jv"],
  },
  {
    slug: "exit-fee",
    term: "Exit Fee",
    definition:
      "A fee charged by the lender when a loan is repaid, typically expressed as a percentage of the gross loan amount or sometimes as a percentage of the GDV. Exit fees are common on bridging loans and some development finance facilities, usually ranging from 0.5% to 1.5%. They should be factored into the total cost of borrowing when comparing loan products.",
    relatedTerms: ["arrangement-fee", "facility-agreement", "gross-development-value"],
    relatedGuides: ["hidden-fees", "bridging", "comparison"],
    relatedServices: ["bridging-loans", "development-finance"],
  },
  {
    slug: "facility-agreement",
    term: "Facility Agreement",
    definition:
      "The legal contract between a borrower and a lender that sets out all terms and conditions of the loan including the facility amount, interest rate, drawdown mechanics, repayment terms, covenants, and events of default. The facility agreement is the primary loan document and is typically prepared by the lender's solicitors at the borrower's cost. Developers should have their own legal advisors review the facility agreement thoroughly before signing.",
    relatedTerms: ["intercreditor-deed", "arrangement-fee", "drawdown"],
    relatedGuides: ["legal", "application", "hidden-fees"],
    relatedServices: ["development-finance", "bridging-loans", "mezzanine-finance"],
  },
  {
    slug: "gdv",
    term: "GDV (Gross Development Value)",
    definition:
      "The estimated total market value of a completed development project, calculated as the sum of all individual unit sale prices or the investment value of the completed scheme. GDV is the single most important figure in a development appraisal and directly determines how much a lender will advance. It is typically assessed by a RICS-registered valuer through a Red Book valuation.",
    relatedTerms: ["gross-development-value", "net-development-value", "ltgdv", "red-book-valuation"],
    relatedGuides: ["valuations", "development-finance", "structuring"],
    relatedServices: ["development-finance", "mezzanine-finance"],
  },
  {
    slug: "gross-development-value",
    term: "Gross Development Value",
    definition:
      "The total market value of a development upon completion, encompassing all units and any commercial elements. Gross development value is determined by analysing comparable sales evidence and market conditions in the local area. It forms the basis for calculating loan to GDV ratios and is the primary metric used by lenders to size development finance facilities.",
    relatedTerms: ["gdv", "net-development-value", "ltgdv", "red-book-valuation", "residual-land-value"],
    relatedGuides: ["valuations", "development-finance", "application"],
    relatedServices: ["development-finance", "mezzanine-finance"],
  },
  {
    slug: "gross-yield",
    term: "Gross Yield",
    definition:
      "The annual rental income from a property expressed as a percentage of its purchase price or market value, before deducting any expenses. Gross yield is calculated by dividing the annual rent by the property value and multiplying by 100. While useful as a quick comparison metric, it does not account for voids, management costs, maintenance, or other operating expenses.",
    relatedTerms: ["net-yield", "yield", "dscr"],
    relatedGuides: ["commercial", "market", "valuations"],
    relatedServices: ["commercial-mortgages"],
  },
  {
    slug: "hmo",
    term: "HMO (House in Multiple Occupation)",
    definition:
      "A property rented out to three or more tenants who form two or more separate households and share a kitchen, bathroom, or toilet. HMOs require a mandatory licence if occupied by five or more people forming two or more households, and many local authorities have introduced additional licensing schemes. HMO conversions can be highly profitable but require careful due diligence on licensing, planning, and Article 4 restrictions.",
    relatedTerms: ["article-4-direction", "use-class", "planning-permission"],
    relatedGuides: ["development-finance", "legal", "market"],
    relatedServices: ["refurbishment-finance", "bridging-loans"],
  },
  {
    slug: "icr",
    term: "ICR (Interest Cover Ratio)",
    definition:
      "A measure of how comfortably a property's rental income covers the interest payments on a loan, calculated as annual rental income divided by annual interest costs. Most lenders require a minimum ICR of 125% to 145% for buy-to-let and commercial mortgage lending. ICR requirements vary by lender and are sometimes stressed at higher notional interest rates to account for potential rate increases.",
    relatedTerms: ["dscr", "gross-yield", "net-yield"],
    relatedGuides: ["commercial", "application", "comparison"],
    relatedServices: ["commercial-mortgages"],
  },
  {
    slug: "intercreditor-deed",
    term: "Intercreditor Deed",
    definition:
      "A legal agreement between two or more lenders in the capital stack that defines their respective rights, priorities, and remedies in relation to the same borrower and security. The intercreditor deed governs how proceeds are distributed in a default scenario and sets out the conditions under which the mezzanine lender can exercise enforcement rights. It is a critical document in any deal involving both senior and mezzanine finance.",
    relatedTerms: ["capital-stack", "senior-debt", "mezzanine-finance", "facility-agreement"],
    relatedGuides: ["mezzanine", "legal", "structuring"],
    relatedServices: ["mezzanine-finance", "development-finance"],
  },
  {
    slug: "joint-venture",
    term: "Joint Venture",
    definition:
      "A partnership arrangement between a developer and a capital partner to deliver a property project, typically structured so the developer contributes expertise and management while the equity partner provides the capital. Joint ventures usually involve a profit-sharing arrangement with the equity partner receiving a preferred return plus a share of profits. JV structures allow developers to take on larger projects without tying up their own capital.",
    relatedTerms: ["equity", "capital-stack", "mezzanine-finance"],
    relatedGuides: ["equity", "structuring", "development-finance"],
    relatedServices: ["equity-jv"],
  },
  {
    slug: "land-registry",
    term: "Land Registry",
    definition:
      "HM Land Registry is the government body responsible for registering ownership of land and property in England and Wales. The Land Registry holds the definitive record of who owns what property, including details of mortgages, charges, and other encumbrances registered against a title. Lenders require a clear title registered at the Land Registry before advancing funds, and their legal charge is registered against the title to protect their security interest.",
    relatedTerms: ["title-insurance", "facility-agreement"],
    relatedGuides: ["legal", "application"],
    relatedServices: ["development-finance", "bridging-loans", "commercial-mortgages"],
  },
  {
    slug: "loan-to-cost",
    term: "Loan to Cost",
    definition:
      "A lending metric that expresses the total loan amount as a percentage of the total project costs including land, construction, professional fees, and finance costs. Loan to cost (LTC) is used alongside LTGDV to size development finance facilities, with typical senior debt LTC ratios of 80-90% of total costs. It provides a different perspective from LTGDV by focusing on the developer's input costs rather than the end value.",
    relatedTerms: ["ltgdv", "ltv", "build-cost", "capital-stack"],
    relatedGuides: ["development-finance", "structuring", "application"],
    relatedServices: ["development-finance", "mezzanine-finance"],
  },
  {
    slug: "ltgdv",
    term: "LTGDV (Loan to Gross Development Value)",
    definition:
      "A key lending metric in development finance that expresses the total loan amount as a percentage of the gross development value of the completed scheme. Senior lenders typically advance up to 60-65% LTGDV, while combined senior and mezzanine facilities can stretch to 70-75% LTGDV. LTGDV is the primary measure lenders use to ensure sufficient headroom between the debt and the expected end value.",
    relatedTerms: ["gdv", "gross-development-value", "ltv", "loan-to-cost", "senior-debt"],
    relatedGuides: ["development-finance", "structuring", "mezzanine", "application"],
    relatedServices: ["development-finance", "mezzanine-finance"],
  },
  {
    slug: "ltv",
    term: "LTV (Loan to Value)",
    definition:
      "A lending ratio that expresses the loan amount as a percentage of the current market value of the property being used as security. LTV is the standard metric for bridging loans and commercial mortgages, with typical maximums of 70-75%. A lower LTV means less risk for the lender and usually results in better interest rates for the borrower.",
    relatedTerms: ["ltgdv", "loan-to-cost", "valuation", "red-book-valuation"],
    relatedGuides: ["bridging", "commercial", "comparison", "application"],
    relatedServices: ["bridging-loans", "commercial-mortgages", "refurbishment-finance"],
  },
  {
    slug: "mezzanine-finance",
    term: "Mezzanine Finance",
    definition:
      "A layer of debt that sits between the senior loan and developer equity in the capital stack, secured by a second legal charge on the property. Mezzanine finance stretches the total borrowing on a project from the typical 60-65% LTGDV offered by senior lenders up to 80-90% of costs, significantly reducing the equity required from the developer. It carries higher interest rates than senior debt, typically 12-18% per annum, reflecting its subordinated position and higher risk.",
    relatedTerms: ["senior-debt", "capital-stack", "equity", "intercreditor-deed", "ltgdv"],
    relatedGuides: ["mezzanine", "structuring", "development-finance", "comparison"],
    relatedServices: ["mezzanine-finance"],
  },
  {
    slug: "monitoring-surveyor",
    term: "Monitoring Surveyor",
    definition:
      "An independent surveyor appointed by the lender to inspect the development site at regular intervals and verify that construction work has been completed to the required standard before each drawdown is released. The monitoring surveyor's fees are paid by the borrower and typically range from a few hundred to several thousand pounds per visit depending on the scale of the project. Their reports give the lender confidence that the build is progressing on schedule and to specification.",
    relatedTerms: ["drawdown", "quantity-surveyor", "valuation", "practical-completion"],
    relatedGuides: ["development-finance", "hidden-fees", "application"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "net-development-value",
    term: "Net Development Value",
    definition:
      "The gross development value of a completed scheme minus all costs of sale including estate agent fees, legal fees, and marketing expenses. Net development value gives a more accurate picture of the actual proceeds a developer will receive from disposals. Some lenders and appraisals use NDV rather than GDV to provide a more conservative assessment of project viability.",
    relatedTerms: ["gross-development-value", "gdv", "residual-land-value"],
    relatedGuides: ["valuations", "development-finance", "structuring"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "net-yield",
    term: "Net Yield",
    definition:
      "The annual rental income from a property expressed as a percentage of its purchase price or market value, after deducting all operating expenses such as management fees, maintenance, insurance, and void periods. Net yield provides a more realistic measure of investment return than gross yield. It is the metric most lenders and professional investors use when assessing the income performance of a commercial or residential investment property.",
    relatedTerms: ["gross-yield", "yield", "dscr", "icr"],
    relatedGuides: ["commercial", "market", "valuations"],
    relatedServices: ["commercial-mortgages"],
  },
  {
    slug: "pdr",
    term: "PDR (Permitted Development Rights)",
    definition:
      "Rights granted under the Town and Country Planning (General Permitted Development) Order that allow certain types of development to proceed without a full planning application. Key classes include Class MA (commercial to residential conversion), Class Q (agricultural to residential), and Class AA (adding storeys to purpose-built flats). PDR schemes still require prior approval from the local authority and developers must check for Article 4 directions that may remove these rights.",
    relatedTerms: ["permitted-development-rights", "prior-approval", "article-4-direction", "planning-permission"],
    relatedGuides: ["legal", "development-finance"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "permitted-development-rights",
    term: "Permitted Development Rights",
    definition:
      "Automatic planning permissions granted by Parliament through the General Permitted Development Order, allowing certain building works and changes of use without needing to apply for planning permission from the local authority. Permitted development rights cover a wide range of activities from household extensions to commercial-to-residential conversions. These rights can be removed by Article 4 directions or planning conditions on the original consent.",
    relatedTerms: ["pdr", "prior-approval", "article-4-direction", "planning-permission", "use-class"],
    relatedGuides: ["legal", "development-finance"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "planning-permission",
    term: "Planning Permission",
    definition:
      "Formal consent from the local planning authority required before carrying out most types of development, including new construction, material changes of use, and significant alterations to existing buildings. Planning permission is a key de-risking milestone for lenders, and most development finance facilities require at least outline or full planning consent to be in place before funds are advanced. The planning process involves consultation, assessment against local plan policies, and can take 8 to 13 weeks for straightforward applications.",
    relatedTerms: ["prior-approval", "permitted-development-rights", "s106", "cil"],
    relatedGuides: ["legal", "development-finance", "application"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "practical-completion",
    term: "Practical Completion",
    definition:
      "The stage at which a building project is deemed complete and fit for its intended purpose, even though minor snagging items may remain. Practical completion is typically certified by the contract administrator or architect and triggers important contractual consequences including the release of retention, the start of the defects liability period, and the handover of the building to the client. For lenders, practical completion is a key trigger for releasing the final drawdown or transitioning to a development exit facility.",
    relatedTerms: ["building-regulations", "monitoring-surveyor", "retention", "development-exit-finance"],
    relatedGuides: ["development-finance", "legal"],
    relatedServices: ["development-finance", "development-exit-finance"],
  },
  {
    slug: "prior-approval",
    term: "Prior Approval",
    definition:
      "A lighter-touch planning process required for certain types of permitted development, where the local authority assesses specific matters such as transport, flooding, contamination, and noise impact. Prior approval is not a full planning application and the local authority can only consider the prescribed matters, not broader planning policy. It is commonly required for Class MA office-to-residential and Class Q agricultural-to-residential conversions.",
    relatedTerms: ["permitted-development-rights", "pdr", "planning-permission", "certificate-of-lawfulness"],
    relatedGuides: ["legal", "development-finance"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "professional-fees",
    term: "Professional Fees",
    definition:
      "The costs associated with appointing professional advisors on a development project, including architects, structural engineers, quantity surveyors, planning consultants, solicitors, and project managers. Professional fees typically amount to 10% to 15% of build costs and are a legitimate project cost that lenders will factor into their appraisal. They are usually front-loaded, meaning a significant proportion is incurred before construction begins.",
    relatedTerms: ["build-cost", "contingency", "quantity-surveyor"],
    relatedGuides: ["development-finance", "hidden-fees", "application"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "quantity-surveyor",
    term: "Quantity Surveyor",
    definition:
      "A construction cost professional who prepares detailed cost plans, manages budgets, and provides independent cost verification on development projects. Quantity surveyors (QS) are often required by lenders to validate the borrower's build cost estimates before a facility is approved. During construction, the QS may work alongside the monitoring surveyor to certify the value of works completed for each drawdown.",
    relatedTerms: ["build-cost", "monitoring-surveyor", "professional-fees", "contingency"],
    relatedGuides: ["development-finance", "valuations", "application"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "red-book-valuation",
    term: "Red Book Valuation",
    definition:
      "A formal property valuation prepared in accordance with the RICS Valuation Global Standards, known as the Red Book. Red Book valuations are required by lenders for all secured property lending and provide an independent, regulated assessment of market value and, for development sites, the gross development value. They must be prepared by a RICS-registered valuer who holds appropriate qualifications and professional indemnity insurance.",
    relatedTerms: ["valuation", "rics", "gross-development-value", "ltv"],
    relatedGuides: ["valuations", "application", "development-finance"],
    relatedServices: ["development-finance", "bridging-loans", "commercial-mortgages"],
  },
  {
    slug: "residual-land-value",
    term: "Residual Land Value",
    definition:
      "The value of a development site calculated by taking the gross development value of the completed scheme and deducting all development costs including build costs, professional fees, finance costs, and developer profit. Residual land value represents the maximum a developer should pay for a site for the project to remain viable. It is the standard method used by valuers and developers to appraise development opportunities.",
    relatedTerms: ["gross-development-value", "build-cost", "professional-fees"],
    relatedGuides: ["valuations", "development-finance", "structuring"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "retention",
    term: "Retention",
    definition:
      "A percentage of each construction drawdown held back by the lender as a safeguard against cost overruns or incomplete works, typically 5% to 10% of each drawdown amount. The retention is released once the monitoring surveyor confirms practical completion and is satisfied that the works have been completed to the required standard. Retention should not be confused with the separate contractor retention held under a building contract.",
    relatedTerms: ["drawdown", "monitoring-surveyor", "practical-completion", "day-one-advance"],
    relatedGuides: ["development-finance", "hidden-fees", "application"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "rics",
    term: "RICS (Royal Institution of Chartered Surveyors)",
    definition:
      "The leading professional body for surveyors and property professionals worldwide, setting standards for valuation, surveying, construction, and property management. RICS-registered valuers are required by lenders to prepare Red Book valuations for secured lending. RICS members must adhere to strict ethical and competency standards, and their valuations carry the weight of professional regulation and indemnity insurance.",
    relatedTerms: ["red-book-valuation", "valuation", "monitoring-surveyor", "quantity-surveyor"],
    relatedGuides: ["valuations", "legal"],
    relatedServices: ["development-finance", "bridging-loans", "commercial-mortgages"],
  },
  {
    slug: "rolled-up-interest",
    term: "Rolled Up Interest",
    definition:
      "An interest arrangement where monthly interest charges are added to the outstanding loan balance rather than being paid by the borrower each month. Rolled up interest is standard on development finance and common on bridging loans, meaning the total interest cost is repaid along with the principal when the loan is redeemed. This preserves the developer's cash flow during construction but increases the total loan balance over time.",
    relatedTerms: ["serviced-interest", "arrangement-fee", "facility-agreement"],
    relatedGuides: ["development-finance", "bridging", "hidden-fees", "comparison"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "s106",
    term: "S106 (Section 106 Agreement)",
    definition:
      "A legally binding obligation negotiated between a developer and the local planning authority as part of a planning permission, requiring the developer to provide or fund specific community benefits such as affordable housing, public open space, or highway improvements. S106 agreements can represent a substantial additional cost on a development and must be carefully assessed during the appraisal stage. They are registered as a charge against the land title and bind future owners.",
    relatedTerms: ["cil", "planning-permission", "gross-development-value"],
    relatedGuides: ["hidden-fees", "development-finance", "legal", "structuring"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "sdlt",
    term: "SDLT (Stamp Duty Land Tax)",
    definition:
      "A tax payable on the purchase of land and property in England and Northern Ireland, calculated on a tiered basis with rates increasing for higher-value transactions. Additional SDLT surcharges apply to purchases of additional residential properties and to non-UK resident buyers. SDLT is a significant upfront cost on site acquisitions and must be factored into the development appraisal and funded either from the facility or the developer's equity.",
    relatedTerms: ["cgt", "residual-land-value", "day-one-advance"],
    relatedGuides: ["hidden-fees", "structuring", "development-finance"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "senior-debt",
    term: "Senior Debt",
    definition:
      "The primary layer of debt in a development finance structure, secured by a first legal charge on the property and sitting at the bottom of the capital stack with first priority on repayment. Senior debt is the lowest-risk tranche of debt and therefore carries the lowest interest rate, typically 6-9% per annum on development finance deals. Senior lenders will usually advance up to 60-65% of GDV, with any additional borrowing requiring mezzanine finance or equity.",
    relatedTerms: ["capital-stack", "mezzanine-finance", "equity", "ltgdv", "facility-agreement"],
    relatedGuides: ["development-finance", "structuring", "mezzanine", "comparison"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "serviced-interest",
    term: "Serviced Interest",
    definition:
      "An interest arrangement where the borrower makes regular monthly interest payments throughout the loan term, keeping the outstanding loan balance static. Serviced interest is more common on commercial mortgages and longer-term investment loans than on development finance. Some bridging lenders offer a choice between serviced and rolled up interest, with serviced interest usually attracting a lower headline rate.",
    relatedTerms: ["rolled-up-interest", "dscr", "icr"],
    relatedGuides: ["commercial", "bridging", "comparison"],
    relatedServices: ["commercial-mortgages", "bridging-loans"],
  },
  {
    slug: "title-insurance",
    term: "Title Insurance",
    definition:
      "An insurance policy that protects the insured against financial loss arising from defects in the legal title to a property that were not discovered during the conveyancing process. Title insurance can cover issues such as unknown restrictive covenants, boundary disputes, lack of building regulations approval for previous works, and missing planning permissions. Lenders sometimes accept title insurance as an alternative to resolving title defects that might otherwise delay or prevent a loan from completing.",
    relatedTerms: ["land-registry", "facility-agreement"],
    relatedGuides: ["legal", "application"],
    relatedServices: ["development-finance", "bridging-loans", "commercial-mortgages"],
  },
  {
    slug: "use-class",
    term: "Use Class",
    definition:
      "The classification system under the Town and Country Planning (Use Classes) Order that groups similar land and property uses together. Key classes include Class C3 (dwelling houses), Class C4 (HMOs), Class E (commercial, business, and service), and Class F (local community and learning). Changes of use within the same class do not require planning permission, while changes between classes may benefit from permitted development rights or require a full planning application.",
    relatedTerms: ["planning-permission", "permitted-development-rights", "hmo", "article-4-direction"],
    relatedGuides: ["legal", "development-finance"],
    relatedServices: ["development-finance", "refurbishment-finance", "commercial-mortgages"],
  },
  {
    slug: "valuation",
    term: "Valuation",
    definition:
      "A professional assessment of a property's market value, carried out by a qualified surveyor for lending, investment, or transactional purposes. For secured lending, lenders require a formal Red Book valuation prepared by a RICS-registered valuer. Development finance valuations will typically include the current site value, the gross development value on completion, and may include a valuation at various stages of construction.",
    relatedTerms: ["red-book-valuation", "rics", "gross-development-value", "ltv"],
    relatedGuides: ["valuations", "application", "development-finance"],
    relatedServices: ["development-finance", "bridging-loans", "commercial-mortgages"],
  },
  {
    slug: "yield",
    term: "Yield",
    definition:
      "The annual return on a property investment expressed as a percentage, calculated by dividing the annual rental income by the property value. Yield is the fundamental metric for valuing income-producing property and is used by investors, valuers, and lenders to assess the attractiveness of an investment. Lower yields generally indicate lower-risk, higher-value locations, while higher yields suggest higher risk or less prime locations.",
    relatedTerms: ["gross-yield", "net-yield", "dscr", "icr"],
    relatedGuides: ["commercial", "market", "valuations"],
    relatedServices: ["commercial-mortgages"],
  },
  {
    slug: "commercial-mortgage",
    term: "Commercial Mortgage",
    definition:
      "A long-term loan secured against commercial, semi-commercial, or mixed-use property, used to fund acquisition, refinancing, or capital raising. Commercial mortgages typically run for 3 to 25 years with interest either fixed or variable, and are assessed primarily on the rental income and DSCR of the property. They are fundamentally different from development finance in that they fund stabilised, income-producing assets rather than construction projects.",
    relatedTerms: ["dscr", "icr", "ltv", "yield", "serviced-interest"],
    relatedGuides: ["commercial", "comparison", "application"],
    relatedServices: ["commercial-mortgages"],
  },
  {
    slug: "first-charge",
    term: "First Charge",
    definition:
      "A legal charge registered against a property title that gives the holder (typically the senior lender) first priority over all other creditors in the event of a sale or enforcement. A first charge means the senior lender is repaid in full before any subordinate charges, such as mezzanine lenders, receive anything. All development finance and most bridging loans are secured by a first charge over the subject property.",
    relatedTerms: ["senior-debt", "intercreditor-deed", "land-registry", "capital-stack"],
    relatedGuides: ["legal", "structuring", "development-finance"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "second-charge",
    term: "Second Charge",
    definition:
      "A legal charge registered against a property title that sits behind a first charge, giving the holder (typically a mezzanine lender) a subordinated claim on the security. In the event of enforcement, the second charge holder is only repaid after the first charge holder has been satisfied in full. Mezzanine finance is almost always secured by a second charge, which is why it carries a higher interest rate than senior debt.",
    relatedTerms: ["first-charge", "mezzanine-finance", "intercreditor-deed", "capital-stack"],
    relatedGuides: ["mezzanine", "structuring", "legal"],
    relatedServices: ["mezzanine-finance"],
  },
  {
    slug: "personal-guarantee",
    term: "Personal Guarantee (PG)",
    definition:
      "A legally binding commitment from an individual, usually the developer or company director, to personally repay some or all of a loan if the borrowing entity defaults. Personal guarantees are standard requirements for development finance and bridging loans, particularly where the borrower is a special purpose vehicle with limited assets. Guarantees may be limited to a fixed amount or be unlimited, and they significantly increase the personal risk exposure of the guarantor.",
    relatedTerms: ["facility-agreement", "senior-debt"],
    relatedGuides: ["legal", "application", "hidden-fees"],
    relatedServices: ["development-finance", "bridging-loans", "mezzanine-finance"],
  },
  {
    slug: "special-purpose-vehicle",
    term: "Special Purpose Vehicle (SPV)",
    definition:
      "A limited company set up specifically to hold a single property development project, ring-fencing it from the developer's other business activities and assets. Most lenders require development finance to be drawn down by an SPV to ensure the loan security is not contaminated by other liabilities. SPVs also provide tax planning flexibility and simplify the eventual disposal of the project.",
    relatedTerms: ["personal-guarantee", "facility-agreement", "equity"],
    relatedGuides: ["structuring", "legal", "application"],
    relatedServices: ["development-finance", "mezzanine-finance"],
  },
  {
    slug: "defects-liability-period",
    term: "Defects Liability Period",
    definition:
      "A contractual period, typically 6 to 12 months after practical completion, during which the building contractor is obliged to return to site and rectify any defects that emerge at no additional cost to the client. The defects liability period provides the developer and their purchasers with a warranty against construction defects. Lenders may require evidence that a defects liability period is included in the building contract as part of their due diligence.",
    relatedTerms: ["practical-completion", "building-regulations", "retention"],
    relatedGuides: ["development-finance", "legal"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "debt-to-equity-ratio",
    term: "Debt to Equity Ratio",
    definition:
      "The ratio of total borrowed funds to the developer's own equity contribution in a project, expressed either as a ratio or percentage. A project with 75% debt and 25% equity has a debt to equity ratio of 3:1. Higher leverage increases the potential return on equity but also increases risk, and lenders will assess this ratio to ensure the developer has sufficient skin in the game.",
    relatedTerms: ["capital-stack", "equity", "ltgdv", "loan-to-cost"],
    relatedGuides: ["structuring", "development-finance", "mezzanine"],
    relatedServices: ["development-finance", "mezzanine-finance", "equity-jv"],
  },
  {
    slug: "non-recourse-loan",
    term: "Non-Recourse Loan",
    definition:
      "A loan where the lender's sole remedy in the event of default is to enforce against the secured property, with no additional claim against the borrower's other assets or personal wealth. True non-recourse lending is rare in UK development finance; most facilities include personal guarantees or at minimum bad-boy carve-outs that provide recourse in cases of fraud or wilful misconduct. Some institutional and family office lenders offer non-recourse terms on lower-risk deals.",
    relatedTerms: ["personal-guarantee", "facility-agreement", "senior-debt"],
    relatedGuides: ["legal", "structuring", "comparison"],
    relatedServices: ["development-finance", "equity-jv"],
  },
  {
    slug: "site-acquisition",
    term: "Site Acquisition",
    definition:
      "The process of purchasing a development site, including negotiation, due diligence, exchange of contracts, and completion. Site acquisition costs include the purchase price, SDLT, legal fees, and any option or conditional contract premiums. Lenders will fund a proportion of the site acquisition cost through the day one advance, with the developer typically required to contribute the balance from equity.",
    relatedTerms: ["day-one-advance", "sdlt", "residual-land-value", "bridging-loan"],
    relatedGuides: ["development-finance", "application", "bridging"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "profit-on-cost",
    term: "Profit on Cost",
    definition:
      "A measure of development profitability calculated by dividing the projected profit by the total development costs and expressing it as a percentage. Lenders typically require a minimum profit on cost of 20% to 25% for residential development schemes to ensure adequate margin for error. It is a key viability metric that lenders assess alongside LTGDV when deciding whether to approve a facility.",
    relatedTerms: ["gross-development-value", "build-cost", "residual-land-value"],
    relatedGuides: ["development-finance", "valuations", "structuring"],
    relatedServices: ["development-finance"],
  },
];

export function getTermBySlug(slug: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.slug === slug);
}

export function getTermsByLetter(): Map<string, GlossaryTerm[]> {
  const sorted = [...GLOSSARY_TERMS].sort((a, b) =>
    a.term.localeCompare(b.term, "en-GB")
  );

  const map = new Map<string, GlossaryTerm[]>();

  for (const term of sorted) {
    const letter = term.term[0].toUpperCase();
    const existing = map.get(letter);
    if (existing) {
      existing.push(term);
    } else {
      map.set(letter, [term]);
    }
  }

  return map;
}
