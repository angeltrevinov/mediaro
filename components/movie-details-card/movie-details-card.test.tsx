import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MovieDetailsCard } from "@/components/movie-details-card/movie-details-card"
import type { Movie } from "@/schemas/movies/movies"

const movie: Movie = {
  tmdb_id: "603",
  title: "The Matrix",
  original_title: "The Matrix",
  original_language: "en",
  origin_country: ["US", "AU"],
  imdb_id: "tt0133093",
  popularity: 80.54,
}

describe("MovieDetailsCard", () => {
  it("renders every available detail", () => {
    render(<MovieDetailsCard movie={movie} />)

    expect(screen.getByText("Details")).toBeInTheDocument()
    expect(screen.getByText("The Matrix")).toBeInTheDocument()
    expect(screen.getByText("EN")).toBeInTheDocument()
    expect(screen.getByText("US, AU")).toBeInTheDocument()
    expect(screen.getByText("80.5")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "tt0133093" })).toHaveAttribute(
      "href",
      "https://www.imdb.com/title/tt0133093"
    )
  })

  it("skips missing details", () => {
    render(
      <MovieDetailsCard
        movie={{ tmdb_id: "1", title: "Untitled", original_language: "es" }}
      />
    )

    expect(screen.getByText("Original language")).toBeInTheDocument()
    expect(screen.queryByText("IMDb")).not.toBeInTheDocument()
    expect(screen.queryByText("Popularity")).not.toBeInTheDocument()
  })

  it("renders nothing when there are no details", () => {
    const { container } = render(
      <MovieDetailsCard movie={{ tmdb_id: "1", title: "Untitled" }} />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
