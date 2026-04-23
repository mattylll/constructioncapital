import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          color: "#d4a84a",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: "-0.06em",
          lineHeight: 1,
          paddingBottom: 2,
        }}
      >
        cc
      </div>
    ),
    { ...size },
  );
}
