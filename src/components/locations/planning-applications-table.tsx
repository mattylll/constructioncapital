import { FileCheck, Clock, ExternalLink } from "lucide-react";
import type { PlanningApp, PlanningData } from "@/lib/local-market-data";

interface PlanningApplicationsTableProps {
  approved: PlanningApp[];
  pending: PlanningApp[];
  summary: PlanningData["summary"];
  townName: string;
}

function formatGBP(amount: number): string {
  if (amount >= 1_000_000) {
    return `£${(amount / 1_000_000).toFixed(1)}M`;
  }
  
return `£${amount.toLocaleString("en-GB")}`;
}

function truncate(str: string, len: number): string {
  return str.length > len ? str.substring(0, len) + "…" : str;
}

function ApplicationRow({ app }: { app: PlanningApp }) {
  const isApproved =
    app.status === "Approved" ||
    app.decision.toLowerCase().includes("approved") ||
    app.decision.toLowerCase().includes("conditional permission") ||
    app.decision.toLowerCase().includes("consent");

  return (
    <tr className="border-b border-border/50 last:border-0">
      <td className="whitespace-nowrap px-4 py-3">
        {app.sourceUrl ? (
          <a
            href={app.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-gold-dark hover:text-gold"
          >
            {app.reference}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="font-mono text-xs">{app.reference}</span>
        )}
      </td>
      <td className="max-w-[250px] px-4 py-3">
        <p className="truncate text-sm">{truncate(app.proposal, 80)}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {app.address}
        </p>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-center text-sm">
        {app.units ?? "-"}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
        {app.estimatedGdv ? formatGBP(app.estimatedGdv) : "-"}
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            isApproved
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gold/10 text-gold-dark"
          }`}
        >
          {isApproved ? "Approved" : "Pending"}
        </span>
      </td>
      <td className="hidden whitespace-nowrap px-4 py-3 text-xs text-muted-foreground sm:table-cell">
        {app.decisionDate || app.receivedDate}
      </td>
    </tr>
  );
}

export function PlanningApplicationsTable({
  approved,
  pending,
  summary,
  townName,
}: PlanningApplicationsTableProps) {
  const topApproved = approved.slice(0, 5);
  const topPending = pending.slice(0, 5);

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="mb-5 h-[2px] w-14"
          style={{
            background:
              "linear-gradient(90deg, var(--gold), var(--gold-light))",
          }}
        />
        <p
          className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
          style={{ color: "var(--gold-dark)" }}
        >
          Planning Pipeline
        </p>
        <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Planning Activity in {townName}
        </h2>

        {/* Pipeline summary banner */}
        <div className="mb-8 flex flex-wrap gap-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-sm">
              <strong>{summary.approved}</strong> approved (12m)
            </span>
          </div>
          <span className="text-border">·</span>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gold" />
            <span className="text-sm">
              <strong>{summary.pending}</strong> pending
            </span>
          </div>
          <span className="text-border">·</span>
          <span className="text-sm">
            <strong>{summary.totalUnits.toLocaleString("en-GB")}</strong> units
            in pipeline
          </span>
          <span className="text-border">·</span>
          <span className="text-sm">
            <strong>{formatGBP(summary.totalEstimatedGDV)}</strong> estimated
            GDV
          </span>
          <span className="text-border">·</span>
          <span className="text-sm">
            <strong>{summary.approvalRate}%</strong> approval rate
          </span>
        </div>

        {/* Approved applications */}
        {topApproved.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <FileCheck className="h-5 w-5 text-emerald-500" />
              Recently Approved
            </h3>
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold">Ref</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Proposal
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Units
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Est. GDV
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Status
                    </th>
                    <th className="hidden px-4 py-3 text-left font-semibold sm:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topApproved.map((app) => (
                    <ApplicationRow key={app.reference} app={app} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pending applications */}
        {topPending.length > 0 && (
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Clock className="h-5 w-5 text-gold" />
              Current Applications
            </h3>
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold">Ref</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Proposal
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Units
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Est. GDV
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Status
                    </th>
                    <th className="hidden px-4 py-3 text-left font-semibold sm:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topPending.map((app) => (
                    <ApplicationRow key={app.reference} app={app} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
