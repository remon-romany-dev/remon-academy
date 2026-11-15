import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { addLesson, deleteLesson, updateCourse, updateLesson } from "@/actions/admin";
import { createMeeting, deleteMeeting, saveAttendance } from "@/actions/meetings";
import { buttonClass, fieldClass, ghostButtonClass } from "@/components/account/styles";
import { PageFrame } from "@/components/site/page-frame";
import { requireAdmin } from "@/lib/guards";
import { formatCairo, meetingKindLabel, studyModeLabel } from "@/lib/meetings";
import { getPrisma } from "@/lib/prisma";

export const instant = false;

export const metadata: Metadata = {
  title: "تعديل كورس",
  robots: { index: false, follow: false },
};

export default async function EditCoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await connection();
  await requireAdmin();
  const { slug } = await params;
  const search = await searchParams;
  const prisma = getPrisma();
  if (!prisma) {
    notFound();
  }
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: { orderBy: { position: "asc" } },
      meetings: { orderBy: { startsAt: "asc" }, include: { attendance: true } },
      enrollments: { where: { status: "paid" }, include: { user: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!course) {
    notFound();
  }
  const outcomes = Array.isArray(course.outcomes) ? course.outcomes.filter((item): item is string => typeof item === "string").join("\n") : "";

  return (
    <PageFrame wide>
      <h1 className="font-display text-4xl font-black">{course.title}</h1>
      {search.error === "1" ? <p className="mt-4 text-sm text-red-300">راجع البيانات.</p> : null}
      {search.error === "meeting" ? <p className="mt-4 text-sm text-red-300">الحصة محتاجة عنوان وميعاد. الأونلاين برابط meet.google.com، والقاعة بمكان.</p> : null}
      <form action={updateCourse} className="mt-8 grid gap-4">
        <input type="hidden" name="slug" value={course.slug} />
        <label className="block text-sm font-bold">
          الاسم
          <input name="title" defaultValue={course.title} className={fieldClass} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold">
            الساعات
            <input name="hours" type="number" min={1} defaultValue={course.hours} className={fieldClass} />
          </label>
          <label className="block text-sm font-bold">
            السعر بالجنيه
            <input name="priceEgp" type="number" min={0} defaultValue={course.priceEgp} className={fieldClass} />
          </label>
        </div>
        <label className="block text-sm font-bold">
          الملخص
          <textarea name="summary" rows={3} defaultValue={course.summary} className={fieldClass} />
        </label>
        <label className="block text-sm font-bold">
          مناسب لمين
          <textarea name="audience" rows={2} defaultValue={course.audience} className={fieldClass} />
        </label>
        <label className="block text-sm font-bold">
          المخرجات
          <textarea name="outcomes" rows={4} defaultValue={outcomes} className={fieldClass} />
        </label>
        <label className="block text-sm font-bold">
          طريقة الدراسة على الكورس
          <input name="attendance" defaultValue={course.attendance} className={fieldClass} />
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" name="published" defaultChecked={course.published} />
          ظاهر في الموقع
        </label>
        <button type="submit" className={buttonClass}>
          حفظ التعديل
        </button>
      </form>

      <h2 className="font-display mt-12 text-2xl font-black">الدروس</h2>
      <ul className="mt-4 space-y-4">
        {course.lessons.map((lesson) => (
          <li key={lesson.id} className="rounded-3xl border border-line p-4">
            <form action={updateLesson} className="grid gap-3">
              <input type="hidden" name="slug" value={course.slug} />
              <input type="hidden" name="lessonId" value={lesson.id} />
              <label className="block text-sm font-bold">
                عنوان الدرس {lesson.position}
                <input name="title" defaultValue={lesson.title} className={fieldClass} />
              </label>
              <label className="block text-sm font-bold">
                رابط يوتيوب أو رقم Bunny
                <input
                  name="bunnyVideoId"
                  defaultValue={lesson.bunnyVideoId ?? ""}
                  placeholder="https://youtu.be/..."
                  dir="ltr"
                  className={fieldClass}
                />
              </label>
              <label className="flex items-center gap-2 text-sm font-bold">
                <input type="checkbox" name="isFree" defaultChecked={lesson.isFree} />
                درس مجاني
              </label>
              <button type="submit" className={ghostButtonClass}>
                حفظ الدرس
              </button>
            </form>
            <form action={deleteLesson} className="mt-3">
              <input type="hidden" name="slug" value={course.slug} />
              <input type="hidden" name="lessonId" value={lesson.id} />
              <button type="submit" className="text-sm font-bold text-red-300">
                حذف الدرس
              </button>
            </form>
          </li>
        ))}
      </ul>
      <form action={addLesson} className="mt-6 flex flex-wrap gap-3">
        <input type="hidden" name="slug" value={course.slug} />
        <input name="title" placeholder="درس جديد" className={`${fieldClass} mt-0 min-w-64`} />
        <button type="submit" className={buttonClass}>
          إضافة
        </button>
      </form>

      <h2 className="font-display mt-12 text-2xl font-black">الحصص</h2>
      <p className="mt-2 text-sm leading-6 text-muted">حصة أونلاين برابط Google Meet، أو حصة في القاعة. الحضور يتعلم على الطلاب المفتوح لهم الكورس.</p>
      <ul className="mt-4 space-y-4">
        {course.meetings.length === 0 ? <li className="text-sm text-muted">لسه مفيش حصص.</li> : null}
        {course.meetings.map((meeting) => {
          const roster = course.enrollments.filter((enrollment) => enrollment.mode === meeting.kind);
          const presentIds = new Set(meeting.attendance.filter((row) => row.present).map((row) => row.userId));
          return (
            <li key={meeting.id} className="rounded-3xl border border-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-black">{meeting.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {formatCairo(meeting.startsAt)} · {meetingKindLabel(meeting.kind)}
                    {meeting.place ? ` · ${meeting.place}` : ""}
                  </p>
                  {meeting.meetUrl ? (
                    <a href={meeting.meetUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex font-bold text-accent" dir="ltr">
                      {meeting.meetUrl}
                    </a>
                  ) : null}
                </div>
                <form action={deleteMeeting}>
                  <input type="hidden" name="slug" value={course.slug} />
                  <input type="hidden" name="meetingId" value={meeting.id} />
                  <button type="submit" className="text-sm font-bold text-red-300">
                    حذف الحصة
                  </button>
                </form>
              </div>
              <form action={saveAttendance} className="mt-4 space-y-3">
                <input type="hidden" name="slug" value={course.slug} />
                <input type="hidden" name="meetingId" value={meeting.id} />
                {roster.length === 0 ? <p className="text-sm text-muted">مفيش طلاب مختارين {meetingKindLabel(meeting.kind)} في الكورس ده.</p> : null}
                <ul className="space-y-2">
                  {roster.map((enrollment) => (
                    <li key={enrollment.id}>
                      <input type="hidden" name="studentId" value={enrollment.userId} />
                      <label className="flex items-start gap-2 text-sm">
                        <input type="checkbox" name="present" value={enrollment.userId} defaultChecked={presentIds.has(enrollment.userId)} className="mt-1" />
                        <span>
                          {enrollment.user.name}
                          <span className="mt-1 block text-muted">{studyModeLabel(enrollment.mode)}</span>
                          <span className="block text-muted" dir="ltr">
                            {enrollment.user.email}
                            {enrollment.user.phone ? ` · ${enrollment.user.phone}` : ""}
                          </span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                {roster.length > 0 ? (
                  <button type="submit" className={ghostButtonClass}>
                    حفظ الحضور
                  </button>
                ) : null}
              </form>
            </li>
          );
        })}
      </ul>
      <form action={createMeeting} className="mt-6 grid gap-3">
        <input type="hidden" name="slug" value={course.slug} />
        <label className="block text-sm font-bold">
          عنوان الحصة
          <input name="title" required className={fieldClass} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-bold">
            الميعاد بتوقيت مصر
            <input name="startsAt" type="datetime-local" required dir="ltr" className={fieldClass} />
          </label>
          <label className="block text-sm font-bold">
            النوع
            <select name="kind" defaultValue="online" className={fieldClass}>
              <option value="online">أونلاين على Google Meet</option>
              <option value="hall">قاعة</option>
            </select>
          </label>
        </div>
        <label className="block text-sm font-bold">
          رابط Google Meet
          <input name="meetUrl" type="url" placeholder="https://meet.google.com/..." dir="ltr" className={fieldClass} />
        </label>
        <label className="block text-sm font-bold">
          مكان القاعة
          <input name="place" className={fieldClass} />
        </label>
        <button type="submit" className={buttonClass}>
          أضف الحصة
        </button>
      </form>
    </PageFrame>
  );
}
