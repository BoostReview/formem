"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Settings,
  Menu,
  X,
  Plus,
  Search,
  User,
  LogOut,
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
import { Separator } from "@/components/ui/separator"
import { FadeIn } from "@/components/animations/FadeIn"
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
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SidebarContent pathname={pathname} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Search bar (optionnel) */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Rechercher..."
                className="w-full rounded-[14px] border border-input bg-background pl-9 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-x-2">
            {/* Notifications */}
            <NotificationsDropdown />

            {/* New form button */}
            <Button asChild>
              <Link href="/dashboard/forms/new">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau formulaire
              </Link>
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  suppressHydrationWarning
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Menu utilisateur</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <LogoutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <FadeIn>{children}</FadeIn>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full w-full flex-col gap-y-5 border-r bg-background px-6 pb-4">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <FileText className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Form Builder</h1>
          <p className="text-xs text-muted-foreground">SaaS</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-1">
          {navigation.map((item) => {
            // Amélioration de la logique : pour éviter que /dashboard soit actif sur /dashboard/forms
            // On vérifie d'abord si c'est un match exact, puis si le pathname commence par l'href + "/"
            // Mais pour /dashboard, on ne veut l'activer QUE si on est exactement sur /dashboard
            const isExactMatch = pathname === item.href
            const isChildPath = item.href !== "/dashboard" && pathname.startsWith(item.href + "/")
            const isActive = isExactMatch || isChildPath
            const Icon = item.icon

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex gap-x-3 rounded-[14px] px-3 py-2 text-sm font-semibold leading-6 transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 shrink-0",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4">
        <Separator className="mb-4" />
        <p className="text-xs text-muted-foreground">
          © 2024 Form Builder
        </p>
      </div>
    </div>
  )
}

