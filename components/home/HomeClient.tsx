"use client";

import { useEffect } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { initHeroWebGL } from "@/components/home/hero-webgl";
import { initPipelineReveal, initScrollAnimate } from "@/lib/scroll-animations";
import { HOME_BODY_HTML } from "@/lib/home-body-html";
import { startLucideIconPoll } from "@/lib/poll-lucide";

function togglePricing(): void {
  const toggle = document.getElementById(
    "pricing-toggle",
  ) as HTMLInputElement | null;
  if (!toggle) return;

  const isMonthly = toggle.checked;

  const sharedAmount = document.getElementById("price-shared-amount");
  const sharedPeriod = document.getElementById("price-shared-period");
  const dedicatedAmount = document.getElementById("price-dedicated-amount");
  const dedicatedPeriod = document.getElementById("price-dedicated-period");
  const labelHourly = document.getElementById("label-hourly");
  const labelMonthly = document.getElementById("label-monthly");

  if (sharedAmount) sharedAmount.innerText = isMonthly ? "$499" : "$0.85";
  if (sharedPeriod) sharedPeriod.innerText = isMonthly ? "/ MO" : "/ HR";
  if (dedicatedAmount) dedicatedAmount.innerText = isMonthly ? "$2,499" : "$4.20";
  if (dedicatedPeriod) dedicatedPeriod.innerText = isMonthly ? "/ MO" : "/ HR";

  if (labelHourly) {
    labelHourly.className = isMonthly
      ? "text-sm font-mono text-zinc-500 tracking-widest uppercase transition-colors"
      : "text-sm font-mono text-zinc-100 tracking-widest uppercase transition-colors";
  }
  if (labelMonthly) {
    labelMonthly.className = isMonthly
      ? "text-sm font-mono text-zinc-100 tracking-widest uppercase transition-colors"
      : "text-sm font-mono text-zinc-500 tracking-widest uppercase transition-colors";
  }
}

export function HomeClient() {
  useEffect(() => {
    const disposeHero = initHeroWebGL();
    const disposePipeline = initPipelineReveal();
    const disposeScroll = initScrollAnimate();

    const pricingToggle = document.getElementById("pricing-toggle");
    pricingToggle?.addEventListener("change", togglePricing);

    const stopLucidePoll = startLucideIconPoll();

    return () => {
      stopLucidePoll();
      pricingToggle?.removeEventListener("change", togglePricing);
      disposeHero();
      disposePipeline();
      disposeScroll();
    };
  }, []);

  return (
    <>
      <SiteNav />
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: HOME_BODY_HTML }}
      />
      <SiteFooter variant="full" />
    </>
  );
}
