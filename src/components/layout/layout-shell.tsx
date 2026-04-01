import { Suspense, type ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <SiteHeader />
      </Suspense>
      <main className="min-h-screen">{children}</main>
      <SiteFooter />
    </>
  );
}
