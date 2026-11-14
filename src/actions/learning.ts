"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";

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
