import { formatGBP } from "./calculator-utils";

interface StackBarProps {
  label: string;
  amount: number;
  total: number;
  color: string;
}

export function StackBar({ label, amount, total, color }: StackBarProps) {
  const pct = total > 0 ? Math.min(100, (amount / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {formatGBP(amount)} ({pct.toFixed(0)}%)
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
