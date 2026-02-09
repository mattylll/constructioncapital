"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  PoundSterling,
  User,
} from "lucide-react";

import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const LOAN_TYPES = [
  "Development Finance",
  "Mezzanine Finance",
  "Bridging Loan",
  "Equity & Joint Venture",
  "Refurbishment Finance",
  "Commercial Mortgage",
  "Development Exit Finance",
] as const;

const PROJECT_TYPES = [
  "Ground-Up Residential",
  "Ground-Up Commercial",
  "Ground-Up Mixed-Use",
  "Heavy Refurbishment",
  "Light Refurbishment",
  "Conversion (PDR)",
  "HMO Conversion",
  "Land Purchase",
  "Refinance",
  "Other",
] as const;

interface FormData {
  // Step 1: Project
  projectLocation: string;
  postcode: string;
  projectType: string;
  units: string;
  // Step 2: Financials
  gdv: string;
  totalCost: string;
  loanAmount: string;
  loanType: string;
  additionalInfo: string;
  // Step 3: Contact
  fullName: string;
  email: string;
  phone: string;
  company: string;
}

const initialFormData: FormData = {
  projectLocation: "",
  postcode: "",
  projectType: "",
  units: "",
  gdv: "",
  totalCost: "",
  loanAmount: "",
  loanType: "",
  additionalInfo: "",
  fullName: "",
  email: "",
  phone: "",
  company: "",
};

const steps = [
  { number: 1, label: "Project", icon: Building2 },
  { number: 2, label: "Financials", icon: PoundSterling },
  { number: 3, label: "Contact", icon: User },
];

function parseCurrencyToNumber(value: string): number {
  const num = parseInt(value.replace(/[^0-9]/g, ""), 10);
  return isNaN(num) ? 0 : num;
}

