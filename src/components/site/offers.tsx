import Link from "next/link";
import { diplomas, diplomaTotals, goals } from "@/content/paths";
import { courseBySlug, formatEgp } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";

export function StartPaths() {
  return (
    <section id="start" className="defer mx-auto max-w-7xl px-5 py-16 md:px-8">
      <Reveal className="mb-8 max-w-2xl">
        <p className="mb-3 text-base font-bold text-accent">طريق الشغل</p>
        <h2 className="font-display text-4xl leading-tight font-black sm:text-5xl">اختار وضعك، مش كل الكورسات</h2>
      </Reveal>
      <div className="grid gap-4 lg:grid-cols-3">
        {goals.map((goal) => (
          <article key={goal.slug} className="rounded-3xl border border-line bg-surface p-6">
            <h3 className="font-display text-3xl font-black">{goal.title}</h3>
            <p className="mt-2 text-muted">{goal.line}</p>
            <ul className="mt-5 space-y-2">
              {goal.steps.map((step) => {
                const course = courseBySlug(step.slug);
                if (!course) {
                  return null;
                }
                return (
                  <li key={step.slug}>
                    <Link href={`/courses/${step.slug}`} className="font-bold hover:text-accent">
                      {course.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link href={`/goals/${goal.slug}`} className="mt-5 inline-flex font-bold text-accent">
              شوف الطريق
            </Link>
          </article>
        ))}
      </div>
      <p className="mt-6 text-base">
        <Link href="/kids" className="font-bold text-accent">
          كورسات الأطفال
        </Link>
      </p>
    </section>
  );
}

export function Bundles() {
  return (
    <section id="bundles" className="defer border-t border-line bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <Reveal className="mb-8 max-w-2xl">
          <p className="mb-3 text-base font-bold text-accent">دبلومات</p>
          <h2 className="font-display text-4xl leading-tight font-black sm:text-5xl">باقة كورسات، بخصم واضح</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {diplomas.map((diploma) => {
            const items = diploma.slugs.map((slug) => courseBySlug(slug)).filter((course) => course !== undefined);
            const money = diplomaTotals(
              items.map((course) => course.priceEgp),
              diploma.save,
            );
            return (
              <article key={diploma.slug} className="rounded-3xl border border-line bg-background p-7">
                <h3 className="font-display text-3xl font-black">
                  <Link href={`/diplomas/${diploma.slug}`} className="hover:text-accent">
                    {diploma.title}
                  </Link>
                </h3>
                <ul className="mt-4 space-y-1 text-muted">
                  {items.map((course) => (
                    <li key={course.slug}>{course.title}</li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-muted">
                  <span className="line-through">{formatEgp(money.sum)}</span>
                  <span className="ms-2 font-display text-3xl font-black text-foreground">{formatEgp(money.price)} ج.م</span>
                </p>
                <p className="mt-1 text-sm font-bold text-accent">توفر {formatEgp(diploma.save)} ج.م</p>
                <form action="/api/book" method="post" className="mt-6">
                  <input type="hidden" name="kind" value="bundle" />
                  <input type="hidden" name="title" value={diploma.title} />
                  <input type="hidden" name="price" value={money.price} />
                  <button type="submit" className="inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-bold text-accent-ink">
                    احجز الدبلومة على واتساب
                  </button>
                </form>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
