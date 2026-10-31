import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import SettingsPage from "./page"

const { changePassword } = vi.hoisted(() => ({
  changePassword: vi.fn(),
}))

vi.mock("@/lib/better-auth/auth-client", () => ({
  authClient: { changePassword },
}))

describe("settings page", () => {
  beforeEach(() => {
    changePassword.mockReset()
    changePassword.mockResolvedValue({ error: null })
  })

  it("changes the password and confirms success", async () => {
    const user = userEvent.setup()
    render(<SettingsPage />)

    await user.type(screen.getByLabelText("Current password"), "oldpassword")
    await user.type(screen.getByLabelText("New password"), "newpassword123")
    await user.type(
      screen.getByLabelText("Confirm new password"),
      "newpassword123",
    )
    await user.click(screen.getByRole("button", { name: "Change password" }))

    await waitFor(() => {
      expect(changePassword).toHaveBeenCalledWith({
        currentPassword: "oldpassword",
        newPassword: "newpassword123",
        revokeOtherSessions: true,
      })
    })
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Your password has been changed.",
    )
  })

  it("does not submit when the new passwords do not match", async () => {
    const user = userEvent.setup()
    render(<SettingsPage />)

    await user.type(screen.getByLabelText("Current password"), "oldpassword")
    await user.type(screen.getByLabelText("New password"), "newpassword123")
    await user.type(
      screen.getByLabelText("Confirm new password"),
      "differentpassword",
    )
    await user.click(screen.getByRole("button", { name: "Change password" }))

    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument()
    expect(changePassword).not.toHaveBeenCalled()
  })

  it("does not submit a new password shorter than the shared minimum", async () => {
    const user = userEvent.setup()
    render(<SettingsPage />)

    await user.type(screen.getByLabelText("Current password"), "oldpassword")
    await user.type(screen.getByLabelText("New password"), "short12")
    await user.type(screen.getByLabelText("Confirm new password"), "short12")
    await user.click(screen.getByRole("button", { name: "Change password" }))

    expect(
      await screen.findByText("Password must be at least 8 characters long"),
    ).toBeInTheDocument()
    expect(changePassword).not.toHaveBeenCalled()
  })

  it("displays an error when Better Auth rejects the password change", async () => {
    changePassword.mockResolvedValue({
      error: { message: "Current password is incorrect" },
    })
    const user = userEvent.setup()
    render(<SettingsPage />)

    await user.type(screen.getByLabelText("Current password"), "oldpassword")
    await user.type(screen.getByLabelText("New password"), "newpassword123")
    await user.type(
      screen.getByLabelText("Confirm new password"),
      "newpassword123",
    )
    await user.click(screen.getByRole("button", { name: "Change password" }))

    expect(await screen.findByRole("alert")).toBeInTheDocument()
    expect(screen.getByText("Current password is incorrect")).toBeInTheDocument()
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })
})
