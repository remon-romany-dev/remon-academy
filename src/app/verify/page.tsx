import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { PageFrame } from "@/components/site/page-frame";
import { normalizeCertificateCode } from "@/lib/certificates";

export const instant = false;

export const metadata: Metadata = {
  title: "تحقق من شهادة",
  description: "اكتب رقم التحقق المكتوب على شهادة أكاديمية ريمون عشان تتأكد إنها صادرة من الأكاديمية.",
  alternates: { canonical: "/verify" },
};

async function findCertificateAction(formData: FormData): Promise<void> {
  "use server";
  const code = normalizeCertificateCode(String(formData.get("code") ?? ""));
  if (!code) {
    redirect("/verify?error=1");
  }
  redirect(`/verify/${code}`);
}

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await connection();
  const search = await searchParams;
  return (
    <PageFrame>
      <p className="text-base font-bold text-accent">الشهادة</p>
      <h1 className="font-display mt-3 text-4xl font-black">تحقق من رقم الشهادة</h1>
      <p className="mt-4 text-lg leading-8 text-muted">اكتب الرقم المكتوب على الشهادة. الصفحة دي مفتوحة لأي حد، من غير حساب.</p>
      <form action={findCertificateAction} className="mt-8 space-y-4">
        <label className="block text-sm font-bold">
          رقم التحقق
          <input
            name="code"
            required
            dir="ltr"
            placeholder="RA-XXXXXXXX"
            className="mt-2 w-full rounded-2xl border border-line bg-background px-4 py-3 font-mono text-base"
          />
        </label>
        <button type="submit" className="inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-bold text-accent-ink">
          راجع الرقم
        </button>
      </form>
      {search.error === "1" ? <p className="mt-4 text-sm font-bold text-red-300">الرقم ناقص أو شكله مش زي الشهادة.</p> : null}
    </PageFrame>
  );
}
