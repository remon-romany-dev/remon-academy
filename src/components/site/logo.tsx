import Link from "next/link";
import { SITE_NAME } from "@/content/site";

/** علامة المسار: درج طالع، يقرأ من ١٦ بكسل لحد الهيدر. */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden>
      <rect width="36" height="36" rx="10" fill="var(--accent)" />
      <path
        d="M8 27.5H15.5V20.5H23V13.5H30"
        stroke="var(--accent-ink)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="10" r="2.3" fill="var(--accent-ink)" />
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
