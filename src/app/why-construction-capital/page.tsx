import type { Metadata } from "next";

import {
  CTAButton,
  EditorialSection,
  Eyebrow,
  PageHero,
  ProseSection,
  SectionHeader,
} from "@/components/editorial/primitives";
import { JsonLd } from "@/components/ui/json-ld";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";
import { FUNDING_ROUTES } from "@/lib/comparisons";

export const metadata: Metadata = {
  title: "When a Broker Earns Their Fee | Construction Capital",
  description:
    "An honest case for using a development finance broker. When going direct is fine, when a broker pays for themselves, what we actually do, and how we're paid.",
  alternates: { canonical: `${SITE_URL}/why-construction-capital` },
  openGraph: {
    title: "When a Broker Earns Their Fee | Construction Capital",
    description:
      "An honest case for using a development finance broker — and when you can skip it.",
    url: `${SITE_URL}/why-construction-capital`,
    siteName: SITE_NAME,
    type: "website",
  },
};

const whenYouDontNeedUs = [
  {
    title: "You have an existing lender you trust",
    body:
      "A repeat relationship with a lender who knows your track record, prices competitively, and moves quickly is genuinely hard to beat. If you've already got that, keep it &mdash; don't let a broker replace it out of self-interest.",
  },
  {
    title: "The deal is plain-vanilla",
    body:
      "Single-plot residential, modest leverage, comfortable LTV, planning fully in place, experienced sponsor, no unusual security. High-street banks underwrite this profile every day. A broker adds little here.",
  },
  {
    title: "You&rsquo;re not actually time-pressured",
    body:
      "If you have six months before drawdown, you can run a direct-market beauty parade yourself. The comparison-shopping has cost but it has value too &mdash; you'll learn the market. Brokers compress that into days; if you don't need that compression, save the fee.",
  },
  {
    title: "You&rsquo;re looking for a mortgage, not a facility",
    body:
      "Owner-occupier residential mortgages are regulated consumer products with tight pricing and transparent comparison tools. Use a regulated mortgage adviser, not us.",
  },
];

const whenTheMathChanges = [
  {
    title: "You need more than one lender in the stack",
    body:
      "Mezzanine behind senior, preferred equity on top, a separate bridging line to keep options open. Co-ordinating two or three lenders to complete on the same day is what breaks DIY applications. We document facilities in parallel and manage intercreditor.",
  },
  {
    title: "Your scheme is outside the plain-vanilla box",
    body:
      "PD conversion, pre-planning acquisition, unusual security, first-time developer stretching into a bigger scheme, complex covenant package. Specialist lenders exist for all of these, but they're invisible to Google and don't run call centres. The panel is the product.",
  },
  {
    title: "Leverage matters more than margin",
    body:
      "If an extra 10% LTGDV lets you take on a second scheme, the broker fee is a rounding error. Stretch senior, senior-plus-mezz, and JV equity regularly add leverage that direct-to-one-lender simply can't. That's where the real money moves.",
  },
  {
    title: "Time-to-completion is the deal",
    body:
      "Auction purchases, chain breaks, retender situations, funding a deposit on a second site. Brokers with live relationships collapse weeks of enquiry/reply cycles into a single call. If you're counting days, that compression is the entire point.",
  },
];

const whatWeActuallyDo = [
  {
    title: "Pre-screen against 100+ lenders before writing a line",
    body:
      "We know which lenders have appetite this week, which are cold on the sector, and which credit committees sit on Thursdays. Saves you applying to the three lenders who will politely decline.",
  },
  {
    title: "Package the deal the way credit committees want to read it",
    body:
      "A well-drafted information memorandum cuts weeks off the decision. Badly packaged deals get relegated to the bottom of the credit pile; well-packaged ones get a decision in the next sitting.",
  },
  {
    title: "Negotiate the commercial terms, not just the rate",
    body:
      "Arrangement fee, exit fee, monitoring surveyor frequency, drawdown tranche structure, non-utilisation fee, cost overrun facility, covenant tests. The total cost of a facility is at least ten line items; the headline rate is one of them.",
  },
  {
    title: "Co-ordinate valuers, solicitors and monitoring surveyors",
    body:
      "Deals die in the handoffs. We sit between the five or six professional parties and make sure nothing falls through a gap. One point of contact, weekly status on every file, no dropped stitches.",
  },
  {
    title: "Run two or three tracks in parallel",
    body:
      "We rarely back a single lender all the way to offer. Running parallel negotiations until the commercial terms are tight keeps lenders honest and gives you a fallback if the preferred route stumbles on valuation or legal.",
  },
  {
    title: "Stay on the file through drawdown",
    body:
      "The process doesn't stop at the term sheet. We see every deal through valuation, legal, first drawdown and subsequent stage releases. Same broker from day one to practical completion.",
  },
];

