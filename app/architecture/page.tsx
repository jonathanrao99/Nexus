import type { Metadata } from "next";
import Link from "next/link";
import {
  Boxes,
  Cable,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Shield,
} from "lucide-react";
import { MarketingPage } from "@/components/layout/MarketingPage";

export const metadata: Metadata = {
  title: "Architecture — Nexus AI Platform",
  description:
    "Control plane, data plane, and hardware pipeline that power Nexus deployments.",
};

export default function ArchitecturePage() {
  return (
    <MarketingPage variant="architecture">
      <section className="border-b border-zinc-900/50 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-normal uppercase tracking-widest text-zinc-500">
            System design
          </p>
          <h1 className="mt-4 text-3xl font-normal tracking-tight text-zinc-100 sm:text-5xl">
            Architecture built for the data plane
          </h1>
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            Deterministic scheduling, signed artifacts, and bare-metal isolation—wired
            through the same tactile command surfaces as the home experience.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {[
            {
              icon: Layers,
              title: "Layered planes",
              body: "Separate control and data paths so policy updates never block inference hot paths.",
            },
            {
              icon: Cpu,
              title: "Hardware-aware scheduler",
              body: "Queues respect GPU memory topology, KV affinity, and preemption tiers per model.",
            },
            {
              icon: Shield,
              title: "Trust boundaries",
              body: "Enclaves, attested boot chains, and per-tenant crypto domains across regions.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="tactile-base flex flex-col rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl tactile-inset border border-zinc-800/50">
                <Icon className="h-6 w-6 text-zinc-300" strokeWidth={1.25} />
              </div>
              <h2 className="text-lg font-normal tracking-tight text-zinc-100">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-900/80 bg-[#0a0a0c] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="cmd-panel">
            <div className="cmd-panel-header border-b border-zinc-800/80">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                  Topology
                </p>
                <h2 className="mt-1 text-xl font-normal tracking-tight text-zinc-100">
                  Mesh control
                </h2>
              </div>
              <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-1 font-mono text-[10px] text-indigo-300">
                SYNC
              </span>
            </div>
            <div className="cmd-panel-body space-y-3 text-sm text-zinc-400">
              <p>
                Regional coordinators gossip desired state; workers pull signed bundles and
                converge without a single choke point.
              </p>
              <ul className="space-y-2 text-zinc-300">
                <li className="flex gap-2">
                  <GitBranch className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  Canary routes with automatic rollback on SLO breach
                </li>
                <li className="flex gap-2">
                  <Database className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  Durable checkpoints streamed to object storage
                </li>
              </ul>
            </div>
          </div>

          <div className="cmd-panel">
            <div className="cmd-panel-header border-b border-zinc-800/80">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                  Fabric
                </p>
                <h2 className="mt-1 text-xl font-normal tracking-tight text-zinc-100">
                  RDMA-ready paths
                </h2>
              </div>
              <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 font-mono text-[10px] text-emerald-300">
                LOW-RTT
              </span>
            </div>
            <div className="cmd-panel-body space-y-3 text-sm text-zinc-400">
              <p>
                High-radix NICs and NVSwitch meshes keep tensor parallel shards in lockstep
                without oversubscribing host memory.
              </p>
              <ul className="space-y-2 text-zinc-300">
                <li className="flex gap-2">
                  <Cable className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  Adaptive fragmentation for micro-batches
                </li>
                <li className="flex gap-2">
                  <Boxes className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  Rack-local caches warmed from registry manifests
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-zinc-500">
          Explore the live pipeline on the home page or jump to pricing.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="btn-physical-dark rounded-full px-8 py-3 text-sm font-normal text-zinc-300 transition-colors hover:text-white"
          >
            Back to overview
          </Link>
          <Link
            href="/pricing"
            className="btn-physical-light rounded-full px-8 py-3 text-sm font-normal"
          >
            View pricing
          </Link>
        </div>
      </section>
    </MarketingPage>
  );
}
