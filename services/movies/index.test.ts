import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { searchMovie } from "@/lib/tmdb"
import { discoverMovies } from "@/services/movies"

vi.mock("@/lib/tmdb", () => ({
  searchMovie: vi.fn(),
}))

const validTMDBResult = {
  page: 2,
  results: [
    {
      id: 1,
      title: "The Matrix",
      original_title: "The Matrix",
      overview: "A computer hacker discovers the truth.",
      popularity: 100,
      release_date: "1999-03-31",
      poster_path: "https://image.tmdb.org/t/p/w342/matrix.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/w780/matrix-backdrop.jpg",
      adult: false,
    },
  ],
  total_pages: 5,
  total_results: 100,
}

const expectedResult = {
  page: 2,
  results: [
    {
      id: 1,
      title: "The Matrix",
      overview: "A computer hacker discovers the truth.",
      release_date: "1999-03-31",
      poster_path: "https://image.tmdb.org/t/p/w342/matrix.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/w780/matrix-backdrop.jpg",
    },
  ],
  total_pages: 5,
  total_results: 100,
}

describe("discoverMovies", () => {
  beforeEach(() => {
    vi.mocked(searchMovie).mockReset()
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("searches the requested page and returns validated results", async () => {
    vi.mocked(searchMovie).mockResolvedValue(validTMDBResult)

    await expect(discoverMovies("The Matrix", 2)).resolves.toEqual(expectedResult)
    expect(searchMovie).toHaveBeenCalledWith("The Matrix", 2)
  })

  it("logs and rethrows invalid movie results", async () => {
    vi.mocked(searchMovie).mockResolvedValue({ results: "invalid" } as never)

    await expect(discoverMovies("The Matrix", 1)).rejects.toThrow()
    expect(console.error).toHaveBeenCalledWith(
      "Error discovering movies:",
      expect.any(String)
    )
  })

  it("logs and rethrows errors from the TMDB client", async () => {
    const error = new Error("TMDB unavailable")
    vi.mocked(searchMovie).mockRejectedValue(error)

    await expect(discoverMovies("The Matrix", 1)).rejects.toBe(error)
    expect(console.error).toHaveBeenCalledWith(
      "Error discovering movies:",
      "TMDB unavailable"
    )
  })
})
