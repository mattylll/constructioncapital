"use client";

import { useEffect } from "react";

export function WebVitals() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    import("web-vitals").then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      const send = (metric: { name: string; value: number; id: string }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        if (typeof w.gtag === "function") {
          w.gtag("event", metric.name, {
            event_category: "Web Vitals",
            value: Math.round(
              metric.name === "CLS" ? metric.value * 1000 : metric.value
            ),
            event_label: metric.id,
            non_interaction: true,
          });
        }
      };

      onCLS(send);
      onINP(send);
      onLCP(send);
      onFCP(send);
      onTTFB(send);
    });
  }, []);

  return null;
}
