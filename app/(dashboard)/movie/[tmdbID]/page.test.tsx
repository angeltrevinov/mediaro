import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import Page from "@/app/(dashboard)/movie/[tmdbID]/page"
import { TMDBNotFoundError } from "@/lib/tmdb/errors"
import { getMovieDetails } from "@/services/movies"

const { notFound } = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND")
  }),
}))

vi.mock("@/services/movies", () => ({
  getMovieDetails: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  notFound,
  useRouter: () => ({ back: vi.fn() }),
}))

const movie = {
  tmdb_id: "603",
  title: "The Matrix",
  overview: "A hacker discovers the truth.",
  release_date: "1999-03-31",
  poster_path: null,
  backdrop_path: null,
  original_title: "The Matrix",
  original_language: "en",
  origin_country: ["US"],
  imdb_id: "tt0133093",
  popularity: 80.5,
}

const params = (tmdbID: string) => Promise.resolve({ tmdbID })

describe("movie details page", () => {
  beforeEach(() => {
    vi.mocked(getMovieDetails).mockReset()
    notFound.mockClear()
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  it("renders the header and details", async () => {
    vi.mocked(getMovieDetails).mockResolvedValue(movie)

    render(await Page({ params: params("603") }))

    expect(getMovieDetails).toHaveBeenCalledWith("603")
    expect(
      screen.getByRole("heading", { level: 1, name: "The Matrix" })
    ).toBeInTheDocument()
    expect(screen.getByText("Original language")).toBeInTheDocument()
    expect(screen.getByText("EN")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "tt0133093" })).toHaveAttribute(
      "href",
      "https://www.imdb.com/title/tt0133093"
    )
  })

  it("shows an error message when fetching fails", async () => {
    vi.mocked(getMovieDetails).mockRejectedValue(new Error("boom"))

    render(await Page({ params: params("603") }))

    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
    expect(notFound).not.toHaveBeenCalled()
  })

  it("calls notFound when the movie does not exist", async () => {
    vi.mocked(getMovieDetails).mockRejectedValue(new TMDBNotFoundError())

    await expect(Page({ params: params("0") })).rejects.toThrow(
      "NEXT_NOT_FOUND"
    )
    expect(notFound).toHaveBeenCalled()
  })
})
