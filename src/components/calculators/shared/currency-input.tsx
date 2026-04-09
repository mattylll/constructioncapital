import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CurrencyInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function CurrencyInput({ id, label, value, onChange }: CurrencyInputProps) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      <div className="relative mt-1.5">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          £
        </span>
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 pl-7"
          inputMode="numeric"
        />
      </div>
    </div>
  );
}
