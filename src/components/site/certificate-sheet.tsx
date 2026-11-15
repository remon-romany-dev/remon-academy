import { LogoMark } from "@/components/site/logo";
import { formatCertificateDate, type IssuedCertificate } from "@/lib/certificates";
import { SITE_NAME, SITE_URL } from "@/content/site";

export function CertificateSheet({ certificate }: { certificate: IssuedCertificate }) {
  return (
    <article className="rounded-3xl border border-accent bg-surface p-8 text-center sm:p-12">
      <div className="flex justify-center">
        <LogoMark size={48} />
      </div>
      <p className="mt-4 text-sm font-bold text-accent">{SITE_NAME}</p>
      <h1 className="font-display mt-4 text-4xl font-black">شهادة إتمام</h1>
      <p className="mt-6 text-lg leading-8">
        نشهد أن <strong>{certificate.studentName}</strong> أتمّ كورس <strong>{certificate.courseTitle}</strong> وسلّم المشروع
        النهائي.
      </p>
      <p className="mt-3 text-sm text-muted">{formatCertificateDate(certificate.issuedAt)}</p>
      <p className="mt-8 text-sm font-bold">رقم التحقق</p>
      <p className="mt-1 font-mono text-xl font-bold text-accent" dir="ltr">
        {certificate.code}
      </p>
      <p className="mt-2 text-sm text-muted" dir="ltr">
        {SITE_URL}/verify/{certificate.code}
      </p>
      <p className="mt-8 text-sm text-muted">ريمون رومانى · المدرّب</p>
    </article>
  );
}
