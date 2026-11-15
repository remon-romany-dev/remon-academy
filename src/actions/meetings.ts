"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/guards";
import { meetLink, parseCairoDateTime } from "@/lib/meetings";
import { getPrisma } from "@/lib/prisma";

function refresh(slug: string) {
  revalidatePath(`/admin/courses/${slug}`);
  revalidatePath(`/learn/${slug}`);
  revalidatePath("/account");
}

export async function createMeeting(formData: FormData): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/admin?db=off");
  }
  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const kind = String(formData.get("kind") ?? "");
  const startsAt = parseCairoDateTime(String(formData.get("startsAt") ?? ""));
  const link = meetLink(String(formData.get("meetUrl") ?? ""));
  const place = String(formData.get("place") ?? "").trim().slice(0, 180);
  const course = await prisma.course.findUnique({ where: { slug } });
  const online = kind === "online";
  const hall = kind === "hall";
  if (!course || title.length < 2 || title.length > 180 || !startsAt || (!online && !hall) || (online && !link) || (hall && !place)) {
    redirect(`/admin/courses/${slug}?error=meeting`);
  }
  await prisma.classMeeting.create({
    data: {
      courseId: course.id,
      title,
      startsAt,
      kind: online ? "online" : "hall",
      meetUrl: online ? link : null,
      place: hall ? place : null,
    },
  });
  refresh(slug);
  redirect(`/admin/courses/${slug}`);
}

export async function deleteMeeting(formData: FormData): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/admin?db=off");
  }
  const slug = String(formData.get("slug") ?? "");
  const meetingId = String(formData.get("meetingId") ?? "");
  const meeting = await prisma.classMeeting.findUnique({ where: { id: meetingId }, include: { course: true } });
  if (!meeting || meeting.course.slug !== slug) {
    redirect("/admin");
  }
  await prisma.classMeeting.delete({ where: { id: meeting.id } });
  refresh(slug);
  redirect(`/admin/courses/${slug}`);
}

export async function saveAttendance(formData: FormData): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/admin?db=off");
  }
  const slug = String(formData.get("slug") ?? "");
  const meetingId = String(formData.get("meetingId") ?? "");
  const meeting = await prisma.classMeeting.findUnique({ where: { id: meetingId }, include: { course: true } });
  if (!meeting || meeting.course.slug !== slug) {
    redirect("/admin");
  }
  const requested = [...new Set(formData.getAll("studentId").map(String))];
  const present = new Set(formData.getAll("present").map(String));
  const enrolled = await prisma.enrollment.findMany({
    where: { courseId: meeting.courseId, status: "paid", userId: { in: requested } },
    select: { userId: true },
  });
  if (enrolled.length > 0) {
    await prisma.$transaction(
      enrolled.map((student) =>
        prisma.attendance.upsert({
          where: { meetingId_userId: { meetingId: meeting.id, userId: student.userId } },
          create: { meetingId: meeting.id, userId: student.userId, present: present.has(student.userId) },
          update: { present: present.has(student.userId) },
        }),
      ),
    );
  }
  refresh(slug);
  redirect(`/admin/courses/${slug}`);
}
