import Image from "next/image";
import { HeroStage } from "@/components/site/hero-stage";
import { Magnetic } from "@/components/ui/magnetic";

const pills = ["أول درس مجاني", "لو مش عاجبك مفيش التزام", "أونلاين أو حضوري", "شهادة إتمام"];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-24 pb-14 sm:pt-28 lg:pb-20">
      <div className="hero-bg" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <div>
          <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/80 py-2 ps-4 pe-5 text-sm font-medium backdrop-blur">
            <span className="dot-live size-2.5 rounded-full bg-accent" aria-hidden />
            أول درس في كل كورس ببلاش
          </p>
          <h1 className="font-display leading-[1.2] font-black">
            <span className="mb-5 block text-base leading-snug font-bold text-accent sm:text-xl">
              كورسات برمجة وتصميم وتسويق وذكاء اصطناعي وIT
            </span>
            <span className="hero-rise block text-[3.1rem] sm:text-7xl lg:text-[5.4rem]">اتعلّم مهارة</span>
            <span
              className="hero-rise relative block text-[3.1rem] sm:text-7xl lg:text-[5.4rem]"
              style={{ animationDelay: "0.12s" }}
            >
              <span className="text-shine pb-3">تشتغل بيها.</span>
              <svg
                className="underline-draw absolute -bottom-4 start-0 h-4 w-52 sm:w-72"
                viewBox="0 0 280 16"
                fill="none"
                aria-hidden
              >
                <path d="M3 11C50 3 90 3 140 8S230 13 277 4" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted sm:text-xl">
            تتعلم على إيد ريمون، مطوّر ومصمم شغّال في السوق من <span dir="ltr">7+</span> سنين. أول درس مجاني من غير التزام، وبعد الدفع الكورس يتفتح جوه الموقع.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {pills.map((pill) => (
              <li key={pill} className="rounded-full border border-line bg-surface/70 px-4 py-2 text-sm font-medium">
                {pill}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic
              href="#tracks"
              className="inline-flex min-h-14 items-center gap-3 rounded-full bg-accent px-8 text-lg font-bold text-accent-ink shadow-[0_12px_40px_-8px_oklch(0.88_0.23_140/0.55)]"
            >
              اختار مسارك
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="rotate-180">
                <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Magnetic>
            <a
              href="#courses"
              className="inline-flex min-h-14 items-center rounded-full border border-line px-7 text-lg font-bold transition-colors hover:border-accent hover:text-accent"
            >
              شوف الكورسات
            </a>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <Image
              src="/img/remon.webp"
              alt="ريمون رومانى، مدرّب أكاديمية ريمون"
              width={52}
              height={52}
              className="size-13 rounded-full border-2 border-accent object-cover"
              priority
            />
            <p className="text-sm leading-6 text-muted">
              <strong className="block text-base text-foreground">ريمون رومانى</strong>
              مطوّر ومصمم ويب · <span dir="ltr">30+</span> مشروع لماركات وشركات
            </p>
          </div>
        </div>
        <HeroStage />
      </div>
    </section>
  );
}

