import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RegisterPage from "./page";

const { createUser } = vi.hoisted(() => ({
    createUser: vi.fn(),
}));

vi.mock("@/services/auth", () => ({
    createUser,
}));

describe("register page", () => {
    beforeEach(() => {
        createUser.mockReset();
    });

    it("creates an account using the entered name, email, and password", async () => {
        const user = userEvent.setup();
        render(<RegisterPage />);

        await user.type(screen.getByLabelText("Name:"), "Person");
        await user.type(screen.getByLabelText("Email:"), "person@example.com");
        await user.type(screen.getByLabelText("Password:"), "password123");
        await user.type(screen.getByLabelText("Confirm Password:"), "password123");
        await user.click(screen.getByRole("button", { name: "Create Account" }));

        await waitFor(() => {
            expect(createUser).toHaveBeenCalledWith(
                "person@example.com",
                "password123",
                "Person",
            );
        });
    });

    it("does not create an account when the passwords do not match", async () => {
        const user = userEvent.setup();
        render(<RegisterPage />);

        await user.type(screen.getByLabelText("Name:"), "Person");
        await user.type(screen.getByLabelText("Email:"), "person@example.com");
        await user.type(screen.getByLabelText("Password:"), "password123");
        await user.type(screen.getByLabelText("Confirm Password:"), "different123");
        await user.click(screen.getByRole("button", { name: "Create Account" }));

        expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
        expect(createUser).not.toHaveBeenCalled();
    });
});
