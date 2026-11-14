import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";

export function Stats() {
  return (
    <section aria-label="أرقام عن أكاديمية ريمون" className="border-y border-line bg-surface/50">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-5 py-10 md:px-8 lg:grid-cols-4">
        <Reveal className="flex flex-col-reverse px-2 text-center lg:border-e lg:border-line">
          <dt className="mt-1 text-base text-muted">سنين خبرة في السوق</dt>
          <dd className="font-display text-5xl font-black text-accent sm:text-6xl">
            <CountUp to={7} suffix="+" />
          </dd>
        </Reveal>
        <Reveal delay={90} className="flex flex-col-reverse px-2 text-center lg:border-e lg:border-line">
          <dt className="mt-1 text-base text-muted">مشروع اتسلّم لعملاء</dt>
          <dd className="font-display text-5xl font-black text-accent sm:text-6xl">
            <CountUp to={30} suffix="+" />
          </dd>
        </Reveal>
        <Reveal delay={180} className="flex flex-col-reverse px-2 text-center lg:border-e lg:border-line">
          <dt className="mt-1 text-base text-muted">مسارات تعلّم</dt>
          <dd className="font-display text-5xl font-black text-accent sm:text-6xl">
            <CountUp to={6} />
          </dd>
        </Reveal>
        <Reveal delay={270} className="flex flex-col-reverse px-2 text-center">
          <dt className="mt-1 text-base text-muted">تكلفة أول درس بالجنيه</dt>
          <dd className="font-display text-5xl font-black text-accent sm:text-6xl">
            <CountUp to={0} />
          </dd>
        </Reveal>
      </dl>
    </section>
  );
}
