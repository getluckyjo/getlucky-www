**Subject:** Get Lucky lead feed — API is live, ready for Wilhelm

---

Hi Coenie,

The lead-feed API we discussed is live. One endpoint, Bearer auth, returns every lead from the Get Lucky site and the on-course QR forms in a single normalised JSON payload.

**For Wilhelm:**

- Endpoint: `GET https://www.getluckygolf.co.za/api/indwe/leads`
- Full integration guide attached (`INDWE_API.md`) — curl examples, response shape, recommended polling pattern. Should be a quick plug-in on his side.
- API key:

```
5d7e4e11700461f924a3959299f7e281a04d1590bae43c802120912a2b2caa29
```

Please pass this to Wilhelm through a secure channel — server-side use only. Happy to send it to him directly if that's easier.

Anything he hits, send him my way.

Best,
Johannes
