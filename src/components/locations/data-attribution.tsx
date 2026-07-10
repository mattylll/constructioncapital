/**
 * Dated source attribution for data modules. AI search engines and quality
 * raters both reward stats with named, dated sources — and the weekly data
 * refresh keeps these dates current automatically.
 */

function formatMonthYear(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  
return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

interface DataAttributionProps {
  /** ISO date of the sold-data snapshot */
  soldDataUpdatedAt?: string;
  /** Local planning authority name, e.g. "Leeds City Council" */
  planningAuthority?: string;
  /** ISO date the planning register was retrieved */
  planningRetrievedAt?: string;
}

export function DataAttribution({
  soldDataUpdatedAt,
  planningAuthority,
  planningRetrievedAt,
}: DataAttributionProps) {
  const soldDate = formatMonthYear(soldDataUpdatedAt);
  const planningDate = formatMonthYear(planningRetrievedAt);

  const parts: string[] = [];
  if (soldDate) {
    parts.push(`HM Land Registry price paid data, 12 months to ${soldDate}`);
  }
  if (planningAuthority) {
    parts.push(
      `${planningAuthority} planning register${planningDate ? `, retrieved ${planningDate}` : ""}`
    );
  }
  if (parts.length === 0) return null;

  return (
    <p className="mx-auto mt-6 max-w-4xl px-1 text-xs text-muted-foreground">
      Source: {parts.join(" · ")}. Contains HM Land Registry data © Crown
      copyright and database right, licensed under the Open Government Licence
      v3.0.
    </p>
  );
}
