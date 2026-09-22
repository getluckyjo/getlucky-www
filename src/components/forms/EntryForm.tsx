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
  Input,
  Select,
  SubmitButton,
} from "./FormPrimitives";
import TierPicker from "./TierPicker";

export default function EntryForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const [tier, setTier] = useState<number>(150);

  // Clear the error for a field as the user fixes it, and drop the top banner
  // on the first edit. Without this, "Name is required" sticks around while
  // the user types into Name.
  function onFieldChange(e: React.ChangeEvent<HTMLFormElement>) {
    const t = e.target as unknown as { name?: string };
    if (!t.name) return;
    const name = t.name;
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    setTopError((prev) => (prev ? null : prev));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setTopError(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      entryAmount: Number(fd.get("entryAmount") || 0),
      course: String(fd.get("course") || ""),
      mobile: String(fd.get("mobile") || ""),
      consentWhatsApp: fd.get("consentWhatsApp") === "on",
      // Accepted by pressing the pay button; the line under it says so.
      consentTerms: true,
    };

    try {
      const res = await fetch("/api/forms/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // Parse defensively: a platform timeout (504) or proxy error returns an
      // HTML body, and blindly calling res.json() would throw and surface a
      // misleading "Network error". Treat a non-JSON or non-ok response as a
      // server-side failure and show its message (or a sensible fallback).
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        if (data?.fieldErrors) setErrors(data.fieldErrors);
        setTopError(
          data?.error ||
            "We couldn't start your payment just now. Please try again in a moment, or ask a marshal at the tee.",
        );
        setPending(false);
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (!data.processUrl || !data.fields) {
        setTopError("Payment couldn't be initialised. Please try again in a moment.");
        setPending(false);
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      submitToPayFast(data.processUrl, data.fields);
    } catch {
      // Only genuine fetch rejections (offline / DNS / TLS) land here now.
      setTopError("Network error. Please check your connection and try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} onChange={onFieldChange} noValidate className="space-y-5">
      {topError && <FormErrorBanner message={topError} />}

      {/* Course and number first, then the bet. The two quick fields are out
          of the way before the picker, so the prize and the pay button sit
          together at the bottom with nothing between them. */}
      <Field label="Golf Course" name="course" required error={errors.course}>
        <Select name="course" required options={COURSES} placeholder="Select your course" />
      </Field>

      {/* Name and email are not asked here — PayFast collects them at checkout
          and returns them in its notification, so asking would be two fields of
          friction at a tee box for data we are handed a minute later. */}

      <Field label="Mobile Number" name="mobile" required error={errors.mobile}>
        <Input name="mobile" type="tel" required autoComplete="tel" placeholder="+27 XX XXX XXX" inputMode="tel" />
      </Field>

      {/* Prize first, stake second: see TierPicker for the reasoning. */}
      <Field label="Pick Your Prize" name="entryAmount" required error={errors.entryAmount}>
        <TierPicker value={tier} onChange={setTier} />
      </Field>

      <div className="space-y-3 pt-2">
        {/*
          The wording here is stored verbatim with every consent record, so it
          must match WHATSAPP_CONSENT_WORDING in src/lib/whatsapp.ts exactly.
          Change one and change the other, and bump CONSENT_FORM_VERSION.
        */}
        <Checkbox name="consentWhatsApp" error={errors.consentWhatsApp}>
          {WHATSAPP_CONSENT_WORDING}
        </Checkbox>
      </div>

      <div className="pt-2">
        <SubmitButton pending={pending}>
          Pay R{tier} via PayFast →
        </SubmitButton>
        {/* The terms are accepted by pressing the button, as on the PGA show
            form, rather than by a box of their own. The WhatsApp box above is
            the only checkbox left, on purpose: it is a genuine choice and must
            never be merged with anything required (src/lib/whatsapp.ts). */}
        <p className="text-xs text-charcoal-light/70 mt-3 leading-relaxed">
          By paying you accept the{" "}
          <Link href={ROUTES.terms} className="text-green underline hover:text-green">
            terms &amp; conditions
          </Link>
          {" "}and confirm you are 18 or older. See our{" "}
          <Link href={ROUTES.privacy} className="text-green underline hover:text-green">
            privacy policy
          </Link>
          {" "}for how we look after your details.
        </p>
        <p className="text-xs text-charcoal-light/60 mt-2">
          Secure payment by PayFast. Card, EFT, SnapScan, Zapper.
        </p>
      </div>
    </form>
  );
}

function submitToPayFast(processUrl: string, fields: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = processUrl;
  for (const [k, v] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = k;
    input.value = String(v);
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
