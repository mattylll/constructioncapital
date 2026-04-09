import { Suspense, type ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StickyCTA } from "@/components/ui/sticky-cta";

export function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <SiteHeader />
      </Suspense>
      <main className="min-h-screen pb-16 md:pb-0">{children}</main>
      <SiteFooter />
      <Suspense fallback={null}>
        <StickyCTA />
      </Suspense>
    </>
  );
}
