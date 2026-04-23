import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import {
  CTAButton,
  EditorialSection,
  Eyebrow,
  PageHero,
  ProseSection,
  RelatedGrid,
  SectionHeader,
  StatStrip,
} from "@/components/editorial/primitives";
import { JsonLd } from "@/components/ui/json-ld";
import { SITE_NAME, SITE_URL, CONTACT } from "@/lib/constants";
import { SERVICES } from "@/lib/services";
import { getGuidesByService } from "@/lib/guides";
import { getReportByCountySlug } from "@/lib/market-reports";
import { countyNameToSlug, loanTypeToServiceSlug } from "@/lib/location-content";

// Extended case study data including challenge/solution/outcome narratives.
// The shared src/lib/case-studies.ts has the summary; this file keeps the
// long-form detail used on /case-studies/[slug].
const caseStudies = [
  {
    slug: "residential-scheme-manchester",
    title: "12-Unit Residential Scheme",
    location: "Manchester",
    county: "Greater Manchester",
    projectType: "Ground-Up Development",
    gdv: "£3.2M",
    loanAmount: "£2.1M",
    loanType: "Development Finance",
    ltv: "65% LTGDV",
    description:
      "Structured senior debt for a ground-up residential scheme in South Manchester. Planning secured for 12 apartments across two blocks.",
    challenge:
      "The developer had full planning permission for 12 apartments across two blocks in South Manchester but faced difficulties securing funding at competitive rates. Several high-street lenders had declined due to the developer's limited track record with schemes of this scale, despite having successfully completed smaller projects. The tight timeline — with planning permission due to lapse within 18 months — added urgency to the funding requirement.",
    solution:
      "We approached our specialist development finance panel, presenting the scheme's strong fundamentals: excellent location near transport links, competitive build costs from a reputable contractor, and strong comparable evidence supporting the GDV. By structuring the facility with a phased drawdown aligned to build milestones, we secured terms from a specialist lender comfortable with the developer's experience level. The facility included a day-one land drawdown of 60% LTV against the site value.",
    outcome:
      "Funding was secured within 3 weeks of initial enquiry. The developer drew down the full facility over 14 months, completing the scheme on time and within budget. All 12 units were sold off-plan prior to completion, achieving a blended GDV 8% above initial appraisal. The developer has since returned for funding on two further schemes.",
    isFeatured: true,
    publishedAt: "2024-08-15",
  },
  {
    slug: "mixed-use-conversion-birmingham",
    title: "Mixed-Use Conversion",
    location: "Birmingham",
    county: "West Midlands",
    projectType: "Heavy Refurbishment",
    gdv: "£5.8M",
    loanAmount: "£4.2M",
    loanType: "Development + Mezzanine",
    ltv: "85% of Costs",
    description:
      "Combined senior and mezzanine structure for a commercial-to-residential conversion in Birmingham city centre. 24 apartments over ground-floor retail.",
    challenge:
      "An experienced developer identified a former office building in Birmingham's Jewellery Quarter with permitted development rights for conversion to 24 residential units, retaining the ground floor for commercial use. The total project cost of £4.9M required leverage beyond what a single senior lender would provide. The developer had equity of approximately £750K — enough for a 65% LTC senior facility but insufficient to cover the full costs without additional funding.",
    solution:
      "We structured a dual-tranche capital stack: a senior development facility at 65% of costs from a mainstream specialist lender, topped up with a mezzanine facility from a separate provider to bring total leverage to 85% of costs. The mezzanine was structured as a profit-share arrangement, aligning the funder's interests with the developer. Both facilities were co-ordinated with a single monitoring surveyor to minimise friction during the build phase.",
    outcome:
      "The combined facility of £4.2M was drawn down over 16 months. The conversion was completed to a high specification, with the 24 apartments achieving rents 12% above initial projections. The developer retained the asset, refinancing onto a long-term BTL portfolio facility, repaying both the senior and mezzanine lenders in full. Net developer profit after all finance costs exceeded £800K.",
    isFeatured: true,
    publishedAt: "2024-06-20",
  },
  {
    slug: "auction-purchase-london",
    title: "Auction Purchase & Refurb",
    location: "London",
    county: "Greater London",
    projectType: "Bridging + Refurbishment",
    gdv: "£1.8M",
    loanAmount: "£1.1M",
    loanType: "Bridging Loan",
    ltv: "70% LTV",
    description:
      "Rapid bridging finance for an auction purchase in Hackney. Funds drawn within 14 days to meet auction completion deadline, then refinanced into refurbishment facility.",
    challenge:
      "The borrower won a property at auction in Hackney, East London, for £850K — significantly below the estimated market value of £1.1M. However, the property required substantial refurbishment (estimated £350K) before it could be sold or refinanced. The 28-day auction completion deadline meant traditional lender timelines were not feasible. The borrower needed certainty of completion to avoid losing the deposit.",
    solution:
      "We arranged a regulated bridging loan within 14 days, funding 70% of the purchase price on day one. The valuer confirmed the open market value at £1.05M, supporting the LTV at completion. We pre-arranged a refurbishment exit facility with a separate lender, ensuring the borrower had a clear path from acquisition through to the completed, refinanced asset. Both facilities were documented in parallel to minimise dead time between drawdowns.",
    outcome:
      "The auction purchase completed on day 12 — well within the deadline. The refurbishment facility was drawn down 4 weeks later, with works completed in 5 months. The finished property was valued at £1.8M, and the borrower refinanced onto a long-term residential mortgage at 60% LTV. Total profit after all costs and finance charges: approximately £420K.",
    isFeatured: false,
    publishedAt: "2024-04-10",
  },
  {
    slug: "jv-residential-bristol",
    title: "JV Equity Partnership",
    location: "Bristol",
    county: "Bristol",
    projectType: "Equity & Joint Venture",
    gdv: "£8.5M",
    loanAmount: "£6.8M",
    loanType: "Equity JV + Senior Debt",
    ltv: "100% of Costs",
    description:
      "Introduced a family office equity partner to fund 100% of project costs for a 30-unit scheme. Developer contributed land only, retaining 60% of profits.",
    challenge:
      "A developer with an excellent track record owned a prime site in Bristol with full planning for 30 residential units. The GDV was appraised at £8.5M with total development costs of £6.8M. However, the developer's capital was tied up in two existing projects and they had no available equity to contribute beyond the land value. No senior lender would fund 100% of costs without the developer putting in cash equity alongside.",
    solution:
      "We introduced a family office from our equity partner network willing to provide 100% of the development costs as a JV equity investment, with the developer contributing the land (valued at £1.7M) as their equity stake. The structure gave the developer 60% of net profits in exchange for managing the project, with the family office receiving 40% plus a preferred return of 8% per annum. We also sourced a senior debt facility at 55% LTGDV to gear the JV, reducing the family office's cash outlay.",
    outcome:
      "The 30-unit scheme was completed in 22 months. Sales achieved a blended GDV of £9.1M — 7% above the original appraisal. After repaying the senior lender and the family office (including preferred return), the developer's net profit share exceeded £1.2M on a project where they contributed no cash. The family office has since committed to a further two projects with the same developer.",
    isFeatured: true,
    publishedAt: "2024-02-28",
  },
  {
    slug: "hmo-conversion-leeds",
    title: "HMO Conversion Project",
    location: "Leeds",
    county: "West Yorkshire",
    projectType: "Refurbishment",
    gdv: "£950K",
    loanAmount: "£620K",
    loanType: "Refurbishment Finance",
    ltv: "75% LTV",
    description:
      "Refurbishment finance for converting a large Victorian property into a licensed 8-bed HMO near Leeds University. Completed in 5 months.",
    challenge:
      "An investor purchased a large Victorian property near Leeds University for £480K, planning to convert it into a licensed 8-bed HMO. The refurbishment budget was £140K, covering structural works, fire safety compliance, ensuite bathrooms, and a commercial kitchen. Several lenders declined due to the HMO licensing requirements and the complexity of achieving the mandatory Article 4 direction compliance in the local authority area.",
    solution:
      "We identified a specialist HMO lender from our panel who understood the Leeds student market and Article 4 requirements. The facility was structured as a light refurbishment bridge at 75% of purchase price, with the refurbishment costs rolled into the facility and drawn against surveyor-verified stage completions. We also pre-arranged a long-term HMO mortgage for the exit, ensuring the investor had rate certainty from day one.",
    outcome:
      "The refurbishment was completed in 5 months, on budget. The property was valued at £950K on completion as a fully licensed 8-bed HMO, achieving a gross annual rental income of £62K. The investor refinanced onto the pre-arranged HMO mortgage at 75% LTV, releasing their initial equity plus an additional £90K in capital to fund their next project.",
    isFeatured: false,
    publishedAt: "2024-01-15",
  },
  {
    slug: "commercial-acquisition-edinburgh",
    title: "Office Block Acquisition",
    location: "Edinburgh",
    county: "Edinburgh",
    projectType: "Commercial Mortgage",
    gdv: "£4.2M",
    loanAmount: "£2.9M",
    loanType: "Commercial Mortgage",
    ltv: "70% LTV",
    description:
      "Long-term commercial mortgage for acquiring a multi-tenanted office building in Edinburgh's financial district. 15-year fixed rate secured.",
    challenge:
      "A property company sought to acquire a multi-tenanted office building in Edinburgh's financial district for £4.2M. The building had 6 tenants on various lease lengths (2–8 years remaining), with a WAULT of 4.3 years. The occupancy rate was 85%, with one floor vacant. High-street banks were cautious due to the mixed lease profile and the vacancy void, offering terms at higher margins than the borrower's target.",
    solution:
      "We approached specialist commercial mortgage lenders who took a more nuanced view of the tenancy schedule. By presenting a detailed income analysis — including the reversionary potential of the vacant floor and strong comparable evidence for office rents in the area — we secured a 15-year fixed-rate facility at 70% LTV. The lender allowed the vacant floor to be excluded from the income covenant calculation for the first 12 months, giving the borrower time to let the space.",
    outcome:
      "The acquisition completed within 6 weeks. The borrower let the vacant floor within 4 months of completion at a rent 15% above the assumed ERV, bringing the building to full occupancy. The 15-year fixed rate of 5.2% gave the borrower long-term certainty, and the asset's net yield post-finance exceeded 7.8%. The borrower is now exploring further acquisitions in the Edinburgh market.",
    isFeatured: false,
    publishedAt: "2023-11-20",
  },
];

