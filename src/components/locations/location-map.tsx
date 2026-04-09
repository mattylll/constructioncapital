import { MapPin } from "lucide-react";

interface LocationMapProps {
  locationName: string;
  countyName: string;
}

export function LocationMap({ locationName, countyName }: LocationMapProps) {
  const query = encodeURIComponent(`${locationName}, ${countyName}, UK`);

  return (
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div
            className="mb-5 h-[2px] w-14"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />
          <div className="flex items-center gap-3">
            <MapPin
              className="h-5 w-5"
              style={{ color: "var(--gold-dark)" }}
            />
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {locationName}, {countyName}
            </h2>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border shadow-sm">
          <iframe
            title={`Map of ${locationName}, ${countyName}`}
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          />
        </div>

      </div>
    </section>
  );
}
