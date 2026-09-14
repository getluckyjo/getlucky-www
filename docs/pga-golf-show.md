# PGA Golf & Lifestyle Show — simulator entry

`/pga-golf-show` is the free entry form for the simulator hole-in-one at the
Get Lucky stand, 18–20 September 2026. One free shot at R25,000 for a name and
a number. No payment.

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
- Recorded as a `free_entry` lead in Postgres and on the `freeEntry` sheet tab,
  with `Source` = `getluckygolf.co.za /pga-golf-show`. The Indwe feed and the ops
  scorecard pick it up without a new lead type.

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
