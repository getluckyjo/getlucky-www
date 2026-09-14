# PGA Golf & Lifestyle Show — simulator entry

`/pga-golf-show` is the free entry form for the simulator hole-in-one at the
Get Lucky stand, 18–20 September 2026. One free shot at R25,000 for a name and
a number. No payment.

## What it does

- Asks for **name and mobile only**. No email, no course, no event field — the
  show is the "course".
- **Following @getluckygolfclub on Instagram is a condition of entry.** The
  button opens the profile in a new tab (the Instagram app on a phone) and ticks
  the box for the golfer when they come back. Instagram has no API that lets us
  verify a follow, so this is the golfer's word and is recorded as their word
  (`data.instagram_follow` on the lead).
- The **WhatsApp opt-in** is the same box, same wording, as the course forms.
  It is optional. Consent bundled with entry is not freely given.
- Every entry is handed to the WhatsApp service (`getluckyjo/twillio`) through
  the existing `notifyWhatsAppChannel()` seam, exactly as `/form-2` does.
  Opted-in golfers get the `entry_followup` template automatically; the rest are
  recorded there and never messaged. The course sent is "the PGA Golf Show", so
  the opening reads "thanks for entering ... at the PGA Golf Show".
- Recorded as a `free_entry` lead in Postgres and on the `freeEntry` sheet tab,
  with `Source` = `getluckygolf.co.za /pga-golf-show`. The Indwe feed and the ops
  scorecard pick it up without a new lead type.

## Branding

Co-branded above the form with the show and the stand's co-sponsors (Move
Golf, Takomo, Badi Golf); Indwe below as headline sponsor, the same banner as
the course forms.

Logos are read from `public/logos/sponsors/`:

| File | Who |
|---|---|
| `pga-golf-show.png` | PGA Golf & Lifestyle Show |
| `move-golf.png` | Move Golf |
| `takomo.png` | Takomo |
| `badi-golf.png` | Badi Golf |

`SponsorLogo` falls back to a wordmark for any file that is missing, so the
page ships before the artwork arrives and dropping the file in is the whole
deployment. Transparent PNGs, roughly 3:1, dark artwork — they sit on white.
Change a filename in `PGA_GOLF_SHOW.sponsors` in `src/lib/constants.ts` if a
partner sends an SVG.

## Not indexed

Like `/form` and `/form-2` the page carries `robots: noindex` and no global nav.
It is reached from a QR code at the stand.
