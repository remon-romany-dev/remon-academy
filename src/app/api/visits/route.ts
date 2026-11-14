import { NextResponse } from "next/server";
import { cairoDay } from "@/lib/day";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: true });
  }
  const body = (await request.json().catch(() => null)) as { path?: unknown } | null;
  const path = typeof body?.path === "string" ? body.path.slice(0, 180) : "";
  if (!path.startsWith("/") || path.startsWith("//")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const day = cairoDay();
  await prisma.dailyVisit.upsert({
    where: { day_path: { day, path } },
    create: { day, path, count: 1 },
    update: { count: { increment: 1 } },
  });
  return NextResponse.json({ ok: true });
}
