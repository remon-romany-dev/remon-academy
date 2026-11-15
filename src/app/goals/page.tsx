import type { Metadata } from "next";
import Link from "next/link";
import { PageFrame } from "@/components/site/page-frame";
import { goals } from "@/content/paths";

export const metadata: Metadata = {
  title: "طريق الشغل",
  description: "اختار طريق مبتدئ أو مطوّر أو IT. كل طريق كورسات بالترتيب، مش قائمة من غير هدف.",
  alternates: { canonical: "/goals" },
};

export default function GoalsPage() {
  return (
    <PageFrame wide>
      <p className="text-base font-bold text-accent">طريق الشغل</p>
      <h1 className="font-display mt-3 text-4xl font-black sm:text-5xl">اختار الطريق، مش كل الكورسات</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        ثلاث طرق: لسه بتختار، عايز تشتغل مطوّر، أو عايز دعم فني وشبكات. كل طريق فيه كورسات مترتبة.
      </p>
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {goals.map((goal) => (
          <li key={goal.slug}>
            <Link href={`/goals/${goal.slug}`} className="block h-full rounded-3xl border border-line bg-surface p-6 hover:border-accent">
              <h2 className="font-display text-3xl font-black">{goal.title}</h2>
              <p className="mt-2 text-muted">{goal.line}</p>
              <p className="mt-4 text-sm leading-7">{goal.outcome}</p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-base">
        <Link href="/kids" className="font-bold text-accent">
          كورسات الأطفال
        </Link>
        <span className="mx-3 text-muted">·</span>
        <Link href="/diplomas" className="font-bold text-accent">
          الدبلومات
        </Link>
      </p>
    </PageFrame>
  );
}
