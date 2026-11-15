import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/site/page-frame";
import { PathCourse } from "@/components/site/path-course";
import { diplomaBySlug, diplomas, diplomaTotals } from "@/content/paths";
import { formatEgp } from "@/content/site";
import { getCatalog } from "@/lib/catalog";

type DiplomaPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams(): { slug: string }[] {
  return diplomas.map((diploma) => ({ slug: diploma.slug }));
}

export async function generateMetadata({ params }: DiplomaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const diploma = diplomaBySlug(slug);
  if (!diploma) {
    return { title: "الدبلومات" };
  }
  return {
    title: diploma.title,
    description: diploma.line,
    alternates: { canonical: `/diplomas/${diploma.slug}` },
  };
}

export default async function DiplomaPage({ params }: DiplomaPageProps) {
  const { slug } = await params;
  const diploma = diplomaBySlug(slug);
  if (!diploma) {
    notFound();
  }
  const catalog = await getCatalog();
  const courses = diploma.slugs.flatMap((courseSlug) => {
    const course = catalog.find((item) => item.slug === courseSlug);
    return course ? [course] : [];
  });
  if (courses.length !== diploma.slugs.length) {
    notFound();
  }
  const money = diplomaTotals(
    courses.map((course) => course.priceEgp),
    diploma.save,
  );

  return (
    <PageFrame wide>
      <p className="text-sm text-muted">
        <Link href="/diplomas" className="font-bold text-accent">
          الدبلومات
        </Link>
      </p>
      <h1 className="font-display mt-3 text-4xl font-black sm:text-5xl">{diploma.title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8">{diploma.line}</p>
      <p className="mt-6 text-sm text-muted">
        <span className="line-through">{formatEgp(money.sum)}</span>
        <span className="ms-2 font-display text-4xl font-black text-foreground">{formatEgp(money.price)} ج.م</span>
      </p>
      <p className="mt-1 text-sm font-bold text-accent">توفر {formatEgp(diploma.save)} ج.م</p>
      <ul className="mt-8 space-y-4">
        {courses.map((course, index) => (
          <li key={course.slug}>
            <PathCourse course={course} note={course.summary} index={index + 1} />
          </li>
        ))}
      </ul>
      <form action="/api/book" method="post" className="mt-8">
        <input type="hidden" name="kind" value="bundle" />
        <input type="hidden" name="title" value={diploma.title} />
        <input type="hidden" name="price" value={money.price} />
        <button type="submit" className="inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-bold text-accent-ink">
          احجز الدبلومة على واتساب
        </button>
      </form>
      <p className="mt-4 text-sm leading-7 text-muted">كل كورس يتفتح في الحساب بعد دفعه. حجز الدبلومة رسالة واتساب عشان الخصم يتظبط.</p>
    </PageFrame>
  );
}
