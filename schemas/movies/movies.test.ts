import { describe, it, expect } from "vitest"
import { Movie, MovieDiscoverResult } from "@/schemas/movies/movies"

describe("MovieDiscoverResult", () => {
  it("parses valid result", () => {
    const data = {
      page: 1,
      results: [
        {
          id: 1,
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
})
