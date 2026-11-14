import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  children?: ReactNode;
};

export function LegalPage({ eyebrow, title, intro, updated, sections, children }: LegalPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="relative isolate overflow-hidden pt-28 pb-20 lg:pb-28">
        <div className="hero-bg" aria-hidden />
        <article className="relative mx-auto max-w-3xl px-5 md:px-8">
          <p className="mb-3 text-base font-bold text-accent">{eyebrow}</p>
          <h1 className="font-display text-5xl leading-[1.2] font-black sm:text-6xl">{title}</h1>
          <p className="mt-6 text-lg leading-8 text-muted">{intro}</p>
          <p className="mt-3 text-sm text-muted">آخر تحديث: {updated}</p>
          <div className="mt-12 space-y-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl font-black sm:text-3xl">{section.heading}</h2>
                {section.paragraphs?.map((text) => (
                  <p key={text} className="mt-3 text-base leading-8 text-muted">
                    {text}
                  </p>
                ))}
                {section.list ? (
                  <ul className="mt-3 list-disc space-y-2 ps-6 text-base leading-8 text-muted marker:text-accent">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
          {children}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
