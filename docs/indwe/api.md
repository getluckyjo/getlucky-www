# Indwe — Get Lucky Golf Club Leads API

Hi Wilhelm — this is the lead feed for the Indwe sponsorship. One read-only HTTPS endpoint, one Bearer token, normalised JSON.

---

## What changed — the feed now sends quote-ready leads only

**Previously** this endpoint returned every lead captured across the website and the on-course QR forms: competition entries, vouchers, corporate enquiries, the lot. Most of those were people who had shown no insurance intent at all, and you were left to sort them.

**Now** the default response carries one kind of lead: a golfer who took the Indwe offer inside WhatsApp, answered the underwriting questions, and consented explicitly to their details reaching you. Type `whatsapp`, tier `Quote-Ready Lead`.

Nothing upstream has changed. Entries still come in from the course QR forms and still flow into the WhatsApp conversation. What changed is that only the ones who finish it are sent to you.

**Two things to expect.**

The volume will be much lower and the quality much higher. That is the intent — you are receiving the end of the funnel, not the top of it.

And **`count` will be `0` until the first golfer completes the journey.** No golfer has completed it yet, so a zero response is the honest current state rather than a broken feed. Every response now carries a `deliveredTypes` array saying what was asked for, so the two can be told apart. If you ever want the wider set back, ask for it with `?type=` — nothing has been deleted.

---

## Endpoint

```
GET https://www.getluckygolf.co.za/api/indwe/leads
Authorization: Bearer <YOUR_API_KEY>
```

That's it. No pagination, no signing, no webhooks to register. Poll on whatever interval suits you (we suggest every 15 minutes).

---

## Authentication

A single Bearer token shared out-of-band. Treat it like a password — server-side only, never put it in a browser or mobile app.

```
Authorization: Bearer <YOUR_API_KEY>
```

Your key is sent separately and never appears in this document. This repository
is public — a key written down here is a key that has been published, whatever
it is captioned as.

---

## Query parameters (all optional)

| Param  | Example                          | Effect                                                              |
|--------|----------------------------------|---------------------------------------------------------------------|
| `since`| `2026-05-01T00:00:00Z`           | Only return leads with a Timestamp >= this ISO 8601 value.          |
| `type` | `course-entry`                   | Ask for one specific type instead of the default. Values: `voucher`, `course-entry`, `free-entry`, `partner`, `corporate`, `charity`, `school`, `simulator`, `tour`, `risk-review`, `membership`, `whatsapp`. |

Note that `type` now **widens** rather than narrows. Omit it and you get quote-ready WhatsApp leads only; pass it and you get exactly the type you asked for. Every type listed above is still captured and still available on request.

Recommended pattern: store the `generatedAt` you receive, pass it back as `since` next poll.

---

## Response shape

```json
{
  "count": 2,
  "generatedAt": "2026-05-04T17:32:11.482Z",
  "deliveredTypes": ["whatsapp"],
  "leads": [
    {
      "id": "GL-VCH-7H3K9",
      "type": "voucher",
      "timestamp": "2026-05-04T16:12:03Z",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "mobile": "+27821234567",
      "course": "Royal Cape",
      "event": "",
      "status": "paid",
      "source": "online",
      "consent": "",
      "leadStage": "",
      "scheduleFile": "",
      "tier": "Eagle",
      "amount": "1500.00",
      "prize": "R1,000,000",
      "date": "",
      "payfastPaymentId": "2487391",
      "raw": { "...original sheet row...": "" }
    },
    {
      "id": "free-entry-2026-05-04T15:55:01Z-john@example.com",
      "type": "free-entry",
      "timestamp": "2026-05-04T15:55:01Z",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "+27839876543",
      "course": "Erinvale",
      "event": "Indwe Corporate Day",
      "status": "lead",
      "source": "qr-on-course",
      "consent": "",
      "leadStage": "",
      "scheduleFile": "",
      "tier": "",
      "amount": "",
      "prize": "",
      "date": "",
      "payfastPaymentId": "",
      "raw": { "...": "" }
    },
    {
      "id": "risk-review-2026-05-04T14:20:00Z-anna@example.com",
      "type": "risk-review",
      "timestamp": "2026-05-04T14:20:00Z",
      "name": "Anna Botha",
      "email": "anna@example.com",
      "mobile": "+27825551234",
      "course": "",
      "event": "",
      "status": "lead",
      "source": "indwe-microsite",
      "consent": "Yes",
      "leadStage": "Direct Warm Lead",
      "scheduleFile": "https://drive.google.com/...",
      "tier": "",
      "amount": "",
      "prize": "",
      "date": "",
      "payfastPaymentId": "",
      "raw": { "...": "" }
    }
  ]
}
```

