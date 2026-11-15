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

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
  "www.youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

function youtubeVideoId(value: string): string | undefined {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return undefined;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return undefined;
  }
  const host = url.hostname.toLowerCase();
  if (!YOUTUBE_HOSTS.has(host)) {
    return undefined;
  }
  const parts = url.pathname.split("/").filter(Boolean);
  const fromPath = host.endsWith("youtu.be")
    ? parts[0]
    : parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live" || parts[0] === "v"
      ? parts[1]
      : undefined;
  const id = fromPath ?? url.searchParams.get("v") ?? "";
  return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : undefined;
}

/** رابط تضمين يوتيوب، أو رابط https كما هو، أو رقم فيديو Bunny. */
export function bunnyEmbedUrl(videoId: string | null | undefined): string | undefined {
  const value = videoId?.trim();
  if (!value) {
    return undefined;
  }
  const youtubeId = youtubeVideoId(value);
  if (youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
  }
  if (value.startsWith("https://") || value.startsWith("http://")) {
    try {
      const host = new URL(value).hostname.toLowerCase();
      if (YOUTUBE_HOSTS.has(host)) {
        return undefined;
      }
    } catch {
      return undefined;
    }
    return value.startsWith("https://") ? value : undefined;
  }
  const library = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
  if (!library) {
    return undefined;
  }
  return `https://iframe.mediadelivery.net/embed/${library}/${encodeURIComponent(value)}`;
}

/** القيمة اللي تتخزن: رابط تضمين يوتيوب قصير، أو رقم Bunny كما هو لو داخل الحد. */
export function lessonVideoStoredValue(videoId: string): string | null {
  const value = videoId.trim();
  if (!value) {
    return null;
  }
  const youtubeId = youtubeVideoId(value);
  if (youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
  }
  return value.length <= 120 ? value : null;
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
    listPriceEgp: row.listPriceEgp ?? undefined,
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
