import Link from "next/link";
import type { CSSProperties } from "react";
import { TrackVisual } from "@/components/visuals/track-visual";
import { Reveal } from "@/components/ui/reveal";
import { getCatalog } from "@/lib/catalog";
import { formatEgp, trackById, tracks, type Track, type TrackId } from "@/content/site";

const hueStyle = (hue: number, extra?: CSSProperties): CSSProperties =>
  ({ "--h": hue, ...extra }) as CSSProperties;

function courseCountLabel(count: number): string {
  if (count === 1) {
    return "كورس واحد";
  }
  if (count === 2) {
    return "كورسين";
  }
  return `${count} كورسات`;
}

/** تخطيط الـ Bento: عرض كل كارت على الشاشة الكبيرة. */
const spans: Record<TrackId, string> = {
  programming: "lg:col-span-4",
  it: "lg:col-span-2",
  design: "lg:col-span-2",
  marketing: "lg:col-span-4",
  ai: "lg:col-span-2",
  "data-analysis": "lg:col-span-2",
  "data-science": "lg:col-span-2",
};

const wide: Record<TrackId, boolean> = {
  programming: true,
  it: false,
  design: false,
  marketing: true,
  ai: false,
  "data-analysis": false,
  "data-science": false,
};

/** أبرز 8 في عرض «الكل»، كورس من كل مسار. */
const previewAll = [
  "fullstack-react-node",
  "ui-ux",
  "graphic-design",
  "digital-marketing",
  "applied-ai",
  "data-bi",
  "data-science",
  "ccna",
] as const;

/** أول 8 جوه المسار الطويل. المسارات الأقصر تتعرض كاملة. */
const previewTrack: Partial<Record<TrackId, readonly string[]>> = {
  programming: [
    "programming-fundamentals",
    "frontend-react",
    "fullstack-react-node",
    "backend-nodejs",
    "flutter",
    "android-kotlin",
    "qa-automation",
    "wordpress",
  ],
  it: ["icdl", "pc-support", "network-fundamentals", "ccna", "cybersecurity-soc", "web-pentest", "embedded-systems", "iot"],
};

function TrackCard({ track, index, count }: { track: Track; index: number; count: number }) {
  const isWide = wide[track.id];
  return (
    <Reveal delay={index * 60} className={spans[track.id]}>
      <a
        href={`#f-${track.id}`}
        style={hueStyle(track.hue)}
        className={`spot tc group flex h-full flex-col gap-5 overflow-hidden rounded-[1.75rem] p-6 sm:p-7 ${
          isWide ? "lg:flex-row lg:items-center lg:gap-8" : ""
        }`}
      >
        <div className="flex flex-1 flex-col">
          <span className="font-mono text-sm font-medium text-[var(--tc)]">0{index + 1}</span>
          <h3 className="font-display mt-2 text-3xl leading-tight font-black sm:text-4xl">{track.title}</h3>
          <p className="mt-2 max-w-sm text-base leading-7 text-muted">{track.line}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {track.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-[var(--tc-line)] px-3 py-1 font-mono text-xs text-[var(--tc)]"
              >
                {tag}
              </li>
            ))}
          </ul>
          <span className="mt-6 inline-flex items-center gap-2 text-base font-bold lg:mt-auto lg:pt-6">
            {courseCountLabel(count)}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="rotate-180 text-[var(--tc)] transition-transform group-hover:-translate-x-1.5"
            >
              <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <TrackVisual
          track={track.id}
          className={`w-full transition-transform duration-500 group-hover:scale-105 ${
            isWide ? "aspect-[5/3] lg:w-[52%]" : "aspect-[5/3]"
          }`}
        />
      </a>
    </Reveal>
  );
}

const pills = [{ id: "all", title: "الكل", hue: 145 }, ...tracks.map(({ id, title, hue }) => ({ id, title, hue }))];

/**
 * الكتالوج بالكامل Server Component. الفلترة بـ CSS (:target + :has) من غير JS،
 * فالروابط تتفتح وتتفهرس والفلتر يشتغل حتى لو الجافاسكريبت وقع.
 */
function previewFlags(courses: { slug: string; track: TrackId }[]): Map<string, { restAll: boolean; restTrack: boolean }> {
  const lead = new Set<string>();
  for (const track of tracks) {
    const inTrack = courses.filter((course) => course.track === track.id);
    const preferred = (previewTrack[track.id] ?? []).filter((slug) => inTrack.some((course) => course.slug === slug));
    const rest = inTrack.map((course) => course.slug).filter((slug) => !preferred.includes(slug));
    for (const slug of [...preferred, ...rest].slice(0, 8)) {
      lead.add(slug);
    }
  }
  const featured = new Set<string>(previewAll);
  return new Map(
    courses.map((course) => [
      course.slug,
      { restAll: !featured.has(course.slug), restTrack: !lead.has(course.slug) },
    ]),
  );
}

