"use client";

import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DealRoomTabs } from "@/components/deal-room/deal-room-tabs";
import { trackCTAClick } from "@/lib/analytics";

interface DealRoomCtaProps {
  params: Record<string, string>;
  label?: string;
}

/**
 * Opens the Deal Room form as a popup on top of the calculator instead of
 * navigating to /deal-room. Keeps the visitor's context (and the calculator
 * page's own URL/UTM params) intact — a full-page jump right after they've
 * just built out numbers felt disconnected.
 */
export function DealRoomCta({
  params,
  label = "Get Indicative Terms",
}: DealRoomCtaProps) {
  const ctaLabel = `calculator_cta:${params.source ?? "unknown"}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="cta-shimmer h-14 w-full bg-gold px-10 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark"
          data-cta={ctaLabel}
          onClick={() =>
            trackCTAClick(ctaLabel, window.location.pathname)
          }
        >
          {label}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            Send us the outline
          </DialogTitle>
          <DialogDescription>
            Two minutes now. We come back with indicative terms from the
            right lenders inside one working day — no commitment, no hard
            credit search.
          </DialogDescription>
        </DialogHeader>
        <Suspense fallback={null}>
          <DealRoomTabs
            prefill={{
              gdv: params.gdv,
              totalCost: params.total_cost,
              loanAmount: params.loan_amount,
              loanType: params.loan_type,
              town: params.town,
              source: params.source,
            }}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
