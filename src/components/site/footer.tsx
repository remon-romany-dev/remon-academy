import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { courses, tracks } from "@/content/site";

const linkClass = "flex min-h-11 items-center text-base text-muted hover:text-accent";

export function SiteFooter() {
  return (
    <footer className="defer border-t border-line bg-surface/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-base leading-7 text-muted">
            كورسات برمجة وتصميم وتسويق وذكاء اصطناعي وبيانات، أونلاين وحضوري. أول درس مجاني.
          </p>
        </div>
        <nav aria-label="المسارات">
          <h2 className="font-display mb-4 text-lg font-black">المسارات</h2>
          <ul className="space-y-1">
            {tracks.map((track) => (
              <li key={track.id}>
                <Link href={`/#f-${track.id}`} className={linkClass}>
                  {track.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="الكورسات">
          <h2 className="font-display mb-4 text-lg font-black">الكورسات</h2>
          <ul className="space-y-1">
            {courses.map((course) => (
              <li key={course.slug}>
                <Link href={`/courses/${course.slug}`} className="block py-1.5 text-sm text-muted hover:text-accent">
                  {course.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="روابط مهمة">
          <h2 className="font-display mb-4 text-lg font-black">روابط</h2>
          <ul className="space-y-1">
            <li>
              <Link href="/#how" className={linkClass}>
                إزاي بتشتغل
              </Link>
            </li>
            <li>
              <Link href="/#instructor" className={linkClass}>
                المدرّب
              </Link>
            </li>
            <li>
              <Link href="/#faq" className={linkClass}>
                الأسئلة الشائعة
              </Link>
            </li>
            <li>
              <a href="https://remonromany.com" rel="noopener" className={linkClass}>
                موقع ريمون رومانى
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-line px-5 py-4 text-sm text-muted md:px-8">
        <p>© 2026 أكاديمية ريمون · Remon Romany</p>
        <nav aria-label="روابط قانونية" className="flex flex-wrap">
          {[
            { href: "/about", label: "من نحن" },
            { href: "/terms", label: "شروط الاستخدام" },
            { href: "/privacy", label: "الخصوصية" },
            { href: "/refund", label: "الاسترجاع" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="flex min-h-11 items-center px-3 hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
