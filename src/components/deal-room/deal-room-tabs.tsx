"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare, FileText } from "lucide-react";

import {
  DealRoomForm,
  type DealRoomPrefill,
} from "@/components/deal-room/deal-room-form";
import { QuickEnquiryForm } from "@/components/quick-enquiry-form";

const tabs = [
  {
    id: "quick" as const,
    label: "Ask Matt",
    icon: MessageSquare,
    description: "Four fields and Matt calls you back. The fastest way to find out if your deal works.",
  },
  {
    id: "full" as const,
    label: "Send the Full Deal",
    icon: FileText,
    description: "Numbers ready? Send the outline and get Matt's indicative terms within 24 hours.",
  },
];

interface DealRoomTabsProps {
  /** Explicit prefill, used when opened as an in-page popup (see DealRoomForm). */
  prefill?: DealRoomPrefill;
}

export function DealRoomTabs({ prefill }: DealRoomTabsProps = {}) {
  const searchParams = useSearchParams();
  // Auto-switch to Full Application when calculator params are present
  const hasCalcParams =
    prefill?.gdv ||
    prefill?.loanAmount ||
    prefill?.source ||
    searchParams.get("gdv") ||
    searchParams.get("loan_amount") ||
    searchParams.get("source");
  const [activeTab, setActiveTab] = useState<"quick" | "full">(hasCalcParams ? "full" : "quick");

  return (
    <div>
      {/* Tab switcher */}
      <div className="mx-auto mb-12 flex max-w-md overflow-hidden rounded-xl border border-border">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-1 items-center justify-center gap-2.5 px-5 py-4 text-sm font-semibold transition-all duration-200"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.1), oklch(0.75 0.12 85 / 0.03))"
                  : "transparent",
                color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                borderBottom: isActive ? "2px solid var(--gold)" : "2px solid transparent",
              }}
            >
              <tab.icon className="h-4 w-4" style={{ color: isActive ? "var(--gold)" : undefined }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab description */}
      <p className="mx-auto mb-10 max-w-lg text-center text-sm text-muted-foreground">
        {tabs.find((t) => t.id === activeTab)?.description}
      </p>

      {/* Tab content */}
      {activeTab === "quick" ? (
        <div className="mx-auto max-w-md">
          <QuickEnquiryForm />
        </div>
      ) : (
        <DealRoomForm prefill={prefill} />
      )}
    </div>
  );
}
