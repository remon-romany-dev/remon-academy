/** بيانات التواصل (نفس الموجود في بورتفوليو ريمون). */
export const CONTACT = {
  whatsapp: "201270146047",
  phoneDisplay: "+20 127 014 6047",
  email: "remon@remonromany.com",
  linkedin: "https://linkedin.com/in/remon-romany",
  linkedinLabel: "linkedin.com/in/remon-romany",
  portfolio: "https://remonromany.com",
} as const;

/** إنستا باي على رقم الموبايل، وفودافون كاش على الرقم التاني. */
export const PAYMENT = {
  instapayAddress: "01270146047",
  vodafoneCashNumber: "01065344806",
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
