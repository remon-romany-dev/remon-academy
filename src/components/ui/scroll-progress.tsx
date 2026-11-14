/** شريط تقدّم التمرير أعلى الصفحة (CSS فقط). */
export function ScrollProgress() {
  return <div aria-hidden className="scroll-progress fixed inset-x-0 top-0 z-[60] h-[3px] origin-right bg-accent" />;
}
