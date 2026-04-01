"use client";

export const dynamic = "force-dynamic";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
              Something went wrong
            </h1>
            <button
              onClick={() => reset()}
              style={{ padding: "0.75rem 2rem", fontSize: "1rem", cursor: "pointer", borderRadius: "0.5rem", border: "none", background: "#1a1a2e", color: "#fff" }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
