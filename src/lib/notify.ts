import { CONTACT } from "@/content/contact";
import { sendMail } from "@/lib/mail";

function ownerEmail(): string {
  const admin = process.env["ADMIN_EMAIL"];
  return admin && admin.includes("@") ? admin : CONTACT.email;
}

export async function notifyOwner(subject: string, text: string): Promise<void> {
  await sendMail({ to: ownerEmail(), subject, text });
  const key = process.env["WHATSAPP_NOTIFY_KEY"];
  if (!key) {
    return;
  }
  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", `+${CONTACT.whatsapp}`);
  url.searchParams.set("apikey", key);
  url.searchParams.set("text", text);
  try {
    await fetch(url, { cache: "no-store" });
  } catch {
    return;
  }
}
