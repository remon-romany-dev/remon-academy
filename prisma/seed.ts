import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { courses } from "../src/content/site";

const prisma = new PrismaClient();

async function main() {
  for (const [index, course] of courses.entries()) {
    const existing = await prisma.course.findUnique({ where: { slug: course.slug } });
    if (existing) {
      continue;
    }
    await prisma.course.create({
      data: {
        slug: course.slug,
        title: course.title,
        track: course.track,
        hours: course.hours,
        priceEgp: course.priceEgp,
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
