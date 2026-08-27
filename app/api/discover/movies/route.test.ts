import { describe, it, expect, vi, afterEach } from "vitest"
import { NextRequest } from "next/server"

vi.stubEnv("TMDB_API_KEY", "test-api-key")
vi.spyOn(console, "error").mockImplementation(() => {})

const mockSearchMovie = vi.fn()
vi.mock("@/lib/tmdb", () => ({ searchMovie: mockSearchMovie }))

const { GET } = await import("./route")

afterEach(() => {
  mockSearchMovie.mockReset()
})

function createRequest(url: string) {
  return new NextRequest(`http://localhost${url}`)
}

const tmdbResponse = {
  page: 1,
  results: [
    {
      id: 1,
      title: "Batman",
      overview: "Batman movie",
      release_date: "2024-01-01",
      poster_path: "https://image.tmdb.org/t/p/w342/poster.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/w780/backdrop.jpg",
    },
  ],
  total_pages: 10,
  total_results: 200,
}

describe("GET /api/discover/movies", () => {
  it("returns movie search results", async () => {
    mockSearchMovie.mockResolvedValueOnce({
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
    })

    const request = createRequest("/api/discover/movies?query=batman")
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.results).toHaveLength(1)
    expect(data.results[0].title).toBe("Batman")
  })

  it("passes query and page to searchMovie", async () => {
    mockSearchMovie.mockResolvedValueOnce({
      page: 2,
      results: [],
      total_pages: 0,
      total_results: 0,
    })

    const request = createRequest("/api/discover/movies?query=batman&page=2")
    await GET(request)

    expect(mockSearchMovie).toHaveBeenCalledWith("batman", 2)
  })

  it("defaults page to 1", async () => {
    mockSearchMovie.mockResolvedValueOnce({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    })

    const request = createRequest("/api/discover/movies?query=batman")
    await GET(request)

    expect(mockSearchMovie).toHaveBeenCalledWith("batman", 1)
  })

  it("returns 500 on search error", async () => {
    mockSearchMovie.mockRejectedValueOnce(new Error("TMDB API error"))

    const request = createRequest("/api/discover/movies?query=batman")
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe("Failed to fetch movie search results")
  })


})
