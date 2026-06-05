import DeleteAccountButton from "./DeleteAccountButton";
import { useDeleteAccount } from "@/features/delete-account/model/useDeleteAccount";
import { useServerAccessState } from "@/shared/model";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/features/delete-account/model/useDeleteAccount", () => ({
  useDeleteAccount: vi.fn(),
}));

vi.mock("@/shared/model", () => ({
  useServerAccessState: vi.fn(),
}));

const navigateMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

describe("DeleteAccountButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes local data and redirects when server is unavailable", async () => {
    vi.mocked(useServerAccessState).mockReturnValue({
      isServerAccessBlocked: false,
      isServerBlockedByAuth: false,
      isServerBlockedByUser: false,
      isServerAccessUncertain: false,
      canAccessServer: false,
    });

    const deleteLocalUserDataMock = vi.fn();

    vi.mocked(useDeleteAccount).mockReturnValue({
      deleteAllData: vi.fn(),
      deleteLocalUserData: deleteLocalUserDataMock,
      isDataDeleting: false,
    });

    const user = userEvent.setup();

    render(<DeleteAccountButton />);

    const button = screen.getByRole("button", { name: /delete the profile/i });

    await user.click(button);

    await screen.findByText(
      /delete only your local data and close the session?/i,
    );

    const modalConfirmButton = screen.getByRole("button", { name: /confirm/i });

    await user.click(modalConfirmButton);

    expect(deleteLocalUserDataMock).toHaveBeenCalled();

    expect(navigateMock).toHaveBeenCalledWith("/auth");
  });

  it("deletes account server data and redirects on success", async () => {
    vi.mocked(useServerAccessState).mockReturnValue({
      isServerAccessBlocked: false,
      isServerBlockedByAuth: false,
      isServerBlockedByUser: false,
      isServerAccessUncertain: false,
      canAccessServer: true,
    });

    const deleteAllDataMock = vi.fn().mockResolvedValue({
      status: "success",
    });

    vi.mocked(useDeleteAccount).mockReturnValue({
      deleteAllData: deleteAllDataMock,
      deleteLocalUserData: vi.fn(),
      isDataDeleting: false,
    });

    const user = userEvent.setup();

    render(<DeleteAccountButton />);

    const button = screen.getByRole("button", { name: /delete the profile/i });

    await user.click(button);

    await screen.findByText(/delete all your data permanently?/i);

    const modalConfirmButton = screen.getByRole("button", { name: /confirm/i });

    await user.click(modalConfirmButton);

    expect(deleteAllDataMock).toHaveBeenCalled();

    expect(navigateMock).toHaveBeenCalledWith("/auth");
  });

  it("falls back to local deletion when server deletion fails", async () => {
    vi.mocked(useServerAccessState).mockReturnValue({
      isServerAccessBlocked: false,
      isServerBlockedByAuth: false,
      isServerBlockedByUser: false,
      isServerAccessUncertain: false,
      canAccessServer: true,
    });

    const deleteLocalUserDataMock = vi.fn();
    const deleteAllDataMock = vi.fn().mockResolvedValue({
      status: "failed",
    });

    vi.mocked(useDeleteAccount).mockReturnValue({
      deleteAllData: deleteAllDataMock,
      deleteLocalUserData: deleteLocalUserDataMock,
      isDataDeleting: false,
    });

    const user = userEvent.setup();

    render(<DeleteAccountButton />);

    const button = screen.getByRole("button", { name: /delete the profile/i });

    await user.click(button);

    await screen.findByText(/delete all your data permanently?/i);

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(deleteAllDataMock).toHaveBeenCalled();

    await screen.findByText(/connection issue/i);

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(deleteLocalUserDataMock).toHaveBeenCalled();

    expect(navigateMock).toHaveBeenCalledWith("/auth");
  });

  it("disables delete button while deleting data", () => {
    vi.mocked(useServerAccessState).mockReturnValue({
      isServerAccessBlocked: false,
      isServerBlockedByAuth: false,
      isServerBlockedByUser: false,
      isServerAccessUncertain: false,
      canAccessServer: true,
    });

    vi.mocked(useDeleteAccount).mockReturnValue({
      deleteAllData: vi.fn(),
      deleteLocalUserData: vi.fn(),
      isDataDeleting: true,
    });

    render(<DeleteAccountButton />);

    expect(
      screen.getByRole("button", { name: /delete the profile/i }),
    ).toBeDisabled();
  });
});
