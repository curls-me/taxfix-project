"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRODUCT_NAME } from "@/lib/config";

const ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Account", href: "/account" },
  { label: "Pricing", href: "/pricing" },
];

export default function Nav() {
  const pathname = usePathname();
  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="bg-bar">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-bold text-forest">
          {PRODUCT_NAME}
        </Link>
        <nav aria-label="Main">
          <ul className="flex text-sm font-medium sm:gap-4 sm:text-base">
            {ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className={`block rounded-lg px-2 py-2 sm:px-3 ${
                    isCurrent(item.href)
                      ? "bg-lime-soft font-semibold text-forest"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
