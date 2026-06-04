import type { ReactNode } from "react";

import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { deleteServerUserData } from "./deleteUserAccount";
import { useDeleteAccount } from "./useDeleteAccount";

vi.mock("./deleteUserAccount", () => ({
  deleteServerUserData: vi.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useDeleteAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success when server deletion succeeds", async () => {
    vi.mocked(deleteServerUserData).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteAccount(), { wrapper });

    let response;

    await act(async () => {
      response = await result.current.deleteAllData();
    });

    expect(response).toEqual({
      status: "success",
    });
  });

  it("returns failed when server deletion throws", async () => {
    vi.mocked(deleteServerUserData).mockRejectedValue(
      new Error("Server error"),
    );

    const { result } = renderHook(() => useDeleteAccount(), { wrapper });

    let response;

    await act(async () => {
      response = await result.current.deleteAllData();
    });

    expect(response).toEqual({
      status: "failed",
    });
  });

  it("clears local storage", async () => {
    localStorage.setItem("test", "value");

    const { result } = renderHook(() => useDeleteAccount(), { wrapper });

    await act(async () => {
      result.current.deleteLocalUserData();
    });

    expect(localStorage.getItem("test")).toBeNull();
  });
});
