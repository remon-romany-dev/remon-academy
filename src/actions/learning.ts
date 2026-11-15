"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";

function projectUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }
    if (url.href.length > 500) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

export async function completeLesson(formData: FormData): Promise<void> {
  const session = await auth();
  const lessonId = String(formData.get("lessonId") ?? "");
  const prisma = getPrisma();
  if (!session?.user || !prisma) {
    redirect("/login");
  }
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { course: true } });
  if (!lesson) {
    redirect("/#courses");
  }
  if (!lesson.isFree) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: lesson.courseId } },
    });
    if (enrollment?.status !== "paid" && session.user.role !== "admin") {
      redirect(`/checkout/${lesson.course.slug}`);
    }
  }
  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
    create: { userId: session.user.id, lessonId: lesson.id },
    update: {},
  });
  revalidatePath(`/learn/${lesson.course.slug}`);
  revalidatePath("/account");
  revalidatePath(`/account/certificate/${lesson.course.slug}`);
  redirect(`/learn/${lesson.course.slug}?lesson=${lesson.position}`);
}

export async function submitProject(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?next=/account");
  }
  const slug = String(formData.get("slug") ?? "");
  const url = projectUrl(String(formData.get("url") ?? ""));
  const note = String(formData.get("note") ?? "").trim().slice(0, 500);
  const prisma = getPrisma();
  if (!prisma || !url) {
    redirect("/account?project=bad");
  }
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) {
    redirect("/account");
  }
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });
  if (enrollment?.status !== "paid" && session.user.role !== "admin") {
    redirect(`/checkout/${slug}`);
  }
  await prisma.submission.upsert({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    create: { userId: session.user.id, courseId: course.id, url, note },
    update: { url, note },
  });
  revalidatePath("/account");
  revalidatePath(`/account/certificate/${slug}`);
  revalidatePath("/admin");
  redirect("/account?project=1");
}
