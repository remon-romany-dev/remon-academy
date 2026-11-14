import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { confirmManualPayment } from "@/actions/payments";
import { ghostButtonClass } from "@/components/account/styles";
import { PageFrame } from "@/components/site/page-frame";
import { requireAdmin } from "@/lib/guards";
import { cairoDay } from "@/lib/day";
import { getPrisma } from "@/lib/prisma";

export const instant = false;

export const metadata: Metadata = {
  title: "لوحة الإدارة",
  robots: { index: false, follow: false },
};

const providerLabel = {
  instapay: "إنستا باي",
  vodafone: "فودافون كاش",
  paymob: "Paymob",
} as const;

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ db?: string }> }) {
  await connection();
  await requireAdmin();
  const search = await searchParams;
  const prisma = getPrisma();
  const payments = prisma
    ? await prisma.payment.findMany({
        where: { status: "pending" },
        include: { user: true, course: true },
        orderBy: { createdAt: "desc" },
      })
    : [];
  const courses = prisma ? await prisma.course.findMany({ orderBy: { sort: "asc" } }) : [];
  const today = cairoDay();
  const visits = prisma ? await prisma.dailyVisit.findMany({ where: { day: { gte: today.slice(0, 8) + "01" } } }) : [];
  const visitCount = visits.reduce((sum, visit) => sum + visit.count, 0);

  return (
    <PageFrame wide>
      <p className="mb-3 text-base font-bold text-accent">الإدارة</p>
      <h1 className="font-display text-4xl font-black">لوحة الإدارة</h1>
      {search.db === "off" ? <p className="mt-4 text-sm text-red-300">قاعدة البيانات مش متوصلة.</p> : null}
      <p className="mt-4 text-base text-muted">زيارات الشهر ده: {visitCount}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/courses/new" className={ghostButtonClass}>
          كورس جديد
        </Link>
        <Link href="/account" className={ghostButtonClass}>
          حسابي
        </Link>
      </div>

      <h2 className="font-display mt-12 text-2xl font-black">تحويلات مستنية مراجعة</h2>
      <ul className="mt-4 space-y-3">
        {payments.length === 0 ? <li className="text-sm text-muted">مفيش تحويلات معلّقة.</li> : null}
        {payments.map((payment) => (
          <li key={payment.id} className="rounded-3xl border border-line bg-surface p-5">
            <p className="font-bold">
              {payment.user.name} · {payment.course.title}
            </p>
            <p className="mt-1 text-sm text-muted">
              {providerLabel[payment.provider]} · {payment.amountEgp.toLocaleString("en-US")} ج.م
            </p>
            <form action={confirmManualPayment} className="mt-4 flex gap-2">
              <input type="hidden" name="paymentId" value={payment.id} />
              <button name="decision" value="paid" className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-ink">
                فعّل الكورس
              </button>
              <button name="decision" value="failed" className="rounded-full border border-line px-4 py-2 text-sm font-bold">
                ارفض
              </button>
            </form>
          </li>
        ))}
      </ul>

      <h2 className="font-display mt-12 text-2xl font-black">الكورسات</h2>
      <ul className="mt-4 divide-y divide-line rounded-3xl border border-line">
        {courses.map((course) => (
          <li key={course.id} className="flex items-center justify-between gap-3 px-5 py-3">
            <span>
              {course.title}{" "}
              <span className="text-sm text-muted">{course.priceEgp.toLocaleString("en-US")} ج.م</span>
            </span>
            <Link href={`/admin/courses/${course.slug}`} className="text-sm font-bold text-accent">
              تعديل
            </Link>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
