import { createHmac, timingSafeEqual } from "node:crypto";

function asField(value: unknown): string {
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

export function paymobConfigured(): boolean {
  return Boolean(process.env.PAYMOB_SECRET_KEY && process.env.PAYMOB_PUBLIC_KEY && process.env.PAYMOB_INTEGRATION_ID);
}

type PaymobObject = Record<string, unknown> & {
  order?: { id?: unknown };
  source_data?: { pan?: unknown; sub_type?: unknown; type?: unknown };
};

/** ترتيب حقول HMAC في رد Paymob لمعاملة البطاقة. */
export function paymobTransactionHmac(obj: PaymobObject, secret: string): string {
  const source = obj.source_data ?? {};
  const fields = [
    obj.amount_cents,
    obj.created_at,
    obj.currency,
    obj.error_occured,
    obj.has_parent_transaction,
    obj.id,
    obj.integration_id,
    obj.is_3d_secure,
    obj.is_auth,
    obj.is_capture,
    obj.is_refunded,
    obj.is_standalone_payment,
    obj.is_voided,
    obj.order?.id,
    obj.owner,
    obj.pending,
    source.pan,
    source.sub_type,
    source.type,
    obj.success,
  ].map(asField);
  return createHmac("sha512", secret).update(fields.join("")).digest("hex");
}

export function hmacMatches(expected: string, received: string): boolean {
  const left = Buffer.from(expected);
  const right = Buffer.from(received);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}
