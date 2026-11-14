import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { CONTACT } from "@/content/contact";

export const metadata: Metadata = {
  title: "سياسة الاسترجاع",
  description: "شروط استرجاع قيمة الاشتراك في كورسات أكاديمية ريمون.",
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  return (
    <LegalPage
      eyebrow="قانوني"
      title="سياسة الاسترجاع"
      intro="عشان تقرر وانت مطمّن: أول درس مجاني تقدر تجرّب بيه قبل ما تدفع، ولو اشتركت وماناسبكش الكورس فيه فرصة استرجاع بالشروط دي."
      updated="14 نوفمبر 2026"
      sections={[
        {
          heading: "مين يقدر يسترجع",
          list: [
            "طلب الاسترجاع يتقدّم خلال 7 أيام من تاريخ الاشتراك.",
            "ومتكونش شفت أكتر من 20% من دروس الكورس.",
          ],
        },
        {
          heading: "إزاي تطلب الاسترجاع",
          list: [
            `ابعت رسالة على واتساب ${CONTACT.phoneDisplay} أو على ${CONTACT.email} فيها اسمك واسم الكورس.`,
            "هنراجع الطلب خلال 3 أيام عمل ونرد عليك.",
            "لو الطلب مقبول، هترجع لك القيمة بنفس طريقة الدفع.",
          ],
        },
        {
          heading: "حالات مش بتتسترجع",
          list: ["بعد انقضاء مدة الـ 7 أيام.", "لو تم تجاوز نسبة المشاهدة المسموحة.", "لو اتخالفت شروط الاستخدام (زي مشاركة الحساب)."],
        },
      ]}
    />
  );
}
