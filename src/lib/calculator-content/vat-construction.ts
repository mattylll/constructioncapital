import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the VAT on Construction Calculator Works",
    paragraphs: [
      "VAT treatment on construction work in the UK is notoriously complex. Unlike most goods and services, construction is not uniformly taxed at the standard 20% rate — it can be zero-rated, reduced-rated at 5%, or standard-rated depending on the type of work, the property's history, and who is doing the work. Getting it wrong means either overpaying VAT (which may be irrecoverable) or underpaying (which creates a VAT debt with HMRC).",
      "This calculator helps you estimate the VAT liability on a construction project by identifying which portions of the work fall into each rate category. Enter the project type — new residential build, conversion from commercial use, renovation of a long-empty property, or repair and maintenance — along with the estimated build cost, and the calculator applies the appropriate rate to each element.",
      "For mixed-rate projects — for example, a development that includes new-build units and conversion of an existing structure — you must apportion the costs between the different rate categories. The calculator allows you to enter costs for each element separately so the correct rate is applied to each.",
      "This tool produces estimates only. VAT on construction is a specialist area where the rules interact in complex ways and where incorrect treatment can trigger HMRC enquiries. Always confirm the VAT position with a VAT specialist or your accountant before committing to a project budget or pricing a build contract.",
    ],
  },
  guide: {
    title: "VAT on Construction: Zero-Rated, Reduced Rate, and Standard Rate Explained",
    sections: [
      {
        heading: "Zero-Rated New Builds: The Most Valuable VAT Relief",
        paragraphs: [
          "Construction of a new dwelling — a house, flat, or other residential building where no residential structure previously existed — is zero-rated for VAT purposes. This means the main contractor charges 0% VAT on their labour and materials, the developer does not pay VAT on the construction cost, and the zero-rating flows through to the first sale of the dwelling, which is also VAT-exempt.",
          "Zero-rating is one of the most significant tax reliefs available to residential developers. On a £2m build cost, the difference between zero-rating and standard 20% VAT is £400,000 — a figure that changes the entire economics of a scheme. It is therefore essential to confirm at the outset that the project qualifies for zero-rating rather than assuming it does.",
          "The conditions for zero-rating are specific. The building must be designed as a dwelling, meaning it must have self-contained living accommodation. Student accommodation, care homes, and certain other institutional uses are zero-rated but under different rules. The property must not have been used as a dwelling previously — conversion of a building with residential history does not qualify for the same zero rate as a true new build, though it may qualify for the 5% reduced rate.",
          "Importantly, zero-rating applies to the contractor's supply of construction services, not necessarily to all materials. If the developer is directly purchasing materials and supplying them to a contractor (a 'materials supply arrangement'), the VAT treatment of the materials depends on their classification. Most standard building materials purchased for zero-rated construction can be reclaimed if the developer is VAT-registered, but the mechanics differ from the straightforward zero-rating of a build contract.",
        ],
        bullets: [
          "New residential builds: 0% VAT on construction services",
          "First sale of new-build dwelling: exempt from VAT (not zero-rated — an important distinction)",
          "Developer can recover VAT on professional fees and other costs via VAT return",
          "Non-residential new builds (offices, shops): standard 20% rate applies",
          "Qualifying conversions to residential: 5% reduced rate (not zero) — see below",
        ],
      },
      {
        heading: "The 5% Reduced Rate: Conversions and Long-Empty Properties",
        paragraphs: [
          "The 5% reduced rate applies to two main categories of construction work: the conversion of a non-residential building to residential use, and renovation of a residential property that has been empty for two or more years. This is a significant concession but falls short of full zero-rating — on a £1m conversion, the difference is £50,000 in VAT cost versus zero-rating.",
          "Conversions qualifying for the 5% rate include office-to-residential (including Permitted Development conversions), commercial-to-residential, barn conversions, and change of use from any non-dwelling purpose to residential. The rate applies to the labour element of the conversion work; materials that become incorporated into the building are also 5%, but fittings and furniture are standard-rated. A mixed-rate bill from a contractor is common on conversions.",
          "The long-empty residential rule — sometimes called the 'two-year empty' relief — allows the 5% rate on renovation of a property that has been empty for at least two years immediately before the work begins. HMRC requires evidence of the empty period, typically council tax records showing an empty property status or written confirmation from the local authority. Properties empty for less than two years do not qualify; standard 20% applies to repair and renovation of occupied properties.",
          "Changing the number of dwellings is also relevant to VAT. Converting a single house into multiple flats, or multiple flats back into a single house, attracts the 5% rate on the conversion work — irrespective of whether the properties have been empty. This can make flat conversions materially cheaper than standard renovation in VAT terms.",
        ],
        bullets: [
          "Non-residential to residential conversions: 5% reduced rate",
          "Residential empty for 2+ years: 5% reduced rate on renovation",
          "Single dwelling to multiple or vice versa: 5% on conversion work",
          "Materials incorporated into the building: 5% on qualifying conversions",
          "Fittings, appliances, and furniture: always 20% regardless of project type",
        ],
      },
      {
        heading: "Standard Rate, Domestic Reverse Charge, and When to Register",
        paragraphs: [
          "Repairs, maintenance, and renovation of occupied residential properties attract the standard 20% VAT rate. There are no exceptions: replacing a roof on an occupied house, decorating, installing a kitchen — all standard-rated. Homeowners cannot reclaim this VAT unless they are using the DIY Housebuilders Scheme (see below). Developers carrying out repairs on properties prior to sale may be able to reclaim if they are VAT-registered and the ultimate sale is taxable, but the chain of logic must be established carefully.",
          "The Domestic Reverse Charge (DRC) for construction services has been in force since March 2021. Under the DRC, when a VAT-registered subcontractor supplies construction services to a VAT-registered contractor (the main contractor or a higher-tier subcontractor), the subcontractor does not charge VAT. Instead, the contractor 'self-accounts' for the VAT — effectively paying and reclaiming it simultaneously on their own VAT return, with no cash changing hands. The DRC was introduced to tackle VAT fraud in the construction supply chain.",
          "For developers using subcontractors directly, the DRC may apply depending on the supply chain structure. If you are the end client receiving the building and you are not yourself making a supply of construction services (i.e., you are a developer selling completed dwellings), you are outside the DRC — your contractors charge you VAT in the normal way. The DRC only applies to supplies between businesses within the construction supply chain, not to the final supply to the developer.",
          "VAT registration becomes compulsory when taxable supplies exceed £90,000 in a rolling 12-month period (the current threshold as of 2024/25). Most property developers should register voluntarily well before this threshold if they intend to recover VAT on costs. Zero-rated sales count as taxable supplies for registration purposes, so a developer making only zero-rated new-build sales is making taxable supplies and can register. Registration opens the ability to recover input VAT on professional fees, surveys, and other costs incurred before any sales.",
        ],
        bullets: [
          "Occupied residential repairs and maintenance: 20% standard rate, no exceptions",
          "Domestic Reverse Charge: applies between VAT-registered construction businesses",
          "Developers as end clients are outside the DRC — normal VAT applies",
          "VAT registration threshold: £90,000 of taxable supplies in 12 months",
          "Voluntary registration: strongly recommended for developers to recover input VAT",
        ],
      },
      {
        heading: "The DIY Housebuilders Scheme and VAT on Professional Fees",
        paragraphs: [
          "Individual self-builders who construct or convert a property for their own use (not for sale) can reclaim VAT on building materials through HMRC's DIY Housebuilders Scheme. This is a one-time claim submitted after the building is complete, using form VAT431NB (new builds) or VAT431C (conversions). The scheme allows non-VAT-registered individuals to reclaim VAT as if they were a registered business — a significant cash benefit for self-builders who would otherwise have no recovery mechanism.",
          "The scheme is available for new-build dwellings and for conversions from non-residential to residential use. It does not apply to renovation of existing residential properties, extensions, or repairs. The claim must be submitted within three months of the building receiving its completion certificate or sign-off, and late claims are refused. Keep all VAT receipts from day one — HMRC requires original invoices, not copies.",
          "VAT on professional fees — architect, structural engineer, planning consultant, project manager — is always charged at the standard 20% rate regardless of the VAT rate applicable to the construction work. This is a common surprise for developers on zero-rated new-build projects who assume zero-rating applies across all project costs. A VAT-registered developer can recover this VAT on their VAT return; an unregistered individual or company cannot, making registration highly advantageous on any project with significant professional fee spend.",
        ],
        bullets: [
          "DIY Housebuilders Scheme: one-time VAT reclaim for self-builders and converters",
          "Claim deadline: 3 months after completion — no late claims accepted",
          "Professional fees always attract 20% VAT regardless of project type",
          "VAT-registered developers can reclaim professional fee VAT on their return",
          "Retain all original VAT invoices from project inception for reclaim purposes",
        ],
      },
    ],
  },
};
