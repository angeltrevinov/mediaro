import { describe, it, expect } from "vitest"
import {
  TMDBMovieSchema,
  TMDBMovieSearchResultSchema,
  type TMDBMovie,
} from "./schemas";

const validMovie = {
  id: 1,
  title: "Test Movie",
  original_title: "Test Movie",
  overview: "A test movie",
  popularity: 100,
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  release_date: "2024-01-01",
  adult: false,
}

describe("TMDBMovieSchema", () => {
  it("parses a valid movie", () => {
    const result = TMDBMovieSchema.parse(validMovie)
    expect(result).toEqual({
      ...validMovie,
      poster_path: "https://image.tmdb.org/t/p/w342/poster.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/w780/backdrop.jpg",
    })
  })

  it("transforms poster_path to full URL", () => {
    const result = TMDBMovieSchema.parse(validMovie)
    expect(result.poster_path).toBe(
      "https://image.tmdb.org/t/p/w342/poster.jpg"
    )
  })

  it("transforms backdrop_path to full URL", () => {
    const result = TMDBMovieSchema.parse(validMovie)
    expect(result.backdrop_path).toBe(
      "https://image.tmdb.org/t/p/w780/backdrop.jpg"
    )
  })

  it("returns null for null poster_path", () => {
    const result = TMDBMovieSchema.parse({ ...validMovie, poster_path: null })
    expect(result.poster_path).toBeNull()
  })

  it("returns null for null backdrop_path", () => {
    const result = TMDBMovieSchema.parse({ ...validMovie, backdrop_path: null })
    expect(result.backdrop_path).toBeNull()
  })

  it("rejects movie without required fields", () => {
    expect(() => TMDBMovieSchema.parse({})).toThrow()
  })

  it("rejects movie with wrong types", () => {
    expect(() =>
      TMDBMovieSchema.parse({ ...validMovie, id: "not a number" })
    ).toThrow()
  })
})

describe("TMDBMovieSearchResultSchema", () => {
  it("parses valid search results", () => {
    const data = {
      page: 1,
      results: [validMovie],
      total_pages: 10,
      total_results: 200,
    }
    const result = TMDBMovieSearchResultSchema.parse(data)
    expect(result.page).toBe(1)
    expect(result.results).toHaveLength(1)
    expect(result.total_pages).toBe(10)
    expect(result.total_results).toBe(200)
  })

  it("parses empty results", () => {
    const data = { page: 1, results: [], total_pages: 0, total_results: 0 }
    const result = TMDBMovieSearchResultSchema.parse(data)
    expect(result.results).toEqual([])
  })

  it("transforms movie images within results", () => {
    const data = {
      page: 1,
      results: [validMovie],
      total_pages: 1,
      total_results: 1,
    }
    const result = TMDBMovieSearchResultSchema.parse(data)
    expect(result.results[0].poster_path).toContain("w342")
    expect(result.results[0].backdrop_path).toContain("w780")
  })

  it("rejects search results without required fields", () => {
    expect(() => TMDBMovieSearchResultSchema.parse({})).toThrow()
  })
})
