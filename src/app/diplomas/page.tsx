import type { Metadata } from "next";
import Link from "next/link";
import { PageFrame } from "@/components/site/page-frame";
import { diplomas, diplomaTotals } from "@/content/paths";
import { formatEgp, type Course } from "@/content/site";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "الدبلومات",
  description: "باقات كورسات بخصم واضح: مطوّر ويب، دعم وشبكات، تصميم وسوشيال، وفول ستاك مع ذكاء اصطناعي.",
  alternates: { canonical: "/diplomas" },
};

function priced(catalog: Course[], slugs: readonly string[], save: number): { sum: number; price: number } | null {
  const prices = slugs.map((slug) => catalog.find((course) => course.slug === slug)?.priceEgp);
  if (prices.some((price) => price === undefined)) {
    return null;
  }
  return diplomaTotals(prices as number[], save);
}

export default async function DiplomasPage() {
  const catalog = await getCatalog();
  return (
    <PageFrame wide>
      <p className="text-base font-bold text-accent">الدبلومات</p>
      <h1 className="font-display mt-3 text-4xl font-black sm:text-5xl">باقة كورسات، بخصم مكتوب</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        الدبلومة تجميع كورسات موجودة. كل كورس يتفتح لوحده بعد الدفع، والباقة تتحجز من صفحتها.
      </p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {diplomas.map((diploma) => {
          const money = priced(catalog, diploma.slugs, diploma.save);
          return (
            <li key={diploma.slug}>
              <Link href={`/diplomas/${diploma.slug}`} className="block h-full rounded-3xl border border-line bg-surface p-6 hover:border-accent">
                <h2 className="font-display text-3xl font-black">{diploma.title}</h2>
                <p className="mt-2 text-muted">{diploma.line}</p>
                {money ? (
                  <p className="mt-4 text-sm text-muted">
                    <span className="line-through">{formatEgp(money.sum)}</span>
                    <span className="ms-2 font-display text-2xl font-black text-foreground">{formatEgp(money.price)} ج.م</span>
                  </p>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </PageFrame>
  );
}
