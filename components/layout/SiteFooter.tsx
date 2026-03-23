import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const GITHUB_PROFILE_URL = "https://github.com/jonathanrao99";

const quickLinks = [
  { href: "/", label: "Overview" },
  { href: "/features", label: "Features" },
  { href: "/architecture", label: "Architecture" },
  { href: "/network", label: "Network" },
  { href: "/pricing", label: "Pricing" },
] as const;

type Props = {
  /** Large marketing CTA — home page only. */
  variant?: "full" | "compact";
};

export function SiteFooter({ variant = "compact" }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={
        variant === "full"
          ? "relative overflow-hidden border-t border-zinc-900 bg-[#050505] pb-10"
          : "border-t border-zinc-900/50 bg-[#09090b]"
      }
    >
      {variant === "full" && (
        <>
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-full max-w-3xl -translate-x-1/2 bg-indigo-500/5 blur-[100px]" />
          <div className="relative z-10 mx-auto max-w-7xl scroll-animate px-4 pb-0 pt-24 text-center sm:px-6 lg:px-8">
            <div className="tactile-base mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-300 shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
              </div>
            </div>
            <h2 className="text-4xl font-normal tracking-tight text-zinc-100 sm:text-5xl">
              Initialize your first node.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
              Join leading AI teams deploying massive models on bare-metal infrastructure.
              Zero cold starts. Zero operational bloat.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/pricing"
                className="btn-physical-light inline-flex items-center gap-2 rounded-full px-8 py-3 text-base font-normal"
              >
                Start Deployment
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link
                href="/features"
                className="btn-physical-dark rounded-full px-8 py-3 text-base font-normal text-zinc-300 transition-colors hover:text-white"
              >
                Read Docs
              </Link>
            </div>
          </div>
        </>
      )}

      <div
        className={
          variant === "full"
            ? "mx-auto mt-32 flex max-w-7xl flex-col items-center justify-between gap-6 border-t border-zinc-900/50 px-4 pt-8 sm:px-6 md:flex-row lg:px-8"
            : "mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row lg:px-8"
        }
      >
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          All systems operational
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm font-normal text-zinc-500">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-300"
          >
            Twitter
          </a>
          <a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-300"
          >
            GitHub
          </a>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-300"
          >
            Discord
          </a>
          <a
            href="https://statuspage.io"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-300"
          >
            Status
          </a>
        </div>
        <div className="text-sm text-zinc-600">© {year} Nexus Architecture.</div>
      </div>

      {variant === "compact" && (
        <div className="mx-auto max-w-7xl border-t border-zinc-900/40 px-4 pb-12 pt-2 sm:px-6 lg:px-8">
          <nav
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-zinc-500"
            aria-label="Site"
          >
            {quickLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:text-zinc-300"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </footer>
  );
}
