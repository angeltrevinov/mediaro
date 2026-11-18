import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MovieRating } from "@/components/movie-rating/movie-rating"

describe("MovieRating", () => {
  it("renders the average and vote count", () => {
    render(<MovieRating voteAverage={7.84} voteCount={12345} />)

    expect(screen.getByText("7.8")).toBeInTheDocument()
    expect(screen.getByText("(12,345 votes)")).toBeInTheDocument()
  })

  it("renders nothing without votes", () => {
    const { container } = render(
      <MovieRating voteAverage={0} voteCount={0} />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("renders nothing when values are null", () => {
    const { container } = render(
      <MovieRating voteAverage={null} voteCount={null} />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
