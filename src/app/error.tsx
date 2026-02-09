"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="text-center">
        <p
          className="mb-4 text-6xl font-bold"
          style={{ color: "var(--gold)" }}
        >
          Error
        </p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          Something Went Wrong
        </h1>
        <p className="mx-auto mb-10 max-w-md text-lg text-muted-foreground">
          We encountered an unexpected error. Please try again.
        </p>
        <Button
          onClick={reset}
          size="lg"
          className="bg-gold text-navy-dark hover:bg-gold-dark h-12 px-8 font-bold"
        >
          Try Again
        </Button>
      </div>
    </section>
  );
}
