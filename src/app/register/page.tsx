import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { registerAction } from "@/actions/auth";
import { AuthForm } from "@/components/account/auth-form";
import { PageFrame } from "@/components/site/page-frame";
import { safeNextPath } from "@/lib/paths";

export const instant = false;

export const metadata: Metadata = {
  title: "تسجيل حساب",
  robots: { index: false, follow: false },
};

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  await connection();
  const search = await searchParams;
  const next = safeNextPath(typeof search.next === "string" ? search.next : undefined);
  return (
    <PageFrame>
      <p className="mb-3 text-base font-bold text-accent">الحساب</p>
      <h1 className="font-display text-4xl font-black">سجّل حسابك</h1>
      <p className="mt-3 text-base leading-7 text-muted">الحساب بيفتح لك الكورس بعد ما يتأكد الدفع.</p>
      <AuthForm action={registerAction} submit="إنشاء الحساب" next={next} includeName />
      <p className="mt-6 text-sm text-muted">
        عندك حساب؟{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-bold text-accent">
          ادخل
        </Link>
      </p>
    </PageFrame>
  );
}
