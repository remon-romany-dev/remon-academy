import { cacheLife, cacheTag } from "next/cache";
import type { Course, Lesson, PrismaClient } from "@prisma/client";
import { courses as fileCourses, tracks, type Course as PublicCourse, type TrackId } from "@/content/site";
import { getPrisma } from "@/lib/prisma";

type CourseRow = Course & { lessons: Lesson[] };

function isTrack(value: string): value is TrackId {
  return tracks.some((track) => track.id === value);
}

function asStrings(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

export function bunnyEmbedUrl(videoId: string | null | undefined): string | undefined {
  if (!videoId) {
    return undefined;
  }
  if (videoId.startsWith("https://")) {
    return videoId;
  }
  const library = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
  if (!library) {
    return undefined;
  }
  return `https://iframe.mediadelivery.net/embed/${library}/${videoId}`;
}

export function toPublicCourse(row: CourseRow): PublicCourse | null {
  if (!isTrack(row.track)) {
    return null;
  }
  const lessons = [...row.lessons].sort((a, b) => a.position - b.position);
  const freeLesson = lessons.find((lesson) => lesson.isFree) ?? lessons[0];
  return {
    slug: row.slug,
    title: row.title,
    track: row.track,
    hours: row.hours,
    priceEgp: row.priceEgp,
    attendance: row.attendance,
    summary: row.summary,
    audience: row.audience,
    outcomes: asStrings(row.outcomes),
    modules: lessons.map((lesson) => lesson.title),
    freeLessonEmbedUrl: bunnyEmbedUrl(freeLesson?.bunnyVideoId),
  };
}

async function readDatabase(prisma: PrismaClient): Promise<PublicCourse[] | null> {
  const rows = await prisma.course.findMany({
    where: { published: true },
    include: { lessons: { orderBy: { position: "asc" } } },
    orderBy: { sort: "asc" },
  });
  if (rows.length === 0) {
    return null;
  }
  return rows.flatMap((row) => {
    const course = toPublicCourse(row);
    return course ? [course] : [];
  });
}

export async function getCatalog(): Promise<PublicCourse[]> {
  "use cache";
  cacheTag("courses");
  cacheLife("minutes");
  const prisma = getPrisma();
  if (!prisma) {
    return fileCourses;
  }
  try {
    return (await readDatabase(prisma)) ?? fileCourses;
  } catch {
    return fileCourses;
  }
}

export async function getCourse(slug: string): Promise<PublicCourse | undefined> {
  const catalog = await getCatalog();
  return catalog.find((course) => course.slug === slug);
}

export async function getCourseRecord(slug: string) {
  const prisma = getPrisma();
  if (!prisma) {
    return null;
  }
  try {
    return await prisma.course.findUnique({
      where: { slug },
      include: { lessons: { orderBy: { position: "asc" } } },
    });
  } catch {
    return null;
  }
}
