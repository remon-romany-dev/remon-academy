import { getPrisma } from "@/lib/prisma";
import { hmacMatches, paymobTransactionHmac } from "@/lib/paymob";

export async function activateEnrollment(userId: string, courseId: string, paymentId: string | null): Promise<void> {
  const prisma = getPrisma();
  if (!prisma) {
    return;
  }
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, status: "paid" },
    update: { status: "paid" },
  });
  if (paymentId) {
    await prisma.payment.update({ where: { id: paymentId }, data: { status: "paid" } });
  }
}

export async function applyPaymobResult(paymentId: string, hmac: string, obj: Record<string, unknown>): Promise<boolean> {
  const secret = process.env.PAYMOB_HMAC_SECRET;
  const prisma = getPrisma();
  if (!secret || !prisma || !hmac) {
    return false;
  }
  const expected = paymobTransactionHmac(obj, secret);
  if (!hmacMatches(expected, hmac)) {
    return false;
  }
  const success = obj.success === true || obj.success === "true";
  const pending = obj.pending === true || obj.pending === "true";
  if (!success || pending) {
    return false;
  }
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.provider !== "paymob") {
    return false;
  }
  await activateEnrollment(payment.userId, payment.courseId, payment.id);
  return true;
}
