import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { PageFrame } from "@/components/site/page-frame";
import { applyPaymobResult } from "@/lib/fulfill";
import { getPrisma } from "@/lib/prisma";

export const instant = false;

export const metadata: Metadata = {
  title: "نتيجة الدفع",
  robots: { index: false, follow: false },
};

export default async function PaymentReturnPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const { slug } = await params;
  const search = await searchParams;
  const paymentId = typeof search.payment === "string" ? search.payment : "";
  const hmac = typeof search.hmac === "string" ? search.hmac : "";
  const prisma = getPrisma();
  if (prisma && paymentId && hmac) {
    const obj = Object.fromEntries(Object.entries(search).flatMap(([key, value]) => (typeof value === "string" ? [[key, value]] : [])));
    await applyPaymobResult(paymentId, hmac, obj);
  }
  const payment = prisma && paymentId ? await prisma.payment.findUnique({ where: { id: paymentId } }) : null;
  const paid = payment?.status === "paid";

  return (
    <PageFrame>
      <h1 className="font-display text-4xl font-black">{paid ? "الدفع اتأكد" : "بنراجع الدفع"}</h1>
      <p className="mt-4 text-base leading-7 text-muted">
        {paid ? "الكورس اتفتح في حسابك." : "لو حوّلت بإنستا باي، هنفتح الكورس بعد مراجعة الإيصال."}
      </p>
      <Link href={paid ? "/account" : `/courses/${slug}`} className="mt-8 inline-flex font-bold text-accent">
        {paid ? "روح لحسابي" : "رجوع للكورس"}
      </Link>
    </PageFrame>
  );
}
