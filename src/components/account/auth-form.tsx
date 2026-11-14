"use client";

import { useActionState } from "react";
import type { AuthState } from "@/actions/auth";
import { buttonClass, fieldClass } from "@/components/account/styles";

export function AuthForm({
  action,
  submit,
  next,
  includeName = false,
}: {
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
  submit: string;
  next: string;
  includeName?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className="mt-8 space-y-4">
      {includeName ? (
        <label className="block text-sm font-bold">
          الاسم
          <input name="name" required autoComplete="name" className={fieldClass} />
        </label>
      ) : null}
      <label className="block text-sm font-bold">
        الإيميل
        <input name="email" type="email" required autoComplete="email" dir="ltr" className={fieldClass} />
      </label>
      <label className="block text-sm font-bold">
        كلمة السر
        <input name="password" type="password" required minLength={8} autoComplete={includeName ? "new-password" : "current-password"} dir="ltr" className={fieldClass} />
      </label>
      <input type="hidden" name="next" value={next} />
      {state?.error ? (
        <p role="alert" className="text-sm font-bold text-red-300">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={`${buttonClass} w-full`}>
        {pending ? "لحظة..." : submit}
      </button>
    </form>
  );
}
