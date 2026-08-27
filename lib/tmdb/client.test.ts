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

function mockSuccess(data: unknown = tmdbResponse) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () => Promise.resolve(data),
  })
}

afterEach(() => {
  mockFetch.mockReset()
})

describe("searchMovie", () => {
  it("fetches movies with correct URL and headers", async () => {
    mockSuccess()

    await searchMovie("batman", 1)

    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain("https://api.themoviedb.org/3/search/movie?")
    expect(url).toContain("query=batman")
    expect(url).toContain("page=1")
    expect(url).toContain("include_adult=false")
    expect(url).toContain("language=en-US")
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

    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain("query=Rock+%26+Roll")
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

    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain("include_adult=true")
    expect(url).toContain("language=es-ES")
    expect(url).toContain("page=2")
  })
})