export default function WhyConstructionCapitalPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "When a broker earns their fee" },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <PageHero
        tone="paper"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Why Construction Capital" },
        ]}
        eyebrow="The honest version of the pitch"
        title={
          <>
            When a broker earns their fee.
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              (And when they don&rsquo;t.)
            </span>
          </>
        }
        deck={
          <>
            Every broker website says the same thing: wider access, better
            terms, expert advice. Most of that&rsquo;s true &mdash; some of
            the time. Here&rsquo;s the honest argument. When going direct
            is fine, when a broker pays for themselves, and how we&rsquo;re
            paid when it comes to it.
          </>
        }
        actions={
          <CTAButton href="/deal-room" variant="navy" size="lg">
            Start a deal
          </CTAButton>
        }
      />

      {/* ━━━ When you DON'T need us ━━━ */}
      <EditorialSection tone="paper">
        <SectionHeader
          tone="paper"
          eyebrow="First, the honest bit"
          title={
            <>
              When you probably
              <br />
              <span className="italic" style={{ color: "var(--navy)" }}>
                don&rsquo;t need a broker.
              </span>
            </>
          }
          body="We lose nothing by saying this out loud. If the deal fits one of these patterns, go direct and save the fee."
        />
        <ul
          className="mt-14 grid grid-cols-1 gap-px border-y sm:grid-cols-2"
          style={{
            borderColor: "var(--stone-dark)",
            backgroundColor: "var(--stone-dark)",
          }}
        >
          {whenYouDontNeedUs.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-3 p-8"
              style={{ background: "var(--paper)" }}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-[0.55rem] block h-1 w-1 flex-shrink-0 rounded-full"
                  style={{ background: "oklch(0.50 0.02 255)" }}
                />
                <h3
                  className="font-heading text-xl font-medium leading-tight tracking-tight"
                  style={{ color: "var(--navy-dark)" }}
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
              </div>
              <p
                className="pl-4 text-[15px] leading-[1.6]"
                style={{ color: "oklch(0.42 0.03 255)" }}
                dangerouslySetInnerHTML={{ __html: item.body }}
              />
            </li>
          ))}
        </ul>
      </EditorialSection>

      {/* ━━━ When the MATH changes ━━━ */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="Now the other side"
          title={
            <>
              When a broker pays for themselves
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                many times over.
              </span>
            </>
          }
          body="Flip the pattern. Here's when the fee is a rounding error on the value delivered — and where most of our repeat business comes from."
        />
        <ul
          className="mt-14 grid grid-cols-1 gap-px border-y sm:grid-cols-2"
          style={{
            borderColor: "oklch(1 0 0 / 0.14)",
            backgroundColor: "oklch(1 0 0 / 0.14)",
          }}
        >
          {whenTheMathChanges.map((item, i) => (
            <li
              key={item.title}
              className="flex flex-col gap-4 p-8 sm:p-10"
              style={{ background: "var(--navy-dark)" }}
            >
              <p
                className="numeral-tabular font-heading text-3xl font-medium tracking-tight"
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
                style={{ color: "oklch(1 0 0 / 0.72)" }}
              >
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </EditorialSection>

      {/* ━━━ What a broker actually does ━━━ */}
      <EditorialSection tone="paper">
        <SectionHeader
          tone="paper"
          eyebrow="What we actually do"
          title={
            <>
              Six tasks a broker works on
              <br />
              <span className="italic" style={{ color: "var(--navy)" }}>
                that a developer would skip.
              </span>
            </>
          }
          body="Not vibes. The concrete workflow from enquiry to drawdown. This is what the fee pays for."
        />
        <ol
          className="mt-14 border-t"
          style={{ borderColor: "var(--stone-dark)" }}
        >
          {whatWeActuallyDo.map((item, i) => (
            <li
              key={item.title}
              className="grid grid-cols-12 items-baseline gap-4 border-b py-8 sm:gap-10"
              style={{ borderColor: "var(--stone-dark)" }}
            >
              <p
                className="numeral-tabular font-heading col-span-2 text-2xl font-medium tracking-tight sm:col-span-1 sm:text-[1.5rem]"
                style={{ color: "var(--gold-dark)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3
                className="font-heading col-span-10 text-xl font-medium leading-tight tracking-tight sm:col-span-5 sm:text-[1.4rem]"
                style={{ color: "var(--navy-dark)" }}
              >
                {item.title}
              </h3>
              <p
                className="col-span-12 text-[15px] leading-[1.65] sm:col-span-6"
                style={{ color: "oklch(0.40 0.03 255)" }}
              >
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </EditorialSection>

      {/* ━━━ How we're paid ━━━ */}
      <EditorialSection tone="stone">
        <SectionHeader
          tone="stone"
          eyebrow="How we&rsquo;re paid"
          title={
            <>
              Transparent fee, paid only
              <br />
              <span className="italic" style={{ color: "var(--navy)" }}>
                on completion.
              </span>
            </>
          }
          body="No retainers, no success-plus-retainer. If the deal doesn&rsquo;t complete, we don&rsquo;t get paid &mdash; which means our interests are aligned with yours from the first call."
        />
        <div
          className="mt-14 grid grid-cols-1 gap-px border-y sm:grid-cols-3"
          style={{
            borderColor: "var(--stone-dark)",
            backgroundColor: "var(--stone-dark)",
          }}
        >
          {[
            {
              label: "Arrangement fee",
              value: "1 – 2%",
              note: "Of the gross facility, typical range. Varies by complexity and deal size.",
            },
            {
              label: "Paid when",
              value: "On drawdown",
              note: "Deducted from the first drawdown. No money out of the developer&rsquo;s pocket until the facility is live.",
            },
            {
              label: "Retainers",
              value: "None",
              note: "No upfront fee, no success-plus-retainer. If the deal doesn&rsquo;t complete, neither do we.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-4 p-8 sm:p-10"
              style={{ background: "var(--stone)" }}
            >
              <p
                className="text-[10px] font-medium uppercase tracking-[0.28em]"
                style={{ color: "oklch(0.50 0.02 255)" }}
              >
                {item.label}
              </p>
              <p
                className="numeral-tabular font-heading text-4xl font-medium leading-none tracking-tight"
                style={{ color: "var(--navy-dark)" }}
              >
                {item.value}
              </p>
              <p
                className="text-[14px] leading-[1.55]"
                style={{ color: "oklch(0.42 0.03 255)" }}
                dangerouslySetInnerHTML={{ __html: item.note }}
              />
            </div>
          ))}
        </div>

        <ProseSection title={<>&nbsp;</>} tone="stone">
          <p>
            A typical £3&ndash;5M development facility arranged through us
            costs the developer £30k&ndash;£100k in broker fees. That sounds
            like a lot until you weigh it against what we routinely save
            on the rate (often 50&ndash;150bps), the arrangement fee
            negotiated with the lender, or the incremental leverage we
            can unlock &mdash; any one of which can be worth multiples of
            our fee on a scheme that size.
          </p>
          <p>
            We show you the all-in cost comparison before you commit. If
            the numbers don&rsquo;t stack up, we&rsquo;ll tell you.
          </p>
        </ProseSection>
      </EditorialSection>

      {/* ━━━ Funding routes comparison ━━━ */}
      <EditorialSection tone="paper">
        <SectionHeader
          tone="paper"
          eyebrow="Alternative routes"
          title="How we compare to the other options."
          body="We&rsquo;re not the only way to fund a scheme. Here&rsquo;s an honest view of the main alternatives and when each one fits."
        />
        <div className="mt-14 space-y-14">
          {FUNDING_ROUTES.map((route, idx) => (
            <article
              key={route.slug}
              className="grid grid-cols-1 gap-8 border-t pt-10 lg:grid-cols-12 lg:gap-12"
              style={{ borderColor: "var(--stone-dark)" }}
            >
              <div className="lg:col-span-4">
                <Eyebrow tone="paper" className="mb-4">
                  Route {idx + 1}
                </Eyebrow>
                <h3
                  className="font-heading text-2xl font-medium leading-tight tracking-tight sm:text-[1.75rem]"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {route.name}
                </h3>
                <p
                  className="mt-4 text-[15px] leading-[1.6]"
                  style={{ color: "oklch(0.40 0.03 255)" }}
                >
                  {route.description}
                </p>
              </div>

              <div className="lg:col-span-8">
                <dl
                  className="grid grid-cols-2 gap-8 border-y py-6"
                  style={{ borderColor: "var(--stone-dark)" }}
                >
                  <div>
                    <dt
                      className="text-[10px] font-medium uppercase tracking-[0.26em]"
                      style={{ color: "oklch(0.50 0.02 255)" }}
                    >
                      Timeline
                    </dt>
                    <dd
                      className="numeral-tabular font-heading mt-2 text-lg font-medium tracking-tight"
                      style={{ color: "var(--navy-dark)" }}
                    >
                      {route.typicalTimeline}
                    </dd>
                  </div>
                  <div>
                    <dt
                      className="text-[10px] font-medium uppercase tracking-[0.26em]"
                      style={{ color: "oklch(0.50 0.02 255)" }}
                    >
                      Typical cost
                    </dt>
                    <dd
                      className="numeral-tabular font-heading mt-2 text-lg font-medium tracking-tight"
                      style={{ color: "var(--navy-dark)" }}
                    >
                      {route.typicalCost}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <p
                      className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em]"
                      style={{ color: "var(--gold-dark)" }}
                    >
                      In its favour
                    </p>
                    <ul className="space-y-2 text-[14px] leading-[1.55]" style={{ color: "oklch(0.40 0.03 255)" }}>
                      {route.pros.map((pro) => (
                        <li key={pro} className="flex items-start gap-2">
                          <span
                            aria-hidden
                            className="mt-[0.55rem] block h-1 w-1 flex-shrink-0 rounded-full"
                            style={{ background: "var(--gold)" }}
                          />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p
                      className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em]"
                      style={{ color: "oklch(0.55 0.22 25)" }}
                    >
                      Against
                    </p>
                    <ul className="space-y-2 text-[14px] leading-[1.55]" style={{ color: "oklch(0.40 0.03 255)" }}>
                      {route.cons.map((con) => (
                        <li key={con} className="flex items-start gap-2">
                          <span
                            aria-hidden
                            className="mt-[0.55rem] block h-1 w-1 flex-shrink-0 rounded-full"
                            style={{ background: "oklch(0.55 0.22 25)" }}
                          />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p
                  className="mt-6 text-[14px] italic leading-[1.6]"
                  style={{ color: "oklch(0.35 0.04 255)" }}
                >
                  <span
                    className="mr-2 text-[10px] not-italic font-medium uppercase tracking-[0.24em]"
                    style={{ color: "oklch(0.50 0.02 255)" }}
                  >
                    Best for:
                  </span>
                  {route.bestFor}
                </p>
              </div>
            </article>
          ))}
        </div>
      </EditorialSection>

      {/* ━━━ Close ━━━ */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="Still reading"
          title={
            <>
              If you&rsquo;re in the second camp,
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                let&rsquo;s talk.
              </span>
            </>
          }
          body="Send us the outline of your scheme. We&rsquo;ll come back with indicative pricing from the right lenders inside a working day &mdash; and we&rsquo;ll tell you upfront if going direct would serve you better."
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
