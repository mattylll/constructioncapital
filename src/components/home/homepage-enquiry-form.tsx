"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FINANCE_TYPES = [
  "Development Finance",
  "Mezzanine Finance",
  "Bridging Loans",
  "Equity & JV",
  "Refurbishment Finance",
  "Commercial Mortgages",
  "Development Exit",
  "Not Sure Yet",
];

export function HomepageEnquiryForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    financeType: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.financeType
            ? `Finance type: ${formData.financeType}`
            : undefined,
          source_page: "homepage",
        }),
      });

      if (!res.ok) throw new Error("Submission failed");

      setIsSubmitted(true);
      toast.success("Enquiry sent successfully");
    } catch {
      toast.error(
        "Something went wrong. Please try again or call us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
            border: "2px solid var(--gold)",
          }}
        >
          <CheckCircle2 className="h-7 w-7" style={{ color: "var(--gold)" }} />
        </div>
        <h3 className="mb-2 text-xl font-bold text-white">Thank You</h3>
        <p className="text-sm text-white/40">
          We&rsquo;ve received your enquiry and will be in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="hp-name" className="text-sm font-semibold text-white/60">
            Name *
          </Label>
          <Input
            id="hp-name"
            placeholder="Your full name"
            value={formData.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            className="mt-1.5 h-11 border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:border-[var(--gold)] focus:ring-[var(--gold)]"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm" style={{ color: "var(--red)" }}>{errors.fullName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="hp-email" className="text-sm font-semibold text-white/60">
            Email *
          </Label>
          <Input
            id="hp-email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="mt-1.5 h-11 border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:border-[var(--gold)] focus:ring-[var(--gold)]"
          />
          {errors.email && (
            <p className="mt-1 text-sm" style={{ color: "var(--red)" }}>{errors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="hp-phone" className="text-sm font-semibold text-white/60">
            Phone *
          </Label>
          <Input
            id="hp-phone"
            type="tel"
            placeholder="+44 7700 900000"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="mt-1.5 h-11 border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:border-[var(--gold)] focus:ring-[var(--gold)]"
          />
          {errors.phone && (
            <p className="mt-1 text-sm" style={{ color: "var(--red)" }}>{errors.phone}</p>
          )}
        </div>

        <div>
          <Label htmlFor="hp-finance" className="text-sm font-semibold text-white/60">
            Finance Type
          </Label>
          <select
            id="hp-finance"
            value={formData.financeType}
            onChange={(e) => updateField("financeType", e.target.value)}
            className="mt-1.5 flex h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
          >
            <option value="" className="bg-[oklch(0.12_0.045_255)]">Select type...</option>
            {FINANCE_TYPES.map((type) => (
              <option key={type} value={type} className="bg-[oklch(0.12_0.045_255)]">
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="cta-shimmer bg-gold text-navy-dark hover:bg-gold-dark h-12 w-full rounded-none text-sm font-black uppercase tracking-[0.2em] transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_0_40px_oklch(0.75_0.12_85/0.2)] sm:w-auto sm:px-16"
        >
          {isSubmitting ? "Sending..." : "Get Indicative Terms"}
          {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
}
