-- Persist the WhatsApp opt-in on paid course entries.
--
-- The tick was captured on /form and handed straight to the WhatsApp service
-- at form submission, then dropped. Nothing on this side ever recorded it.
--
-- That made the handoff impossible to move. It has to happen when the payment
-- succeeds rather than when the form is submitted — otherwise a golfer who
-- opens the PayFast page and walks away is messaged as though they had entered
-- — but by the time the ITN lands, the tick is long gone. Storing it here is
-- what makes the move possible.
--
-- `not null default false` is deliberate. Rows created before this column
-- existed cannot tell us what the golfer chose, and an unknown answer is not
-- consent: those entries stay unmessaged. Deliberately NOT backfilled to true.
--
-- consent_form_version records which wording the golfer actually read, so a
-- consent record can be reconstructed rather than asserted. It is nullable —
-- historical rows genuinely do not have one.

alter table public.entries
  add column if not exists consent_whatsapp boolean not null default false;

alter table public.entries
  add column if not exists consent_form_version text;
