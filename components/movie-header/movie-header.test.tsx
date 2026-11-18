import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MovieHeader } from "@/components/movie-header/movie-header"
import type { Movie } from "@/schemas/movies/movies"

const movie: Movie = {
  id: 1,
  tmdb_id: "603",
  title: "The Matrix",
  overview: "A computer hacker learns about the true nature of reality.",
  release_date: "1999-03-31",
  poster_path: "https://image.tmdb.org/t/p/w342/matrix.jpg",
  backdrop_path: "https://image.tmdb.org/t/p/w780/backdrop.jpg",
  runtime: 136,
  status: "Released",
  vote_average: 8.2,
  vote_count: 25000,
}

describe("MovieHeader", () => {
  it("renders the movie information", () => {
    render(<MovieHeader movie={movie} />)

    expect(
      screen.getByRole("heading", { level: 1, name: "The Matrix" })
    ).toBeInTheDocument()
    expect(screen.getByText("1999")).toBeInTheDocument()
    expect(screen.getByText("2h 16m")).toBeInTheDocument()
    expect(screen.getByText("Released")).toBeInTheDocument()
    expect(screen.getByText("8.2")).toBeInTheDocument()
    expect(
      screen.getByText(
        "A computer hacker learns about the true nature of reality."
      )
    ).toBeInTheDocument()
    expect(screen.getByRole("img", { name: "The Matrix" })).toHaveAttribute(
      "src",
      movie.poster_path
    )
  })

  it("handles missing optional data", () => {
    render(
      <MovieHeader
        movie={{
          tmdb_id: "1",
          title: "Untitled",
          overview: null,
          release_date: null,
          poster_path: null,
          backdrop_path: null,
          runtime: null,
          status: null,
          vote_average: null,
          vote_count: null,
        }}
      />
    )

    expect(screen.getByText("Untitled")).toBeInTheDocument()
    expect(screen.getByText("No overview available.")).toBeInTheDocument()
    expect(screen.queryByText("null")).not.toBeInTheDocument()
    expect(screen.getAllByRole("img")).toHaveLength(1)
  })
})
