import type { Metadata } from "next";
import { Suspense } from "react";

import {
  EditorialSection,
  PageHero,
} from "@/components/editorial/primitives";
import { DealRoomTabs } from "@/components/deal-room/deal-room-tabs";
import { ExitIntentModal } from "@/components/deal-room/exit-intent-modal";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Deal Room",
  description:
    "Submit your development finance deal. Get indicative terms within 24 hours from our panel of 100+ lenders across the UK.",
};

export default function DealRoomPage() {
  return (
    <>
      <PageHero
        tone="paper"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Deal Room" }]}
        eyebrow="Start a deal"
        title={
          <>
            Send us the outline.
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              Terms by tomorrow.
            </span>
          </>
        }
        deck={
          <>
            Two minutes now. We come back with indicative terms from the
            right lenders inside one working day &mdash; no commitment, no
            hard credit search.
          </>
        }
        stats={[
          { label: "Indicative terms", value: "24hr" },
          { label: "Lender panel", value: "100+" },
          { label: "Upfront fees", value: "None" },
        ]}
        actions={
          <a
            href={`tel:${CONTACT.phoneRaw}`}
            className="numeral-tabular editorial-link inline-flex h-14 items-center text-lg font-medium tracking-tight"
            style={{ color: "var(--navy-dark)" }}
          >
            Or call {CONTACT.phone} directly
          </a>
        }
      />

      <EditorialSection tone="paper">
        <Suspense>
          <DealRoomTabs />
        </Suspense>
      </EditorialSection>

      <Suspense>
        <ExitIntentModal />
      </Suspense>
    </>
  );
}
