import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";

export function PageFrame({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <>
      <SiteHeader />
      <main className={`mx-auto min-h-[70vh] px-5 pt-28 pb-20 md:px-8 ${wide ? "max-w-5xl" : "max-w-xl"}`}>{children}</main>
      <SiteFooter />
    </>
  );
}
