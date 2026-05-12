import { z } from "zod";
import { COURSES, PRIZE_TIERS } from "./constants";

const requiredString = (field: string) =>
  z.string({ error: `${field} is required` }).trim().min(1, `${field} is required`);

const consent = z.literal(true, { error: "You must agree to continue" });
// Communication opt-in is optional — accept any boolean. Users who don't tick
// the box just don't get marketing comms; it doesn't block the submission.
const optionalConsent = z.boolean().optional().default(false);

/**
 * SA mobile validator: accepts +27 / 27 / 0 prefixes with free spacing,
 * rejects garbage like "()()()()". Mirrors normaliseSACellNumber in payfast.ts.
 */
function looksLikeSAMobile(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("27") && digits.length === 11) return true;
  if (digits.length === 10 && digits.startsWith("0")) return true;
  if (digits.length === 9) return true;
  return false;
}
const phone = requiredString("Mobile number")
  .regex(/^[+0-9 ()-]{7,20}$/, "Enter a valid mobile number")
  .refine(looksLikeSAMobile, "Enter a valid SA mobile (e.g. 082 555 1234)");

/**
 * Shared fields for any flow that captures Get Lucky Club member details
 * (entry form + membership signup). Single source of truth.
 */
export const clubMemberFields = {
  name: requiredString("Name").max(120),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  mobile: phone,
  course: requiredString("Course").refine(
    (v) => (COURSES as readonly string[]).includes(v),
    "Choose a partner course",
  ),
  consentCommunication: optionalConsent,
  consentTerms: consent,
} as const;

export const membershipSchema = z.object(clubMemberFields);
export type MembershipInput = z.infer<typeof membershipSchema>;

export const partnerSchema = z.object({
  fullName: requiredString("Full name").max(120),
  mobile: phone,
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  golfCourse: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  consentCommunication: optionalConsent,
  consentTerms: consent,
});
export type PartnerInput = z.infer<typeof partnerSchema>;

export const agencySchema = z.object({
  fullName: requiredString("Full name").max(120),
  email: requiredString("Email").email("Enter a valid email").max(160),
  mobile: phone,
  companyName: requiredString("Company name").max(120),
  industry: z.string().trim().max(120).optional().or(z.literal("")),
  budgetRange: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  consentCommunication: optionalConsent,
  consentTerms: consent,
});
export type AgencyInput = z.infer<typeof agencySchema>;

export const corporateSchema = z.object({
  fullName: requiredString("Full name").max(120),
  mobile: phone,
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  companyName: z.string().trim().max(120).optional().or(z.literal("")),
  golfCourse: z.string().trim().max(120).optional().or(z.literal("")),
  golfDayDate: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  consentCommunication: optionalConsent,
  consentTerms: consent,
});
export type CorporateInput = z.infer<typeof corporateSchema>;

const tierEntries = PRIZE_TIERS.map((t) => t.entryAmount) as readonly number[];
const courseValues = COURSES as readonly string[];

export const voucherSchema = z
  .object({
    entryAmount: z.coerce.number().refine(
      (v) => tierEntries.includes(v),
      { message: "Choose an entry amount" },
    ),
    course: requiredString("Course").refine(
      (v) => courseValues.includes(v),
      "Choose a partner course",
    ),
    fullName: requiredString("Full name").max(120),
    email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
    mobile: phone,
    purchaseFor: z.enum(["myself", "someone-else"], {
      error: "Choose who this is for",
    }),
    recipientName: z.string().trim().max(120).optional().or(z.literal("")),
    recipientEmail: z
      .string()
      .trim()
      .email("Enter a valid recipient email")
      .optional()
      .or(z.literal("")),
    personalMessage: z.string().trim().max(2000).optional().or(z.literal("")),
    promoCode: z.string().trim().max(40).optional().or(z.literal("")),
    consentCommunication: optionalConsent,
    consentTerms: consent,
  })
  .superRefine((data, ctx) => {
    if (data.purchaseFor === "someone-else") {
      if (!data.recipientName || data.recipientName.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["recipientName"],
          message: "Recipient name is required when buying as a gift",
        });
      }
      if (!data.recipientEmail || data.recipientEmail.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["recipientEmail"],
          message: "Recipient email is required when buying as a gift",
        });
      }
    }
  });
export type VoucherInput = z.infer<typeof voucherSchema>;

// /form — in-person QR-code paid entry (simpler than /buy-a-swing — no gifting).
// Entry date is auto-captured server-side from the request timestamp.
export const entrySchema = z.object({
  entryAmount: z.coerce.number().refine(
    (v) => tierEntries.includes(v),
    { message: "Choose an entry amount" },
  ),
  ...clubMemberFields,
});
export type EntryInput = z.infer<typeof entrySchema>;

// /sponsored-entry — free entry for sponsored/corporate events
export const freeEntrySchema = z.object({
  name: requiredString("Name").max(120),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  mobile: phone,
  course: requiredString("Course").refine(
    (v) => (COURSES as readonly string[]).includes(v),
    "Choose a course",
  ),
  event: z.string().trim().max(120).optional().or(z.literal("")),
  consentCommunication: optionalConsent,
  consentTerms: consent,
});
export type FreeEntryInput = z.infer<typeof freeEntrySchema>;
