import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PercentageInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
}

export function PercentageInput({
  id,
  label,
  value,
  onChange,
  suffix = "%",
}: PercentageInputProps) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      <div className="relative mt-1.5">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 pr-7"
          inputMode="decimal"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {suffix}
        </span>
      </div>
    </div>
  );
}
