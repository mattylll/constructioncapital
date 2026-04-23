import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  CTAButton,
  EditorialSection,
  Eyebrow,
  PageHero,
  SectionHeader,
} from "@/components/editorial/primitives";
import { CONTACT } from "@/lib/constants";
import { QuickEnquiryForm } from "@/components/quick-enquiry-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Construction Capital. Call, email, or send us a quick enquiry about your development finance needs.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        tone="paper"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Get in touch"
        title={
          <>
            A short conversation
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              is all it takes.
            </span>
          </>
        }
        deck={
          <>
            Deal ready to go, or just mapping out the capital stack &mdash;
            happy to talk either way. No scripts, no pressure, no obligation.
          </>
        }
      />

      {/* ━━━ Direct contact channels (four slots, editorial grid) ━━━ */}
      <EditorialSection tone="paper">
        <SectionHeader
          tone="paper"
          eyebrow="Direct lines"
          title="Reach out however suits you."
          body="Matt takes the call or reads the email personally. If he&rsquo;s on another deal, he&rsquo;ll come back within a few hours."
        />
        <div
          className="mt-14 grid grid-cols-1 gap-px border-y sm:grid-cols-2 lg:grid-cols-4"
          style={{
            borderColor: "var(--stone-dark)",
            backgroundColor: "var(--stone-dark)",
          }}
        >
          {[
            {
              label: "Call",
              value: CONTACT.phone,
              meta: "Mon–Fri, 9am–6pm GMT",
              href: `tel:${CONTACT.phoneRaw}`,
              tabular: true,
            },
            {
              label: "Email",
              value: CONTACT.email,
              meta: "Reply within a few hours",
              href: `mailto:${CONTACT.email}`,
              tabular: false,
            },
            {
              label: "Office",
              value: CONTACT.address,
              meta: "Meetings by appointment",
              href: undefined,
              tabular: false,
            },
            {
              label: "Hours",
              value: "Mon – Fri",
              meta: "09:00 – 18:00 GMT / BST",
              href: undefined,
              tabular: false,
            },
          ].map((method) => {
            const body = (
              <div
                className="flex h-full flex-col gap-3 p-7"
                style={{ background: "var(--paper)" }}
              >
                <p
                  className="text-[10px] font-medium uppercase tracking-[0.28em]"
                  style={{ color: "oklch(0.50 0.02 255)" }}
                >
                  {method.label}
                </p>
                <p
                  className={`font-heading text-xl font-medium leading-tight tracking-tight ${method.tabular ? "numeral-tabular" : ""}`}
                  style={{ color: "var(--navy-dark)" }}
                >
                  {method.value}
                </p>
                <p
                  className="mt-auto text-[13px] leading-[1.5]"
                  style={{ color: "oklch(0.45 0.03 255)" }}
                >
                  {method.meta}
                </p>
              </div>
            );
            return method.href ? (
              <a key={method.label} href={method.href} className="group">
                {body}
              </a>
            ) : (
              <div key={method.label}>{body}</div>
            );
          })}
        </div>
      </EditorialSection>

      {/* ━━━ Quick enquiry + Deal Room comparison ━━━ */}
      <EditorialSection tone="stone">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow tone="stone" className="mb-6">
              Two ways to reach us
            </Eyebrow>
            <h2
              className="font-heading text-4xl font-medium leading-[1.05] tracking-[-0.015em] sm:text-[2.75rem]"
              style={{ color: "var(--navy-dark)" }}
            >
              A quick note
              <br />
              <span className="italic" style={{ color: "var(--navy)" }}>
                or the full file.
              </span>
            </h2>

            <div
              className="mt-10 space-y-5 text-[16px] leading-[1.65]"
              style={{ color: "oklch(0.35 0.04 255)" }}
            >
              <p>
                The form here is for open-ended enquiries &mdash; general
                questions, initial scoping conversations, or if you just
                want to introduce yourself before sending a deal.
              </p>
              <p>
                When you&rsquo;re ready with a specific scheme, the{" "}
                <Link href="/deal-room" className="editorial-link">
                  Deal Room
                </Link>{" "}
                is the faster route. It captures enough detail on day one
                to start sourcing terms, and we come back with indicative
                pricing inside a working day.
              </p>
            </div>

            <div className="mt-10">
              <CTAButton href="/deal-room" variant="navy" size="lg">
                Go to the Deal Room
              </CTAButton>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div
              className="p-8 sm:p-10"
              style={{
                background: "var(--paper)",
                border: "1px solid var(--stone-dark)",
              }}
            >
              <div className="mb-8 flex items-center gap-4">
                <span
                  aria-hidden
                  className="block h-px w-10"
                  style={{ background: "var(--gold)" }}
                />
                <p
                  className="text-[11px] font-medium uppercase tracking-[0.32em]"
                  style={{ color: "var(--navy)" }}
                >
                  Quick enquiry
                </p>
              </div>
              <QuickEnquiryForm />
            </div>
          </div>
        </div>
      </EditorialSection>
    </>
  );
}
