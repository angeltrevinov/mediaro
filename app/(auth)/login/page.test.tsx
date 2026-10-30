import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "./page";

const { authenticateUser, push } = vi.hoisted(() => ({
    authenticateUser: vi.fn(),
    push: vi.fn(),
}));

vi.mock("@/services/auth", () => ({
    authenticateUser,
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push }),
}));

describe("login page", () => {
    beforeEach(() => {
        authenticateUser.mockReset();
        push.mockReset();
    });

    it("authenticates with the entered email and password", async () => {
        const user = userEvent.setup();
        render(<LoginPage />);

        await user.type(screen.getByLabelText("Email:"), "person@example.com");
        await user.type(screen.getByLabelText("Password:"), "password123");
        await user.click(screen.getByRole("button", { name: "Login" }));

        await waitFor(() => {
            expect(authenticateUser).toHaveBeenCalledWith(
                "person@example.com",
                "password123",
            );
        });
        expect(push).toHaveBeenCalledWith("/");
    });

    it("does not authenticate when the email is missing", async () => {
        const user = userEvent.setup();
        render(<LoginPage />);

        await user.type(screen.getByLabelText("Password:"), "password123");
        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByText("Invalid email address")).toBeInTheDocument();
        expect(authenticateUser).not.toHaveBeenCalled();
        expect(push).not.toHaveBeenCalled();
    });
});
