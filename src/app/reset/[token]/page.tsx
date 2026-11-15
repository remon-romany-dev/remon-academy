import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { resetPassword } from "@/actions/auth";
import { buttonClass, fieldClass } from "@/components/account/styles";
import { PageFrame } from "@/components/site/page-frame";
import { getPrisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";

export const instant = false;

export const metadata: Metadata = {
  title: "كلمة سر جديدة",
  robots: { index: false, follow: false },
};

export default async function ResetPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await connection();
  const { token } = await params;
  const search = await searchParams;
  const prisma = getPrisma();
  const reset = prisma ? await prisma.passwordReset.findUnique({ where: { tokenHash: hashToken(token) } }) : null;
  const valid = Boolean(reset && !reset.usedAt && reset.expiresAt.getTime() >= Date.now());

  return (
    <PageFrame>
      <p className="mb-3 text-base font-bold text-accent">الحساب</p>
      <h1 className="font-display text-4xl font-black">كلمة سر جديدة</h1>
      {valid ? (
        <form action={resetPassword} className="mt-8 space-y-4">
          <input type="hidden" name="token" value={token} />
          {search.error === "1" ? <p className="text-sm font-bold text-red-300">كلمة السر لازم تبقى 8 حروف على الأقل.</p> : null}
          <label className="block text-sm font-bold">
            كلمة السر الجديدة
            <input name="password" type="password" required minLength={8} autoComplete="new-password" dir="ltr" className={fieldClass} />
          </label>
          <button type="submit" className={`${buttonClass} w-full`}>
            احفظ كلمة السر
          </button>
        </form>
      ) : (
        <p className="mt-6 text-base leading-7 text-muted">
          الرابط خلّص أو اتستخدم.{" "}
          <Link href="/forgot" className="font-bold text-accent">
            اطلب رابط جديد
          </Link>
        </p>
      )}
    </PageFrame>
  );
}
