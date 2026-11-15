import nodemailer from "nodemailer";

type Mail = {
  to: string;
  subject: string;
  text: string;
};

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

export function mailConfigured(): boolean {
  return Boolean(readEnv("SMTP_HOST") && readEnv("SMTP_USER") && readEnv("SMTP_PASS") && readEnv("SMTP_FROM"));
}

export async function sendMail(mail: Mail): Promise<boolean> {
  const host = readEnv("SMTP_HOST");
  const user = readEnv("SMTP_USER");
  const pass = readEnv("SMTP_PASS");
  const from = readEnv("SMTP_FROM");
  if (!host || !user || !pass || !from) {
    return false;
  }
  const port = Number(readEnv("SMTP_PORT") ?? "465");
  try {
    const transport = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    await transport.sendMail({ from, to: mail.to, subject: mail.subject, text: mail.text });
    return true;
  } catch {
    return false;
  }
}
