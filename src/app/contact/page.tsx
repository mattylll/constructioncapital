import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

import { CONTACT } from "@/lib/constants";
import { QuickEnquiryForm } from "@/components/quick-enquiry-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Construction Capital. Call, email, or send us a quick enquiry about your development finance needs.",
};

const contactMethods = [
  {
    icon: Phone,
    label: "Call Us",
    value: CONTACT.phone,
    href: `tel:${CONTACT.phoneRaw}`,
    description: "Speak directly with our team",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    description: "We reply within a few hours",
  },
  {
    icon: MapPin,
    label: "Location",
    value: CONTACT.address,
    href: undefined,
    description: "Meetings by appointment",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon - Fri, 9am - 6pm",
    href: undefined,
    description: "GMT / BST",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ━━━ HERO ━━━ */}
      <section
        className="noise-overlay relative overflow-hidden text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.05 255) 0%, oklch(0.22 0.06 255) 50%, oklch(0.18 0.05 260) 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="contact-grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contact-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div
              className="animate-fade-in mx-auto mb-8 h-[2px] w-20"
              style={{
                background:
                  "linear-gradient(90deg, var(--gold), var(--gold-light))",
              }}
            />
            <p
              className="animate-fade-up mb-5 text-xs font-bold uppercase tracking-[0.3em] sm:text-sm"
              style={{ color: "var(--gold)" }}
            >
              Get in Touch
            </p>
            <h1 className="animate-fade-up delay-100 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Let&rsquo;s Talk{" "}
              <span className="gold-gradient-text italic">Finance</span>
            </h1>
            <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
              Whether you have a deal ready to go or just want to explore your
              options, we&rsquo;re here to help.
            </p>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
            opacity: 0.3,
          }}
        />
      </section>

      {/* ━━━ CONTACT METHODS + FORM ━━━ */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            {/* Left — Contact details */}
            <div>
              <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Contact Details
              </h2>
              <p className="mb-10 text-muted-foreground">
                Reach out however suits you best. No obligation, no pressure.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                {contactMethods.map((method) => {
                  const content = (
                    <div
                      className="group rounded-xl p-6 transition-all duration-200"
                      style={{
                        background: "oklch(0.25 0.06 255 / 0.03)",
                        border: "1px solid oklch(0.25 0.06 255 / 0.06)",
                      }}
                    >
                      <div
                        className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.12), oklch(0.75 0.12 85 / 0.04))",
                        }}
                      >
                        <method.icon
                          className="h-5 w-5"
                          style={{ color: "var(--gold)" }}
                        />
                      </div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {method.label}
                      </p>
                      <p className="font-semibold">{method.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  );

                  if (method.href) {
                    return (
                      <a
                        key={method.label}
                        href={method.href}
                        className="block transition-transform hover:scale-[1.02]"
                      >
                        {content}
                      </a>
                    );
                  }
                  return <div key={method.label}>{content}</div>;
                })}
              </div>

              {/* Deal room CTA */}
              <div
                className="mt-10 rounded-xl p-6"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.25 0.06 255 / 0.06), oklch(0.25 0.06 255 / 0.02))",
                  border: "1px solid oklch(0.25 0.06 255 / 0.08)",
                }}
              >
                <p className="mb-2 font-bold">Ready to submit a deal?</p>
                <p className="mb-4 text-sm text-muted-foreground">
                  Use our Deal Room for a full application with project details
                  and financials. Get indicative terms within 24 hours.
                </p>
                <Link
                  href="/deal-room"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: "var(--gold)" }}
                >
                  Go to Deal Room
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right — Quick enquiry form */}
            <div>
              <div
                className="rounded-2xl p-8 sm:p-10"
                style={{
                  background: "oklch(0.25 0.06 255 / 0.02)",
                  border: "1px solid oklch(0.25 0.06 255 / 0.06)",
                }}
              >
                <h2 className="mb-2 text-xl font-bold tracking-tight">
                  Quick Enquiry
                </h2>
                <p className="mb-8 text-sm text-muted-foreground">
                  Leave your details and we&rsquo;ll get back to you promptly.
                </p>
                <QuickEnquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
