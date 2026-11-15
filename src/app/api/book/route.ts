import { CONTACT, whatsappLink } from "@/content/contact";
import { notifyOwner } from "@/lib/notify";

type Intent = "bundle" | "course";

function intent(value: string): Intent | null {
  switch (value) {
    case "bundle":
    case "course":
      return value;
    default:
      return null;
  }
}

export async function POST(request: Request): Promise<Response> {
  const form = await request.formData();
  const kind = intent(String(form.get("kind") ?? ""));
  const title = String(form.get("title") ?? "").trim().slice(0, 160);
  const price = String(form.get("price") ?? "").replace(/[^\d]/g, "").slice(0, 8);
  if (!kind || title.length < 2) {
    return Response.redirect(new URL("/", request.url), 303);
  }
  const priceText = price ? `${Number(price).toLocaleString("en-US")} جنيه` : "";
  switch (kind) {
    case "bundle":
      await notifyOwner(
        `حجز باقة — ${title}`,
        `حد طلب يحجز باقة ${title}${priceText ? ` بـ ${priceText}` : ""}.\nهيكمّل الرسالة على واتساب ${CONTACT.phoneDisplay}.`,
      );
      return Response.redirect(whatsappLink(`أهلاً، عايز باقة ${title}${priceText ? ` بـ ${priceText}` : ""}`), 303);
    case "course":
      await notifyOwner(
        `طلب تسجيل — ${title}`,
        `حد طلب تسجيل كورس ${title}.\nهيكمّل الرسالة على واتساب ${CONTACT.phoneDisplay}.`,
      );
      return Response.redirect(whatsappLink(`أهلاً، عايز أسجّل في كورس ${title}`), 303);
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
}
