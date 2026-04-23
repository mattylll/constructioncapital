"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowRight, Phone, BookOpen } from "lucide-react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/constants";

/**
 * Detects exit intent (mouse leaving viewport on desktop, or back-button on
 * mobile) and shows a recovery modal offering three options:
 *   1. Continue filling the form
 *   2. Quick callback request
 *   3. Download a relevant guide
 */
export function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const show = useCallback(() => {
    if (dismissed) return;
    setOpen(true);
    setDismissed(true); // only show once per page visit
  }, [dismissed]);

  useEffect(() => {
    // Desktop: mouse leaves viewport from the top
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) show();
    }

    // Mobile: detect back/forward navigation attempt
    function handlePopState() {
      // Push a dummy state back so the user stays on the page
      window.history.pushState(null, "", window.location.href);
      show();
    }

    // Push initial state for popstate detection
    window.history.pushState(null, "", window.location.href);

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [show]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="border-border/50 sm:max-w-md"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.16 0.04 255) 0%, oklch(0.13 0.03 255) 100%)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            Don&rsquo;t Leave Just Yet
          </DialogTitle>
          <DialogDescription className="text-white/50">
            We can have indicative terms on your desk within 24 hours. How would
            you like to proceed?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-3">
          {/* Option 1: Continue form */}
          <Button
            onClick={() => setOpen(false)}
            className="cta-shimmer h-12 bg-gold text-sm font-bold text-navy-dark hover:bg-gold-dark"
          >
            Continue My Application
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {/* Option 2: Quick callback */}
          <Button
            asChild
            variant="outline"
            className="h-12 border-white/15 bg-transparent text-sm text-white hover:bg-white/10 hover:text-white"
          >
            <a href={`tel:${CONTACT.phoneRaw}`}>
              <Phone className="mr-2 h-4 w-4" style={{ color: "var(--gold)" }} />
              Call Us: {CONTACT.phone}
            </a>
          </Button>

          {/* Option 3: Browse guides */}
          <Button
            asChild
            variant="outline"
            className="h-12 border-white/15 bg-transparent text-sm text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/guides">
              <BookOpen className="mr-2 h-4 w-4" style={{ color: "var(--gold)" }} />
              Browse Our Finance Guides
            </Link>
          </Button>
        </div>

        <p className="mt-3 text-center text-xs text-white/30">
          Your progress won&rsquo;t be lost - just come back to this tab.
        </p>
      </DialogContent>
    </Dialog>
  );
}
