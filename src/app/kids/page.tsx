import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/site/page-frame";
import { PathCourse } from "@/components/site/path-course";
import { kidsSlugs } from "@/content/paths";
import { getCatalog } from "@/lib/catalog";

const notes: Record<(typeof kidsSlugs)[number], string> = {
  "programming-kids": "منطق وألعاب بسيطة. مش دبلومة برمجة.",
  "graphics-kids": "ألوان ورسم رقمي. مش دبلومة جرافيك.",
  "ai-for-kids": "مشاريع صورة وقصة، مع قواعد إيه اللي ما يتبعتش.",
};

export const metadata: Metadata = {
  title: "كورسات الأطفال",
  description: "برمجة ورسم وذكاء اصطناعي للأطفال، مع متابعة ولي الأمر. مش مسار شغل.",
  alternates: { canonical: "/kids" },
};

export default async function KidsPage() {
  const catalog = await getCatalog();
  const courses = kidsSlugs.flatMap((slug) => {
    const course = catalog.find((item) => item.slug === slug);
    return course ? [{ course, note: notes[slug] }] : [];
  });
  if (courses.length !== kidsSlugs.length) {
    notFound();
  }

  return (
    <PageFrame wide>
      <p className="text-base font-bold text-accent">أطفال</p>
      <h1 className="font-display mt-3 text-4xl font-black sm:text-5xl">كورسات الأطفال</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        تلات كورسات قصيرة للأطفال، مع ولي الأمر في الحصة. دي مش طريق شغل ومش دبلومة كبار.
      </p>
      <ul className="mt-10 space-y-4">
        {courses.map((item) => (
          <li key={item.course.slug}>
            <PathCourse course={item.course} note={item.note} />
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
