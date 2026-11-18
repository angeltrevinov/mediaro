import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { searchMovieTMDB } from "@/lib/tmdb"
import { getMovieDetailsTMDB } from "@/lib/tmdb/client/client"
import { discoverMovies, getMovieDetails } from "@/services/movies"

vi.mock("@/lib/tmdb", () => ({
  searchMovieTMDB: vi.fn(),
}))

vi.mock("@/lib/tmdb/client/client", () => ({
  getMovieDetailsTMDB: vi.fn(),
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
      tmdb_id: "1",
      title: "The Matrix",
      original_title: "The Matrix",
      overview: "A computer hacker discovers the truth.",
      popularity: 100,
      release_date: "1999-03-31",
      poster_path: "https://image.tmdb.org/t/p/w342/matrix.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/w780/matrix-backdrop.jpg",
      nsfw: false,
    },
  ],
  total_pages: 5,
  total_results: 100,
}

describe("discoverMovies", () => {
  beforeEach(() => {
    vi.mocked(searchMovieTMDB).mockReset()
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("searches the requested page and returns validated results", async () => {
    vi.mocked(searchMovieTMDB).mockResolvedValue(validTMDBResult)

    await expect(discoverMovies("The Matrix", 2)).resolves.toEqual(expectedResult)
    expect(searchMovieTMDB).toHaveBeenCalledWith("The Matrix", 2)
  })

  it("logs and rethrows invalid movie results", async () => {
    vi.mocked(searchMovieTMDB).mockResolvedValue({ results: "invalid" } as never)

    await expect(discoverMovies("The Matrix", 1)).rejects.toThrow()
    expect(console.error).toHaveBeenCalledWith(
      "Error discovering movies:",
      expect.any(String)
    )
  })

  it("logs and rethrows errors from the TMDB client", async () => {
    const error = new Error("TMDB unavailable")
    vi.mocked(searchMovieTMDB).mockRejectedValue(error)

    await expect(discoverMovies("The Matrix", 1)).rejects.toBe(error)
    expect(console.error).toHaveBeenCalledWith(
      "Error discovering movies:",
      "TMDB unavailable"
    )
  })
})

describe("getMovieDetails", () => {
  const tmdbDetails = {
    adult: false,
    backdrop_path: "https://image.tmdb.org/t/p/w780/backdrop.jpg",
    id: 11,
    imdb_id: "tt0076759",
    origin_country: ["US"],
    original_language: "en",
    original_title: "Star Wars",
    overview: "A long time ago...",
    popularity: 20.6912,
    poster_path: "https://image.tmdb.org/t/p/w342/poster.jpg",
    release_date: "1977-05-25",
    runtime: 121,
    status: "Released",
    title: "Star Wars",
    vote_average: 8.2,
    vote_count: 22061,
  }

  beforeEach(() => {
    vi.mocked(getMovieDetailsTMDB).mockReset()
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("maps the TMDB id to tmdb_id and leaves the internal id unset", async () => {
    vi.mocked(getMovieDetailsTMDB).mockResolvedValue(tmdbDetails)

    const movie = await getMovieDetails("11")

    expect(getMovieDetailsTMDB).toHaveBeenCalledWith("11")
    expect(movie.tmdb_id).toBe("11")
    expect(movie.id).toBeUndefined()
    expect(movie.nsfw).toBe(false)
    expect(movie).not.toHaveProperty("adult")
    expect(movie).toMatchObject({
      title: "Star Wars",
      imdb_id: "tt0076759",
      runtime: 121,
      vote_count: 22061,
    })
  })

  it("logs and rethrows errors from the TMDB client", async () => {
    const error = new Error("TMDB unavailable")
    vi.mocked(getMovieDetailsTMDB).mockRejectedValue(error)

    await expect(getMovieDetails("11")).rejects.toBe(error)
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching movie details:",
      "TMDB unavailable"
    )
  })
})