export async function Catalog() {
  const courses = await getCatalog();
  const flags = previewFlags(courses);
  const hiddenOnOpen = courses.some((course) => flags.get(course.slug)?.restAll || flags.get(course.slug)?.restTrack);
  return (
    <>
      <section id="tracks" className="defer mx-auto max-w-7xl px-5 py-20 md:px-8 lg:py-28">
        <Reveal className="mb-12 max-w-2xl">
          <p className="mb-3 text-base font-bold text-accent">المسارات</p>
          <h2 className="font-display text-4xl leading-tight font-black sm:text-5xl">
            سبع مسارات، وكل واحد بيوصلك لشغلانة
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            اضغط على المسار اللي يشدّك وهنفرزلك الكورسات اللي تحته. وتحليل البيانات غير علم البيانات، فكل واحد ليه مسار لوحده.
          </p>
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-6">
          {tracks.map((track, index) => (
            <TrackCard key={track.id} track={track} index={index} count={courses.filter((course) => course.track === track.id).length} />
          ))}
        </div>
      </section>

      <section id="courses" className="courses defer relative border-t border-line bg-surface/40">
        {pills.map((pill) => (
          <span key={pill.id} id={`f-${pill.id}`} className="f-anchor absolute top-0" aria-hidden />
        ))}
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 lg:py-28">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="mb-3 text-base font-bold text-accent">الكورسات</p>
              <h2 className="font-display text-4xl leading-tight font-black sm:text-5xl">ابدأ بأول درس ببلاش</h2>
            </div>
            <p className="text-base text-muted">{courseCountLabel(courses.length)}</p>
          </Reveal>

          <nav
            aria-label="فلترة الكورسات حسب المسار"
            className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0"
          >
            {pills.map((pill) => (
              <a
                key={pill.id}
                href={`#f-${pill.id}`}
                data-pill={pill.id}
                style={hueStyle(pill.hue)}
                className="pill tc flex min-h-12 shrink-0 items-center rounded-full border border-line px-5 text-base font-bold text-muted transition-colors hover:border-[var(--tc-line)] hover:text-foreground"
              >
                {pill.title}
              </a>
            ))}
          </nav>

          {hiddenOnOpen ? (
            <>
              <input id="show-rest" type="checkbox" className="show-rest-input" />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {courses.map((course, index) => {
                  const track = trackById(course.track);
                  const flag = flags.get(course.slug);
                  return (
                    <article
                      key={course.slug}
                      data-track={course.track}
                      {...(flag?.restAll ? { "data-rest-all": "" } : {})}
                      {...(flag?.restTrack ? { "data-rest-track": "" } : {})}
                      style={hueStyle(track.hue, { "--d": `${(index % 4) * 70}ms` } as CSSProperties)}
                      className="course spot tc card-in relative flex flex-col overflow-hidden rounded-3xl p-6"
                    >
                  <span
                    aria-hidden
                    className="font-display pointer-events-none absolute -top-3 end-4 text-8xl leading-none font-black text-[var(--tc)] opacity-[0.12]"
                  >
                    {course.hours}
                  </span>
                  <span className="relative w-fit rounded-full bg-[var(--tc-soft)] px-3 py-1 text-sm font-bold text-[var(--tc)]">
                    {track.title}
                  </span>
                  <h3 className="font-display mt-6 text-2xl leading-snug font-black">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {course.title}
                    </Link>
                  </h3>
                  <p className="mt-3 line-clamp-3 text-base leading-7 text-muted">{course.summary}</p>
                  <p className="mt-4 mb-6 text-sm text-muted">
                    {course.hours} ساعة · {course.attendance}
                  </p>
                  <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-5">
                    <div>
                      <span className="block text-xs text-muted">السعر</span>
                      <span className="font-display text-3xl font-black">
                        {formatEgp(course.priceEgp)} <span className="text-base font-bold text-muted">ج.م</span>
                      </span>
                    </div>
                    <span
                      className="flex size-11 items-center justify-center rounded-full bg-[var(--tc)] text-accent-ink"
                      aria-hidden
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="rotate-180">
                        <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                    </article>
                  );
                })}
              </div>
              <label htmlFor="show-rest" className="show-rest mx-auto mt-8 flex min-h-12 w-fit cursor-pointer items-center rounded-full bg-accent px-6 text-base font-bold text-accent-ink">
                <span className="show-rest-more">اعرض الباقي</span>
                <span className="show-rest-less">عرض أقل</span>
              </label>
            </>
          ) : null}
          <p className="mt-8 text-sm text-muted">الأسعار بالجنيه، وعلى سعر نفس البرنامج في السوق حاليًا.</p>
        </div>
      </section>
    </>
  );
}
