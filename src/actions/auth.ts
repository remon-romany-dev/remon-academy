"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/lib/prisma";
import { safeNextPath } from "@/lib/paths";

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
