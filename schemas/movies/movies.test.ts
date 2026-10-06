import { describe, it, expect } from "vitest"
import { MovieDiscoverResult } from "@/schemas/movies/movies";

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

  it("allows nullish poster_path and backdrop_path", () => {
    const data = {
      page: 1,
      results: [{ id: 1, title: "Batman", overview: null }],
      total_pages: 1,
      total_results: 1,
    }
    const result = MovieDiscoverResult.parse(data)
    expect(result.results[0].poster_path).toBeUndefined()
    expect(result.results[0].backdrop_path).toBeUndefined()
  })

  it("allows nullish overview", () => {
    const data = {
      page: 1,
      results: [{ id: 1, title: "Batman" }],
      total_pages: 1,
      total_results: 1,
    }
    const result = MovieDiscoverResult.parse(data)
    expect(result.results[0].overview).toBeUndefined()
  })

  it("rejects result without required fields", () => {
    expect(() => MovieDiscoverResult.parse({})).toThrow()
  })
})
