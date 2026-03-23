import type { Metadata } from "next";
import Link from "next/link";
import { Globe2, Radio, Satellite, Share2, Zap } from "lucide-react";
import { MarketingPage } from "@/components/layout/MarketingPage";

export const metadata: Metadata = {
  title: "Network — Nexus AI Platform",
  description:
    "Global edge presence, redundant paths, and predictable tail latency for inference.",
};

export default function NetworkPage() {
  return (
    <MarketingPage variant="network">
      <section className="border-b border-zinc-900/50 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-normal uppercase tracking-widest text-zinc-500">
            Global fabric
          </p>
          <h1 className="mt-4 text-3xl font-normal tracking-tight text-zinc-100 sm:text-5xl">
            Network that keeps nodes in phase
          </h1>
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            The WebGL field on this page adds an emerald node ring—mirroring how regions
            negotiate paths while your traffic stays on private backbones.
          </p>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {[
            {
              icon: Globe2,
              title: "Anycast ingress",
              body: "Steer users to the nearest healthy edge POP with automatic drain on faults.",
            },
            {
              icon: Satellite,
              title: "Private interconnects",
              body: "Dedicated waves between regions—no public internet for tensor or weight sync.",
            },
            {
              icon: Radio,
              title: "Telemetry mesh",
              body: "Sub-second visibility into queue depth, NIC drops, and GPU thermal headroom.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="tactile-base rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl tactile-inset border border-zinc-800/50">
                <Icon className="h-6 w-6 text-emerald-400/90" strokeWidth={1.25} />
              </div>
              <h2 className="text-lg font-normal tracking-tight text-zinc-100">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-900/60 bg-[#0a0a0c] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-normal tracking-tight text-zinc-100">
              Multi-region without multi-copy chaos
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Sticky sessions when you need them, stateless burst when you don&apos;t. Route
              tables are versioned alongside model revisions so rollbacks never strand traffic.
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-6 tactile-inset">
            {[
              "Automatic failover with quorum-aware DNS",
              "Packet pacing tuned for RoCE and TCP inference",
              "Per-tenant circuit breakers on noisy neighbors",
            ].map((line) => (
              <div key={line} className="flex items-start gap-3 text-sm text-zinc-300">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                {line}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
          <Share2 className="h-8 w-8 text-zinc-600" strokeWidth={1} />
          <p className="text-sm text-zinc-500">
            Pair this view with the command center on the home page for live maps and logs.
          </p>
          <Link
            href="/"
            className="btn-physical-light rounded-full px-8 py-3 text-sm font-normal"
          >
            Return home
          </Link>
        </div>
      </section>
    </MarketingPage>
  );
}
