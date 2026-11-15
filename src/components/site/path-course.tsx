import Link from "next/link";
import { formatEgp, type Course } from "@/content/site";
import { groupSentence } from "@/lib/meetings";

export function PathCourse({
  course,
  note,
  index,
  label,
}: {
  course: Course;
  note: string;
  index?: number;
  label?: string;
}) {
  const nextGroup = groupSentence(course);
  const step = label ?? (index === undefined ? undefined : `الخطوة ${index}`);
  return (
    <article className="rounded-3xl border border-line bg-surface p-6">
      {step ? <p className="text-sm font-bold text-accent">{step}</p> : null}
      <h3 className="font-display mt-2 text-2xl font-black">
        <Link href={`/courses/${course.slug}`} className="hover:text-accent">
          {course.title}
        </Link>
      </h3>
      <p className="mt-2 text-base leading-7 text-muted">{note}</p>
      <p className="mt-3 text-sm text-muted">
        {course.hours} ساعة · {course.attendance} · {formatEgp(course.priceEgp)} ج.م
      </p>
      {nextGroup ? <p className="mt-3 text-sm leading-7 font-bold">{nextGroup}</p> : null}
    </article>
  );
}
