"use server";

import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/auth";
import { CONTACT } from "@/content/contact";
import { SITE_NAME } from "@/content/site";
import { sendMail } from "@/lib/mail";
import { safeNextPath } from "@/lib/paths";
import { getPrisma } from "@/lib/prisma";
import { phoneValue } from "@/lib/meetings";
import { hashToken, newToken } from "@/lib/tokens";

export type AuthState = { error: string } | null;

function isRedirect(error: unknown): boolean {
  return typeof error === "object" && error !== null && "digest" in error && String((error as { digest: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? ""));
  try {
    await signIn("credentials", { email, password, redirectTo: next });
  } catch (error) {
    if (isRedirect(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      return { error: "الإيميل أو كلمة السر غلط." };
    }
    throw error;
  }
  return null;
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? ""));
  if (name.length < 2 || name.length > 120) {
    return { error: "اكتب اسمك." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "الإيميل مش مظبوط." };
  }
  if (password.length < 8 || password.length > 72) {
    return { error: "كلمة السر لازم تبقى 8 حروف على الأقل." };
  }
  const prisma = getPrisma();
  if (!prisma) {
    return { error: "التسجيل مش متاح دلوقتي. كلمنا على واتساب." };
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "الإيميل ده متسجل قبل كده. ادخل على حسابك." };
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, passwordHash, role: "student" } });
  try {
    await signIn("credentials", { email, password, redirectTo: next });
  } catch (error) {
    if (isRedirect(error)) {
      throw error;
    }
    throw error;
  }
  return null;
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

function validPassword(password: string): boolean {
  return password.length >= 8 && password.length <= 72;
}

export async function requestPasswordReset(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();
  const prisma = getPrisma();
  if (prisma && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const user = await prisma.user.findUnique({ where: { email } });
    const recent = user
      ? await prisma.passwordReset.findFirst({
          where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 60_000) } },
        })
      : null;
    if (user && !recent) {
      const token = newToken();
      const expiresAt = new Date(Date.now() + 30 * 60_000);
      await prisma.passwordReset.deleteMany({ where: { userId: user.id, usedAt: null } });
      await prisma.passwordReset.create({ data: { userId: user.id, tokenHash: hashToken(token), expiresAt } });
      const origin = process.env["AUTH_URL"] ?? "https://courses.remonromany.com";
      await sendMail({
        to: user.email,
        subject: `تغيير كلمة السر — ${SITE_NAME}`,
        text: `أهلاً ${user.name}\nغيّر كلمة السر من الرابط ده خلال 30 دقيقة:\n${origin}/reset/${token}\nلو مش إنت اللي طلبت التغيير، سيب الرسالة دي.\n${SITE_NAME}`,
      });
    }
  }
  redirect("/forgot?sent=1");
}

export async function resetPassword(formData: FormData): Promise<void> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!validPassword(password) || token.length < 20) {
    redirect(`/reset/${encodeURIComponent(token)}?error=1`);
  }
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/forgot?sent=1");
  }
  const reset = await prisma.passwordReset.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!reset || reset.usedAt || reset.expiresAt.getTime() < Date.now()) {
    redirect("/forgot?expired=1");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id: reset.userId }, data: { passwordHash } });
  await prisma.passwordReset.update({ where: { id: reset.id }, data: { usedAt: new Date() } });
  redirect("/login?reset=1");
}

export async function changePassword(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?next=/account");
  }
  const current = String(formData.get("current") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!validPassword(password)) {
    redirect("/account?password=short");
  }
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/account?password=off");
  }
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) {
    redirect("/account?password=bad");
  }
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(password, 12) } });
  await prisma.passwordReset.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } });
  redirect("/account?password=ok");
}

export async function updateProfile(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?next=/account");
  }
  const name = String(formData.get("name") ?? "").trim();
  const rawPhone = String(formData.get("phone") ?? "");
  const phone = phoneValue(rawPhone);
  if (name.length < 2 || name.length > 120 || (rawPhone.trim() && !phone)) {
    redirect("/account?profile=bad");
  }
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/account?profile=off");
  }
  await prisma.user.update({ where: { id: session.user.id }, data: { name, phone } });
  revalidatePath("/account");
  redirect("/account?profile=ok");
}

export async function adminSetPassword(formData: FormData): Promise<void> {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    redirect("/login?next=/admin");
  }
  const userId = String(formData.get("userId") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!validPassword(password)) {
    redirect("/admin?password=short");
  }
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/admin?db=off");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    redirect("/admin");
  }
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(password, 12) } });
  await prisma.passwordReset.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } });
  await sendMail({
    to: user.email,
    subject: `كلمة السر الجديدة — ${SITE_NAME}`,
    text: `أهلاً ${user.name}\nكلمة السر بتاعة حسابك اتغيّرت. ادخل من ${process.env["AUTH_URL"] ?? "https://courses.remonromany.com"}/login\nلو مش وصلتك كلمة السر الجديدة، كلمنا على واتساب ${CONTACT.phoneDisplay}.\n${SITE_NAME}`,
  });
  redirect("/admin?password=ok");
}
