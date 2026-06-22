-- Record the lead source on paid course entries.
--
-- Before this, the `entries` table had no source column, so /api/indwe/leads
-- could not tell where a paid entry came from — it hard-coded "qr-on-course"
-- for every row at read time. That tag was a read-time fiction, not a recorded
-- fact. We now store a real source on the row at capture time.
--
-- Decision (Jun 2026): a single flat "on-course" tag for all /form entries
-- (no QR-vs-ambassador split). The column is free-form text so the tag
-- vocabulary can grow later without another migration.

alter table public.entries add column if not exists source text;

-- Backfill existing rows to the honest flat tag so historical entries read
-- consistently through the Indwe API instead of the old fabricated default.
update public.entries set source = 'on-course' where source is null;
