import { describe, it, expect } from "vitest"
import { Movie, MovieDiscoverResult } from "@/schemas/movies/movies"

describe("MovieDiscoverResult", () => {
  it("parses valid result", () => {
    const data = {
      page: 1,
      results: [
        {
          id: 1,
          tmdb_id: "1",
          title: "Batman",
          overview: "Batman movie",
          release_date: "2024-01-01",
          poster_path: "/poster.jpg",
          backdrop_path: "/backdrop.jpg",
        },
      ],
      total_pages: 1,
      total_results: 1,
    }
    expect(MovieDiscoverResult.parse(data)).toEqual(data)
  })

  it.each([
    {
      label: "omitted",
      optionalFields: {},
      expected: undefined,
    },
    {
      label: "null",
      optionalFields: {
        overview: null,
        release_date: null,
        poster_path: null,
        backdrop_path: null,
      },
      expected: null,
    },
  ])("allows $label optional movie fields", ({ optionalFields, expected }) => {
    const result = Movie.parse({
      id: 1,
      tmdb_id: "1",
      title: "Batman",
      ...optionalFields,
    })

    expect(result.overview).toBe(expected)
    expect(result.release_date).toBe(expected)
    expect(result.poster_path).toBe(expected)
    expect(result.backdrop_path).toBe(expected)
  })

  it("rejects result without required fields", () => {
    expect(() => MovieDiscoverResult.parse({})).toThrow()
  })

  it("rejects a movie with an invalid required field", () => {
    expect(() =>
      MovieDiscoverResult.parse({
        page: 1,
        results: [{ id: "1", title: "Batman" }],
        total_pages: 1,
        total_results: 1,
      })
    ).toThrow()
  })

  it("parses TMDB movie detail fields", () => {
    const result = Movie.parse({
      id: 11,
      tmdb_id: "11",
      title: "Star Wars",
      nsfw: false,
      imdb_id: "tt0076759",
      origin_country: ["US"],
      original_language: "en",
      original_title: "Star Wars",
      popularity: 20.6912,
      runtime: 121,
      status: "Released",
      vote_average: 8.2,
      vote_count: 22061,
    })

    expect(result).toMatchObject({
      nsfw: false,
      imdb_id: "tt0076759",
      origin_country: ["US"],
      original_language: "en",
      original_title: "Star Wars",
      popularity: 20.6912,
      runtime: 121,
      status: "Released",
      vote_average: 8.2,
      vote_count: 22061,
    })
    expect(result).not.toHaveProperty("adult")
  })

  it("parses nsfw without an adult property", () => {
    const result = Movie.parse({
      id: 11,
      tmdb_id: "11",
      title: "Star Wars",
      nsfw: true,
    })

    expect(result.nsfw).toBe(true)
    expect(result).not.toHaveProperty("adult")
  })
})
