import type { ReactNode } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Movie } from "@/schemas/movies/movies"

type Detail = { label: string; value: ReactNode }

/**
 * Builds the list of details to show, skipping the ones the movie doesn't have
 */
export function buildDetails(movie: Movie): Detail[] {
  const details: { label: string; value: ReactNode | null | undefined }[] = [
    { label: "Original title", value: movie.original_title },
    { label: "Original language", value: movie.original_language?.toUpperCase() },
    { label: "Origin country", value: movie.origin_country?.join(", ") },
    {
      label: "IMDb",
      value: movie.imdb_id ? (
        <a
          href={`https://www.imdb.com/title/${movie.imdb_id}`}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          {movie.imdb_id}
        </a>
      ) : null,
    },
    { label: "Popularity", value: movie.popularity?.toFixed(1) },
  ]

  return details.filter(
    (detail): detail is Detail =>
      detail.value !== null && detail.value !== undefined && detail.value !== ""
  )
}

export function MovieDetailsCard({ movie }: { movie: Movie }) {
  const details = buildDetails(movie)

  if (details.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {details.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
