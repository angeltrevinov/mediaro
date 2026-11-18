import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MoviePoster } from "@/components/movie-poster/movie-poster"

describe("MoviePoster", () => {
  it("renders the poster image", () => {
    render(<MoviePoster src="https://image.tmdb.org/p.jpg" title="The Matrix" />)

    expect(screen.getByRole("img", { name: "The Matrix" })).toHaveAttribute(
      "src",
      "https://image.tmdb.org/p.jpg"
    )
  })

  it("renders an accessible fallback without a source", () => {
    render(<MoviePoster src={null} title="The Matrix" />)

    const fallback = screen.getByRole("img", { name: "The Matrix" })
    expect(fallback).not.toHaveAttribute("src")
  })
})
