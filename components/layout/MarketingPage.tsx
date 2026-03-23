import type { ReactNode } from "react";
import { AmbientBackdrop } from "./AmbientBackdrop";
import { SiteFooter } from "./SiteFooter";
import { SiteNav } from "./SiteNav";
import { ThemedWebGLHero } from "@/components/webgl/ThemedWebGLHero";
import type { PageAmbientVariant } from "@/components/webgl/page-ambient-webgl";

type Props = {
  variant: PageAmbientVariant;
  children: ReactNode;
};

export function MarketingPage({ variant, children }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#09090b]">
      <AmbientBackdrop />

      <SiteNav />
      <ThemedWebGLHero variant={variant} />

      <main className="relative z-10 flex flex-1 flex-col pt-28">
        <div className="flex-1">{children}</div>
        <SiteFooter variant="compact" />
      </main>
    </div>
  );
}
