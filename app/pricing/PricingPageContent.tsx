"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

export function PricingPageContent() {
  const [monthly, setMonthly] = useState(false);

  return (
    <>
      <section className="border-b border-zinc-900/50 px-4 pb-16 pt-12 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-normal uppercase tracking-widest text-zinc-500">
          Hardware access
        </p>
        <h1 className="mt-4 text-3xl font-normal tracking-tight text-zinc-100 sm:text-5xl">
          Transparent layers
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-400">
          Calmer WebGL backdrop, same physical pricing logic—toggle billing cadence like the
          home page.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <span
            className={`font-mono text-sm uppercase tracking-widest transition-colors ${
              !monthly ? "text-zinc-100" : "text-zinc-500"
            }`}
          >
            Hourly
          </span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={monthly}
              onChange={(e) => setMonthly(e.target.checked)}
            />
            <div className="h-7 w-14 rounded-full border border-zinc-700 bg-[#0a0a0c] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] transition-colors peer-checked:border-indigo-500/50" />
            <div className="absolute left-1 top-1 h-5 w-5 rounded-full border border-zinc-400 bg-gradient-to-b from-zinc-300 to-zinc-500 shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 peer-checked:translate-x-7 peer-checked:border-indigo-300 peer-checked:from-indigo-400 peer-checked:to-indigo-600" />
          </label>
          <span
            className={`font-mono text-sm uppercase tracking-widest transition-colors ${
              monthly ? "text-zinc-100" : "text-zinc-500"
            }`}
          >
            Monthly
          </span>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <div className="tactile-base flex flex-col rounded-3xl border border-zinc-800/80 p-8">
            <h2 className="text-lg font-normal text-zinc-300">Shared Core</h2>
            <div className="mt-4 flex items-baseline text-5xl font-normal tracking-tight text-zinc-100">
              {monthly ? "$499" : "$0.85"}
              <span className="ml-1 font-mono text-sm tracking-widest text-zinc-500">
                {monthly ? "/ MO" : "/ HR"}
              </span>
            </div>
            <p className="mt-4 text-sm text-zinc-400">
              Fractional access to A100/H100 clusters—ideal for bursty inference.
            </p>
            <ul className="mt-8 flex-1 space-y-3 text-sm text-zinc-300">
              {[
                "Auto-scaling multi-tenant GPUs",
                "NVMe vector caching (100GB)",
                "Standard network SLA",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="btn-physical-dark mt-8 w-full rounded-xl py-3 text-center text-sm font-normal text-zinc-300"
            >
              Initialize Shared
            </a>
          </div>

          <div className="tactile-glass relative flex flex-col overflow-hidden rounded-3xl border border-indigo-500/30 p-8 shadow-[0_0_40px_rgba(99,102,241,0.1)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
            <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded border border-indigo-900/50 bg-indigo-950/30 px-2 py-1 shadow-inner">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400">
                Maximum power
              </span>
            </div>
            <h2 className="text-lg font-normal text-zinc-100">Dedicated Metal</h2>
            <div className="mt-4 flex items-baseline text-5xl font-normal tracking-tight text-white drop-shadow-lg">
              {monthly ? "$2,499" : "$4.20"}
              <span className="ml-1 font-mono text-sm tracking-widest text-zinc-400">
                {monthly ? "/ MO" : "/ HR"}
              </span>
            </div>
            <p className="mt-4 text-sm text-zinc-400">
              Exclusive hardware with total isolation for peak inference.
            </p>
            <ul className="relative z-10 mt-8 flex-1 space-y-3 text-sm text-zinc-200">
              {[
                "Bare-metal H100 SXM5 allocation",
                "Terabyte-scale local NVMe cache",
                "Secure enclave processing",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="btn-physical-light relative z-10 mt-8 w-full rounded-xl py-3 text-center text-sm font-normal text-zinc-900"
            >
              Deploy Dedicated Core
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-zinc-500">
          Need a custom contract? Talk to solutions after you pick a layer.
        </p>
        <Link
          href="/"
          className="btn-physical-dark mt-6 inline-block rounded-full px-8 py-3 text-sm font-normal text-zinc-300"
        >
          Back to overview
        </Link>
      </section>
    </>
  );
}
