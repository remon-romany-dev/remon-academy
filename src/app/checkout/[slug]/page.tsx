import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { connection } from "next/server";
import { claimManualPayment } from "@/actions/payments";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { buttonClass } from "@/components/account/styles";
import { auth } from "@/auth";
import { CONTACT, PAYMENT, whatsappLink } from "@/content/contact";
import { courses, formatEgp, trackById } from "@/content/site";
import { getCourse } from "@/lib/catalog";
import { courseAllowsHall } from "@/lib/meetings";

export const instant = false;

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata(props: PageProps<"/checkout/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const course = await getCourse(slug);
  return {
    title: course ? `الاشتراك في ${course.title}` : "الاشتراك",
    robots: { index: false, follow: false },
    alternates: { canonical: course ? `/courses/${course.slug}` : "/" },
  };
}

export default async function CheckoutPage(props: PageProps<"/checkout/[slug]">) {
  await connection();
  const { slug } = await props.params;
  const search = await props.searchParams;
  const course = await getCourse(slug);
  if (!course) {
    notFound();
  }
  const session = await auth();
  const track = trackById(course.track);
  const price = formatEgp(course.priceEgp);
  const receiptMessage = `أهلاً، حوّلت ${price} جنيه للاشتراك في كورس ${course.title}. دي صورة الإيصال، واسمي: `;
  const allowsHall = courseAllowsHall(course.attendance);
  const payNote = search.pay === "method" ? "اختار إنستا باي أو فودافون كاش." : null;

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
          <p className="mt-3 text-lg text-muted">حوّل على إنستا باي أو فودافون كاش، وبعد المراجعة الكورس يتفتح في حسابك.</p>
          {payNote ? <p className="mt-4 rounded-2xl border border-line bg-surface p-4 text-sm">{payNote}</p> : null}

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <ol className="space-y-4">
              <li className="rounded-3xl border border-[var(--tc-line)] bg-surface p-6">
                <h2 className="font-display text-2xl font-black">
                  <span className="me-3 text-accent">1</span>التحويل
                </h2>
                <p className="mt-2 text-base leading-7 text-muted">
                  حوّل <strong className="text-foreground">{price} ج.م</strong> على واحد من الرقمين:
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-line p-4">
                    <p className="text-sm font-bold">إنستا باي</p>
                    <p dir="ltr" className="mt-2 select-all font-mono text-2xl font-black tracking-wide">
                      {PAYMENT.instapayAddress}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-line p-4">
                    <p className="text-sm font-bold">فودافون كاش</p>
                    <p dir="ltr" className="mt-2 select-all font-mono text-2xl font-black tracking-wide">
                      {PAYMENT.vodafoneCashNumber}
                    </p>
                  </div>
                </div>
              </li>
              <li className="rounded-3xl border border-line bg-surface p-6">
                <h2 className="font-display text-2xl font-black">
                  <span className="me-3 text-accent">2</span>سجّل التحويل
                </h2>
                {session?.user ? (
                  <form action={claimManualPayment} className="mt-4 space-y-3">
                    <input type="hidden" name="slug" value={course.slug} />
                    <fieldset className="space-y-2">
                      <legend className="text-sm font-bold">طريقة الحضور</legend>
                      <label className="flex items-center gap-2 text-sm font-bold">
                        <input type="radio" name="mode" value="online" defaultChecked />
                        أونلاين: دروس مسجّلة وحصص على Google Meet
                      </label>
                      {allowsHall ? (
                        <label className="flex items-center gap-2 text-sm font-bold">
                          <input type="radio" name="mode" value="hall" />
                          حضوري: دروس مسجّلة وحضور القاعة
                        </label>
                      ) : (
                        <p className="text-sm text-muted">الكورس ده أونلاين فقط.</p>
                      )}
                    </fieldset>
                    <label className="flex items-center gap-2 text-sm font-bold">
                      <input type="radio" name="provider" value="instapay" defaultChecked />
                      حوّلت على إنستا باي
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold">
                      <input type="radio" name="provider" value="vodafone" />
                      حوّلت على فودافون كاش
                    </label>
                    <label className="block text-sm font-bold">
                      رقم العملية لو ظاهر في التحويل
                      <input name="reference" maxLength={120} dir="ltr" className="mt-2 w-full rounded-2xl border border-line bg-background px-4 py-3 text-base outline-none focus:border-accent" />
                    </label>
                    <button type="submit" className={buttonClass}>
                      سجّلت التحويل
                    </button>
                  </form>
                ) : (
                  <p className="mt-3 text-base leading-7 text-muted">
                    <Link href={`/login?next=${encodeURIComponent(`/checkout/${course.slug}`)}`} className="font-bold text-accent">
                      ادخل
                    </Link>{" "}
                    أو{" "}
                    <Link href={`/register?next=${encodeURIComponent(`/checkout/${course.slug}`)}`} className="font-bold text-accent">
                      سجّل حساب
                    </Link>{" "}
                    عشان نربط التحويل بيك.
                  </p>
                )}
                <a
                  href={whatsappLink(receiptMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-12 items-center rounded-full bg-[#25d366] px-6 font-bold text-white"
                >
                  ابعت الإيصال على واتساب
                </a>
              </li>
              <li className="rounded-3xl border border-line bg-surface p-6">
                <h2 className="font-display text-2xl font-black">
                  <span className="me-3 text-accent">3</span>ابدأ التعلم
                </h2>
                <p className="mt-2 text-base leading-7 text-muted">
                  بعد تأكيد التحويل الكورس يظهر في حسابك. للمساعدة: {CONTACT.phoneDisplay}
                </p>
              </li>
            </ol>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-[var(--tc-line)] bg-surface p-6">
                <span className="rounded-full bg-[var(--tc-soft)] px-3 py-1 text-sm font-bold text-[var(--tc)]">{track.title}</span>
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
                  السعر بالجنيه. الاسترجاع خلال 7 أيام بشروط، اقرا{" "}
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
