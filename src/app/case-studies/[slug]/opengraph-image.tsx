import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Construction Capital Case Study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Inline the case study data lookup to keep edge-compatible
const CASE_STUDY_TITLES: Record<string, { title: string; location: string; gdv: string; loanType: string }> = {
  "residential-scheme-manchester": { title: "12-Unit Residential Scheme", location: "Manchester", gdv: "£3.2M", loanType: "Development Finance" },
  "mixed-use-conversion-birmingham": { title: "Mixed-Use Conversion", location: "Birmingham", gdv: "£5.8M", loanType: "Development + Mezzanine" },
  "auction-purchase-london": { title: "Auction Purchase Bridge", location: "London", gdv: "£1.8M", loanType: "Bridging Loan" },
  "jv-residential-bristol": { title: "JV Residential Scheme", location: "Bristol", gdv: "£8.5M", loanType: "Equity & JV" },
  "hmo-conversion-leeds": { title: "HMO Conversion Project", location: "Leeds", gdv: "£950K", loanType: "Refurbishment Finance" },
  "commercial-acquisition-edinburgh": { title: "Office Block Acquisition", location: "Edinburgh", gdv: "£4.2M", loanType: "Commercial Mortgage" },
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = CASE_STUDY_TITLES[slug];
  const title = cs?.title ?? "Case Study";
  const subtitle = cs ? `${cs.location} — ${cs.gdv} GDV` : "Real Developer Success Stories";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px",
          background: "linear-gradient(135deg, #0d1b3e 0%, #162a5c 50%, #1a3268 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ width: "80px", height: "4px", background: "linear-gradient(90deg, #c9a84c, #dfc06a)", marginBottom: "24px" }} />
        <div style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "16px" }}>
          Case Study
        </div>
        <div style={{ fontSize: "56px", fontWeight: 700, color: "#ffffff", lineHeight: 1.1, marginBottom: "20px" }}>
          {title}
        </div>
        <div style={{ fontSize: "24px", color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.4 }}>
          {subtitle}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "40px", paddingTop: "24px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#c9a84c" }}>Construction Capital</div>
          <div style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.4)" }}>constructioncapital.co.uk</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
