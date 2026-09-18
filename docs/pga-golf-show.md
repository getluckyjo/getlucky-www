# PGA Golf & Lifestyle Show — simulator entry

`/pga-golf-show` is the entry form for the simulator hole-in-one at the Get
Lucky stand, 18–20 September 2026. One free shot at R25,000 for a name and a
number, and — at the bottom of the same form — a paid shot at R100,000 for
R100.

## What it does

- Asks for **name and mobile only**. No email, no course, no event field — the
  show is the "course".
- **Asks for a follow of @getluckygolfclub on Instagram, optionally.** The
  button opens the profile in a new tab (the Instagram app on a phone), and
  the tap is what gets recorded (`data.instagram_follow` on the lead). Not
  everyone has Instagram, so an entry goes through without it. There is no
  checkbox: Instagram has no API that lets us verify a follow, so a box was
  only ever the golfer's word too.
- **The terms are accepted by pressing Enter.** The line under the button says
  so, with the terms and privacy links. No checkbox.
- The **WhatsApp opt-in is the only checkbox on the form**, same wording as
  the course forms, and optional. It must never be merged with anything
  required: consent bundled with entry is not freely given, and this account
  has been restricted by Meta once already.
- Every entry is handed to the WhatsApp service (`getluckyjo/twillio`) through
  the existing `notifyWhatsAppChannel()` seam, exactly as `/form-2` does. The
  rest are recorded there and never messaged.
- **The course sent is "the PGA Golf Show", and that string is load-bearing.**
  The WhatsApp service matches on it (`SHOW_COURSES` in its `templates.ts`) to
  give show entrants their own journey: the original v1 opening
  (`entry_followup_show`, "Good luck out there... Interested?"), then one
  consent question, then "an Indwe Advisor will be in touch to arrange a time".
  No underwriting questions, no booking. Change `PGA_GOLF_SHOW.course` and
  change it there too, or show entrants silently get the full nine-question
  course journey. `/form` and `/form-2` are untouched.
- Recorded as a `free_entry` lead in Postgres, with `Source` =
  `getluckygolf.co.za /pga-golf-show`. The Indwe feed and the ops scorecard pick
  it up without a new lead type. (It used to be mirrored to a `freeEntry` tab in
  the Google Sheet; the Apps Script was removed in Sep 2026.)

## The R100 option

At the bottom of the same form, under the free button: **R100 for a shot at
R100,000** — 4× the free prize on the same simulator. It is a second button on
the form rather than a tier picker or a page of its own, because the name and
the number are already typed and the choice should cost one tap either way.
The free shot stays first and stays the default: pressing Enter in a field
still enters for free, never walks anyone to a payment page.

- **The price and the prize live on the server**, in `PGA_GOLF_SHOW.paidEntry`.
  The browser sends the same body as a free entry (name, mobile, the optional
  Instagram tap, the optional WhatsApp box) and no amount at all — a client
  that could name its own amount could buy a R100,000 shot for a rand.
- **It is deliberately not a rung on `PRIZE_TIERS`.** The public ladder pays
  R60,000 for R100 and charges R150 for R100,000; this is a show-floor price
  and must not move either. Anything added to `PRIZE_TIERS` shows up in the
  tier picker on `/form` and `/buy-a-swing`. `tests/pga-golf-show.test.ts`
  pins this.
- **A paid entry is an `entry` row, not a `free_entry` lead.** `POST
  /api/forms/pga-golf-show/paid` writes a pending row with a `GLE-` reference
  (Tier `PGA Show Swing`, Amount 100, Prize `R100,000`, Course
  `the PGA Golf Show`, Source `getluckygolf.co.za /pga-golf-show`) to Postgres,
  fails closed if that write fails or the database is not configured, then hands
  the signed PayFast fields back for the redirect. The `GLE-` prefix is what routes
  the notification to the entry tab in `/api/payfast/notify`, which marks it
  paid, backfills the email PayFast collected at checkout, and hands the golfer
  to the WhatsApp channel — **once the money has arrived, not on submit**.
- **The course is still `the PGA Golf Show`**, so a paid show entrant gets the
  same show WhatsApp journey as a free one.
- One thing the free path records and this one does not: the **Instagram tap**.
  The `entries` table has no JSON column to hang it on, and it is not worth a
  migration — the tap is recorded for every free entry, which is the number the
  stand watches.
- `/pga-golf-show/success` and `/pga-golf-show/cancel` are the PayFast return
  pages, in the show's colours. They exist rather than reusing `/form/success`
  and `/form/cancel` because those are dressed in our palette and send the
  golfer to `/form`, which asks for a course off the affiliated list. The
  cancel page points back at the free shot: nobody should leave the stand with
  nothing because a card did not go through.

## Branding

Dressed in the show's identity rather than ours: navy `#193262`, green
`#418441` and cream `#f6f4db`, sampled from the show's own lockup. `.pga-theme`
in `globals.css` redefines the colour variables for the page, which is enough
to re-colour the shared form primitives because the Tailwind theme block is
`inline`. The show's lockup and the challenge lockup share the top; Move Golf,
Takomo and Badi Golf sit under the form; Indwe sits directly above the form as
headline sponsor, the horizontal banner kept small.

Logos are in `public/logos/sponsors/`, prepared from the artwork uploaded to
`getluckyjo/pgashow` (trimmed; Badi's white-on-black wordmark cropped and
inverted so it sits on white):

| File | Who |
|---|---|
| `pga-golf-show.png` | PGA Golf & Lifestyle Show 2026 |
| `move-golf.png` | Move Golf |
| `takomo.png` | Takomo |
| `badi-golf.png` | Badi Golf |

`SponsorLogo` falls back to a wordmark for any file that goes missing.

## Not indexed

Like `/form` and `/form-2` the page carries `robots: noindex` and no global nav.
It is reached from a QR code at the stand.
