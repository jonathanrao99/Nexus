"use client";

import { useEffect } from "react";
import { AmbientBackdrop } from "@/components/layout/AmbientBackdrop";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { ThemedWebGLHero } from "@/components/webgl/ThemedWebGLHero";
import { initScrollAnimate } from "@/lib/scroll-animations";
import { FEATURES_BODY_HTML } from "@/lib/features-body-html";
import { startLucideIconPoll } from "@/lib/poll-lucide";

export function FeaturesClient() {
  useEffect(() => {
    const disposeScroll = initScrollAnimate();

    const stopLucidePoll = startLucideIconPoll();

    return () => {
      stopLucidePoll();
      disposeScroll();
    };
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#09090b]">
      <AmbientBackdrop />
      <SiteNav />
      <ThemedWebGLHero variant="features" />
      <div className="relative z-10 flex flex-1 flex-col pt-28">
        <div
          className="flex-1"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: FEATURES_BODY_HTML }}
        />
        <SiteFooter variant="compact" />
      </div>
    </div>
  );
}
