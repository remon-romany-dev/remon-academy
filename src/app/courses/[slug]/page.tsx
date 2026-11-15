import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/reveal";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Spotlight } from "@/components/ui/spotlight";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { JsonLd } from "@/components/site/json-ld";
import { TrackVisual } from "@/components/visuals/track-visual";
import { LessonPlayer } from "@/components/lesson/player";
import { PAYMENT } from "@/content/contact";
import { coursePlaces } from "@/content/paths";
import { courses, formatEgp, SITE_NAME, SITE_URL, trackById } from "@/content/site";
import { getCatalog, getCourse } from "@/lib/catalog";
import { groupSentence } from "@/lib/meetings";

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata(props: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const course = await getCourse(slug);
  if (!course) {
    return {};
  }
  const track = trackById(course.track);
  const title = `كورس ${course.title} (${course.hours} ساعة)`;
  const description = `${course.summary} كورس ${track.title} ${course.attendance}، أول درس مجاني وشهادة إتمام.`;
  return {
    title,
    description,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      type: "website",
      url: `/courses/${course.slug}`,
      title: `${title} | ${SITE_NAME}`,
      description,
      locale: "ar_EG",
      siteName: SITE_NAME,
    },
  };
}

const arrow = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="rotate-180">
    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default async function CoursePage(props: PageProps<"/courses/[slug]">) {
  const { slug } = await props.params;
  const course = await getCourse(slug);
  if (!course) {
    notFound();
  }
  const catalog = await getCatalog();
  const track = trackById(course.track);
  const hue = { "--h": track.hue } as CSSProperties;
  const nextGroup = groupSentence(course);
  const places = coursePlaces(course.slug);
  const related = [
    ...catalog.filter((item) => item.track === course.track && item.slug !== course.slug),
    ...catalog.filter((item) => item.track !== course.track),
  ].slice(0, 3);

  const courseLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        name: course.title,
        description: course.summary,
        url: `${SITE_URL}/courses/${course.slug}`,
        inLanguage: "ar",
        timeRequired: `PT${course.hours}H`,
        educationalLevel: "Beginner",
        teaches: course.outcomes,
        offers: {
          "@type": "Offer",
          price: course.priceEgp,
          priceCurrency: "EGP",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/courses/${course.slug}`,
        },
        provider: { "@type": "EducationalOrganization", name: SITE_NAME, url: SITE_URL },
        instructor: { "@type": "Person", name: "Remon Romany", url: "https://remonromany.com" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "الكورسات", item: `${SITE_URL}/#courses` },
          { "@type": "ListItem", position: 3, name: course.title, item: `${SITE_URL}/courses/${course.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={courseLd} />
      <ScrollProgress />
      <CursorGlow />
      <Spotlight />
      <SiteHeader />
      <main className="tc" style={hue}>
        <section className="relative isolate overflow-hidden pt-28 pb-16 lg:pb-24">
          <div className="hero-bg" aria-hidden />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <nav aria-label="مسار التنقل" className="mb-8 text-sm text-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="inline-flex min-h-11 items-center hover:text-accent">
                    الرئيسية
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/#courses" className="inline-flex min-h-11 items-center hover:text-accent">
                    الكورسات
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-foreground">
                  {course.title}
                </li>
              </ol>
            </nav>
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <span className="inline-flex rounded-full bg-[var(--tc-soft)] px-4 py-1.5 text-base font-bold text-[var(--tc)]">
                  {track.title}
                </span>
                <h1 className="font-display mt-5 text-5xl leading-[1.2] font-black sm:text-6xl lg:text-7xl">
                  {course.title}
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-muted sm:text-xl">{course.summary}</p>
                <ul className="mt-6 flex flex-wrap gap-2.5">
                  <li className="rounded-full border border-line bg-surface/70 px-4 py-2 text-sm font-medium">
                    {course.hours} ساعة
                  </li>
                  <li className="rounded-full border border-line bg-surface/70 px-4 py-2 text-sm font-medium">
                    {course.attendance}
                  </li>
                  <li className="rounded-full border border-line bg-surface/70 px-4 py-2 text-sm font-medium">
                    شهادة إتمام
                  </li>
                </ul>
                {nextGroup ? (
                  <p className="mt-6 max-w-xl rounded-2xl border border-line bg-surface/80 px-5 py-4 text-base leading-7 font-bold">
                    {nextGroup}
                  </p>
                ) : null}
                {places.length > 0 ? (
                  <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold">
                    {places.map((place) => (
                      <Link key={place.href} href={place.href} className="text-accent">
                        {place.label}
                      </Link>
                    ))}
                  </p>
                ) : null}
                <div className="mt-9 flex flex-wrap items-center gap-5">
                  <Magnetic
                    href={`/learn/${course.slug}?lesson=1`}
                    className="inline-flex min-h-14 items-center gap-3 rounded-full bg-accent px-8 text-lg font-bold text-accent-ink shadow-[0_12px_40px_-8px_oklch(0.88_0.23_140/0.55)]"
                  >
                    ابدأ الدرس المجاني
                    {arrow}
                  </Magnetic>
                  <Link
                    href={`/checkout/${course.slug}`}
                    className="inline-flex min-h-14 items-center rounded-full border border-line px-7 text-lg font-bold transition-colors hover:border-accent hover:text-accent"
                  >
                    اشترك في الكورس
                  </Link>
                  <p>
                    <span className="block text-xs text-muted">السعر</span>
                    <span className="font-display text-3xl font-black">
                      {formatEgp(course.priceEgp)} <span className="text-base font-bold text-muted">ج.م</span>
                    </span>
                  </p>
                </div>
              </div>
              <TrackVisual track={course.track} className="float-slow mx-auto aspect-[5/3] w-full max-w-lg" />
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 md:px-8 lg:grid-cols-[1.3fr_0.7fr] lg:pb-28">
          <div className="space-y-16">
            <Reveal as="section" className="">
              <h2 className="font-display text-3xl font-black sm:text-4xl">هتطلع منه بإيه</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {course.outcomes.map((item) => (
                  <li key={item} className="flex gap-3 rounded-2xl border border-line bg-surface p-5 text-base leading-7">
                    <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--tc)] text-accent-ink" aria-hidden>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal as="section">
              <h2 className="font-display text-3xl font-black sm:text-4xl">محتوى الكورس</h2>
              <ol className="mt-6 space-y-3">
                {course.modules.map((item, index) => (
                  <li key={item} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 pe-6">
                    <span className="font-display flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--tc-soft)] text-xl font-black text-[var(--tc)]">
                      {index + 1}
                    </span>
                    <span className="text-lg font-bold">{item}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal as="section" className="">
              <h2 className="font-display text-3xl font-black sm:text-4xl">مناسب لمين</h2>
              <p className="mt-4 text-lg leading-8 text-muted">{course.audience}</p>
            </Reveal>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div
              id="first-lesson"
              className="scroll-mt-24 rounded-3xl border border-[var(--tc-line)] bg-surface p-7"
            >
              <p className="text-base font-bold text-[var(--tc)]">الدرس الأول مجانًا</p>
              <h2 className="font-display mt-2 text-2xl leading-snug font-black">شوف أسلوب الشرح قبل ما تدفع</h2>
              {course.freeLessonEmbedUrl ? (
                <div className="mt-5">
                  <LessonPlayer title={course.title} embedUrl={course.freeLessonEmbedUrl} />
                </div>
              ) : (
                <div className="mt-5">
                  <LessonPlayer title={course.title} />
                  <a
                    href={`/learn/${course.slug}?lesson=1`}
                    className="mt-4 flex min-h-12 items-center justify-center rounded-full bg-accent px-6 font-bold text-accent-ink"
                  >
                    افتح الدرس المجاني
                  </a>
                  <form action="/api/book" method="post" className="mt-3">
                    <input type="hidden" name="kind" value="course" />
                    <input type="hidden" name="title" value={course.title} />
                    <button type="submit" className="inline-flex min-h-12 items-center rounded-full bg-[#25d366] px-6 font-bold text-white">
                      اطلب التسجيل على واتساب
                    </button>
                  </form>
                </div>
              )}
              <Link
                href={`/checkout/${course.slug}`}
                className="mt-4 flex min-h-14 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-ink"
              >
                اشترك في الكورس
              </Link>
              <dl className="mt-6 space-y-3 text-base">
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-muted">المدة</dt>
                  <dd className="font-bold">{course.hours} ساعة</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-muted">طريقة التعلم</dt>
                  <dd className="font-bold">{course.attendance}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">السعر</dt>
                  <dd className="text-end font-bold">
                    {formatEgp(course.priceEgp)} ج.م
                    {course.listPriceEgp && course.listPriceEgp > course.priceEgp ? (
                      <span className="mt-1 block text-sm font-medium text-muted">
                        القائمة المرجعية {formatEgp(course.listPriceEgp)} — أقل بـ{" "}
                        {formatEgp(course.listPriceEgp - course.priceEgp)}
                      </span>
                    ) : null}
                    <span className="mt-1 block text-sm font-medium text-muted">
                      إنستا باي {PAYMENT.instapayAddress} · فودافون كاش {PAYMENT.vodafoneCashNumber}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>

        <section className="border-t border-line bg-surface/40 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <h2 className="font-display text-3xl font-black sm:text-4xl">كورسات تانية ممكن تعجبك</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {related.map((item) => {
                const itemTrack = trackById(item.track);
                return (
                  <article
                    key={item.slug}
                    style={{ "--h": itemTrack.hue } as CSSProperties}
                    className="spot tc relative rounded-3xl p-6"
                  >
                    <span className="rounded-full bg-[var(--tc-soft)] px-3 py-1 text-sm font-bold text-[var(--tc)]">
                      {itemTrack.title}
                    </span>
                    <h3 className="font-display mt-5 text-2xl leading-snug font-black">
                      <Link href={`/courses/${item.slug}`} className="after:absolute after:inset-0 after:content-['']">
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm text-muted">
                      {item.hours} ساعة · {formatEgp(item.priceEgp)} ج.م
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
