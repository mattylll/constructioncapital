import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

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
          <Button
            asChild
            size="lg"
            className="bg-gold text-navy-dark hover:bg-gold-dark h-12 px-8 font-bold"
          >
            <Link href="/">
              Back to Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8">
            <Link href="/locations">
              <MapPin className="mr-2 h-4 w-4" />
              Explore Locations
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
