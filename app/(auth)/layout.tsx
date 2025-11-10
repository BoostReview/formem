import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-slate-900">Form Builder</h1>
            <p className="text-sm text-slate-600 mt-1">
              Créateur de formulaires moderne
            </p>
          </Link>
        </div>
        {children}
      </div>
      <Toaster />
    </div>
  )
}





