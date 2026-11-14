export type Testimonial = {
  quote: string;
  name: string;
  course: string;
};

/**
 * نماذج شكل القسم فقط. مش آراء طلاب.
 * لما يوصلك رأي حقيقي بموافقة صاحبه، استبدل المصفوفة واقلب testimonialsAreSamples لـ false.
 */
export const testimonialsAreSamples = true;

export const testimonials: Testimonial[] = [
  {
    quote: "أول درس خلّاني أفهم ليه الخطوة بتتعمل، مش أحفظ الأمر وخلاص. هكمّل الباقي.",
    name: "نموذج مؤقت",
    course: "Full Stack React + Node",
  },
  {
    quote: "حبيت إن المشروع في الآخر حاجة أقدر أحطها في البورتفوليو، مش تمرين يتقفل عليه الملف.",
    name: "نموذج مؤقت",
    course: "UI/UX",
  },
  {
    quote: "الشرح هادي وعلى شغل حقيقي. عرفت أفرق بين الأداة والنتيجة المطلوبة مني.",
    name: "نموذج مؤقت",
    course: "التسويق الرقمي",
  },
];
