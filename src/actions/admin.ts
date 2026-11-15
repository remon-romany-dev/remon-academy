"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { lessonVideoStoredValue } from "@/lib/catalog";
import { requireAdmin } from "@/lib/guards";
import { parseCairoDateTime } from "@/lib/meetings";
import { getPrisma } from "@/lib/prisma";
import { tracks, type TrackId } from "@/content/site";

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function isTrack(value: string): value is TrackId {
  return tracks.some((track) => track.id === value);
}

function refreshCourse(slug: string) {
  updateTag("courses");
  revalidatePath("/");
  revalidatePath("/courses/" + slug);
  revalidatePath("/learn/" + slug);
  revalidatePath("/checkout/" + slug);
  revalidatePath("/admin");
}

export async function createCourse(formData: FormData): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/admin?db=off");
  }
  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const track = String(formData.get("track") ?? "");
  const hours = Number(formData.get("hours"));
  const priceEgp = Number(formData.get("priceEgp"));
  const attendance = String(formData.get("attendance") ?? "أونلاين").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const audience = String(formData.get("audience") ?? "").trim();
  const outcomes = lines(formData.get("outcomes"));
  const modules = lines(formData.get("modules"));
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !title || !isTrack(track) || !Number.isFinite(hours) || hours < 1 || !Number.isFinite(priceEgp) || priceEgp < 0 || modules.length === 0) {
    redirect("/admin/courses/new?error=1");
  }
  const sort = await prisma.course.count();
  await prisma.course.create({
    data: {
      slug,
      title,
      track,
      hours,
      priceEgp,
      attendance: attendance || "أونلاين",
      summary,
      audience,
      outcomes,
      sort,
      lessons: {
        create: modules.map((moduleTitle, index) => ({
          position: index + 1,
          title: moduleTitle,
          isFree: index === 0,
        })),
      },
    },
  });
  refreshCourse(slug);
  redirect(`/admin/courses/${slug}`);
}

export async function updateCourse(formData: FormData): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/admin?db=off");
  }
  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const hours = Number(formData.get("hours"));
  const priceEgp = Number(formData.get("priceEgp"));
  const summary = String(formData.get("summary") ?? "").trim();
  const audience = String(formData.get("audience") ?? "").trim();
  const outcomes = lines(formData.get("outcomes"));
  const published = formData.get("published") === "on";
  const attendance = String(formData.get("attendance") ?? "").trim();
  const groupRaw = String(formData.get("groupStartsAt") ?? "").trim();
  const groupStartsAt = groupRaw ? parseCairoDateTime(groupRaw) : null;
  const seatsRaw = String(formData.get("seats") ?? "").trim();
  const seatsParsed = Number(seatsRaw);
  const seats = seatsRaw && Number.isInteger(seatsParsed) && seatsParsed >= 1 && seatsParsed <= 500 ? seatsParsed : null;
  if (
    !title ||
    !Number.isFinite(hours) ||
    hours < 1 ||
    !Number.isFinite(priceEgp) ||
    priceEgp < 0 ||
    !attendance ||
    (groupRaw && !groupStartsAt) ||
    (seatsRaw && seats == null)
  ) {
    redirect(`/admin/courses/${slug}?error=1`);
  }
  await prisma.course.update({
    where: { slug },
    data: { title, hours, priceEgp, summary, audience, outcomes, published, attendance, groupStartsAt, seats },
  });
  refreshCourse(slug);
  redirect(`/admin/courses/${slug}`);
}

export async function addLesson(formData: FormData): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/admin?db=off");
  }
  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const course = await prisma.course.findUnique({ where: { slug }, include: { lessons: true } });
  if (!course || !title) {
    redirect("/admin");
  }
  const position = course.lessons.reduce((max, lesson) => Math.max(max, lesson.position), 0) + 1;
  await prisma.lesson.create({
    data: { courseId: course.id, position, title, isFree: position === 1 },
  });
  refreshCourse(slug);
  redirect(`/admin/courses/${slug}`);
}

export async function updateLesson(formData: FormData): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/admin?db=off");
  }
  const slug = String(formData.get("slug") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const bunnyVideoId = lessonVideoStoredValue(String(formData.get("bunnyVideoId") ?? ""));
  const isFree = formData.get("isFree") === "on";
  if (!title) {
    redirect(`/admin/courses/${slug}?error=1`);
  }
  await prisma.lesson.update({
    where: { id: lessonId },
    data: { title, isFree, bunnyVideoId: bunnyVideoId || null },
  });
  refreshCourse(slug);
  redirect(`/admin/courses/${slug}`);
}

export async function deleteLesson(formData: FormData): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/admin?db=off");
  }
  const slug = String(formData.get("slug") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");
  const course = await prisma.course.findUnique({ where: { slug }, include: { lessons: { orderBy: { position: "asc" } } } });
  if (!course) {
    redirect("/admin");
  }
  const remaining = course.lessons.filter((lesson) => lesson.id !== lessonId);
  await prisma.$transaction(async (tx) => {
    await tx.lesson.delete({ where: { id: lessonId } });
    for (const [index, lesson] of remaining.entries()) {
      await tx.lesson.update({ where: { id: lesson.id }, data: { position: 1000 + index } });
    }
    for (const [index, lesson] of remaining.entries()) {
      await tx.lesson.update({ where: { id: lesson.id }, data: { position: index + 1 } });
    }
  });
  refreshCourse(slug);
  redirect(`/admin/courses/${slug}`);
}
