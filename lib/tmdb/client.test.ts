import { describe, it, expect, vi, afterEach } from "vitest"

vi.stubEnv("TMDB_API_KEY", "test-api-key")
vi.spyOn(console, "error").mockImplementation(() => {})

const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

const { searchMovie } = await import("./client")

const tmdbResponse = {
  page: 1,
  results: [
    {
      id: 1,
      title: "Batman",
      original_title: "Batman",
      overview: "Batman movie",
      popularity: 100,
      poster_path: "/poster.jpg",
      backdrop_path: "/backdrop.jpg",
      release_date: "2024-01-01",
      adult: false,
    },
  ],
  total_pages: 10,
  total_results: 200,
}

afterEach(() => {
  mockFetch.mockReset()
})

describe("searchMovie", () => {
  it("fetches movies with correct URL and headers", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(tmdbResponse),
    })

    await searchMovie("batman", 1)

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.themoviedb.org/3/search/movie?query=batman&page=1&include_adult=false&language=en-US",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          accept: "application/json",
          Authorization: "Bearer test-api-key",
        }),
      })
    )
  })

  it("returns parsed movie search results", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(tmdbResponse),
    })

    const result = await searchMovie("batman")

    expect(result.page).toBe(1)
    expect(result.results).toHaveLength(1)
    expect(result.results[0].title).toBe("Batman")
  })

  it("transforms image paths to full URLs", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(tmdbResponse),
    })

    const result = await searchMovie("batman")

    expect(result.results[0].poster_path).toBe(
      "https://image.tmdb.org/t/p/w342/poster.jpg"
    )
    expect(result.results[0].backdrop_path).toBe(
      "https://image.tmdb.org/t/p/w780/backdrop.jpg"
    )
  })

  it("throws on network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    await expect(searchMovie("batman")).rejects.toThrow("Network error")
  })

  it("sends custom language and includeAdult params", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(tmdbResponse),
    })

    await searchMovie("batman", 2, true, "es-ES")

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("include_adult=true&language=es-ES"),
      expect.anything()
    )
  })
})
