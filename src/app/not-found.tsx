import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="text-center">
        <p
          className="mb-4 text-8xl font-bold"
          style={{ color: "var(--gold)" }}
        >
          404
        </p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          Page Not Found
        </h1>
        <p className="mx-auto mb-10 max-w-md text-lg text-muted-foreground">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been
          moved.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="cta-shimmer inline-flex h-12 items-center justify-center rounded-md bg-gold px-8 text-base font-bold text-navy-dark shadow-lg transition-all duration-300 hover:bg-gold-dark"
          >
            Back to Home
          </Link>
          <Link
            href="/locations"
            className="inline-flex h-12 items-center justify-center rounded-md border bg-background px-8 text-base font-medium shadow-xs hover:bg-accent hover:text-accent-foreground"
          >
            Explore Locations
          </Link>
        </div>
      </div>
    </section>
  );
}
