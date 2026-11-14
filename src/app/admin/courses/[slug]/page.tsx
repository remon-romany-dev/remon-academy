import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { addLesson, deleteLesson, updateCourse, updateLesson } from "@/actions/admin";
import { buttonClass, fieldClass, ghostButtonClass } from "@/components/account/styles";
import { PageFrame } from "@/components/site/page-frame";
import { requireAdmin } from "@/lib/guards";
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
    include: { lessons: { orderBy: { position: "asc" } } },
  });
  if (!course) {
    notFound();
  }
  const outcomes = Array.isArray(course.outcomes) ? course.outcomes.filter((item): item is string => typeof item === "string").join("\n") : "";

  return (
    <PageFrame wide>
      <h1 className="font-display text-4xl font-black">{course.title}</h1>
      {search.error === "1" ? <p className="mt-4 text-sm text-red-300">راجع البيانات.</p> : null}
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
                رقم فيديو Bunny
                <input name="bunnyVideoId" defaultValue={lesson.bunnyVideoId ?? ""} dir="ltr" className={fieldClass} />
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
    </PageFrame>
  );
}
