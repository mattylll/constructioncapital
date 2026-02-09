import Link from "next/link";
import { Building2 } from "lucide-react";

import { SITE_NAME, CONTACT } from "@/lib/constants";

const footerLinks = {
  services: [
    { href: "/services", label: "All Services" },
    { href: "/services#development-finance", label: "Development Finance" },
    { href: "/services#mezzanine-finance", label: "Mezzanine Finance" },
    { href: "/services#bridging-loans", label: "Bridging Loans" },
    { href: "/services#equity-jv", label: "Equity & JV" },
    { href: "/services#refurbishment-finance", label: "Refurbishment Finance" },
    { href: "/services#commercial-mortgages", label: "Commercial Mortgages" },
    { href: "/services#development-exit-finance", label: "Development Exit" },
  ],
  company: [
    { href: "/about", label: "About Matt Lenzie" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/deal-room", label: "Deal Room" },
    { href: "/guides", label: "Guides" },
  ],
};

// Grouped by region for comprehensive internal linking
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
      { href: "/locations/buckinghamshire", label: "Buckinghamshire" },
      { href: "/locations/oxfordshire", label: "Oxfordshire" },
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
      { href: "/locations/wiltshire", label: "Wiltshire" },
      { href: "/locations/gloucestershire", label: "Gloucestershire" },
    ],
  },
  {
    region: "Midlands",
    links: [
      { href: "/locations/west-midlands", label: "West Midlands" },
      { href: "/locations/warwickshire", label: "Warwickshire" },
      { href: "/locations/staffordshire", label: "Staffordshire" },
      { href: "/locations/derbyshire", label: "Derbyshire" },
      { href: "/locations/nottinghamshire", label: "Nottinghamshire" },
      { href: "/locations/leicestershire", label: "Leicestershire" },
      { href: "/locations/northamptonshire", label: "Northamptonshire" },
      { href: "/locations/lincolnshire", label: "Lincolnshire" },
    ],
  },
  {
    region: "North",
    links: [
      { href: "/locations/greater-manchester", label: "Manchester" },
      { href: "/locations/west-yorkshire", label: "West Yorkshire" },
      { href: "/locations/south-yorkshire", label: "South Yorkshire" },
      { href: "/locations/lancashire", label: "Lancashire" },
      { href: "/locations/merseyside", label: "Merseyside" },
      { href: "/locations/cheshire", label: "Cheshire" },
      { href: "/locations/tyne-and-wear", label: "Tyne & Wear" },
      { href: "/locations/north-yorkshire", label: "North Yorkshire" },
    ],
  },
  {
    region: "East & Scotland & Wales",
    links: [
      { href: "/locations/norfolk", label: "Norfolk" },
      { href: "/locations/suffolk", label: "Suffolk" },
      { href: "/locations/cambridgeshire", label: "Cambridgeshire" },
      { href: "/locations/edinburgh", label: "Edinburgh" },
      { href: "/locations/glasgow", label: "Glasgow" },
      { href: "/locations/cardiff", label: "Cardiff" },
      { href: "/locations/swansea", label: "Swansea" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main grid — Brand, Services, Company */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-gold" />
              <span className="text-lg font-bold">{SITE_NAME}</span>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/70">
              Expert development finance brokerage. 25+ years sourcing the best
              terms for UK property developers.
            </p>
            <div className="mt-4 space-y-1 text-sm text-primary-foreground/70">
              <p>{CONTACT.email}</p>
              <p>{CONTACT.phone}</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
              Services
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick locations — top cities */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
              Popular Locations
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/locations"
                  className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-gold"
                >
                  All Locations
                </Link>
              </li>
              {[
                { href: "/locations/greater-london", label: "London" },
                { href: "/locations/greater-manchester", label: "Manchester" },
                { href: "/locations/west-midlands", label: "Birmingham" },
                { href: "/locations/west-yorkshire", label: "Leeds" },
                { href: "/locations/city-of-bristol", label: "Bristol" },
                { href: "/locations/edinburgh", label: "Edinburgh" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Regional location links — comprehensive internal linking */}
        <div className="mt-12 border-t border-primary-foreground/10 pt-8">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gold">
            Development Finance by Region
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {locationRegions.map((group) => (
              <div key={group.region}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground/40">
                  {group.region}
                </p>
                <ul className="space-y-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-xs text-primary-foreground/50 transition-colors hover:text-gold"
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

        {/* Disclaimer */}
        <div className="mt-12 border-t border-primary-foreground/10 pt-8">
          <p className="text-xs text-primary-foreground/50">
            Construction Capital is a trading name. We are a commercial finance
            broker, not a lender. All lending is subject to status and
            underwriting criteria. Your property may be repossessed if you do not
            keep up repayments on a mortgage or any other debt secured on it.
          </p>
          <p className="mt-4 text-xs text-primary-foreground/50">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
