import { Badge } from "@/components/ui/badge"
import { formatRuntime, getYear } from "./format"

type MovieMetaProps = {
  releaseDate?: string | null
  runtime?: number | null
  status?: string | null
}

export function MovieMeta({ releaseDate, runtime, status }: MovieMetaProps) {
  const items = [getYear(releaseDate), formatRuntime(runtime)].filter(
    (item): item is string => item !== null
  )

  if (items.length === 0 && !status) return null

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground md:justify-start">
      {items.map((item, index) => (
        <span key={item} className="flex items-center gap-2">
          {index > 0 && <span aria-hidden="true">•</span>}
          {item}
        </span>
      ))}
      {status && <Badge variant="secondary">{status}</Badge>}
    </div>
  )
}
