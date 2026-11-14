import type { CSSProperties, ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** ترتيب العنصر في المجموعة، بيأخّر ظهوره شوية لعمل تتابع. */
  delay?: number;
  as?: ElementType;
};

/**
 * ظهور عند التمرير بـ CSS فقط (scroll-driven animation).
 * من غير JS، والمحتوى ظاهر في الـ HTML. المتصفحات اللي مش بتدعمها بتعرض المحتوى عادي.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const style: CSSProperties = { "--i": Math.round(delay / 60) } as CSSProperties;
  return (
    <Tag data-reveal="" className={className} style={style}>
      {children}
    </Tag>
  );
}
