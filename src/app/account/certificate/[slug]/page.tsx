import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/site/page-frame";
import { CertificateSheet } from "@/components/site/certificate-sheet";
import { requireUser } from "@/lib/guards";
import { issueCertificate } from "@/lib/certificates";

export const instant = false;

export const metadata: Metadata = {
  title: "شهادة الإتمام",
  robots: { index: false, follow: false },
};

export default async function CertificatePage({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const session = await requireUser();
  const { slug } = await params;
  const certificate = await issueCertificate(session.user.id, slug);
  if (!certificate) {
    notFound();
  }

  return (
    <PageFrame>
      <CertificateSheet certificate={certificate} />
      <p className="mt-6 text-center text-sm text-muted print:hidden">
        <a href={`/certificates/${certificate.code}/pdf`} className="font-bold text-accent">
          نزّل PDF
        </a>
        <span className="mx-2">·</span>
        <Link href={`/verify/${certificate.code}`} className="font-bold text-accent">
          صفحة التحقق
        </Link>
        <span className="mx-2">·</span>
        <Link href="/account" className="font-bold text-accent">
          رجوع لحسابي
        </Link>
      </p>
    </PageFrame>
  );
}
