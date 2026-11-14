import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { CONTACT, PAYMENT, whatsappLink } from "@/content/contact";
import { courseBySlug, courses, formatEgp, trackById } from "@/content/site";

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata(props: PageProps<"/checkout/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const course = courseBySlug(slug);
  return {
    title: course ? `الاشتراك في ${course.title}` : "الاشتراك",
    robots: { index: false, follow: false },
    alternates: { canonical: course ? `/courses/${course.slug}` : "/" },
  };
}

export default async function CheckoutPage(props: PageProps<"/checkout/[slug]">) {
  const { slug } = await props.params;
  const course = courseBySlug(slug);
  if (!course) {
    notFound();
  }
  const track = trackById(course.track);
  const price = formatEgp(course.priceEgp);
  const receiptMessage = `أهلاً، حوّلت ${price} جنيه للاشتراك في كورس ${course.title}. دي صورة الإيصال، واسمي: `;
  const askMessage = `أهلاً، عايز أشترك في كورس ${course.title} (${price} جنيه). ممكن بيانات الدفع؟`;

  const methods = [
    { name: "إنستا باي", value: PAYMENT.instapayAddress, label: "عنوان إنستا باي" },
    { name: "فودافون كاش", value: PAYMENT.vodafoneCashNumber, label: "رقم المحفظة" },
  ];

  return (
    <>
      <SiteHeader />
      <main className="tc relative isolate overflow-hidden pt-28 pb-20" style={{ "--h": track.hue } as CSSProperties}>
        <div className="hero-bg" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-5 md:px-8">
          <Link href={`/courses/${course.slug}`} className="inline-flex min-h-11 items-center text-sm text-muted hover:text-accent">
            ← رجوع لصفحة الكورس
          </Link>
          <h1 className="font-display mt-3 text-4xl leading-tight font-black sm:text-5xl">الاشتراك في {course.title}</h1>
          <p className="mt-3 text-lg text-muted">أربع خطوات بسيطة وتبدأ الكورس.</p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <ol className="space-y-4">
              <li className="rounded-3xl border border-line bg-surface p-6">
                <h2 className="font-display text-2xl font-black">
                  <span className="me-3 text-accent">1</span>حوّل المبلغ
                </h2>
                <p className="mt-2 text-base leading-7 text-muted">
                  حوّل <strong className="text-foreground">{price} ج.م</strong> بأي طريقة من دول:
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {methods.map((method) => (
                    <li key={method.name} className="rounded-2xl border border-line bg-background/40 p-4">
                      <p className="font-bold">{method.name}</p>
                      {method.value ? (
                        <p className="mt-1 text-sm text-muted">
                          {method.label}:{" "}
                          <span dir="ltr" className="font-mono text-base text-foreground select-all">
                            {method.value}
                          </span>
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-muted">هنبعتلك البيانات على واتساب.</p>
                      )}
                    </li>
                  ))}
                </ul>
                <a
                  href={whatsappLink(askMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-12 items-center rounded-full border border-line px-6 font-bold hover:border-accent hover:text-accent"
                >
                  اطلب بيانات الدفع على واتساب
                </a>
              </li>
              <li className="rounded-3xl border border-line bg-surface p-6">
                <h2 className="font-display text-2xl font-black">
                  <span className="me-3 text-accent">2</span>ابعت الإيصال
                </h2>
                <p className="mt-2 text-base leading-7 text-muted">
                  صوّر شاشة التحويل وابعتها على واتساب مع اسمك.
                </p>
                <a
                  href={whatsappLink(receiptMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-14 items-center rounded-full bg-[#25d366] px-8 text-lg font-bold text-white"
                >
                  ابعت الإيصال على واتساب
                </a>
              </li>
              <li className="rounded-3xl border border-line bg-surface p-6">
                <h2 className="font-display text-2xl font-black">
                  <span className="me-3 text-accent">3</span>هنراجع ونفعّل
                </h2>
                <p className="mt-2 text-base leading-7 text-muted">
                  بنراجع التحويل ونرد عليك في أقرب وقت، وبعدها بيتفتح لك الكورس.
                </p>
              </li>
              <li className="rounded-3xl border border-line bg-surface p-6">
                <h2 className="font-display text-2xl font-black">
                  <span className="me-3 text-accent">4</span>ابدأ التعلم
                </h2>
                <p className="mt-2 text-base leading-7 text-muted">
                  لو احتجت أي مساعدة كلمنا على {CONTACT.phoneDisplay}.
                </p>
              </li>
            </ol>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-[var(--tc-line)] bg-surface p-6">
                <span className="rounded-full bg-[var(--tc-soft)] px-3 py-1 text-sm font-bold text-[var(--tc)]">
                  {track.title}
                </span>
                <h2 className="font-display mt-4 text-2xl leading-snug font-black">{course.title}</h2>
                <dl className="mt-5 space-y-3 text-base">
                  <div className="flex justify-between border-b border-line pb-3">
                    <dt className="text-muted">المدة</dt>
                    <dd className="font-bold">{course.hours} ساعة</dd>
                  </div>
                  <div className="flex justify-between border-b border-line pb-3">
                    <dt className="text-muted">طريقة التعلم</dt>
                    <dd className="font-bold">{course.attendance}</dd>
                  </div>
                  <div className="flex items-end justify-between pt-1">
                    <dt className="text-muted">الإجمالي</dt>
                    <dd className="font-display text-3xl font-black">
                      {price} <span className="text-base text-muted">ج.م</span>
                    </dd>
                  </div>
                </dl>
                <p className="mt-5 text-sm leading-6 text-muted">
                  السعر مبدئي. وفيه استرجاع خلال 7 أيام بشروط، اقرا{" "}
                  <Link href="/refund" className="text-accent underline">
                    سياسة الاسترجاع
                  </Link>
                  .
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
