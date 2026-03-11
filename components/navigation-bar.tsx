"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart3, TrendingUp, Info } from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  match?: (pathname: string) => boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home, match: (p) => p === "/" },
  { href: "/compare", label: "Compare", icon: BarChart3 },
  { href: "/trends", label: "Trend", icon: TrendingUp, match: (p) => p.startsWith("/trends") },
  { href: "/information", label: "Information", icon: Info },
]

export function NavigationBar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex items-center gap-1 rounded-xl bg-sky-50 p-1.5 border border-sky-100",
        className,
      )}
      aria-label="Primary"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.match ? item.match(pathname) : pathname.startsWith(item.href)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 px-4 py-2.5 rounded-lg font-semibold text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
              isActive
                ? "text-sky-900 bg-white shadow-sm border border-sky-100"
                : "text-sky-800 hover:bg-sky-100",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

