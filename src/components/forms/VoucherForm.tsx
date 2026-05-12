"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { COURSES, PRIZE_TIERS, ROUTES } from "@/lib/constants";
import {
  Checkbox,
  Field,
  FieldErrors,
  FormErrorBanner,
  Input,
  RadioGroup,
  Select,
  SubmitButton,
  Textarea,
} from "./FormPrimitives";

export default function VoucherForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const [purchaseFor, setPurchaseFor] = useState<"myself" | "someone-else">("myself");
  const [tier, setTier] = useState<number>(250);
  const formRef = useRef<HTMLFormElement>(null);

  // Track radio change for conditional fields
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const handler = (e: Event) => {
      const t = e.target as HTMLInputElement;
      if (t.name === "purchaseFor") {
        setPurchaseFor(t.value as "myself" | "someone-else");
      } else if (t.name === "entryAmount") {
        setTier(Number(t.value));
      }
    };
    form.addEventListener("change", handler);
    return () => form.removeEventListener("change", handler);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setTopError(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      entryAmount: Number(fd.get("entryAmount") || 0),
      course: String(fd.get("course") || ""),
      fullName: String(fd.get("fullName") || ""),
      email: String(fd.get("email") || ""),
      mobile: String(fd.get("mobile") || ""),
      purchaseFor: String(fd.get("purchaseFor") || "myself"),
      recipientName: String(fd.get("recipientName") || ""),
      recipientEmail: String(fd.get("recipientEmail") || ""),
      personalMessage: String(fd.get("personalMessage") || ""),
      promoCode: String(fd.get("promoCode") || ""),
      consentCommunication: fd.get("consentCommunication") === "on",
      consentTerms: fd.get("consentTerms") === "on",
    };

    try {
      const res = await fetch("/api/forms/voucher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setTopError(data.error || "Something went wrong. Please try again.");
        setPending(false);
        // Scroll error into view so 503/maintenance message is visible
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }
      // Server returns PayFast redirect target + signed fields → POST to PayFast
      submitToPayFast(data.processUrl, data.fields);
    } catch {
      setTopError("Network error. Please check your connection and try again.");
      setPending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6">
      {topError && <FormErrorBanner message={topError} />}

      <Field label="Choose Your Entry" name="entryAmount" required error={errors.entryAmount}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PRIZE_TIERS.map((t) => {
            const checked = tier === t.entryAmount;
            return (
              <label
                key={t.entryAmount}
                className={`relative cursor-pointer rounded-xl p-4 text-center transition-all border-2 ${
                  checked
                    ? "border-gold bg-gold/10 ring-2 ring-gold/30"
                    : "border-green-dark/15 bg-white hover:border-gold/40"
                }`}
              >
                <input
                  type="radio"
                  name="entryAmount"
                  value={t.entryAmount}
                  defaultChecked={t.entryAmount === 250}
                  className="sr-only"
                />
                {t.popular && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-dark text-gold text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap">
                    Popular
                  </span>
                )}
                <p className="text-[10px] font-medium uppercase tracking-wider text-charcoal-light/60 mb-1">
                  Entry
                </p>
                <p className="text-lg font-black text-green-dark mb-1">{t.entry}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-charcoal-light/60 mb-1">Win</p>
                <p className="text-sm font-bold text-gold">{t.prize}</p>
              </label>
            );
          })}
        </div>
      </Field>

      <Field label="Your Course" name="course" required error={errors.course}>
        <Select name="course" required options={COURSES} placeholder="Select a partner course" />
      </Field>

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

      <Field label="Purchasing For" name="purchaseFor" required error={errors.purchaseFor}>
        <RadioGroup
          name="purchaseFor"
          required
          defaultValue="myself"
          layout="row"
          options={[
            { value: "myself", label: "Myself" },
            { value: "someone-else", label: "Someone else", sublabel: "Send as a gift" },
          ]}
        />
      </Field>

      {purchaseFor === "someone-else" && (
        <div className="space-y-5 p-5 rounded-xl border border-gold/30 bg-gold/5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Recipient Name" name="recipientName" required error={errors.recipientName}>
              <Input name="recipientName" />
            </Field>
            <Field label="Recipient Email" name="recipientEmail" required error={errors.recipientEmail}>
              <Input name="recipientEmail" type="email" />
            </Field>
          </div>
          <Field label="Personal Message" name="personalMessage" error={errors.personalMessage}>
            <Textarea name="personalMessage" rows={3} placeholder="Optional note we'll include with the voucher email." />
          </Field>
        </div>
      )}

      <Field
        label="Promo Code"
        name="promoCode"
        error={errors.promoCode}
        hint="Optional — if you have one."
      >
        <Input name="promoCode" />
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
        <SubmitButton pending={pending}>
          Pay R{tier} via PayFast →
        </SubmitButton>
        <p className="text-xs text-charcoal-light/60 mt-3">
          Secure payment by PayFast. Card, EFT, SnapScan and Zapper supported.
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