export function DealRoomForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const submitLead = useMutation(api.leads.submit);

  function updateField(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validateStep(step: number): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!formData.projectLocation.trim())
        newErrors.projectLocation = "Project location is required";
      if (!formData.postcode.trim())
        newErrors.postcode = "Postcode is required";
      if (!formData.projectType)
        newErrors.projectType = "Please select a project type";
    }

    if (step === 2) {
      if (!formData.gdv.trim()) newErrors.gdv = "GDV is required";
      if (!formData.loanAmount.trim())
        newErrors.loanAmount = "Loan amount is required";
      if (!formData.loanType)
        newErrors.loanType = "Please select a loan type";

      // Validate minimum loan amount (£500k)
      const loanNum = parseCurrencyToNumber(formData.loanAmount);
      if (formData.loanAmount.trim() && loanNum > 0 && loanNum < 500000) {
        newErrors.loanAmount = "Minimum loan amount is £500,000";
      }
    }

    if (step === 3) {
      if (!formData.fullName.trim())
        newErrors.fullName = "Full name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (
        formData.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  }

  function handleBack() {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  async function handleSubmit() {
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      const unitsNum = parseInt(formData.units.replace(/[^0-9]/g, ""), 10);

      await submitLead({
        project_location: formData.projectLocation.trim(),
        project_postcode: formData.postcode.trim() || undefined,
        gdv: parseCurrencyToNumber(formData.gdv),
        total_cost: parseCurrencyToNumber(formData.totalCost),
        loan_amount: parseCurrencyToNumber(formData.loanAmount),
        loan_type: formData.loanType,
        project_type: formData.projectType || undefined,
        units: isNaN(unitsNum) ? undefined : unitsNum,
        additional_info: formData.additionalInfo.trim() || undefined,
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim() || undefined,
        source_page: typeof window !== "undefined" ? window.location.pathname : "/deal-room",
        utm_source: getUtmParam("utm_source"),
        utm_medium: getUtmParam("utm_medium"),
        utm_campaign: getUtmParam("utm_campaign"),
      });

      setIsSubmitted(true);
      toast.success("Deal submitted successfully");
    } catch (error) {
      console.error("Lead submission failed:", error);
      toast.error(
        "Something went wrong submitting your deal. Please try again or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function formatCurrency(value: string): string {
    const num = value.replace(/[^0-9]/g, "");
    if (!num) return "";
    return parseInt(num, 10).toLocaleString("en-GB");
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.75 0.12 85 / 0.15), oklch(0.75 0.12 85 / 0.05))",
            border: "2px solid var(--gold)",
          }}
        >
          <CheckCircle2 className="h-10 w-10" style={{ color: "var(--gold)" }} />
        </div>
        <h2 className="mb-3 text-3xl font-bold tracking-tight">
          Deal Submitted
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Thank you, {formData.fullName.split(" ")[0]}. We&rsquo;ve received
          your deal submission. Our team will review the details and come back to
          you with indicative terms within 24 hours.
        </p>
        <div
          className="rounded-xl p-6 text-left"
          style={{
            background: "oklch(0.25 0.06 255 / 0.04)",
            border: "1px solid oklch(0.25 0.06 255 / 0.08)",
          }}
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-wider text-gold-dark">
            What Happens Next
          </p>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="font-bold text-foreground">1.</span>
              We review your deal within 24 hours
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-foreground">2.</span>
              We identify the best lender matches from our 100+ panel
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-foreground">3.</span>
              You receive indicative terms and next steps
            </li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      <div className="mb-12 flex items-center justify-center gap-4">
        {steps.map((step, i) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div key={step.number} className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300"
                  style={{
                    background: isActive
                      ? "var(--gold)"
                      : isCompleted
                        ? "var(--navy)"
                        : "oklch(0.25 0.06 255 / 0.06)",
                    color: isActive
                      ? "var(--navy-dark)"
                      : isCompleted
                        ? "white"
                        : "var(--muted-foreground)",
                    boxShadow: isActive
                      ? "0 0 20px oklch(0.75 0.12 85 / 0.2)"
                      : "none",
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`hidden text-sm font-semibold sm:inline ${
                    isActive
                      ? "text-foreground"
                      : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="hidden h-px w-12 sm:block"
                  style={{
                    background: isCompleted
                      ? "var(--gold)"
                      : "oklch(0.90 0.01 250)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Project Details */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight">
              Project Details
            </h2>
            <p className="text-sm text-muted-foreground">
              Tell us about the property or development.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="projectLocation" className="text-sm font-semibold">
                Project Location *
              </Label>
              <Input
                id="projectLocation"
                placeholder="e.g. Manchester, Bolton, London SE1"
                value={formData.projectLocation}
                onChange={(e) =>
                  updateField("projectLocation", e.target.value)
                }
                className="mt-2 h-12"
              />
              {errors.projectLocation && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.projectLocation}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="postcode" className="text-sm font-semibold">
                Postcode *
              </Label>
              <Input
                id="postcode"
                placeholder="e.g. M1 1AA"
                value={formData.postcode}
                onChange={(e) => updateField("postcode", e.target.value)}
                className="mt-2 h-12"
              />
              {errors.postcode && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.postcode}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="projectType" className="text-sm font-semibold">
                Project Type *
              </Label>
              <Select
                value={formData.projectType}
                onValueChange={(v) => updateField("projectType", v)}
              >
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectType && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.projectType}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="units" className="text-sm font-semibold">
                Number of Units (if applicable)
              </Label>
              <Input
                id="units"
                placeholder="e.g. 12"
                value={formData.units}
                onChange={(e) => updateField("units", e.target.value)}
                className="mt-2 h-12"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Financials */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight">
              Financials
            </h2>
            <p className="text-sm text-muted-foreground">
              The numbers behind your deal. All figures in GBP.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="gdv" className="text-sm font-semibold">
                Gross Development Value (GDV) *
              </Label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                  £
                </span>
                <Input
                  id="gdv"
                  placeholder="3,200,000"
                  value={formData.gdv}
                  onChange={(e) =>
                    updateField("gdv", formatCurrency(e.target.value))
                  }
                  className="h-12 pl-8"
                />
              </div>
              {errors.gdv && (
                <p className="mt-1.5 text-sm text-destructive">{errors.gdv}</p>
              )}
            </div>

            <div>
              <Label htmlFor="totalCost" className="text-sm font-semibold">
                Total Project Cost
              </Label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                  £
                </span>
                <Input
                  id="totalCost"
                  placeholder="2,400,000"
                  value={formData.totalCost}
                  onChange={(e) =>
                    updateField("totalCost", formatCurrency(e.target.value))
                  }
                  className="h-12 pl-8"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="loanAmount" className="text-sm font-semibold">
                Loan Amount Required *
              </Label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                  £
                </span>
                <Input
                  id="loanAmount"
                  placeholder="1,800,000"
                  value={formData.loanAmount}
                  onChange={(e) =>
                    updateField("loanAmount", formatCurrency(e.target.value))
                  }
                  className="h-12 pl-8"
                />
              </div>
              {errors.loanAmount && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.loanAmount}
                </p>
              )}
              <p className="mt-1.5 text-xs text-muted-foreground">
                Minimum £500,000
              </p>
            </div>

            <div>
              <Label htmlFor="loanType" className="text-sm font-semibold">
                Loan Type *
              </Label>
              <Select
                value={formData.loanType}
                onValueChange={(v) => updateField("loanType", v)}
              >
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  {LOAN_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.loanType && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.loanType}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="additionalInfo" className="text-sm font-semibold">
                Additional Information
              </Label>
              <Textarea
                id="additionalInfo"
                placeholder="Planning status, timeline, exit strategy, or anything else we should know..."
                value={formData.additionalInfo}
                onChange={(e) =>
                  updateField("additionalInfo", e.target.value)
                }
                className="mt-2 min-h-[100px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Contact */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight">
              Contact Details
            </h2>
            <p className="text-sm text-muted-foreground">
              How can we reach you with terms?
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="fullName" className="text-sm font-semibold">
                Full Name *
              </Label>
              <Input
                id="fullName"
                placeholder="John Smith"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className="mt-2 h-12"
              />
              {errors.fullName && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-semibold">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="mt-2 h-12"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-semibold">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+44 7700 900000"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="mt-2 h-12"
              />
              {errors.phone && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="company" className="text-sm font-semibold">
                Company (optional)
              </Label>
              <Input
                id="company"
                placeholder="Your company name"
                value={formData.company}
                onChange={(e) => updateField("company", e.target.value)}
                className="mt-2 h-12"
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-10 flex items-center justify-between">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="h-12 px-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {currentStep < 3 ? (
          <Button
            type="button"
            onClick={handleNext}
            className="bg-gold text-navy-dark hover:bg-gold-dark h-12 px-8 font-bold"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gold text-navy-dark hover:bg-gold-dark h-12 px-8 font-bold"
          >
            {isSubmitting ? "Submitting..." : "Submit Deal"}
            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}

function getUtmParam(param: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  const url = new URL(window.location.href);
  return url.searchParams.get(param) || undefined;
}
