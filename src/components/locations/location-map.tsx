import {
  EditorialSection,
  SectionHeader,
} from "@/components/editorial/primitives";

interface LocationMapProps {
  locationName: string;
  countyName: string;
}

export function LocationMap({ locationName, countyName }: LocationMapProps) {
  const query = encodeURIComponent(`${locationName}, ${countyName}, UK`);

  return (
    <EditorialSection tone="stone">
      <SectionHeader
        tone="stone"
        eyebrow="Where we fund"
        title={
          <>
            {locationName},
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              {countyName}.
            </span>
          </>
        }
      />

      <div
        className="mt-16 overflow-hidden border"
        style={{ borderColor: "var(--stone-dark)" }}
      >
        <iframe
          title={`Map of ${locationName}, ${countyName}`}
          width="100%"
          height="460"
          style={{ border: 0, display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
        />
      </div>
    </EditorialSection>
  );
}
