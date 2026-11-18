import { MovieMeta } from "@/components/movie-meta/movie-meta"
import { MoviePoster } from "@/components/movie-poster/movie-poster"
import { MovieRating } from "@/components/movie-rating/movie-rating"
import type { Movie } from "@/schemas/movies/movies"

export function MovieHeader({ movie }: { movie: Movie }) {
  return (
    <header className="relative overflow-hidden rounded-xl bg-muted">
      {movie.backdrop_path && (
        <img
          src={movie.backdrop_path}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/40" />
      <div className="relative flex flex-col items-center gap-6 p-4 pt-10 sm:p-6 sm:pt-16 md:flex-row md:items-end md:gap-8 md:p-8 md:pt-24">
        <MoviePoster
          src={movie.poster_path}
          title={movie.title}
          className="w-40 shrink-0 sm:w-48 md:w-56 lg:w-64"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-3 text-center md:text-left">
          <h1 className="text-2xl font-bold md:text-4xl">{movie.title}</h1>
          <MovieMeta
            releaseDate={movie.release_date}
            runtime={movie.runtime}
            status={movie.status}
          />
          <MovieRating
            voteAverage={movie.vote_average}
            voteCount={movie.vote_count}
          />
          <p className="text-sm text-muted-foreground md:text-base">
            {movie.overview ? movie.overview : "No overview available."}
          </p>
        </div>
      </div>
    </header>
  )
}
