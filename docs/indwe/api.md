# Indwe — Get Lucky Golf Club Leads API

Hi Wilhelm — this is the lead feed for the Indwe sponsorship. One read-only HTTPS endpoint, one Bearer token, every lead captured across the Get Lucky Golf Club website and on-course QR-code forms returned as normalised JSON.

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
Authorization: Bearer 5d7e4e11700461f924a3959299f7e281a04d1590bae43c802120912a2b2caa29
```

(Your real key will be sent separately.)

---

## Query parameters (all optional)

| Param  | Example                          | Effect                                                              |
|--------|----------------------------------|---------------------------------------------------------------------|
| `since`| `2026-05-01T00:00:00Z`           | Only return leads with a Timestamp >= this ISO 8601 value.          |
| `type` | `voucher`                        | Filter to one type. Values: `voucher`, `course-entry`, `free-entry`, `partner`, `corporate`. |

Recommended pattern: store the `generatedAt` you receive, pass it back as `since` next poll.

---

## Response shape

```json
{
  "count": 2,
  "generatedAt": "2026-05-04T17:32:11.482Z",
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
      "raw": { "...": "" }
    }
  ]
}
```

### Field reference

| Field       | Type     | Notes                                                                 |
|-------------|----------|-----------------------------------------------------------------------|
| `id`        | string   | Stable identifier (PayFast reference where applicable). Use for dedup. |
| `type`      | enum     | `voucher` (online purchase) · `course-entry` (paid QR entry on course) · `free-entry` (sponsored free entry) · `partner` (course partner enquiry) · `corporate` (corporate golf-day enquiry). |
| `timestamp` | ISO 8601 | When the lead was captured.                                           |
| `name`      | string   | Best available name (full name / buyer / recipient).                  |
| `email`     | string   | Best available email.                                                 |
| `mobile`    | string   | E.164-formatted where possible.                                       |
| `course`    | string   | Golf course associated with the lead.                                 |
| `event`     | string   | Event name or golf-day date, if any.                                  |
| `status`    | enum     | `paid` · `lead` · `pending`. Only `paid` records are returned for `voucher` and `course-entry`. |
| `source`    | string   | Where the lead came from (`online`, `qr-on-course`, etc.).            |
| `raw`       | object   | Original row from our system, for any field not in the normalised shape. |

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