function getCaseStudy(slug: string) {
  return caseStudies.find((cs) => cs.slug === slug) ?? null;
}

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return { title: "Case Study Not Found" };

  return {
    title: `${cs.title} - ${cs.location}`,
    description: cs.description,
    openGraph: {
      title: `${cs.title} - ${cs.location} | ${SITE_NAME}`,
      description: cs.description,
      url: `${SITE_URL}/case-studies/${cs.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${cs.title} - ${cs.location} | ${SITE_NAME}`,
      description: cs.description,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const relatedStudies = caseStudies
    .filter((s) => s.slug !== cs.slug)
    .slice(0, 3);

  const countySlug = countyNameToSlug(cs.county);
  const locationSlug = cs.location.toLowerCase().replace(/\s+/g, "-");
  const serviceSlug = loanTypeToServiceSlug(cs.loanType);
  const service = serviceSlug
    ? SERVICES.find((s) => s.slug === serviceSlug)
    : null;
  const relatedGuides = serviceSlug ? getGuidesByService(serviceSlug, 3) : [];
  const countyReport = getReportByCountySlug(countySlug);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Case Studies", href: "/case-studies" },
    { label: cs.title },
  ];

  const exploreLinks: { label: string; href: string }[] = [
    {
      label: `Development finance in ${cs.county}`,
      href: `/locations/${countySlug}`,
    },
    {
      label: `${cs.location} property market`,
      href: `/locations/${countySlug}/${locationSlug}`,
    },
  ];
  if (service) {
    exploreLinks.push({
      label: service.name,
      href: `/services/${service.slug}`,
    });
  }
  if (serviceSlug) {
    exploreLinks.push({
      label: `${cs.loanType} in ${cs.location}`,
      href: `/locations/${countySlug}/${locationSlug}/${serviceSlug}`,
    });
  }
  if (countyReport) {
    exploreLinks.push({
      label: `${cs.county} market report`,
      href: `/market-reports/${countyReport.slug}`,
    });
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: cs.title,
          description: cs.description,
          datePublished: cs.publishedAt,
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbItems.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            item: item.href
              ? `${SITE_URL}${item.href}`
              : `${SITE_URL}/case-studies/${cs.slug}`,
          })),
        }}
      />

      <PageHero
        tone="paper"
        breadcrumbs={breadcrumbItems}
        eyebrow={`${cs.projectType} · ${cs.location}`}
        title={cs.title}
        deck={cs.description}
      />

      {/* Key metrics strip — full-bleed hero numbers */}
      <section className="relative" style={{ background: "var(--paper)" }}>
        <div className="mx-auto max-w-[1360px] px-6 sm:px-10">
          <StatStrip
            tone="paper"
            items={[
              { label: "GDV", value: cs.gdv },
              { label: "Facility", value: cs.loanAmount },
              { label: "Structure", value: cs.ltv },
            ]}
          />
        </div>
      </section>

      {/* Challenge / Solution / Outcome — editorial prose trio */}
      <EditorialSection tone="paper">
        <div className="space-y-20">
          <ProseSection title="The challenge">
            <p>{cs.challenge}</p>
          </ProseSection>
          <ProseSection title="Our solution">
            <p>{cs.solution}</p>
          </ProseSection>
          <ProseSection title="The outcome">
            <p>{cs.outcome}</p>
          </ProseSection>
        </div>
      </EditorialSection>

      {/* Explore / cross-links */}
      <EditorialSection tone="stone">
        <SectionHeader
          tone="stone"
          eyebrow="Explore"
          title="Related coverage."
          body={`Other resources connected to this deal — the services, locations and market data behind a ${cs.projectType.toLowerCase()} like this one.`}
        />
        <div className="mt-12 flex flex-wrap gap-3">
          {exploreLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group inline-flex items-center gap-2 border px-5 py-2.5 text-[14px] transition-colors hover:bg-[oklch(0.75_0.12_85/0.06)]"
              style={{
                borderColor: "oklch(0.82 0.01 250)",
                color: "var(--navy-dark)",
                background: "var(--stone)",
              }}
            >
              {link.label}
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: "var(--gold-dark)" }}
              />
            </Link>
          ))}
        </div>
      </EditorialSection>

      {/* Related guides */}
      {relatedGuides.length > 0 && (
        <EditorialSection tone="paper">
          <SectionHeader
            tone="paper"
            eyebrow="Further reading"
            title="Guides on this product."
          />
          <div className="mt-12">
            <RelatedGrid
              tone="paper"
              items={relatedGuides.map((guide) => ({
                href: `/guides/${guide.slug}`,
                eyebrow: "Guide",
                title: guide.title,
                body: guide.excerpt,
                meta: `${guide.readingTime} read`,
              }))}
            />
          </div>
        </EditorialSection>
      )}

      {/* Related case studies */}
      {relatedStudies.length > 0 && (
        <EditorialSection tone="stone">
          <SectionHeader
            tone="stone"
            eyebrow="More case files"
            title="Related deals from the desk."
          />
          <div className="mt-12">
            <RelatedGrid
              tone="stone"
              items={relatedStudies.map((related) => ({
                href: `/case-studies/${related.slug}`,
                eyebrow: `${related.location} · ${related.projectType}`,
                title: related.title,
                body: related.description,
                meta: `${related.gdv} GDV`,
              }))}
            />
          </div>
        </EditorialSection>
      )}

      {/* CTA */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="Start a deal"
          title={
            <>
              Your scheme could be
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                the next case file.
              </span>
            </>
          }
          body="Send us the outline. We come back with indicative terms from the right lenders inside a working day."
        />
        <div className="mt-12 flex flex-wrap items-center gap-5">
          <CTAButton href="/deal-room" variant="gold" size="lg">
            Start a deal
          </CTAButton>
          <a
            href={`tel:${CONTACT.phoneRaw}`}
            className="numeral-tabular editorial-link inline-flex h-14 items-center text-lg font-medium tracking-tight"
            style={{ color: "oklch(1 0 0 / 0.95)" }}
          >
            Or call {CONTACT.phone}
          </a>
        </div>
      </EditorialSection>
    </>
  );
}
