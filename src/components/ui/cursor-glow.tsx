"use client";

import { useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useEffect } from "react";

/** وهج أخضر بيتبع الماوس على الشاشات الكبيرة فقط. */
export function CursorGlow() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 110, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 110, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    function move(event: PointerEvent) {
      x.set(event.clientX - 160);
      y.set(event.clientY - 160);
    }
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, x, y]);

  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-10 hidden h-80 w-80 rounded-full bg-accent opacity-[0.14] blur-3xl md:block"
      style={{ x: springX, y: springY }}
    />
  );
}
