/** بيانات التواصل (نفس الموجود في بورتفوليو ريمون). */
export const CONTACT = {
  whatsapp: "201270146047",
  phoneDisplay: "+20 127 014 6047",
  email: "remon@remonromany.com",
  linkedin: "https://linkedin.com/in/remon-romany",
  linkedinLabel: "linkedin.com/in/remon-romany",
  portfolio: "https://remonromany.com",
} as const;

/**
 * بيانات الدفع اليدوي المؤقتة (لحد ما يتفعّل Paymob).
 * املا القيم دي بالرقم أو العنوان الحقيقي. لو فاضية الصفحة هتقول للعميل إن البيانات هتتبعت على واتساب.
 */
export const PAYMENT = {
  instapayAddress: "01065344806",
  vodafoneCashNumber: "01065344806",
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
