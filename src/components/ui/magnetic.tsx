"use client";

import { useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import type { MouseEvent, ReactNode } from "react";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  href: string;
};

/** زرار بيتحرك ناحية الماوس. على اللمس والـ reduced-motion بيشتغل كلينك عادي. */
export function Magnetic({ children, className, href }: MagneticProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });

  function onMove(event: MouseEvent<HTMLAnchorElement>) {
    if (reduce) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.4);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.a
      href={href}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </m.a>
  );
}
