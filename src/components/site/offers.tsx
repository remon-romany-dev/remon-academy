import Link from "next/link";
import { whatsappLink } from "@/content/contact";
import { courseBySlug, formatEgp } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";

const paths = [
  {
    title: "مبتدئ",
    line: "لسه بتختار المجال",
    slugs: ["programming-fundamentals", "ui-ux", "digital-marketing"],
  },
  {
    title: "عايز شغل",
    line: "عايز مشروع يتحط في الـ CV",
    slugs: ["fullstack-react-node", "graphic-design", "data-bi"],
  },
  {
    title: "صاحب مشروع",
    line: "عايز موقع وحملة وأدوات تشتغل",
    slugs: ["wordpress", "social-media-marketing", "applied-ai"],
  },
] as const;

const bundles = [
  {
    title: "تصميم + سوشيال",
    slugs: ["graphic-design", "social-media-marketing"] as const,
    save: 2000,
  },
  {
    title: "Full Stack + ذكاء اصطناعي للمطورين",
    slugs: ["fullstack-react-node", "ai-for-developers"] as const,
    save: 1500,
  },
] as const;

export function StartPaths() {
  return (
    <section id="start" className="defer mx-auto max-w-7xl px-5 py-16 md:px-8">
      <Reveal className="mb-8 max-w-2xl">
        <p className="mb-3 text-base font-bold text-accent">ابدأ من هنا</p>
        <h2 className="font-display text-4xl leading-tight font-black sm:text-5xl">اختار وضعك، مش كل الكورسات</h2>
      </Reveal>
      <div className="grid gap-4 lg:grid-cols-3">
        {paths.map((path) => (
          <article key={path.title} className="rounded-3xl border border-line bg-surface p-6">
            <h3 className="font-display text-3xl font-black">{path.title}</h3>
            <p className="mt-2 text-muted">{path.line}</p>
            <ul className="mt-5 space-y-2">
              {path.slugs.map((slug) => {
                const course = courseBySlug(slug);
                if (!course) {
                  return null;
                }
                return (
                  <li key={slug}>
                    <Link href={`/courses/${slug}`} className="font-bold hover:text-accent">
                      {course.title}
                    </Link>
                    <span className="mt-0.5 block text-sm text-muted">{formatEgp(course.priceEgp)} ج.م</span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Bundles() {
  return (
    <section id="bundles" className="defer border-t border-line bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <Reveal className="mb-8 max-w-2xl">
          <p className="mb-3 text-base font-bold text-accent">باقات</p>
          <h2 className="font-display text-4xl leading-tight font-black sm:text-5xl">اتنين مع بعض، بخصم واضح</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {bundles.map((bundle) => {
            const items = bundle.slugs.map((slug) => courseBySlug(slug)).filter((course) => course !== undefined);
            const sum = items.reduce((total, course) => total + course.priceEgp, 0);
            const price = sum - bundle.save;
            const message = `أهلاً، عايز باقة ${bundle.title} بـ ${formatEgp(price)} جنيه`;
            return (
              <article key={bundle.title} className="rounded-3xl border border-line bg-background p-7">
                <h3 className="font-display text-3xl font-black">{bundle.title}</h3>
                <ul className="mt-4 space-y-1 text-muted">
                  {items.map((course) => (
                    <li key={course.slug}>{course.title}</li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-muted">
                  <span className="line-through">{formatEgp(sum)}</span>
                  <span className="ms-2 font-display text-3xl font-black text-foreground">{formatEgp(price)} ج.م</span>
                </p>
                <p className="mt-1 text-sm font-bold text-accent">توفر {formatEgp(bundle.save)} ج.م</p>
                <a
                  href={whatsappLink(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-bold text-accent-ink"
                >
                  احجز الباقة على واتساب
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
