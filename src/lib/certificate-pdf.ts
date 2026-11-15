import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { PDFDocument } from "pdf-lib";
import type { IssuedCertificate } from "@/lib/certificates";
import { formatCertificateDate } from "@/lib/certificates";
import { SITE_URL } from "@/content/site";

function xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function certificateSvg(certificate: IssuedCertificate): string {
  const issued = formatCertificateDate(certificate.issuedAt);
  const verify = `${SITE_URL}/verify/${certificate.code}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1190" height="1684" viewBox="0 0 595 842">
  <rect width="595" height="842" fill="#101612"/>
  <rect x="28" y="28" width="539" height="786" rx="22" fill="none" stroke="#c6ef4a" stroke-width="3"/>
  <g transform="translate(276 64)">
    <rect width="42" height="42" rx="11" fill="#c6ef4a"/>
    <path d="M9 32H18V23H27V14H35" stroke="#14240f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="35" cy="11" r="2.6" fill="#14240f"/>
  </g>
  <text x="297" y="140" text-anchor="middle" direction="rtl" font-family="IBM Plex Sans Arabic" font-size="18" font-weight="700" fill="#c6ef4a">أكاديمية ريمون</text>
  <text x="297" y="230" text-anchor="middle" direction="rtl" font-family="IBM Plex Sans Arabic" font-size="42" font-weight="700" fill="#f4f7f2">شهادة إتمام</text>
  <text x="297" y="300" text-anchor="middle" direction="rtl" font-family="IBM Plex Sans Arabic" font-size="18" fill="#d5ddd4">نشهد أن</text>
  <text x="297" y="350" text-anchor="middle" direction="rtl" font-family="IBM Plex Sans Arabic" font-size="28" font-weight="700" fill="#f4f7f2">${xml(certificate.studentName)}</text>
  <text x="297" y="400" text-anchor="middle" direction="rtl" font-family="IBM Plex Sans Arabic" font-size="18" fill="#d5ddd4">أتمّ كورس</text>
  <text x="297" y="450" text-anchor="middle" direction="rtl" font-family="IBM Plex Sans Arabic" font-size="26" font-weight="700" fill="#f4f7f2">${xml(certificate.courseTitle)}</text>
  <text x="297" y="500" text-anchor="middle" direction="rtl" font-family="IBM Plex Sans Arabic" font-size="18" fill="#d5ddd4">وسلّم المشروع النهائي.</text>
  <text x="297" y="560" text-anchor="middle" direction="rtl" font-family="IBM Plex Sans Arabic" font-size="16" fill="#d5ddd4">${xml(issued)}</text>
  <text x="297" y="640" text-anchor="middle" direction="rtl" font-family="IBM Plex Sans Arabic" font-size="16" font-weight="700" fill="#f4f7f2">رقم التحقق</text>
  <text x="297" y="674" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-size="22" font-weight="700" fill="#c6ef4a">${xml(certificate.code)}</text>
  <text x="297" y="710" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-size="12" fill="#d5ddd4">${xml(verify)}</text>
  <text x="297" y="770" text-anchor="middle" direction="rtl" font-family="IBM Plex Sans Arabic" font-size="16" fill="#f4f7f2">ريمون رومانى · المدرّب</text>
</svg>`;
}

export async function certificatePdf(certificate: IssuedCertificate): Promise<Uint8Array> {
  const fonts = path.join(process.cwd(), "assets", "fonts");
  const regular = path.join(fonts, "IBMPlexSansArabic-Regular.ttf");
  const bold = path.join(fonts, "IBMPlexSansArabic-Bold.ttf");
  const resvg = new Resvg(certificateSvg(certificate), {
    fitTo: { mode: "width", value: 1190 },
    font: {
      fontFiles: [regular, bold],
      loadSystemFonts: false,
      defaultFontFamily: "IBM Plex Sans Arabic",
    },
  });
  const png = resvg.render().asPng();
  const pdf = await PDFDocument.create();
  pdf.setTitle(`شهادة إتمام ${certificate.code}`);
  pdf.setAuthor("أكاديمية ريمون");
  pdf.setSubject(certificate.code);
  pdf.setKeywords([certificate.code]);
  const page = pdf.addPage([595.28, 841.89]);
  const image = await pdf.embedPng(png);
  page.drawImage(image, { x: 0, y: 0, width: 595.28, height: 841.89 });
  return pdf.save();
}
