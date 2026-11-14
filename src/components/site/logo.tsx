import Link from "next/link";
import { SITE_NAME } from "@/content/site";

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden>
      <rect width="36" height="36" rx="11" fill="var(--accent)" />
      <path
        d="M12 27V9.5h7.2a5 5 0 0 1 0 10H12m7 0 5.5 7.5"
        stroke="var(--accent-ink)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
