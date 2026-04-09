import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How Church and Chapel Conversions Work",
    paragraphs: [
      "Church and chapel conversions represent some of the most architecturally distinctive and financially complex projects in the UK residential conversion market. The combination of unusual structural characteristics — wide-span nave roofs, high eaves, deep-set foundations, and Gothic or Nonconformist masonry — with listed building status, heritage constraints, and the community significance of a former place of worship creates a risk profile that demands specialist appraisal, experienced contractors, and lenders with genuine appetite for unusual assets.",
      "The financial case for church conversions rests on the dramatic spatial qualities that these buildings offer — double-height volumes, dramatic roof structures, stained glass — which command a premium in the residential market compared to standard new-build equivalents. A well-executed church conversion in a sought-after location can achieve £300–£600 per square foot in sales value, significantly above the cost of conversion. However, the cost base is also elevated: heritage contractors, bespoke joinery to match original details, specialist bat and structural surveys, and the extended timeline of listed building consent all inflate the total project cost.",
      "The calculator models the church conversion appraisal by capturing the gross internal area of the building, the proposed unit mix (church buildings often lend themselves to a small number of larger, premium units rather than many smaller ones), the build cost per square foot (typically £200–£350/sqft for a complex heritage conversion), and the target sales values. It also captures acquisition cost — which for redundant churches is often set by the diocesan body or the Churches Conservation Trust at a level that reflects the building's community history as well as its commercial potential.",
      "Finance for church conversions requires specialist lenders: most high-street development finance providers are uncomfortable with listed buildings, unusual structural configurations, and the heritage consent process. A small number of lenders — primarily challenger banks and specialist property finance houses — have developed genuine expertise in heritage conversions and can provide development finance at 60–70% of project costs against confirmed listed building consent and a robust RICS valuation.",
    ],
  },
  guide: {
    title: "Church and Chapel Conversions: Heritage, Planning, and Finance Guide",
    sections: [
      {
        heading: "Listed Building Consent and Heritage Considerations",
        paragraphs: [
          "The majority of Anglican churches in England are listed buildings — most are Grade I or Grade II* listed, reflecting their architectural or historic significance. Nonconformist chapels (Methodist, Baptist, Congregational) are more frequently Grade II listed, though many notable examples carry higher designations. Listed building consent (LBC) is required in addition to planning permission (or prior approval) for any works to a listed building that affect its character as a building of special architectural or historic interest. This includes internal works — inserting new floors, creating partitions, removing pews or other historic fixtures — as well as external alterations.",
          "The LBC process is initiated by submitting an application to the local planning authority alongside, or separately from, any planning application. The LPA must consult Historic England for any application affecting a Grade I or Grade II* listed building. For Grade II buildings, the council's conservation officer is the primary decision-maker, though Historic England may still be a statutory consultee depending on the nature of the works. The LBC application must be supported by a heritage impact assessment, prepared by a qualified heritage consultant, that explains the significance of the building's special interest and demonstrates that the proposed conversion preserves, rather than harms, that significance.",
          "Key heritage considerations in church conversions include: the treatment of the original roof structure (inserting new mezzanine floors below a hammerbeam or king-post roof is generally acceptable if reversible; cutting into the roof itself is contentious), the retention of significant fixtures (stained glass windows are usually required to be retained in situ or rehoused within the building), the specification of new internal materials (lime plaster rather than gypsum, natural stone floors where original, timber windows matching original profiles), and the legibility of the original building form from the exterior.",
        ],
        bullets: [
          "LBC requirement: any works affecting the character of a listed building require listed building consent — this is a criminal offence to carry out without",
          "Ecclesiastical exemption: Church of England churches in active use are exempt from listed building control under the Ecclesiastical Exemption, but this exemption does not apply once the building is sold for non-ecclesiastical use",
          "Historic England consultation: mandatory for Grade I and II* listed buildings; Historic England has objection powers that carry significant weight with the LPA",
          "Planning conditions: LBC is typically granted with conditions requiring method statements, materials samples approval, and a watching brief by a heritage archaeologist",
          "Heritage impact assessment: required for all LBC applications; should be prepared by a consultant on the Chartered Institute for Archaeologists (CIfA) or IHBC (Institute of Historic Building Conservation) register",
          "Reversibility: proposals that are physically reversible — allowing future generations to undo the changes — are viewed most favourably by heritage bodies",
        ],
      },
      {
        heading: "Bat Surveys and Ecological Requirements",
        paragraphs: [
          "Bats are the single most significant ecological consideration in church and chapel conversions. All 18 species of bat found in the UK are protected under the Wildlife and Countryside Act 1981 (as amended) and the Conservation of Habitats and Species Regulations 2017. It is a criminal offence to intentionally or recklessly kill, injure, or disturb a bat, or to damage, destroy, or obstruct access to any structure or place used for shelter or protection by bats. This protection applies year-round and regardless of whether bats are currently present.",
          "Churches are disproportionately important roosting habitats for bats in the UK. The roof voids, tower spaces, and belfries of historic churches provide year-round roost opportunities for multiple species — particularly lesser horseshoe bats, brown long-eared bats, and pipistrelle species. The Bat Conservation Trust (BCT) Guidelines for Bats and Ecclesiastical Buildings (updated 2023) is the primary reference document for surveyors assessing church roosts, and Natural England's Standing Advice for bats applies to any planning application where bats may be affected.",
          "The bat survey process for a church conversion typically begins with a preliminary roost assessment (PRA) by a licensed bat ecologist, followed — where evidence of roost use is found — by emergence and re-entry surveys conducted between April and October. For complex roosts with multiple species, surveys may need to be repeated over two seasons to characterise peak roost use. A European Protected Species (EPS) mitigation licence from Natural England is required before any works affecting a bat roost can commence. The licence application must demonstrate that there is no satisfactory alternative to the works, that the works do not harm the conservation status of the species at population level, and that adequate mitigation (replacement roost features integrated into the conversion design) is provided.",
        ],
        bullets: [
          "Preliminary roost assessment: first step — should be commissioned before planning application is submitted; cost typically £500–£1,500",
          "Emergence surveys: dusk and pre-dawn surveys required; at least three surveys per season for buildings with evidence of roost use",
          "Survey season: April–October for most species; lesser horseshoe surveys may need to extend into hibernation checks (November–March)",
          "EPS licence timeline: Natural England's target determination period is 30 working days; complex applications may take longer — factor into programme",
          "Mitigation features: bat boxes, integrated roost bricks, and undisturbed loft spaces are typical mitigation measures — design these in from the outset rather than adding after planning",
          "Bat-sensitive lighting: low-lux, warm-tone (2700K or lower) external lighting specification required to avoid light spill onto bat flight lines and roost entrances",
        ],
      },
      {
        heading: "Structural Challenges and Cost Premiums",
        paragraphs: [
          "The structural characteristics of church buildings present challenges that are distinct from those of commercial or residential conversion projects. The primary challenge is the wide-span nave: a typical parish church nave is 8–12 metres wide, often spanning without intermediate columns, and covered by a timber or stone roof structure that may be 600–800 years old. Creating habitable floor area within this volume — whether through mezzanine insertion, ground-floor conversion with retained open volume above, or a combination — requires structural engineering solutions that must be sympathetically integrated with the historic fabric.",
          "Damp is a pervasive problem in historic church buildings. Stone and brick masonry, particularly below the damp-proof course level (which pre-Victorian churches often lack entirely), acts as a sponge for ground moisture, and the sustained low occupancy and heating of a redundant church typically allows latent damp to become active. A thorough damp investigation — including rising damp assessment, lateral damp from ground levels, penetrating damp through the roof and external walls, and condensation risk modelling — is essential before conversion works begin. Remediation can range from simple drainage improvement to full lime render replacement and tanking of below-ground vaults.",
          "Leadwork, stonework, and stained glass are the three material categories most likely to generate cost surprises in a church conversion. Lead roofs and flashings require specialist heritage contractors; lead theft (a persistent problem in churches) may mean the existing lead has already been replaced with cheaper felt or fibreglass, which itself needs replacing to an acceptable standard. Stonework repairs — repointing, indenting, or replacing carved stone details — are highly skilled, time-consuming, and expensive. Stained glass windows may need specialist conservation, particularly if Historic England or the LPA requires them to be retained rather than relocated.",
        ],
        bullets: [
          "Wide-span structural design: a structural engineer experienced in historic masonry is essential — standard residential structural consultants frequently lack the knowledge to assess Gothic or Romanesque construction",
          "Damp investigation: commission a specialist independent damp survey, not a damp-proofing contractor — the latter have a commercial interest in recommending their own products",
          "Leadwork: heritage lead specification (Code 5 or Code 6 minimum) required for replacement leadwork on listed buildings — budget £80–£120/sqm for lead roofing",
          "Stained glass: specialist conservation can cost £500–£2,000+ per panel; if windows are to be relocated within the building, custom internal frames add further cost",
          "Foundations: many historic churches have shallow footings on variable ground; structural investigation trenches or ground-penetrating radar survey before design commences",
          "Typical build cost range: £200–£350/sqft for a complex church conversion; higher for Grade I or II* listed buildings with extensive heritage material requirements",
        ],
      },
      {
        heading: "Planning Gain, Community Assets, and Finance for Unusual Properties",
        paragraphs: [
          "Church buildings — particularly those in prominent town centre or village locations — often carry community significance that shapes the planning negotiation. Many redundant churches are registered as Assets of Community Value (ACVs) under the Localism Act 2011, which grants local groups a six-month right to bid for the asset before it can be sold. Even where an ACV listing does not prevent the sale, it signals community interest and may result in the LPA seeking planning obligations (Section 106 agreements) that secure community benefit as a condition of residential consent.",
          "The community asset dimension of church conversions can, however, be turned to planning advantage. Where a developer offers to retain a community meeting space, a crèche, or cultural venue within the converted building — typically in the nave or chancel while residential units occupy side aisles, galleries, or a new-build extension — the LPA may be more positively disposed to the overall scheme. Planning gain of this nature is not free: community uses generate no residential revenue and must be factored into the appraisal as a cost (fit-out and retained void) or as a traded benefit in the Section 106 negotiation.",
          "Finance for church and chapel conversions requires lenders who understand the extended timelines and specialist risk profile of heritage projects. The LBC process typically adds 3–6 months to the pre-construction programme compared to a standard development, and the construction phase is likely to take longer than an equivalent-sized new-build due to the sequential nature of heritage works and the restricted availability of specialist contractors. Lenders willing to finance church conversions will typically require: full LBC and planning consent before first drawdown, an independent QS cost report prepared by a surveyor with heritage experience, a structural engineer's report, bat surveys with EPS licence (or confirmation that no bats are present), and an RICS Red Book valuation of both the Day 1 existing value and the completed GDV.",
        ],
        bullets: [
          "ACV listing: check the local authority's ACV register before exchange; if listed, the six-month moratorium on community right to bid must pass before completion can occur",
          "Section 106: LPAs frequently seek affordable housing contributions, community facility provision, or public access obligations as conditions of residential consent for church conversions",
          "New-build extensions: sensitively designed contemporary extensions to church buildings can significantly increase GDV by adding gross floor area — but require careful heritage impact assessment",
          "Planning appeal: if LBC or planning is refused, appeal to the Planning Inspectorate is available; heritage appeals are complex and specialist advocacy is essential",
          "Lender finance terms for church conversions: 60–65% LTPC, 12–24 month terms (longer than standard), interest retained or rolled — expect a lender arrangement fee of 1.5–2.5%",
          "Development exit finance: specialist lenders who have financed the conversion may also offer exit finance (residential investment loans) if the completed units are to be retained as rental income",
        ],
      },
    ],
  },
};
