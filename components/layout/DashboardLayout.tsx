"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Settings,
  Menu,
  Search,
  User,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutButton } from "@/components/dashboard/LogoutButton"
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown"
import { Toaster } from "@/components/ui/toaster"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Formulaires",
    href: "/dashboard/forms",
    icon: FileText,
  },
  {
    name: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F]">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[240px] p-0 border-black/5 dark:border-white/5">
          <SidebarContent pathname={pathname} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-60 lg:flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Main content */}
      <div className="lg:pl-60">
        {/* Top header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-black/5 dark:border-white/5 bg-[#FAFAFA]/80 dark:bg-[#0F0F0F]/80 backdrop-blur-sm px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search bar */}
          <div className="flex flex-1 gap-x-4 self-stretch">
            <div className="relative flex flex-1 items-center max-w-md">
              <Search className="absolute left-3 h-4 w-4 text-black/40 dark:text-white/40" />
              <input
                type="search"
                placeholder="Rechercher..."
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 pl-9 pr-4 py-2 text-sm text-black/90 dark:text-white/90 placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-black/20 dark:focus:border-white/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-x-2">
            {/* Notifications */}
            <NotificationsDropdown />

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                  suppressHydrationWarning
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-black/10 dark:border-white/10">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-black/5 dark:bg-white/5" />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-black/5 dark:bg-white/5" />
                <LogoutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="py-8">
          <div className="px-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full w-full flex-col border-r border-black/5 dark:border-white/5 bg-white dark:bg-[#0F0F0F] px-4 py-6">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-[#A78BFA] to-[#EC4899] rounded-xl flex items-center justify-center">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-black/90 dark:text-white/90">Form Builder</h1>
          <p className="text-xs text-black/50 dark:text-white/50">SaaS</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-1">
          {navigation.map((item) => {
            const isExactMatch = pathname === item.href
            const isChildPath = item.href !== "/dashboard" && pathname.startsWith(item.href + "/")
            const isActive = isExactMatch || isChildPath
            const Icon = item.icon

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-black/5 dark:bg-white/5 text-black/90 dark:text-white/90"
                      : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black/90 dark:hover:text-white/90"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5">
        <p className="text-xs text-black/40 dark:text-white/40">
          © 2024 Form Builder
        </p>
      </div>
    </div>
  )
}
