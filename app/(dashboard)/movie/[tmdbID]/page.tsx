import { notFound } from "next/navigation"
import { BackButton } from "@/components/back-button/back-button"
import { ErrorMessage } from "@/components/error-message/error-message"
import { MovieDetailsCard } from "@/components/movie-details-card/movie-details-card"
import { MovieHeader } from "@/components/movie-header/movie-header"
import { TMDBNotFoundError } from "@/lib/tmdb/errors"
import type { Movie } from "@/schemas/movies/movies"
import { getMovieDetails } from "@/services/movies"

type MoviePageParamsTypes = {
  tmdbID: string
}

export default async function MoviePage({
  params,
}: {
  params: Promise<MoviePageParamsTypes>
}) {
  const { tmdbID } = await params

  let movie: Movie | undefined
  let errorMessage: string | undefined
  let missing = false

  try {
    movie = await getMovieDetails(tmdbID)
  } catch (error) {
    if (error instanceof TMDBNotFoundError) {
      missing = true
    } else {
      console.error("Error fetching movie details:", error)
      errorMessage = "We couldn't load this movie. Please try again later."
    }
  }

  // notFound() throws, so it must be called outside the try/catch
  if (missing) return notFound();

  return (
    <div className="container mx-auto flex flex-col gap-4">
      <BackButton />
      {errorMessage || !movie ? (
        <ErrorMessage message={errorMessage ?? "Movie unavailable."} />
      ) : (
        <>
          <MovieHeader movie={movie} />
          <MovieDetailsCard movie={movie} />
        </>
      )}
    </div>
  )
}
