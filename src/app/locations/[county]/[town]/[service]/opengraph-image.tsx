import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Property Finance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function deslugify(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function Image({
  params,
}: {
  params: Promise<{ county: string; town: string; service: string }>;
}) {
  const { county, town, service } = await params;
  const countyName = deslugify(county);
  const townName = deslugify(town);
  const serviceName = deslugify(service);

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
        {/* Gold accent line */}
        <div
          style={{
            width: "80px",
            height: "4px",
            background: "linear-gradient(90deg, #c9a84c, #dfc06a)",
            marginBottom: "24px",
          }}
        />

        {/* Location label */}
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#c9a84c",
            marginBottom: "16px",
          }}
        >
          {townName}, {countyName}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          {serviceName}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "22px",
            color: "rgba(255, 255, 255, 0.6)",
            lineHeight: 1.4,
            maxWidth: "700px",
          }}
        >
          Expert {serviceName.toLowerCase()} for property developers. 100+ lender panel, 25+ years experience.
        </div>

        {/* Brand bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "40px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#c9a84c",
            }}
          >
            Construction Capital
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.4)",
            }}
          >
            constructioncapital.co.uk
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
