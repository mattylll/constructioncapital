"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function QuickEnquiryForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
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
          message: formData.message.trim() || undefined,
          source_page: window.location.pathname,
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
      <div className="text-center">
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
        <h3 className="mb-2 text-xl font-bold">Thank You</h3>
        <p className="text-sm text-muted-foreground">
          We&rsquo;ve received your enquiry and will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="qe-name" className="text-sm font-semibold">
          Name *
        </Label>
        <Input
          id="qe-name"
          placeholder="Your full name"
          value={formData.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          className="mt-1.5 h-11"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-destructive">{errors.fullName}</p>
        )}
      </div>

      <div>
        <Label htmlFor="qe-email" className="text-sm font-semibold">
          Email *
        </Label>
        <Input
          id="qe-email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="mt-1.5 h-11"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div>
        <Label htmlFor="qe-phone" className="text-sm font-semibold">
          Phone *
        </Label>
        <Input
          id="qe-phone"
          type="tel"
          placeholder="+44 7700 900000"
          value={formData.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className="mt-1.5 h-11"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
        )}
      </div>

      <div>
        <Label htmlFor="qe-message" className="text-sm font-semibold">
          Message <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="qe-message"
          placeholder="Brief details about your project or question..."
          value={formData.message}
          onChange={(e) => updateField("message", e.target.value)}
          className="mt-1.5 min-h-[80px]"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-gold text-navy-dark hover:bg-gold-dark h-11 w-full font-bold"
      >
        {isSubmitting ? "Sending..." : "Send Enquiry"}
        {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  );
}
