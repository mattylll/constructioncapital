import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Development Finance";
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
  params: Promise<{ county: string }>;
}) {
  const { county } = await params;
  const countyName = deslugify(county);

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

        {/* Subtitle */}
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
          Development Finance
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          Property Finance in {countyName}
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
          Senior debt, mezzanine, bridging loans & equity partnerships from 100+ lenders
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
