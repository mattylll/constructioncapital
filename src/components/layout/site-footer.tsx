import Link from "next/link";

import { CONTACT, SITE_NAME } from "@/lib/constants";
import { Wordmark } from "@/components/layout/wordmark";

const primaryLinks = {
  services: [
    { href: "/services/development-finance", label: "Development Finance" },
    { href: "/services/mezzanine-finance", label: "Mezzanine Finance" },
    { href: "/services/bridging-loans", label: "Bridging Loans" },
    { href: "/services/equity-jv", label: "Equity & JV" },
    { href: "/services/refurbishment-finance", label: "Refurbishment" },
    { href: "/services/commercial-mortgages", label: "Commercial Mortgages" },
    { href: "/services/development-exit-finance", label: "Development Exit" },
  ],
  firm: [
    { href: "/about", label: "About Matt Lenzie" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/lender-panel", label: "Lender Panel" },
    { href: "/contact", label: "Contact" },
    { href: "/deal-room", label: "Start a deal" },
  ],
  resources: [
    { href: "/market-reports", label: "Market Reports" },
    { href: "/guides", label: "Guides" },
    { href: "/calculators", label: "Calculators" },
    { href: "/glossary", label: "Glossary" },
    { href: "/faq", label: "FAQ" },
  ],
};

const locationRegions = [
  {
    region: "London & South East",
    links: [
      { href: "/locations/greater-london", label: "London" },
      { href: "/locations/kent", label: "Kent" },
      { href: "/locations/surrey", label: "Surrey" },
      { href: "/locations/sussex", label: "Sussex" },
      { href: "/locations/hampshire", label: "Hampshire" },
      { href: "/locations/berkshire", label: "Berkshire" },
      { href: "/locations/hertfordshire", label: "Hertfordshire" },
      { href: "/locations/essex", label: "Essex" },
    ],
  },
  {
    region: "South West",
    links: [
      { href: "/locations/city-of-bristol", label: "Bristol" },
      { href: "/locations/somerset", label: "Somerset" },
      { href: "/locations/devon", label: "Devon" },
      { href: "/locations/cornwall", label: "Cornwall" },
      { href: "/locations/dorset", label: "Dorset" },
      { href: "/locations/gloucestershire", label: "Gloucestershire" },
    ],
  },
  {
    region: "Midlands",
    links: [
      { href: "/locations/west-midlands", label: "Birmingham" },
      { href: "/locations/warwickshire", label: "Warwickshire" },
      { href: "/locations/staffordshire", label: "Staffordshire" },
      { href: "/locations/nottinghamshire", label: "Nottingham" },
      { href: "/locations/leicestershire", label: "Leicester" },
      { href: "/locations/lincolnshire", label: "Lincolnshire" },
    ],
  },
  {
    region: "North",
    links: [
      { href: "/locations/greater-manchester", label: "Manchester" },
      { href: "/locations/west-yorkshire", label: "Leeds" },
      { href: "/locations/merseyside", label: "Liverpool" },
      { href: "/locations/lancashire", label: "Lancashire" },
      { href: "/locations/tyne-and-wear", label: "Newcastle" },
      { href: "/locations/north-yorkshire", label: "York" },
    ],
  },
  {
    region: "Scotland & Wales",
    links: [
      { href: "/locations/edinburgh", label: "Edinburgh" },
      { href: "/locations/glasgow", label: "Glasgow" },
      { href: "/locations/cardiff", label: "Cardiff" },
      { href: "/locations/swansea", label: "Swansea" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer
      className="relative"
      style={{ background: "oklch(0.12 0.045 255)", color: "oklch(1 0 0 / 0.85)" }}
    >
      <div className="mx-auto max-w-[1280px] px-6 pb-12 pt-16 sm:px-10 sm:pb-16 sm:pt-20">
        {/* Masthead + link columns (single band — contact details live above, in the Start-a-deal section) */}
        <div className="grid grid-cols-1 gap-12 border-b pb-14 lg:grid-cols-12 lg:gap-16"
             style={{ borderColor: "oklch(1 0 0 / 0.1)" }}>
          <div className="lg:col-span-5">
            <Wordmark tone="dark" size="md" />
            <p
              className="mt-6 max-w-sm text-[15px] leading-[1.65]"
              style={{ color: "oklch(1 0 0 / 0.6)" }}
            >
              Independent London brokerage. 25+ years of property-finance
              experience, distilled into one principal.
            </p>
            <p
              className="mt-8 text-[10px] font-medium uppercase tracking-[0.3em]"
              style={{ color: "oklch(1 0 0 / 0.4)" }}
            >
              {CONTACT.address}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-7 lg:gap-12">
            <FooterColumn eyebrow="Services" links={primaryLinks.services} />
            <FooterColumn eyebrow="The firm" links={primaryLinks.firm} />
            <FooterColumn eyebrow="Resources" links={primaryLinks.resources} />
          </div>
        </div>

        {/* Regional list — restrained editorial treatment */}
        <div className="border-b py-12" style={{ borderColor: "oklch(1 0 0 / 0.1)" }}>
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <div className="flex items-center gap-4">
              <span
                className="block h-px w-8"
                style={{ background: "var(--gold)" }}
                aria-hidden
              />
              <p
                className="text-[10px] font-medium uppercase tracking-[0.3em]"
                style={{ color: "var(--gold-light)" }}
              >
                Nationwide coverage
              </p>
            </div>
            <Link
              href="/locations"
              className="editorial-link text-[12px] font-medium uppercase tracking-[0.2em]"
              style={{ color: "oklch(1 0 0 / 0.75)" }}
            >
              All locations
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {locationRegions.map((group) => (
              <div key={group.region}>
                <p
                  className="font-heading mb-3 text-[15px] font-medium"
                  style={{ color: "oklch(1 0 0 / 0.88)" }}
                >
                  {group.region}
                </p>
                <ul className="space-y-1.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[13px] leading-tight transition-colors hover:text-white"
                        style={{ color: "oklch(1 0 0 / 0.55)" }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance + colophon */}
        <div className="pt-10">
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
            <p
              className="text-[12px] leading-[1.7]"
              style={{ color: "oklch(1 0 0 / 0.55)" }}
            >
              Construction Capital is an independent commercial finance
              brokerage arranging funding for UK property developers and
              investors. Property development finance, commercial bridging
              and other business-purpose lending are not regulated
              activities under FSMA 2000 and are not regulated by the
              Financial Conduct Authority.
            </p>
            <p
              className="text-[12px] leading-[1.7]"
              style={{ color: "oklch(1 0 0 / 0.55)" }}
            >
              Where a product is a regulated activity &mdash; for example,
              bridging secured on a borrower&rsquo;s main residence &mdash;
              we arrange it through lenders who hold the relevant FCA
              permissions. We are not an FCA-authorised firm. Every offer
              is subject to the lender&rsquo;s underwriting, valuation and
              legal due diligence.
            </p>
          </div>

          <p
            className="mt-8 text-[12px] leading-[1.7]"
            style={{ color: "oklch(1 0 0 / 0.5)" }}
          >
            Construction Capital is a trading name of Lenzie Consulting
            Ltd, a company registered in England &amp; Wales under
            company number 08174104. Registered office: Lynch Farm,
            The Lynch, Kensworth, Dunstable, Bedfordshire LU6 3QZ.
          </p>

          <div
            className="mt-8 flex flex-col items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center"
            style={{ borderColor: "oklch(1 0 0 / 0.08)" }}
          >
            <p
              className="text-[12px]"
              style={{ color: "oklch(1 0 0 / 0.45)" }}
            >
              &copy; {new Date().getFullYear()} {SITE_NAME}. All rights
              reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link
                href="/privacy"
                className="text-[12px] transition-colors hover:text-white"
                style={{ color: "oklch(1 0 0 / 0.5)" }}
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-[12px] transition-colors hover:text-white"
                style={{ color: "oklch(1 0 0 / 0.5)" }}
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-[12px] transition-colors hover:text-white"
                style={{ color: "oklch(1 0 0 / 0.5)" }}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  eyebrow,
  links,
}: {
  eyebrow: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p
        className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em]"
        style={{ color: "var(--gold-light)" }}
      >
        {eyebrow}
      </p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[14px] leading-tight transition-colors hover:text-white"
              style={{ color: "oklch(1 0 0 / 0.7)" }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

