import { Skeleton } from "@/components/ui/skeleton"

export function MovieDetailsSkeleton() {
  return (
    <div
      className="container mx-auto flex flex-col gap-4"
      aria-busy="true"
      aria-label="Loading movie details"
    >
      <Skeleton className="h-9 w-32" />
      <div className="flex flex-col items-center gap-6 rounded-xl bg-muted p-4 pt-10 sm:p-6 sm:pt-16 md:flex-row md:items-end md:gap-8 md:p-8 md:pt-24">
        <Skeleton className="aspect-2/3 w-40 shrink-0 bg-background sm:w-48 md:w-56 lg:w-64" />
        <div className="flex w-full flex-1 flex-col items-center gap-3 md:items-start">
          <Skeleton className="h-8 w-3/4 bg-background md:h-10" />
          <Skeleton className="h-4 w-1/2 bg-background" />
          <Skeleton className="h-4 w-1/3 bg-background" />
          <Skeleton className="h-20 w-full bg-background" />
        </div>
      </div>
      <Skeleton className="h-40 w-full" />
    </div>
  )
}
