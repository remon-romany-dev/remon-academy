import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { PageFrame } from "@/components/site/page-frame";
import { CertificateSheet } from "@/components/site/certificate-sheet";
import { findCertificate } from "@/lib/certificates";

export const instant = false;

export const metadata: Metadata = {
  title: "نتيجة التحقق",
  robots: { index: false, follow: false },
};

export default async function VerifyResultPage({ params }: { params: Promise<{ code: string }> }) {
  await connection();
  const { code } = await params;
  const certificate = await findCertificate(code);

  return (
    <PageFrame>
      {certificate ? (
        <>
          <p className="mb-6 text-center text-base font-bold text-accent">الرقم ده صحيح، والشهادة صادرة من الأكاديمية.</p>
          <CertificateSheet certificate={certificate} />
          <p className="mt-6 text-center text-sm print:hidden">
            <a href={`/certificates/${certificate.code}/pdf`} className="font-bold text-accent">
              نزّل PDF
            </a>
          </p>
        </>
      ) : (
        <>
          <h1 className="font-display text-4xl font-black">مفيش شهادة بالرقم ده</h1>
          <p className="mt-4 text-lg leading-8 text-muted">راجع الرقم المكتوب على الشهادة، من غير مسافات زيادة.</p>
          <Link href="/verify" className="mt-6 inline-flex font-bold text-accent">
            جرّب رقم تاني
          </Link>
        </>
      )}
    </PageFrame>
  );
}
