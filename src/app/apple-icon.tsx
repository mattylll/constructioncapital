import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#111b36",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 14,
            border: "1px solid #d4a84a",
            opacity: 0.55,
          }}
        />
        <div
          style={{
            color: "#d4a84a",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 120,
            letterSpacing: "-0.06em",
            lineHeight: 1,
            paddingBottom: 10,
          }}
        >
          cc
        </div>
      </div>
    ),
    { ...size },
  );
}
