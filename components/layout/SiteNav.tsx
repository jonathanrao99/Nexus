"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LOGO_BG =
  "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/b304cbec-471a-4817-b8b1-9d33a6c6b1cf_320w.png";

const links = [
  { href: "/features", label: "Features" },
  { href: "/architecture", label: "Architecture" },
  { href: "/network", label: "Network" },
  { href: "/pricing", label: "Pricing" },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 items-center justify-between rounded-full px-4 py-3 tactile-glass transition-transform duration-500 hover:translate-y-[-2px]">
      <div className="flex items-center gap-8 pl-2">
        <Link
          href="/"
          className="flex items-center gap-2 bg-cover bg-center px-10 py-5 text-lg font-normal tracking-tight text-zinc-100"
          style={{ backgroundImage: `url(${LOGO_BG})` }}
          aria-label="Nexus home"
        />
        <div className="hidden gap-6 md:flex">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-normal transition-colors ${
                  active ? "text-zinc-100" : "text-zinc-400 hover:text-zinc-100"
                }`}
                {...(active ? { "aria-current": "page" as const } : {})}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="hidden px-3 text-sm font-normal text-zinc-400 transition-colors hover:text-zinc-100 md:block"
        >
          Log in
        </Link>
        <Link
          href="/pricing"
          className="btn-physical-light rounded-full px-5 py-2 text-sm font-normal"
        >
          Deploy Core
        </Link>
      </div>
    </nav>
  );
}
