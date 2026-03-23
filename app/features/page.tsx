import type { Metadata } from "next";
import { FeaturesClient } from "@/components/features/FeaturesClient";

export const metadata: Metadata = {
  title: "Features — Nexus AI Platform",
  description: "Platform capabilities and infrastructure primitives for Nexus AI.",
};

export default function FeaturesPage() {
  return <FeaturesClient />;
}