> The worked examples below show several lead types, because each is still
> reachable with `?type=`. On the default response you will see `whatsapp`
> leads only — the section further down describes exactly what one carries.

### Field reference

| Field              | Type     | Notes                                                                 |
|--------------------|----------|-----------------------------------------------------------------------|
| `id`               | string   | Stable identifier (PayFast reference where applicable). Use for dedup. |
| `type`             | enum     | `voucher` (online purchase) · `course-entry` (paid QR entry on course) · `free-entry` (sponsored free entry) · `partner` (course partner enquiry) · `corporate` (corporate golf-day enquiry) · `risk-review` (Indwe microsite risk-review request) · `membership` (broker switch) · **`whatsapp` (completed WhatsApp profiling conversation — see below)**. |
| `timestamp`        | ISO 8601 | When the lead was captured.                                           |
| `name`             | string   | Best available name (full name / buyer / recipient).                  |
| `email`            | string   | Best available email.                                                 |
| `mobile`           | string   | E.164-formatted where possible.                                       |
| `course`           | string   | Golf course associated with the lead.                                 |
| `event`            | string   | Event name or golf-day date, if any.                                  |
| `status`           | enum     | `paid` · `lead` · `pending`. Only `paid` records are returned for `voucher` and `course-entry`. |
| `source`           | string   | Where the lead came from (`online`, `qr-on-course`, `indwe-microsite`, etc.). |
| `consent`          | string   | Communications consent. `Yes` / `No` for `risk-review`; empty otherwise. |
| `leadStage`        | enum     | Qualification tag, always set: `General Lead` (competition entry — `voucher`, `course-entry`) · `Warm Lead` (sponsored / in-person — `free-entry`, `partner`, `corporate`, `charity`, `simulator`) · `Quote-Ready Lead` (explicit quote intent — `risk-review`, `membership`, `whatsapp`). For `membership`, the broker-switch pipeline state is under `raw.status`. |
| `address`          | string   | Physical address (Google Places formatted, or free-typed). Captured on `risk-review`. On `whatsapp` it carries the golfer's **province**, which is the only location that conversation asks for. Empty otherwise. |
| `scheduleFile`     | string   | URL to an uploaded insurance schedule (risk-review only). Empty otherwise. |
| `tier`             | string   | Entry tier (`voucher` / `course-entry`). Empty otherwise.             |
| `amount`           | string   | Amount paid in ZAR (`voucher` / `course-entry`). Empty otherwise.     |
| `prize`            | string   | Prize associated with the entry (`voucher` / `course-entry`). Empty otherwise. |
| `date`             | string   | Tee-off date for paid course entries. Empty otherwise.                |
| `payfastPaymentId` | string   | PayFast payment ID for paid records. Empty otherwise.                 |
| `raw`              | object   | **Optional safety net.** Original row from our system, for any field not in the normalised shape. You can ignore `raw` entirely — every commonly-used value is now a first-class top-level field. |

---

## WhatsApp leads (`type: "whatsapp"`)

New. These are golfers who entered the hole-in-one challenge, accepted the offer
of 12 months' complimentary membership for completing an Indwe quote, and then
answered a short profiling conversation on WhatsApp. They are the only leads in
this feed that arrive with underwriting detail attached.

Three things worth knowing:

**Consent is explicit and in-conversation.** The golfer was shown the wording and
answered "yes" to their details going to Indwe. A profile that did not consent is
never readable, so `consent` is always `Yes` on this type. That is stronger
evidence than a ticked box on a form.

**They hold an appointment, not a preference.** This changed on 27 August 2026
and it is the most important thing on this page. The golfer chose a **specific
day and hour** from a list, and the last message they received reads *"An Indwe
Advisor will be in touch on Wed 2 Sep, 10:00–11:00."* Every slot they could pick
was a working day inside 08:00–16:30, never a weekend or a South African public
holiday, and never less than two hours ahead.

`raw.call_slot` is that appointment, formatted as the golfer read it.
`raw.call_date` and `raw.call_time` carry the same thing as data for sorting or
diarising.

