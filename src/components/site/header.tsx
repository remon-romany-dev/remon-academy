"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/site/logo";

const links = [
  { href: "/goals", label: "طريق الشغل" },
  { href: "/diplomas", label: "الدبلومات" },
  { href: "/#courses", label: "الكورسات" },
  { href: "/kids", label: "أطفال" },
  { href: "/account", label: "حسابي" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 16);
  });

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-line bg-background/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2 md:px-8">
        <Logo />
        <nav aria-label="القائمة الرئيسية" className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-12 items-center rounded-full px-4 text-[0.95rem] font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/#courses"
            className="hidden min-h-12 items-center rounded-full bg-accent px-6 text-[0.95rem] font-bold text-accent-ink transition-transform hover:scale-105 sm:inline-flex"
          >
            ابدأ أول درس مجانًا
          </Link>
          <button
            type="button"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
            className="flex size-12 items-center justify-center rounded-full border border-line lg:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute inset-x-0 h-0.5 rounded bg-foreground transition-all ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute inset-x-0 h-0.5 rounded bg-foreground transition-all ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>
      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-background px-5 py-6 lg:hidden"
      >
        <nav aria-label="قائمة الموبايل" className="flex flex-col">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-display flex min-h-14 items-center border-b border-line text-2xl font-black"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#courses"
          onClick={() => setOpen(false)}
          className="mt-8 flex min-h-14 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-ink"
        >
          ابدأ أول درس مجانًا
        </Link>
      </div>
    </header>
  );
}
