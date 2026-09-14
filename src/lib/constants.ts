/**
 * Google Ads conversion tracking. The conversion ID covers the whole account;
 * each conversion action (corporate-form-submit, agency-form-submit, etc.)
 * gets its own conversion label which we'll add as we wire up form events.
 */
export const GOOGLE_ADS = {
  conversionId: "AW-18144302506",
} as const;

export const GA4_ID = "G-J5E9QM1F7L";
export const GTM_ID = "GTM-T7JGF7M2";

export const SITE = {
  name: "Get Lucky Golf Club",
  tagline: "South Africa's Leading Hole-in-One Golf Activation",
  description:
    "Buy a swing from R50, sink a hole-in-one, win up to R1,000,000. Live at 20+ courses nationwide. Fully insured by Indwe Risk Services.",
  email: "johannes@getluckygolfclub.com",
  partnershipsEmail: "johannes@getluckygolfclub.com",
  whatsapp: "https://wa.me/27609615091",
  instagram: "https://www.instagram.com/getluckygolfclub",
  website: "https://www.getluckygolf.co.za",
  legacyWebsite: "https://www.getluckygolfclub.com",
  simulator: "https://simulator.getluckygolfclub.com",
} as const;

/**
 * Get Lucky Club — recurring monthly membership.
 * Pushes to PayFast as a recurring subscription.
 */
export const MEMBERSHIP = {
  amount: 149, // R per month
  prize: "R100,000",
  prizeAmount: 100000,
  label: "Get Lucky Club",
  pitch: "Unlimited swings per month",
} as const;

export const PRIZE_TIERS = [
  { entry: "R50", entryAmount: 50, prize: "R25,000", popular: false, label: "Bronze Swing" },
  { entry: "R100", entryAmount: 100, prize: "R60,000", popular: false, label: "Silver Swing" },
  { entry: "R150", entryAmount: 150, prize: "R100,000", popular: false, label: "Birdie Swing" },
  { entry: "R250", entryAmount: 250, prize: "R200,000", popular: true, label: "Gold Swing" },
  { entry: "R500", entryAmount: 500, prize: "R500,000", popular: false, label: "Platinum Swing" },
  { entry: "R1,000", entryAmount: 1000, prize: "R1,000,000", popular: false, label: "Diamond Swing" },
] as const;

export type PrizeTier = (typeof PRIZE_TIERS)[number];

/**
 * Affiliated courses, mirrored from the live voucher form on the legacy site
 * (some venues split into multiple holes — preserved verbatim).
 *
 * COURSE_SLUGS maps each label to the slug used by the membership site at
 * membership.getluckygolfclub.com/join/<slug>. Multi-hole venues (e.g.
 * Boschenmeer 17th + 23rd) collapse to a single club-level slug because
 * Get Lucky Club membership is club-level, not hole-level.
 *
 * If you add a course, add its slug here AND confirm /join/<slug> exists on
 * the membership site — otherwise users get a 404 after paying.
 */
export const COURSE_SLUGS = {
  "Atlantic Beach": "atlantic-beach",
  "Bellville Golf Club": "bellville",
  "Boschenmeer 17th Hole": "boschenmeer",
  "Boschenmeer 23rd Hole": "boschenmeer",
  "Centurion Golf Course": "centurion",
  "Clovelly Country Club": "clovelly",
  "Durbanville Golf Course": "durbanville",
  "East London Golf Club": "east-london",
  "Goose Valley": "goose-valley",
  "Graceland Golf Club": "graceland",
  "Highland Gate": "highland-gate",
  "Metropolitan 9th Hole": "metropolitan",
  "Metropolitan 18th Hole": "metropolitan",
  "Mosselbay Golf Club": "mossel-bay",
  "Mount Edgecombe Country Club": "mount-edgecombe",
  "Rondebosch Golf Club": "rondebosch",
  "San Lameer": "san-lameer",
  "State Mines": "state-mines",
  "St Francis Links": "st-francis",
  "Victoria Golf Club": "victoria",
  "Wild Coast": "wild-coast",
  "Zimbali": "zimbali",
  "Golf Day": "golf-day",
} as const;

export const COURSES = Object.keys(COURSE_SLUGS) as ReadonlyArray<keyof typeof COURSE_SLUGS>;

export const ROUTES = {
  home: "/",
  partner: "/become-a-partner",
  corporate: "/corporate-golf-days",
  charity: "/charity-golf-days",
  schools: "/school-fundraising",
  simulator: "/golf-simulators",
  tours: "/golf-tours",
  agency: "/agency",
  buyVoucher: "/buy-a-swing",
  voucherSuccess: "/buy-a-swing/success",
  voucherCancel: "/buy-a-swing/cancel",
  terms: "/terms",
  privacy: "/privacy",
  pgaGolfShow: "/pga-golf-show",
} as const;

/**
 * The PGA Golf & Lifestyle Show, 18–20 September 2026 — a simulator
 * hole-in-one at the Get Lucky stand. Free shot at R25,000 for an entry with a
 * name and a number; no payment step.
 *
 * `course` is what the WhatsApp opening reads back to the golfer: the template
 * says "thanks for entering ... at {{course}}", so it is phrased as a place.
 *
 * Logos live in public/logos/sponsors/<file>, prepared from the artwork in
 * getluckyjo/pgashow. The strip falls back to a wordmark for any file that
 * goes missing. Colours are in `.pga-theme` in globals.css.
 */
export const PGA_GOLF_SHOW = {
  name: "PGA Golf & Lifestyle Show",
  year: 2026,
  dates: "18–20 September 2026",
  prize: "R25,000",
  prizeAmount: 25000,
  course: "the PGA Golf Show",
  event: "PGA Golf & Lifestyle Show 2026 — Simulator Hole-in-One",
  source: "getluckygolf.co.za /pga-golf-show",
  instagramHandle: "getluckygolfclub",
  sponsors: [
    { name: "Move Golf", file: "move-golf.png" },
    { name: "Takomo", file: "takomo.png" },
    { name: "Badi Golf", file: "badi-golf.png" },
  ],
  showLogo: { name: "PGA Golf & Lifestyle Show", file: "pga-golf-show.png" },
} as const;
