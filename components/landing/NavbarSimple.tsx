"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NavbarSimple() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              FormBuilder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button variant="ghost">
                Se connecter
              </Button>
            </Link>
            <Link href="/signup">
              <Button>
                S'inscrire gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

