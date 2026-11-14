import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/reveal";

export function FinalCta() {
  return (
    <section className="defer px-5 pb-20 md:px-8 lg:pb-28">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-accent px-6 py-16 text-center text-accent-ink sm:px-12 sm:py-24">
        <div aria-hidden className="v-spin absolute -top-32 -end-32 size-96 rounded-full border-[40px] border-black/10" />
        <div aria-hidden className="float-slow absolute -bottom-24 -start-16 size-72 rounded-full bg-black/10" />
        <div className="relative">
          <h2 className="font-display mx-auto max-w-3xl text-4xl leading-[1.25] font-black sm:text-6xl">
            جرّب أول درس ببلاش، وقرّر بعدها.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 font-medium sm:text-xl">
            مفيش التزام ومفيش كارت. شوف أسلوب الشرح بنفسك وبعدها اختار الكورس اللي يناسبك.
          </p>
          <div className="mt-10 flex justify-center">
            <Magnetic
              href="#courses"
              className="inline-flex min-h-14 items-center rounded-full bg-accent-ink px-9 text-lg font-bold text-accent"
            >
              شوف الكورسات
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
