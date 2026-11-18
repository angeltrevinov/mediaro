import { describe, it, expect } from "vitest"
import {
  TMDBMovieSchema,
  TMDBMovieDetailsSchema,
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

describe("TMDBMovieDetailsSchema", () => {
  const movieDetails = {
    adult: false,
    backdrop_path: "/2w4xG178RpB4MDAIfTkqAuSJzec.jpg",
    id: 11,
    imdb_id: "tt0076759",
    origin_country: ["US"],
    original_language: "en",
    original_title: "Star Wars",
    overview:
      "Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.",
    popularity: 20.6912,
    poster_path: "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
    release_date: "1977-05-25",
    runtime: 121,
    status: "Released",
    title: "Star Wars",
    vote_average: 8.2,
    vote_count: 22061,
  }

  it("parses the TMDB movie details response", () => {
    const result = TMDBMovieDetailsSchema.parse(movieDetails)
    expect(result.id).toBe(11)
    expect(result.poster_path).toBe(
      "https://image.tmdb.org/t/p/w342/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg"
    )
  })

  it("accepts nullable fields when TMDB has no value", () => {
    const result = TMDBMovieDetailsSchema.parse({
      ...movieDetails,
      backdrop_path: null,
      imdb_id: null,
      poster_path: null,
      runtime: null,
    })
    expect(result.backdrop_path).toBeNull()
    expect(result.runtime).toBeNull()
  })
})
