"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Wordmark } from "@/components/layout/wordmark";
import { SERVICES } from "@/lib/services";

const primaryLinks = [
  { href: "/locations", label: "Locations" },
  { href: "/case-studies", label: "Case Studies" },
];

const resourceLinks = [
  { href: "/market-reports", label: "Market Reports", meta: "Local data & reports" },
  { href: "/guides", label: "Guides", meta: "Deep dives on every product" },
  { href: "/calculators", label: "Calculators", meta: "33 development-finance tools" },
  { href: "/glossary", label: "Glossary", meta: "Industry terms explained" },
  { href: "/faq", label: "FAQ", meta: "Common questions answered" },
];

const secondaryLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click / Escape.
  useEffect(() => {
    if (!servicesOpen && !resourcesOpen) return;
    function onDocumentClick(event: MouseEvent) {
      if (
        servicesOpen &&
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
      if (
        resourcesOpen &&
        resourcesRef.current &&
        !resourcesRef.current.contains(event.target as Node)
      ) {
        setResourcesOpen(false);
      }
    }
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setServicesOpen(false);
        setResourcesOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [servicesOpen, resourcesOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Wordmark tone="light" size="sm" />

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* Services dropdown */}
          <div ref={servicesRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setServicesOpen((prev) => !prev);
                setResourcesOpen(false);
              }}
              onMouseEnter={() => {
                setServicesOpen(true);
                setResourcesOpen(false);
              }}
              aria-expanded={servicesOpen}
              aria-haspopup="menu"
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Services
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  servicesOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {servicesOpen && (
              <div
                role="menu"
                onMouseLeave={() => setServicesOpen(false)}
                className="absolute left-0 top-full z-50 mt-2 w-[380px] border bg-background shadow-lg"
                style={{ borderColor: "oklch(0.85 0.01 250)" }}
              >
                <ul className="py-2">
                  {SERVICES.map((service) => (
                    <li key={service.slug}>
                      <Link
                        role="menuitem"
                        href={`/services/${service.slug}`}
                        onClick={() => setServicesOpen(false)}
                        className="flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-[oklch(0.75_0.12_85/0.06)]"
                      >
                        <span className="font-heading text-[15px] font-medium tracking-tight text-foreground">
                          {service.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {service.shortDesc}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div
                  className="border-t px-4 py-3"
                  style={{ borderColor: "oklch(0.85 0.01 250)" }}
                >
                  <Link
                    href="/services"
                    onClick={() => setServicesOpen(false)}
                    className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground hover:text-gold"
                  >
                    <span>View all services</span>
                    <span aria-hidden>&rarr;</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}

          {/* Resources dropdown */}
          <div ref={resourcesRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setResourcesOpen((prev) => !prev);
                setServicesOpen(false);
              }}
              onMouseEnter={() => {
                setResourcesOpen(true);
                setServicesOpen(false);
              }}
              aria-expanded={resourcesOpen}
              aria-haspopup="menu"
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Resources
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  resourcesOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {resourcesOpen && (
              <div
                role="menu"
                onMouseLeave={() => setResourcesOpen(false)}
                className="absolute right-0 top-full z-50 mt-2 w-[320px] border bg-background shadow-lg"
                style={{ borderColor: "oklch(0.85 0.01 250)" }}
              >
                <ul className="py-2">
                  {resourceLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        role="menuitem"
                        href={link.href}
                        onClick={() => setResourcesOpen(false)}
                        className="flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-[oklch(0.75_0.12_85/0.06)]"
                      >
                        <span className="font-heading text-[15px] font-medium tracking-tight text-foreground">
                          {link.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {link.meta}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {secondaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/deal-room"
            className="inline-flex h-9 items-center gap-1.5 bg-navy-dark px-5 text-[12px] font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-navy"
          >
            Start a deal
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="mt-8 flex flex-col gap-1">
              {/* Services - collapsible on mobile */}
              <button
                type="button"
                onClick={() => setMobileServicesOpen((prev) => !prev)}
                aria-expanded={mobileServicesOpen}
                className="flex items-center justify-between py-2 text-lg font-medium text-foreground transition-colors hover:text-gold"
              >
                Services
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    mobileServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileServicesOpen && (
                <div className="flex flex-col gap-1 border-l-2 border-gold/40 pl-4 py-1">
                  {SERVICES.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {service.name}
                    </Link>
                  ))}
                  <Link
                    href="/services"
                    onClick={() => setMobileOpen(false)}
                    className="py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark hover:text-gold"
                  >
                    View all services &rarr;
                  </Link>
                </div>
              )}

              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-lg font-medium text-foreground transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}

              <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                Resources
              </p>
              {resourceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 text-base font-medium text-foreground transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-6">
                {secondaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-lg font-medium text-foreground transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <Link
                href="/deal-room"
                onClick={() => setMobileOpen(false)}
                className="mt-6 inline-flex h-11 items-center justify-center bg-navy-dark px-6 text-[12px] font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-navy"
              >
                Start a deal
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
