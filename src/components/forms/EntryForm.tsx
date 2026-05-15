"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Lock, Shield, ShieldCheck } from "lucide-react";
import { COURSES, COURSE_SLUGS, MEMBERSHIP, PRIZE_TIERS, ROUTES } from "@/lib/constants";
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
// the welcome-email template and the subscriber database. We deep-link to
// the course-specific signup page when a course is selected, else send the
// user to the club picker.
const MEMBERSHIP_BASE = "https://membership.getluckygolfclub.com";

export default function EntryForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const [tier, setTier] = useState<number>(150);
  const [memberPending, setMemberPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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

    const form = formRef.current;
    if (!form) return;
    const course = String(new FormData(form).get("course") || "");
    const slug = course
      ? COURSE_SLUGS[course as keyof typeof COURSE_SLUGS]
      : undefined;

    setMemberPending(true);
    // Deep-link to the course-specific signup if a course is picked,
    // otherwise drop the user on the clubs picker. The membership site owns
    // the recurring-billing flow and welcome email from this point on.
    window.location.href = slug
      ? `${MEMBERSHIP_BASE}/join/${slug}`
      : `${MEMBERSHIP_BASE}/clubs`;
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
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      mobile: String(fd.get("mobile") || ""),
      consentCommunication: fd.get("consentCommunication") === "on",
      consentTerms: fd.get("consentTerms") === "on",
    };

    try {
      const res = await fetch("/api/forms/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setTopError(data.error || "Something went wrong. Please try again.");
        setPending(false);
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      submitToPayFast(data.processUrl, data.fields);
    } catch {
      setTopError("Network error. Please check your connection and try again.");
      setPending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} onChange={onFieldChange} noValidate className="space-y-5">
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

        {/* Membership upsell — recurring monthly subscription via PayFast */}
        <div className="mt-4">
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
            className="block w-full rounded-xl bg-gradient-to-br from-gold to-gold-light hover:from-gold-light hover:to-gold disabled:opacity-70 disabled:cursor-not-allowed p-5 text-center shadow-lg ring-2 ring-gold/40 transition-all hover:scale-[1.01] hover:shadow-xl"
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
      </Field>

      <Field label="Golf Course" name="course" required error={errors.course}>
        <Select name="course" required options={COURSES} placeholder="Select your course" />
      </Field>

      <Field label="Name" name="name" required error={errors.name}>
        <Input name="name" required autoComplete="name" placeholder="Full name" />
      </Field>

      <Field label="Email Address" name="email" required error={errors.email}>
        <Input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </Field>

      <Field label="Mobile Number" name="mobile" required error={errors.mobile}>
        <Input name="mobile" type="tel" required autoComplete="tel" placeholder="+27 XX XXX XXX" inputMode="tel" />
      </Field>

      <div className="space-y-3 pt-2">
        <Checkbox name="consentCommunication" error={errors.consentCommunication}>
          I agree to receive communication from Get Lucky Hole-in-One Challenge and Indwe Risk Services
          (see our{" "}
          <Link href={ROUTES.privacy} className="text-green-dark underline hover:text-gold">
            privacy policy
          </Link>
          ).
        </Checkbox>
        <Checkbox name="consentTerms" required error={errors.consentTerms}>
          I accept the{" "}
          <Link href={ROUTES.terms} className="text-green-dark underline hover:text-gold">
            terms &amp; conditions
          </Link>
          {" "}and confirm I am 18 or older.
        </Checkbox>
      </div>

      <div className="pt-2">
        <SubmitButton pending={pending}>
          Pay R{tier} via PayFast →
        </SubmitButton>
        <p className="text-xs text-charcoal-light/60 mt-3">
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
