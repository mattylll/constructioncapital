export function parseCurrency(value: string): number {
  return parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
}

export function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatCurrencyInput(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");
  
return digits ? parseInt(digits, 10).toLocaleString("en-GB") : "";
}
