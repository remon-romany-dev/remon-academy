export type Testimonial = {
  quote: string;
  name: string;
  course: string;
};

/**
 * نصوص القسم من غير أسماء. مش طلاب حقيقيين.
 * لما يوصلك رأي حقيقي بموافقة صاحبه، استبدل المصفوفة واقلب testimonialsAreSamples لـ false.
 */
export const testimonialsAreSamples = true;

export const testimonials: Testimonial[] = [
  {
    quote: "أول درس خلّاني أفهم ليه الخطوة بتتعمل، مش أحفظ الأمر وخلاص. هكمّل الباقي.",
    name: "",
    course: "Full Stack React + Node",
  },
  {
    quote: "حبيت إن المشروع في الآخر حاجة أقدر أحطها في البورتفوليو، مش تمرين يتقفل عليه الملف.",
    name: "",
    course: "UI/UX",
  },
  {
    quote: "الشرح هادي وعلى شغل حقيقي. عرفت أفرق بين الأداة والنتيجة المطلوبة مني.",
    name: "",
    course: "التسويق الرقمي",
  },
];
