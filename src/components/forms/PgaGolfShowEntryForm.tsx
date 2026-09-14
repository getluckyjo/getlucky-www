"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PGA_GOLF_SHOW, ROUTES, SITE } from "@/lib/constants";
import { WHATSAPP_CONSENT_WORDING } from "@/lib/whatsapp";
import {
  Checkbox,
  Field,
  FieldErrors,
  FormErrorBanner,
  FormSuccessCard,
  Input,
  SubmitButton,
} from "./FormPrimitives";

/**
 * The simulator entry at the PGA Golf & Lifestyle Show.
 *
 * Two fields, one button and one box. A golfer at a show stand is typing on
 * a phone with a queue behind them, so everything else has been cut.
 *
 * The terms are accepted by pressing Enter — the line under the button says
 * so — rather than by a box of their own. The WhatsApp box is the only
 * checkbox on the form, on purpose: it is a genuine choice and must never be
 * merged with anything required, or the consent is bundled with entry and
 * worth nothing (src/lib/whatsapp.ts).
 *
 * The Instagram follow is asked for but optional — not everyone has
 * Instagram — and there is no way to verify a follow from outside it. So the
 * step is one tap: the button opens the profile in a new tab (the Instagram
 * app on a phone) and the tap is what gets recorded. A checkbox added nothing
 * to that, since it was only ever the golfer's word too.
 */
export default function PgaGolfShowEntryForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [optedIn, setOptedIn] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const [tappedFollow, setTappedFollow] = useState(false);

  function onFieldChange(e: React.ChangeEvent<HTMLFormElement>) {
    const t = e.target as unknown as { name?: string };
    if (!t.name) return;
    const name = t.name;
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    setTopError((prev) => (prev ? null : prev));
  }

  function onFollowTap() {
    // The link itself opens Instagram; this just records that they went.
    setTappedFollow(true);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setTopError(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      mobile: String(fd.get("mobile") || ""),
      instagramFollow: tappedFollow,
      consentWhatsApp: fd.get("consentWhatsApp") === "on",
      // Accepted by pressing Enter; the line under the button says so.
      consentTerms: true,
    };

    try {
      const res = await fetch("/api/forms/pga-golf-show", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        if (data?.fieldErrors) setErrors(data.fieldErrors);
        setTopError(
          data?.error ||
            "We couldn't record your entry just now. Please try again in a moment.",
        );
        setPending(false);
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setOptedIn(payload.consentWhatsApp);
      setSubmitted(true);
    } catch {
      setTopError("Network error. Please check your connection and try again.");
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <FormSuccessCard
        title="You're in"
        body={
          optedIn
            ? `You're entered for a shot at ${PGA_GOLF_SHOW.prize}. Keep an eye on WhatsApp — we'll message you about your entry and the 12 months of complimentary membership.`
            : `You're entered for a shot at ${PGA_GOLF_SHOW.prize}. Good luck.`
        }
      />
    );
  }

  const instagramUrl = SITE.instagram;

  return (
    <form onSubmit={onSubmit} onChange={onFieldChange} noValidate className="space-y-5">
      {topError && <FormErrorBanner message={topError} />}

      <Field label="Name" name="name" required error={errors.name}>
        <Input name="name" required autoComplete="name" placeholder="Full name" />
      </Field>

      <Field label="Mobile Number" name="mobile" required error={errors.mobile}>
        <Input name="mobile" type="tel" required autoComplete="tel" placeholder="+27 XX XXX XXX" inputMode="tel" />
      </Field>

      {/* Instagram follow — asked for, optional. */}
      <div className="rounded-xl border border-green-dark/15 bg-cream/60 p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-dark/70">
          Follow us on Instagram
        </p>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onFollowTap}
          className="flex w-full items-center justify-center gap-2.5 rounded-full px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.99]"
          style={{
            background:
              "linear-gradient(90deg, #f58529 0%, #dd2a7b 45%, #8134af 80%, #515bd4 100%)",
          }}
        >
          <InstagramGlyph />
          {tappedFollow ? "Opened Instagram" : `Follow @${PGA_GOLF_SHOW.instagramHandle}`}
          <ExternalLink className="h-4 w-4 opacity-80" aria-hidden />
        </a>
        <p className="text-xs text-charcoal-light/60">
          {tappedFollow
            ? "Thanks — tap Follow in the app and come back here."
            : "Optional. Not on Instagram? Skip this and carry on."}
        </p>
      </div>

      <div className="pt-1">
        {/*
          The only checkbox on the form. Stored verbatim with every consent
          record, so it must match WHATSAPP_CONSENT_WORDING in
          src/lib/whatsapp.ts exactly. Change one and change the other, and
          bump CONSENT_FORM_VERSION.
        */}
        <Checkbox name="consentWhatsApp" error={errors.consentWhatsApp}>
          {WHATSAPP_CONSENT_WORDING}
        </Checkbox>
      </div>

      <div className="pt-2">
        <SubmitButton pending={pending}>Enter for free →</SubmitButton>
        <p className="text-xs text-charcoal-light/70 mt-3 leading-relaxed">
          By entering you accept the{" "}
          <Link href={ROUTES.terms} className="text-green-dark underline hover:text-gold">
            terms &amp; conditions
          </Link>
          {" "}and confirm you are 18 or older. See our{" "}
          <Link href={ROUTES.privacy} className="text-green-dark underline hover:text-gold">
            privacy policy
          </Link>
          {" "}for how we look after your details.
        </p>
        <p className="text-xs text-charcoal-light/60 mt-2">
          No payment. One free shot at {PGA_GOLF_SHOW.prize} on the simulator.
        </p>
      </div>
    </form>
  );
}

/** lucide-react dropped its brand icons, so the glyph is inlined. */
function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
