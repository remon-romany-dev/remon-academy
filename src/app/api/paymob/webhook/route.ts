import { NextResponse } from "next/server";
import { applyPaymobResult } from "@/lib/fulfill";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const payload = (await request.json().catch(() => null)) as { obj?: Record<string, unknown>; hmac?: string } | null;
  const obj = payload?.obj;
  const hmac = payload?.hmac || url.searchParams.get("hmac") || "";
  const paymentId = typeof obj?.special_reference === "string" ? obj.special_reference : typeof obj?.merchant_order_id === "string" ? obj.merchant_order_id : "";
  if (!obj || !paymentId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const paid = await applyPaymobResult(paymentId, hmac, obj);
  return NextResponse.json({ ok: paid });
}
