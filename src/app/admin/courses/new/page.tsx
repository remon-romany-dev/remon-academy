import type { Metadata } from "next";
import { connection } from "next/server";
import { createCourse } from "@/actions/admin";
import { buttonClass, fieldClass } from "@/components/account/styles";
import { PageFrame } from "@/components/site/page-frame";
import { tracks } from "@/content/site";
import { requireAdmin } from "@/lib/guards";

export const instant = false;

export const metadata: Metadata = {
  title: "كورس جديد",
  robots: { index: false, follow: false },
};

export default async function NewCoursePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await connection();
  await requireAdmin();
  const search = await searchParams;
  return (
    <PageFrame>
      <h1 className="font-display text-4xl font-black">كورس جديد</h1>
      {search.error === "1" ? <p className="mt-4 text-sm text-red-300">راجع الاسم والسعر والدروس.</p> : null}
      <form action={createCourse} className="mt-8 space-y-4">
        <label className="block text-sm font-bold">
          الرابط
          <input name="slug" required dir="ltr" placeholder="wordpress" className={fieldClass} />
        </label>
        <label className="block text-sm font-bold">
          الاسم
          <input name="title" required className={fieldClass} />
        </label>
        <label className="block text-sm font-bold">
          المسار
          <select name="track" className={fieldClass}>
            {tracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.title}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold">
            الساعات
            <input name="hours" type="number" min={1} required className={fieldClass} />
          </label>
          <label className="block text-sm font-bold">
            السعر بالجنيه
            <input name="priceEgp" type="number" min={0} required className={fieldClass} />
          </label>
        </div>
        <label className="block text-sm font-bold">
          الحضور
          <input name="attendance" defaultValue="أونلاين" className={fieldClass} />
        </label>
        <label className="block text-sm font-bold">
          الملخص
          <textarea name="summary" rows={3} className={fieldClass} />
        </label>
        <label className="block text-sm font-bold">
          مناسب لمين
          <textarea name="audience" rows={2} className={fieldClass} />
        </label>
        <label className="block text-sm font-bold">
          المخرجات، سطر لكل نقطة
          <textarea name="outcomes" rows={4} className={fieldClass} />
        </label>
        <label className="block text-sm font-bold">
          الدروس، سطر لكل درس. أول سطر هو الدرس المجاني
          <textarea name="modules" rows={6} required className={fieldClass} />
        </label>
        <button type="submit" className={buttonClass}>
          حفظ الكورس
        </button>
      </form>
    </PageFrame>
  );
}
