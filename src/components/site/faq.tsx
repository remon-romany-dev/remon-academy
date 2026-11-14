import { Reveal } from "@/components/ui/reveal";
import { faqs } from "@/content/site";

export function Faq() {
  return (
    <section
      id="faq"
      className="defer mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-28"
    >
      <Reveal>
        <p className="mb-3 text-base font-bold text-accent">الأسئلة الشائعة</p>
        <h2 className="font-display text-4xl leading-tight font-black sm:text-5xl">اللي بيسألوه قبل ما يبدأوا</h2>
        <p className="mt-4 text-lg leading-8 text-muted">
          لو سؤالك مش هنا، هتلاقي إجابته في صفحة الكورس نفسه.
        </p>
      </Reveal>
      <div className="space-y-3">
        {faqs.map((item, index) => (
          <Reveal key={item.q} delay={index * 60}>
            <details className="group rounded-2xl border border-line bg-surface open:border-accent/60">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-accent transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="px-6 pb-5 text-base leading-8 text-muted">{item.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
