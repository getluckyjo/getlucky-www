/**
 * CSV of the membership invite queue, for a mail merge.
 *
 * Gated by the same ops session cookie as /ops. It contains personal data, so
 * it is never cached, never indexed, and only ever contains golfers who gave
 * explicit consent and are not already members — the same hard gate the page
 * applies, applied again here so the export cannot become a back door around it.
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isOpsSessionValid, OPS_COOKIE } from "@/lib/ops/auth";
import { loadMembershipFunnel } from "@/lib/ops/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const cell = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export async function GET() {
  const jar = await cookies();
  if (!isOpsSessionValid(jar.get(OPS_COOKIE)?.value)) {
    return NextResponse.json({ error: "not authorised" }, { status: 401 });
  }

  const funnel = await loadMembershipFunnel();
  const header = ["email", "mobile", "entries", "home_course", "join_url", "last_seen"];
  const lines = [
    header.join(","),
    ...funnel.queue.map((g) =>
      [
        cell(g.email),
        cell(g.mobile),
        cell(String(g.entries)),
        cell(g.homeCourse),
        cell(g.joinUrl ?? ""),
        cell(g.lastSeen.slice(0, 10)),
      ].join(","),
    ),
  ];

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="membership-invites.csv"`,
      "Cache-Control": "no-store, max-age=0",
      "X-Robots-Tag": "noindex",
    },
  });
}
