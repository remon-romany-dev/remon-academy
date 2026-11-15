import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { changePassword, logoutAction } from "@/actions/auth";
import { submitProject } from "@/actions/learning";
import { buttonClass, fieldClass, ghostButtonClass } from "@/components/account/styles";
import { PageFrame } from "@/components/site/page-frame";
import { requireUser } from "@/lib/guards";
import { getPrisma } from "@/lib/prisma";

export const instant = false;

export const metadata: Metadata = {
  title: "حسابي",
  robots: { index: false, follow: false },
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; project?: string; password?: string }>;
}) {
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
  const submissions = prisma ? await prisma.submission.findMany({ where: { userId: session.user.id } }) : [];
  const done = new Set(progress.map((item) => item.lessonId));
  const submitted = new Map(submissions.map((item) => [item.courseId, item]));
  const passwordNote = {
    ok: "كلمة السر اتغيرت.",
    short: "كلمة السر الجديدة لازم تبقى 8 حروف على الأقل.",
    bad: "كلمة السر الحالية غلط.",
    off: "تغيير كلمة السر مش متاح دلوقتي.",
  } as const;
  const passwordKey = search.password;
  const passwordMessage = passwordKey === "ok" || passwordKey === "short" || passwordKey === "bad" || passwordKey === "off" ? passwordNote[passwordKey] : null;

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
          استلمنا طلب التحويل. بعد مراجعة الإيصال الكورس هيتفتح هنا، وهتوصلك رسالة على الإيميل.
        </p>
      ) : null}
      {search.project === "1" ? (
        <p className="mt-4 rounded-2xl border border-line bg-surface p-4 text-base leading-7">المشروع اتسجل.</p>
      ) : null}
      {search.project === "bad" ? (
        <p className="mt-4 text-sm font-bold text-red-300">حط رابط المشروع كامل، ويبدأ بـ http أو https.</p>
      ) : null}
      {passwordMessage ? <p className="mt-4 text-sm font-bold text-accent">{passwordMessage}</p> : null}
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
            const project = submitted.get(enrollment.course.id);
            const ready = open && percent === 100 && Boolean(project);
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
                  {ready ? (
                    <Link href={`/account/certificate/${enrollment.course.slug}`} className="font-bold text-accent">
                      الشهادة
                    </Link>
                  ) : null}
                </div>
                {open ? (
                  <form id={`project-${enrollment.course.slug}`} action={submitProject} className="mt-5 space-y-3">
                    <input type="hidden" name="slug" value={enrollment.course.slug} />
                    <p className="text-sm font-bold">المشروع النهائي</p>
                    <label className="block text-sm">
                      رابط المشروع
                      <input name="url" type="url" required defaultValue={project?.url ?? ""} dir="ltr" placeholder="https://" className={fieldClass} />
                    </label>
                    <label className="block text-sm">
                      ملاحظة
                      <input name="note" defaultValue={project?.note ?? ""} maxLength={500} className={fieldClass} />
                    </label>
                    <button type="submit" className={buttonClass}>
                      {project ? "حدّث التسليم" : "سلّم المشروع"}
                    </button>
                    {project && percent < 100 ? <p className="text-sm text-muted">المشروع متسجل. خلّص الدروس عشان الشهادة.</p> : null}
                  </form>
                ) : null}
              </li>
            );
          })
        )}
      </ul>
      <form action={changePassword} className="mt-10 max-w-md space-y-4 rounded-3xl border border-line bg-surface p-6">
        <h2 className="font-display text-2xl font-black">تغيير كلمة السر</h2>
        <label className="block text-sm font-bold">
          كلمة السر الحالية
          <input name="current" type="password" required autoComplete="current-password" dir="ltr" className={fieldClass} />
        </label>
        <label className="block text-sm font-bold">
          كلمة السر الجديدة
          <input name="password" type="password" required minLength={8} autoComplete="new-password" dir="ltr" className={fieldClass} />
        </label>
        <button type="submit" className={buttonClass}>
          احفظ
        </button>
      </form>
    </PageFrame>
  );
}
