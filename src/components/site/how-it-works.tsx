import { Reveal } from "@/components/ui/reveal";
import { steps } from "@/content/site";

export function HowItWorks() {
  return (
    <section id="how" className="defer mx-auto max-w-7xl px-5 py-20 md:px-8 lg:py-28">
      <Reveal className="mb-14 max-w-2xl">
        <p className="mb-3 text-base font-bold text-accent">إزاي بتشتغل</p>
        <h2 className="font-display text-4xl leading-tight font-black sm:text-5xl">
          من أول درس لحد الشهادة في 4 خطوات
        </h2>
      </Reveal>
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-x-12 top-8 hidden border-t-2 border-dashed border-line lg:block"
        />
        <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 110} className="flex gap-5 lg:flex-col lg:gap-6">
              <span className="font-display flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-background text-2xl font-black text-accent">
                {index + 1}
              </span>
              <div>
                <h3 className="font-display text-2xl font-black">{step.title}</h3>
                <p className="mt-2 text-base leading-7 text-muted">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
