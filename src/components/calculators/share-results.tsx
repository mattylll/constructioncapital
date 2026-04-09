"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareResultsProps {
  /** URL search params string encoding the calculator inputs */
  params: string;
  /** Calculator slug for building the share URL */
  calculatorSlug: string;
}

export function ShareResults({ params, calculatorSlug }: ShareResultsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/calculators/${calculatorSlug}?${params}`
      : "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: "My Finance Calculation — Construction Capital",
        url: shareUrl,
      });
    } else {
      handleCopy();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="h-9 gap-2 text-xs"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Copy Link
          </>
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="h-9 gap-2 text-xs"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </Button>
    </div>
  );
}
