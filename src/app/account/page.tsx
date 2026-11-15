import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { changePassword, logoutAction, updateProfile } from "@/actions/auth";
import { submitProject, updateStudyMode } from "@/actions/learning";
import { buttonClass, fieldClass, ghostButtonClass } from "@/components/account/styles";
import { PageFrame } from "@/components/site/page-frame";
import { requireUser } from "@/lib/guards";
import { canJoinMeeting, courseAllowsHall, formatCairo, meetingKindLabel, studyModeLabel } from "@/lib/meetings";
import { getPrisma } from "@/lib/prisma";

export const instant = false;

export const metadata: Metadata = {
  title: "حسابي",
  robots: { index: false, follow: false },
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; project?: string; password?: string; profile?: string }>;
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
  const pendingPayments = prisma
    ? await prisma.payment.findMany({ where: { userId: session.user.id, status: "pending" } })
    : [];
  const profile = prisma ? await prisma.user.findUnique({ where: { id: session.user.id } }) : null;
  const courseIds = enrollments.map((enrollment) => enrollment.course.id);
  const meetings = prisma && courseIds.length > 0
    ? await prisma.classMeeting.findMany({
        where: { courseId: { in: courseIds } },
        include: { attendance: { where: { userId: session.user.id } } },
        orderBy: { startsAt: "asc" },
      })
    : [];
  const done = new Set(progress.map((item) => item.lessonId));
  const submitted = new Map(submissions.map((item) => [item.courseId, item]));
  const referenceByCourse = new Map(pendingPayments.flatMap((payment) => (payment.reference ? [[payment.courseId, payment.reference] as const] : [])));
  const passwordNote = {
    ok: "كلمة السر اتغيرت.",
    short: "كلمة السر الجديدة لازم تبقى 8 حروف على الأقل.",
    bad: "كلمة السر الحالية غلط.",
    off: "تغيير كلمة السر مش متاح دلوقتي.",
  } as const;
  const passwordKey = search.password;
  const passwordMessage = passwordKey === "ok" || passwordKey === "short" || passwordKey === "bad" || passwordKey === "off" ? passwordNote[passwordKey] : null;
  const profileNote = {
    ok: "بياناتك اتسجلت.",
    bad: "راجع الاسم والموبايل.",
    off: "تعديل البيانات مش متاح دلوقتي.",
  } as const;
  const profileKey = search.profile;
  const profileMessage = profileKey === "ok" || profileKey === "bad" || profileKey === "off" ? profileNote[profileKey] : null;
  const displayName = profile?.name ?? session.user.name;
  const nextMeeting = meetings
    .filter((meeting) => {
      const enrollment = enrollments.find((item) => item.course.id === meeting.courseId);
      return enrollment?.status === "paid" && enrollment.mode === meeting.kind && canJoinMeeting(meeting.startsAt);
    })
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())[0];
  const nextCourse = nextMeeting ? enrollments.find((item) => item.course.id === nextMeeting.courseId)?.course : undefined;

  return (
    <PageFrame wide>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-base font-bold text-accent">حسابي</p>
          <h1 className="font-display text-4xl font-black">أهلاً {displayName}</h1>
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
      {profileMessage ? <p className="mt-4 text-sm font-bold text-accent">{profileMessage}</p> : null}
      {nextMeeting && nextCourse ? (
        <section className="mt-8 rounded-3xl border border-line bg-surface p-6">
          <p className="text-sm font-bold text-accent">الحصة الجاية</p>
          <h2 className="font-display mt-2 text-3xl font-black">{nextMeeting.title}</h2>
          <p className="mt-2 text-base text-muted">
            {nextCourse.title} · {formatCairo(nextMeeting.startsAt)}
            {nextMeeting.place ? ` · ${nextMeeting.place}` : ""}
          </p>
          {nextMeeting.kind === "online" && nextMeeting.meetUrl ? (
            <a href={nextMeeting.meetUrl} target="_blank" rel="noopener noreferrer" className={`${buttonClass} mt-5`}>
              ادخل الحصة
            </a>
          ) : null}
        </section>
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
                  {studyModeLabel(enrollment.mode)} · {finished} من {total} دروس · {percent}%
                </p>
                {!open && referenceByCourse.get(enrollment.course.id) ? (
                  <p className="mt-2 text-sm text-muted" dir="ltr">
                    رقم العملية: {referenceByCourse.get(enrollment.course.id)}
                  </p>
                ) : null}
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                  <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
                </div>
                {courseAllowsHall(enrollment.course.attendance) ? (
                  <form action={updateStudyMode} className="mt-4 flex flex-wrap items-end gap-3">
                    <input type="hidden" name="slug" value={enrollment.course.slug} />
                    <label className="text-sm font-bold">
                      طريقة الحضور
                      <select name="mode" defaultValue={enrollment.mode} className={fieldClass}>
                        <option value="online">أونلاين</option>
                        <option value="hall">حضوري</option>
                      </select>
                    </label>
                    <button type="submit" className={ghostButtonClass}>
                      غيّر
                    </button>
                  </form>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/learn/${enrollment.course.slug}`} className="font-bold text-accent">
                    {open ? "كمّل الدروس المسجّلة" : "الدرس المجاني"}
                  </Link>
                  {ready ? (
                    <Link href={`/account/certificate/${enrollment.course.slug}`} className="font-bold text-accent">
                      الشهادة
                    </Link>
                  ) : null}
                </div>
                {open ? (
                  <ul className="mt-5 space-y-3">
                    {meetings
                      .filter((meeting) => meeting.courseId === enrollment.course.id && meeting.kind === enrollment.mode)
                      .map((meeting) => {
                        const mark = meeting.attendance[0];
                        const past = meeting.startsAt.getTime() < Date.now();
                        const attendanceLabel = mark ? (mark.present ? "حاضر" : "غايب") : past ? "لسه متسجلش" : "لسه محصلتش";
                        return (
                          <li key={meeting.id} className="rounded-2xl border border-line px-4 py-3">
                            <p className="font-bold">{meeting.title}</p>
                            <p className="mt-1 text-sm text-muted">
                              {formatCairo(meeting.startsAt)} · {meetingKindLabel(meeting.kind)} · {attendanceLabel}
                              {meeting.place ? ` · ${meeting.place}` : ""}
                            </p>
                            {meeting.kind === "online" && meeting.meetUrl && canJoinMeeting(meeting.startsAt) ? (
                              <a href={meeting.meetUrl} target="_blank" rel="noopener noreferrer" className={`${buttonClass} mt-3`}>
                                ادخل الحصة
                              </a>
                            ) : null}
                          </li>
                        );
                      })}
                  </ul>
                ) : null}
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
                    {project?.reviewed ? <p className="text-sm text-muted">التسليم اتراجع.</p> : null}
                    {project && !project.reviewed ? <p className="text-sm text-muted">التسليم متسجل ومستني المراجعة.</p> : null}
                    {project && percent < 100 ? <p className="text-sm text-muted">خلّص الدروس عشان الشهادة.</p> : null}
                  </form>
                ) : null}
              </li>
            );
          })
        )}
      </ul>
      <form action={updateProfile} className="mt-10 max-w-md space-y-4 rounded-3xl border border-line bg-surface p-6">
        <h2 className="font-display text-2xl font-black">بياناتك</h2>
        <label className="block text-sm font-bold">
          الاسم
          <input name="name" required defaultValue={displayName ?? ""} className={fieldClass} />
        </label>
        <label className="block text-sm font-bold">
          الموبايل
          <input name="phone" defaultValue={profile?.phone ?? ""} dir="ltr" placeholder="01xxxxxxxxx" className={fieldClass} />
        </label>
        <button type="submit" className={buttonClass}>
          احفظ
        </button>
      </form>
      <form action={changePassword} className="mt-6 max-w-md space-y-4 rounded-3xl border border-line bg-surface p-6">
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
