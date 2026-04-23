import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  CTAButton,
  EditorialSection,
  Eyebrow,
  PageHero,
  SectionHeader,
  StatStrip,
} from "@/components/editorial/primitives";
import { JsonLd } from "@/components/ui/json-ld";
import { CONTACT, SITE_NAME, SITE_URL, STATS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Matt Lenzie - Founder & Principal Broker",
  description:
    "Matt Lenzie has arranged over £500M in property development finance across 25+ years. Specialist in development finance, bridging loans, mezzanine finance and equity structuring for UK property developers.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

const specialisms = [
  {
    title: "Residential development",
    body:
      "New-build schemes from 4 to 200+ units, including affordable housing and Section 106 negotiations with planning authorities.",
  },
  {
    title: "Refurbishment & conversion",
    body:
      "Light and heavy refurbishment, HMO conversions, commercial-to-residential (Class MA/PDR), and listed building projects.",
  },
  {
    title: "Capital-stack structuring",
    body:
      "Senior debt, stretch senior, mezzanine, preferred equity and JV equity &mdash; structured as single or layered facilities to maximise developer returns.",
  },
  {
    title: "Nationwide coverage",
    body:
      "Active across every UK region with particular depth in London, the South East, the Midlands and the North West.",
  },
];

const values = [
  {
    title: "Deal-first mentality",
    body:
      "Every conversation starts with your specific deal. We don't waste time with generic advice or scripts &mdash; we model the stack and get on with it.",
  },
  {
    title: "Real lender relationships",
    body:
      "25+ years building relationships with credit committees across Matt's career, not submitting applications to LendingTree. Our lenders take our calls because we bring quality deals.",
  },
  {
    title: "Speed & precision",
    body:
      "Indicative terms within 24 hours. We know which lenders want what, so we don't waste weeks chasing the wrong fit. Precision saves you time and money.",
  },
  {
    title: "Transparent process",
    body:
      "No hidden fees, no surprises. You know every cost upfront. We earn our fee by delivering results, not by obscuring the process.",
  },
];

// Matt's personal career timeline. Construction Capital itself launched 2024
// as the formal vehicle for the practice; the earlier dates belong to Matt's
// career at prior property-finance institutions.
const milestones = [
  { year: "2000", event: "Matt enters property finance" },
  { year: "2008", event: "Navigated the financial crisis — zero client defaults" },
  { year: "2015", event: "£250M arranged cumulatively across Matt's career" },
  { year: "2020", event: "Nationwide coverage established" },
  {
    year: "2024",
    event: "Construction Capital launches as the formal brokerage vehicle",
  },
];

const processSteps = [
  {
    title: "Deal review",
    body:
      "We assess the scheme, borrower profile and funding requirement within 24 hours.",
  },
  {
    title: "Lender matching",
    body:
      "We identify the three-to-five best-fit lenders from our 100+ panel based on deal specifics.",
  },
  {
    title: "Packaging",
    body:
      "We prepare a lender-ready information memorandum that accelerates credit decisions.",
  },
  {
    title: "Completion",
    body:
      "We manage the process through term sheet, valuation, legal and drawdown.",
  },
];

export default function AboutPage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Matt Lenzie",
    jobTitle: "Founder & Principal Broker",
    url: `${SITE_URL}/about`,
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    knowsAbout: [
      "Development Finance",
      "Bridging Loans",
      "Mezzanine Finance",
      "Property Development",
      "Commercial Mortgages",
      "Capital Stack Structuring",
      "Equity & Joint Ventures",
    ],
    description:
      "Property finance broker with over 25 years of experience arranging more than £500 million of development funding across the UK.",
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: SITE_NAME,
    url: SITE_URL,
    description: `Independent UK development finance brokerage led by Matt Lenzie, who has ${STATS.yearsExperience} years of property-finance experience. Access senior debt, mezzanine, bridging loans and equity for property developments across the UK.`,
    founder: { "@type": "Person", name: "Matt Lenzie" },
    foundingDate: "2024",
    areaServed: { "@type": "Country", name: "United Kingdom" },
    email: CONTACT.email,
    telephone: CONTACT.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "London",
      addressCountry: "GB",
    },
    knowsAbout: [
      "Development Finance",
      "Bridging Loans",
      "Mezzanine Finance",
      "Equity & Joint Ventures",
      "Refurbishment Finance",
      "Commercial Mortgages",
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "About Matt Lenzie" },
    ],
  };

  return (
    <>
      <JsonLd data={personJsonLd} />
      <JsonLd data={orgJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <PageHero
        tone="paper"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="The firm"
        title={
          <>
            Built on deals,
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              not promises.
            </span>
          </>
        }
        deck={
          <>
            Construction Capital was founded on a simple principle: property
            developers deserve a broker who understands their business,
            speaks their language and delivers results. No scripts, no
            gatekeeping &mdash; just answers.
          </>
        }
        stats={[
          { label: "Arranged", value: `£${STATS.fundsArranged}` },
          { label: "Lender panel", value: STATS.lenderPanel },
          { label: "Years", value: STATS.yearsExperience },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-4">
            <CTAButton href="/deal-room" variant="navy" size="lg">
              Start a deal
            </CTAButton>
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="numeral-tabular editorial-link inline-flex h-14 items-center text-lg font-medium tracking-tight"
              style={{ color: "var(--navy-dark)" }}
            >
              Or call {CONTACT.phone}
            </a>
          </div>
        }
      />

      {/* ━━━ FOUNDER ━━━ */}
      <EditorialSection tone="paper">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Founder headshot */}
          <figure className="lg:col-span-4">
            <div
              className="relative aspect-[3/4] w-full overflow-hidden"
              style={{ border: "1px solid oklch(0.82 0.01 250)" }}
            >
              <Image
                src="/images/matt-lenzie.png"
                alt="Matt Lenzie, founder of Construction Capital"
                fill
                priority
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover object-top"
              />
              <span
                aria-hidden
                className="absolute -bottom-[1px] left-0 h-12 w-[2px]"
                style={{ background: "var(--gold)" }}
              />
            </div>
            <figcaption
              className="mt-4 text-[11px] font-medium uppercase tracking-[0.28em]"
              style={{ color: "oklch(0.50 0.02 255)" }}
            >
              Founder &amp; principal broker
            </figcaption>
          </figure>

          <div className="lg:col-span-8">
            <Eyebrow tone="paper" className="mb-5">
              The founder
            </Eyebrow>
            <h2
              className="font-heading text-4xl font-medium leading-[1.05] tracking-[-0.015em] sm:text-[3rem]"
              style={{ color: "var(--navy-dark)" }}
            >
              Matt Lenzie.
            </h2>

            <div
              className="mt-10 space-y-5 text-[17px] leading-[1.7]"
              style={{ color: "oklch(0.32 0.04 255)" }}
            >
              <p>
                Matt has spent 25+ years in UK property finance, arranging
                more than £500 million of development funding across that
                career. His track record spans the full spectrum &mdash;
                from £200k light refurbishments and HMO conversions to
                £50M+ multi-phase residential schemes &mdash; and the full
                capital stack from senior debt through mezzanine, preferred
                equity and JV structures.
              </p>
              <p>
                Across those 25 years Matt built direct relationships with
                credit committees at challenger banks, specialist lenders,
                family offices and institutional debt funds. Those
                relationships &mdash; maintained through consistent deal
                flow and transparent packaging &mdash; mean faster credit
                decisions and more competitive terms for clients.
              </p>
              <p>
                Construction Capital launched in 2024 as the formal vehicle
                for Matt&rsquo;s brokerage practice &mdash; a deliberate
                rebrand to put the discipline of the last two decades on a
                single platform. Every deal that enters the firm still goes
                through Matt personally: understanding the borrower&rsquo;s
                business plan, modelling the capital structure, and
                presenting to the right lenders on day one rather than
                after weeks of speculative enquiries.
              </p>
              <p>
                Matt has navigated every UK property cycle since the early
                2000s, including structuring exits during the 2008 financial
                crisis with zero client defaults &mdash; the conservative
                risk approach that underpins every deal today.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5 text-sm">
              <a
                href={`mailto:${CONTACT.email}`}
                className="editorial-link"
                style={{ color: "var(--navy-dark)" }}
              >
                {CONTACT.email}
              </a>
              <span style={{ color: "oklch(0.70 0.02 255)" }}>&middot;</span>
              <a
                href={`tel:${CONTACT.phoneRaw}`}
                className="numeral-tabular editorial-link"
                style={{ color: "var(--navy-dark)" }}
              >
                {CONTACT.phone}
              </a>
            </div>
          </div>
        </div>
      </EditorialSection>

      {/* ━━━ KEY NUMBERS ━━━ */}
      <EditorialSection tone="stone">
        <SectionHeader
          tone="stone"
          eyebrow="Track record"
          title="The numbers behind Matt's career."
          body="These figures track Matt's 25+ years in UK property finance, the backbone of Construction Capital today. Every figure is verifiable; if we can't cite it, we don't claim it."
        />
        <div className="mt-14">
          <StatStrip
            tone="stone"
            items={[
              { label: "Arranged (career)", value: `£${STATS.fundsArranged}` },
              { label: "Lender panel", value: STATS.lenderPanel },
              { label: "Repeat developers", value: "60%+" },
            ]}
          />
        </div>
      </EditorialSection>

      {/* ━━━ SPECIALIST EXPERTISE ━━━ */}
      <EditorialSection tone="paper">
        <SectionHeader
          tone="paper"
          eyebrow="Areas of expertise"
          title="What we specialise in."
          body="25+ years of deal structuring across every property asset class and financing method available in the UK market."
        />
        <ul
          className="mt-14 grid grid-cols-1 gap-px border-y sm:grid-cols-2"
          style={{
            borderColor: "var(--stone-dark)",
            backgroundColor: "var(--stone-dark)",
          }}
        >
          {specialisms.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-3 p-8"
              style={{ background: "var(--paper)" }}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-[0.55rem] block h-1 w-1 flex-shrink-0 rounded-full"
                  style={{ background: "var(--gold)" }}
                />
                <h3
                  className="font-heading text-xl font-medium leading-tight tracking-tight"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {item.title}
                </h3>
              </div>
              <p
                className="pl-4 text-[15px] leading-[1.6]"
                dangerouslySetInnerHTML={{ __html: item.body }}
                style={{ color: "oklch(0.42 0.03 255)" }}
              />
            </li>
          ))}
        </ul>
      </EditorialSection>

      {/* ━━━ HOW WE OPERATE ━━━ */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="How we operate"
          title={
            <>
              Every principle below
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                forged in real deals.
              </span>
            </>
          }
          body="No buzzwords. No mission statements. The way the firm runs is the same on the first call as on the fiftieth."
        />
        <ol
          className="mt-14 grid grid-cols-1 gap-px border-y sm:grid-cols-2"
          style={{
            borderColor: "oklch(1 0 0 / 0.14)",
            backgroundColor: "oklch(1 0 0 / 0.14)",
          }}
        >
          {values.map((item, i) => (
            <li
              key={item.title}
              className="flex flex-col gap-4 p-8 sm:p-10"
              style={{ background: "var(--navy-dark)" }}
            >
              <p
                className="numeral-tabular font-heading text-4xl font-medium tracking-tight"
                style={{ color: "var(--gold-light)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3
                className="font-heading text-xl font-medium leading-tight tracking-tight"
                style={{ color: "oklch(1 0 0 / 0.95)" }}
              >
                {item.title}
              </h3>
              <p
                className="text-[15px] leading-[1.65]"
                style={{ color: "oklch(1 0 0 / 0.7)" }}
              >
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </EditorialSection>

      {/* ━━━ TIMELINE ━━━ */}
      <EditorialSection tone="stone">
        <SectionHeader
          tone="stone"
          eyebrow="Our journey"
          title="Five marker dates."
        />
        <ol
          className="mt-14 border-t"
          style={{ borderColor: "var(--stone-dark)" }}
        >
          {milestones.map((milestone) => (
            <li
              key={milestone.year}
              className="grid grid-cols-12 items-baseline gap-4 border-b py-7 sm:gap-8 sm:py-9"
              style={{ borderColor: "var(--stone-dark)" }}
            >
              <p
                className="numeral-tabular font-heading col-span-12 text-3xl font-medium tracking-tight sm:col-span-3 sm:text-[2.5rem]"
                style={{ color: "var(--gold-dark)" }}
              >
                {milestone.year}
              </p>
              <p
                className="font-heading col-span-12 text-xl font-medium leading-tight tracking-tight sm:col-span-9 sm:text-[1.6rem]"
                style={{ color: "var(--navy-dark)" }}
              >
                {milestone.event}
              </p>
            </li>
          ))}
        </ol>
      </EditorialSection>

      {/* ━━━ DEAL PROCESS ━━━ */}
      <EditorialSection tone="paper">
        <SectionHeader
          tone="paper"
          eyebrow="The deal process"
          title="How a scheme moves through the firm."
          body="Four stages, one broker on the file from start to finish. Typical timeline to drawdown is 4–8 weeks depending on the lender and the security."
        />
        <ol
          className="mt-14 grid grid-cols-1 gap-px border-y sm:grid-cols-2 lg:grid-cols-4"
          style={{
            borderColor: "var(--stone-dark)",
            backgroundColor: "var(--stone-dark)",
          }}
        >
          {processSteps.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-4 p-8"
              style={{ background: "var(--paper)" }}
            >
              <p
                className="numeral-tabular font-heading text-4xl font-medium tracking-tight"
                style={{ color: "var(--gold-dark)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3
                className="font-heading text-xl font-medium leading-tight tracking-tight"
                style={{ color: "var(--navy-dark)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-[14px] leading-[1.6]"
                style={{ color: "oklch(0.42 0.03 255)" }}
              >
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </EditorialSection>

      {/* ━━━ CTA ━━━ */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="Start a deal"
          title={
            <>
              Tell us the scheme.
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                We&rsquo;ll work the file.
              </span>
            </>
          }
          body="First-time developer or fifteenth — we structure the funding that works for the project, not the product sheet."
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
