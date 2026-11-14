import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";

export const metadata: Metadata = {
  title: "الصفحة مش موجودة",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="relative isolate flex min-h-[80vh] items-center overflow-hidden pt-24 pb-16">
        <div className="hero-bg" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <p className="font-display text-[8rem] leading-none font-black text-shine sm:text-[11rem]" dir="ltr">
            404
          </p>
          <h1 className="font-display mt-4 text-4xl font-black sm:text-5xl">الصفحة دي مش موجودة</h1>
          <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-muted">
            ممكن الرابط اتغيّر أو اتكتب غلط. ارجع للرئيسية أو شوف الكورسات المتاحة.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex min-h-14 items-center rounded-full bg-accent px-8 text-lg font-bold text-accent-ink"
            >
              الرئيسية
            </Link>
            <Link
              href="/#courses"
              className="inline-flex min-h-14 items-center rounded-full border border-line px-8 text-lg font-bold hover:border-accent hover:text-accent"
            >
              شوف الكورسات
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
