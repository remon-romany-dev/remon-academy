import { Reveal } from "@/components/ui/reveal";
import { testimonials, testimonialsAreSamples } from "@/content/testimonials";

/**
 * آراء الطلاب. لو القائمة نماذج، القسم بيقول كده صراحة ومش بيتعرض كإن فيه طلاب خلّصوا.
 */
export function Testimonials() {
  if (testimonials.length === 0) {
    return null;
  }
  return (
    <section id="reviews" className="defer mx-auto max-w-7xl px-5 py-20 md:px-8 lg:py-28">
      <Reveal className="mb-12 max-w-2xl">
        <p className="mb-3 text-base font-bold text-accent">
          {testimonialsAreSamples ? "نماذج مؤقتة" : "آراء الطلاب"}
        </p>
        <h2 className="font-display text-4xl leading-tight font-black sm:text-5xl">
          {testimonialsAreSamples ? "كده شكل قسم الآراء" : "اللي اتعلموا قبلك بيقولوا إيه"}
        </h2>
      </Reveal>
      <ul className="grid gap-4 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <Reveal as="li" key={`${item.name}-${index}`} delay={index * 60}>
            <figure className="h-full rounded-3xl border border-line bg-surface p-7">
              <blockquote className="text-lg leading-8">{item.quote}</blockquote>
              <figcaption className="mt-5 text-sm text-muted">
                <strong className="block text-base text-foreground">{item.name}</strong>
                {item.course}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
