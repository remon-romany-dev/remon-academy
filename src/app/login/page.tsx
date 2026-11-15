import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { AuthForm } from "@/components/account/auth-form";
import { PageFrame } from "@/components/site/page-frame";
import { safeNextPath } from "@/lib/paths";

export const instant = false;

export const metadata: Metadata = {
  title: "دخول",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; reset?: string }> }) {
  await connection();
  const search = await searchParams;
  const next = safeNextPath(search.next);
  return (
    <PageFrame>
      <p className="mb-3 text-base font-bold text-accent">الحساب</p>
      <h1 className="font-display text-4xl font-black">ادخل على حسابك</h1>
      <p className="mt-3 text-base leading-7 text-muted">من هنا تشوف كورساتك وتقدّمك وشهادتك.</p>
      {search.reset === "1" ? <p className="mt-4 text-sm font-bold text-accent">كلمة السر اتغيرت. ادخل بالجديدة.</p> : null}
      <AuthForm action={loginAction} submit="دخول" next={next} />
      <p className="mt-6 text-sm text-muted">
        <Link href="/forgot" className="font-bold text-accent">
          نسيت كلمة السر؟
        </Link>
      </p>
      <p className="mt-3 text-sm text-muted">
        معندكش حساب؟{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-bold text-accent">
          سجّل حساب جديد
        </Link>
      </p>
    </PageFrame>
  );
}
