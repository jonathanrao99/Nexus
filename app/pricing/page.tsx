import type { Metadata } from "next";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { PricingPageContent } from "./PricingPageContent";

export const metadata: Metadata = {
  title: "Pricing — Nexus AI Platform",
  description:
    "Hardware access layers with hourly or monthly billing for shared and dedicated GPUs.",
};

export default function PricingPage() {
  return (
    <MarketingPage variant="pricing">
      <PricingPageContent />
    </MarketingPage>
  );
}
