import type { AddTaskMutation } from "@/features/tasks-management";

import AddTaskForm from "./AddTaskForm";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";

const mockPendingMutation = {
  isPending: true,
  mutateAsync: vi.fn().mockResolvedValue(undefined),
} as unknown as AddTaskMutation;

const mockResolvedMutation = {
  isPending: false,
  mutateAsync: vi.fn().mockResolvedValue(undefined),
} as unknown as AddTaskMutation;

const mockRejectedMutation = {
  isPending: false,
  mutateAsync: vi.fn().mockRejectedValue(new Error("Any error")),
} as unknown as AddTaskMutation;

describe("AddTaskForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("shows validation error when submitting empty form", async () => {
    render(<AddTaskForm addTaskMutation={mockResolvedMutation} />);

    const user = userEvent.setup();

    const createButton = screen.getByRole("button", { name: /create/i });

    await user.click(createButton);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "The field cannot be empty",
    );

    expect(mockResolvedMutation.mutateAsync).not.toHaveBeenCalled();
  });

  it("calls mutation with entered task title", async () => {
    render(<AddTaskForm addTaskMutation={mockResolvedMutation} />);

    const user = userEvent.setup();

    const input = screen.getByRole("textbox", { name: /task title/i });

    const createButton = screen.getByRole("button", { name: /create/i });

    await user.type(input, "Buy milk in the morning");

    await user.click(createButton);

    expect(mockResolvedMutation.mutateAsync).toHaveBeenCalledWith({
      title: "Buy milk in the morning",
    });
  });

  it("calls mutation with trimmed entered task title", async () => {
    render(<AddTaskForm addTaskMutation={mockResolvedMutation} />);

    const user = userEvent.setup();

    const input = screen.getByRole("textbox", { name: /task title/i });

    const createButton = screen.getByRole("button", { name: /create/i });

    await user.type(input, "  Buy milk  ");

    await user.click(createButton);

    expect(mockResolvedMutation.mutateAsync).toHaveBeenCalledWith({
      title: "Buy milk",
    });
  });

  it("doesn't call mutation if already pending", async () => {
    render(<AddTaskForm addTaskMutation={mockPendingMutation} />);

    const user = userEvent.setup();

    const input = screen.getByRole("textbox", { name: /task title/i });

    const createButton = screen.getByRole("button", { name: /create/i });

    await user.type(input, "Buy milk");

    await user.click(createButton);

    expect(mockPendingMutation.mutateAsync).not.toHaveBeenCalled();
  });

  it("clears input after successful task creation", async () => {
    render(<AddTaskForm addTaskMutation={mockResolvedMutation} />);

    const user = userEvent.setup();

    const input = screen.getByRole("textbox", { name: /task title/i });

    const createButton = screen.getByRole("button", { name: /create/i });

    await user.type(input, "Buy milk");

    await user.click(createButton);

    expect(input).toHaveValue("");
  });

  it("shows clear button when input contains text", async () => {
    render(<AddTaskForm addTaskMutation={mockResolvedMutation} />);

    const user = userEvent.setup();

    const input = screen.getByRole("textbox", { name: /task title/i });

    expect(
      screen.queryByRole("button", { name: /clear title/i }),
    ).not.toBeInTheDocument();

    await user.type(input, "Buy milk");

    expect(
      screen.getByRole("button", { name: /clear title/i }),
    ).toBeInTheDocument();
  });

  it("hides clear button when input becomes empty", async () => {
    render(<AddTaskForm addTaskMutation={mockResolvedMutation} />);

    const user = userEvent.setup();

    const input = screen.getByRole("textbox", { name: /task title/i });

    await user.type(input, "Buy milk");

    await user.clear(input);

    expect(
      screen.queryByRole("button", { name: /clear title/i }),
    ).not.toBeInTheDocument();
  });

  it("clears input field after click on clear button", async () => {
    render(<AddTaskForm addTaskMutation={mockResolvedMutation} />);

    const user = userEvent.setup();

    const input = screen.getByRole("textbox", { name: /task title/i });

    await user.type(input, "Buy milk");

    const clearButton = screen.getByRole("button", { name: /clear title/i });

    await user.click(clearButton);

    expect(input).toHaveValue("");
  });

  it("shows error toast when mutation fails", async () => {
    const toastErrorSpy = vi.spyOn(toast, "error");

    render(<AddTaskForm addTaskMutation={mockRejectedMutation} />);

    const user = userEvent.setup();

    const input = screen.getByRole("textbox", { name: /task title/i });

    const createButton = screen.getByRole("button", { name: /create/i });

    await user.type(input, "Buy milk");

    await user.click(createButton);

    expect(toastErrorSpy).toHaveBeenCalledWith("Server sync failed");
  });

  it("hides validation error after timeout", async () => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });

    render(<AddTaskForm addTaskMutation={mockResolvedMutation} />);

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    const createButton = screen.getByRole("button", { name: /create/i });

    await user.click(createButton);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "The field cannot be empty",
    );

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
