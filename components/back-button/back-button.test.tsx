import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { BackButton } from "@/components/back-button/back-button"

describe("BackButton", () => {
  it("links to the given href with the default label", () => {
    render(<BackButton href="/discover/movies" />)

    expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      "/discover/movies"
    )
  })

  it("supports a custom label", () => {
    render(<BackButton href="/" label="Home" />)

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument()
  })
})
