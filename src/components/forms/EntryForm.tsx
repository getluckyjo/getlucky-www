"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Shield, ShieldCheck } from "lucide-react";
import { COURSES, MEMBERSHIP, PRIZE_TIERS, ROUTES } from "@/lib/constants";
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

// Membership signups live on the dedicated subscription site
// (membership.getluckygolfclub.com), which owns the recurring-billing flow,
// the welcome-email template and the subscriber database. The form-side
// upsell pushes the generic Get Lucky join page rather than course-specific
// deep links — the membership site handles club selection downstream.
const MEMBERSHIP_JOIN_URL = "https://membership.getluckygolfclub.com/join/get-lucky";

export default function EntryForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const [tier, setTier] = useState<number>(150);
  const [memberPending, setMemberPending] = useState(false);

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

  function onJoinClub() {
    if (memberPending || pending) return;
    setErrors({});
    setTopError(null);
    setMemberPending(true);
    window.location.href = MEMBERSHIP_JOIN_URL;
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
      consentTerms: fd.get("consentTerms") === "on",
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

      <Field label="Entry Amount" name="entryAmount" required error={errors.entryAmount}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRIZE_TIERS.map((t) => {
            const checked = tier === t.entryAmount;
            return (
              <label
                key={t.entryAmount}
                className={`relative cursor-pointer rounded-xl p-3 text-center transition-all border-2 ${
                  checked
                    ? "border-gold bg-gold/10 ring-2 ring-gold/30"
                    : "border-green-dark/15 bg-white hover:border-gold/40"
                }`}
              >
                <input
                  type="radio"
                  name="entryAmount"
                  value={t.entryAmount}
                  checked={checked}
                  onChange={() => setTier(t.entryAmount)}
                  className="sr-only"
                />
                <p className="text-base font-black text-green-dark">{t.entry}</p>
                <p className="text-[10px] uppercase tracking-wider text-charcoal-light/60 mt-0.5">Win</p>
                <p className="text-xs font-bold text-gold">{t.prize}</p>
              </label>
            );
          })}
        </div>
      </Field>

      <Field label="Golf Course" name="course" required error={errors.course}>
        <Select name="course" required options={COURSES} placeholder="Select your course" />
      </Field>

      {/* Name and email are not asked here — PayFast collects them at checkout
          and returns them in its notification, so asking would be two fields of
          friction at a tee box for data we are handed a minute later. */}

      <Field label="Mobile Number" name="mobile" required error={errors.mobile}>
        <Input name="mobile" type="tel" required autoComplete="tel" placeholder="+27 XX XXX XXX" inputMode="tel" />
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
        <Checkbox name="consentTerms" required error={errors.consentTerms}>
          I accept the{" "}
          <Link href={ROUTES.terms} className="text-green-dark underline hover:text-gold">
            terms &amp; conditions
          </Link>
          {" "}and confirm I am 18 or older.
        </Checkbox>
        {/*
          The privacy policy link used to hang off the general communication
          checkbox. That checkbox is gone; the link is not optional, so it sits
          here rather than inside the consent wording, which has to stay
          verbatim.
        */}
        <p className="text-sm text-gray-600">
          See our{" "}
          <Link href={ROUTES.privacy} className="text-green-dark underline hover:text-gold">
            privacy policy
          </Link>
          {" "}for how we look after your details.
        </p>
      </div>

      <div className="pt-2">
        <SubmitButton pending={pending}>
          Pay R{tier} via PayFast →
        </SubmitButton>
        <p className="text-xs text-charcoal-light/60 mt-3">
          Secure payment by PayFast. Card, EFT, SnapScan, Zapper.
        </p>
      </div>

      {/* Membership upsell — recurring monthly subscription via PayFast.
          Sits below the pay button, not above it: a golfer at a tee box is
          here to buy one swing, and a second price between them and the
          fields they have to fill in is a decision they did not come to make.
          As an alternative offered after the primary action it still reads as
          "or", which is what it is. */}
      <div className="pt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-green-dark/15" />
          <span className="text-[10px] uppercase tracking-widest text-charcoal-light/50 font-semibold">
            or
          </span>
          <div className="flex-1 h-px bg-green-dark/15" />
        </div>
        <button
          type="button"
          onClick={onJoinClub}
          disabled={memberPending || pending}
          /* Deliberately quieter than the pay button above it.
             Moving this below the pay button was not enough on its own. It was
             a filled gold gradient with shadow-lg, ring-2 and p-5, while
             SubmitButton is flat green with no shadow and no ring — so the
             secondary action was the loudest thing on the page, and on a phone
             both are full width. A golfer reaching for "pay R150" met a
             R149/month subscription first.
             Outlined and tinted rather than filled: no shadow, no ring, no
             hover scale. Still obviously a distinct offer worth tapping, just no
             longer competing with the thing they came to do. If this ever
             regains a gradient or a shadow, hold it next to SubmitButton before
             shipping. */
          className="block w-full rounded-xl border border-gold bg-gold/10 hover:bg-gold/20 disabled:opacity-70 disabled:cursor-not-allowed p-4 text-center transition-colors"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-dark/80">
            {memberPending ? "Redirecting to PayFast…" : "Join the Club"}
          </p>
          <p className="font-heading text-2xl text-green-dark uppercase tracking-wide mt-1.5">
            R{MEMBERSHIP.amount}<span className="text-sm">/month</span>
          </p>
          <p className="text-xs font-medium text-green-dark/85 mt-1">
            {MEMBERSHIP.pitch}
          </p>

          {/* Trust signals — stacked rows on phone, 3-up on tablet+ where each
              column has room for a single line. Pushed to md: so phones in
              landscape (~640–768) don't squeeze into cramped 3-col. */}
          <ul className="mt-4 pt-3 border-t border-green-dark/10 grid grid-cols-1 md:grid-cols-3 gap-y-2 md:gap-x-3 md:gap-y-0 text-[11px] text-green-dark/85">
            <li className="flex items-center justify-center gap-2 md:flex-col md:gap-1.5">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>Insurance-backed {MEMBERSHIP.prize}</span>
            </li>
            <li className="flex items-center justify-center gap-2 md:flex-col md:gap-1.5">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Cancel anytime — email us</span>
            </li>
            <li className="flex items-center justify-center gap-2 md:flex-col md:gap-1.5">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span>Card details never stored</span>
            </li>
          </ul>
        </button>
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
