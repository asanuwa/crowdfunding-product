"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="rounded-md font-[var(--font-display)] text-xl tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
            aria-current={pathname === "/" ? "page" : undefined}
          >
            CrowdForge
          </Link>
          <div aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
