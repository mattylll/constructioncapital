"use client";

import { useState } from "react";
import { MessageSquare, FileText } from "lucide-react";

import { DealRoomForm } from "@/components/deal-room/deal-room-form";
import { QuickEnquiryForm } from "@/components/quick-enquiry-form";

const tabs = [
  {
    id: "quick" as const,
    label: "Quick Enquiry",
    icon: MessageSquare,
    description: "Just want to chat? Leave your details and we'll call you back.",
  },
  {
    id: "full" as const,
    label: "Full Application",
    icon: FileText,
    description: "Ready to go? Submit your deal for indicative terms within 24 hours.",
  },
];

export function DealRoomTabs() {
  const [activeTab, setActiveTab] = useState<"quick" | "full">("quick");

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
        <DealRoomForm />
      )}
    </div>
  );
}
