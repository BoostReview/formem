import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
      <div className="space-y-8">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 border rounded-[14px] space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>

        {/* Liste */}
        <div className="space-y-4">
          <Skeleton className="h-7 w-48" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-[14px]" />
            ))}
          </div>
        </div>
      </div>
  )
}

