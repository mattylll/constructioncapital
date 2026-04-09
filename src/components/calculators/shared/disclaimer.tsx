import { Info } from "lucide-react";

interface DisclaimerProps {
  text?: string;
}

export function Disclaimer({
  text = "Indicative figures only. Actual terms depend on the project, your experience and lender criteria. Contact us for a bespoke appraisal.",
}: DisclaimerProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
