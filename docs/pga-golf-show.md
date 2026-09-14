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
