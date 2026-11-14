import Image from "next/image";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/reveal";
import { proofs } from "@/content/site";

const points = [
  "كل كورس مبني على اللي بنفّذه فعلًا مع العملاء، مش على كتاب.",
  "مشروع حقيقي في آخر كل كورس يتحط في البورتفوليو بتاعك.",
  "بتسأل وتاخد رد من مدرّبك مباشرة، مش من بوت.",
];

export function Instructor() {
  const loop = [...proofs, ...proofs];
  return (
    <section id="instructor" className="defer overflow-hidden border-t border-line bg-surface/40 py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="relative overflow-hidden rounded-[2.2rem] p-[3px]">
            <div
              aria-hidden
              className="v-spin absolute -inset-[60%] bg-[conic-gradient(from_0deg,var(--accent),transparent_30%,oklch(0.7_0.2_190),transparent_70%,var(--accent))]"
            />
            <Image
              src="/img/remon.webp"
              alt="ريمون رومانى، مطوّر ومصمم ويب ومدرّب أكاديمية ريمون"
              width={720}
              height={720}
              sizes="(min-width: 1024px) 420px, 90vw"
              className="relative aspect-square w-full rounded-[2.1rem] object-cover"
            />
          </div>
          <div className="float-slow absolute -bottom-5 end-4 rounded-2xl border border-line bg-surface-2 px-5 py-3 shadow-2xl">
            <span className="font-display block text-3xl leading-none font-black text-accent" dir="ltr">
              7+
            </span>
            <span className="text-sm text-muted">سنين خبرة</span>
          </div>
          <div className="float-slower absolute -top-4 start-4 rounded-2xl border border-line bg-surface-2 px-5 py-3 shadow-2xl">
            <span className="font-display block text-3xl leading-none font-black text-accent" dir="ltr">
              30+
            </span>
            <span className="text-sm text-muted">مشروع</span>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="mb-3 text-base font-bold text-accent">المدرّب</p>
          <h2 className="font-display text-4xl leading-tight font-black sm:text-5xl">
            هتتعلم من حد بيشتغل بالمهنة كل يوم
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted">
            أنا ريمون رومانى، مطوّر ومصمم ويب، ومؤسس الأكاديمية. شغلي مع الماركات والمتاجر مش كود بس: واجهة، موقع، وظهور للبراند. مسارات البرمجة والتصميم والتسويق والذكاء الاصطناعي التطبيقي ماشية على نفس الأسلوب.
          </p>
          <ul className="mt-7 space-y-4">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-base leading-7">
                <span
                  className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink"
                  aria-hidden
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
          <a
            href="https://remonromany.com"
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-6 font-bold transition-colors hover:border-accent hover:text-accent"
          >
            شوف شغلي على remonromany.com
          </a>
        </Reveal>
      </div>

      <div className="mt-20">
        <p className="mb-6 px-5 text-center text-base text-muted">من الشغل اللي بتتعلم منه</p>
        <div className="relative overflow-hidden" dir="rtl">
          <div className="marquee gap-4 ps-4" style={{ "--dur": "55s" } as CSSProperties}>
            {loop.map((proof, index) => (
              <figure
                key={`${proof.file}-${index}`}
                aria-hidden={index >= proofs.length}
                className="relative w-72 shrink-0 overflow-hidden rounded-2xl border border-line sm:w-80"
              >
                <Image
                  src={`/work/${proof.file}.webp`}
                  alt={index < proofs.length ? `مشروع ${proof.name} من أعمال ريمون رومانى` : ""}
                  width={960}
                  height={472}
                  sizes="320px"
                  className="aspect-[960/472] w-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-8 pb-3 text-sm font-bold">
                  {proof.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
