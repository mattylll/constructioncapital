import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the Professional Fees Calculator Works",
    paragraphs: [
      "Every property development project requires a team of specialist consultants. Professional fees - paid to architects, engineers, surveyors, and project managers - are a material cost that must be budgeted accurately from the outset. Underestimating them is one of the most common reasons development appraisals prove optimistic once projects are underway.",
      "This calculator estimates professional fees based on your project type, build cost, and the consultants you need to appoint. Fees are typically expressed as a percentage of the construction cost (RICS convention) or as a fixed lump sum for smaller, well-defined scopes. The calculator uses percentage benchmarks derived from RICS guidance and current market practice to produce an indicative total.",
      "The list of consultants required depends on the complexity of your project. A straightforward residential new build above a certain threshold triggers CDM (Construction Design and Management) regulations, requiring a Principal Designer appointment. Schemes with complex structures need a structural engineer. Mechanical and electrical (M&E) consultants are needed on projects with significant services design. The calculator asks you to select the consultants you expect to need and applies the appropriate fee rate to each.",
      "These are estimates only. The actual fees you are quoted will depend on project complexity, the seniority of staff assigned, the number of planning iterations required, and the firm's location and reputation. Use this calculator to establish a reasonable budget at the appraisal stage; obtain formal fee proposals before exchange on your site.",
    ],
  },
  guide: {
    title: "Professional Fees in Property Development: Who You Need and What They Charge",
    sections: [
      {
        heading: "Architects: Fees, Scope, and Stages of Appointment",
        paragraphs: [
          "The architect is usually the lead consultant on a residential development project, responsible for the design, planning application, and construction information. RIBA (Royal Institute of British Architects) defines the architect's work in eight stages - from Stage 0 (Strategic Definition) to Stage 7 (In Use) - and fee proposals are typically structured around the stages that apply to your project.",
          "For new residential developments, you typically need Stages 1 to 4: preparation and briefing, concept design, developed design, and technical design. The construction phase (Stage 5) may or may not be covered depending on whether you need the architect to administer the build contract and carry out site inspections. Stages 6 and 7 are rarely needed unless your project has complex handover or post-occupancy requirements.",
          "Fees for architect services on residential development typically range from 7% to 15% of the construction cost. The wide range reflects the difference between a simple tract housing scheme where most design decisions are standardised, and a complex one-off custom build or historically sensitive scheme where design iterations are extensive. Luxury residential commands the higher end; volume housing builders often negotiate fixed fees or team rates below 7% given the repeat nature of the relationship.",
          "Planning applications add a dimension of uncertainty. If your first application is refused and you must appeal or redesign, the additional architect's time is typically charged at an hourly rate outside the original fixed fee. Budget a contingency of 15–20% of the architect's fee for planning iterations unless you have a high-confidence application with pre-application endorsement from the local planning authority.",
        ],
        bullets: [
          "Typical residential development: 7–12% of construction cost",
          "Complex or luxury schemes: up to 15% of construction cost",
          "Volume housing with repeat designs: potentially 5–7% negotiated",
          "Planning contingency: budget 15–20% of architect's fee for iterations",
          "Check that fee includes statutory services (building control drawings) or budget separately",
        ],
      },
      {
        heading: "Structural Engineer, QS, and Project Manager",
        paragraphs: [
          "The structural engineer is responsible for the design of the building's load-bearing structure: foundations, frame, floors, and roof. On straightforward timber-frame or masonry residential construction, structural engineering is relatively formulaic and fees are correspondingly modest - typically 1% to 2% of construction cost. More complex structures (steel frames, transfer structures, basement construction, or buildings with challenging ground conditions) push fees toward 3% or above.",
          "A quantity surveyor (QS) provides cost management services across the project lifecycle. At appraisal stage, the QS prepares an initial cost plan. During design, they produce detailed bills of quantities for tender. During construction, they carry out interim valuations, assess variations, and manage the contractor's final account. Fees for QS services on a mid-sized residential scheme typically range from 1.5% to 2.5% of construction cost. For developments requiring a monitoring surveyor appointed by a funder, this is a separate appointment (funded by the developer, acting for the lender).",
          "A project manager or employer's agent coordinates the professional team, manages the build programme, and administers the construction contract on the developer's behalf. On smaller schemes, the architect often fulfils this role. As schemes grow in complexity, a dedicated PM becomes essential. Project management fees typically run from 2% to 4% of construction cost, depending on the level of involvement required. Some developers handle project management in-house, particularly where they have experienced staff - this can save 2–3% of construction cost but requires genuine internal capability.",
        ],
        bullets: [
          "Structural engineer: 1–2% on standard schemes, up to 3%+ for complex structures",
          "Quantity surveyor: 1.5–2.5% of construction cost for full cost management service",
          "Project manager: 2–4% of construction cost for full-time PM involvement",
          "Monitoring surveyor (funder's): typically £3,000–£8,000 for a residential scheme, paid by developer",
          "Check whether roles overlap - architect as contract administrator may reduce need for separate PM",
        ],
      },
      {
        heading: "M&E Consultant, Planning Consultant, and CDM Principal Designer",
        paragraphs: [
          "A mechanical and electrical (M&E) consultant designs the building's services: heating, ventilation, plumbing, drainage, electrical systems, and telecommunications. For straightforward residential schemes with standard gas central heating and conventional electrical layouts, M&E design is often included within the architect's scope or carried out by the contractor's design team. As sustainability requirements increase - with SAP calculations, heat pump specifications, and EV charging becoming mandatory - specialist M&E input is increasingly valuable from early design stages.",
          "M&E fees on residential developments typically run from 1% to 3% of construction cost. Schemes with complex services - commercial elements, district heat networks, or significant mechanical plant - push toward the upper end. Part L of the Building Regulations (energy efficiency) and the Future Homes Standard (coming into force progressively) are driving greater M&E involvement earlier in the design process.",
          "A planning consultant advises on planning strategy, pre-application engagement, and the planning application itself. For developments on straightforward consented sites, a planning consultant may not be needed. For sites requiring a change of use, a complex Section 106 negotiation, or an appeal, specialist planning consultancy becomes essential. Planning consultants typically charge day rates of £150–£350, depending on seniority, or a project fee negotiated at the outset.",
          "CDM (Construction Design and Management) Regulations 2015 require a Principal Designer to be appointed on any project involving more than one contractor. The Principal Designer coordinates health and safety during the design phase and manages the pre-construction information. Many architects take on the Principal Designer role as part of their appointment; some prefer to separate it. Where the architect does not take on the CDM role, a specialist CDM coordinator must be appointed, typically at a cost of £2,000–£8,000 depending on project size.",
        ],
        bullets: [
          "M&E consultant: 1–3% of construction cost, increasing with sustainability requirements",
          "Planning consultant: day-rate £150–£350 or project fee - essential for complex planning",
          "CDM Principal Designer: often included in architect's fee; standalone cost £2,000–£8,000",
          "Ecologist and heritage consultant: needed for sites with protected species or listed buildings",
          "Flood risk assessor, transport planner: required by planning authorities on many applications",
        ],
      },
      {
        heading: "Total Professional Fees: Benchmarks and How to Budget",
        paragraphs: [
          "Adding up a full professional team on a residential development, a useful benchmark is that professional fees collectively represent 8–15% of the total construction cost, depending on project complexity. A straightforward new-build residential scheme on a cleared site with standard planning might attract 8–10%. A conversion project with complex planning, a heritage-sensitive site, and specialist engineering requirements could reach 12–15%.",
          "In a project appraisal, professional fees are typically included within the 'total development costs' figure. Lenders will expect to see a professional fees line in your cost plan, and a monitoring surveyor reviewing the budget will check that fees are adequately provided for. Underprovisioned professional fees are a red flag in credit assessments because they suggest a cost plan that has not been properly stress-tested.",
          "The most common mistake developers make with professional fees is budgeting only for design work and failing to include the full construction phase scope. Architect inspections, QS interim valuations, and PM site attendance all continue throughout the build period and their cost should be included in the original budget. A fee that looks reasonable for the design phase alone may be 50–70% of the full appointment cost.",
          "Seek fixed-fee proposals with clearly defined scopes wherever possible. Hourly rate appointments without a fee cap can escalate significantly if design iterations or planning delays extend the programme. RIBA recommends agreeing a scope of services document alongside the fee, so both parties understand exactly what is and is not included.",
        ],
        bullets: [
          "Total professional fees benchmark: 8–10% of construction cost for straightforward schemes",
          "Complex or sensitive schemes: 12–15% of construction cost",
          "Include full construction phase costs in the fee budget - not just design",
          "Seek fixed-fee proposals with defined scopes to manage cost certainty",
          "Allow contingency of 10–15% on professional fees for programme delays and scope changes",
        ],
      },
    ],
  },
};
