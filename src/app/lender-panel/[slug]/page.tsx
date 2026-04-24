import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock, PoundSterling, TrendingUp, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/ui/json-ld";
import {
  CTAButton,
  EditorialSection,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
import {
  LENDERS,
  LENDER_TYPES,
  getLenderBySlug,
  getLendersByType,
  type LenderType,
} from "@/lib/lenders";
import { SERVICES } from "@/lib/services";
import { SITE_NAME, SITE_URL, CONTACT } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const TYPE_COLORS: Record<LenderType, string> = {
  "high-street-bank": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "specialist-lender": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "challenger-bank": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "family-office": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "institutional": "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  "bridging-specialist": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "development-specialist": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

function getTypeLabel(type: LenderType): string {
  return LENDER_TYPES.find((t) => t.slug === type)?.label ?? type;
}

function getServiceBySlug(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

export async function generateStaticParams() {
  return LENDERS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lender = getLenderBySlug(slug);
  if (!lender) return {};

  const title = `${lender.name} - Lender Profile | ${SITE_NAME}`;
  const description = `${lender.name} offers ${lender.services.map((s) => getServiceBySlug(s)?.name ?? s).join(", ")}. Loans from ${lender.minLoan} to ${lender.maxLoan}. ${lender.typicalRate}. Access via ${SITE_NAME}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/lender-panel/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/lender-panel/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LenderDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const lender = getLenderBySlug(slug);

  if (!lender) {
    notFound();
  }

  const relatedLenders = getLendersByType(lender.type)
    .filter((l) => l.slug !== lender.slug)
    .slice(0, 3);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Our Lender Panel",
        item: `${SITE_URL}/lender-panel`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: lender.name,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <PageHero
        tone="paper"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Lender Panel", href: "/lender-panel" },
          { label: lender.name },
        ]}
        eyebrow={getTypeLabel(lender.type)}
        title={lender.name}
        deck={lender.description}
        stats={[
          { label: "Typical rate", value: lender.typicalRate },
          { label: "Max LTV", value: lender.maxLtv },
          { label: "Turnaround", value: lender.turnaround },
        ]}
        actions={
          <CTAButton href="/deal-room" variant="navy" size="lg">
            Access this lender
          </CTAButton>
        }
      />

      {/* Services */}
      <EditorialSection tone="paper">
        <SectionHeader
          tone="paper"
          eyebrow="Products available"
          title={
            <>
              Services
              <br />
              <span className="italic" style={{ color: "var(--navy)" }}>
                offered.
              </span>
            </>
          }
        />
        <div
          className="mt-16 grid gap-px border-y sm:grid-cols-2"
          style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}
        >
          {lender.services.map((serviceSlug) => {
            const service = getServiceBySlug(serviceSlug);
            if (!service) return null;
            return (
              <Link
                key={serviceSlug}
                href={`/services/${serviceSlug}`}
                className="group flex items-start gap-5 px-7 py-7 transition-colors"
                style={{ background: "var(--paper)" }}
              >
                <PoundSterling
                  className="mt-1 h-4 w-4 shrink-0"
                  style={{ color: "var(--gold-dark)" }}
                />
                <div>
                  <h3
                    className="font-heading text-[20px] font-medium leading-tight tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                    style={{ color: "var(--navy-dark)" }}
                  >
                    {service.name}
                  </h3>
                  <p
                    className="mt-2 text-[15px] leading-[1.55]"
                    style={{ color: "oklch(0.35 0.04 255)" }}
                  >
                    {service.shortDesc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </EditorialSection>

      {/* Strengths */}
      <EditorialSection tone="stone">
        <SectionHeader
          tone="stone"
          eyebrow="Why this lender"
          title={
            <>
              Key
              <br />
              <span className="italic" style={{ color: "var(--navy)" }}>
                strengths.
              </span>
            </>
          }
        />
        <ul className="mt-16 mx-auto max-w-3xl divide-y" style={{ borderColor: "var(--stone-dark)" }}>
          {lender.strengths.map((strength, i) => (
            <li
              key={i}
              className="flex items-start gap-5 py-5"
              style={{ borderColor: "var(--stone-dark)" }}
            >
              <Check
                className="mt-1 h-4 w-4 shrink-0"
                style={{ color: "var(--gold-dark)" }}
              />
              <p
                className="text-[17px] leading-[1.6]"
                style={{ color: "var(--navy-dark)" }}
              >
                {strength}
              </p>
            </li>
          ))}
        </ul>
      </EditorialSection>

      {/* Key details */}
      <EditorialSection tone="paper">
        <SectionHeader
          tone="paper"
          eyebrow="At a glance"
          title={
            <>
              Lending
              <br />
              <span className="italic" style={{ color: "var(--navy)" }}>
                criteria.
              </span>
            </>
          }
        />
        <dl
          className="mt-16 grid grid-cols-2 gap-px border-y lg:grid-cols-5"
          style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}
        >
          {[
            { icon: PoundSterling, label: "Minimum loan", value: lender.minLoan },
            { icon: PoundSterling, label: "Maximum loan", value: lender.maxLoan },
            { icon: TrendingUp, label: "Typical rate", value: lender.typicalRate },
            { icon: Shield, label: "Maximum LTV", value: lender.maxLtv },
            { icon: Clock, label: "Typical turnaround", value: lender.turnaround },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-4 px-6 py-7"
              style={{ background: "var(--paper)" }}
            >
              <item.icon className="h-4 w-4" style={{ color: "var(--gold-dark)" }} />
              <div>
                <dt
                  className="text-[10px] font-medium uppercase tracking-[0.24em]"
                  style={{ color: "oklch(0.50 0.02 255)" }}
                >
                  {item.label}
                </dt>
                <dd
                  className="numeral-tabular font-heading mt-2 text-[1.5rem] font-medium leading-none tracking-tight"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {item.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </EditorialSection>

      {/* How to access */}
      <EditorialSection tone="stone">
        <div className="mx-auto max-w-3xl">
          <SectionHeader
            tone="stone"
            align="stacked"
            eyebrow="How it works"
            title={
              <>
                How to access
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  this lender.
                </span>
              </>
            }
          />

          <div
            className="mt-10 space-y-4 text-[17px] leading-[1.7]"
            style={{ color: "oklch(0.32 0.04 255)" }}
          >
            <p>
              {lender.name} is part of the {SITE_NAME} lender panel. As a
              broker-only lender, they do not accept direct applications from
              developers. All enquiries are submitted through us, giving you
              the benefit of our established relationship and negotiating
              power.
            </p>
            <p>
              When you submit your deal through our Deal Room, we assess your
              project against the full panel of 100+ lenders — including{" "}
              {lender.name}. If they are the right fit, we present your case
              directly to their credit team with a full information pack,
              saving weeks of back-and-forth.
            </p>
            <p>
              Our relationship with {lender.name} means we know exactly what
              they need to see, what their current appetite looks like, and how
              to position your deal for the best possible terms. No cost to you
              unless we successfully arrange your facility.
            </p>
          </div>

          <ol
            className="mt-12 grid gap-px border-y sm:grid-cols-3"
            style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}
          >
            {[
              {
                num: "01",
                title: "Submit your deal",
                desc: "Enter your project details in the Deal Room. Takes 2 minutes.",
              },
              {
                num: "02",
                title: "We match & present",
                desc: `We match your deal to ${lender.name} and present it to their credit team.`,
              },
              {
                num: "03",
                title: "Receive terms",
                desc: `Indicative terms from ${lender.name} typically within ${lender.turnaround}.`,
              },
            ].map((step) => (
              <li
                key={step.num}
                className="flex flex-col gap-4 px-6 py-7"
                style={{ background: "var(--stone)" }}
              >
                <span
                  className="font-heading numeral-tabular text-[1.75rem] font-medium tracking-tight"
                  style={{ color: "var(--gold-dark)" }}
                >
                  {step.num}
                </span>
                <h3
                  className="font-heading text-[18px] font-medium leading-tight tracking-tight"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[14px] leading-[1.55]"
                  style={{ color: "oklch(0.35 0.04 255)" }}
                >
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </EditorialSection>

      {/* Related lenders */}
      {relatedLenders.length > 0 && (
        <EditorialSection tone="paper">
          <SectionHeader
            tone="paper"
            eyebrow="Similar lenders"
            title={
              <>
                Other {getTypeLabel(lender.type).toLowerCase()}
                <br />
                <span className="italic" style={{ color: "var(--navy)" }}>
                  lenders.
                </span>
              </>
            }
          />
          <div
            className="mt-16 grid gap-px border-y sm:grid-cols-3"
            style={{ borderColor: "var(--stone-dark)", background: "var(--stone-dark)" }}
          >
            {relatedLenders.map((related) => (
              <Link
                key={related.slug}
                href={`/lender-panel/${related.slug}`}
                className="group flex flex-col gap-4 px-7 py-8 transition-colors"
                style={{ background: "var(--paper)" }}
              >
                <Badge
                  className={`w-fit rounded-sm text-[10px] font-semibold ${TYPE_COLORS[related.type]}`}
                >
                  {getTypeLabel(related.type)}
                </Badge>
                <h3
                  className="font-heading text-[22px] font-medium leading-[1.2] tracking-tight transition-colors group-hover:text-[color:var(--navy)]"
                  style={{ color: "var(--navy-dark)" }}
                >
                  {related.name}
                </h3>
                <p
                  className="line-clamp-2 text-[15px] leading-[1.55]"
                  style={{ color: "oklch(0.35 0.04 255)" }}
                >
                  {related.description}
                </p>
                <p
                  className="numeral-tabular text-[11px] font-medium uppercase tracking-[0.22em]"
                  style={{ color: "var(--gold-dark)" }}
                >
                  {related.typicalRate} · {related.maxLtv}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/lender-panel"
              className="editorial-link inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em]"
              style={{ color: "var(--navy-dark)" }}
            >
              View full lender panel
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </EditorialSection>
      )}

      {/* CTA */}
      <EditorialSection tone="navy-dark">
        <SectionHeader
          tone="navy-dark"
          eyebrow="Ready when you are"
          title={
            <>
              Ready to work with
              <br />
              <span className="italic" style={{ color: "var(--gold-light)" }}>
                {lender.name}?
              </span>
            </>
          }
          body={`Submit your deal and receive indicative terms from ${lender.name} and our wider panel of 100+ lenders. No obligation, no fees until we deliver.`}
        />
        <div className="mt-12 flex flex-wrap items-center gap-5">
          <CTAButton href="/deal-room" variant="gold" size="lg">
            Enter the Deal Room
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
