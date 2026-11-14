"use client";

import { useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import * as m from "motion/react-m";
import type { CSSProperties, PointerEvent, ReactNode } from "react";

type LayerProps = {
  depth: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  className: string;
  children: ReactNode;
};

function Layer({ depth, mx, my, className, children }: LayerProps) {
  const x = useSpring(useTransform(mx, [-0.5, 0.5], [-depth, depth]), { stiffness: 90, damping: 18 });
  const y = useSpring(useTransform(my, [-0.5, 0.5], [-depth, depth]), { stiffness: 90, damping: 18 });
  return (
    <m.div style={{ x, y }} className={className}>
      {children}
    </m.div>
  );
}

const hue = (value: number): CSSProperties => ({ "--h": value }) as CSSProperties;
const delay = (value: string): CSSProperties => ({ "--t": value }) as CSSProperties;

const chip =
  "tc flex items-center gap-2.5 rounded-2xl border border-[var(--tc-line)] bg-surface px-4 py-2.5 shadow-xl";

export function HeroStage() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse") {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative mx-auto h-[440px] w-full max-w-[420px] sm:h-[500px] sm:max-w-[560px] lg:h-[560px]"
      role="img"
      aria-label="معاينة لدرس داخل أكاديمية ريمون: محرر كود، شريط تقدّم، وشهادة إتمام"
    >
      <div aria-hidden className="absolute inset-10 rounded-full bg-accent/20 blur-3xl" />

      <Layer depth={14} mx={mx} my={my} className="absolute inset-x-[4%] top-[15%] sm:inset-x-[8%]">
        <div className="overflow-hidden rounded-3xl border border-line bg-surface/90 shadow-[0_30px_80px_-20px_oklch(0.05_0.02_150)]">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex gap-1.5" aria-hidden>
              <span className="size-3 rounded-full bg-[oklch(0.7_0.2_25)]" />
              <span className="size-3 rounded-full bg-[oklch(0.85_0.17_90)]" />
              <span className="size-3 rounded-full bg-accent" />
            </div>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-ink">
              الدرس 01 · مجاني
            </span>
          </div>
          <div dir="ltr" className="space-y-2 p-4 font-mono text-[12px] leading-6 sm:p-5 sm:text-[13px] sm:leading-7">
            <span className="type text-accent" style={delay("0s")}>
              const lesson = open(&quot;react&quot;);
            </span>
            <span className="type text-foreground" style={delay("0.9s")}>
              if (lesson.free) play();
            </span>
            <span className="type text-muted" style={delay("1.8s")}>
              {"// learn by building"}
            </span>
            <span className="type text-[oklch(0.85_0.16_90)]" style={delay("2.7s")}>
              deploy(project); <span className="caret text-accent">▍</span>
            </span>
          </div>
          <div className="flex items-center gap-3 border-t border-line px-4 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent" aria-hidden>
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                <path d="M1 1.2v11.6a.6.6 0 0 0 .9.5l9.2-5.8a.6.6 0 0 0 0-1L1.9.7A.6.6 0 0 0 1 1.2z" fill="var(--accent-ink)" />
              </svg>
            </span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line" aria-hidden>
              <span className="progress-fill block h-full origin-right rounded-full bg-accent" />
            </span>
            <span className="font-mono text-xs text-muted">12:40</span>
          </div>
        </div>
      </Layer>

      <Layer depth={30} mx={mx} my={my} className="absolute -top-1 end-0 sm:top-[2%]">
        <div className={`float-slow ${chip}`} style={hue(145)}>
          <span className="font-mono text-sm font-medium text-[var(--tc)]">{"</>"}</span>
          <span className="text-sm font-bold">React</span>
        </div>
      </Layer>

      <Layer depth={24} mx={mx} my={my} className="absolute top-[4%] start-0 sm:top-[12%]">
        <div className={`float-slower ${chip}`} style={hue(345)}>
          <span className="flex" aria-hidden>
            <span className="size-4 rounded-full bg-[var(--tc)]" />
            <span className="-ms-1.5 size-4 rounded-full bg-[var(--tc)] opacity-60" />
            <span className="-ms-1.5 size-4 rounded-full bg-[var(--tc)] opacity-30" />
          </span>
          <span className="text-sm font-bold">Figma</span>
        </div>
      </Layer>

      <Layer depth={36} mx={mx} my={my} className="absolute end-[-2%] bottom-[3%] sm:bottom-[14%]">
        <div className={`float-slower ${chip}`} style={hue(70)}>
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
            <path d="M1 14l6-6 4 4 9-10M14 2h6v6" stroke="var(--tc)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-bold">تسويق</span>
        </div>
      </Layer>

      <Layer depth={20} mx={mx} my={my} className="absolute start-[-1%] bottom-[3%] sm:bottom-[6%]">
        <div className={`float-slow ${chip}`} style={hue(255)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--tc)" aria-hidden>
            <path d="M12 1l2.6 7.4L22 11l-7.4 2.6L12 21l-2.6-7.4L2 11l7.4-2.6z" />
          </svg>
          <span className="text-sm font-bold">ذكاء اصطناعي</span>
        </div>
      </Layer>

      <Layer depth={44} mx={mx} my={my} className="absolute inset-x-0 bottom-0 hidden justify-center sm:flex">
        <div className="float-slow flex items-center gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3 shadow-2xl">
          <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-ink" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>
            <span className="block text-sm leading-tight font-bold">شهادة إتمام</span>
            <span className="block text-xs text-muted">بعد ما تخلص مشروعك</span>
          </span>
        </div>
      </Layer>
    </div>
  );
}
