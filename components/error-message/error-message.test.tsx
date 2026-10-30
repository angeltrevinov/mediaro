import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ErrorMessage } from "@/components/error-message/error-message"

describe("ErrorMessage", () => {
  it("renders a destructive alert with the provided title and message", () => {
    render(
      <ErrorMessage
        title="Unable to save changes"
        message="Please try again."
      />
    )

    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText("Unable to save changes")).toBeInTheDocument()
    expect(screen.getByText("Please try again.")).toBeInTheDocument()
  })

  it("uses a default title when none is provided", () => {
    render(<ErrorMessage message="Please try again." />)

    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
  })
})
