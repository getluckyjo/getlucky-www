"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import {
  formatGolfDayQuoteMessage,
  useGolfDayQuote,
} from "@/lib/golfDayQuoteStore";
import {
  Checkbox,
  Field,
  FieldErrors,
  FormErrorBanner,
  FormSuccessCard,
  Input,
  SubmitButton,
  Textarea,
} from "./FormPrimitives";

export default function CorporateForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageTouched, setMessageTouched] = useState(false);
  const quote = useGolfDayQuote();

  useEffect(() => {
    if (!messageTouched && quote) {
      setMessage(formatGolfDayQuoteMessage(quote));
    }
  }, [quote, messageTouched]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setTopError(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      fullName: String(fd.get("fullName") || ""),
      mobile: String(fd.get("mobile") || ""),
      email: String(fd.get("email") || ""),
      companyName: String(fd.get("companyName") || ""),
      golfCourse: String(fd.get("golfCourse") || ""),
      golfDayDate: String(fd.get("golfDayDate") || ""),
      message: String(fd.get("message") || ""),
      consentCommunication: fd.get("consentCommunication") === "on",
      consentTerms: fd.get("consentTerms") === "on",
    };

    try {
      const res = await fetch("/api/forms/corporate", {
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
        title="Booking enquiry received"
        body="Thanks — a Get Lucky activation specialist will be in touch within 24 hours with package options and availability for your golf day."
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
        <Field label="Mobile Number" name="mobile" required error={errors.mobile}>
          <Input name="mobile" type="tel" required autoComplete="tel" placeholder="+27 XX XXX XXX" inputMode="tel" />
        </Field>
      </div>

      <Field label="Email Address (optional)" name="email" error={errors.email}>
        <Input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Company Name" name="companyName" error={errors.companyName}>
          <Input name="companyName" autoComplete="organization" />
        </Field>
        <Field label="Golf Course" name="golfCourse" error={errors.golfCourse} hint="Where you'd like the activation.">
          <Input name="golfCourse" />
        </Field>
      </div>

      <Field label="Golf Day Date" name="golfDayDate" error={errors.golfDayDate} hint="Approximate date is fine.">
        <Input name="golfDayDate" type="date" />
      </Field>

      <Field
        label="Message"
        name="message"
        error={errors.message}
        hint={quote && !messageTouched ? "We've pre-filled this with the package you just built — edit anything you'd like to add." : undefined}
      >
        <Textarea
          name="message"
          rows={10}
          placeholder="Tell us about your event — number of players, format, what you'd like the activation to achieve."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setMessageTouched(true);
          }}
        />
      </Field>

      <div className="space-y-3 pt-2">
        <Checkbox name="consentCommunication" error={errors.consentCommunication}>
          I agree to receive communication from Get Lucky Hole-in-One Challenge and Indwe Risk Services.
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
        <SubmitButton pending={pending}>Request a Quote</SubmitButton>
      </div>
    </form>
  );
}
