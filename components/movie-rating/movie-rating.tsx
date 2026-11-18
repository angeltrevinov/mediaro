import { StarIcon } from "lucide-react"

type MovieRatingProps = {
  voteAverage?: number | null
  voteCount?: number | null
}

export function MovieRating({ voteAverage, voteCount }: MovieRatingProps) {
  if (!voteCount || voteAverage == null) return null

  return (
    <div className="flex items-center justify-center gap-1.5 text-sm md:justify-start">
      <StarIcon className="fill-current" aria-hidden="true" />
      <span className="font-medium">{voteAverage.toFixed(1)}</span>
      <span className="text-muted-foreground">
        ({voteCount.toLocaleString("en-US")} votes)
      </span>
    </div>
  )
}
