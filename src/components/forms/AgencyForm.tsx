"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import {
  Checkbox,
  Field,
  FieldErrors,
  FormErrorBanner,
  FormSuccessCard,
  Input,
  Select,
  SubmitButton,
  Textarea,
} from "./FormPrimitives";

const BUDGET_OPTIONS = [
  "Just exploring",
  "Under R50,000",
  "R50,000 – R200,000",
  "R200,000 – R500,000",
  "R500,000+",
] as const;

export default function AgencyForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setTopError(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      fullName: String(fd.get("fullName") || ""),
      email: String(fd.get("email") || ""),
      mobile: String(fd.get("mobile") || ""),
      companyName: String(fd.get("companyName") || ""),
      industry: String(fd.get("industry") || ""),
      budgetRange: String(fd.get("budgetRange") || ""),
      message: String(fd.get("message") || ""),
      consentCommunication: fd.get("consentCommunication") === "on",
      consentTerms: fd.get("consentTerms") === "on",
    };

    try {
      const res = await fetch("/api/forms/agency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setTopError(data.error || "Something went wrong. Please try again.");
        setPending(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setTopError("Network error. Please check your connection and try again.");
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <FormSuccessCard
        title="Enquiry received"
        body="Thanks — a Get Lucky Golf Agency partner will be in touch within 1 business day with a media kit, audience data, and the right entry point for your brand."
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {topError && <FormErrorBanner message={topError} />}

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full Name" name="fullName" required error={errors.fullName}>
          <Input name="fullName" required autoComplete="name" placeholder="First and last name" />
        </Field>
        <Field label="Company / Brand" name="companyName" required error={errors.companyName}>
          <Input name="companyName" required autoComplete="organization" />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Work Email" name="email" required error={errors.email}>
          <Input name="email" type="email" required autoComplete="email" placeholder="you@brand.com" />
        </Field>
        <Field label="Mobile Number" name="mobile" required error={errors.mobile}>
          <Input name="mobile" type="tel" required autoComplete="tel" placeholder="+27 XX XXX XXX" inputMode="tel" />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Industry / Sector" name="industry" error={errors.industry} hint="e.g. Banking, Auto, Spirits, Insurance.">
          <Input name="industry" />
        </Field>
        <Field label="Budget Range" name="budgetRange" error={errors.budgetRange}>
          <Select name="budgetRange" options={BUDGET_OPTIONS} placeholder="Select a range" />
        </Field>
      </div>

      <Field label="Message" name="message" error={errors.message}>
        <Textarea name="message" rows={4} placeholder="Tell us a bit about your campaign goals — audience, timing, any specific platforms you're interested in (Hole-in-One Challenge, Get Lucky Golf Show, Golf Site Pro, Golf Day Pro)." />
      </Field>

      <div className="space-y-3 pt-2">
        <Checkbox name="consentCommunication" error={errors.consentCommunication}>
          I agree to receive communication from the Get Lucky Golf Agency.
        </Checkbox>
        <Checkbox name="consentTerms" required error={errors.consentTerms}>
          I accept the{" "}
          <Link href={ROUTES.terms} className="text-green-dark underline hover:text-gold">
            terms &amp; conditions
          </Link>
          .
        </Checkbox>
      </div>

      <div className="pt-2">
        <SubmitButton pending={pending}>Request a Media Kit</SubmitButton>
      </div>
    </form>
  );
}
