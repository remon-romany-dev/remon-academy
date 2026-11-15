"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SITE_NAME } from "@/content/site";
import { requireAdmin } from "@/lib/guards";
import { sendMail } from "@/lib/mail";
import { formatCairo, meetLink, parseCairoDateTime } from "@/lib/meetings";
import { getPrisma } from "@/lib/prisma";

function refresh(slug: string) {
  revalidatePath(`/admin/courses/${slug}`);
  revalidatePath("/admin");
  revalidatePath(`/learn/${slug}`);
  revalidatePath("/account");
}

function meetingFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const kind = String(formData.get("kind") ?? "");
  const startsAt = parseCairoDateTime(String(formData.get("startsAt") ?? ""));
  const link = meetLink(String(formData.get("meetUrl") ?? ""));
  const place = String(formData.get("place") ?? "").trim().slice(0, 180);
  const online = kind === "online";
  const hall = kind === "hall";
  if (title.length < 2 || title.length > 180 || !startsAt || (!online && !hall) || (online && !link) || (hall && !place)) {
    return null;
  }
  return {
    title,
    startsAt,
    kind: online ? ("online" as const) : ("hall" as const),
    meetUrl: online ? link : null,
    place: hall ? place : null,
  };
}

async function notifyStudents(courseId: string, courseTitle: string, meeting: { title: string; startsAt: Date; kind: "online" | "hall"; meetUrl: string | null; place: string | null }, updated: boolean) {
  const prisma = getPrisma();
  if (!prisma) {
    return;
  }
  const students = await prisma.enrollment.findMany({
    where: { courseId, status: "paid", mode: meeting.kind },
    include: { user: true },
  });
  const where = meeting.kind === "online" ? meeting.meetUrl ?? "" : meeting.place ?? "";
  const origin = process.env["AUTH_URL"] ?? "https://courses.remonromany.com";
  await Promise.all(
    students.map((student) =>
      sendMail({
        to: student.user.email,
        subject: `${updated ? "تعديل حصة" : "حصة جديدة"} — ${courseTitle}`,
        text: `أهلاً ${student.user.name}\n${meeting.title}\n${formatCairo(meeting.startsAt)}\n${where}\nالتفاصيل في حسابك:\n${origin}/account\n${SITE_NAME}`,
      }),
    ),
  );
}

export async function createMeeting(formData: FormData): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/admin?db=off");
  }
  const slug = String(formData.get("slug") ?? "");
  const fields = meetingFields(formData);
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course || !fields) {
    redirect(`/admin/courses/${slug}?error=meeting`);
  }
  await prisma.classMeeting.create({ data: { courseId: course.id, ...fields } });
  await notifyStudents(course.id, course.title, fields, false);
  refresh(slug);
  redirect(`/admin/courses/${slug}`);
}

export async function updateMeeting(formData: FormData): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/admin?db=off");
  }
  const slug = String(formData.get("slug") ?? "");
  const meetingId = String(formData.get("meetingId") ?? "");
  const fields = meetingFields(formData);
  const meeting = await prisma.classMeeting.findUnique({ where: { id: meetingId }, include: { course: true } });
  if (!meeting || meeting.course.slug !== slug || !fields) {
    redirect(`/admin/courses/${slug}?error=meeting`);
  }
  await prisma.classMeeting.update({ where: { id: meeting.id }, data: fields });
  await notifyStudents(meeting.courseId, meeting.course.title, fields, true);
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
