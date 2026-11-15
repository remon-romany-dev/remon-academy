import { connection } from "next/server";
import { certificatePdf } from "@/lib/certificate-pdf";
import { findCertificate } from "@/lib/certificates";

export async function GET(_request: Request, context: { params: Promise<{ code: string }> }): Promise<Response> {
  await connection();
  const { code } = await context.params;
  const certificate = await findCertificate(code);
  if (!certificate) {
    return new Response("مفيش شهادة بالرقم ده.", { status: 404 });
  }
  const bytes = await certificatePdf(certificate);
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificate-${certificate.code}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
