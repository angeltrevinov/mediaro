import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"

vi.stubEnv("TMDB_API_KEY", "test-api-key")

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

function mockSuccess(data: unknown = tmdbResponse) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () => Promise.resolve(data),
  })
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {})
})

afterEach(() => {
  mockFetch.mockReset()
  vi.restoreAllMocks()
})

describe("searchMovie", () => {
  it("fetches movies with correct URL and headers", async () => {
    mockSuccess()

    await searchMovie("batman", 2)

    const url = new URL(mockFetch.mock.calls[0][0] as string)
    expect(url.origin).toBe("https://api.themoviedb.org")
    expect(url.pathname).toBe("/3/search/movie")
    expect(url.searchParams.get("query")).toBe("batman")
    expect(url.searchParams.get("page")).toBe("2")
    expect(url.searchParams.get("include_adult")).toBe("false")
    expect(url.searchParams.get("language")).toBe("en-US")
    expect(mockFetch.mock.calls[0][1]).toMatchObject({
      method: "GET",
      headers: expect.objectContaining({
        accept: "application/json",
        Authorization: "Bearer test-api-key",
      }),
    })
  })

  it("returns parsed movie search results", async () => {
    mockSuccess()

    const result = await searchMovie("batman")

    expect(result.page).toBe(1)
    expect(result.results).toHaveLength(1)
    expect(result.results[0].title).toBe("Batman")
  })

  it("transforms image paths to full URLs", async () => {
    mockSuccess()

    const result = await searchMovie("batman")

    expect(result.results[0].poster_path).toBe(
      "https://image.tmdb.org/t/p/w342/poster.jpg"
    )
    expect(result.results[0].backdrop_path).toBe(
      "https://image.tmdb.org/t/p/w780/backdrop.jpg"
    )
  })

  it("encodes special characters in query", async () => {
    mockSuccess()

    await searchMovie("Rock & Roll")

    const url = new URL(mockFetch.mock.calls[0][0] as string)
    expect(url.searchParams.get("query")).toBe("Rock & Roll")
    expect(url.searchParams.get("page")).toBe("1")
  })

  it("throws on non-200 HTTP response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: () => Promise.resolve({ status_message: "Invalid API key" }),
    })

    await expect(searchMovie("batman")).rejects.toThrow(
      "TMDB API error: 401 Unauthorized"
    )
  })

  it("throws on network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    await expect(searchMovie("batman")).rejects.toThrow("Network error")
  })

  it("sends custom language and includeAdult params", async () => {
    mockSuccess()

    await searchMovie("batman", 2, true, "es-ES")

    const url = new URL(mockFetch.mock.calls[0][0] as string)
    expect(url.searchParams.get("include_adult")).toBe("true")
    expect(url.searchParams.get("language")).toBe("es-ES")
    expect(url.searchParams.get("page")).toBe("2")
  })
})
