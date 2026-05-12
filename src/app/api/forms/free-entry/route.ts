import { NextRequest, NextResponse } from "next/server";
import { freeEntrySchema } from "@/lib/validation";
import { appendSubmission } from "@/lib/sheets";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = freeEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: flattenErrors(parsed.error.flatten().fieldErrors),
      },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const timestamp = new Date().toISOString();

  const sheetRow = {
    Timestamp: timestamp,
    Name: d.name,
    Email: d.email,
    Mobile: d.mobile,
    Course: d.course || "",
    Event: d.event || "",
    Source: "getluckygolf.co.za /form-2",
  };

  try {
    await appendSubmission("freeEntry", sheetRow);
  } catch (err) {
    console.error("Free entry sheet append failed", err);
    return NextResponse.json(
      { error: "We couldn't record your entry. Please try again or speak to a marshal." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

function flattenErrors(fe: Record<string, string[] | undefined>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fe)) if (v?.[0]) out[k] = v[0];
  return out;
}
