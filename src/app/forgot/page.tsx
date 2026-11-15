import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/auth";
import { buttonClass, fieldClass } from "@/components/account/styles";
import { PageFrame } from "@/components/site/page-frame";
import { whatsappLink } from "@/content/contact";

export const instant = false;

export const metadata: Metadata = {
  title: "استعادة كلمة السر",
  robots: { index: false, follow: false },
};

export default async function ForgotPage({ searchParams }: { searchParams: Promise<{ sent?: string; expired?: string }> }) {
  await connection();
  const search = await searchParams;
  return (
    <PageFrame>
      <p className="mb-3 text-base font-bold text-accent">الحساب</p>
      <h1 className="font-display text-4xl font-black">استعادة كلمة السر</h1>
      {search.sent === "1" ? (
        <div className="mt-6 space-y-4 text-base leading-7">
          <p>لو الإيميل ده متسجل، هتوصلك رسالة فيها رابط تغيير كلمة السر. الرابط يشتغل 30 دقيقة.</p>
          <p className="text-muted">لو الرسالة متوصلتش، ابعتلنا على واتساب وبنرجّع لك الدخول.</p>
          <a href={whatsappLink("أهلاً، محتاج أرجّع كلمة السر بتاعة حسابي على الأكاديمية.")} className="inline-flex min-h-12 items-center rounded-full bg-[#25d366] px-6 font-bold text-white">
            واتساب
          </a>
        </div>
      ) : (
        <>
          {search.expired === "1" ? <p className="mt-4 text-sm font-bold text-red-300">الرابط خلّص أو اتستخدم. اطلب واحد جديد.</p> : null}
          <p className="mt-3 text-base leading-7 text-muted">اكتب إيميل الحساب، وهنبعتلك رابط تغيير كلمة السر.</p>
          <form action={requestPasswordReset} className="mt-8 space-y-4">
            <label className="block text-sm font-bold">
              الإيميل
              <input name="email" type="email" required autoComplete="email" dir="ltr" className={fieldClass} />
            </label>
            <button type="submit" className={`${buttonClass} w-full`}>
              ابعت الرابط
            </button>
          </form>
        </>
      )}
      <p className="mt-6 text-sm text-muted">
        <Link href="/login" className="font-bold text-accent">
          رجوع للدخول
        </Link>
      </p>
    </PageFrame>
  );
}
