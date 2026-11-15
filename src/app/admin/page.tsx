import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { adminSetPassword } from "@/actions/auth";
import { reviewSubmission } from "@/actions/learning";
import { confirmManualPayment } from "@/actions/payments";
import { fieldClass, ghostButtonClass } from "@/components/account/styles";
import { PageFrame } from "@/components/site/page-frame";
import { requireAdmin } from "@/lib/guards";
import { cairoDay, cairoDayRange } from "@/lib/day";
import { formatCairo, meetingKindLabel, studyModeLabel } from "@/lib/meetings";
import { getPrisma } from "@/lib/prisma";
import type { PaymentStatus } from "@prisma/client";

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

function enrollmentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case "paid":
      return "مفتوح";
    case "pending":
      return "مستني الدفع";
    case "failed":
      return "الدفع مرفوض";
    default: {
      const neverStatus: never = status;
      return neverStatus;
    }
  }
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ db?: string; password?: string }> }) {
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
  const resets = prisma
    ? await prisma.passwordReset.findMany({
        where: { usedAt: null, expiresAt: { gt: new Date() } },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      })
    : [];
  const submissions = prisma
    ? await prisma.submission.findMany({
        include: { user: true, course: true },
        orderBy: { updatedAt: "desc" },
        take: 20,
      })
    : [];
  const today = cairoDayRange();
  const todayMeetings = prisma
    ? await prisma.classMeeting.findMany({
        where: { startsAt: { gte: today.start, lte: today.end } },
        include: { course: true },
        orderBy: { startsAt: "asc" },
      })
    : [];
  const students = prisma
    ? await prisma.user.findMany({
        where: { role: "student" },
        include: { enrollments: { include: { course: true }, orderBy: { createdAt: "desc" } } },
        orderBy: { createdAt: "desc" },
        take: 40,
      })
    : [];
  const paymentModes =
    prisma && payments.length > 0
      ? await prisma.enrollment.findMany({
          where: { OR: payments.map((payment) => ({ userId: payment.userId, courseId: payment.courseId })) },
          select: { userId: true, courseId: true, mode: true },
        })
      : [];
  const modeByKey = new Map(paymentModes.map((enrollment) => [`${enrollment.userId}:${enrollment.courseId}`, enrollment.mode]));
  const monthStart = `${cairoDay().slice(0, 8)}01`;
  const visits = prisma ? await prisma.dailyVisit.findMany({ where: { day: { gte: monthStart } } }) : [];
  const visitCount = visits.reduce((sum, visit) => sum + visit.count, 0);

  return (
    <PageFrame wide>
      <p className="mb-3 text-base font-bold text-accent">الإدارة</p>
      <h1 className="font-display text-4xl font-black">لوحة الإدارة</h1>
      {search.db === "off" ? <p className="mt-4 text-sm text-red-300">قاعدة البيانات مش متوصلة.</p> : null}
      {search.password === "ok" ? <p className="mt-4 text-sm font-bold text-accent">كلمة السر اتسجلت. ابعتها للطالب على واتساب.</p> : null}
      {search.password === "short" ? <p className="mt-4 text-sm font-bold text-red-300">كلمة السر لازم تبقى 8 حروف على الأقل.</p> : null}
      <p className="mt-4 text-base text-muted">زيارات الشهر ده: {visitCount}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/courses/new" className={ghostButtonClass}>
          كورس جديد
        </Link>
        <Link href="/account" className={ghostButtonClass}>
          حسابي
        </Link>
      </div>

      <h2 className="font-display mt-12 text-2xl font-black">حصص النهاردة</h2>
      <ul className="mt-4 space-y-3">
        {todayMeetings.length === 0 ? <li className="text-sm text-muted">مفيش حصص النهاردة.</li> : null}
        {todayMeetings.map((meeting) => (
          <li key={meeting.id} className="rounded-3xl border border-line bg-surface p-5">
            <p className="font-bold">{meeting.title}</p>
            <p className="mt-1 text-sm text-muted">
              {meeting.course.title} · {formatCairo(meeting.startsAt)} · {meetingKindLabel(meeting.kind)}
            </p>
            <Link href={`/admin/courses/${meeting.course.slug}`} className="mt-3 inline-flex text-sm font-bold text-accent">
              الحضور والتعديل
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="font-display mt-12 text-2xl font-black">تحويلات مستنية مراجعة</h2>
      <ul className="mt-4 space-y-3">
        {payments.length === 0 ? <li className="text-sm text-muted">مفيش تحويلات معلّقة.</li> : null}
        {payments.map((payment) => (
          <li key={payment.id} className="rounded-3xl border border-line bg-surface p-5">
            <p className="font-bold">
              {payment.user.name} · {payment.course.title}
            </p>
            <p className="mt-1 text-sm text-muted">
              {providerLabel[payment.provider]} · {payment.amountEgp.toLocaleString("en-US")} ج.م ·{" "}
              {studyModeLabel(modeByKey.get(`${payment.userId}:${payment.courseId}`) ?? "online")}
              {payment.user.phone ? ` · ${payment.user.phone}` : ""}
              {payment.reference ? ` · رقم العملية ${payment.reference}` : ""}
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

      <h2 className="font-display mt-12 text-2xl font-black">طلبات استعادة كلمة السر</h2>
      <ul className="mt-4 space-y-3">
        {resets.length === 0 ? <li className="text-sm text-muted">مفيش طلبات مفتوحة.</li> : null}
        {resets.map((reset) => (
          <li key={reset.id} className="rounded-3xl border border-line bg-surface p-5">
            <p className="font-bold">
              {reset.user.name} · <span dir="ltr">{reset.user.email}</span>
            </p>
            <form action={adminSetPassword} className="mt-4 flex flex-wrap items-end gap-2">
              <input type="hidden" name="userId" value={reset.userId} />
              <label className="text-sm font-bold">
                كلمة سر جديدة
                <input name="password" type="text" required minLength={8} dir="ltr" autoComplete="off" className={fieldClass} />
              </label>
              <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-ink">
                احفظ وابعتها له
              </button>
            </form>
          </li>
        ))}
      </ul>

      <h2 className="font-display mt-12 text-2xl font-black">تسليمات المشاريع</h2>
      <ul className="mt-4 space-y-3">
        {submissions.length === 0 ? <li className="text-sm text-muted">لسه مفيش تسليم.</li> : null}
        {submissions.map((submission) => (
          <li key={submission.id} className="rounded-3xl border border-line bg-surface p-5">
            <p className="font-bold">
              {submission.user.name} · {submission.course.title}
            </p>
            <a href={submission.url} className="mt-2 block text-sm font-bold text-accent" dir="ltr">
              {submission.url}
            </a>
            {submission.note ? <p className="mt-2 text-sm text-muted">{submission.note}</p> : null}
            {submission.reviewed ? (
              <p className="mt-3 text-sm font-bold text-accent">اتراجعت</p>
            ) : (
              <form action={reviewSubmission} className="mt-3">
                <input type="hidden" name="submissionId" value={submission.id} />
                <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-ink">
                  اتراجعت
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>

      <h2 className="font-display mt-12 text-2xl font-black">الطلاب</h2>
      <ul className="mt-4 space-y-3">
        {students.length === 0 ? <li className="text-sm text-muted">لسه مفيش طلاب مسجّلين.</li> : null}
        {students.map((student) => (
          <li key={student.id} className="rounded-3xl border border-line bg-surface p-5">
            <p className="font-bold">{student.name}</p>
            <p className="mt-1 text-sm text-muted" dir="ltr">
              {student.email}
            </p>
            <p className="mt-1 text-sm text-muted">
              {student.phone ? student.phone : "من غير موبايل"} · سجّل {formatCairo(student.createdAt)}
            </p>
            {student.enrollments.length === 0 ? (
              <p className="mt-2 text-sm text-muted">لسه مشتركش في كورس.</p>
            ) : (
              <ul className="mt-3 space-y-1 text-sm">
                {student.enrollments.map((enrollment) => (
                  <li key={enrollment.id}>
                    {enrollment.course.title} · {studyModeLabel(enrollment.mode)} · {enrollmentStatusLabel(enrollment.status)}
                  </li>
                ))}
              </ul>
            )}
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
