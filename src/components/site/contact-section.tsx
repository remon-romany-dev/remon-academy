import { Reveal } from "@/components/ui/reveal";
import { CONTACT, PAYMENT, whatsappLink } from "@/content/contact";

const arrow = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="rotate-180">
    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function ContactSection() {
  const items = [
    {
      label: "واتساب",
      value: CONTACT.phoneDisplay,
      href: whatsappLink("أهلاً، عايز أعرف أكتر عن كورسات أكاديمية ريمون"),
      external: true,
      dir: "ltr" as const,
    },
    { label: "الإيميل", value: CONTACT.email, href: `mailto:${CONTACT.email}`, external: false, dir: "ltr" as const },
    {
      label: "لينكدإن",
      value: CONTACT.linkedinLabel,
      href: CONTACT.linkedin,
      external: true,
      dir: "ltr" as const,
    },
  ];
  return (
    <section id="contact" className="defer mx-auto max-w-7xl px-5 pb-20 md:px-8 lg:pb-28">
      <div className="grid gap-10 rounded-[2rem] border border-line bg-surface p-7 sm:p-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="mb-3 text-base font-bold text-accent">تواصل</p>
          <h2 className="font-display text-4xl leading-tight font-black sm:text-5xl">عندك سؤال قبل ما تشترك؟</h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            كلمني مباشرة وهرد عليك بنفسي: تساعدك تختار الكورس المناسب، أو تعرف المواعيد والأسعار. إنستا باي على{" "}
            <span dir="ltr" className="font-bold text-foreground">
              {PAYMENT.instapayAddress}
            </span>{" "}
            وفودافون كاش على{" "}
            <span dir="ltr" className="font-bold text-foreground">
              {PAYMENT.vodafoneCashNumber}
            </span>
            .
          </p>
        </Reveal>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <Reveal as="li" key={item.label} delay={index * 60}>
              <a
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-line bg-background/40 px-6 py-3 transition-colors hover:border-accent"
              >
                <span>
                  <span className="block text-sm text-muted">{item.label}</span>
                  <span dir={item.dir} className="block text-lg font-bold">
                    {item.value}
                  </span>
                </span>
                <span className="text-accent transition-transform group-hover:-translate-x-1">{arrow}</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
