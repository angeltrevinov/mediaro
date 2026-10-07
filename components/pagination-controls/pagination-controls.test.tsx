import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { PaginationControls } from "@/components/pagination-controls/pagination-controls"

describe("PaginationControls", () => {
  it.each(["Rock & Roll", "C++", "What? Now #1"])(
    "preserves the search query %j in pagination links",
    (query) => {
      render(
        <PaginationControls
          pathName="/discover/movies"
          query={query}
          currentPage={2}
          totalPages={5}
        />
      )

      const pagination = screen.getByRole("navigation", { name: "pagination" })
      const links = pagination.querySelectorAll<HTMLAnchorElement>("a[href]")

      expect(links.length).toBeGreaterThan(0)

      for (const link of links) {
        const url = new URL(link.href)
        const searchParams = url.searchParams

        expect(url.pathname).toBe("/discover/movies")
        expect(searchParams.get("query")).toBe(query)
        expect(Number(searchParams.get("page"))).toBeGreaterThanOrEqual(1)
        expect(Number(searchParams.get("page"))).toBeLessThanOrEqual(5)
        expect([...searchParams.keys()].sort()).toEqual(["page", "query"])
      }
    }
  )

  it("renders only the current page when there is one page", () => {
    render(
      <PaginationControls
        pathName="/discover/movies"
        query="Batman"
        currentPage={1}
        totalPages={1}
      />
    )

    const pagination = screen.getByRole("navigation", { name: "pagination" })
    const links = pagination.querySelectorAll<HTMLAnchorElement>("a[href]")

    expect(links).toHaveLength(1)
    expect(links[0].textContent).toBe("1")
    expect(links[0].getAttribute("aria-current")).toBe("page")
    expect(pagination.querySelector('[data-slot="pagination-ellipsis"]')).toBeNull()
  })

  it("shows boundary pages and ellipses for a page in the middle", () => {
    render(
      <PaginationControls
        pathName="/discover/movies"
        query="Batman"
        currentPage={5}
        totalPages={10}
      />
    )

    const pagination = screen.getByRole("navigation", { name: "pagination" })
    const links = [...pagination.querySelectorAll<HTMLAnchorElement>("a[href]")]
    const pageNumbers = links
      .map((link) => link.textContent)
      .filter((text) => text && /^\d+$/.test(text))

    expect(pageNumbers).toEqual(["1", "4", "5", "6", "10"])
    expect(
      pagination.querySelectorAll('[data-slot="pagination-ellipsis"]')
    ).toHaveLength(2)
  })
})
