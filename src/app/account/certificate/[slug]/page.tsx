import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/site/page-frame";
import { SITE_NAME } from "@/content/site";
import { requireUser } from "@/lib/guards";
import { getPrisma } from "@/lib/prisma";

export const instant = false;

export const metadata: Metadata = {
  title: "شهادة الإتمام",
  robots: { index: false, follow: false },
};

export default async function CertificatePage({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const session = await requireUser();
  const { slug } = await params;
  const prisma = getPrisma();
  if (!prisma) {
    notFound();
  }
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id, status: "paid", course: { slug } },
    include: { course: { include: { lessons: true } } },
  });
  if (!enrollment) {
    notFound();
  }
  const progress = await prisma.lessonProgress.findMany({
    where: { userId: session.user.id, lessonId: { in: enrollment.course.lessons.map((lesson) => lesson.id) } },
  });
  const submission = await prisma.submission.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: enrollment.course.id } },
  });
  if (!submission || progress.length < enrollment.course.lessons.length || enrollment.course.lessons.length === 0) {
    notFound();
  }
  const issued = new Intl.DateTimeFormat("ar-EG", { dateStyle: "long", timeZone: "Africa/Cairo" }).format(new Date());
  const student = await prisma.user.findUnique({ where: { id: session.user.id } });
  const name = student?.name ?? session.user.name;

  return (
    <PageFrame>
      <article className="rounded-3xl border border-line bg-surface p-8 text-center sm:p-12">
        <p className="text-sm font-bold text-accent">{SITE_NAME}</p>
        <h1 className="font-display mt-4 text-4xl font-black">شهادة إتمام</h1>
        <p className="mt-6 text-lg leading-8">
          نشهد أن <strong>{name}</strong> أتمّ كورس <strong>{enrollment.course.title}</strong> وسلّم المشروع النهائي.
        </p>
        <p className="mt-3 text-sm text-muted">{issued}</p>
        <p className="mt-8 text-sm text-muted">ريمون رومانى · المدرّب</p>
      </article>
      <p className="mt-6 text-center text-sm text-muted print:hidden">
        اطبع الصفحة أو احفظها PDF من المتصفح.{" "}
        <Link href="/account" className="font-bold text-accent">
          رجوع لحسابي
        </Link>
      </p>
    </PageFrame>
  );
}
