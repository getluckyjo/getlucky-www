"use client";

import { useState } from "react";
import Link from "next/link";
import { COURSES, ROUTES } from "@/lib/constants";
import { WHATSAPP_CONSENT_WORDING } from "@/lib/whatsapp";
import {
  Checkbox,
  Field,
  FieldErrors,
  FormErrorBanner,
  FormSuccessCard,
  Input,
  Select,
  SubmitButton,
} from "./FormPrimitives";

export default function FreeEntryForm() {
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
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      mobile: String(fd.get("mobile") || ""),
      course: String(fd.get("course") || ""),
      event: String(fd.get("event") || ""),
      consentWhatsApp: fd.get("consentWhatsApp") === "on",
      consentTerms: fd.get("consentTerms") === "on",
    };

    try {
      const res = await fetch("/api/forms/free-entry", {
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
        title="You're entered"
        body="Good luck out there. Keep your details handy — the team will be in touch on the day with anything you need to know."
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {topError && <FormErrorBanner message={topError} />}

      <Field label="Name" name="name" required error={errors.name}>
        <Input name="name" required autoComplete="name" placeholder="Full name" />
      </Field>

      <Field label="Email Address" name="email" error={errors.email} hint="Optional.">
        <Input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
      </Field>

      <Field label="Mobile Number" name="mobile" required error={errors.mobile}>
        <Input name="mobile" type="tel" required autoComplete="tel" placeholder="+27 XX XXX XXX" inputMode="tel" />
      </Field>

      <Field label="Golf Course" name="course" required error={errors.course} hint="Where you're playing.">
        <Select name="course" required options={COURSES} placeholder="Select a course" />
      </Field>

      <Field label="Event / Sponsor" name="event" error={errors.event} hint="Optional — golf day or sponsor name.">
        <Input name="event" />
      </Field>

      <div className="space-y-3 pt-2">
        {/*
          Stored verbatim with every consent record, so it must match
          WHATSAPP_CONSENT_WORDING in src/lib/whatsapp.ts exactly. Change one and
          change the other, and bump CONSENT_FORM_VERSION.
        */}
        <Checkbox name="consentWhatsApp" error={errors.consentWhatsApp}>
          {WHATSAPP_CONSENT_WORDING}
        </Checkbox>
        <Checkbox name="consentTerms" required error={errors.consentTerms}>
          I accept the{" "}
          <Link href={ROUTES.terms} className="text-green-dark underline hover:text-gold">
            terms &amp; conditions
          </Link>
          {" "}and confirm I am 18 or older.
        </Checkbox>
        <p className="text-sm text-gray-600">
          See our{" "}
          <Link href={ROUTES.privacy} className="text-green-dark underline hover:text-gold">
            privacy policy
          </Link>
          {" "}for how we look after your details.
        </p>
      </div>

      <div className="pt-2">
        <SubmitButton pending={pending}>Enter the Challenge</SubmitButton>
      </div>
    </form>
  );
}
