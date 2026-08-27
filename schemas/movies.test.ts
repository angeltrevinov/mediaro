import { describe, it, expect } from "vitest"
import { MovieSearchQuery, MovieSearchResult } from "./movies"

describe("MovieSearchQuery", () => {
  it("parses valid query", () => {
    const result = MovieSearchQuery.parse({ query: "batman", page: "2" })
    expect(result).toEqual({ query: "batman", page: 2 })
  })

  it("defaults page to 1", () => {
    const result = MovieSearchQuery.parse({ query: "batman" })
    expect(result.page).toBe(1)
  })

  it("coerces page string to number", () => {
    const result = MovieSearchQuery.parse({ query: "batman", page: "5" })
    expect(result.page).toBe(5)
  })

  it("rejects missing query", () => {
    expect(() => MovieSearchQuery.parse({})).toThrow()
  })
})

describe("MovieSearchResult", () => {
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
    expect(MovieSearchResult.parse(data)).toEqual(data)
  })

  it("allows nullish poster_path and backdrop_path", () => {
    const data = {
      page: 1,
      results: [{ id: 1, title: "Batman", overview: null }],
      total_pages: 1,
      total_results: 1,
    }
    const result = MovieSearchResult.parse(data)
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
    const result = MovieSearchResult.parse(data)
    expect(result.results[0].overview).toBeUndefined()
  })

  it("rejects result without required fields", () => {
    expect(() => MovieSearchResult.parse({})).toThrow()
  })
})
