import { Skeleton } from "@/components/ui/skeleton";

export default function ServiceLoading() {
  return (
    <>
      {/* Hero Skeleton */}
      <section className="hero-gradient noise-overlay relative overflow-hidden py-20 text-white sm:py-28">
        {/* Architectural grid background */}
        <div className="pointer-events-none absolute inset-0">
          <svg
            className="h-full w-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="loading-hero-grid"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 80 0 L 0 0 0 80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#loading-hero-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs skeleton */}
          <div className="mb-8 flex gap-2">
            <Skeleton className="h-4 w-16 bg-white/10" />
            <Skeleton className="h-4 w-4 bg-white/10" />
            <Skeleton className="h-4 w-20 bg-white/10" />
            <Skeleton className="h-4 w-4 bg-white/10" />
            <Skeleton className="h-4 w-24 bg-white/10" />
          </div>

          {/* Gold rule */}
          <div
            className="mb-8 h-[2px] w-20"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />

          {/* Location label skeleton */}
          <Skeleton className="mb-5 h-4 w-40 bg-white/10" />

          {/* Title skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-12 w-72 bg-white/10 sm:h-16 sm:w-96" />
            <Skeleton className="h-12 w-56 bg-white/10 sm:h-16 sm:w-80" />
          </div>

          {/* Description skeleton */}
          <div className="mt-6 max-w-2xl space-y-2">
            <Skeleton className="h-5 w-full bg-white/10" />
            <Skeleton className="h-5 w-4/5 bg-white/10" />
            <Skeleton className="h-5 w-3/4 bg-white/10" />
          </div>

          {/* CTA skeleton */}
          <div className="mt-10">
            <Skeleton className="h-14 w-56 bg-white/10" />
          </div>
        </div>

        {/* Bottom gold edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--gold) 20%, var(--gold) 80%, transparent 100%)",
            opacity: 0.35,
          }}
        />
      </section>

      {/* Market Commentary Skeleton */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Skeleton className="mb-5 h-[2px] w-14" />
            <Skeleton className="mb-6 h-8 w-64" />
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="mt-6 h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        </div>
      </section>

      {/* Rate Card Skeleton */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Skeleton className="mb-5 h-[2px] w-14" />
            <Skeleton className="mb-3 h-4 w-32" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-3 h-5 w-96" />
          </div>

          {/* Rate cards skeleton */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-6"
              >
                <Skeleton className="mb-4 h-12 w-12 rounded-xl" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="mt-2 h-7 w-32" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deal Example Skeleton */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Skeleton className="mb-5 h-[2px] w-14" />
            <Skeleton className="mb-3 h-4 w-36" />
            <Skeleton className="h-8 w-64" />
          </div>

          <div
            className="rounded-2xl p-8 sm:p-10"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.18 0.05 255) 0%, oklch(0.22 0.06 255) 100%)",
            }}
          >
            <Skeleton className="mb-4 h-7 w-56 bg-white/10" />
            <Skeleton className="mb-2 h-5 w-full max-w-2xl bg-white/10" />
            <Skeleton className="mb-8 h-5 w-4/5 max-w-2xl bg-white/10" />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="mb-1 h-4 w-16 bg-white/10" />
                  <Skeleton className="h-7 w-28 bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Skeleton */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Skeleton className="mb-5 h-[2px] w-14" />
            <Skeleton className="mb-3 h-4 w-36" />
            <Skeleton className="h-8 w-48" />
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-border py-4">
                <Skeleton className="h-5 w-full max-w-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
