import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import DiscoverMovieForm from "@/components/discover-movie-form/discover-movie-form"

const { push } = vi.hoisted(() => ({ push: vi.fn() }))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}))

describe("DiscoverMovieForm", () => {
  beforeEach(() => {
    push.mockClear()
  })

  it("uses the initial query as the input value", () => {
    render(<DiscoverMovieForm initialQuery="The Matrix" />)

    expect(screen.getByRole("textbox", { name: "Search for a movie to add" }))
      .toHaveValue("The Matrix")
  })

  it("submits a URL-encoded query", async () => {
    const user = userEvent.setup()
    render(<DiscoverMovieForm />)

    const input = screen.getByRole("textbox", {
      name: "Search for a movie to add",
    })
    await user.type(input, "Rock & Roll")
    await user.keyboard("{Enter}")

    expect(push).toHaveBeenCalledTimes(1)
    const url = new URL(push.mock.calls[0][0], "http://localhost")
    expect(url.pathname).toBe("/discover/movies")
    expect(url.searchParams.get("query")).toBe("Rock & Roll")
  })

  it("shows a validation error and does not navigate for an empty query", async () => {
    const user = userEvent.setup()
    render(<DiscoverMovieForm />)

    await user.click(
      screen.getByRole("textbox", { name: "Search for a movie to add" })
    )
    await user.keyboard("{Enter}")

    expect(
      await screen.findByText("Query must be at least 1 character long")
    ).toBeInTheDocument()
    expect(push).not.toHaveBeenCalled()
  })
})
