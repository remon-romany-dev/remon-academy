import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { CONTACT } from "@/content/contact";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "أكاديمية ريمون مركز كورسات أونلاين وحضوري في البرمجة والتصميم والتسويق والذكاء الاصطناعي والبيانات، يديره المدرّب ريمون رومانى.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="من نحن"
      title="أكاديمية ريمون"
      intro="مركز كورسات بيعلّمك مهارة تشتغل بيها، أونلاين أو في القاعة، على إيد مدرّب شغّال في السوق."
      updated="14 نوفمبر 2026"
      sections={[
        {
          heading: "مين ورا الأكاديمية",
          paragraphs: [
            "أنا ريمون رومانى، مطوّر ومصمم ويب بشتغل في المجال من أكتر من 7 سنين، ونفّذت أكتر من 30 مشروع لماركات أزياء وشركات تقنية ومتاجر.",
            "فتحت الأكاديمية عشان أنقل للطلاب طريقة الشغل الحقيقية، مش المنهج النظري بس.",
          ],
        },
        {
          heading: "بنقدّم إيه",
          list: [
            "برمجة: كل توليفات الـ Full Stack، فرونت، باكند (Node وLaravel وJava و.NET وPython)، Flutter، وQA.",
            "تصميم: UI/UX، جرافيك، وموشن.",
            "تسويق رقمي، وكورس قصير للذكاء الاصطناعي في التسويق.",
            "ذكاء اصطناعي تطبيقي، ودبلومة تعلّم الآلة، وكورس قصير للمطورين.",
            "تحليل البيانات وعلم البيانات مساران منفصلان.",
          ],
        },
        {
          heading: "طريقة التعلم",
          paragraphs: [
            "أول درس في كل كورس مجاني. لو عجبك الأسلوب تشترك وتبدأ باقي الدروس، وتنتهي بمشروع نهائي وشهادة إتمام.",
          ],
        },
        {
          heading: "تواصل معانا",
          paragraphs: [`واتساب: ${CONTACT.phoneDisplay}  ·  الإيميل: ${CONTACT.email}`],
        },
      ]}
    />
  );
}
