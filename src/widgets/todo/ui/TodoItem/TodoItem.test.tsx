import type {
  DeleteTaskAction,
  ToggleTaskAction,
} from "@/features/tasks-management";

import TodoItem from "./TodoItem";
import styles from "./TodoItem.module.scss";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";

const navigateMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

const toggleTaskMock = vi.fn().mockResolvedValue(undefined);
const deleteTaskMock = vi.fn().mockResolvedValue(undefined);

const createTask = () => ({
  __uiKey: "uiKey",
  id: "0",
  title: "The task title",
  description: "Some",
  isDone: false,
  orderIndex: 0,
  createdAt: new Date(),
});

describe("TodoItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("toggles task completion", async () => {
    render(
      <TodoItem
        task={createTask()}
        isHighlighted={false}
        toggleTask={toggleTaskMock}
        deleteTask={deleteTaskMock}
      />,
    );

    const user = userEvent.setup();

    const checkbox = screen.getByRole("checkbox", {
      name: /toggle task completion/i,
    });

    await user.click(checkbox);

    expect(toggleTaskMock).toHaveBeenCalledWith("0", true);
  });

  it("deletes task", async () => {
    render(
      <TodoItem
        task={createTask()}
        isHighlighted={false}
        toggleTask={toggleTaskMock}
        deleteTask={deleteTaskMock}
      />,
    );

    const user = userEvent.setup();

    const deleteButton = screen.getByRole("button", { name: /delete task/i });

    await user.click(deleteButton);

    expect(deleteTaskMock).toHaveBeenCalledWith("0");
  });

  it("protects from double toggle action", async () => {
    const toggleTaskMock = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    ) as ToggleTaskAction;

    render(
      <TodoItem
        task={createTask()}
        isHighlighted={false}
        toggleTask={toggleTaskMock}
        deleteTask={deleteTaskMock}
      />,
    );

    const user = userEvent.setup();

    const checkbox = screen.getByRole("checkbox", {
      name: /toggle task completion/i,
    });

    await Promise.all([user.click(checkbox), user.click(checkbox)]);

    expect(toggleTaskMock).toHaveBeenCalledTimes(1);
  });

  it("protects from double delete action", async () => {
    const deleteTaskMock = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    ) as DeleteTaskAction;

    render(
      <TodoItem
        task={createTask()}
        isHighlighted={false}
        toggleTask={toggleTaskMock}
        deleteTask={deleteTaskMock}
      />,
    );

    const user = userEvent.setup();

    const deleteButton = screen.getByRole("button", { name: /delete task/i });

    await Promise.all([user.click(deleteButton), user.click(deleteButton)]);

    expect(deleteTaskMock).toHaveBeenCalledTimes(1);
  });

  it("navigates to task page", async () => {
    render(
      <TodoItem
        task={createTask()}
        isHighlighted={false}
        toggleTask={toggleTaskMock}
        deleteTask={deleteTaskMock}
      />,
    );

    const user = userEvent.setup();

    const navigateButton = screen.getByRole("button", {
      name: /go to task/i,
    });

    await user.click(navigateButton);

    expect(navigateMock).toHaveBeenCalledWith("/tasks/0");
  });

  it("shows error toast when toggle action fails", async () => {
    const toastErrorSpy = vi.spyOn(toast, "error");

    const toggleTaskMock = vi.fn().mockRejectedValue(new Error("Server Error"));

    render(
      <TodoItem
        task={createTask()}
        isHighlighted={false}
        toggleTask={toggleTaskMock}
        deleteTask={deleteTaskMock}
      />,
    );

    const user = userEvent.setup();

    const checkbox = screen.getByRole("checkbox", {
      name: /toggle task completion/i,
    });

    await user.click(checkbox);

    expect(toastErrorSpy).toHaveBeenCalledWith("Server sync failed");
  });

  it("shows error toast when delete action fails", async () => {
    const toastErrorSpy = vi.spyOn(toast, "error");

    const deleteTaskMock = vi.fn().mockRejectedValue(new Error("Server Error"));

    render(
      <TodoItem
        task={createTask()}
        isHighlighted={false}
        toggleTask={toggleTaskMock}
        deleteTask={deleteTaskMock}
      />,
    );

    const user = userEvent.setup();

    const deleteButton = screen.getByRole("button", { name: /delete task/i });

    await user.click(deleteButton);

    expect(toastErrorSpy).toHaveBeenCalledWith("Server sync failed");
  });

  it("highlights task", async () => {
    const { container } = render(
      <TodoItem
        task={createTask()}
        isHighlighted={true}
        toggleTask={toggleTaskMock}
        deleteTask={deleteTaskMock}
      />,
    );

    const element = container.firstElementChild as HTMLElement;

    expect(element).toHaveClass(styles.highlight);
  });
});