**Nothing books it.** Not this feed, and not the WhatsApp system — the slot
travels on the lead and no calendar anywhere holds it. A golfer stood up on a
named appointment is a complaint rather than a missed lead, so if honouring
these is not workable at your end, tell us and we will soften what the golfer is
promised. That is a copy change on our side and a quick one.

The membership is still earned by *completing* the quote on that call, not by
requesting one.

**The answers are in `raw`.** They sit there rather than becoming top-level
fields because the question list is deliberately short and still being cut, so
its shape will change. Every key is always present, empty when not asked.

The conversation branches on the first question, so a golfer quoting on one line
of cover leaves the other line's two keys empty. That is the common case, not
the exception.

| `raw` key           | Values                                                    | Question asked |
|---------------------|-----------------------------------------------------------|----------------|
| `line`              | `business` · `personal` · `both`                          | What to quote on |
| `business_cover`    | `assets` · `liabilities` · `both`                         | Which business risks *(business only)* |
| `business_premium`  | `Below R15,000` · `R15,000 – R30,000` · `Above R30,000`   | Current monthly premium *(business only)* |
| `cover`             | `car` · `home` · `both`                                   | Which personal cover *(personal only)* |
| `personal_premium`  | `Below R2,500` · `R2,500 – R5,000` · `Above R5,000`       | Current monthly premium *(personal only)* |
| `current_insurer`   | free text                                                 | Who they are insured with — `no` or `none` when they are not |
| `province`          | one of the nine, e.g. `Western Cape`                      | Which province they are in |
| `call_slot`         | e.g. `Wed 2 Sep, 10:00–11:00`                             | The appointment, as they read it |
| `call_date`         | `YYYY-MM-DD`                                              | Same, as data |
| `call_time`         | `HH:00` — the hour the call starts                        | Same, as data |
| `channel`           | always `whatsapp`                                         | — |

Premium bands and provinces are sent as words rather than internal codes, so a
consultant does not need this page open to read a lead.

`call_slot` is empty in the rare case a golfer's booking answer could not be
read — the underlying text is kept for review on our side. An empty `call_slot`
means **no appointment was promised**, so treat it as a normal call-when-you-can
lead rather than a missed slot.

> **Changed on 27 August 2026.** The keys `area`, `vehicle`, `parking`, `tenure`,
> `currently_insured` and `preferred_call_time` no longer exist — the questions
> behind them were cut when the conversation was rewritten. No lead ever reached
> you carrying a value in any of them.

`id` is stable (`whatsapp-<n>`) and safe to deduplicate on. `mobile` is the
WhatsApp number in E.164 and is always present; `email` and `course` come from
the golfer's entry form and may be empty if they messaged us directly.

**If any of these fields is not what you need to quote, say so** — the
conversation is ours to change, and a question Indwe cannot quote without is
worth adding far more than one nobody uses is worth keeping.

---

## Error responses

| Status | Meaning                                            |
|--------|----------------------------------------------------|
| 401    | Missing or wrong Bearer token.                     |
| 503    | Endpoint not yet enabled (key not configured).     |
| 500    | Upstream read failure. Retry with backoff.         |

All error bodies look like `{ "error": "..." }`.

---

## Quick test (curl)

```bash
curl -s https://www.getluckygolf.co.za/api/indwe/leads \
  -H "Authorization: Bearer YOUR_KEY" | jq
```

Filter to today's paid voucher buyers only:

```bash
curl -s "https://www.getluckygolf.co.za/api/indwe/leads?type=voucher&since=2026-05-04T00:00:00Z" \
  -H "Authorization: Bearer YOUR_KEY" | jq
```

---

## Recommended polling pattern

```js
// Pseudocode — runs every 15 minutes
let lastSync = loadFromDb() || "2026-01-01T00:00:00Z";

const res = await fetch(
  `https://www.getluckygolf.co.za/api/indwe/leads?since=${encodeURIComponent(lastSync)}`,
  { headers: { Authorization: `Bearer ${process.env.GETLUCKY_API_KEY}` } }
);
const { leads, generatedAt } = await res.json();

for (const lead of leads) {
  await upsertById(lead.id, lead); // dedup on lead.id
}

saveToDb(generatedAt); // becomes next `since`
```

---

## Contact

Anything off, ping me directly — Johannes, johannes@getluckygolfclub.com.
