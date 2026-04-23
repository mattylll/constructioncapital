import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock, PoundSterling, TrendingUp, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/ui/json-ld";
import { CTAButton, PageHero } from "@/components/editorial/primitives";
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

      {/* ━━━ SERVICES ━━━ */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div
              className="mb-5 h-[2px] w-14"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
              style={{ color: "var(--gold-dark)" }}
            >
              Products Available
            </p>
            <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
              Services Offered
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {lender.services.map((serviceSlug) => {
                const service = getServiceBySlug(serviceSlug);
                if (!service) return null;
                
return (
                  <Link
                    key={serviceSlug}
                    href={`/services/${serviceSlug}`}
                    className="group flex items-start gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-gold/30 hover:shadow-sm"
                  >
                    <div
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                      }}
                    >
                      <PoundSterling
                        className="h-4 w-4"
                        style={{ color: "var(--gold-dark)" }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground transition-colors group-hover:text-gold-dark">
                        {service.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {service.shortDesc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ STRENGTHS ━━━ */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div
              className="mb-5 h-[2px] w-14"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
              style={{ color: "var(--gold-dark)" }}
            >
              Why This Lender
            </p>
            <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
              Key Strengths
            </h2>

            <div className="space-y-4">
              {lender.strengths.map((strength, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-xl border border-border/50 bg-card p-5"
                >
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                    }}
                  >
                    <Check
                      className="h-4 w-4"
                      style={{ color: "var(--gold-dark)" }}
                    />
                  </div>
                  <p className="text-base text-foreground">{strength}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ KEY DETAILS ━━━ */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div
              className="mb-5 h-[2px] w-14"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
              style={{ color: "var(--gold-dark)" }}
            >
              At a Glance
            </p>
            <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
              Lending Criteria
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: PoundSterling,
                  label: "Minimum Loan",
                  value: lender.minLoan,
                },
                {
                  icon: PoundSterling,
                  label: "Maximum Loan",
                  value: lender.maxLoan,
                },
                {
                  icon: TrendingUp,
                  label: "Typical Rate",
                  value: lender.typicalRate,
                },
                {
                  icon: Shield,
                  label: "Maximum LTV",
                  value: lender.maxLtv,
                },
                {
                  icon: Clock,
                  label: "Typical Turnaround",
                  value: lender.turnaround,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-5"
                >
                  <item.icon
                    className="h-5 w-5 shrink-0"
                    style={{ color: "var(--gold-dark)" }}
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ HOW TO ACCESS ━━━ */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div
              className="mb-5 h-[2px] w-14"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
              style={{ color: "var(--gold-dark)" }}
            >
              How It Works
            </p>
            <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
              How to Access This Lender
            </h2>

            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                {lender.name} is part of the {SITE_NAME} lender panel. As a
                broker-only lender, they do not accept direct applications from
                developers. All enquiries are submitted through us, giving you
                the benefit of our established relationship and negotiating
                power.
              </p>
              <p>
                When you submit your deal through our Deal Room, we assess your
                project against the full panel of 100+ lenders - including{" "}
                {lender.name}. If they are the right fit, we present your case
                directly to their credit team with a full information pack,
                saving weeks of back-and-forth.
              </p>
              <p>
                Our relationship with {lender.name} means we know exactly what
                they need to see, what their current appetite looks like, and how
                to position your deal for the best possible terms. There is no
                cost to you unless we successfully arrange your facility.
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                {
                  num: "01",
                  title: "Submit Your Deal",
                  desc: "Enter your project details in the Deal Room. Takes 2 minutes.",
                },
                {
                  num: "02",
                  title: "We Match & Present",
                  desc: `We match your deal to ${lender.name} and present it to their credit team.`,
                },
                {
                  num: "03",
                  title: "Receive Terms",
                  desc: `Indicative terms from ${lender.name} typically within ${lender.turnaround}.`,
                },
              ].map((step) => (
                <div key={step.num}>
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
                      border: "1px solid oklch(0.75 0.12 85 / 0.12)",
                      color: "var(--gold-dark)",
                    }}
                  >
                    {step.num}
                  </div>
                  <h3 className="mb-1 text-sm font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ RELATED LENDERS ━━━ */}
      {relatedLenders.length > 0 && (
        <section className="bg-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div
                className="mb-5 h-[2px] w-14"
                style={{
                  background:
                    "linear-gradient(90deg, var(--gold), var(--gold-light))",
                }}
              />
              <p
                className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
                style={{ color: "var(--gold-dark)" }}
              >
                Similar Lenders
              </p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Other {getTypeLabel(lender.type)} Lenders
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {relatedLenders.map((related) => (
                <Link
                  key={related.slug}
                  href={`/lender-panel/${related.slug}`}
                  className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-gold/20 hover:shadow-md"
                >
                  <Badge
                    className={`mb-3 rounded-md text-[11px] font-semibold ${TYPE_COLORS[related.type]}`}
                  >
                    {getTypeLabel(related.type)}
                  </Badge>
                  <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-gold-dark">
                    {related.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {related.description}
                  </p>
                  <p
                    className="mt-3 text-sm font-semibold"
                    style={{ color: "var(--gold-dark)" }}
                  >
                    {related.typicalRate} · {related.maxLtv}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <Button asChild variant="outline" size="sm">
                <Link href="/lender-panel">
                  View Full Lender Panel
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ━━━ CTA ━━━ */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.70 0.14 80) 0%, oklch(0.78 0.12 88) 50%, oklch(0.72 0.13 82) 100%)",
          }}
        />
        <div className="noise-overlay absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color: "var(--navy-dark)" }}
          >
            Ready to Work With
            <br />
            {lender.name}?
          </h2>
          <p
            className="mx-auto mt-5 max-w-xl text-lg"
            style={{ color: "var(--navy)", opacity: 0.6 }}
          >
            Submit your deal and receive indicative terms from {lender.name} and
            our wider panel of 100+ lenders. No obligation, no fees until we
            deliver.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="bg-navy text-white hover:bg-navy-dark h-14 px-12 text-base font-bold shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <Link href="/deal-room">
                Enter the Deal Room
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 border-navy/20 px-10 text-base font-bold text-navy hover:bg-navy/5"
            >
              <Link href={`tel:${CONTACT.phoneRaw}`}>
                Call {CONTACT.phone}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
