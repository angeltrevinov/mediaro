import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MovieCard } from "@/components/movie-card/movie-card"
import type { Movie } from "@/schemas/movies/movies"

const movie: Movie = {
  id: 1,
  title: "The Matrix",
  overview: "A computer hacker learns about the true nature of reality.",
  release_date: "1999-03-31",
  poster_path: "https://image.tmdb.org/t/p/w342/matrix.jpg",
  backdrop_path: null,
}

describe("MovieCard", () => {
  it("renders the movie details and poster", () => {
    render(<MovieCard movie={movie} />)

    expect(screen.getByText("The Matrix")).toBeInTheDocument()
    expect(screen.getByText("1999-03-31")).toBeInTheDocument()
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

  it("uses a placeholder poster and fallback text when details are absent", () => {
    render(
      <MovieCard
        movie={{
          id: 2,
          title: "Untitled",
          overview: null,
          release_date: null,
          poster_path: null,
          backdrop_path: null,
        }}
      />
    )

    expect(screen.getByRole("img", { name: "Untitled" })).toHaveAttribute(
      "src",
      "/placeholder.png"
    )
    expect(screen.getByText("No overview available.")).toBeInTheDocument()
    expect(screen.queryByText("null")).not.toBeInTheDocument()
  })
})
