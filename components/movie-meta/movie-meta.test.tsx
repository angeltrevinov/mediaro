import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MovieMeta } from "@/components/movie-meta/movie-meta"
import { formatRuntime, getYear } from "@/components/movie-meta/format"

describe("formatRuntime", () => {
  it("formats hours and minutes", () => {
    expect(formatRuntime(125)).toBe("2h 5m")
    expect(formatRuntime(120)).toBe("2h")
    expect(formatRuntime(45)).toBe("45m")
  })

  it("returns null for missing or invalid runtimes", () => {
    expect(formatRuntime(null)).toBeNull()
    expect(formatRuntime(0)).toBeNull()
    expect(formatRuntime(undefined)).toBeNull()
  })
})

describe("getYear", () => {
  it("extracts the year", () => {
    expect(getYear("1999-03-31")).toBe("1999")
  })

  it("returns null for empty or invalid dates", () => {
    expect(getYear("")).toBeNull()
    expect(getYear(null)).toBeNull()
    expect(getYear("abc")).toBeNull()
  })
})

describe("MovieMeta", () => {
  it("renders year, runtime and status", () => {
    render(
      <MovieMeta releaseDate="1999-03-31" runtime={136} status="Released" />
    )

    expect(screen.getByText("1999")).toBeInTheDocument()
    expect(screen.getByText("2h 16m")).toBeInTheDocument()
    expect(screen.getByText("Released")).toBeInTheDocument()
  })

  it("renders nothing when all fields are missing", () => {
    const { container } = render(
      <MovieMeta releaseDate={null} runtime={null} status={null} />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
