import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { courses } from "../src/content/site";

const prisma = new PrismaClient();

async function main() {
  for (const [index, course] of courses.entries()) {
    const existing = await prisma.course.findUnique({
      where: { slug: course.slug },
      include: { lessons: true },
    });
    if (existing) {
      await prisma.course.update({
        where: { slug: course.slug },
        data: {
          title: course.title,
          track: course.track,
          hours: course.hours,
          priceEgp: course.priceEgp,
          listPriceEgp: course.listPriceEgp ?? null,
          attendance: course.attendance,
          summary: course.summary,
          audience: course.audience,
          outcomes: course.outcomes,
          sort: index,
        },
      });
      const hasVideo = existing.lessons.some((lesson) => lesson.bunnyVideoId);
      const sameLessons =
        existing.lessons.length === course.modules.length &&
        [...existing.lessons]
          .sort((a, b) => a.position - b.position)
          .every((lesson, lessonIndex) => lesson.title === course.modules[lessonIndex]);
      if (!hasVideo && !sameLessons) {
        await prisma.lesson.deleteMany({ where: { courseId: existing.id } });
        await prisma.lesson.createMany({
          data: course.modules.map((title, position) => ({
            courseId: existing.id,
            position: position + 1,
            title,
            isFree: position === 0,
          })),
        });
      }
      continue;
    }
    await prisma.course.create({
      data: {
        slug: course.slug,
        title: course.title,
        track: course.track,
        hours: course.hours,
        priceEgp: course.priceEgp,
        listPriceEgp: course.listPriceEgp ?? null,
        attendance: course.attendance,
        summary: course.summary,
        audience: course.audience,
        outcomes: course.outcomes,
        sort: index,
        lessons: {
          create: course.modules.map((title, position) => ({
            position: position + 1,
            title,
            isFree: position === 0,
          })),
        },
      },
    });
  }

  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const found = await prisma.user.findUnique({ where: { email } });
    if (!found) {
      await prisma.user.create({
        data: {
          email,
          name: "ريمون رومانى",
          passwordHash: await bcrypt.hash(password, 12),
          role: "admin",
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
