import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { completeLesson } from "@/actions/learning";
import { buttonClass } from "@/components/account/styles";
import { LessonPlayer } from "@/components/lesson/player";
import { PageFrame } from "@/components/site/page-frame";
import { whatsappLink } from "@/content/contact";
import { bunnyEmbedUrl, getCourse, getCourseRecord } from "@/lib/catalog";
import { canJoinMeeting, formatCairo } from "@/lib/meetings";
import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";

export const instant = false;

export const metadata: Metadata = {
  title: "الدرس",
  robots: { index: false, follow: false },
};

type LessonView = {
  id: string;
  position: number;
  title: string;
  isFree: boolean;
  bunnyVideoId: string | null;
};

export default async function LearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  await connection();
  const { slug } = await params;
  const search = await searchParams;
  const requested = Number(typeof search.lesson === "string" ? search.lesson : "1");
  const record = await getCourseRecord(slug);
  const session = await auth();
  const prisma = getPrisma();
  let title = "";
  let lessons: LessonView[] = [];
  let paid = false;
  let study: "online" | "hall" = "online";

  if (record) {
    if (!record.published && session?.user?.role !== "admin") {
      notFound();
    }
    title = record.title;
    lessons = record.lessons.map((lesson) => ({
      id: lesson.id,
      position: lesson.position,
      title: lesson.title,
      isFree: lesson.isFree,
      bunnyVideoId: lesson.bunnyVideoId,
    }));
    if (session?.user && prisma) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId: record.id } },
      });
      paid = enrollment?.status === "paid";
      study = enrollment?.mode ?? "online";
    }
  } else {
    const course = await getCourse(slug);
    if (!course) {
      notFound();
    }
    title = course.title;
    lessons = course.modules.map((moduleTitle, index) => ({
      id: `${course.slug}-${index + 1}`,
      position: index + 1,
      title: moduleTitle,
      isFree: index === 0,
      bunnyVideoId: null,
    }));
  }

  const current = lessons.find((lesson) => lesson.position === requested) ?? lessons[0];
  if (!current) {
    notFound();
  }
  const locked = !current.isFree && !paid && session?.user?.role !== "admin";
  const completed = session?.user && prisma && !current.id.startsWith(`${slug}-`)
    ? Boolean(await prisma.lessonProgress.findUnique({ where: { userId_lessonId: { userId: session.user.id, lessonId: current.id } } }))
    : false;
  const nextMeeting = record && prisma && session?.user && (paid || session.user.role === "admin")
    ? await prisma.classMeeting.findFirst({
        where: {
          courseId: record.id,
          kind: study,
          startsAt: { gte: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        },
        orderBy: { startsAt: "asc" },
      })
    : null;

  return (
    <PageFrame wide>
      <p className="mb-3 text-sm text-muted">
        <Link href={`/courses/${slug}`} className="hover:text-accent">
          {title}
        </Link>
      </p>
      <h1 className="font-display text-4xl font-black">{locked ? "الدرس مقفول" : current.title}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <ol className="space-y-2">
          {lessons.map((lesson) => {
            const lessonLocked = !lesson.isFree && !paid && session?.user?.role !== "admin";
            return (
              <li key={lesson.id}>
                <Link
                  href={`/learn/${slug}?lesson=${lesson.position}`}
                  className={`flex min-h-12 items-center justify-between rounded-2xl border px-4 text-sm ${
                    lesson.position === current.position ? "border-accent text-foreground" : "border-line text-muted"
                  }`}
                >
                  <span>
                    {lesson.position}. {lesson.title}
                  </span>
                  <span>{lessonLocked ? "بعد الاشتراك" : lesson.isFree ? "مجاني" : "مفتوح"}</span>
                </Link>
              </li>
            );
          })}
        </ol>
        <div>
          {locked ? (
            <div className="rounded-3xl border border-line bg-surface p-6">
              <p className="text-base leading-7 text-muted">الدرس الأول مجاني. باقي الدروس بتتفتح بعد تأكيد الاشتراك.</p>
              <Link href={`/checkout/${slug}`} className={`${buttonClass} mt-5`}>
                اشترك في الكورس
              </Link>
            </div>
          ) : (
            <>
              {nextMeeting ? (
                <div className="mb-4 rounded-3xl border border-line bg-surface p-5">
                  <p className="font-bold">{nextMeeting.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {formatCairo(nextMeeting.startsAt)}
                    {nextMeeting.place ? ` · ${nextMeeting.place}` : ""}
                  </p>
                  {nextMeeting.meetUrl && canJoinMeeting(nextMeeting.startsAt) ? (
                    <a href={nextMeeting.meetUrl} target="_blank" rel="noopener noreferrer" className={`${buttonClass} mt-4`}>
                      ادخل الحصة
                    </a>
                  ) : null}
                </div>
              ) : null}
              <LessonPlayer title={current.title} embedUrl={bunnyEmbedUrl(current.bunnyVideoId)} />
              {!current.bunnyVideoId ? (
                <a
                  href={whatsappLink(`أهلاً، عايز أشوف الدرس المجاني بتاع كورس ${title}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-12 items-center rounded-full bg-[#25d366] px-6 font-bold text-white"
                >
                  اطلب التسجيل على واتساب
                </a>
              ) : null}
              {session?.user && !current.id.startsWith(`${slug}-`) ? (
                <form action={completeLesson} className="mt-5">
                  <input type="hidden" name="lessonId" value={current.id} />
                  <button type="submit" className={buttonClass} disabled={completed}>
                    {completed ? "الدرس متسجل كمكتمل" : "خلّصت الدرس"}
                  </button>
                </form>
              ) : (
                <p className="mt-5 text-sm text-muted">
                  <Link href={`/login?next=${encodeURIComponent(`/learn/${slug}?lesson=${current.position}`)}`} className="font-bold text-accent">
                    ادخل
                  </Link>{" "}
                  عشان يتسجل تقدّمك.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </PageFrame>
  );
}
