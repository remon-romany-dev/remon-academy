import Link from "next/link";
import { SITE_NAME } from "@/content/site";

/** علامة الأكاديمية: حرف R مقطوع كمسار، يقرأ من ١٦ بكسل لحد الهيدر. */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden>
      <rect width="36" height="36" rx="9" fill="var(--accent)" />
      <path
        fill="var(--accent-ink)"
        d="M10.2 27.2V8.8h8.4c3.7 0 6.3 2.35 6.3 5.7 0 2.55-1.35 4.45-3.45 5.25l4.85 7.45h-4.55l-4.35-6.85h-2.85v6.85H10.2Zm4.35-10.35h3.55c1.55 0 2.5-.9 2.5-2.25s-.95-2.2-2.5-2.2h-3.55v4.45Z"
      />
      <path d="M27.2 30.4h-6.4" stroke="var(--accent-ink)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex min-h-12 items-center gap-3" aria-label={`${SITE_NAME} - الصفحة الرئيسية`}>
      <LogoMark />
      <span className="font-display text-xl leading-none font-black">{SITE_NAME}</span>
    </Link>
  );
}
