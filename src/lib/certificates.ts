import { randomBytes } from "node:crypto";
import { getPrisma } from "@/lib/prisma";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export type IssuedCertificate = {
  code: string;
  issuedAt: Date;
  studentName: string;
  courseTitle: string;
  courseSlug: string;
};

export function normalizeCertificateCode(value: string): string | null {
  const code = value.trim().toUpperCase().replace(/\s+/g, "");
  if (!/^RA-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/.test(code)) {
    return null;
  }
  return code;
}

function isUniqueConflict(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

async function createCertificate(
  prisma: NonNullable<ReturnType<typeof getPrisma>>,
  userId: string,
  courseId: string,
): Promise<{ code: string; issuedAt: Date } | null> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.certificate.create({ data: { userId, courseId, code: newCode() } });
    } catch (error) {
      const saved = await prisma.certificate.findUnique({ where: { userId_courseId: { userId, courseId } } });
      if (saved) {
        return saved;
      }
      if (!isUniqueConflict(error) || attempt === 2) {
        return null;
      }
    }
  }
  return null;
}

function newCode(): string {
  const bytes = randomBytes(8);
  let body = "";
  for (const byte of bytes) {
    body += ALPHABET[byte % ALPHABET.length];
  }
  return `RA-${body}`;
}

export function formatCertificateDate(date: Date): string {
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "long", timeZone: "Africa/Cairo" }).format(date);
}

export async function issueCertificate(userId: string, slug: string): Promise<IssuedCertificate | null> {
  const prisma = getPrisma();
  if (!prisma) {
    return null;
  }
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId, status: "paid", course: { slug } },
    include: { course: { include: { lessons: true } }, user: true },
  });
  if (!enrollment || enrollment.course.lessons.length === 0) {
    return null;
  }
  const [progress, submission] = await Promise.all([
    prisma.lessonProgress.count({
      where: { userId, lessonId: { in: enrollment.course.lessons.map((lesson) => lesson.id) } },
    }),
    prisma.submission.findUnique({ where: { userId_courseId: { userId, courseId: enrollment.course.id } } }),
  ]);
  if (!submission || progress < enrollment.course.lessons.length) {
    return null;
  }
  const where = { userId_courseId: { userId, courseId: enrollment.course.id } };
  const existing = await prisma.certificate.findUnique({ where });
  const row = existing ?? (await createCertificate(prisma, userId, enrollment.course.id));
  if (!row) {
    return null;
  }
  return {
    code: row.code,
    issuedAt: row.issuedAt,
    studentName: enrollment.user.name,
    courseTitle: enrollment.course.title,
    courseSlug: enrollment.course.slug,
  };
}

export async function findCertificate(code: string): Promise<IssuedCertificate | null> {
  const normalized = normalizeCertificateCode(code);
  const prisma = getPrisma();
  if (!normalized || !prisma) {
    return null;
  }
  const row = await prisma.certificate.findUnique({
    where: { code: normalized },
    include: { user: true, course: true },
  });
  if (!row) {
    return null;
  }
  return {
    code: row.code,
    issuedAt: row.issuedAt,
    studentName: row.user.name,
    courseTitle: row.course.title,
    courseSlug: row.course.slug,
  };
}
