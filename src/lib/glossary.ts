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
  {
    slug: "absorption-rate",
    term: "Absorption Rate",
    definition:
      "The rate at which available homes or units are sold or let in a given market over a specific period, usually expressed as units per month. Lenders and valuers use absorption rate to stress-test a developer's sales programme and assess whether projected sell-through timelines are realistic. A typical new-build scheme in a strong South East market might show an absorption rate of 2–4 units per month, whereas weaker regional markets may sustain only 1–2.",
    relatedTerms: ["gross-development-value", "development-appraisal", "comparable-evidence", "development-exit-finance"],
    relatedGuides: ["valuations", "development-finance", "market"],
    relatedServices: ["development-finance", "development-exit-finance"],
  },
  {
    slug: "aml-kyc",
    term: "AML/KYC (Anti-Money Laundering / Know Your Customer)",
    definition:
      "The regulatory due diligence process that lenders, brokers, and solicitors must complete to verify the identity of borrowers and the legitimate source of their funds. Under the Money Laundering Regulations 2017 (as amended), all parties in a property transaction must carry out customer due diligence before establishing a business relationship. AML/KYC checks typically include passport verification, proof of address, source of wealth documentation, and enhanced due diligence for politically exposed persons.",
    relatedTerms: ["facility-agreement", "personal-guarantee", "special-purpose-vehicle"],
    relatedGuides: ["application", "legal", "development-finance"],
    relatedServices: ["development-finance", "bridging-loans", "mezzanine-finance"],
  },
  {
    slug: "barn-conversion",
    term: "Barn Conversion",
    definition:
      "The conversion of a redundant agricultural building into residential or commercial use, often undertaken using Class Q permitted development rights or full planning permission. Barn conversions can attract premium values in rural locations but present unique challenges including structural surveys, bat and ecology reports, and heritage considerations. Lenders typically classify barn conversions as light refurbishment or development depending on the extent of works, with facilities sized accordingly.",
    relatedTerms: ["permitted-development-rights", "change-of-use", "planning-permission", "prior-approval"],
    relatedGuides: ["development-finance", "legal", "comparison"],
    relatedServices: ["development-finance", "bridging-loans", "refurbishment-finance"],
  },
  {
    slug: "blended-rate",
    term: "Blended Rate",
    definition:
      "The weighted average interest rate across multiple tranches of debt in a capital stack, reflecting the combined cost of senior and mezzanine or junior debt. For example, a scheme funded with 65% LTGDV senior debt at 7% and stretch mezzanine to 85% LTGDV at 15% might produce a blended rate of around 9.5%. Understanding the blended rate allows developers to compare the true all-in cost of different capital structures.",
    relatedTerms: ["capital-stack", "senior-debt", "mezzanine-finance", "coupon"],
    relatedGuides: ["structuring", "mezzanine", "comparison"],
    relatedServices: ["development-finance", "mezzanine-finance"],
  },
  {
    slug: "borrower-covenant",
    term: "Borrower Covenant",
    definition:
      "The financial strength, track record, and creditworthiness of the borrower as assessed by the lender during underwriting. A strong borrower covenant — evidenced by a proven development track record, healthy personal net worth, and clean credit history — can improve terms, secure higher leverage, and widen the pool of available lenders. Weaker covenants may require additional security such as personal guarantees or cross-charges over other assets.",
    relatedTerms: ["personal-guarantee", "facility-agreement", "non-recourse-loan", "special-purpose-vehicle"],
    relatedGuides: ["application", "structuring", "development-finance"],
    relatedServices: ["development-finance", "bridging-loans", "mezzanine-finance"],
  },
  {
    slug: "brownfield",
    term: "Brownfield",
    definition:
      "Previously developed land that is or was occupied by a permanent structure, as defined in Annex 2 of the National Planning Policy Framework (NPPF). Brownfield sites are prioritised for development under national planning policy, and local authorities are required to maintain brownfield land registers. Lenders generally favour brownfield sites over greenfield due to the more favourable planning outlook, though contamination and remediation costs must be factored into the development appraisal.",
    relatedTerms: ["greenfield", "planning-permission", "development-appraisal", "residual-land-value"],
    relatedGuides: ["development-finance", "legal", "market"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "build-to-rent",
    term: "Build to Rent (BTR)",
    definition:
      "Purpose-built residential accommodation designed specifically for the private rental market rather than individual sale, typically held as a single investment by an institutional owner. BTR schemes often benefit from accelerated planning support under NPPF guidance and may qualify for reduced affordable housing contributions where a minimum 20% discount market rent is provided. Funding for BTR developments increasingly comes through forward-funding arrangements with institutional investors alongside traditional development finance.",
    relatedTerms: ["forward-funding", "erv", "gross-yield", "net-yield", "cap-rate"],
    relatedGuides: ["development-finance", "market", "structuring"],
    relatedServices: ["development-finance", "mezzanine-finance"],
  },
  {
    slug: "cap-rate",
    term: "Cap Rate (Capitalisation Rate)",
    definition:
      "The ratio of a property's net operating income to its current market value, expressed as a percentage and used to value income-producing assets. A lower cap rate indicates a higher value relative to income and typically reflects a lower-risk, prime location. In the UK commercial property market, prime office cap rates might sit at 4–5%, while secondary regional assets could trade at 7–9%.",
    relatedTerms: ["net-yield", "gross-yield", "erv", "valuation"],
    relatedGuides: ["valuations", "commercial", "market"],
    relatedServices: ["commercial-mortgages", "development-finance"],
  },
  {
    slug: "change-of-use",
    term: "Change of Use",
    definition:
      "The process of converting a property from one use class to another, which may require planning permission or may be achievable under permitted development rights. Since the use class reforms of September 2020, many changes within the new Class E (commercial, business, and service) are permitted without an application, while changes to residential (Class C3) from Class E require prior approval under Class MA. Lenders will assess planning risk carefully on change-of-use schemes, particularly where Article 4 directions are in force.",
    relatedTerms: ["use-class", "permitted-development-rights", "prior-approval", "article-4-direction"],
    relatedGuides: ["legal", "development-finance", "bridging"],
    relatedServices: ["bridging-loans", "development-finance", "refurbishment-finance"],
  },
  {
    slug: "co-living",
    term: "Co-Living",
    definition:
      "A form of purpose-built shared accommodation where residents have private bedrooms or studios with access to generous communal facilities such as kitchens, lounges, co-working spaces, and gyms. Co-living developments fall under sui generis use and require full planning permission in most local authorities. Lenders are increasingly willing to fund co-living schemes, though they typically require stronger sponsor covenants and may cap leverage at 55–60% LTGDV given the relatively nascent exit market.",
    relatedTerms: ["hmo", "build-to-rent", "use-class", "planning-permission"],
    relatedGuides: ["development-finance", "market", "structuring"],
    relatedServices: ["development-finance", "mezzanine-finance"],
  },
  {
    slug: "commitment-fee",
    term: "Commitment Fee",
    definition:
      "A fee charged by the lender on the undrawn portion of a committed loan facility, compensating the lender for reserving capital that the borrower has not yet utilised. Commitment fees on development finance facilities are typically 1–2% per annum of the undrawn balance. This charge incentivises borrowers to draw down funds in line with their build programme and should be factored into the overall cost of borrowing alongside arrangement and exit fees.",
    relatedTerms: ["arrangement-fee", "non-utilisation-fee", "drawdown", "facility-agreement"],
    relatedGuides: ["hidden-fees", "development-finance", "structuring"],
    relatedServices: ["development-finance", "mezzanine-finance"],
  },
  {
    slug: "comparable-evidence",
    term: "Comparable Evidence",
    definition:
      "Recent transaction data for similar properties used by RICS valuers to support their opinion of market value or gross development value. Comparables should ideally be within the same postcode district, of similar size and specification, and completed within the last six months. The quality and quantity of comparable evidence directly affects a lender's confidence in the GDV and therefore the maximum facility they will offer.",
    relatedTerms: ["red-book-valuation", "gross-development-value", "valuation", "absorption-rate"],
    relatedGuides: ["valuations", "development-finance", "application"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "conservation-area",
    term: "Conservation Area",
    definition:
      "An area of special architectural or historic interest designated by the local planning authority under the Planning (Listed Buildings and Conservation Areas) Act 1990, where additional planning controls apply. Permitted development rights are significantly restricted in conservation areas, and demolition or substantial alteration typically requires conservation area consent. Development finance for schemes in conservation areas may carry a planning risk premium, and lenders will want to see evidence of pre-application engagement with the local authority.",
    relatedTerms: ["listed-building-consent", "planning-permission", "article-4-direction", "permitted-development-rights"],
    relatedGuides: ["legal", "development-finance", "application"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "cost-overrun",
    term: "Cost Overrun",
    definition:
      "The amount by which actual construction costs exceed the original budget approved in the development appraisal. Cost overruns are one of the most common causes of distress in development projects and can arise from unforeseen ground conditions, material price inflation, contractor insolvency, or scope creep. Lenders mitigate cost overrun risk through contingency requirements (typically 5–10%), independent QS verification, and monitoring surveyor inspections at each drawdown stage.",
    relatedTerms: ["contingency", "quantity-surveyor", "monitoring-surveyor", "build-cost"],
    relatedGuides: ["development-finance", "defaults", "structuring"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "coupon",
    term: "Coupon",
    definition:
      "The stated interest rate on a loan, expressed as an annual percentage and representing the periodic cost of borrowing before fees and other charges. In development finance, the coupon is distinct from the all-in cost of capital, which also includes arrangement fees, exit fees, and monitoring surveyor costs. Coupons on senior development debt in the UK typically range from 6.5% to 12% per annum depending on leverage, location, and borrower covenant.",
    relatedTerms: ["rolled-up-interest", "serviced-interest", "blended-rate", "arrangement-fee"],
    relatedGuides: ["development-finance", "comparison", "hidden-fees"],
    relatedServices: ["development-finance", "mezzanine-finance", "bridging-loans"],
  },
  {
    slug: "debenture",
    term: "Debenture",
    definition:
      "A security instrument that creates both a fixed charge over specific assets and a floating charge over a company's remaining assets, giving the lender comprehensive security over the borrower's business. In development finance, a debenture is commonly taken alongside a first legal charge over the development site, particularly when lending to a special purpose vehicle. If the borrower defaults, the debenture gives the lender the right to appoint an administrator or receiver over the company and its assets.",
    relatedTerms: ["fixed-charge", "floating-charge", "first-charge", "special-purpose-vehicle"],
    relatedGuides: ["legal", "defaults", "structuring"],
    relatedServices: ["development-finance", "mezzanine-finance"],
  },
  {
    slug: "default-interest",
    term: "Default Interest",
    definition:
      "An increased rate of interest charged by the lender when a borrower breaches the terms of their facility agreement, typically triggered by a missed repayment, expiry of the loan term, or breach of a financial covenant. Default interest rates are usually 3–5% per annum above the standard coupon and are intended to compensate the lender for the increased risk and administrative burden of managing a defaulted loan. Borrowers should be aware that default interest can accumulate rapidly and is enforceable provided it represents a genuine pre-estimate of loss.",
    relatedTerms: ["facility-agreement", "coupon", "rolled-up-interest", "non-recourse-loan"],
    relatedGuides: ["defaults", "hidden-fees", "legal"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "development-appraisal",
    term: "Development Appraisal",
    definition:
      "A financial model that calculates the viability of a proposed development by comparing the gross development value against total project costs including land, construction, finance, fees, and a target profit margin. The residual method is the most common approach, working backwards from GDV to determine the maximum land value the scheme can support. Lenders require a detailed development appraisal — often prepared using software such as Argus Developer — as part of every funding application, and will stress-test key assumptions including build costs, sales values, and programme.",
    relatedTerms: ["gross-development-value", "residual-land-value", "build-cost", "profit-on-cost"],
    relatedGuides: ["development-finance", "application", "valuations"],
    relatedServices: ["development-finance", "mezzanine-finance"],
  },
  {
    slug: "eia",
    term: "EIA (Environmental Impact Assessment)",
    definition:
      "A statutory process required under the Town and Country Planning (Environmental Impact Assessment) Regulations 2017 for developments likely to have significant environmental effects. EIAs are mandatory for larger schemes such as developments of more than 150 dwellings or sites exceeding 5 hectares, and may be required for smaller schemes through a screening opinion. The assessment results in an Environmental Statement that must accompany the planning application, adding both cost and time to the pre-development phase.",
    relatedTerms: ["planning-permission", "outline-planning", "pre-planning-risk", "s106"],
    relatedGuides: ["legal", "development-finance", "application"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "employers-agent",
    term: "Employer's Agent",
    definition:
      "A construction professional appointed by the developer to administer the building contract, certify interim valuations, and oversee the contractor's performance on behalf of the employer. Under JCT design-and-build contracts — the most common form used in UK residential development — the employer's agent fulfils the role of contract administrator. Lenders often require the appointment of an employer's agent as a condition of the facility, and their professional fees are included in the project budget.",
    relatedTerms: ["monitoring-surveyor", "quantity-surveyor", "professional-fees", "practical-completion"],
    relatedGuides: ["development-finance", "application", "legal"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "epc",
    term: "EPC (Energy Performance Certificate)",
    definition:
      "A certificate that rates the energy efficiency of a building on a scale from A (most efficient) to G (least efficient), required whenever a property is built, sold, or let. Since April 2018, it has been unlawful to grant a new tenancy of a property with an EPC rating below E, with proposals to raise the minimum to C for new tenancies. EPC ratings are increasingly important in development appraisals as buyers and lenders factor in future regulatory requirements and the cost of achieving higher ratings.",
    relatedTerms: ["building-regulations", "part-l-compliance", "practical-completion", "valuation"],
    relatedGuides: ["development-finance", "legal", "market"],
    relatedServices: ["development-finance", "refurbishment-finance", "commercial-mortgages"],
  },
  {
    slug: "equity-multiple",
    term: "Equity Multiple",
    definition:
      "A metric that measures the total cash returned to an equity investor as a multiple of their original investment — for example, a £500,000 equity contribution that returns £1,000,000 represents a 2.0x equity multiple. Unlike IRR, the equity multiple does not account for the time value of money, so it is typically used alongside IRR to give a complete picture of investment returns. In UK development finance joint ventures, equity investors typically target multiples of 1.3x to 2.0x depending on the risk profile and duration of the project.",
    relatedTerms: ["irr", "equity", "hurdle-rate", "profit-on-cost"],
    relatedGuides: ["equity", "structuring", "mezzanine"],
    relatedServices: ["equity-jv", "mezzanine-finance"],
  },
  {
    slug: "erv",
    term: "ERV (Estimated Rental Value)",
    definition:
      "The annual rent that a property is expected to achieve on the open market, as assessed by a RICS-qualified valuer. ERV is a critical input for valuing investment properties using the yield method and for underwriting buy-to-let, BTR, and commercial mortgage facilities. Lenders will apply a stress test to the ERV — typically assuming a void period and 10–15% below market rent — to ensure the debt can be serviced even in adverse conditions.",
    relatedTerms: ["cap-rate", "net-yield", "gross-yield", "dscr", "valuation"],
    relatedGuides: ["valuations", "commercial", "market"],
    relatedServices: ["commercial-mortgages", "development-finance"],
  },
  {
    slug: "extension-fee",
    term: "Extension Fee",
    definition:
      "A fee charged by the lender for extending the term of a loan facility beyond its original maturity date, typically expressed as a percentage of the outstanding loan balance. Extension fees on development finance facilities usually range from 0.5% to 2% and may be accompanied by an increased interest rate for the extension period. Borrowers should negotiate extension options and associated costs upfront in the facility agreement to avoid punitive charges if the build programme overruns.",
    relatedTerms: ["arrangement-fee", "exit-fee", "facility-agreement", "default-interest"],
    relatedGuides: ["hidden-fees", "development-finance", "defaults"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "fire-safety",
    term: "Fire Safety",
    definition:
      "The suite of regulatory requirements governing fire prevention, detection, and means of escape in buildings, significantly overhauled following the Building Safety Act 2022. For residential buildings over 18 metres (or 7 storeys), a gateway process now applies requiring fire safety information at each stage of design and construction. Developers must also comply with the ban on combustible materials in external walls above 11 metres. Lenders and warranty providers will not release final funds or issue certificates until fire safety compliance is fully demonstrated.",
    relatedTerms: ["building-regulations", "nhbc-warranty", "practical-completion", "part-l-compliance"],
    relatedGuides: ["legal", "development-finance"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "fixed-charge",
    term: "Fixed Charge",
    definition:
      "A form of security that attaches to a specific, identifiable asset — typically the development site — preventing the borrower from dealing with or disposing of that asset without the lender's consent. A first legal charge registered at the Land Registry is the most common form of fixed charge in development finance. Fixed charges rank ahead of floating charges in a liquidation, giving the holder priority over the proceeds of the charged asset.",
    relatedTerms: ["first-charge", "second-charge", "floating-charge", "debenture"],
    relatedGuides: ["legal", "structuring", "defaults"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "floating-charge",
    term: "Floating Charge",
    definition:
      "A form of security that hovers over a class of assets that may change from time to time, such as stock, plant, or receivables, crystallising into a fixed charge upon a defined trigger event such as borrower default. Floating charges are commonly included within a debenture taken over a borrower SPV and provide the lender with security over assets not covered by the fixed charge. Under the Insolvency Act 1986, floating charge holders rank behind preferential creditors and a prescribed part of the assets is reserved for unsecured creditors.",
    relatedTerms: ["fixed-charge", "debenture", "special-purpose-vehicle", "first-charge"],
    relatedGuides: ["legal", "defaults", "structuring"],
    relatedServices: ["development-finance", "mezzanine-finance"],
  },
  {
    slug: "forward-funding",
    term: "Forward Funding",
    definition:
      "An arrangement where an institutional investor acquires a development site and funds the construction costs directly, with the developer retained under a development agreement to deliver the scheme. The investor takes on the funding risk in exchange for acquiring the completed asset at an agreed yield, while the developer earns a development management fee and profit share. Forward-funding is commonly used for BTR, PBSA, and large-scale commercial schemes, and can significantly reduce the developer's equity requirement.",
    relatedTerms: ["build-to-rent", "pbsa", "cap-rate", "equity"],
    relatedGuides: ["structuring", "equity", "development-finance"],
    relatedServices: ["development-finance", "equity-jv"],
  },
  {
    slug: "greenfield",
    term: "Greenfield",
    definition:
      "Land that has not been previously developed, typically agricultural or open countryside, as distinguished from brownfield (previously developed) land. The NPPF prioritises the reuse of brownfield land, and greenfield development outside settlement boundaries is generally resisted unless allocated in the local plan or justified by special circumstances. Lenders may view greenfield sites as carrying higher planning risk, particularly if the land is not allocated, but schemes on allocated greenfield sites with full planning permission can attract competitive development finance terms.",
    relatedTerms: ["brownfield", "planning-permission", "outline-planning", "residual-land-value"],
    relatedGuides: ["development-finance", "legal", "market"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "ground-rent",
    term: "Ground Rent",
    definition:
      "A rent payable by a leaseholder to the freeholder for the use of the land on which the property stands. The Leasehold Reform (Ground Rent) Act 2022 effectively banned ground rents on most new long residential leases granted after 30 June 2022, restricting them to a peppercorn (zero financial value). For existing leases with escalating ground rents, the Act has prompted significant valuation adjustments and affects the exit strategy for developers selling leasehold units, particularly in flatted schemes.",
    relatedTerms: ["valuation", "gross-development-value", "net-development-value"],
    relatedGuides: ["legal", "development-finance", "market"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "hurdle-rate",
    term: "Hurdle Rate",
    definition:
      "The minimum rate of return that a project must achieve before an investor will commit capital, used as a benchmark in investment decision-making. In development finance joint ventures, the hurdle rate is often structured as a preferred return to the equity investor — typically 8–12% per annum — above which profits are shared according to an agreed promote or waterfall structure. Projects that fail to clear the hurdle rate are unlikely to attract institutional or private equity capital.",
    relatedTerms: ["irr", "equity-multiple", "profit-on-cost", "equity"],
    relatedGuides: ["equity", "structuring", "development-finance"],
    relatedServices: ["equity-jv", "mezzanine-finance"],
  },
  {
    slug: "irr",
    term: "IRR (Internal Rate of Return)",
    definition:
      "The annualised rate of return at which the net present value of all cash flows from an investment equals zero, used to compare the profitability of different development opportunities on a time-adjusted basis. Unlike profit on cost, IRR accounts for the timing and magnitude of each cash flow, making it the preferred metric for equity investors and joint venture partners. A typical ground-up residential development in the UK targets an IRR of 15–25%, though this varies significantly with project duration, leverage, and risk profile.",
    relatedTerms: ["equity-multiple", "hurdle-rate", "profit-on-cost", "net-development-value"],
    relatedGuides: ["equity", "structuring", "development-finance"],
    relatedServices: ["equity-jv", "development-finance"],
  },
  {
    slug: "land-banking",
    term: "Land Banking",
    definition:
      "The practice of acquiring and holding land for future development, often before planning permission has been secured, in anticipation of value appreciation. Land banking carries significant planning and market risk but can deliver substantial returns when sites achieve planning consent. Bridging loans are commonly used to fund land banking acquisitions, with terms of 12–18 months allowing time for planning applications to be determined. Lenders will typically offer lower leverage on land-only deals, often capping at 60–65% LTV.",
    relatedTerms: ["site-acquisition", "bridging-loan", "pre-planning-risk", "residual-land-value"],
    relatedGuides: ["bridging", "development-finance", "market"],
    relatedServices: ["bridging-loans", "development-finance"],
  },
  {
    slug: "later-living",
    term: "Later Living",
    definition:
      "Purpose-built residential accommodation designed for older adults, encompassing retirement housing, extra care, and assisted living schemes. The sector is increasingly attractive to developers and investors due to the UK's ageing demographic, with demand projected to significantly outstrip supply over the coming decades. Later living developments typically achieve premium sales values per square foot but require specialist design, longer sales periods, and are often funded through a combination of senior debt and institutional equity or forward-funding.",
    relatedTerms: ["build-to-rent", "forward-funding", "absorption-rate", "development-appraisal"],
    relatedGuides: ["development-finance", "market", "structuring"],
    relatedServices: ["development-finance", "equity-jv"],
  },
  {
    slug: "listed-building-consent",
    term: "Listed Building Consent",
    definition:
      "A separate consent required under the Planning (Listed Buildings and Conservation Areas) Act 1990 for any works of demolition, alteration, or extension that affect the character of a listed building. Listed building consent is required in addition to any planning permission and carries criminal sanctions for non-compliance. Development finance for listed building projects often requires specialist lender appetite, and costs for heritage-sensitive construction methods, conservation-accredited professionals, and extended programmes should be reflected in the appraisal.",
    relatedTerms: ["conservation-area", "planning-permission", "building-regulations", "professional-fees"],
    relatedGuides: ["legal", "development-finance", "application"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "mixed-use",
    term: "Mixed-Use",
    definition:
      "A development that combines two or more uses — typically residential with commercial, retail, or leisure — within a single scheme or site. Mixed-use developments are encouraged by planning policy as they promote sustainable communities and can benefit from the SDLT advantages of apportioning value between residential and commercial elements. Lending on mixed-use schemes can be more complex, often requiring separate valuations for each component, and some lenders will only fund the residential element while requiring the commercial space to be pre-let.",
    relatedTerms: ["use-class", "planning-permission", "gross-development-value", "sdlt"],
    relatedGuides: ["development-finance", "structuring", "commercial"],
    relatedServices: ["development-finance", "commercial-mortgages"],
  },
  {
    slug: "nhbc-warranty",
    term: "NHBC Warranty (Buildmark)",
    definition:
      "A 10-year structural warranty provided by the National House Building Council covering defects in newly built or converted residential properties. NHBC Buildmark is the most widely recognised warranty in the UK and is a standard requirement from mortgage lenders before they will lend to purchasers of new-build homes. Development finance lenders require evidence that an NHBC (or equivalent) warranty provider has been engaged from the outset, as the inability to provide a warranty at practical completion can prevent unit sales and delay the developer's exit.",
    relatedTerms: ["practical-completion", "defects-liability-period", "building-regulations", "monitoring-surveyor"],
    relatedGuides: ["development-finance", "legal", "application"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "non-utilisation-fee",
    term: "Non-Utilisation Fee",
    definition:
      "A fee charged by the lender on the committed but undrawn portion of a loan facility, incentivising the borrower to draw down funds in line with the agreed build programme. Non-utilisation fees are typically 0.5–1.5% per annum of the undrawn balance and are economically similar to a commitment fee, though the two terms are sometimes used interchangeably. The fee ensures the lender receives some return on capital reserved for the borrower that is not yet earning the full coupon.",
    relatedTerms: ["commitment-fee", "drawdown", "facility-agreement", "arrangement-fee"],
    relatedGuides: ["hidden-fees", "development-finance", "structuring"],
    relatedServices: ["development-finance", "mezzanine-finance"],
  },
  {
    slug: "outline-planning",
    term: "Outline Planning Permission",
    definition:
      "A form of planning consent that establishes the principle and scale of development on a site without approving the detailed design, which is dealt with subsequently through reserved matters applications. Outline permission is commonly sought on larger sites to de-risk the land value before committing to full architectural design costs. Lenders will fund sites with outline planning at lower leverage than those with full or reserved matters approval, reflecting the residual planning risk and the need for further consents before construction can commence.",
    relatedTerms: ["planning-permission", "pre-planning-risk", "residual-land-value", "greenfield"],
    relatedGuides: ["development-finance", "legal", "application"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "overage",
    term: "Overage",
    definition:
      "A contractual mechanism in a land sale that entitles the seller to receive additional payment if specified trigger events occur after completion, typically the grant of planning permission or achievement of sales values above an agreed threshold. Overage clauses are common on land transactions where the buyer intends to obtain planning consent for a more valuable use than the current designation. Lenders need to understand overage obligations as they can create additional charges on the title and may crystallise as a cost that reduces the developer's profit.",
    relatedTerms: ["residual-land-value", "site-acquisition", "planning-permission", "land-registry"],
    relatedGuides: ["legal", "development-finance", "structuring"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "pari-passu",
    term: "Pari Passu",
    definition:
      "A Latin term meaning 'on equal footing', used in finance to describe creditors or security interests that rank equally in priority without preference. In development finance, pari passu arrangements may apply when two lenders share the same security ranking — for example, two mezzanine providers with equal claims on the second charge. Intercreditor agreements must clearly define whether obligations rank pari passu or in a specific priority order to avoid disputes on enforcement.",
    relatedTerms: ["intercreditor-deed", "senior-debt", "mezzanine-finance", "capital-stack"],
    relatedGuides: ["legal", "structuring", "mezzanine"],
    relatedServices: ["mezzanine-finance", "development-finance"],
  },
  {
    slug: "part-l-compliance",
    term: "Part L Compliance",
    definition:
      "The requirement to meet the energy efficiency standards set out in Part L of the Building Regulations, covering the conservation of fuel and power in buildings. The 2021 uplift to Part L introduced a 31% reduction in carbon emissions for new dwellings compared to the previous standard, representing a significant step towards the Future Homes Standard expected in 2025. Compliance typically requires enhanced fabric performance, low-carbon heating (often heat pumps), and can add 3–8% to build costs, which must be reflected in the development appraisal.",
    relatedTerms: ["building-regulations", "epc", "build-cost", "fire-safety"],
    relatedGuides: ["development-finance", "legal", "market"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "pbsa",
    term: "PBSA (Purpose-Built Student Accommodation)",
    definition:
      "Residential accommodation designed and managed specifically for university students, typically comprising en-suite cluster flats or self-contained studios with shared amenities. PBSA is classified as sui generis in planning terms and has become a major institutional asset class in UK cities with strong university demand. Development finance for PBSA schemes is readily available from specialist lenders, with facilities typically sized at 55–65% LTGDV, and forward-funding from institutional investors is increasingly common for larger schemes.",
    relatedTerms: ["build-to-rent", "forward-funding", "use-class", "erv"],
    relatedGuides: ["development-finance", "market", "structuring"],
    relatedServices: ["development-finance", "equity-jv"],
  },
  {
    slug: "pre-commencement-conditions",
    term: "Pre-Commencement Conditions",
    definition:
      "Conditions attached to a planning permission that must be discharged before any development work can begin on site. Common pre-commencement conditions include submission of a construction management plan, archaeological investigation, contamination remediation strategy, and drainage details. Under the Town and Country Planning Act 1990 (as amended), pre-commencement conditions require the applicant's written agreement, and lenders will not release construction drawdowns until all pre-commencement conditions have been formally discharged by the local authority.",
    relatedTerms: ["planning-permission", "outline-planning", "drawdown", "brownfield"],
    relatedGuides: ["legal", "development-finance", "application"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "pre-planning-risk",
    term: "Pre-Planning Risk",
    definition:
      "The risk that a development site fails to secure planning permission, or that the consent granted is materially different from the scheme envisaged, undermining the project's financial viability. Pre-planning risk is one of the principal reasons lenders offer lower leverage on sites without an implementable consent, typically capping at 60–65% LTV compared with 70–75% for sites with full planning. Developers can mitigate pre-planning risk through pre-application discussions with the local authority, engagement with planning consultants, and commissioning specialist reports such as heritage assessments, ecology surveys, and transport studies.",
    relatedTerms: ["outline-planning", "planning-permission", "residual-land-value", "site-acquisition"],
    relatedGuides: ["development-finance", "bridging", "application"],
    relatedServices: ["bridging-loans", "development-finance"],
  },
  {
    slug: "preferred-return",
    term: "Preferred Return",
    definition:
      "A minimum rate of return that must be paid to one class of investor before profits are distributed to other parties in a joint venture or equity structure. In UK development finance, preferred returns typically range from 8% to 15% per annum and are paid to the equity investor ahead of any profit share with the developer. The preferred return compensates the investor for the higher risk of an equity position compared to senior debt.",
    relatedTerms: ["equity", "joint-venture", "waterfall", "mezzanine-finance"],
    relatedGuides: ["equity", "structuring", "development-finance"],
    relatedServices: ["equity-jv", "mezzanine-finance"],
  },
  {
    slug: "programme-delay",
    term: "Programme Delay",
    definition:
      "A delay to the planned construction programme that pushes back the expected completion date of a development project. Programme delays increase holding costs including rolled-up interest, extended preliminary costs, and monitoring surveyor fees. Lenders will typically build in a buffer of two to three months beyond the developer's programme when setting the loan term, but significant delays may require a facility extension at additional cost.",
    relatedTerms: ["rolled-up-interest", "practical-completion", "contingency", "monitoring-surveyor"],
    relatedGuides: ["development-finance", "defaults", "hidden-fees"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "project-monitor",
    term: "Project Monitor",
    definition:
      "A professional appointed by the lender to oversee the progress of a development project and verify that construction milestones have been achieved before drawdowns are released. The project monitor, often a chartered surveyor or quantity surveyor, conducts regular site inspections and provides reports to the lender confirming works are on programme and within budget. Project monitoring fees are typically charged to the borrower at £500 to £1,500 per visit.",
    relatedTerms: ["monitoring-surveyor", "drawdown", "quantity-surveyor", "retention"],
    relatedGuides: ["development-finance", "application", "hidden-fees"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "rack-rent",
    term: "Rack Rent",
    definition:
      "The full open market rental value of a property if let on normal commercial terms without any premium, rent-free period, or discount. Rack rent is the benchmark used by valuers to assess the investment value of commercial and mixed-use properties. Lenders use rack rent to calculate interest cover ratios and assess the viability of investment or refinancing proposals.",
    relatedTerms: ["gross-yield", "net-yield", "icr", "valuation"],
    relatedGuides: ["commercial", "valuations", "market"],
    relatedServices: ["commercial-mortgages"],
  },
  {
    slug: "recourse-loan",
    term: "Recourse Loan",
    definition:
      "A loan where the borrower is personally liable for repayment beyond the value of the secured asset, meaning the lender can pursue the borrower's other assets if the property sale does not cover the outstanding debt. Most UK development finance is full recourse, supported by personal guarantees from directors or shareholders of the borrowing SPV. Recourse lending typically attracts lower interest rates than non-recourse facilities because the lender has additional security.",
    relatedTerms: ["non-recourse-loan", "personal-guarantee", "special-purpose-vehicle", "senior-debt"],
    relatedGuides: ["structuring", "legal", "development-finance"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "remediation",
    term: "Remediation",
    definition:
      "The process of removing or treating contamination on a development site to make it safe for the intended use, often required on brownfield or former industrial land. Remediation costs can be substantial, ranging from £50,000 to over £1 million depending on the type and extent of contamination. Lenders require a Phase 2 environmental report and agreed remediation strategy before advancing funds on contaminated sites.",
    relatedTerms: ["site-investigation", "build-cost", "contingency", "planning-permission"],
    relatedGuides: ["development-finance", "application", "valuations"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "reserved-matters",
    term: "Reserved Matters",
    definition:
      "The detailed aspects of a development that are held back for later approval when outline planning permission is granted, typically covering access, appearance, landscaping, layout, and scale. A reserved matters application must be submitted within the time limit specified in the outline consent, usually three years. Lenders generally require full or reserved matters approval in place before completing on a development finance facility, as outline permission alone carries implementation risk.",
    relatedTerms: ["planning-permission", "condition-precedent", "section-73"],
    relatedGuides: ["legal", "development-finance", "application"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "right-to-light",
    term: "Right to Light",
    definition:
      "A legal right enjoyed by a property owner to receive natural light through defined apertures, established after 20 years of uninterrupted enjoyment under the Prescription Act 1832. Adjoining owners can seek an injunction to prevent development that would substantially interfere with their right to light, potentially halting or redesigning a scheme. Developers should commission a right to light survey early in the design process, as compensation settlements or scheme amendments can significantly affect project viability.",
    relatedTerms: ["planning-permission", "viability-assessment", "build-cost"],
    relatedGuides: ["legal", "development-finance"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "section-73",
    term: "Section 73",
    definition:
      "An application made under Section 73 of the Town and Country Planning Act 1990 to vary or remove conditions attached to an existing planning permission. Section 73 is commonly used to amend approved plans, extend the time limit for implementation, or adjust planning conditions without the need for a full new application. The resulting consent is treated as a new permission, so developers must ensure all conditions from the original consent are carried across.",
    relatedTerms: ["planning-permission", "reserved-matters", "condition-precedent"],
    relatedGuides: ["legal", "development-finance"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "security-package",
    term: "Security Package",
    definition:
      "The full suite of security taken by a lender to protect their position on a development loan, typically including a first legal charge over the property, a debenture over the borrowing company, personal guarantees from directors, and an assignment of key project contracts. The strength of the security package directly influences the terms a lender will offer, including the loan-to-value ratio and interest rate. Weak security packages often result in higher pricing or reduced leverage.",
    relatedTerms: ["first-charge", "personal-guarantee", "facility-agreement", "intercreditor-deed"],
    relatedGuides: ["legal", "structuring", "application"],
    relatedServices: ["development-finance", "bridging-loans", "mezzanine-finance"],
  },
  {
    slug: "site-investigation",
    term: "Site Investigation",
    definition:
      "A series of ground investigations and environmental assessments carried out to identify potential risks associated with a development site, including contamination, ground conditions, flood risk, and ecological constraints. A typical site investigation includes a Phase 1 desktop study and, if necessary, a Phase 2 intrusive investigation involving trial pits and boreholes. Lenders require satisfactory site investigation reports as a condition precedent to drawdown, particularly on brownfield sites.",
    relatedTerms: ["remediation", "condition-precedent", "build-cost", "contingency"],
    relatedGuides: ["development-finance", "application", "valuations"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "solicitors-undertaking",
    term: "Solicitor's Undertaking",
    definition:
      "A binding promise given by a solicitor in their professional capacity to perform or abstain from a specific action, enforceable by the courts and the Solicitors Regulation Authority (SRA). In property finance, solicitors' undertakings are commonly given in relation to the application of loan proceeds, the discharge of existing charges, or the registration of security. Breach of an undertaking is a serious disciplinary matter that can result in a solicitor being struck off.",
    relatedTerms: ["facility-agreement", "first-charge", "title-deed"],
    relatedGuides: ["legal", "application"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "spa",
    term: "SPA (Sale and Purchase Agreement)",
    definition:
      "A legally binding contract setting out the terms on which a property or site is to be sold and purchased, including the price, completion date, and any conditions. In development transactions, SPAs often include conditions precedent such as the grant of satisfactory planning permission or the availability of funding. Forward-sale SPAs, where completed units are pre-sold to a housing association or investor, can significantly strengthen a development finance application.",
    relatedTerms: ["condition-precedent", "title-deed", "vacant-possession", "facility-agreement"],
    relatedGuides: ["legal", "application", "structuring"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "step-in-rights",
    term: "Step-in Rights",
    definition:
      "Contractual rights that allow a lender to take over a development project from the borrower in the event of default, assuming control of the build contract, professional appointments, and site operations. Step-in rights are a critical component of the lender's security package, enabling them to complete the development and protect the value of their loan rather than relying solely on a forced sale. These rights are typically documented through a duty of care agreement or collateral warranty from the main contractor.",
    relatedTerms: ["security-package", "facility-agreement", "first-charge", "personal-guarantee"],
    relatedGuides: ["legal", "defaults", "structuring"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "stretched-senior",
    term: "Stretched Senior",
    definition:
      "A single-tranche development loan that provides higher leverage than traditional senior debt, typically up to 75-85% of costs or 65-70% of GDV, eliminating the need for a separate mezzanine facility. Stretched senior pricing blends the cost of senior and mezzanine lending into one rate, simplifying the capital structure and avoiding the need for an intercreditor deed. It is particularly popular on schemes of £2 million to £15 million where the cost and complexity of a separate mezzanine tranche is disproportionate.",
    relatedTerms: ["senior-debt", "mezzanine-finance", "capital-stack", "ltgdv", "unitranche"],
    relatedGuides: ["structuring", "development-finance", "comparison"],
    relatedServices: ["development-finance", "mezzanine-finance"],
  },
  {
    slug: "subordination",
    term: "Subordination",
    definition:
      "The arrangement by which one lender agrees that their claim on the borrower's assets ranks behind that of another lender, most commonly where mezzanine debt is subordinated to the senior lender's first charge. Subordination is documented in an intercreditor deed which governs the priority of repayment, enforcement rights, and information sharing between lenders. The degree of subordination directly affects the risk profile and pricing of each tranche within the capital stack.",
    relatedTerms: ["intercreditor-deed", "mezzanine-finance", "senior-debt", "capital-stack", "first-charge"],
    relatedGuides: ["structuring", "mezzanine", "legal"],
    relatedServices: ["mezzanine-finance", "development-finance"],
  },
  {
    slug: "sui-generis",
    term: "Sui Generis",
    definition:
      "A planning classification meaning 'of its own kind,' used for property uses that do not fall within any of the standard use classes defined by the Town and Country Planning (Use Classes) Order 1987. Examples of sui generis uses include petrol stations, theatres, nightclubs, launderettes, and large HMOs with more than six occupants. Change of use to or from a sui generis use always requires planning permission, with no permitted development rights available.",
    relatedTerms: ["use-class", "planning-permission", "hmo", "permitted-development-rights"],
    relatedGuides: ["legal", "development-finance"],
    relatedServices: ["development-finance", "commercial-mortgages"],
  },
  {
    slug: "sunset-clause",
    term: "Sunset Clause",
    definition:
      "A contractual provision that sets a longstop date by which certain conditions must be fulfilled, failing which either party may terminate the agreement. In development transactions, sunset clauses are commonly found in forward-sale agreements and option contracts, requiring planning permission to be secured or construction to be completed by a specified date. Developers should negotiate realistic sunset dates that allow for planning delays and construction overruns.",
    relatedTerms: ["spa", "condition-precedent", "facility-agreement", "programme-delay"],
    relatedGuides: ["legal", "structuring"],
    relatedServices: ["development-finance", "equity-jv"],
  },
  {
    slug: "title-deed",
    term: "Title Deed",
    definition:
      "A legal document that proves ownership of a property or parcel of land, now predominantly held in electronic form at HM Land Registry. The lender's solicitor will conduct a thorough review of the title deeds to identify any restrictions, covenants, easements, or defects that could affect the development or the enforceability of the lender's security. Unregistered land or defective title can be addressed through title insurance or statutory declarations.",
    relatedTerms: ["land-registry", "first-charge", "title-insurance", "solicitors-undertaking"],
    relatedGuides: ["legal", "application"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "tranche",
    term: "Tranche",
    definition:
      "A distinct portion or layer of funding within a development finance structure, each with its own terms, pricing, and priority of repayment. A typical development scheme might include a senior debt tranche, a mezzanine tranche, and a developer equity tranche. Tranches are drawn sequentially, with equity typically deployed first, followed by senior debt, and mezzanine last, ensuring each lender's risk is proportionate to their position in the capital stack.",
    relatedTerms: ["capital-stack", "senior-debt", "mezzanine-finance", "drawdown", "intercreditor-deed"],
    relatedGuides: ["structuring", "mezzanine", "development-finance"],
    relatedServices: ["development-finance", "mezzanine-finance", "equity-jv"],
  },
  {
    slug: "tree-preservation-order",
    term: "Tree Preservation Order",
    definition:
      "A legal order made by a local planning authority under the Town and Country Planning Act 1990 to protect specific trees, groups of trees, or woodlands from being cut down, topped, lopped, or uprooted without consent. Carrying out prohibited works to a protected tree is a criminal offence with fines of up to £20,000 in a magistrates' court. Developers must survey for TPOs during due diligence as they can constrain site layout and increase build costs if scheme redesign is required.",
    relatedTerms: ["planning-permission", "site-investigation", "build-cost"],
    relatedGuides: ["legal", "development-finance"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "turnkey",
    term: "Turnkey",
    definition:
      "A development that is delivered fully complete and ready for immediate occupation, with all fixtures, fittings, and finishes in place. Turnkey delivery is common in forward-sale agreements with housing associations or institutional investors, where the buyer expects to take possession without any further works. Lenders view turnkey pre-sales favourably as they provide certainty of exit and reduce the developer's sales risk.",
    relatedTerms: ["practical-completion", "spa", "development-exit-finance"],
    relatedGuides: ["development-finance", "structuring"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "underwriting",
    term: "Underwriting",
    definition:
      "The process by which a lender assesses and approves a development finance application, evaluating the borrower's experience, the scheme's viability, the security offered, and the proposed exit strategy. Underwriting typically involves a detailed review of the development appraisal, site valuation, planning consent, and the borrower's track record. A deal that has passed underwriting and received credit committee approval will be issued with a formal facility letter or term sheet.",
    relatedTerms: ["facility-agreement", "red-book-valuation", "security-package", "loan-to-cost"],
    relatedGuides: ["application", "development-finance", "structuring"],
    relatedServices: ["development-finance", "bridging-loans", "mezzanine-finance"],
  },
  {
    slug: "unitranche",
    term: "Unitranche",
    definition:
      "A single loan facility that combines senior and mezzanine debt into one tranche with a single set of terms and a blended interest rate, removing the need for an intercreditor deed. Unitranche facilities typically offer 70-85% loan-to-cost at rates that sit between pure senior and mezzanine pricing, often around 9-14% per annum. They are well suited to mid-market developments where speed and simplicity of execution are valued over marginal cost savings from a structured capital stack.",
    relatedTerms: ["stretched-senior", "senior-debt", "mezzanine-finance", "capital-stack"],
    relatedGuides: ["structuring", "comparison", "development-finance"],
    relatedServices: ["development-finance", "mezzanine-finance"],
  },
  {
    slug: "vacant-possession",
    term: "Vacant Possession",
    definition:
      "The delivery of a property free from any occupiers, tenancies, or licences, giving the buyer or developer unimpeded physical and legal possession. Vacant possession is usually a condition precedent to completion on development site acquisitions, as existing occupiers can delay or prevent a scheme from proceeding. Where sitting tenants or business occupiers are in place, the cost and timeline for obtaining vacant possession must be factored into the development appraisal.",
    relatedTerms: ["spa", "condition-precedent", "site-acquisition", "title-deed"],
    relatedGuides: ["legal", "development-finance", "application"],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "viability-assessment",
    term: "Viability Assessment",
    definition:
      "A financial appraisal submitted to the local planning authority to demonstrate that a development scheme cannot viably deliver the full policy requirements for affordable housing, S106 contributions, or CIL. Viability assessments follow the methodology set out in the NPPF and PPG, using standardised inputs for land value, build costs, and developer profit (typically 15-20% on GDV). They are often contested by councils and may require independent review, adding cost and delay to the planning process.",
    relatedTerms: ["affordable-housing", "s106", "cil", "gross-development-value", "residual-land-value"],
    relatedGuides: ["development-finance", "structuring", "legal"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "void-period",
    term: "Void Period",
    definition:
      "The period during which a property stands empty and produces no rental income, whether between lettings or prior to first occupation. Void periods directly impact investment returns and a lender's assessment of debt serviceability, particularly on commercial mortgage applications. Lenders typically stress-test their calculations by assuming void periods of three to six months to ensure the borrower can service the debt during unlet periods.",
    relatedTerms: ["rack-rent", "gross-yield", "net-yield", "icr", "dscr"],
    relatedGuides: ["commercial", "valuations", "market"],
    relatedServices: ["commercial-mortgages"],
  },
  {
    slug: "waterfall",
    term: "Waterfall",
    definition:
      "The contractual mechanism that determines the order and priority in which project proceeds are distributed among the parties in a development finance structure. A typical waterfall flows from repayment of senior debt, to return of mezzanine capital plus interest, to return of equity capital, to preferred return, and finally to profit share. The waterfall structure is critical in joint ventures and equity partnerships, as it determines how value is split between the capital provider and the developer.",
    relatedTerms: ["preferred-return", "capital-stack", "equity", "joint-venture", "subordination"],
    relatedGuides: ["equity", "structuring", "mezzanine"],
    relatedServices: ["equity-jv", "mezzanine-finance"],
  },
  {
    slug: "wayleave",
    term: "Wayleave",
    definition:
      "A contractual agreement granting a utility company or third party the right to install, maintain, and access equipment such as cables, pipes, or pylons on or across a parcel of land. Unlike an easement, a wayleave is a personal licence that can typically be terminated with notice, although statutory wayleaves under the Electricity Act 1989 provide stronger protections for utility companies. Developers must identify existing wayleaves during due diligence as they can restrict where buildings and infrastructure can be positioned on site.",
    relatedTerms: ["title-deed", "site-investigation", "planning-permission"],
    relatedGuides: ["legal", "development-finance"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "windfall-site",
    term: "Windfall Site",
    definition:
      "A development site that comes forward for housing unexpectedly, outside the planned allocations in a local authority's local plan. Windfall sites are typically smaller infill plots, garden land, or brownfield sites that become available through changes of ownership or market conditions. Local planning authorities are required to include a windfall allowance in their housing supply calculations under the NPPF, and lenders will fund windfall developments provided they have satisfactory planning consent.",
    relatedTerms: ["planning-permission", "site-acquisition", "residual-land-value"],
    relatedGuides: ["development-finance", "market"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "working-capital",
    term: "Working Capital",
    definition:
      "The liquid funds available to a development company to cover day-to-day operational expenses and short-term liabilities that are not covered by the project loan facility. Working capital requirements include items such as planning application fees, professional fees incurred before loan drawdown, marketing costs, and overheads. Lenders assess the borrower's working capital position as part of the underwriting process to ensure the developer can fund costs that fall outside the facility.",
    relatedTerms: ["professional-fees", "equity", "contingency", "underwriting"],
    relatedGuides: ["application", "development-finance", "structuring"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "zero-carbon",
    term: "Zero Carbon",
    definition:
      "A development standard where a building produces net zero carbon emissions over its operational lifetime, achieved through energy-efficient design, renewable energy generation, and carbon offsetting. The Future Homes Standard, expected to be implemented through Part L of the Building Regulations, will require new homes built from 2025 to produce 75-80% less carbon emissions than current standards. Achieving zero carbon certification can increase build costs by 5-10% but may command premium sale prices and attract ESG-focused institutional investors.",
    relatedTerms: ["building-regulations", "build-cost", "gross-development-value"],
    relatedGuides: ["development-finance", "market"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "affordable-housing",
    term: "Affordable Housing",
    definition:
      "Housing provided at below market rates to eligible households, including social rent, affordable rent, shared ownership, and First Homes, as defined by Annex 2 of the NPPF. Local planning authorities typically require 20-50% affordable housing provision on developments above a threshold of 10 units, though this can be reduced through a viability assessment. Affordable housing obligations are a key cost in the development appraisal and can significantly affect scheme profitability and the amount of debt a lender will advance.",
    relatedTerms: ["viability-assessment", "s106", "planning-permission", "gross-development-value"],
    relatedGuides: ["development-finance", "structuring", "legal"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "air-rights",
    term: "Air Rights",
    definition:
      "The right to develop or build in the airspace above an existing building or piece of land, which can be purchased or leased separately from the ground-level property. Air rights development has become increasingly common in London and other high-value urban areas, with schemes adding additional storeys to existing buildings under permitted development rights or planning consent. Financing air rights schemes can be complex, as the security structure must address the relationship between the airspace and the underlying freehold.",
    relatedTerms: ["planning-permission", "permitted-development-rights", "title-deed", "security-package"],
    relatedGuides: ["development-finance", "legal", "structuring"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "anchor-tenant",
    term: "Anchor Tenant",
    definition:
      "A major tenant whose presence in a commercial development attracts other tenants, customers, or footfall, typically occupying a significant proportion of the available floorspace. In retail developments, anchor tenants are usually national retailers or supermarkets; in office schemes, they might be large corporate occupiers. Securing an anchor tenant with a pre-let agreement can significantly strengthen a development finance application by providing certainty of rental income and supporting the exit valuation.",
    relatedTerms: ["rack-rent", "void-period", "gross-yield", "valuation"],
    relatedGuides: ["commercial", "development-finance", "structuring"],
    relatedServices: ["commercial-mortgages", "development-finance"],
  },
  {
    slug: "base-rate",
    term: "Base Rate",
    definition:
      "The interest rate set by the Bank of England's Monetary Policy Committee, which serves as the benchmark for variable-rate lending across the UK financial system. Development finance and bridging loan rates are often quoted as a margin above the Bank of England base rate, for example base rate plus 4.5%. Changes to the base rate directly affect borrowing costs on variable-rate facilities and influence fixed-rate pricing through the swap market.",
    relatedTerms: ["rolled-up-interest", "serviced-interest", "arrangement-fee"],
    relatedGuides: ["comparison", "market", "development-finance"],
    relatedServices: ["development-finance", "bridging-loans", "commercial-mortgages"],
  },
  {
    slug: "best-endeavours",
    term: "Best Endeavours",
    definition:
      "A contractual obligation requiring a party to take all reasonable steps to achieve a specified outcome, even at significant cost or inconvenience to themselves. In English law, a best endeavours obligation is the most onerous standard, requiring the obligor to do everything a reasonable person in their position could do, short of actions that would result in their financial ruin. Development finance facility agreements often include best endeavours clauses relating to obtaining planning, achieving practical completion, or meeting pre-sale targets.",
    relatedTerms: ["facility-agreement", "condition-precedent", "sunset-clause"],
    relatedGuides: ["legal", "structuring"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "break-clause",
    term: "Break Clause",
    definition:
      "A provision in a lease that allows either the landlord or tenant to terminate the tenancy before the contractual expiry date, subject to specified conditions and notice periods. Break clauses are a key consideration in investment valuations, as they introduce uncertainty about future rental income. Lenders assessing a commercial mortgage will stress-test their calculations assuming tenants exercise break options, which can reduce the property's investment value.",
    relatedTerms: ["rack-rent", "void-period", "valuation", "anchor-tenant"],
    relatedGuides: ["commercial", "valuations"],
    relatedServices: ["commercial-mortgages"],
  },
  {
    slug: "building-control",
    term: "Building Control",
    definition:
      "The regulatory function responsible for ensuring that building work complies with the Building Regulations 2010, carried out either by the local authority building control service or an approved inspector. Building control officers inspect works at key stages including foundations, damp-proof course, drainage, and completion. A building control completion certificate is required by lenders before they will release the final retention and confirm practical completion.",
    relatedTerms: ["building-regulations", "practical-completion", "retention", "monitoring-surveyor"],
    relatedGuides: ["development-finance", "legal"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "bulk-discount",
    term: "Bulk Discount",
    definition:
      "A reduction in the per-unit purchase price offered when a buyer acquires multiple units in a single transaction, commonly applied in forward-sales to housing associations or institutional investors. Bulk discounts typically range from 10% to 25% below the open market value of individual units. Lenders factor bulk discount sales into their GDV assessment, so developers should model both individual and bulk sale scenarios in their development appraisal.",
    relatedTerms: ["gross-development-value", "net-development-value", "affordable-housing", "turnkey"],
    relatedGuides: ["development-finance", "valuations", "structuring"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "clerk-of-works",
    term: "Clerk of Works",
    definition:
      "An independent quality inspector appointed by the developer or client to monitor construction workmanship and ensure it meets the contract specification and building regulations. Unlike the monitoring surveyor who acts for the lender, the clerk of works is employed to protect the developer's interests and is typically on site more frequently. On larger residential schemes, the cost of a clerk of works is usually £40,000 to £80,000 per annum and is included within the professional fees budget.",
    relatedTerms: ["monitoring-surveyor", "building-control", "quantity-surveyor", "professional-fees"],
    relatedGuides: ["development-finance", "application"],
    relatedServices: ["development-finance"],
  },
  {
    slug: "commercial-to-residential",
    term: "Commercial to Residential",
    definition:
      "The conversion of commercial premises, such as offices, retail units, or light industrial buildings, into residential dwellings. Since 2013, Class MA (formerly Class O) of the General Permitted Development Order has allowed office-to-residential conversions without full planning permission, subject to prior approval. Commercial-to-residential conversions are popular with developers because they can reduce planning risk, though lenders will scrutinise the condition of the existing building and the cost of conversion works.",
    relatedTerms: ["permitted-development-rights", "prior-approval", "use-class", "article-4-direction"],
    relatedGuides: ["development-finance", "legal", "comparison"],
    relatedServices: ["development-finance", "refurbishment-finance", "bridging-loans"],
  },
  {
    slug: "condition-precedent",
    term: "Condition Precedent",
    definition:
      "A requirement that must be satisfied before a lender is obliged to make funds available under a facility agreement, often abbreviated to CP. Common conditions precedent in development finance include receipt of satisfactory valuation, confirmation of planning consent, execution of the building contract, and evidence of equity contribution. Failure to satisfy all CPs within the agreed longstop date may entitle the lender to withdraw the facility offer.",
    relatedTerms: ["facility-agreement", "underwriting", "security-package", "sunset-clause"],
    relatedGuides: ["application", "legal", "development-finance"],
    relatedServices: ["development-finance", "bridging-loans", "mezzanine-finance"],
  },
  {
    slug: "cost-plan",
    term: "Cost Plan",
    definition:
      "A detailed elemental breakdown of anticipated construction costs prepared by a quantity surveyor, used to establish the project budget and inform the lender's assessment of the development facility. A cost plan typically covers substructure, superstructure, finishes, mechanical and electrical services, external works, preliminaries, contingency, and professional fees. Lenders require an independent cost plan as part of the underwriting process, and significant deviations from the cost plan during construction may trigger a re-assessment of the facility.",
    relatedTerms: ["quantity-surveyor", "build-cost", "contingency", "professional-fees"],
    relatedGuides: ["development-finance", "application", "valuations"],
    relatedServices: ["development-finance", "refurbishment-finance"],
  },
  {
    slug: "cross-collateralisation",
    term: "Cross-Collateralisation",
    definition:
      "A lending arrangement where two or more properties are used as security for a single loan or group of loans, meaning the lender can enforce against any or all of the properties in the event of default. Cross-collateralisation is used by portfolio landlords and developers with multiple sites to increase overall leverage or to provide additional security where one site alone would be insufficient. The arrangement can complicate refinancing or individual property sales, as the lender's consent is required to release any asset from the cross-collateral pool.",
    relatedTerms: ["security-package", "first-charge", "personal-guarantee", "ltv"],
    relatedGuides: ["structuring", "legal", "commercial"],
    relatedServices: ["commercial-mortgages", "development-finance", "bridging-loans"],
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
