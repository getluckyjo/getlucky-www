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
 * Two fields and three boxes. A golfer at a show stand is typing on a phone
 * with a queue behind them, so everything that is not a name, a number or a
 * condition of entry has been cut.
 *
 * The Instagram follow is asked for but optional — not everyone has
 * Instagram — and there is no way to verify a follow from outside it. So the
 * step is: tap the button, which opens the profile in a new tab (the Instagram
 * app on a phone), and the box ticks itself when they come back. A golfer who
 * already follows can tick it by hand. It is their word, recorded as their
 * word.
 */
export default function PgaGolfShowEntryForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [optedIn, setOptedIn] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const [instagramFollow, setInstagramFollow] = useState(false);
  const [tappedFollow, setTappedFollow] = useState(false);

  function onFieldChange(e: React.ChangeEvent<HTMLFormElement>) {
    const t = e.target as unknown as { name?: string };
    if (!t.name) return;
    const name = t.name;
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    setTopError((prev) => (prev ? null : prev));
  }

  function onFollowTap() {
    // The link itself opens Instagram; this just records that they went and
    // ticks the box so they have nothing to do when they come back.
    setTappedFollow(true);
    setInstagramFollow(true);
    setErrors((prev) => (prev.instagramFollow ? { ...prev, instagramFollow: undefined } : prev));
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
      instagramFollow,
      consentWhatsApp: fd.get("consentWhatsApp") === "on",
      consentTerms: fd.get("consentTerms") === "on",
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
        <label htmlFor="instagramFollow" className="flex items-start gap-3 cursor-pointer">
          <input
            id="instagramFollow"
            name="instagramFollow"
            type="checkbox"
            checked={instagramFollow}
            onChange={(e) => setInstagramFollow(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-green-dark/30 text-green focus:ring-gold/30 focus:ring-2 cursor-pointer flex-shrink-0"
          />
          <span className="text-sm text-charcoal-light/90 leading-relaxed">
            I&apos;m following @{PGA_GOLF_SHOW.instagramHandle} on Instagram.
            {tappedFollow ? " Thanks — tap Follow in the app and come back here." : ""}
          </span>
        </label>
        <p className="text-xs text-charcoal-light/60">
          Optional. Not on Instagram? Skip this and carry on.
        </p>
        {errors.instagramFollow && (
          <span className="block ml-8 text-xs text-red-600 font-medium" role="alert">
            {errors.instagramFollow}
          </span>
        )}
      </div>

      <div className="space-y-3 pt-1">
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
        <SubmitButton pending={pending}>Enter for free →</SubmitButton>
        <p className="text-xs text-charcoal-light/60 mt-3">
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
