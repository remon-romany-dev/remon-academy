"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { activateEnrollment } from "@/lib/fulfill";
import { requireAdmin } from "@/lib/guards";
import { getPrisma } from "@/lib/prisma";
import { paymobConfigured } from "@/lib/paymob";
import { safeNextPath } from "@/lib/paths";

function manualProvider(value: string): "instapay" | "vodafone" | null {
  switch (value) {
    case "instapay":
    case "vodafone":
      return value;
    default:
      return null;
  }
}

export async function claimManualPayment(formData: FormData): Promise<void> {
  const session = await auth();
  const slug = String(formData.get("slug") ?? "");
  if (!session?.user) {
    redirect(`/login?next=${encodeURIComponent(safeNextPath(`/checkout/${slug}`, "/"))}`);
  }
  const provider = manualProvider(String(formData.get("provider") ?? ""));
  if (!provider) {
    redirect(`/checkout/${slug}?pay=method`);
  }
  const prisma = getPrisma();
  if (!prisma) {
    redirect(`/checkout/${slug}?pay=off`);
  }
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course || !course.published) {
    redirect("/#courses");
  }
  const pending = await prisma.payment.findFirst({
    where: { userId: session.user.id, courseId: course.id, provider, status: "pending" },
  });
  if (!pending) {
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
        provider,
        amountEgp: course.priceEgp,
        status: "pending",
      },
    });
  }
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    create: { userId: session.user.id, courseId: course.id, status: "pending" },
    update: {},
  });
  redirect("/account?sent=1");
}

export async function startPaymob(formData: FormData): Promise<void> {
  const session = await auth();
  const slug = String(formData.get("slug") ?? "");
  if (!session?.user) {
    redirect(`/login?next=${encodeURIComponent(`/checkout/${slug}`)}`);
  }
  if (!paymobConfigured()) {
    redirect(`/checkout/${slug}?pay=off`);
  }
  const prisma = getPrisma();
  if (!prisma) {
    redirect(`/checkout/${slug}?pay=off`);
  }
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) {
    redirect("/#courses");
  }
  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      courseId: course.id,
      provider: "paymob",
      amountEgp: course.priceEgp,
      status: "pending",
    },
  });
  const amount = course.priceEgp * 100;
  const [firstName, ...rest] = (session.user.name ?? "Student").split(" ");
  const origin = process.env.AUTH_URL ?? "https://courses.remonromany.com";
  const response = await fetch("https://accept.paymob.com/v1/intention/", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "EGP",
      payment_methods: [Number(process.env.PAYMOB_INTEGRATION_ID)],
      special_reference: payment.id,
      notification_url: `${origin}/api/paymob/webhook`,
      redirection_url: `${origin}/checkout/${slug}/return?payment=${payment.id}`,
      items: [{ name: course.title, amount, description: course.slug, quantity: 1 }],
      billing_data: {
        apartment: "NA",
        first_name: firstName || "Student",
        last_name: rest.join(" ") || "Academy",
        street: "NA",
        building: "NA",
        phone_number: "+201000000000",
        city: "Cairo",
        country: "EG",
        email: session.user.email ?? "student@remonromany.com",
        floor: "NA",
        state: "Cairo",
      },
    }),
  });
  if (!response.ok) {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "failed" } });
    redirect(`/checkout/${slug}?pay=fail`);
  }
  const body = (await response.json()) as { client_secret?: string };
  if (!body.client_secret) {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "failed" } });
    redirect(`/checkout/${slug}?pay=fail`);
  }
  redirect(
    `https://accept.paymob.com/unifiedcheckout/?publicKey=${encodeURIComponent(process.env.PAYMOB_PUBLIC_KEY ?? "")}&clientSecret=${encodeURIComponent(body.client_secret)}`,
  );
}

export async function confirmManualPayment(formData: FormData): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/admin");
  }
  const paymentId = String(formData.get("paymentId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) {
    redirect("/admin");
  }
  if (decision === "paid") {
    await activateEnrollment(payment.userId, payment.courseId, payment.id);
  } else if (decision === "failed") {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "failed" } });
  }
  revalidatePath("/admin");
  revalidatePath("/account");
  redirect("/admin");
}
