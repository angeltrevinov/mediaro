import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import Page from "@/app/discover/movies/page"
import { discoverMovies } from "@/services/movies"

const { push } = vi.hoisted(() => ({ push: vi.fn() }))

vi.mock("@/services/movies", () => ({
  discoverMovies: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}))

const movieResult = {
  page: 2,
  results: [
    {
      id: 1,
      title: "The Matrix",
      overview: "A computer hacker discovers the truth.",
      release_date: "1999-03-31",
      poster_path: "https://image.tmdb.org/t/p/w342/matrix.jpg",
      backdrop_path: null,
    },
  ],
  total_pages: 5,
  total_results: 100,
}

describe("movie discovery page", () => {
  beforeEach(() => {
    vi.mocked(discoverMovies).mockReset()
    push.mockClear()
  })

  it("shows the initial state without searching when no query is supplied", async () => {
    render(
      await Page({
        searchParams: Promise.resolve({}),
      })
    )

    expect(screen.getByRole("heading", { name: "Discover Movies" }))
      .toBeInTheDocument()
    expect(
      screen.getByText("Enter a movie name to search for it and add it to your list.")
    ).toBeInTheDocument()
    expect(discoverMovies).not.toHaveBeenCalled()
  })

  it("renders results and pagination for the requested query and page", async () => {
    vi.mocked(discoverMovies).mockResolvedValue(movieResult)

    render(
      await Page({
        searchParams: Promise.resolve({
          query: "Rock & Roll",
          page: "2",
        }),
      })
    )

    expect(discoverMovies).toHaveBeenCalledWith("Rock & Roll", 2)
    expect(screen.getByText('Found 100 Results for "Rock & Roll"'))
      .toBeInTheDocument()
    expect(screen.getByText("The Matrix")).toBeInTheDocument()

    const pagination = screen.getByRole("navigation", { name: "pagination" })
    const nextLink = pagination.querySelector<HTMLAnchorElement>(
      'a[aria-label="Go to next page"]'
    )
    expect(nextLink).not.toBeNull()
    const nextUrl = new URL(nextLink!.href)
    expect(nextUrl.searchParams.get("query")).toBe("Rock & Roll")
    expect(nextUrl.searchParams.get("page")).toBe("3")
  })

  it("shows the empty-results state for a query with no matches", async () => {
    vi.mocked(discoverMovies).mockResolvedValue({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    })

    render(
      await Page({
        searchParams: Promise.resolve({ query: "No matching title" }),
      })
    )

    expect(
      screen.getByText('No movies found for "No matching title".')
    ).toBeInTheDocument()
    expect(screen.queryByRole("navigation", { name: "pagination" }))
      .not.toBeInTheDocument()
  })

  it("shows a fetch error instead of an empty-results message when search fails", async () => {
    vi.mocked(discoverMovies).mockRejectedValue(new Error("TMDB unavailable"))

    render(
      await Page({
        searchParams: Promise.resolve({ query: "The Matrix" }),
      })
    )

    expect(
      screen.getByText("Failed to fetch movie search results")
    ).toBeInTheDocument()
    expect(screen.queryByText('No movies found for "The Matrix".'))
      .not.toBeInTheDocument()
  })
})
