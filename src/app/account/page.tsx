import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { ghostButtonClass } from "@/components/account/styles";
import { PageFrame } from "@/components/site/page-frame";
import { requireUser } from "@/lib/guards";
import { getPrisma } from "@/lib/prisma";

export const instant = false;

export const metadata: Metadata = {
  title: "حسابي",
  robots: { index: false, follow: false },
};

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  await connection();
  const session = await requireUser();
  const search = await searchParams;
  const prisma = getPrisma();
  const enrollments = prisma
    ? await prisma.enrollment.findMany({
        where: { userId: session.user.id },
        include: { course: { include: { lessons: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];
  const progress = prisma ? await prisma.lessonProgress.findMany({ where: { userId: session.user.id } }) : [];
  const done = new Set(progress.map((item) => item.lessonId));

  return (
    <PageFrame wide>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-base font-bold text-accent">حسابي</p>
          <h1 className="font-display text-4xl font-black">أهلاً {session.user.name}</h1>
        </div>
        <form action={logoutAction}>
          <button type="submit" className={ghostButtonClass}>
            خروج
          </button>
        </form>
      </div>
      {search.sent === "1" ? (
        <p className="mt-6 rounded-2xl border border-line bg-surface p-4 text-base leading-7">
          استلمنا طلب التحويل. بعد مراجعة الإيصال الكورس هيتفتح هنا.
        </p>
      ) : null}
      {session.user.role === "admin" ? (
        <Link href="/admin" className="mt-6 inline-flex font-bold text-accent">
          لوحة الإدارة
        </Link>
      ) : null}
      <ul className="mt-8 space-y-4">
        {enrollments.length === 0 ? (
          <li className="rounded-3xl border border-line bg-surface p-6 text-base leading-7 text-muted">
            لسه مشتركتش في كورس.{" "}
            <Link href="/#courses" className="font-bold text-accent">
              شوف الكورسات
            </Link>
          </li>
        ) : (
          enrollments.map((enrollment) => {
            const total = enrollment.course.lessons.length;
            const finished = enrollment.course.lessons.filter((lesson) => done.has(lesson.id)).length;
            const percent = total === 0 ? 0 : Math.round((finished / total) * 100);
            const open = enrollment.status === "paid";
            return (
              <li key={enrollment.id} className="rounded-3xl border border-line bg-surface p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="font-display text-2xl font-black">{enrollment.course.title}</h2>
                  <span className="rounded-full bg-background px-3 py-1 text-sm font-bold">
                    {open ? "مفتوح" : "مستني تأكيد الدفع"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted">
                  {finished} من {total} دروس · {percent}%
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                  <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/learn/${enrollment.course.slug}`} className="font-bold text-accent">
                    {open ? "كمّل الدروس" : "الدرس المجاني"}
                  </Link>
                  {open && percent === 100 ? (
                    <Link href={`/account/certificate/${enrollment.course.slug}`} className="font-bold text-accent">
                      الشهادة
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </PageFrame>
  );
}
