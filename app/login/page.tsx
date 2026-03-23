import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";

export const metadata: Metadata = {
  title: "Log in — Nexus AI Platform",
  description: "Access the Nexus control plane.",
};

export default function LoginPage() {
  return (
    <MarketingPage variant="features">
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 pb-24 pt-16 sm:px-6">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800/80 bg-[#111113] p-8 tactile-base">
          <h1 className="text-center text-2xl font-normal tracking-tight text-zinc-100">
            Sign in
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Console access is invite-only during early availability.
          </p>
          <div className="mt-8 space-y-4">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500">
              Email
              <input
                type="email"
                autoComplete="email"
                className="mt-2 w-full rounded-lg border border-zinc-800 bg-[#0a0a0c] px-4 py-3 text-sm text-zinc-200 outline-none ring-indigo-500/0 transition focus:ring-2 focus:ring-indigo-500/40"
                placeholder="you@company.com"
              />
            </label>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500">
              Access key
              <input
                type="password"
                autoComplete="current-password"
                className="mt-2 w-full rounded-lg border border-zinc-800 bg-[#0a0a0c] px-4 py-3 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/40"
                placeholder="••••••••"
              />
            </label>
            <button
              type="button"
              className="btn-physical-light w-full rounded-xl py-3 text-sm font-normal"
            >
              Continue
            </button>
          </div>
          <p className="mt-6 text-center text-xs text-zinc-600">
            By continuing you agree to operational policies for bare-metal access.
          </p>
        </div>
        <Link
          href="/"
          className="mt-10 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          ← Back to home
        </Link>
      </section>
    </MarketingPage>
  );
}
