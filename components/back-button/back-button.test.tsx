import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { BackButton } from "@/components/back-button/back-button"

const { back } = vi.hoisted(() => ({ back: vi.fn() }))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back }),
}))

function stubNavigation(canGoBack: boolean) {
  Object.defineProperty(window, "navigation", {
    value: { canGoBack },
    configurable: true,
  })
}

describe("BackButton", () => {
  beforeEach(() => {
    back.mockClear()
  })

  afterEach(() => {
    Reflect.deleteProperty(window, "navigation")
  })

  it("renders a button with the default label when the app has history", () => {
    stubNavigation(true)
    render(<BackButton />)

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument()
  })

  it("supports a custom label", () => {
    stubNavigation(true)
    render(<BackButton label="Home" />)

    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument()
  })

  it("goes back in history when clicked", async () => {
    stubNavigation(true)
    render(<BackButton />)

    await userEvent.click(screen.getByRole("button", { name: "Back" }))

    expect(back).toHaveBeenCalledOnce()
  })

  it("renders nothing when the previous page is not part of the app", () => {
    stubNavigation(false)
    const { container } = render(<BackButton />)

    expect(container).toBeEmptyDOMElement()
  })

  it("renders nothing when the Navigation API is unavailable", () => {
    const { container } = render(<BackButton />)

    expect(container).toBeEmptyDOMElement()
  })
})
