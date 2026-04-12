import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the Stamp Duty (SDLT) Calculator Works",
    paragraphs: [
      "Stamp Duty Land Tax (SDLT) applies to the purchase of land and property in England and Northern Ireland. In Wales, Land Transaction Tax (LTT) applies; in Scotland, Land and Buildings Transaction Tax (LBTT) applies. This calculator covers SDLT for England and Northern Ireland, which is the regime most relevant to residential and commercial property transactions in the UK's largest markets.",
      "SDLT is calculated on a marginal basis - like income tax, each rate applies only to the portion of the purchase price that falls within that band. Enter the purchase price, the property type, and whether it is an additional property purchase, and the calculator applies the correct rate bands to produce the total SDLT liability.",
      "The calculator handles four scenarios: standard residential purchases, additional property purchases (which attract a surcharge), first-time buyer purchases (which benefit from a nil-rate threshold up to £425,000), and company purchases. Each follows different rate tables and rules, and selecting the wrong scenario is one of the most common causes of SDLT errors in property transactions.",
      "For commercial and mixed-use property, different rate bands apply entirely. A mixed-use claim - arguing that a residential property with commercial elements should be taxed at commercial rates - can significantly reduce the SDLT liability, and it is worth discussing with your solicitor on any acquisition that combines residential and non-residential use.",
    ],
  },
  guide: {
    title: "SDLT Rates, Reliefs, and How to Reduce Your Stamp Duty Bill",
    sections: [
      {
        heading: "Current SDLT Rate Bands (2024/25)",
        paragraphs: [
          "For standard residential purchases in England and Northern Ireland, SDLT is charged at the following marginal rates: 0% on the first £250,000 of the purchase price; 5% on the portion between £250,001 and £925,000; 10% on the portion between £925,001 and £1.5m; and 12% on everything above £1.5m.",
          "These rates apply to the main home of an individual buyer. The nil-rate band was temporarily raised to £250,000 from £125,000 as part of the September 2022 stamp duty cut, and this threshold became permanent from April 2025. The 10% and 12% bands at the top end of the market mean that buyers of high-value London and Home Counties properties face significant SDLT bills - the maximum marginal rate on a £2m purchase, for example, is 12% on the top £500,000.",
          "Non-residential and mixed-use SDLT rates are lower: 0% up to £150,000; 2% from £150,001 to £250,000; and 5% above £250,000. This rate differential is why mixed-use claims are so valuable for properties that span residential and commercial use.",
        ],
        bullets: [
          "0% on the first £250,000 (standard residential)",
          "5% on £250,001 to £925,000",
          "10% on £925,001 to £1,500,000",
          "12% above £1,500,000",
          "Non-residential: 0% / 2% / 5% - substantially lower on large transactions",
        ],
      },
      {
        heading: "Additional Property Surcharge: The 5% Premium",
        paragraphs: [
          "If you are buying a residential property and you already own one or more residential properties anywhere in the world, an additional surcharge applies on top of the standard rates. From 31 October 2024, this surcharge increased from 3% to 5%, meaning every rate band is effectively 5 percentage points higher for additional property purchases.",
          "The higher rates for additional dwellings apply to landlords, second home buyers, and developers who purchase in their personal name while owning other residential property. They also apply to company purchases of residential property - a company is assumed to own additional properties if any of its shareholders own residential property, which catches many developers who operate through limited companies.",
          "There is a relief mechanism: if you sell your previous main residence within three years of buying a new one, you can apply for a refund of the additional property surcharge. This applies to home movers who briefly own two properties rather than investors, and HMRC processes these claims through the SDLT return amendment process.",
        ],
        bullets: [
          "Surcharge increased from 3% to 5% on 31 October 2024",
          "Applies to any purchase where buyer already owns residential property",
          "Companies purchasing residential property pay the surcharge by default",
          "Three-year refund window for main residence replacements",
          "Applies to non-UK property ownership - worldwide assets count",
        ],
      },
      {
        heading: "First-Time Buyer Relief and Multiple Dwellings Relief",
        paragraphs: [
          "First-time buyers in England and Northern Ireland benefit from a higher nil-rate threshold. The first £425,000 of a purchase price attracts 0% SDLT, and the rate of 5% applies on the portion between £425,001 and £625,000. Above £625,000, the standard rates apply in full with no first-time buyer relief.",
          "To qualify, both buyers must be first-time buyers - a couple where one partner has previously owned property does not qualify. The relief applies to purchases of a single residential property intended as the buyer's main residence. Buy-to-let purchases by first-time buyers do not qualify.",
          "Multiple Dwellings Relief (MDR) was abolished in June 2024 for transactions completing on or after 1 June 2024. MDR previously allowed buyers purchasing multiple residential properties in a single transaction to calculate SDLT on the average price per dwelling rather than the total price, which could reduce the liability significantly on portfolio purchases or transactions involving flats with ancillary dwellings. Its removal increases the SDLT cost on these transactions materially, and structures that previously relied on MDR need to be reconsidered.",
        ],
      },
      {
        heading: "Company Purchases, Mixed-Use Claims, and Other Planning Considerations",
        paragraphs: [
          "Companies purchasing residential properties worth £500,000 or more face an additional levy: the Annual Tax on Enveloped Dwellings (ATED), which is a separate annual charge. Residential properties held through companies - 'enveloped dwellings' - face ATED charges ranging from approximately £4,150 per year for properties valued at £500,000–£1m, to over £244,000 per year for properties worth more than £20m.",
          "The 15% flat SDLT rate applies where a company buys a single residential property worth over £500,000 in a single transaction. This is specifically designed to discourage enveloping residential property in corporate structures. However, there are exemptions for genuine property development, property trading, and portfolio landlords meeting certain conditions. Any company purchasing residential property above this threshold should take specific SDLT advice before exchange.",
          "Mixed-use claims remain a legitimate planning consideration for properties that include both residential and non-residential elements - a farmhouse with agricultural buildings, a property above commercial premises, or a residential property with a planning condition permitting commercial use. If a successful mixed-use claim can be made, the non-residential SDLT rates apply to the whole transaction, often saving tens of thousands of pounds. However, HMRC has challenged aggressive mixed-use claims and there is a body of case law defining the boundaries. Seek specialist advice rather than assuming a claim will succeed.",
        ],
        bullets: [
          "Companies buying single residential properties over £500,000: flat 15% rate may apply",
          "ATED applies annually to residential properties held in companies over £500,000",
          "Mixed-use claims apply non-residential rates to the whole transaction",
          "MDR abolished June 2024 - portfolio purchases now calculated on full price",
          "LTT in Wales and LBTT in Scotland have different rate tables - verify which regime applies",
        ],
      },
    ],
  },
};
